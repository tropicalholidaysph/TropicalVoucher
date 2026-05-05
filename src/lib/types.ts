export type PaymentMethod = 'Cash' | 'Cheque' | 'Bank Transfer';

export interface Voucher {
  id: string;
  voucherNo: string;
  date: string;
  recipient: string;
  amountRO: number;
  amountBz: number;
  sumInWords: string;
  paymentMethod: PaymentMethod;
  bankName?: string;
  refNo?: string;
  purpose: string;
  createdAt: string;
}
