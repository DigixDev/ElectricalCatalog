import React, { useState } from 'react';
import { DrawingMarkup } from '../types';

interface SldViewerViewProps {
  markups: DrawingMarkup[];
  onAddMarkup: (markup: DrawingMarkup) => void;
  onResolveMarkup: (id: number) => void;
}

export const SldViewerView: React.FC<SldViewerViewProps> = ({
  markups,
  onAddMarkup,
  onResolveMarkup,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTheme, setActiveTheme] = useState<'dark' | 'blueprint' | 'light'>('dark');
  const [activeSheet, setActiveSheet] = useState('P-01');
  const [isMarkupMode, setIsMarkupMode] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // New markup drawer form
  const [showNewMarkupForm, setShowNewMarkupForm] = useState(false);
  const [markupTitle, setMarkupTitle] = useState('');
  const [markupDesc, setMarkupDesc] = useState('');
  const [markupTag, setMarkupTag] = useState('-F1 (FEEDER-01)');
  const [markupPriority, setMarkupPriority] = useState<'critical' | 'warning' | 'info'>('critical');

  const sheets = [
    { id: 'P-01', label: 'P-01: ورودی شینه اصلی و ترانس ۴۰۰A' },
    { id: 'P-02', label: 'P-02: فیدرهای موتوری و پمپ ۵۵kW' },
    { id: 'P-03', label: 'P-03: تابلو کنترل PLC و درایوها' },
    { id: 'P-04', label: 'P-04: روشنایی و مدارات تابلویی' },
  ];

  const handleCreateMarkup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!markupTitle.trim()) return;

    const newMark: DrawingMarkup = {
      id: Date.now(),
      tag: markupTag,
      title: markupTitle,
      description: markupDesc,
      priority: markupPriority,
      status: 'open',
      author: 'مهندس ناظر برق',
      time: '11:45',
      date: '1403/08/25',
      assignedTo: 'واحد نقشه‌کشی EPLAN',
      color: markupPriority === 'critical' ? 'red' : markupPriority === 'warning' ? 'amber' : 'emerald',
    };

    onAddMarkup(newMark);
    setShowNewMarkupForm(false);
    setMarkupTitle('');
    setMarkupDesc('');
  };

  return (
    <div className="min-h-screen bg-[#0b1326] pb-24 text-[#dae2fd]">
      {/* Top Header & CAD Engine Controls */}
      <section className="border-b border-[#2d3449] bg-[#131b2e] px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded bg-[#ffc174]/15 px-2 py-0.5 font-mono-num text-[11px] font-bold text-[#ffc174] border border-[#ffc174]/30">
                CAD-ENGINE v4.2
              </span>
              <span className="text-xs text-[#a08e7a]">نمایشگر نقشه‌های تک‌خطی تک فاز و سه فاز (Single Line Diagram)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              دیاگرام تک‌خطی تابلوی توزیع MDP-400A
            </h1>
          </div>

          {/* Mode Segmented Switch: Viewer vs Mark-up Review */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-[#0b1326] p-1 border border-[#2d3449]">
              <button
                onClick={() => setIsMarkupMode(false)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  !isMarkupMode
                    ? 'bg-[#ffc174] text-[#472a00] shadow-sm'
                    : 'text-[#a08e7a] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                <span>نمایش و تحلیل مدار</span>
              </button>

              <button
                onClick={() => setIsMarkupMode(true)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  isMarkupMode
                    ? 'bg-[#ffc174] text-[#472a00] shadow-sm'
                    : 'text-[#a08e7a] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">edit_document</span>
                <span>حاشیه‌نویسی مهندسی ({markups.filter((m) => m.status === 'open').length})</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CAD Toolbar: Zoom, Rotate, Sheet tabs, Canvas Theme */}
      <div className="border-b border-[#222a3d] bg-[#171f33] px-4 py-2.5 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Sheets Selector */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {sheets.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSheet(s.id)}
                className={`px-3 py-1.5 rounded-lg font-mono-num font-medium whitespace-nowrap transition-colors border ${
                  activeSheet === s.id
                    ? 'border-[#ffc174] bg-[#ffc174]/15 text-[#ffc174]'
                    : 'border-[#2d3449] bg-[#131b2e] text-[#a08e7a] hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Zoom and Theme controls */}
          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 rounded-xl bg-[#131b2e] p-1 border border-[#2d3449] font-mono-num">
              <button
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 15))}
                className="px-2 py-0.5 text-[#a08e7a] hover:text-white"
                title="بزرگنمایی -"
              >
                -
              </button>
              <span className="w-12 text-center font-bold text-white text-[11px]">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 15))}
                className="px-2 py-0.5 text-[#a08e7a] hover:text-white"
                title="بزرگنمایی +"
              >
                +
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="border-r border-[#2d3449] pr-1 mr-1 text-[11px] text-[#ffc174] px-1 hover:underline"
              >
                1:1
              </button>
            </div>

            {/* Theme Switcher */}
            <div className="flex rounded-xl bg-[#131b2e] p-1 border border-[#2d3449]">
              <button
                onClick={() => setActiveTheme('dark')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  activeTheme === 'dark' ? 'bg-[#ffc174] text-[#472a00]' : 'text-[#a08e7a]'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setActiveTheme('blueprint')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  activeTheme === 'blueprint' ? 'bg-sky-400 text-[#091e3a]' : 'text-[#a08e7a]'
                }`}
              >
                Blueprint
              </button>
              <button
                onClick={() => setActiveTheme('light')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  activeTheme === 'light' ? 'bg-slate-200 text-black' : 'text-[#a08e7a]'
                }`}
              >
                Paper
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Drawing Canvas Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="relative rounded-2xl border border-[#2d3449] overflow-hidden shadow-2xl">
          {/* Canvas Viewport */}
          <div
            className={`min-h-[560px] p-6 overflow-auto transition-all ${
              activeTheme === 'dark'
                ? 'cad-grid-dark'
                : activeTheme === 'blueprint'
                ? 'cad-grid-blueprint text-sky-100'
                : 'cad-grid-light text-slate-900'
            }`}
          >
            <div
              className="mx-auto transition-transform origin-top duration-200 relative min-w-[760px] max-w-[960px]"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {/* CAD Drawing Sheet Frame */}
              <div
                className={`rounded-xl border-2 p-6 shadow-2xl relative ${
                  activeTheme === 'dark'
                    ? 'border-[#ffc174]/40 bg-[#0d1527]'
                    : activeTheme === 'blueprint'
                    ? 'border-sky-400 bg-[#0d2238]'
                    : 'border-slate-400 bg-white text-slate-900'
                }`}
              >
                {/* Drawing Sheet Header / Grid Coordinates */}
                <div className="flex justify-between font-mono-num text-[10px] opacity-70 border-b border-current pb-2 mb-6">
                  <span>GRID: A | B | C | D | E</span>
                  <span>SHEET: {activeSheet} • IEC 61439-2 STANDARD</span>
                  <span>DATE: 1403/08/21</span>
                </div>

                {/* SLD Circuit Diagram Architecture */}
                <div className="space-y-8 font-mono-num text-xs">
                  {/* Incoming Supply Node */}
                  <div className="flex flex-col items-center text-center">
                    <div className="rounded-md border border-current px-3 py-1 font-bold">
                      INCOMING SUPPLY: 20kV / 400V 50Hz (630 kVA TRANSFORMER)
                    </div>
                    <div className="w-0.5 h-6 bg-current"></div>
                  </div>

                  {/* Main Incomer MCCB: -Q1 */}
                  <div
                    onClick={() => setSelectedNode('Q1')}
                    className={`relative mx-auto max-w-md rounded-xl border p-4 cursor-pointer transition-all ${
                      selectedNode === 'Q1'
                        ? 'border-[#ffc174] bg-[#ffc174]/20 ring-2 ring-[#ffc174]'
                        : 'border-current bg-black/20 hover:border-[#ffc174]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#ffc174]">-Q1: MAIN INCOMER MCCB</span>
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-400 font-bold">
                        CLOSED (وصل)
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <div> اشنایدر: Compact NSX400F</div>
                      <div> جریان نامی: 400 A</div>
                      <div> قدرت قطع Icu: 36 kA @ 415V</div>
                      <div> واحد تریپ: Micrologic 2.3</div>
                    </div>
                  </div>

                  {/* Main Busbar Copper 40x10 mm² */}
                  <div className="relative py-2">
                    <div className="h-2 w-full rounded bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 shadow-md"></div>
                    <div className="flex justify-between items-center text-[10px] mt-1 text-[#ffc174]">
                      <span>MAIN BUSBAR Cu: 3 x (40 x 10 mm²) + PE + N</span>
                      <span>Icw = 35 kA (1s) • RATED In = 400 A</span>
                    </div>

                    {/* Mark-up Annotation Cloud 2 on Busbar */}
                    {isMarkupMode && (
                      <div className="absolute -top-3 left-1/4 rounded-full border-2 border-dashed border-amber-400 bg-amber-950/70 px-3 py-1 text-[10px] text-amber-300 shadow-lg flex items-center gap-1 animate-pulse">
                        <span className="material-symbols-outlined text-xs">warning</span>
                        <span>یادداشت #۲: کنترل فواصل عایقی مقره‌ها</span>
                      </div>
                    )}
                  </div>

                  {/* Outgoing Feeders Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* Feeder 1: Motor Pump 55 kW */}
                    <div
                      onClick={() => setSelectedNode('F1')}
                      className={`relative rounded-xl border p-4 cursor-pointer transition-all ${
                        selectedNode === 'F1'
                          ? 'border-[#ffc174] bg-[#ffc174]/20 ring-2 ring-[#ffc174]'
                          : 'border-current bg-black/20 hover:border-[#ffc174]'
                      }`}
                    >
                      {/* Mark-up Annotation Cloud 1: Critical mismatch */}
                      {isMarkupMode && (
                        <div className="absolute -top-4 -right-2 rounded-xl border-2 border-rose-500 bg-rose-950/90 px-3 py-1.5 text-[10px] text-rose-200 shadow-xl flex items-center gap-1.5 animate-bounce">
                          <span className="material-symbols-outlined text-sm text-rose-400">error</span>
                          <strong>نقص بحرانی #۱: رله حرارتی انتخابی LRD3363 (63-80A) کوچک است!</strong>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-b border-current pb-2 mb-2">
                        <span className="font-bold text-[#ffc174]">-FDR-01: پمپ تغذیه شماره یک</span>
                        <span>55 kW (In=102A)</span>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <div>کلید موتوری: Schneider GV3P80</div>
                        <div>کنتاکتور قدرت: TeSys D115 (LC1D115)</div>
                        <div className="text-rose-400 font-bold">
                          رله اضافه بار: LRD3363 (63-80A) [نیاز به اصلاح به LRD3365]
                        </div>
                        <div>کابل ارتباطی: 3x(1x70mm²) Cu NYY</div>
                      </div>
                    </div>

                    {/* Feeder 2: Sub-DB & Lighting */}
                    <div
                      onClick={() => setSelectedNode('F2')}
                      className={`relative rounded-xl border p-4 cursor-pointer transition-all ${
                        selectedNode === 'F2'
                          ? 'border-[#ffc174] bg-[#ffc174]/20 ring-2 ring-[#ffc174]'
                          : 'border-current bg-black/20 hover:border-[#ffc174]'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-current pb-2 mb-2">
                        <span className="font-bold text-sky-400">-FDR-02: تابلوی فرعی روشنایی</span>
                        <span>400V 3P+N (63A)</span>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <div>کلید مینیاتوری: Acti9 iC60N 32A 3P C-Curve (A9F74332)</div>
                        <div>کلید محافظ جان: Acti9 iID 4P 40A 30mA</div>
                        <div>بار مصرفی: روشنایی سالن تولید و پریزهای تک‌فاز</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Official Title Block (from HTML 5.2) */}
                <div className="mt-8 border-2 border-current rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono-num">
                  <div className="border-l border-current pl-2">
                    <span className="opacity-70 block">عنوان پروژه:</span>
                    <strong className="text-white">تابلوی اصلی توزیع MDP-400A</strong>
                  </div>
                  <div className="border-l border-current pl-2">
                    <span className="opacity-70 block">طراح و ناظر:</span>
                    <strong className="text-white">مهندس علیرضا رضوانی</strong>
                  </div>
                  <div className="border-l border-current pl-2">
                    <span className="opacity-70 block">استاندارد و فرم:</span>
                    <strong className="text-white">IEC 61439-2 Form 2b</strong>
                  </div>
                  <div>
                    <span className="opacity-70 block">شماره شیت:</span>
                    <strong className="text-[#ffc174]">{activeSheet} / REV: 04</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mark-up Checklist & Engineering Review Panel (from HTML 6.2) */}
        {isMarkupMode && (
          <div className="mt-6 rounded-2xl border border-[#2d3449] bg-[#171f33] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#222a3d] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffc174]">draw</span>
                  <h3 className="font-bold text-sm text-white">
                    کارتابل حاشیه‌نویسی و یادداشت‌های مهندسی نقشه (Mark-up Checklist)
                  </h3>
                </div>
                <p className="text-xs text-[#a08e7a] mt-0.5">
                  ثبت بازخوردها و تذکرات ناظر روی المان‌های نقشه تک‌خطی جهت ارجاع به واحد EPLAN
                </p>
              </div>

              <button
                onClick={() => setShowNewMarkupForm(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#ffc174] px-4 py-2 text-xs font-bold text-[#472a00] hover:bg-[#ffb95f]"
              >
                <span className="material-symbols-outlined text-sm">add_comment</span>
                <span>ثبت اصلاحیه جدید نقشه</span>
              </button>
            </div>

            {/* List of Markups */}
            <div className="space-y-3">
              {markups.map((m) => {
                const isCritical = m.priority === 'critical';
                const isOpen = m.status === 'open';

                return (
                  <div
                    key={m.id}
                    className={`rounded-xl border p-4 text-xs space-y-2 transition-colors ${
                      isCritical
                        ? 'border-rose-500/40 bg-rose-950/20'
                        : 'border-[#2d3449] bg-[#131b2e]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-num font-bold text-[#ffc174]">{m.tag}</span>
                        <h4 className="font-bold text-white">{m.title}</h4>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            isCritical
                              ? 'bg-rose-500/30 text-rose-300'
                              : 'bg-amber-500/30 text-amber-300'
                          }`}
                        >
                          {m.priority === 'critical' ? 'اولویت بحرانی' : 'هشدار فنی'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono-num text-[11px] text-[#a08e7a]">
                        <span>{m.author}</span>
                        <span>•</span>
                        <span>{m.date} - {m.time}</span>
                      </div>
                    </div>

                    <p className="text-[#d8c3ad] leading-relaxed">{m.description}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#222a3d] text-[11px]">
                      <span className="text-[#a08e7a]">
                        ارجاع شده به: <strong className="text-white">{m.assignedTo}</strong>
                      </span>

                      {isOpen ? (
                        <button
                          onClick={() => onResolveMarkup(m.id)}
                          className="flex items-center gap-1 rounded-lg bg-emerald-500/20 px-3 py-1 font-bold text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40"
                        >
                          <span className="material-symbols-outlined text-sm">check</span>
                          <span>علامت‌گذاری به عنوان رفع شده</span>
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">verified</span>
                          <span>اصلاح و تایید شد</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal: New Markup Form */}
            {showNewMarkupForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                <div className="w-full max-w-lg rounded-2xl border border-[#ffc174]/40 bg-[#171f33] p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#222a3d] pb-2">
                    <h3 className="font-bold text-sm text-white">ثبت یادداشت و اصلاحیه جدید روی نقشه</h3>
                    <button
                      onClick={() => setShowNewMarkupForm(false)}
                      className="text-[#a08e7a] hover:text-white"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <form onSubmit={handleCreateMarkup} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[#a08e7a] mb-1">المان مربوطه روی نقشه:</label>
                      <input
                        type="text"
                        value={markupTag}
                        onChange={(e) => setMarkupTag(e.target.value)}
                        placeholder="مثلاً -F2 یا MAIN-BUSBAR"
                        className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-2 text-white font-mono-num focus:border-[#ffc174] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#a08e7a] mb-1">عنوان تذکر فنی:</label>
                      <input
                        type="text"
                        required
                        value={markupTitle}
                        onChange={(e) => setMarkupTitle(e.target.value)}
                        placeholder="مثلاً تغییر سایز کابل یا اصلاح رنج رله بی‌متال"
                        className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-2 text-white focus:border-[#ffc174] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#a08e7a] mb-1">توضیحات و محاسبات فنی:</label>
                      <textarea
                        rows={3}
                        value={markupDesc}
                        onChange={(e) => setMarkupDesc(e.target.value)}
                        placeholder="جزییات جریان نامی، پارت‌نامبر جایگزین یا استانداردهای مرجع را ثبت فرمایید..."
                        className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-2.5 text-white focus:border-[#ffc174] focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[#a08e7a] mb-1">سطح اولویت:</label>
                      <select
                        value={markupPriority}
                        onChange={(e) => setMarkupPriority(e.target.value as any)}
                        className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-2 text-white focus:border-[#ffc174] focus:outline-none"
                      >
                        <option value="critical">بحرانی (توقف مونتاژ تابلو تا اصلاح)</option>
                        <option value="warning">هشدار فنی (نیازمند بررسی مجدد)</option>
                        <option value="info">پیشنهاد بهینه‌سازی</option>
                      </select>
                    </div>

                    <div className="pt-3 border-t border-[#222a3d] flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowNewMarkupForm(false)}
                        className="rounded-xl border border-[#2d3449] bg-[#131b2e] px-4 py-2 text-xs text-[#dae2fd]"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-[#ffc174] px-5 py-2 text-xs font-bold text-[#472a00]"
                      >
                        ثبت یادداشت
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
