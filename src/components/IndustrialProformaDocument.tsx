import React from 'react';
import { IndustrialOrder } from '../types';
import { numberToPersianWords } from '../utils/numberToPersianWords';

interface IndustrialProformaDocumentProps {
  order: IndustrialOrder;
  includeVat?: boolean;
  includeStamp?: boolean;
  docRef?: React.RefObject<HTMLDivElement | null>;
  isPrintVersion?: boolean;
}

export const IndustrialProformaDocument: React.FC<IndustrialProformaDocumentProps> = ({
  order,
  includeVat = true,
  includeStamp = true,
  docRef,
  isPrintVersion = false,
}) => {
  // Financial computations
  const subtotal = order.subtotal || 0;
  const discountAmount = Math.round(subtotal * 0.02); // 2% engineering discount
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const vatRate = includeVat ? 0.10 : 0.0;
  const vatAmount = Math.round(discountedSubtotal * vatRate);
  const grandTotal = discountedSubtotal + vatAmount;

  return (
    <div
      ref={docRef}
      id={`proforma-doc-${order.id}`}
      dir="rtl"
      className={`bg-white text-slate-900 font-sans mx-auto ${
        isPrintVersion
          ? 'w-[210mm] min-h-[297mm] p-[10mm] text-[11px]'
          : 'w-full max-w-[820px] p-6 sm:p-8 text-xs shadow-2xl rounded-xl border border-slate-200'
      }`}
      style={{
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        color: '#0f172a',
      }}
    >
      {/* Top Header with Corporate Seal & Invoice Info */}
      <div className="border-b-2 border-slate-800 pb-4 mb-4">
        <div className="flex items-start justify-between gap-4">
          {/* Logo & Company Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-900 text-amber-400 font-bold border border-slate-800 shadow-sm">
              <span className="material-symbols-outlined text-3xl">bolt</span>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                شرکت مهندسی و تدارکات صنعت تابلو پیشرو
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-600 font-medium mt-0.5">
                تامین و مهندسی تخصصی تجهیزات کلیدخانه، تابلوهای توزیع قدرت LV و اتوماسیون صنعتی
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[9px] sm:text-[10px] text-slate-500 font-mono-num mt-1">
                <span>شناسه ملی: ۱۰۱۰۳۵۸۹۴۲۱</span>
                <span>•</span>
                <span>شماره ثبت: ۲۸۹۴۵۰</span>
                <span>•</span>
                <span>کد اقتصادی: ۴۱۱۵۶۳۸۷۹۲۱۴</span>
              </div>
            </div>
          </div>

          {/* Invoice Meta Box */}
          <div className="rounded-lg border-2 border-slate-800 bg-slate-50 p-2.5 sm:p-3 text-left font-mono-num text-[10px] sm:text-xs min-w-[170px] shadow-sm">
            <div className="text-center font-bold text-slate-900 border-b border-slate-300 pb-1 mb-1.5 text-[11px]">
              پیش‌فاکتور رسمی فروش
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500 font-sans">شماره پیش‌فاکتور:</span>
              <span className="font-bold text-slate-900">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500 font-sans">تاریخ صدور:</span>
              <span className="font-semibold text-slate-800">{order.date}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500 font-sans">اعتبار پیش‌فاکتور:</span>
              <span className="text-amber-700 font-bold font-sans">۷۲ ساعت کاری</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500 font-sans">پروژه / تگ تابلو:</span>
              <span className="text-slate-800 font-semibold">{order.tagGroup || 'LV-PANEL'}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 text-center">
          <span className="inline-block rounded bg-slate-900 px-4 py-1 text-xs sm:text-sm font-black text-amber-400 tracking-wider">
            پیش‌فاکتور رسمی و مشخصات فنی تجهیزات تابلوسازی (BOM)
          </span>
        </div>
      </div>

      {/* Seller and Buyer Information Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-[11px]">
        {/* Seller Info */}
        <div className="rounded-lg border border-slate-300 bg-slate-50/70 p-3 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2">
            <span className="material-symbols-outlined text-amber-600 text-sm">store</span>
            <span>مشخصات فروشنده (تامین‌کننده)</span>
          </div>
          <div className="space-y-1 text-slate-700">
            <div>
              <strong className="text-slate-900">فروشنده:</strong> شرکت تدارکات مهندسی صنعت تابلو پیشرو (سهامی خاص)
            </div>
            <div>
              <strong className="text-slate-900">دفتر مرکزی:</strong> تهران، خیابان مطهری، خیابان میرعماد، پلاک ۲۴، واحد ۱۲
            </div>
            <div className="flex items-center justify-between font-mono-num">
              <span>تلفن: ۰۲۱-۸۸۴۲۵۶۹۰</span>
              <span>کد پستی: ۱۵۸۷۶۳۴۵۱۱</span>
            </div>
            <div>
              <strong className="text-slate-900">انبار توزیع:</strong> شمس‌آباد، بلوار نگارستان، کارگاه تخصصی لجستیک
            </div>
          </div>
        </div>

        {/* Buyer Info */}
        <div className="rounded-lg border border-slate-300 bg-slate-50/70 p-3 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2">
            <span className="material-symbols-outlined text-blue-600 text-sm">business</span>
            <span>مشخصات خریدار (کارگاه / متقاضی)</span>
          </div>
          <div className="space-y-1 text-slate-700">
            <div>
              <strong className="text-slate-900">کارگاه / شرکت:</strong> {order.company || 'کارگاه تابلوسازی صنعت برق'}
            </div>
            <div>
              <strong className="text-slate-900">ناظر فنی / تحویل‌گیرنده:</strong> {order.clientName}
            </div>
            <div className="flex items-center justify-between font-mono-num">
              <span>کد نظام مهندسی: {order.engCode}</span>
              <span>تلفن تماس: {order.phone}</span>
            </div>
            <div className="truncate" title={order.address}>
              <strong className="text-slate-900">نشانی تحویل:</strong> {order.address}
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Electrical Switchboard BOM Table */}
      <div className="mb-4 overflow-hidden rounded-lg border border-slate-300">
        <table className="w-full text-right text-[10px] sm:text-[11px] border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-bold border-b border-slate-400">
              <th className="p-2 text-center w-8">#</th>
              <th className="p-2 w-24 font-mono-num">کد فنی (SKU)</th>
              <th className="p-2">شرح تجهیز، برند و مشخصات فنی استاندارد</th>
              <th className="p-2 text-center w-14">واحد</th>
              <th className="p-2 text-center w-12 font-mono-num">تعداد</th>
              <th className="p-2 text-left w-24 font-mono-num">مبلغ واحد (تومان)</th>
              <th className="p-2 text-left w-28 font-mono-num">مبلغ کل (تومان)</th>
              <th className="p-2 text-center w-20">وضعیت انبار</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {order.items.map((item, idx) => {
              const itemTotal = item.unitPrice * item.quantity;
              return (
                <tr key={item.product.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="p-2 text-center font-mono-num text-slate-500 font-semibold">
                    {idx + 1}
                  </td>
                  <td className="p-2 font-mono-num text-slate-700 font-bold text-[10px]">
                    {item.product.sku}
                  </td>
                  <td className="p-2">
                    <div className="font-bold text-slate-900">{item.product.name}</div>
                    <div className="text-[9px] text-slate-600 mt-0.5 flex flex-wrap gap-2">
                      <span className="font-bold text-amber-800">برند: {item.product.brand}</span>
                      <span>•</span>
                      <span>جریان نامی: {item.product.ratingAmps}A</span>
                      <span>•</span>
                      <span>قدرت قطع: {item.product.breakingCapacityKa}kA</span>
                      <span>•</span>
                      <span>پل: {item.product.poles}</span>
                      <span>•</span>
                      <span>استاندارد: {item.product.complianceStd}</span>
                    </div>
                  </td>
                  <td className="p-2 text-center text-slate-700">عدد</td>
                  <td className="p-2 text-center font-mono-num font-bold text-slate-900">
                    {item.quantity}
                  </td>
                  <td className="p-2 text-left font-mono-num text-slate-800">
                    {item.unitPrice > 0 ? item.unitPrice.toLocaleString('fa-IR') : 'استعلام روز'}
                  </td>
                  <td className="p-2 text-left font-mono-num font-bold text-slate-900">
                    {itemTotal > 0 ? itemTotal.toLocaleString('fa-IR') : 'استعلام'}
                  </td>
                  <td className="p-2 text-center text-[9px]">
                    <span className="rounded bg-emerald-100 text-emerald-800 font-medium px-1.5 py-0.5 border border-emerald-300">
                      {item.statusLabel || (item.product.inStock ? 'انبار شمس‌آباد' : 'تامین فوری')}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Financial Breakdown & In-Words Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4 text-[11px]">
        {/* Left/Middle: Amount in Words & Notes */}
        <div className="sm:col-span-7 flex flex-col justify-between rounded-lg border border-slate-300 bg-slate-50/60 p-3 space-y-3">
          <div>
            <div className="text-slate-500 text-[10px] font-bold mb-1">مبلغ کل قابل پرداخت به حروف:</div>
            <div className="rounded border border-amber-300 bg-amber-50 p-2 font-bold text-slate-900 leading-normal">
              {numberToPersianWords(grandTotal)}
            </div>
          </div>

          {order.engineerNote && (
            <div className="rounded border border-slate-200 bg-white p-2 text-[10px] text-slate-700 leading-relaxed">
              <strong className="text-slate-900">یادداشت فنی و الزامات مهندسی متقاضی: </strong>
              {order.engineerNote}
            </div>
          )}

          <div className="text-[9px] text-slate-500 font-mono-num">
            شماره حساب بانکی و شبا تایید شده: IR28 0120 0000 0000 9842 1056 22 (بانک ملت - شعبه میرعماد)
          </div>
        </div>

        {/* Right: Totals Calculation Box */}
        <div className="sm:col-span-5 rounded-lg border border-slate-300 bg-white overflow-hidden">
          <table className="w-full text-[11px] font-mono-num border-collapse">
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2 text-slate-600 font-sans">جمع ناخالص اقلام (تومان):</td>
                <td className="p-2 text-left font-bold text-slate-900">
                  {subtotal.toLocaleString('fa-IR')}
                </td>
              </tr>
              <tr>
                <td className="p-2 text-slate-600 font-sans">تخفیف همکاری تابلوسازی (۲٪):</td>
                <td className="p-2 text-left text-red-600 font-semibold">
                  {discountAmount > 0 ? `- ${discountAmount.toLocaleString('fa-IR')}` : '۰'}
                </td>
              </tr>
              <tr>
                <td className="p-2 text-slate-600 font-sans">خالص پس از کسر تخفیف:</td>
                <td className="p-2 text-left font-semibold text-slate-800">
                  {discountedSubtotal.toLocaleString('fa-IR')}
                </td>
              </tr>
              {includeVat && (
                <tr>
                  <td className="p-2 text-slate-600 font-sans">مالیات بر ارزش افزوده (۱۰٪):</td>
                  <td className="p-2 text-left font-semibold text-slate-800">
                    {vatAmount.toLocaleString('fa-IR')}
                  </td>
                </tr>
              )}
              <tr className="bg-slate-900 text-white font-bold text-xs">
                <td className="p-2.5 font-sans text-amber-300">مبلغ نهایی پیش‌فاکتور (تومان):</td>
                <td className="p-2.5 text-left text-amber-400 font-mono-num text-sm">
                  {grandTotal.toLocaleString('fa-IR')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Legal & Technical Terms */}
      <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-[9px] sm:text-[10px] text-slate-600 leading-relaxed space-y-1">
        <div className="font-bold text-slate-900 text-[10px] mb-0.5">شرایط و مقررات فنی و ضمانت رسمی:</div>
        <div>۱. کلیه تجهیزات دارای ضمانت اصالت فیزیکی، سرتیفیکیت معتبر تایپ‌تست بین‌المللی و ۲۴ ماه گارانتی تعویض شرکتی می‌باشند.</div>
        <div>۲. به دلیل نوسانات نرخ مس، شینه‌ها و ارز، قیمت‌های مندرج در این پیش‌فاکتور حداکثر تا ۷۲ ساعت پس از صدور معتبر و قابل تایید می‌باشد.</div>
        <div>۳. بسته‌بندی بر روی پالت‌های چوبی ضد رطوبت همراه با فوم محافظ و لیبل بارکد خوان انجام خواهد شد.</div>
        <div>۴. تحویل بار در محل کارگاه تابلوسازی و با نظارت نماینده فنی تعیین شده صورت می‌پذیرد.</div>
      </div>

      {/* Signatures & Corporate Stamps Section */}
      <div className="pt-2 border-t-2 border-slate-800">
        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
          {/* Buyer Signature */}
          <div className="rounded border border-slate-300 p-2 min-h-[95px] flex flex-col justify-between">
            <span className="font-bold text-slate-800">مهر و امضای تایید خریدار / ناظر فنی</span>
            <div className="text-[9px] text-slate-500 font-mono-num">
              {order.clientName} ({order.engCode})
            </div>
            <div className="h-8 border-b border-dashed border-slate-300"></div>
          </div>

          {/* Technical Approver */}
          <div className="rounded border border-slate-300 p-2 min-h-[95px] flex flex-col justify-between">
            <span className="font-bold text-slate-800">مهندسی فنی و کنترل کیفی تابلو</span>
            <div className="text-[9px] text-slate-500">واحد تطابق با استاندارد IEC</div>
            <div className="h-8 flex items-center justify-center">
              <span className="text-emerald-700 font-bold text-[10px] border border-emerald-500 rounded px-2 py-0.5 bg-emerald-50">
                تطابق فنی تایید شد ✓
              </span>
            </div>
          </div>

          {/* Commercial / Accounting Stamp */}
          <div className="relative rounded border border-slate-300 p-2 min-h-[95px] flex flex-col justify-between overflow-hidden">
            <span className="font-bold text-slate-800">مهر و امضای حسابداری و امور مالی</span>
            
            {/* Stamp simulation */}
            {includeStamp && (
              <div className="my-auto flex justify-center">
                <div className="transform -rotate-6 border-2 border-red-700 rounded-full px-3 py-1 text-[9px] font-black text-red-700 uppercase tracking-widest bg-red-50/50 shadow-sm border-dashed">
                  <div>شرکت صنعت تابلو پیشرو</div>
                  <div className="text-[8px] text-red-600">امور مالی و صدور اسناد رسمی</div>
                </div>
              </div>
            )}

            <div className="text-[8px] text-slate-400 font-mono-num text-left">
              REF-{order.orderNumber.slice(-6)}
            </div>
          </div>
        </div>

        {/* Proforma Bottom Verification Barcode */}
        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2 text-[9px] text-slate-500 font-mono-num">
          <div>سامانه الکترو کاتالوگ مهندسی تابلو برق • نسخه چاپی سند الکترونیکی</div>
          <div className="flex items-center gap-1 text-slate-700 font-bold">
            <span className="material-symbols-outlined text-xs">qr_code_2</span>
            <span>استعلام اصالت: electro-catalog.ir/verify/{order.orderNumber}</span>
          </div>
          <div>صفحه ۱ از ۱</div>
        </div>
      </div>
    </div>
  );
};
