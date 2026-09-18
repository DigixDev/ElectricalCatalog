import React, { useState } from 'react';
import { TechnicalDocument } from '../types';

interface DocumentsViewProps {
  documents: TechnicalDocument[];
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ documents }) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeDocPreview, setActiveDocPreview] = useState<TechnicalDocument | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  const filteredDocs = documents.filter((doc) => {
    if (selectedType === 'all') return true;
    return doc.type === selectedType;
  });

  const handleExportZip = () => {
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDownloadProgress(null), 1200);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#0b1326] pb-24 text-[#dae2fd]">
      {/* Header */}
      <section className="border-b border-[#2d3449] bg-gradient-to-b from-[#131b2e] to-[#0b1326] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded bg-[#ffc174]/15 px-2 py-0.5 font-mono-num text-xs font-bold text-[#ffc174] border border-[#ffc174]/30">
                  OFFLINE WORKSHOP VAULT
                </span>
                <span className="text-xs text-[#a08e7a]">آرشیو آفلاین مدارک کارگاهی و نقشه‌های CAD</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                اسناد فنی، ماکروهای EPLAN و سرتیفیکیت‌ها
              </h1>
              <p className="mt-1 text-sm text-[#d8c3ad]">
                دسترسی مستقیم به تایپ تست‌های آزمایشگاهی KEMA، بلوک‌های DWG دو و سه‌بعدی و دستورالعمل‌های مونتاژ
              </p>
            </div>

            {/* Offline Cache Status Bar (from HTML 2.2) */}
            <div className="flex flex-col gap-2 rounded-2xl border border-[#2d3449] bg-[#171f33] p-4 text-xs min-w-[280px]">
              <div className="flex items-center justify-between text-[#a08e7a]">
                <span>حافظه کش آفلاین کارگاهی:</span>
                <span className="font-mono-num text-white font-bold">74.5 MB / 120 MB</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#0b1326] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 w-[62%]"></div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  ۵ سند آماده دسترسی آفلاین
                </span>
                <button
                  onClick={handleExportZip}
                  className="rounded-lg bg-[#222a3d] px-2.5 py-1 text-[11px] font-bold text-[#ffc174] hover:bg-[#2d3449] border border-[#2d3449]"
                >
                  {downloadProgress !== null ? `${downloadProgress}% ...` : 'خروجی ZIP پروژه'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'all', label: 'همه اسناد و نقشه‌ها' },
            { id: 'pdf', label: 'دیتاشیت‌های PDF' },
            { id: 'dwg', label: 'فایل‌های CAD و DWG' },
            { id: 'wiring', label: 'دیاگرام سیم‌بندی' },
            { id: 'certificate', label: 'گواهی‌های KEMA / CE' },
            { id: 'manual', label: 'دفترچه راهنمای نصب' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`rounded-xl px-4 py-2 font-bold transition-all whitespace-nowrap border ${
                selectedType === tab.id
                  ? 'border-[#ffc174] bg-[#ffc174] text-[#472a00]'
                  : 'border-[#2d3449] bg-[#171f33] text-[#d8c3ad] hover:border-[#534434]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Document Cards Grid (from HTML 2.2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDocs.map((doc) => {
            const isPdf = doc.type === 'pdf';
            const isDwg = doc.type === 'dwg';
            const isCert = doc.type === 'certificate';

            return (
              <div
                key={doc.id}
                className="flex flex-col justify-between rounded-2xl border border-[#2d3449] bg-[#171f33] p-5 hover:border-[#ffc174]/60 transition-all shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                          isPdf
                            ? 'border-rose-500/30 bg-rose-500/20 text-rose-400'
                            : isDwg
                            ? 'border-sky-500/30 bg-sky-500/20 text-sky-400'
                            : isCert
                            ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-400'
                            : 'border-amber-500/30 bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl">
                          {isPdf
                            ? 'picture_as_pdf'
                            : isDwg
                            ? 'view_in_ar'
                            : isCert
                            ? 'verified'
                            : 'menu_book'}
                        </span>
                      </div>

                      <div>
                        <span className="rounded bg-[#131b2e] px-2 py-0.5 font-mono-num text-[10px] text-[#ffc174] border border-[#222a3d]">
                          {doc.typeLabel}
                        </span>
                        <h3 className="mt-1 text-sm font-bold text-white line-clamp-1">
                          {doc.title}
                        </h3>
                        <p className="text-xs text-[#a08e7a] line-clamp-1">{doc.subtitle}</p>
                      </div>
                    </div>

                    <span className="font-mono-num text-xs text-[#a08e7a]">{doc.size}</span>
                  </div>

                  {/* Technical Meta Specs */}
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-[#131b2e] p-3 text-xs border border-[#222a3d]">
                    <div>
                      <span className="text-[#a08e7a]">کد ارجاع / SKU:</span>
                      <div className="font-mono-num font-bold text-white mt-0.5">
                        {doc.partNumber}
                      </div>
                    </div>
                    <div>
                      <span className="text-[#a08e7a]">استاندارد مرجع:</span>
                      <div className="font-mono-num text-[#ffc174] mt-0.5">{doc.standard}</div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-[#222a3d] flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">cloud_done</span>
                    <span>{doc.complianceNotes}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveDocPreview(doc)}
                      className="rounded-xl border border-[#2d3449] bg-[#131b2e] px-3 py-1.5 text-xs text-[#dae2fd] hover:border-[#ffc174] hover:text-white"
                    >
                      مشاهده سند
                    </button>
                    <button
                      onClick={() => alert(`دانلود مستقیم سند: ${doc.title} (${doc.size})`)}
                      className="flex items-center gap-1 rounded-xl bg-[#ffc174] px-3 py-1.5 text-xs font-bold text-[#472a00] hover:bg-[#ffb95f]"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      <span>دریافت فایل</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Document Viewer Preview */}
        {activeDocPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="relative w-full max-w-3xl rounded-2xl border border-[#ffc174]/40 bg-[#171f33] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#222a3d] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffc174]">description</span>
                  <h3 className="font-bold text-sm text-white">{activeDocPreview.title}</h3>
                </div>
                <button
                  onClick={() => setActiveDocPreview(null)}
                  className="text-[#a08e7a] hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Document Mock Sheet Reader */}
              <div className="rounded-xl bg-[#060e20] p-6 border border-[#2d3449] text-xs font-mono-num text-[#dae2fd] space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#222a3d] pb-2 text-[11px] text-[#a08e7a]">
                  <span>OFFICIAL SPECIFICATION SHEET</span>
                  <span>REF: {activeDocPreview.partNumber}</span>
                  <span>STANDARD: {activeDocPreview.standard}</span>
                </div>

                <div className="space-y-2 text-sm text-white font-sans">
                  <h4 className="text-base font-bold text-[#ffc174]">{activeDocPreview.subtitle}</h4>
                  <p className="text-xs text-[#d8c3ad] leading-relaxed">
                    این سند حاوی کلیه پارامترهای تایید شده در تست‌های اتصال کوتاه، عایق‌بندی دی‌الکتریک، منحنی‌های مشخصه زمان-جریان (Trip Curve) و ابعاد فیزیکی استاندارد متناسب با فریم‌های تابلویی IEC 61439 می‌باشد.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#131b2e] p-3 rounded-xl border border-[#222a3d] text-center">
                  <div>
                    <div className="text-[10px] text-[#a08e7a]">نوع فایل</div>
                    <div className="font-bold text-[#ffc174]">{activeDocPreview.type.toUpperCase()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#a08e7a]">حجم فایل</div>
                    <div className="font-bold text-sky-400">{activeDocPreview.size}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#a08e7a]">وضعیت گواهی</div>
                    <div className="font-bold text-emerald-400">تایید شده KEMA</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#a08e7a]">ماکرو EPLAN</div>
                    <div className="font-bold text-white">سازگار با P8</div>
                  </div>
                </div>

                <div className="cad-grid-blueprint p-6 rounded-xl border border-sky-500/30 text-center text-sky-200">
                  <span className="material-symbols-outlined text-4xl mb-2">schema</span>
                  <div className="font-bold">EPLAN ELECTRICAL SCHEMATIC PREVIEW AVAILABLE</div>
                  <div className="text-[11px] text-sky-300/80 mt-1">DXF / STEP 3D Geometry Layer Synced</div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setActiveDocPreview(null)}
                  className="rounded-xl border border-[#2d3449] bg-[#131b2e] px-4 py-2 text-xs text-[#dae2fd] hover:text-white"
                >
                  بستن
                </button>
                <button
                  onClick={() => {
                    alert(`فایل ${activeDocPreview.title} با موفقیت دریافت گردید.`);
                    setActiveDocPreview(null);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[#ffc174] px-5 py-2 text-xs font-bold text-[#472a00] hover:bg-[#ffb95f]"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>دانلود کامل فایل ({activeDocPreview.size})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
