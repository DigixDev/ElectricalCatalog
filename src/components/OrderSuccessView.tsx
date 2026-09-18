import React, { useState, useRef } from 'react';
import { IndustrialOrder, EquipmentProduct } from '../types';
import { IndustrialProformaModal } from './IndustrialProformaModal';
import { IndustrialProformaDocument } from './IndustrialProformaDocument';
import { OrderVerticalTimeline } from './OrderVerticalTimeline';
import { LiveWarehouseStockWidget } from './LiveWarehouseStockWidget';
import { OrderCommercialChatWidget } from './OrderCommercialChatWidget';
import { generateProformaPdf } from '../utils/pdfExport';

interface OrderSuccessViewProps {
  order: IndustrialOrder;
  onViewAllOrders: () => void;
  onBackToCatalog: () => void;
  onReplaceOrderItem?: (originalProductId: string, replacementProduct: EquipmentProduct) => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({
  order,
  onViewAllOrders,
  onBackToCatalog,
  onReplaceOrderItem,
}) => {
  const [isProformaModalOpen, setIsProformaModalOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfNotification, setPdfNotification] = useState<string | null>(null);

  const hiddenProformaRef = useRef<HTMLDivElement>(null);

  const steps = [
    { num: 1, label: 'در انتظار بررسی فنی', desc: 'واحد تدارکات و انبار', active: order.currentStep >= 1, current: order.currentStep === 1 },
    { num: 2, label: 'تایید فنی و مالی', desc: 'صدور پیش‌فاکتور نهایی', active: order.currentStep >= 2, current: order.currentStep === 2 },
    { num: 3, label: 'تجهیز و بسته‌بندی پالت', desc: 'کنترل کیفی کارگاهی', active: order.currentStep >= 3, current: order.currentStep === 3 },
    { num: 4, label: 'آماده تحویل و بارگیری', desc: 'صدور بارنامه رسمی', active: order.currentStep >= 4, current: order.currentStep === 4 },
    { num: 5, label: 'تحویل قطعی در کارگاه', desc: 'تطابق با ناظر فنی', active: order.currentStep >= 5, current: order.currentStep === 5 },
  ];

  const handleDirectDownloadPdf = async () => {
    if (!hiddenProformaRef.current) return;
    try {
      setIsDownloadingPdf(true);
      setPdfNotification('در حال آماده‌سازی و رندر پیش‌فاکتور استاندارد صنعتی (PDF)...');

      const fileName = `پیش_فاکتور_${order.orderNumber}.pdf`;
      await generateProformaPdf(hiddenProformaRef.current, {
        fileName,
        onProgress: (status) => setPdfNotification(status),
      });

      setPdfNotification('پیش‌فاکتور با فرمت PDF با موفقیت دانلود شد.');
      setTimeout(() => {
        setPdfNotification(null);
        setIsDownloadingPdf(false);
      }, 2500);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setPdfNotification('خطا در صدور مستقیم PDF. باز کردن در حالت پیش‌نمایش جهت چاپ یا ذخیره...');
      setTimeout(() => {
        setPdfNotification(null);
        setIsDownloadingPdf(false);
        setIsProformaModalOpen(true);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1326] pb-24 text-[#dae2fd]">
      {/* Toast Notification Alert */}
      {pdfNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-[#ffc174]/70 bg-[#171f33] px-5 py-3.5 text-xs font-bold text-white shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-[#ffc174] text-lg animate-pulse">
            picture_as_pdf
          </span>
          <span>{pdfNotification}</span>
        </div>
      )}

      {/* Hidden container used for high-fidelity offscreen PDF generation */}
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '820px',
          visibility: 'visible',
          pointerEvents: 'none',
        }}
      >
        <IndustrialProformaDocument
          order={order}
          includeVat={true}
          includeStamp={true}
          docRef={hiddenProformaRef}
        />
      </div>

      {/* Interactive Modal for Previewing & Customizing Proforma */}
      <IndustrialProformaModal
        order={order}
        isOpen={isProformaModalOpen}
        onClose={() => setIsProformaModalOpen(false)}
      />

      {/* Top Banner with Animated Beacon */}
      <section className="border-b border-[#2d3449] bg-gradient-to-b from-[#131b2e] to-[#0b1326] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Beacon Icon */}
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 pulse-amber"></div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-black shadow-lg shadow-emerald-500/30">
              <span className="material-symbols-outlined text-3xl font-bold">check_circle</span>
            </div>
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white">
            سفارش فنی با موفقیت در مدار بررسی قرار گرفت
          </h1>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 font-mono-num text-xs">
            <span className="text-[#a08e7a]">کد پیگیری در سامانه جامع تدارکات:</span>
            <span className="rounded bg-[#ffc174]/20 px-2.5 py-0.5 font-bold text-[#ffc174] border border-[#ffc174]/40">
              {order.orderNumber}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-[#a08e7a]">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              ارتباط با ERP فعال شد
            </span>
            <span>•</span>
            <span className="font-mono-num">ثبت در سامانه: {order.date} - {order.time}</span>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
        {/* 2FA Technical Management Verification Ribbon */}
        {order.twoFactorVerified && (
          <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-[#131b2e] to-emerald-950/30 p-4 sm:p-5 text-xs shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-md">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-white text-sm">
                    تاییدیه امنیتی دومرحله‌ای (2FA) مدیریت فنی کارگاه
                  </span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono-num text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    {order.twoFactorMethod === 'code' ? 'تایید با کد یکبار مصرف (OTP)' : 'امضای الکترونیکی ایمیل مدیریت'}
                  </span>
                </div>
                <p className="text-[11px] text-[#d8c3ad] mt-1">
                  تایید و امضا شده توسط: <strong className="text-white">{order.twoFactorApprover}</strong>
                  {order.twoFactorTimestamp && (
                    <span className="text-[#a08e7a]"> • در تاریخ {order.twoFactorTimestamp}</span>
                  )}
                </p>
              </div>
            </div>

            {order.twoFactorToken && (
              <div className="shrink-0 rounded-xl bg-[#0b1326] p-2.5 text-right sm:text-left border border-[#222a3d] font-mono-num text-[11px]">
                <div className="text-[10px] text-[#a08e7a]">شناسه توکن امنیتی 2FA:</div>
                <div className="text-[#ffc174] font-bold">{order.twoFactorToken}</div>
              </div>
            )}
          </div>
        )}

        {/* Dedicated Industrial Proforma Download Card */}
        <div className="rounded-2xl border-2 border-[#ffc174]/30 bg-gradient-to-r from-[#171f33] via-[#1a233a] to-[#171f33] p-6 shadow-xl shadow-black/40 relative overflow-hidden">
          <div className="absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-[#ffc174]/5 blur-2xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ffc174]/15 text-[#ffc174] border border-[#ffc174]/30 shadow-inner">
                <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#ffc174]/20 px-2 py-0.5 text-[10px] font-bold text-[#ffc174] border border-[#ffc174]/40">
                    فرمت رسمی A4 صنعتی
                  </span>
                  <span className="font-mono-num text-[11px] text-[#a08e7a]">
                    PROFORMA INVOICE PDF
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white mt-1">
                  دریافت پیش‌فاکتور استاندارد صنعتی تابلو برق
                </h2>
                <p className="text-xs text-[#d8c3ad] leading-relaxed mt-1 max-w-xl">
                  سند معتبر با سربرگ شرکتی، شناسه ملی و کد اقتصادی، جدول تفکیکی مشخصات تجهیزات،
                  مهر رسمی امور مالی، محاسبات مالیات بر ارزش افزوده و بارکد استعلام رهگیری.
                </p>
              </div>
            </div>

            {/* Proforma Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setIsProformaModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-[#2d3449] bg-[#131b2e] px-4 py-2.5 text-xs font-bold text-[#dae2fd] hover:border-[#ffc174] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-base">visibility</span>
                <span>پیش‌نمایش سند</span>
              </button>

              <button
                onClick={handleDirectDownloadPdf}
                disabled={isDownloadingPdf}
                className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ffc174] to-[#f59e0b] px-5 py-2.5 text-xs font-extrabold text-[#472a00] hover:from-[#ffb95f] hover:to-[#d97706] transition-all shadow-lg shadow-[#ffc174]/20 active:scale-98 ${
                  isDownloadingPdf ? 'opacity-70 cursor-wait' : ''
                }`}
              >
                {isDownloadingPdf ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">
                      progress_activity
                    </span>
                    <span>در حال تولید PDF...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">download</span>
                    <span>دانلود پیش‌فاکتور (PDF)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 5-Step Operational Stepper (from HTML 1) */}
        <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#222a3d] pb-3 mb-6">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffc174]">timeline</span>
              <span>فرایند عملیاتی پیگیری سفارش صنعتی</span>
            </h3>
            <span className="rounded bg-[#131b2e] px-2 py-0.5 font-mono-num text-[11px] text-[#ffc174] border border-[#2d3449]">
              SLA: ظرف حداکثر ۲ ساعت کاری
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {steps.map((s) => (
              <div
                key={s.num}
                className={`relative flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                  s.current
                    ? 'border-[#ffc174] bg-[#ffc174]/10 shadow-md'
                    : s.active
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-[#222a3d] bg-[#131b2e]/50 opacity-60'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-mono-num text-xs font-bold mb-2 ${
                    s.current
                      ? 'bg-[#ffc174] text-[#472a00]'
                      : s.active
                      ? 'bg-emerald-500 text-black'
                      : 'bg-[#222a3d] text-[#a08e7a]'
                  }`}
                >
                  {s.active && !s.current ? (
                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                  ) : (
                    s.num
                  )}
                </div>
                <h4 className="font-bold text-xs text-white">{s.label}</h4>
                <p className="text-[10px] text-[#a08e7a] mt-0.5">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Vertical History Timeline for the Engineer */}
        <OrderVerticalTimeline order={order} />

        {/* Official Proforma Invoice Details Table */}
        <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] overflow-hidden shadow-xl">
          <div className="border-b border-[#222a3d] bg-[#131b2e] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="font-mono-num text-xs text-[#ffc174]">PROFORMA INVOICE DETAILS</span>
                <h3 className="text-base font-bold text-white mt-1">
                  پیش‌فاکتور رسمی و جدول اقلام تجهیزات تابلو
                </h3>
              </div>

              <div className="text-left font-mono-num text-xs text-[#a08e7a]">
                <div>کد کارگاه: <span className="text-white font-bold">{order.engCode}</span></div>
                <div>متقاضی: <span className="text-white font-bold">{order.clientName}</span></div>
              </div>
            </div>

            {/* Delivery address banner */}
            <div className="mt-4 rounded-xl bg-[#0b1326] p-3 text-xs border border-[#222a3d] text-[#d8c3ad] leading-relaxed">
              <strong className="text-white">نشانی کارگاه تحویل بار:</strong> {order.address}
            </div>

            {/* Live Tehran Central Warehouse Integration Bar */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-4 py-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-white">
                  اتصال زنده به سیستم انبارداری مرکزی تهران (شمس‌آباد و لاله زار)
                </span>
                <span className="text-[11px] text-[#a08e7a]">
                  — وضعیت لحظه‌ای موجودی فیزیکی و امکان پیشنهاد قطعات جایگزین معادل
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-[#a08e7a] font-mono-num">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  موجود آماده تخصیص
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  موجودی محدود / نیازمند جایگزین
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="border-b border-[#222a3d] bg-[#131b2e]/60 text-[#a08e7a]">
                <tr>
                  <th className="p-3.5 font-bold">#</th>
                  <th className="p-3.5 font-bold">شرح تجهیز و مشخصات فنی</th>
                  <th className="p-3.5 font-bold text-center">تعداد درخواستی</th>
                  <th className="p-3.5 font-bold text-left">مبلغ واحد</th>
                  <th className="p-3.5 font-bold text-left">مجموع (تومان)</th>
                  <th className="p-3.5 font-bold text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>موجودی زنده انبار مرکزی تهران و جایگزین‌ها</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222a3d]">
                {order.items.map((line, idx) => (
                  <tr key={line.product.id} className="hover:bg-[#131b2e]/40 transition-colors">
                    <td className="p-3.5 font-mono-num text-[#a08e7a]">#{idx + 1}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={line.product.image}
                          alt={line.product.name}
                          referrerPolicy="no-referrer"
                          className="h-10 w-10 object-contain rounded bg-[#0b1326] p-1 border border-[#222a3d]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono-num text-[10px] text-[#ffc174]">
                              {line.product.brand}
                            </span>
                            <span className="font-mono-num text-[10px] text-[#a08e7a]">
                              {line.product.sku}
                            </span>
                            <span className="font-mono-num text-[10px] text-[#a08e7a]">
                              {line.product.ratingAmps}A
                            </span>
                          </div>
                          <div className="font-bold text-white text-xs">{line.product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-mono-num font-bold text-white">
                      {line.quantity}
                    </td>
                    <td className="p-3.5 text-left font-mono-num text-[#d8c3ad]">
                      {line.unitPrice > 0
                        ? `${line.unitPrice.toLocaleString('fa-IR')}`
                        : 'استعلام'}
                    </td>
                    <td className="p-3.5 text-left font-mono-num font-bold text-white">
                      {line.unitPrice > 0
                        ? `${(line.unitPrice * line.quantity).toLocaleString('fa-IR')}`
                        : 'در حال استعلام'}
                    </td>
                    <td className="p-3.5 text-center">
                      <LiveWarehouseStockWidget
                        product={line.product}
                        requestedQty={line.quantity}
                        onSelectReplacement={
                          onReplaceOrderItem
                            ? (rep) => onReplaceOrderItem(line.product.id, rep)
                            : undefined
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Subtotal and Proforma PDF triggers */}
          <div className="border-t border-[#222a3d] bg-[#131b2e] p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="text-[#a08e7a]">
              جمع کل اقلام مشخص: <span className="font-mono-num font-bold text-white text-base">{order.subtotal.toLocaleString('fa-IR')}</span> تومان
              {order.pendingRfqCount > 0 && (
                <span className="mr-3 text-amber-400">
                  (+ {order.pendingRfqCount} قلم در حال استعلام قیمت بازار)
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDirectDownloadPdf}
                disabled={isDownloadingPdf}
                className="flex items-center gap-1.5 rounded-xl bg-[#ffc174] px-4 py-2 text-xs font-bold text-[#472a00] hover:bg-[#ffb95f] transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-base">download</span>
                <span>دانلود فایل پیش‌فاکتور (PDF)</span>
              </button>

              <button
                onClick={() => setIsProformaModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-[#2d3449] bg-[#171f33] px-3.5 py-2 text-xs font-bold text-[#dae2fd] hover:border-[#ffc174] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-base">visibility</span>
                <span>پیش‌نمایش سند</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl border border-[#2d3449] bg-[#171f33] px-3.5 py-2 text-xs font-bold text-[#dae2fd] hover:border-[#ffc174] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-base">print</span>
                <span>چاپ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Attached Engineer Notes */}
        {order.engineerNote && (
          <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-5 text-xs space-y-2">
            <div className="flex items-center gap-2 text-[#ffc174] font-bold">
              <span className="material-symbols-outlined text-base">comment</span>
              <span>دستورالعمل‌ها و یادداشت‌های فنی پیوست شده:</span>
            </div>
            <p className="text-[#d8c3ad] leading-relaxed bg-[#131b2e] p-3 rounded-xl border border-[#222a3d]">
              {order.engineerNote}
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={handleDirectDownloadPdf}
            disabled={isDownloadingPdf}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ffc174] to-[#f59e0b] px-6 py-3 text-xs font-bold text-[#472a00] hover:from-[#ffb95f] hover:to-[#d97706] transition-all shadow-lg"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            <span>دانلود پیش‌فاکتور رسمی (PDF)</span>
          </button>

          <button
            onClick={onViewAllOrders}
            className="flex items-center gap-2 rounded-xl border border-[#2d3449] bg-[#171f33] px-6 py-3 text-xs font-bold text-[#dae2fd] hover:border-[#ffc174] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-base">orders</span>
            <span>مشاهده در کارتابل سفارشات مهندسی</span>
          </button>

          <button
            onClick={onBackToCatalog}
            className="flex items-center gap-1.5 rounded-xl border border-[#2d3449] bg-[#171f33] px-6 py-3 text-xs font-bold text-[#dae2fd] hover:border-[#ffc174] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_forward</span>
            <span>بازگشت به کاتالوگ تجهیزات</span>
          </button>
        </div>
      </div>

      {/* Floating Non-Intrusive Direct Commercial Warehouse Chat */}
      <OrderCommercialChatWidget order={order} />
    </div>
  );
};

