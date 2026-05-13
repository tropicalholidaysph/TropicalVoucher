"use client";

import { supabase } from "@/lib/supabase";
import { Voucher, Ledger, PaymentMethod } from "./types";
import { UserRole } from "./role-context";

// --- Helper Actions ---

async function getRole(uid: string): Promise<UserRole | null> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", uid)
    .single();

  if (error || !data) return null;
  return data.role as UserRole;
}

async function logActivity(action: string, detail: string, uid: string, role: string) {
  await supabase.from("activity_logs").insert({
    action,
    detail,
    uid,
    role,
    timestamp: new Date().toISOString(),
  });
}

// --- Transformation Helpers ---

function transformVoucherToSupabase(v: Omit<Voucher, 'id' | 'createdAt'>) {
  return {
    sequence_number: parseInt(v.voucherNo),
    voucher_date: v.date,
    recipient: v.recipient,
    amount: v.amountRO + (v.amountBz / 1000),
    payment_method: v.paymentMethod,
    bank_name: v.bankName,
    ref_no: v.refNo,
    purpose: v.purpose,
    ledger_id: v.ledgerId,
    status: v.isVoid ? 'void' : 'active',
  };
}

function transformSupabaseToVoucher(sv: any): Voucher {
  const amountRO = Math.floor(sv.amount);
  const amountBz = Math.round((sv.amount - amountRO) * 1000);

  return {
    id: sv.id,
    voucherNo: sv.sequence_number.toString(),
    date: sv.voucher_date || sv.created_at.split('T')[0],
    recipient: sv.recipient || '',
    amountRO,
    amountBz,
    sumInWords: '', // Regenerate in UI if needed
    paymentMethod: (sv.payment_method as PaymentMethod) || 'Cash',
    bankName: sv.bank_name || undefined,
    refNo: sv.ref_no || undefined,
    purpose: sv.purpose || '',
    ledgerId: sv.ledger_id || '',
    createdAt: sv.created_at,
    updatedAt: sv.updated_at,
    isVoid: sv.status === 'void'
  };
}

// --- Ledger Actions ---

export async function getLedgers(): Promise<Ledger[]> {
  const { data, error } = await supabase
    .from("ledgers")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data.map(d => ({
    id: d.id,
    name: d.name,
    createdAt: d.created_at
  }));
}

export async function createLedger(name: string, _db: any, uid: string): Promise<Ledger | null> {
  const role = await getRole(uid);
  if (role !== 'admin') {
    throw new Error("Unauthorized: Only admins can create ledgers");
  }

  const { data, error } = await supabase
    .from("ledgers")
    .insert({ name })
    .select()
    .single();

  if (error) throw error;

  const ledger = {
    id: data.id,
    name: data.name,
    createdAt: data.created_at
  };

  await logActivity("CREATE_LEDGER", `Sheet: ${name}`, uid, role!);

  return ledger;
}

export async function renameLedger(id: string, newName: string, uid: string) {
  const role = await getRole(uid);
  if (role !== 'admin') throw new Error("Unauthorized");

  const { error } = await supabase
    .from("ledgers")
    .update({ name: newName })
    .eq("id", id);

  if (error) throw error;
  await logActivity("RENAME_LEDGER", `ID: ${id} -> ${newName}`, uid, role!);
}

export async function deleteLedger(id: string, uid: string) {
  const role = await getRole(uid);
  if (role !== 'admin') throw new Error("Unauthorized");

  // 1. Delete all vouchers associated with this ledger (Supabase should handle this if cascade is set, but doing it manually for safety)
  await supabase.from("vouchers").delete().eq("ledger_id", id);

  // 2. Delete the ledger
  const { error } = await supabase.from("ledgers").delete().eq("id", id);

  if (error) throw error;
  await logActivity("DELETE_LEDGER", `ID: ${id} and all its vouchers`, uid, role!);
}

export async function getNextVoucherNumber(ledgerId: string): Promise<number> {
  const { data, error } = await supabase
    .from("vouchers")
    .select("sequence_number")
    .eq("ledger_id", ledgerId)
    .order("sequence_number", { ascending: false })
    .limit(1);

  if (error) return 1;
  if (!data || data.length === 0) return 1;

  return (data[0].sequence_number || 0) + 1;
}

