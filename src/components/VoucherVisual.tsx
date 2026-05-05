
"use client";

import Image from "next/image";
import { Voucher } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface VoucherVisualProps {
  voucher: Voucher;
}

export function VoucherVisual({ voucher }: VoucherVisualProps) {
  return (
    <div className={cn(
      "w-full max-w-[850px] mx-auto bg-[#FEF9E7] p-8 sm:p-12 border border-neutral-300 shadow-xl font-serif text-[#2c3e50] relative overflow-hidden print:shadow-none print:border-none",
      voucher.isVoid && "opacity-50 grayscale"
    )}>
      {/* Decorative Border */}
      <div className="absolute inset-4 border border-[#d4af37]/20 pointer-events-none" />

      {/* Header Section */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="text-[10px] leading-tight space-y-0.5 w-1/3">
          <p>C.R.: 1209991</p>
          <p>P.O. Box: 821</p>
          <p>Postal Code: 130</p>
          <p>Sultanate of Oman</p>
          <p>GSM: 95304077</p>
          <p>Office: 24616541 / 2</p>
        </div>

        <div className="flex flex-col items-center justify-center w-1/3">
          <div className="relative w-28 h-24 mb-2">
            <Image 
              src="/logo.png" 
              alt="Tropical Holidays Logo" 
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#E66E38] tracking-tight">الاستوائية للعطلات</h1>
            <h1 className="text-xl font-bold text-[#E66E38] tracking-widest uppercase -mt-1">TROPICAL HOLIDAYS</h1>
            <p className="text-[9px] italic text-muted-foreground">Dream. Explore. Discover.</p>
            <p className="text-[10px] font-mono mt-1">E-mail : info@tropicalholidays.om</p>
          </div>
        </div>

        <div className="text-[10px] leading-tight space-y-0.5 w-1/3 text-right" dir="rtl">
          <p>س.ت : ١٢٠٩٩٩١</p>
          <p>ص.ب : ٨٢١</p>
          <p>الرمز البريدي : ١٣٠</p>
          <p>سلطنة عمان</p>
          <p>نقال : ١٢٠٩٩٩١</p>
          <p>المكتب : ٢٤٦١٦٥٤١/٢</p>
        </div>
      </div>

      {/* Title & Number Bar */}
      <div className="flex justify-between items-center mb-10 relative z-10 border-t border-b border-[#d4af37]/30 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#DB0D3A]">No.</span>
          <span className="text-3xl font-black text-[#DB0D3A] tracking-tighter font-mono bg-white/50 px-2 rounded">
            {voucher.voucherNo.padStart(4, '0')}
          </span>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold border-b-2 border-[#E66E38] inline-block px-6 pb-1">سند صرف</h2>
          <h3 className="text-sm font-bold tracking-widest uppercase mt-1">PAYMENT VOUCHER</h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold whitespace-nowrap">Date :</span>
          <div className="border-b-2 border-dashed border-neutral-800 px-4 min-w-[140px] text-center font-mono text-lg font-bold">
             {voucher.date ? format(new Date(voucher.date), 'dd - MM - yyyy') : '-- - -- - ----'}
          </div>
          <span className="text-xs font-bold whitespace-nowrap">التاريخ :</span>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8 relative z-10">
        
        {/* Amount Box */}
        <div className="flex items-start">
          <div className="border-2 border-neutral-800 w-[240px] bg-white">
            <div className="grid grid-cols-2 text-center border-b-2 border-neutral-800 bg-neutral-100">
              <span className="text-[10px] font-bold py-1">ريال عماني R.O.</span>
              <span className="text-[10px] font-bold py-1 border-l-2 border-neutral-800">بيسة Bz.</span>
            </div>
            <div className="grid grid-cols-2 text-center items-center h-14">
              <span className="text-3xl font-black">{voucher.isVoid ? "0" : voucher.amountRO.toLocaleString()}</span>
              <span className="text-3xl font-black border-l-2 border-neutral-800">{voucher.isVoid ? "000" : voucher.amountBz.toString().padStart(3, '0')}</span>
            </div>
          </div>
        </div>

        {/* Paid To Section */}
        <div className="grid grid-cols-[140px_1fr_140px] items-end gap-3 w-full">
          <span className="text-sm font-bold whitespace-nowrap">Paid to Mr./M/s.</span>
          <div className="border-b-2 border-dotted border-neutral-500 pb-1 px-4 text-2xl font-black italic text-[#E66E38] truncate">
            {voucher.recipient}
          </div>
          <span className="text-sm font-bold text-right whitespace-nowrap">صرفنا إلى الفاضل / الأفاضل</span>
        </div>

        {/* Sum In Words Section */}
        <div className="grid grid-cols-[160px_1fr_140px] items-end gap-3 w-full">
          <span className="text-sm font-bold whitespace-nowrap">The sum of Rial Omani</span>
          <div className="border-b-2 border-dotted border-neutral-500 pb-1 px-4 text-lg italic font-semibold text-neutral-800">
            {voucher.sumInWords}
          </div>
          <span className="text-sm font-bold text-right whitespace-nowrap">مبلغ وقدره ريال عماني</span>
        </div>

        {/* Payment Method Section */}
        <div className="grid grid-cols-[160px_1fr_140px] items-end gap-3 w-full">
          <span className="text-sm font-bold whitespace-nowrap">By Cash / Cheque No.</span>
          <div className="border-b-2 border-dotted border-neutral-500 pb-1 px-4 font-mono font-bold text-lg">
            {voucher.paymentMethod === 'Cash' ? 'CASH' : (voucher.refNo || '-')}
          </div>
          <span className="text-sm font-bold text-right whitespace-nowrap">نقداً / شيك رقم</span>
        </div>

        {/* Bank & Date Section */}
        <div className="grid grid-cols-[80px_1fr_60px_60px_150px_60px] items-end gap-2 w-full">
          <span className="text-sm font-bold">Bank</span>
          <div className="border-b-2 border-dotted border-neutral-500 pb-1 px-4 italic font-bold">
            {voucher.bankName || '-'}
          </div>
          <span className="text-sm font-bold text-right">على بنك</span>
          <span className="text-sm font-bold text-center">Dated</span>
          <div className="border-b-2 border-dotted border-neutral-500 pb-1 text-center font-mono font-bold text-lg">
             {voucher.refNo && voucher.date ? format(new Date(voucher.date), 'dd/MM/yyyy') : '-'}
          </div>
          <span className="text-sm font-bold text-right">بتاريخ</span>
        </div>

        {/* Purpose Section */}
        <div className="grid grid-cols-[80px_1fr_80px] items-start gap-3 w-full pt-2">
          <span className="text-sm font-bold mt-2">Being</span>
          <div className="border-b-2 border-dotted border-neutral-500 min-h-[80px] px-4 py-2 text-xl font-medium leading-relaxed bg-white/30 rounded">
            {voucher.purpose}
          </div>
          <span className="text-sm font-bold text-right mt-2">وذلك عن</span>
        </div>
      </div>

      {/* Signature Section */}
      <div className="grid grid-cols-2 gap-32 mt-20 relative z-10 px-4 pb-4">
        <div className="flex flex-col gap-4">
          <div className="flex-1 border-b-2 border-neutral-800 h-10" />
          <div className="flex justify-between">
            <span className="text-[12px] font-bold">Receiver's Signature</span>
            <span className="text-[12px] font-bold">توقيع المستلم</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex-1 border-b-2 border-neutral-800 h-10" />
          <div className="flex justify-between">
            <span className="text-[12px] font-bold">Signature</span>
            <span className="text-[12px] font-bold">التوقيع</span>
          </div>
        </div>
      </div>
      
      {/* Background Watermark */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-[0.03] pointer-events-none select-none">
        <h4 className="text-6xl font-black uppercase whitespace-nowrap tracking-widest">Tropical Holidays</h4>
      </div>

      {/* VOID Overlay if applicable */}
      {voucher.isVoid && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="border-8 border-red-500/30 text-red-500/30 text-9xl font-black rotate-[-30deg] uppercase px-10 py-4">
            VOID
          </div>
        </div>
      )}
    </div>
  );
}

