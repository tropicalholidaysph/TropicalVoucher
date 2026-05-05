"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Voucher } from "@/lib/types";
import { Search, Download, Eye, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";

interface VoucherTableProps {
  vouchers: Voucher[];
}

export function VoucherTable({ vouchers }: VoucherTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVouchers = vouchers.filter((v) => 
    v.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ["Voucher No", "Date", "Recipient", "Amount (RO)", "Amount (Bz)", "Method", "Bank", "Ref", "Purpose"];
    const rows = filteredVouchers.map(v => [
      v.voucherNo,
      v.date,
      v.recipient,
      v.amountRO,
      v.amountBz,
      v.paymentMethod,
      v.bankName || "",
      v.refNo || "",
      v.purpose
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tropical_ledger_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search vouchers, recipients, purpose..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={exportToCSV} className="flex-1 sm:flex-none flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[100px]">No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Paid To</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead className="text-right">Amount (RO)</TableHead>
              <TableHead className="text-right">Amount (Bz)</TableHead>
              <TableHead className="text-center no-print">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVouchers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No vouchers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredVouchers.map((v) => (
                <TableRow key={v.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono font-medium">{v.voucherNo}</TableCell>
                  <TableCell>{format(new Date(v.date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="font-medium">{v.recipient}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{v.purpose}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    {v.amountRO.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium text-muted-foreground">
                    {v.amountBz.toString().padStart(3, '0')}
                  </TableCell>
                  <TableCell className="text-center no-print">
                    <Link href={`/vouchers/${v.id}`}>
                      <Button variant="ghost" size="icon" className="hover:text-primary">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
