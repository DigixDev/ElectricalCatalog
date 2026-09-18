import React, { useState } from 'react';
import { EquipmentProduct } from '../types';
import { ProductInstallationGuide } from './ProductInstallationGuide';

interface ProductDetailViewProps {
  product: EquipmentProduct;
  onBack: () => void;
  onAddToCart: (product: EquipmentProduct, quantity: number) => void;
  onToggleCompare: (product: EquipmentProduct) => void;
  isCompared: boolean;
  onSelectRelated: (product: EquipmentProduct) => void;
  allProducts: EquipmentProduct[];
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onAddToCart,
  onToggleCompare,
  isCompared,
  onSelectRelated,
  allProducts,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'installation' | 'docs' | 'ai'>('specs');

  // Related products from same brand or category
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAskAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAskingAi(true);
    setAiAnswer(null);

    setTimeout(() => {
      setIsAskingAi(false);
      if (aiQuestion.includes('موتور') || aiQuestion.includes('کیلووات')) {
        setAiAnswer(
          `تحلیل مهندسی سیستم RAG برای ${product.model}:\nبرای یک الکتروموتور سه فاز ۴۰۰ ولت، جریان نامی هر کیلووات تقریباً ۲ آمپر در نظر گرفته می‌شود. کلید ${product.ratingAmps} آمپر با منحنی تریپ ${product.tripCurve || 'C'} برای الکتروموتورهای تا توان حداکثر ۱۱ تا ۱۵ کیلووات با راه‌اندازی نرم یا ستاره-مثلث مناسب است. در صورت راه‌اندازی مستقیم (DOL) به دلیل جریان هجومی اولیه (۵ تا ۷ برابر)، توصیه می‌شود از کلید تیپ D یا کلیدهای موتوری سری TeSys GV3 استفاده شود.`
        );
      } else if (aiQuestion.includes('شینه') || aiQuestion.includes('سیم') || aiQuestion.includes('کابل')) {
        setAiAnswer(
          `محاسبه سایز کابل بر اساس استانداردهای IEC 60364-5-52:\nبرای جریان کار دائمی ${product.ratingAmps} آمپر، حداقل سطح مقطع سیم مسی افشان برای فازها برابر با ۶ یا ۱۰ میلی‌متر مربع (بسته به روش نصب در داکت شیاردار یا لوله) پیشنهاد می‌گردد. همچنین گشتاور بستن پیچ ترمینال‌های ورودی این تجهیز برابر با ۳.۵ نیوتن‌متر (N.m) می‌باشد.`
        );
      } else {
        setAiAnswer(
          `بررسی فنی تجهیز ${product.name} (کد ${product.sku}):\nاین تجهیز منطبق با استانداردهای بین‌المللی ${product.complianceStd} بوده و با قدرت قطع نامی ${product.breakingCapacityKa} kA در سیستم‌های توزیع تابلو برق TN-S و TN-C-S قابل اطمینان است. محدوده دمای عملکرد مجاز از منفی ۳۵ تا مثبت ۷۰ درجه سانتی‌گراد ارزیابی شده است.`
        );
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0b1326] pb-24 text-[#dae2fd]">
      {/* Breadcrumb Navigation Bar */}
      <div className="border-b border-[#2d3449] bg-[#131b2e] px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#a08e7a]">
            <button onClick={onBack} className="hover:text-white flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">home</span>
              <span>کاتالوگ تجهیزات</span>
            </button>
            <span className="text-[#534434]">/</span>
            <span className="text-[#a08e7a]">{product.categoryLabel}</span>
            <span className="text-[#534434]">/</span>
            <span className="font-mono-num font-semibold text-[#ffc174] truncate max-w-[200px] sm:max-w-none">
              {product.model} ({product.sku})
            </span>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs text-[#ffc174] hover:underline"
          >
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
            <span>بازگشت به لیست</span>
          </button>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Product Photo & Mechanical Schematics (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Main Photo Card */}
            <div className="relative rounded-2xl border border-[#2d3449] bg-[#171f33] p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-lg bg-[#222a3d] px-2.5 py-1 text-xs font-bold text-[#ffc174] border border-[#2d3449]">
                  {product.brand} • {product.brandOrigin}
                </span>

                <span className="flex items-center gap-1 font-mono-num text-xs text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  {product.inStock ? 'موجود در انبار تهران' : 'استعلام بازرگانی'}
                </span>
              </div>

              {/* Photo */}
              <div className="relative flex h-72 w-full items-center justify-center rounded-xl bg-[#0b1326] p-4 border border-[#222a3d]">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain"
                />

                <div className="absolute bottom-3 right-3 flex gap-1.5">
                  <span className="rounded bg-[#171f33]/90 px-2 py-1 font-mono-num text-[11px] text-[#ffc174] border border-[#2d3449]">
                    {product.dinMount || 'DIN 35mm'}
                  </span>
                  <span className="rounded bg-[#171f33]/90 px-2 py-1 font-mono-num text-[11px] text-sky-400 border border-[#2d3449]">
                    {product.poles}
                  </span>
                </div>
              </div>

              {/* Action Under Image: Compare & 3D CAD */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  onClick={() => onToggleCompare(product)}
                  className={`flex flex-1 w-full items-center justify-center gap-1.5 rounded-xl border py-2.5 px-3 text-xs font-bold transition-all ${
                    isCompared
                      ? 'border-[#ffc174] bg-[#ffc174]/20 text-[#ffc174]'
                      : 'border-[#2d3449] bg-[#131b2e] text-[#dae2fd] hover:border-[#ffc174]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isCompared ? 'check_circle' : 'compare_arrows'}
                  </span>
                  <span>{isCompared ? 'در لیست مقایسه' : 'افزودن به مقایسه'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('installation')}
                  className={`flex flex-1 w-full items-center justify-center gap-1.5 rounded-xl border py-2.5 px-3 text-xs font-bold transition-all ${
                    activeTab === 'installation'
                      ? 'border-[#ffc174] bg-[#ffc174] text-[#472a00]'
                      : 'border-[#ffc174]/40 bg-[#ffc174]/10 text-[#ffc174] hover:bg-[#ffc174]/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                  <span>شماتیک ۳بعدی نصب Imagen</span>
                </button>
              </div>
            </div>

            {/* Interactive Terminal Schematics & Switch Mechanism */}
            <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-5">
              <div className="flex items-center justify-between mb-3 border-b border-[#222a3d] pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffc174]">electrical_services</span>
                  <h3 className="text-xs font-bold text-white">شماتیک ترمینال‌ها و کلیدزنی کنتاکت</h3>
                </div>

                {/* Interactive Toggle */}
                <button
                  onClick={() => setIsSwitchOn(!isSwitchOn)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-mono-num font-bold transition-all ${
                    isSwitchOn
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  <span>{isSwitchOn ? 'وضعیت: وصل (CLOSED)' : 'وضعیت: قطع (TRIPPED)'}</span>
                </button>
              </div>

              {/* Graphic Diagram */}
              <div className="cad-grid-dark rounded-xl p-4 border border-[#222a3d] text-center font-mono-num text-xs">
                {/* Top Input Terminals */}
                <div className="flex justify-around mb-4">
                  {['1/L1', '3/L2', '5/L3'].map((t) => (
                    <div key={t} className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full border-2 border-[#ffc174] bg-[#171f33] text-[10px] font-bold text-[#ffc174] flex items-center justify-center">
                        {t[0]}
                      </div>
                      <span className="text-[10px] text-[#a08e7a] mt-1">{t}</span>
                    </div>
                  ))}
                </div>

                {/* Mechanical Switch Contacts */}
                <div className="relative py-4 my-2 border-y border-dashed border-[#2d3449] flex justify-around">
                  {[1, 2, 3].map((pole) => (
                    <div key={pole} className="flex flex-col items-center h-12 justify-center">
                      <div className="w-0.5 h-3 bg-amber-400"></div>
                      <div
                        className={`w-6 h-0.5 bg-amber-400 transition-all duration-300 origin-left ${
                          isSwitchOn ? 'rotate-0' : '-rotate-45'
                        }`}
                      ></div>
                      <div className="w-0.5 h-3 bg-amber-400"></div>
                    </div>
                  ))}
                </div>

                {/* Bottom Output Terminals */}
                <div className="flex justify-around mt-4">
                  {['2/T1', '4/T2', '6/T3'].map((t) => (
                    <div key={t} className="flex flex-col items-center">
                      <span className="text-[10px] text-[#a08e7a] mb-1">{t}</span>
                      <div className="h-5 w-5 rounded-full border-2 border-sky-400 bg-[#171f33] text-[10px] font-bold text-sky-400 flex items-center justify-center">
                        {t[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-2 text-[11px] text-[#a08e7a] text-center">
                استاندارد نام‌گذاری ترمینال‌ها مطابق IEC 60445
              </p>
            </div>
          </div>

          {/* Right Column: Title, Specs Table, AI & Ordering (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header Block */}
            <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-6">
              <div className="flex items-center justify-between text-xs text-[#a08e7a]">
                <span className="font-mono-num">PART NUMBER: {product.sku}</span>
                <span className="font-mono-num">{product.complianceStd}</span>
              </div>

              <h1 className="mt-2 text-xl sm:text-2xl font-bold text-white leading-snug">
                {product.name}
              </h1>

              <p className="mt-3 text-sm text-[#d8c3ad] leading-relaxed">
                {product.description}
              </p>

              {/* Price & Order Control */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#131b2e] p-4 border border-[#222a3d]">
                <div>
                  <div className="text-xs text-[#a08e7a]">{product.priceNote}</div>
                  <div className="flex items-baseline gap-1.5 font-mono-num text-2xl font-bold text-white mt-0.5">
                    {product.unitPrice > 0 ? (
                      <>
                        <span>{product.unitPrice.toLocaleString('fa-IR')}</span>
                        <span className="text-xs font-normal text-[#a08e7a]">تومان / هر عدد</span>
                      </>
                    ) : (
                      <span className="text-base text-amber-400">استعلام برخط قیمت بازار</span>
                    )}
                  </div>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-[#2d3449] bg-[#171f33] p-1 font-mono-num">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-[#dae2fd] hover:bg-[#222a3d]"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-white text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-[#dae2fd] hover:bg-[#222a3d]"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => onAddToCart(product, quantity)}
                    className="flex items-center gap-2 rounded-xl bg-[#ffc174] px-5 py-3 text-xs font-bold text-[#472a00] hover:bg-[#ffb95f] transition-all shadow-lg shadow-[#ffc174]/20"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    <span>افزودن به سبد استعلام BOM</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Technical Tabs Selector */}
            <div className="flex border-b border-[#2d3449] gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('specs')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-colors border-b-2 shrink-0 ${
                  activeTab === 'specs'
                    ? 'border-[#ffc174] text-[#ffc174]'
                    : 'border-transparent text-[#a08e7a] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>مشخصات پارامتریک EAV</span>
              </button>

              <button
                onClick={() => setActiveTab('installation')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-colors border-b-2 shrink-0 ${
                  activeTab === 'installation'
                    ? 'border-[#ffc174] text-[#ffc174]'
                    : 'border-transparent text-[#a08e7a] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                <span>راهنمای نصب سه‌بعدی (Imagen)</span>
                <span className="rounded bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-1.5 py-0.5 font-mono-num text-[10px] text-[#ffc174] border border-[#ffc174]/40 font-black">
                  3D CAD
                </span>
              </button>

              <button
                onClick={() => setActiveTab('docs')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-colors border-b-2 shrink-0 ${
                  activeTab === 'docs'
                    ? 'border-[#ffc174] text-[#ffc174]'
                    : 'border-transparent text-[#a08e7a] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">description</span>
                <span>دیتاشیت و مدارک فنی</span>
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-colors border-b-2 shrink-0 ${
                  activeTab === 'ai'
                    ? 'border-[#ffc174] text-[#ffc174]'
                    : 'border-transparent text-[#a08e7a] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">psychology</span>
                <span>مشاور هوش مصنوعی مهندسی</span>
                <span className="rounded bg-sky-500/20 px-1 font-mono-num text-[10px] text-sky-400">RAG</span>
              </button>
            </div>

            {/* Tab 1: EAV Technical Specs Matrix */}
            {activeTab === 'specs' && (
              <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] overflow-hidden">
                <div className="border-b border-[#222a3d] bg-[#131b2e] px-4 py-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-white">جدول پارامترهای مهندسی بر اساس استاندارد IEC</span>
                  <span className="font-mono-num text-[11px] text-[#a08e7a]">SCHEMA: IEC-60947-STD</span>
                </div>

                <div className="divide-y divide-[#222a3d] text-xs">
                  {product.eavSpecs.map((spec) => (
                    <div
                      key={spec.key}
                      className={`grid grid-cols-12 px-4 py-3 items-center ${
                        spec.isHighlight ? 'bg-[#ffc174]/5' : ''
                      }`}
                    >
                      <div className="col-span-5 text-[#d8c3ad] font-medium flex items-center gap-1.5">
                        {spec.isHighlight && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#ffc174]"></span>
                        )}
                        <span>{spec.label}</span>
                      </div>
                      <div className="col-span-7 font-mono-num text-left font-semibold text-white">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Imagen 3D Installation Guide & Assembly Schematics */}
            {activeTab === 'installation' && (
              <ProductInstallationGuide product={product} />
            )}

            {/* Tab 2: Technical Documents & Downloads */}
            {activeTab === 'docs' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-[#2d3449] bg-[#171f33] p-4 hover:border-[#ffc174] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <span className="material-symbols-outlined">picture_as_pdf</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">دیتاشیت رسمی Schneider Electric {product.model}</h4>
                      <p className="text-[11px] text-[#a08e7a] font-mono-num">PDF • 4.8 MB • IEC/EN 60898-1 Certified</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 rounded-lg bg-[#131b2e] px-3 py-1.5 text-xs text-[#ffc174] border border-[#2d3449] hover:bg-[#222a3d]">
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>دانلود PDF</span>
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[#2d3449] bg-[#171f33] p-4 hover:border-[#ffc174] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      <span className="material-symbols-outlined">view_in_ar</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">مدل سه‌بعدی و ماکرو EPLAN Pro Panel</h4>
                      <p className="text-[11px] text-[#a08e7a] font-mono-num">STEP / DWG 2D/3D • 12.2 MB</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 rounded-lg bg-[#131b2e] px-3 py-1.5 text-xs text-[#ffc174] border border-[#2d3449] hover:bg-[#222a3d]">
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>دریافت CAD</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: AI Consultation */}
            {activeTab === 'ai' && (
              <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs text-sky-400">
                  <span className="material-symbols-outlined">psychology</span>
                  <span className="font-bold">مشاور هوشمند محاسبات مدار و تطابق بار</span>
                </div>
                <p className="text-xs text-[#d8c3ad]">
                  می‌توانید درباره محاسبات جریان راه‌اندازی، سایزینگ کابل و فیوز، انتخاب رله بی‌متال و شرایط نصب از مشاور مهندسی بپرسید.
                </p>

                {/* Question form */}
                <form onSubmit={handleAskAi} className="space-y-3">
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      placeholder="مثال: آیا این کلید برای موتور ۱۵ کیلووات مناسب است؟ یا سایز کابل پیشنهادی چقدر است؟"
                      className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-3 text-xs text-white placeholder-[#a08e7a] focus:border-[#ffc174] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAiQuestion('آیا این کلید برای الکتروموتور ۱۵ کیلووات مناسب است؟')}
                        className="rounded bg-[#131b2e] px-2 py-1 text-[10px] text-[#ffc174] border border-[#2d3449]"
                      >
                        تطابق موتور ۱۵kW
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiQuestion('سایز کابل و گشتاور پیچ ترمینال چقدر است؟')}
                        className="rounded bg-[#131b2e] px-2 py-1 text-[10px] text-sky-400 border border-[#2d3449]"
                      >
                        سایز کابل استاندارد
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isAskingAi || !aiQuestion.trim()}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#ffc174] to-[#f59e0b] px-4 py-2 text-xs font-bold text-[#472a00] disabled:opacity-50"
                    >
                      {isAskingAi ? (
                        <span>در حال تحلیل...</span>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">send</span>
                          <span>استعلام هوشمند</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* AI Answer Box */}
                {aiAnswer && (
                  <div className="rounded-xl border border-sky-500/30 bg-sky-950/30 p-4 text-xs text-sky-100 whitespace-pre-line leading-relaxed">
                    {aiAnswer}
                  </div>
                )}
              </div>
            )}

            {/* Related & Complementary Equipment */}
            <div className="pt-4 border-t border-[#222a3d]">
              <h3 className="text-xs font-bold text-white mb-3">تجهیزات مکمل و لوازم جانبی پیشنهادی</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="flex flex-col justify-between rounded-xl border border-[#2d3449] bg-[#131b2e] p-3 cursor-pointer hover:border-[#ffc174] transition-colors"
                  >
                    <div>
                      <span className="font-mono-num text-[10px] text-[#a08e7a]">{rel.brand}</span>
                      <h4 className="text-xs font-bold text-white line-clamp-2 mt-0.5">{rel.name}</h4>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="font-mono-num text-[#ffc174]">{rel.ratingAmps} A</span>
                      <span className="text-[10px] text-[#a08e7a]">مشاهده &gt;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
