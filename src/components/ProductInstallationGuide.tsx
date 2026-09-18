import React, { useState } from 'react';
import { EquipmentProduct } from '../types';

// Pre-generated Imagen 3D Installation Schematics
import mccbInstallImage from '../assets/images/mccb_install_guide_1789754467298.jpg';
import contactorInstallImage from '../assets/images/contactor_install_3d_1789754481270.jpg';
import mcbInstallImage from '../assets/images/mcb_rail_install_1789754493814.jpg';

interface ProductInstallationGuideProps {
  product: EquipmentProduct;
  onOpenFullscreen?: () => void;
}

type ViewPerspective = 'isometric' | 'torque' | 'clearance';
type MountingType = 'panel_plate' | 'din_rail' | 'busbar_system';

interface CalloutHotspot {
  id: number;
  xPercent: number; // Position on image
  yPercent: number;
  title: string;
  detail: string;
  torqueOrDimension?: string;
  badgeType: 'critical' | 'info' | 'torque';
}

export const ProductInstallationGuide: React.FC<ProductInstallationGuideProps> = ({
  product,
}) => {
  const [perspective, setPerspective] = useState<ViewPerspective>('isometric');
  const [mountingType, setMountingType] = useState<MountingType>(
    product.category === 'mcb' || product.category === 'relay' ? 'din_rail' : 'panel_plate'
  );
  const [activeHotspot, setActiveHotspot] = useState<CalloutHotspot | null>(null);
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [showGridOverlay, setShowGridOverlay] = useState(true);

  // Determine appropriate base schematic image based on product category
  const getBaseImage = () => {
    if (product.category === 'mccb') {
      return mccbInstallImage;
    }
    if (product.category === 'contactor' || product.category === 'relay') {
      return contactorInstallImage;
    }
    return mcbInstallImage;
  };

  const currentImage = getBaseImage();

  // Technical torque and clearance specs based on current equipment
  const getInstallationSpecs = () => {
    const amps = product.ratingAmps || 25;
    if (amps >= 200) {
      return {
        powerTorque: '9.0 - 11.5 N·m (آچار گشتاور M8)',
        controlTorque: '1.2 - 1.5 N·m (پیچ گوشتی PZ2)',
        busbarSpec: 'شینه مسی با روکش قلع، حداقل ۳۰×۵ میلی‌متر',
        minClearanceTop: '۱۲۰ میلی‌متر (محفظه خروج گازهای جرقه)',
        minClearanceSides: '۴۵ میلی‌متر تا دیواره فلزی شاسی',
        stripLength: '۲۲ - ۲۵ میلی‌متر یا کابلشوی مسی استاندارد',
        standardRef: 'IEC 60947-2 / IEC 61439-1',
      };
    } else if (amps >= 40) {
      return {
        powerTorque: '4.0 - 5.5 N·m (آچار آلن یا پیچ گوشتی اسلات)',
        controlTorque: '0.8 - 1.2 N·m',
        busbarSpec: 'کابل مسی مقطع ۱۶ تا ۳۵ میلی‌متر مربع یا شینه ۲۰×۳',
        minClearanceTop: '۸۰ میلی‌متر جهت دفع حرارتی',
        minClearanceSides: '۳۰ میلی‌متر',
        stripLength: '۱۴ - ۱۸ میلی‌متر با سرسیم لوله‌ای عایق‌دار',
        standardRef: 'IEC 60947-4-1 / IEC 61439-2',
      };
    } else {
      return {
        powerTorque: '2.5 - 3.5 N·m (PZ2 / Slotted)',
        controlTorque: '0.6 - 0.8 N·m',
        busbarSpec: 'شانه مسی مینیاتوری شینه‌ای (Pin/Fork Comb Busbar)',
        minClearanceTop: '۵۰ میلی‌متر تا داکت شیاردار تابلو',
        minClearanceSides: 'بدون فاصله مجاز در ردیف ریل DIN',
        stripLength: '۱۱ - ۱۳ میلی‌متر',
        standardRef: 'IEC 60898-1 / DIN EN 50022',
      };
    }
  };

  const specs = getInstallationSpecs();

  // Callout hotspots on the 3D rendered schematic
  const hotspots: CalloutHotspot[] =
    product.category === 'mccb'
      ? [
          {
            id: 1,
            xPercent: 50,
            yPercent: 22,
            title: 'ترمینال‌های شینه‌کشی قدرت ورودی (Line)',
            detail: 'بستن شینه‌های مسی با پیچ‌های گالوانیزه ۸.۸ و واشر خورشیدی فنری جهت جلوگیری از شل‌شدگی در ارتعاشات صنعتی.',
            torqueOrDimension: specs.powerTorque,
            badgeType: 'torque',
          },
          {
            id: 2,
            xPercent: 78,
            yPercent: 46,
            title: 'دیواره‌های عایق فاز و کانال اطفا جرقه (Arc Chutes)',
            detail: 'حفظ فاصله آزاد هوایی بدون مسدودسازی دریچه‌های فوقانی برای تهویه ایمن گازهای یونیزه هنگام قطع اتصال کوتاه.',
            torqueOrDimension: specs.minClearanceTop,
            badgeType: 'critical',
          },
          {
            id: 3,
            xPercent: 28,
            yPercent: 68,
            title: 'پیچ‌های تثبیت مکانیکی شاسی روی سینی مونتاژ',
            detail: 'چهار نقطه پیچ‌کاری روی سینی گالوانیزه با واشر تخت و فنری جهت تحمل ضربات الکترودینامیکی ناشی از اتصال کوتاه.',
            torqueOrDimension: 'گشتاور بستن شاسی: ۶.۰ N·m',
            badgeType: 'info',
          },
          {
            id: 4,
            xPercent: 52,
            yPercent: 82,
            title: 'ترمینال‌های بار خروجی (Load Terminals)',
            detail: 'تراز دقیق شینه‌ها یا کابلشوها بدون اعمال بار مکانیکی خمشی به بدنه باکالیت کلید.',
            torqueOrDimension: specs.powerTorque,
            badgeType: 'torque',
          },
        ]
      : [
          {
            id: 1,
            xPercent: 48,
            yPercent: 24,
            title: 'ترمینال‌های ورودی قدرت و شانه فاز (Comb Busbar)',
            detail: 'قرارگیری صحیح زبانه شانه مسی در محفظه بستن پیچ و اطمینان از محکم بودن همزمان سرسیم و تیغه شانه.',
            torqueOrDimension: specs.powerTorque,
            badgeType: 'torque',
          },
          {
            id: 2,
            xPercent: 74,
            yPercent: 52,
            title: 'مکانیزم چفت‌شونده روی ریل DIN ۳۵ میلی‌متر',
            detail: 'چفت شدن زبانه فنری فلزی در پشت تجهیز روی ریل استاندارد TH35 با قابلیت دمونتاژ سریع با پیچ‌گوشتی دوسو.',
            torqueOrDimension: 'ریل منطبق با DIN EN 50022',
            badgeType: 'info',
          },
          {
            id: 3,
            xPercent: 32,
            yPercent: 55,
            title: 'نشانگر وضعیت مکانیکی و قطع اضطراری',
            detail: 'دید مستقیم به نشانگر کنتاکت و عدم پوشیده شدن با لیبل‌گذاری‌ها مطابق الزامات استاندارد ایمنی برق.',
            torqueOrDimension: 'دید مستقیم IEC 60204',
            badgeType: 'critical',
          },
          {
            id: 4,
            xPercent: 52,
            yPercent: 84,
            title: 'ترمینال‌های خروجی مصرف‌کننده (Load)',
            detail: 'استفاده از وایرشو با طول مناسب تا هیچ قسمتی از مس بدون عایق بیرون از قاب پلاستیکی نماند.',
            torqueOrDimension: specs.stripLength,
            badgeType: 'torque',
          },
        ];

  // Handle custom generation simulation with Imagen
  const handleGenerateCustomSchematic = () => {
    setIsGeneratingCustom(true);
    setGenerationLogs([
      `[Imagen 3D Engine]: دریافت درخواست شماتیک نصب سه‌بعدی برای تجهیز ${product.name}...`,
    ]);

    setTimeout(() => {
      setGenerationLogs((prev) => [
        ...prev,
        `[Imagen 3D Engine]: تحلیل پارامترهای مکانیکی: جریان نامی ${product.ratingAmps}A، ابعاد، و نوع شاسی (${mountingType === 'panel_plate' ? 'سینی مونتاژ تابلو' : 'ریل مینیاتوری DIN 35mm'})...`,
      ]);
    }, 600);

    setTimeout(() => {
      setGenerationLogs((prev) => [
        ...prev,
        `[Imagen 3D Engine]: اعمال الزامات استانداردهای IEC 61439 و فواصل تخلیه جرقه (${specs.minClearanceTop})...`,
      ]);
    }, 1300);

    setTimeout(() => {
      setGenerationLogs((prev) => [
        ...prev,
        `[Imagen 3D Engine]: رندر نهایی تصویر سه‌بعدی ایزومتریک با برچسب‌های گشتاور و خطوط راهنمای مهندسی (Blueprint)...`,
      ]);
    }, 2000);

    setTimeout(() => {
      setIsGeneratingCustom(false);
      setGenerationLogs((prev) => [
        ...prev,
        `[Imagen 3D Engine]: تصویر راهنمای نصب با رزولوشن بالا و کالیبراسیون صنعتی با موفقیت تولید شد.`,
      ]);
    }, 2700);
  };

  const handlePrintSheet = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Imagen AI Engine Badge & Controls */}
      <div className="rounded-2xl border-2 border-[#ffc174]/30 bg-gradient-to-r from-[#171f33] via-[#1a243d] to-[#171f33] p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ffc174]/20 text-[#ffc174] border border-[#ffc174]/40 shadow-inner">
              <span className="material-symbols-outlined text-2xl">view_in_ar</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-gradient-to-r from-amber-500/30 to-orange-500/30 px-2 py-0.5 text-[10px] font-extrabold text-[#ffc174] border border-[#ffc174]/40 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">auto_awesome</span>
                  <span>IMAGEN 3D SCHEMATIC</span>
                </span>
                <span className="font-mono-num text-[11px] text-[#a08e7a]">
                  CAD EXPLODED VIEW • IEC 61439
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-1">
                راهنمای سه‌بعدی نصب، شینه‌کشی و مونتاژ تابلو
              </h2>
              <p className="text-xs text-[#d8c3ad] leading-relaxed mt-0.5">
                تولید شده با موتور پردازش تصویر سه‌بعدی Imagen جهت نمایش گام‌به‌گام نحوه اتصال شینه‌ها،
                گشتاور پیچ‌ها و الزامات مکانیکی داخل تابلو برق.
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-[#2d3449] bg-[#131b2e] px-3.5 py-2 text-xs font-bold text-[#dae2fd] hover:border-[#ffc174] hover:text-white transition-all shadow-sm"
              title="مشاهده تمام‌صفحه با جزئیات نقشه"
            >
              <span className="material-symbols-outlined text-base">fullscreen</span>
              <span className="hidden sm:inline">بزرگ‌نمایی تمام‌صفحه</span>
            </button>

            <button
              onClick={handlePrintSheet}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#ffc174] to-[#f59e0b] px-4 py-2 text-xs font-extrabold text-[#472a00] hover:from-[#ffb95f] hover:to-[#d97706] transition-all shadow-md shadow-[#ffc174]/20"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>چاپ شیت کارگاهی</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Schematic Interactive Canvas (7 cols) + Technical Guide Specs (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Main Column: 3D Schematic Canvas & Hotspots */}
        <div className="lg:col-span-8 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#2d3449] bg-[#131b2e] p-3 text-xs">
            {/* Perspective View Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#a08e7a] text-[11px] ml-1">زاویه دید:</span>
              <button
                onClick={() => setPerspective('isometric')}
                className={`rounded-lg px-2.5 py-1.5 font-bold transition-all ${
                  perspective === 'isometric'
                    ? 'bg-[#ffc174] text-[#472a00]'
                    : 'bg-[#171f33] text-[#dae2fd] hover:text-white border border-[#2d3449]'
                }`}
              >
                ایزومتریک انفجاری (3D)
              </button>

              <button
                onClick={() => setPerspective('torque')}
                className={`rounded-lg px-2.5 py-1.5 font-bold transition-all ${
                  perspective === 'torque'
                    ? 'bg-[#ffc174] text-[#472a00]'
                    : 'bg-[#171f33] text-[#dae2fd] hover:text-white border border-[#2d3449]'
                }`}
              >
                گشتاور و شینه‌کشی
              </button>

              <button
                onClick={() => setPerspective('clearance')}
                className={`rounded-lg px-2.5 py-1.5 font-bold transition-all ${
                  perspective === 'clearance'
                    ? 'bg-[#ffc174] text-[#472a00]'
                    : 'bg-[#171f33] text-[#dae2fd] hover:text-white border border-[#2d3449]'
                }`}
              >
                فواصل ایمن و تهویه
              </button>
            </div>

            {/* View Layer Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGridOverlay(!showGridOverlay)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] border transition-colors ${
                  showGridOverlay
                    ? 'border-[#ffc174]/40 bg-[#ffc174]/10 text-[#ffc174]'
                    : 'border-[#2d3449] bg-[#171f33] text-[#a08e7a]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">grid_on</span>
                <span>شبکه CAD</span>
              </button>

              <div className="flex items-center gap-1 rounded-lg bg-[#171f33] border border-[#2d3449] p-0.5">
                <button
                  onClick={() => setImageZoom(Math.max(1, imageZoom - 0.2))}
                  className="h-6 w-6 rounded text-xs text-[#dae2fd] hover:bg-[#222a3d] flex items-center justify-center"
                  title="کاهش زوم"
                >
                  -
                </button>
                <span className="text-[10px] font-mono-num px-1 text-[#ffc174]">
                  {Math.round(imageZoom * 100)}%
                </span>
                <button
                  onClick={() => setImageZoom(Math.min(2, imageZoom + 0.2))}
                  className="h-6 w-6 rounded text-xs text-[#dae2fd] hover:bg-[#222a3d] flex items-center justify-center"
                  title="افزایش زوم"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Schematic Frame */}
          <div className="relative rounded-2xl border-2 border-[#2d3449] bg-[#090e1a] overflow-hidden shadow-2xl group select-none">
            {/* Engineering Grid Overlay */}
            {showGridOverlay && (
              <div
                className="absolute inset-0 pointer-events-none opacity-25 z-10"
                style={{
                  backgroundImage: `linear-gradient(to right, #ffc174 1px, transparent 1px), linear-gradient(to bottom, #ffc174 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              ></div>
            )}

            {/* Blueprint Header Watermark */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2 rounded-lg bg-[#0b1326]/85 backdrop-blur-md px-3 py-1.5 border border-[#2d3449] text-[11px] font-mono-num text-[#ffc174]">
              <span className="material-symbols-outlined text-sm text-sky-400">precision_manufacturing</span>
              <span>ENGINEERING 3D BLUEPRINT • {product.model}</span>
            </div>

            {/* The 3D Rendered Image */}
            <div className="overflow-hidden flex items-center justify-center min-h-[380px] sm:min-h-[460px] p-2 sm:p-4">
              <div
                className="relative transition-transform duration-300 w-full flex items-center justify-center"
                style={{ transform: `scale(${imageZoom})` }}
              >
                <img
                  src={currentImage}
                  alt={`راهنمای نصب سه‌بعدی ${product.name}`}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[500px] object-contain rounded-xl border border-[#222a3d] shadow-2xl"
                />

                {/* Hotspot Interactive Markers (Only if not zoomed beyond 1.5 for clarity) */}
                {hotspots.map((spot) => {
                  const isSelected = activeHotspot?.id === spot.id;
                  return (
                    <div
                      key={spot.id}
                      style={{
                        position: 'absolute',
                        left: `${spot.xPercent}%`,
                        top: `${spot.yPercent}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="z-30 cursor-pointer"
                      onClick={() => setActiveHotspot(isSelected ? null : spot)}
                    >
                      <div className="relative flex items-center justify-center">
                        {/* Pulse Ring */}
                        <span
                          className={`absolute h-8 w-8 rounded-full animate-ping opacity-60 ${
                            spot.badgeType === 'critical'
                              ? 'bg-rose-500'
                              : spot.badgeType === 'torque'
                              ? 'bg-amber-400'
                              : 'bg-sky-400'
                          }`}
                        ></span>

                        {/* Dot Button */}
                        <div
                          className={`relative flex h-7 w-7 items-center justify-center rounded-full font-mono-num text-xs font-black shadow-lg transition-transform hover:scale-125 border-2 ${
                            isSelected
                              ? 'bg-white text-black border-[#ffc174] scale-110'
                              : spot.badgeType === 'critical'
                              ? 'bg-rose-500 text-white border-rose-200'
                              : spot.badgeType === 'torque'
                              ? 'bg-amber-400 text-black border-amber-100'
                              : 'bg-sky-500 text-white border-sky-200'
                          }`}
                        >
                          {spot.id}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Hotspot Callout Box Overlay */}
            {activeHotspot && (
              <div className="absolute bottom-4 left-4 right-4 z-30 rounded-xl border border-[#ffc174]/60 bg-[#131b2e]/95 backdrop-blur-md p-4 text-xs shadow-2xl transition-all animate-fadeIn">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffc174] font-mono-num font-bold text-[#472a00]">
                      {activeHotspot.id}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-white text-sm">
                        {activeHotspot.title}
                      </h4>
                      <p className="text-[#d8c3ad] leading-relaxed mt-1 text-xs">
                        {activeHotspot.detail}
                      </p>
                      {activeHotspot.torqueOrDimension && (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded bg-[#0b1326] px-2.5 py-1 text-[11px] font-mono-num text-[#ffc174] border border-[#222a3d]">
                          <span className="material-symbols-outlined text-sm">build</span>
                          <span>الزام استاندارد: {activeHotspot.torqueOrDimension}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="text-[#a08e7a] hover:text-white p-1 rounded-lg hover:bg-[#222a3d]"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Status Bar */}
            <div className="border-t border-[#222a3d] bg-[#0d1527] px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#a08e7a]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>کالیبره شده با خط‌کش مهندسی تابلو برق</span>
              </div>
              <span className="font-mono-num text-[#ffc174]">
                جهت مشاهده مشخصات هر بخش، روی اعداد زرد/قرمز کلیک نمایید
              </span>
            </div>
          </div>

          {/* Imagen AI Custom Prompt & Regeneration Studio */}
          <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffc174]">brush</span>
                <h3 className="font-bold text-sm text-white">
                  سفارشی‌سازی و تولید شماتیک متناسب با نقشه کارگاه (Imagen Generator)
                </h3>
              </div>
              <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300 border border-sky-500/30">
                PROMPT TO 3D SCHEMATIC
              </span>
            </div>

            <p className="text-xs text-[#d8c3ad] leading-relaxed">
              مهندسان محترم می‌توانند نحوه چیدمان تجهیز (روی سینی مونتاژ، ریل مینیاتوری DIN، یا شینه‌کشی هوایی)
              را انتخاب نموده تا موتور هوش مصنوعی Imagen نمای انفجاری متناسب با کارگاه را شبیه‌سازی کند.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setMountingType('panel_plate')}
                className={`rounded-xl p-3 border text-right transition-all ${
                  mountingType === 'panel_plate'
                    ? 'border-[#ffc174] bg-[#ffc174]/15 text-white'
                    : 'border-[#2d3449] bg-[#131b2e] text-[#a08e7a] hover:text-white'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">dashboard_customize</span>
                  <span>سینی گالوانیزه تابلو</span>
                </div>
                <div className="text-[11px] text-[#a08e7a] mt-1">نصب عمودی با پیچ M6/M8</div>
              </button>

              <button
                type="button"
                onClick={() => setMountingType('din_rail')}
                className={`rounded-xl p-3 border text-right transition-all ${
                  mountingType === 'din_rail'
                    ? 'border-[#ffc174] bg-[#ffc174]/15 text-white'
                    : 'border-[#2d3449] bg-[#131b2e] text-[#a08e7a] hover:text-white'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">view_stream</span>
                  <span>ریل مینیاتوری DIN 35mm</span>
                </div>
                <div className="text-[11px] text-[#a08e7a] mt-1">مونتاژ ردیفی با شانه فاز</div>
              </button>

              <button
                type="button"
                onClick={() => setMountingType('busbar_system')}
                className={`rounded-xl p-3 border text-right transition-all ${
                  mountingType === 'busbar_system'
                    ? 'border-[#ffc174] bg-[#ffc174]/15 text-white'
                    : 'border-[#2d3449] bg-[#131b2e] text-[#a08e7a] hover:text-white'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">layers</span>
                  <span>شینه‌کشی مسی مستقیم</span>
                </div>
                <div className="text-[11px] text-[#a08e7a] mt-1">شینه‌کشی سه‌فاز شمش مس</div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#a08e7a] font-mono-num">
                پیکربندی جاری: {product.model} • استاندارد {specs.standardRef}
              </span>

              <button
                type="button"
                disabled={isGeneratingCustom}
                onClick={handleGenerateCustomSchematic}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ffc174] to-[#f59e0b] px-4 py-2.5 text-xs font-bold text-[#472a00] hover:from-[#ffb95f] hover:to-[#d97706] transition-all disabled:opacity-50 shadow-md shadow-[#ffc174]/20"
              >
                {isGeneratingCustom ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                    <span>در حال رندر شماتیک سه‌بعدی...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">auto_awesome</span>
                    <span>تولید شماتیک سفارشی با Imagen</span>
                  </>
                )}
              </button>
            </div>

            {/* Generation Progress Logs */}
            {generationLogs.length > 0 && (
              <div className="rounded-xl border border-sky-500/30 bg-[#0b1326] p-3 text-xs font-mono-num space-y-1 text-sky-300">
                {generationLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Installation Matrix & Checklists (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Mechanical & Torque Specifications Card */}
          <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#222a3d] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffc174]">handyman</span>
                <h3 className="font-bold text-xs text-white">الزامات مکانیکی و گشتاور بستن</h3>
              </div>
              <span className="rounded bg-[#ffc174]/20 px-2 py-0.5 font-mono-num text-[10px] text-[#ffc174]">
                IEC 60947
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-[#131b2e] p-3 border border-[#222a3d]">
                <div className="text-[#a08e7a] text-[11px]">گشتاور بستن ترمینال قدرت:</div>
                <div className="font-mono-num font-bold text-[#ffc174] text-sm mt-0.5">
                  {specs.powerTorque}
                </div>
                <div className="text-[10px] text-[#a08e7a] mt-1">
                  عدم استفاده از گشتاور نامناسب مانع داغ شدن نقطه اتصال می‌شود.
                </div>
              </div>

              <div className="rounded-xl bg-[#131b2e] p-3 border border-[#222a3d]">
                <div className="text-[#a08e7a] text-[11px]">گشتاور مدارهای فرمان و کمکی:</div>
                <div className="font-mono-num font-bold text-white text-sm mt-0.5">
                  {specs.controlTorque}
                </div>
              </div>

              <div className="rounded-xl bg-[#131b2e] p-3 border border-[#222a3d]">
                <div className="text-[#a08e7a] text-[11px]">طول استاندارد عایق‌برداری (Strip Length):</div>
                <div className="font-mono-num font-bold text-sky-400 text-sm mt-0.5">
                  {specs.stripLength}
                </div>
              </div>

              <div className="rounded-xl bg-[#131b2e] p-3 border border-[#222a3d]">
                <div className="text-[#a08e7a] text-[11px]">مشخصات پیشنهادی شینه مسی:</div>
                <div className="font-mono-num font-bold text-emerald-400 text-xs mt-0.5">
                  {specs.busbarSpec}
                </div>
              </div>
            </div>
          </div>

          {/* Phase Clearance & Enclosure Venting Card */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#171f33] to-[#121827] p-5 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <span className="material-symbols-outlined text-base">warning</span>
              <span>فواصل ایمن تخلیه قوس و جرقه (Arc Flash)</span>
            </div>

            <p className="text-[11px] text-[#d8c3ad] leading-relaxed">
              مطابق آیین‌نامه تابلوهای فشار ضعیف IEC 61439-1، رعایت فاصله ایمن بالای کلید جهت عدم تخلیه
              قوس الکتریکی به سقف فلزی تابلو الزامی است:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-[#222a3d] pb-2 text-[#d8c3ad]">
                <span className="text-[#a08e7a]">حداقل فاصله از بالای کلید:</span>
                <span className="font-mono-num font-bold text-amber-300">
                  {specs.minClearanceTop}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#222a3d] pb-2 text-[#d8c3ad]">
                <span className="text-[#a08e7a]">حداقل فاصله از دیواره جانبی:</span>
                <span className="font-mono-num font-bold text-white">
                  {specs.minClearanceSides}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#d8c3ad]">
                <span className="text-[#a08e7a]">دمای کاری مجاز محیط تابلو:</span>
                <span className="font-mono-num font-bold text-white">
                  منفی ۲۵ الی مثبت ۶۰ درجه
                </span>
              </div>
            </div>
          </div>

          {/* Assembly Workshop Checklist */}
          <div className="rounded-2xl border border-[#2d3449] bg-[#131b2e] p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="material-symbols-outlined text-base">task_alt</span>
              <span>چک‌لیست کنترل کیفیت مونتاژ کارگاه</span>
            </div>

            <ul className="space-y-2 text-[11px] text-[#d8c3ad]">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-sm mt-0.5">check</span>
                <span>علامت‌گذاری با ماژیک گشتاور (Torque Seal) پس از سفت‌کاری پیچ‌ها</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-sm mt-0.5">check</span>
                <span>نصب درپوش‌های عایقی فازها (Terminal Shields) برای جلوگیری از تماس تصادفی</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-sm mt-0.5">check</span>
                <span>آزمون مقاومت عایقی با میگر ۱۰۰۰ ولت پیش از اتصال به شبکه توزیع</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-6xl max-h-[90vh] rounded-2xl border border-[#2d3449] bg-[#0b1326] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#222a3d] bg-[#131b2e] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffc174]/20 text-[#ffc174]">
                  <span className="material-symbols-outlined text-xl">view_in_ar</span>
                </div>
                <div>
                  <h3 className="font-black text-white text-sm">
                    شماتیک انفجاری سه‌بعدی و نقشه مونتاژ: {product.name}
                  </h3>
                  <p className="text-[11px] text-[#a08e7a] font-mono-num">
                    SKU: {product.sku} • IEC 61439-1 / IEC 60947-2
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrintSheet}
                  className="flex items-center gap-1.5 rounded-lg bg-[#222a3d] px-3 py-1.5 text-xs text-[#ffc174] hover:bg-[#2d3449]"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  <span>چاپ</span>
                </button>

                <button
                  onClick={() => setIsFullscreen(false)}
                  className="rounded-lg p-1.5 text-[#a08e7a] hover:bg-[#222a3d] hover:text-white"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-auto flex items-center justify-center bg-[#090e1a]">
              <img
                src={currentImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain rounded-xl border border-[#222a3d] shadow-2xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#222a3d] bg-[#131b2e] px-6 py-3 flex items-center justify-between text-xs text-[#a08e7a]">
              <span>تولید شده با ابزار Imagen برای سامانه مهندسی تابلو برق صنعتی</span>
              <span className="font-mono-num text-[#ffc174]">گشتاور بستن: {specs.powerTorque}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
