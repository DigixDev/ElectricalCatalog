import React, { useState, useRef } from 'react';
import { IndustrialOrder } from '../types';
import { IndustrialProformaDocument } from './IndustrialProformaDocument';
import { generateProformaPdf } from '../utils/pdfExport';

interface IndustrialProformaModalProps {
  order: IndustrialOrder;
  isOpen: boolean;
  onClose: () => void;
}

export const IndustrialProformaModal: React.FC<IndustrialProformaModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const [includeVat, setIncludeVat] = useState(true);
  const [includeStamp, setIncludeStamp] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const printDocRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    if (!printDocRef.current) return;
    try {
      setIsGeneratingPdf(true);
      setStatusMessage('در حال آماده‌سازی و رندر استاندارد A4...');

      const fileName = `پیش_فاکتور_${order.orderNumber}.pdf`;
      await generateProformaPdf(printDocRef.current, {
        fileName,
        onProgress: (status) => setStatusMessage(status),
      });

      setStatusMessage('دانلود فایل PDF با موفقیت انجام شد.');
      setTimeout(() => {
        setStatusMessage(null);
        setIsGeneratingPdf(false);
      }, 2000);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      setStatusMessage('خطا در تولید فایل PDF. لطفاً از گزینه چاپ مستقیم استفاده فرمایید.');
      setTimeout(() => {
        setStatusMessage(null);
        setIsGeneratingPdf(false);
      }, 3500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-5xl rounded-2xl border border-[#2d3449] bg-[#171f33] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#222a3d] bg-[#131b2e] px-6 py-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffc174]/20 text-[#ffc174] border border-[#ffc174]/30">
              <span className="material-symbols-outlined text-2xl">receipt_long</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>پیش‌نمایش و صدور پیش‌فاکتور استاندارد صنعتی</span>
                <span className="rounded bg-[#ffc174]/20 px-2 py-0.5 font-mono-num text-xs text-[#ffc174] border border-[#ffc174]/30">
                  {order.orderNumber}
                </span>
              </h2>
              <p className="text-xs text-[#a08e7a] mt-0.5">
                سند رسمی با استانداردهای نظام مهندسی، شناسه اقتصادی و مشخصات فنی تابلوسازی
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-[#2d3449] bg-[#171f33] px-3.5 py-2 text-xs font-bold text-[#dae2fd] hover:border-[#ffc174] hover:text-white transition-colors"
              title="چاپ مستقیم سند"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span className="hidden sm:inline">چاپ</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ffc174] to-[#f59e0b] px-4 py-2 text-xs font-bold text-[#472a00] hover:from-[#ffb95f] hover:to-[#d97706] transition-all shadow-md ${
                isGeneratingPdf ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {isGeneratingPdf ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  <span>در حال ایجاد PDF...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">download</span>
                  <span>دانلود فایل PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2d3449] bg-[#171f33] text-[#a08e7a] hover:bg-[#222a3d] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Customization Toolbar */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#222a3d] bg-[#0b1326] px-6 py-2.5 text-xs text-[#dae2fd] gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeVat}
                onChange={(e) => setIncludeVat(e.target.checked)}
                className="h-4 w-4 rounded accent-[#ffc174]"
              />
              <span>محاسبه مالیات بر ارزش افزوده (۱۰٪ قانونی)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeStamp}
                onChange={(e) => setIncludeStamp(e.target.checked)}
                className="h-4 w-4 rounded accent-[#ffc174]"
              />
              <span>درج مهر و تاییدیه دیجیتال امور مالی</span>
            </label>
          </div>

          <div className="flex items-center gap-2 font-mono-num text-[11px] text-[#a08e7a]">
            <span>فرمت خروجی: استاندارد A4 (210×297mm)</span>
          </div>
        </div>

        {/* Progress Alert Banner */}
        {statusMessage && (
          <div className="bg-[#ffc174]/15 border-b border-[#ffc174]/30 px-6 py-2 text-xs font-bold text-[#ffc174] flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base animate-pulse">info</span>
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Document Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#0b1326]/80 flex justify-center">
          <IndustrialProformaDocument
            order={order}
            includeVat={includeVat}
            includeStamp={includeStamp}
            docRef={printDocRef}
          />
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between border-t border-[#222a3d] bg-[#131b2e] px-6 py-3 text-xs text-[#a08e7a] gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-base">verified</span>
            <span className="text-white font-medium">سند الکترونیکی دارای بارکد و شناسه قابل استعلام در کارتابل ERP</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-[#2d3449] bg-[#171f33] px-4 py-2 text-xs font-bold text-[#dae2fd] hover:text-white transition-colors"
            >
              بستن
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 rounded-xl bg-[#ffc174] px-5 py-2 text-xs font-bold text-[#472a00] hover:bg-[#ffb95f] transition-colors"
            >
              <span className="material-symbols-outlined text-base">picture_as_pdf</span>
              <span>دریافت پیش‌فاکتور (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