// --- Voucher Actions ---

export async function bulkImportVouchers(vouchers: Omit<Voucher, 'id' | 'createdAt'>[], uid: string) {
  const role = await getRole(uid);
  if (!role) throw new Error("Unauthorized");

  const supabaseVouchers = vouchers.map(v => transformVoucherToSupabase(v));

  const { error } = await supabase.from("vouchers").insert(supabaseVouchers);
  if (error) throw error;

  await logActivity("BULK_IMPORT", `Imported ${vouchers.length} vouchers`, uid, role);
  return { success: true, count: vouchers.length };
}

export async function bulkDeleteVouchers(ids: string[], uid: string) {
  const role = await getRole(uid);
  if (role !== 'admin') throw new Error("Unauthorized");

  const { error } = await supabase.from("vouchers").delete().in("id", ids);
  if (error) throw error;

  await logActivity("BULK_DELETE", `Deleted ${ids.length} vouchers`, uid, role);
  return { success: true };
}

export async function createVoucher(voucher: Omit<Voucher, 'id' | 'createdAt'>, _db: any, uid: string) {
  const role = await getRole(uid);
  if (role !== 'admin' && role !== 'employee') throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("vouchers")
    .insert(transformVoucherToSupabase(voucher))
    .select()
    .single();

  if (error) throw error;

  await logActivity("CREATE_VOUCHER", `Voucher #${voucher.voucherNo} for ${voucher.recipient}`, uid, role!);
  return { success: true, id: data.id };
}

export async function updateVoucher(id: string, voucherData: Partial<Voucher>, _db: any, uid: string) {
  const role = await getRole(uid);
  if (role !== 'admin' && role !== 'employee') throw new Error("Unauthorized");

  const updatePayload: any = {};
  if (voucherData.voucherNo) updatePayload.sequence_number = parseInt(voucherData.voucherNo);
  if (voucherData.date) updatePayload.voucher_date = voucherData.date;
  if (voucherData.recipient) updatePayload.recipient = voucherData.recipient;
  if (voucherData.amountRO !== undefined || voucherData.amountBz !== undefined) {
    // Need current values if only one is provided? For simplicity assuming both or partial update handles it
    // Actually, in Partial<Voucher>, we might only have one.
    // Let's fetch current or just use what's given.
    const { data: current } = await supabase.from("vouchers").select("amount").eq("id", id).single();
    const currentRO = Math.floor(current?.amount || 0);
    const currentBz = Math.round(((current?.amount || 0) - currentRO) * 1000);
    const ro = voucherData.amountRO !== undefined ? voucherData.amountRO : currentRO;
    const bz = voucherData.amountBz !== undefined ? voucherData.amountBz : currentBz;
    updatePayload.amount = ro + (bz / 1000);
  }
  if (voucherData.paymentMethod) updatePayload.payment_method = voucherData.paymentMethod;
  if (voucherData.bankName) updatePayload.bank_name = voucherData.bankName;
  if (voucherData.refNo) updatePayload.ref_no = voucherData.refNo;
  if (voucherData.purpose) updatePayload.purpose = voucherData.purpose;
  if (voucherData.ledgerId) updatePayload.ledger_id = voucherData.ledgerId;
  if (voucherData.isVoid !== undefined) updatePayload.status = voucherData.isVoid ? 'void' : 'active';

  updatePayload.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("vouchers")
    .update(updatePayload)
    .eq("id", id);

  if (error) throw error;
  await logActivity("EDIT_VOUCHER", `Voucher ID: ${id}`, uid, role!);
  return { success: true };
}

export async function getVoucherById(id: string): Promise<Voucher | null> {
  const { data, error } = await supabase
    .from("vouchers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return transformSupabaseToVoucher(data);
}

export async function voidVoucher(id: string, uid: string) {
  const role = await getRole(uid);
  if (role !== 'admin' && role !== 'employee') throw new Error("Unauthorized");

  const { error } = await supabase
    .from("vouchers")
    .update({
      status: 'void',
      recipient: "VOID / NO DATA",
      amount: 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  await logActivity("VOID_VOUCHER", `Voucher ID: ${id}`, uid, role!);
}
