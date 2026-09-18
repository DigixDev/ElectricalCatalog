import React, { useState, useMemo } from 'react';
import { EquipmentProduct } from '../types';

interface CatalogViewProps {
  products: EquipmentProduct[];
  onSelectProduct: (product: EquipmentProduct) => void;
  onAddToCart: (product: EquipmentProduct) => void;
  compareList: EquipmentProduct[];
  onToggleCompare: (product: EquipmentProduct) => void;
  onGoToCompare: () => void;
  onClearCompare: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  compareList,
  onToggleCompare,
  onGoToCompare,
  onClearCompare,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedPole, setSelectedPole] = useState<string>('all');
  const [selectedBreaking, setSelectedBreaking] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [listDensity, setListDensity] = useState<'compact' | 'detailed'>('detailed');

  // Categories list
  const categories = [
    { id: 'all', label: 'همه دسته‌ها', icon: 'apps' },
    { id: 'mcb', label: 'کلید مینیاتوری MCB', icon: 'power_settings_new' },
    { id: 'mccb', label: 'کلید اتوماتیک MCCB', icon: 'toggle_on' },
    { id: 'contactor', label: 'کنتاکتور صنعتی', icon: 'electric_meter' },
    { id: 'relay', label: 'بی‌متال و رله', icon: 'shield' },
  ];

  // Brands list
  const brands = [
    { id: 'all', label: 'همه برندها' },
    { id: 'Schneider Electric', label: 'اشنایدر (Schneider)' },
    { id: 'Siemens', label: 'زیمنس (Siemens)' },
    { id: 'Hyundai Electric', label: 'هیوندای (Hyundai)' },
    { id: 'LS Electric', label: 'ال‌اس (LS Electric)' },
  ];

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand;
      const matchesStock = !inStockOnly || p.inStock;
      const matchesPole = selectedPole === 'all' || p.poles.includes(selectedPole);
      const matchesBreaking =
        selectedBreaking === 'all' || p.breakingCapacityKa.toString() === selectedBreaking;

      return matchesSearch && matchesCat && matchesBrand && matchesStock && matchesPole && matchesBreaking;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, inStockOnly, selectedPole, selectedBreaking]);

  const isProductInCompare = (id: string) => compareList.some((item) => item.id === id);

  return (
    <div className="min-h-screen bg-[#0b1326] pb-24">
      {/* Hero Technical Section */}
      <section className="border-b border-[#2d3449] bg-gradient-to-b from-[#131b2e] to-[#0b1326] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded bg-[#ffc174]/15 px-2 py-0.5 font-mono-num text-xs font-bold text-[#ffc174] border border-[#ffc174]/30">
                  SYSTEM EAV V4.2
                </span>
                <span className="text-xs text-[#a08e7a]">استانداردهای مهندسی IEC 60947 و IEC 60898</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                کاتالوگ پارامتریک تجهیزات تابلو برق صنعتی
              </h1>
              <p className="mt-1 text-sm text-[#d8c3ad] max-w-2xl">
                دسترسی مستقیم به مشخصات فنی، نقشه‌های CAD، دیتاشیت‌های تایید شده KEMA و استعلام برخط اقلام تابلویی
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 bg-[#171f33] p-3 rounded-xl border border-[#2d3449]">
              <div className="text-center px-3 border-l border-[#2d3449]">
                <div className="font-mono-num text-lg font-bold text-[#ffc174]">{products.length}</div>
                <div className="text-[11px] text-[#a08e7a]">اقلام فعال</div>
              </div>
              <div className="text-center px-3 border-l border-[#2d3449]">
                <div className="font-mono-num text-lg font-bold text-emerald-400">۱۰۰٪</div>
                <div className="text-[11px] text-[#a08e7a]">تطابق IEC</div>
              </div>
              <div className="text-center px-3">
                <div className="font-mono-num text-lg font-bold text-sky-400">CAD/DWG</div>
                <div className="text-[11px] text-[#a08e7a]">ماکرو آماده</div>
              </div>
            </div>
          </div>

          {/* Search Bar & Auto-Complete */}
          <div className="mt-6 relative">
            <div className="flex items-center rounded-xl border-2 border-[#2d3449] bg-[#171f33] px-4 py-2.5 shadow-lg focus-within:border-[#ffc174] transition-all">
              <span className="material-symbols-outlined text-2xl text-[#a08e7a] ml-3">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی کد پارت‌نامبر، تیپ کلید، توان کیلووات یا جریان نامی (مثلاً A9F74332 یا 32A یا SIRIUS)..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-[#a08e7a] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-[#a08e7a] hover:text-white"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1.5 border-r border-[#2d3449] pr-3 mr-2">
                <span className="font-mono-num text-[11px] text-[#a08e7a] bg-[#0b1326] px-2 py-0.5 rounded border border-[#2d3449]">
                  CTRL + K
                </span>
              </div>
            </div>

            {/* Quick search keywords suggestion */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#a08e7a]">
              <span>پیشنهادات پرکاربرد:</span>
              {['Acti9 iC60N', 'SIRIUS 3RT2026', 'HGM125S', 'LC1D32M7', '32A', '220VAC'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="rounded bg-[#171f33] px-2 py-0.5 font-mono-num text-[11px] text-[#ffc174] hover:bg-[#222a3d] border border-[#2d3449] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Category Rails & Products */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'border-[#ffc174] bg-[#ffc174] text-[#472a00] shadow-md shadow-[#ffc174]/20'
                  : 'border-[#2d3449] bg-[#171f33] text-[#d8c3ad] hover:border-[#534434] hover:bg-[#222a3d]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Parametric Filters Toolbar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#2d3449] bg-[#131b2e] p-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Brand Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#a08e7a]">برند:</span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="rounded-lg border border-[#2d3449] bg-[#171f33] px-2.5 py-1 text-xs text-[#dae2fd] focus:border-[#ffc174] focus:outline-none"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Poles Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#a08e7a]">تعداد پل:</span>
              <select
                value={selectedPole}
                onChange={(e) => setSelectedPole(e.target.value)}
                className="rounded-lg border border-[#2d3449] bg-[#171f33] px-2.5 py-1 text-xs text-[#dae2fd] focus:border-[#ffc174] focus:outline-none"
              >
                <option value="all">همه</option>
                <option value="1P">تک‌پل (1P)</option>
                <option value="3P">سه پل (3P)</option>
              </select>
            </div>

            {/* Breaking Capacity */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#a08e7a]">قدرت قطع (kA):</span>
              <select
                value={selectedBreaking}
                onChange={(e) => setSelectedBreaking(e.target.value)}
                className="rounded-lg border border-[#2d3449] bg-[#171f33] px-2.5 py-1 text-xs text-[#dae2fd] focus:border-[#ffc174] focus:outline-none"
              >
                <option value="all">همه</option>
                <option value="6">6 kA</option>
                <option value="10">10 kA</option>
                <option value="36">36 kA</option>
              </select>
            </div>

            {/* In Stock Switch */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 rounded border-[#534434] bg-[#171f33] text-[#ffc174] focus:ring-0"
              />
              <span className="text-[#dae2fd]">فقط کالاهای موجود در انبار</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode & Density Switcher */}
            <div className="flex items-center gap-1.5 rounded-xl border border-[#2d3449] bg-[#171f33] p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#ffc174] text-[#472a00] shadow-sm'
                    : 'text-[#a08e7a] hover:text-white'
                }`}
                title="نمایش شبکه‌ای (گرید)"
              >
                <span className="material-symbols-outlined text-[17px]">grid_view</span>
                <span>گرید</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#ffc174] text-[#472a00] shadow-sm'
                    : 'text-[#a08e7a] hover:text-white'
                }`}
                title="نمایش فهرستی / تابلویی (لیست)"
              >
                <span className="material-symbols-outlined text-[17px]">view_list</span>
                <span>لیست مهندسی</span>
              </button>

              {/* Density toggle when in list mode */}
              {viewMode === 'list' && (
                <div className="mr-1 flex items-center border-r border-[#2d3449] pr-1.5 gap-1">
                  <button
                    type="button"
                    onClick={() => setListDensity('detailed')}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition-colors ${
                      listDensity === 'detailed'
                        ? 'bg-[#ffc174]/20 text-[#ffc174] border border-[#ffc174]/40'
                        : 'text-[#a08e7a] hover:text-white'
                    }`}
                    title="تراکم استاندارد با تصاویر و تمام فیلدها"
                  >
                    استاندارد
                  </button>
                  <button
                    type="button"
                    onClick={() => setListDensity('compact')}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition-colors ${
                      listDensity === 'compact'
                        ? 'bg-[#ffc174]/20 text-[#ffc174] border border-[#ffc174]/40'
                        : 'text-[#a08e7a] hover:text-white'
                    }`}
                    title="تراکم فشرده جدولی برای بررسی سریع"
                  >
                    فشرده (جدولی)
                  </button>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-1.5 text-[#a08e7a] font-mono-num text-[11px] whitespace-nowrap">
              <span>تعداد نتایج:</span>
              <span className="font-bold text-[#ffc174]">{filteredProducts.length}</span>
              <span>مورد</span>
            </div>
          </div>
        </div>

        {/* --- VIEW MODE 1: GRID VIEW --- */}
        {viewMode === 'grid' && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product) => {
              const inCompare = isProductInCompare(product.id);

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[#2d3449] bg-[#171f33] p-4 transition-all duration-200 hover:border-[#ffc174]/70 hover:shadow-xl hover:shadow-[#0b1326]/60"
                >
                  {/* Card Header & Brand Origin */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#a08e7a] mb-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#222a3d] px-2 py-0.5 font-semibold text-[#ffc174] border border-[#2d3449]">
                          {product.brand}
                        </span>
                        <span className="text-[11px] text-[#a08e7a]">{product.brandOrigin}</span>
                      </div>

                      {/* Compare Checkbox */}
                      <label
                        onClick={(e) => e.stopPropagation()}
                        className={`flex items-center gap-1.5 rounded-lg border px-2 py-0.5 cursor-pointer select-none transition-colors ${
                          inCompare
                            ? 'border-[#ffc174] bg-[#ffc174]/15 text-[#ffc174]'
                            : 'border-[#2d3449] bg-[#131b2e] text-[#a08e7a] hover:text-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={inCompare}
                          onChange={() => onToggleCompare(product)}
                          className="h-3.5 w-3.5 rounded border-[#534434] bg-[#171f33] text-[#ffc174] focus:ring-0"
                        />
                        <span className="text-[11px]">مقایسه</span>
                      </label>
                    </div>

                    {/* Image Container */}
                    <div
                      onClick={() => onSelectProduct(product)}
                      className="relative flex h-48 w-full items-center justify-center rounded-xl bg-[#0b1326] p-3 cursor-pointer overflow-hidden border border-[#222a3d] group-hover:border-[#ffc174]/30"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Stock Badge Overlay */}
                      <div className="absolute top-2 right-2">
                        {product.inStock ? (
                          <span className="flex items-center gap-1 rounded-md bg-emerald-950/80 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                            موجود در انبار
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-md bg-amber-950/80 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-500/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                            استعلام بازرگانی
                          </span>
                        )}
                      </div>

                      {/* Compliance standard badge */}
                      <div className="absolute bottom-2 left-2">
                        <span className="rounded bg-[#171f33]/90 px-1.5 py-0.5 font-mono-num text-[10px] text-[#a08e7a] border border-[#2d3449]">
                          {product.complianceStd}
                        </span>
                      </div>
                    </div>

                    {/* Product Title & Model */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between gap-1 font-mono-num text-xs text-[#a08e7a]">
                        <span>SKU: {product.sku}</span>
                        <span>{product.model}</span>
                      </div>
                      <h2
                        onClick={() => onSelectProduct(product)}
                        className="mt-1 text-sm sm:text-base font-bold text-white hover:text-[#ffc174] cursor-pointer transition-colors line-clamp-2"
                      >
                        {product.name}
                      </h2>
                    </div>

                    {/* Parametric Technical Specs Matrix */}
                    <div className="mt-3 grid grid-cols-2 gap-1.5 rounded-lg bg-[#131b2e] p-2 text-[11px] border border-[#222a3d]">
                      <div className="flex items-center justify-between text-[#d8c3ad]">
                        <span className="text-[#a08e7a]">جریان نامی:</span>
                        <span className="font-mono-num font-bold text-[#ffc174]">
                          {product.ratingAmps} A
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[#d8c3ad]">
                        <span className="text-[#a08e7a]">قدرت قطع:</span>
                        <span className="font-mono-num font-bold text-sky-400">
                          {product.breakingCapacityKa} kA
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[#d8c3ad]">
                        <span className="text-[#a08e7a]">پل‌ها:</span>
                        <span className="font-mono-num">{product.poles}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#d8c3ad]">
                        <span className="text-[#a08e7a]">ولتاژ / بوبین:</span>
                        <span className="font-mono-num text-emerald-400 truncate max-w-[80px]">
                          {product.coilVoltage || product.voltage}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Pricing & Actions */}
                  <div className="mt-4 pt-3 border-t border-[#222a3d]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-[11px] text-[#a08e7a]">{product.priceNote}</div>
                        <div className="flex items-baseline gap-1 font-mono-num font-bold text-base text-white">
                          {product.unitPrice > 0 ? (
                            <>
                              <span>{product.unitPrice.toLocaleString('fa-IR')}</span>
                              <span className="text-xs font-normal text-[#a08e7a]">تومان</span>
                            </>
                          ) : (
                            <span className="text-xs text-amber-400">استعلام برخط</span>
                          )}
                        </div>
                      </div>
                      <div className="text-left text-[11px] text-[#a08e7a]">
                        <div>وزن تخمینی:</div>
                        <div className="font-mono-num">{product.weightKg} kg</div>
                      </div>
                    </div>

                    {/* Button Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="flex items-center justify-center gap-1 rounded-xl border border-[#2d3449] bg-[#131b2e] py-2 text-xs font-medium text-[#dae2fd] hover:border-[#ffc174] hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        <span>مشخصات فنی</span>
                      </button>

                      <button
                        onClick={() => onAddToCart(product)}
                        className="flex items-center justify-center gap-1 rounded-xl bg-[#ffc174] py-2 text-xs font-bold text-[#472a00] hover:bg-[#ffb95f] transition-all shadow-md shadow-[#ffc174]/15"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                        <span>افزودن به BOM</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- VIEW MODE 2: DETAILED LIST VIEW --- */}
        {viewMode === 'list' && listDensity === 'detailed' && (
          <div className="mt-6 space-y-3">
            {filteredProducts.map((product) => {
              const inCompare = isProductInCompare(product.id);

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col md:flex-row items-start md:items-center justify-between rounded-2xl border border-[#2d3449] bg-[#171f33] p-4 gap-4 transition-all duration-200 hover:border-[#ffc174]/70 hover:shadow-lg hover:shadow-[#0b1326]/50"
                >
                  {/* Left Column: Checkbox, Thumbnail & Basic Details */}
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0 w-full">
                    {/* Compare Checkbox */}
                    <div className="pt-1 sm:pt-0">
                      <label
                        onClick={(e) => e.stopPropagation()}
                        className={`flex items-center justify-center cursor-pointer p-1.5 rounded-lg border transition-colors ${
                          inCompare
                            ? 'border-[#ffc174] bg-[#ffc174]/15 text-[#ffc174]'
                            : 'border-[#2d3449] bg-[#131b2e] text-[#a08e7a] hover:text-white'
                        }`}
                        title="افزودن به لیست مقایسه فنی"
                      >
                        <input
                          type="checkbox"
                          checked={inCompare}
                          onChange={() => onToggleCompare(product)}
                          className="h-4 w-4 rounded border-[#534434] bg-[#131b2e] text-[#ffc174] focus:ring-0 cursor-pointer"
                        />
                      </label>
                    </div>

                    {/* Thumbnail Image */}
                    <div
                      onClick={() => onSelectProduct(product)}
                      className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-[#0b1326] border border-[#2d3449] p-2 flex items-center justify-center cursor-pointer group-hover:border-[#ffc174]/50 transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      {product.hasCad && (
                        <span className="absolute bottom-1 left-1 rounded bg-amber-500/30 px-1 py-0.2 font-mono-num text-[9px] text-[#ffc174] border border-[#ffc174]/40 font-bold">
                          CAD
                        </span>
                      )}
                    </div>

                    {/* Info & Badges */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="rounded bg-[#222a3d] px-2 py-0.5 font-semibold text-xs text-[#ffc174] border border-[#2d3449]">
                          {product.brand}
                        </span>
                        <span className="font-mono-num text-xs text-[#a08e7a] bg-[#131b2e] px-2 py-0.5 rounded border border-[#2d3449]">
                          SKU: {product.sku}
                        </span>
                        <span className="text-[11px] text-[#a08e7a] hidden sm:inline">
                          مدل: {product.model}
                        </span>
                        <div className="flex items-center gap-1 rounded-md bg-[#131b2e] px-2 py-0.5 text-[11px] border border-[#2d3449]">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              product.inStock ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                            }`}
                          />
                          <span className="text-white text-[10px]">
                            {product.inStock
                              ? `موجود (${product.stockLocation})`
                              : 'استعلام بازرگانی'}
                          </span>
                        </div>
                      </div>

                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="text-sm sm:text-base font-bold text-white hover:text-[#ffc174] cursor-pointer transition-colors line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-[#a08e7a] line-clamp-1 mt-0.5 hidden lg:block">
                        {product.description}
                      </p>

                      {/* Technical Specs Tags Row */}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#131b2e] px-2 py-0.5 text-[11px] border border-[#222a3d] text-[#d8c3ad]">
                          <span className="text-[#a08e7a]">جریان:</span>
                          <span className="font-mono-num font-bold text-[#ffc174]">{product.ratingAmps} A</span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#131b2e] px-2 py-0.5 text-[11px] border border-[#222a3d] text-[#d8c3ad]">
                          <span className="text-[#a08e7a]">قدرت قطع:</span>
                          <span className="font-mono-num font-bold text-sky-400">{product.breakingCapacityKa} kA</span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#131b2e] px-2 py-0.5 text-[11px] border border-[#222a3d] text-[#d8c3ad]">
                          <span className="text-[#a08e7a]">پل‌ها:</span>
                          <span className="font-mono-num text-white">{product.poles}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#131b2e] px-2 py-0.5 text-[11px] border border-[#222a3d] text-[#d8c3ad]">
                          <span className="text-[#a08e7a]">ولتاژ:</span>
                          <span className="font-mono-num text-emerald-400">{product.coilVoltage || product.voltage}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#131b2e] px-2 py-0.5 text-[11px] border border-[#222a3d] text-[#a08e7a] hidden sm:inline-flex">
                          <span>استاندارد:</span>
                          <span className="text-white">{product.complianceStd}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Pricing & Fast Action Buttons */}
                  <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-[#222a3d] shrink-0">
                    <div className="text-right md:text-left min-w-[120px]">
                      <div className="text-[11px] text-[#a08e7a]">{product.priceNote}</div>
                      <div className="flex items-baseline gap-1 font-mono-num font-bold text-base text-white">
                        {product.unitPrice > 0 ? (
                          <>
                            <span>{product.unitPrice.toLocaleString('fa-IR')}</span>
                            <span className="text-xs font-normal text-[#a08e7a]">تومان</span>
                          </>
                        ) : (
                          <span className="text-xs text-amber-400">استعلام برخط</span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#a08e7a] font-mono-num">
                        وزن: {product.weightKg} kg
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="flex items-center justify-center gap-1 rounded-xl border border-[#2d3449] bg-[#131b2e] px-3 py-2 text-xs font-medium text-[#dae2fd] hover:border-[#ffc174] hover:text-white transition-colors"
                        title="مشاهده اطلاعات فنی، شماتیک 3D و اسناد"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        <span className="hidden sm:inline">مشخصات</span>
                      </button>

                      <button
                        onClick={() => onAddToCart(product)}
                        className="flex items-center justify-center gap-1 rounded-xl bg-[#ffc174] px-3.5 py-2 text-xs font-bold text-[#472a00] hover:bg-[#ffb95f] transition-all shadow-md shadow-[#ffc174]/15 whitespace-nowrap"
                        title="افزودن به لیست اقلام تابلو (BOM)"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                        <span>افزودن به BOM</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- VIEW MODE 3: COMPACT TABLE LIST VIEW --- */}
        {viewMode === 'list' && listDensity === 'compact' && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#2d3449] bg-[#171f33] shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#2d3449] bg-[#131b2e] text-[#a08e7a]">
                    <th className="py-3 px-3 text-center w-10">مقایسه</th>
                    <th className="py-3 px-3 w-16 text-center">تصویر</th>
                    <th className="py-3 px-4 font-semibold text-white">کد کالا / مدل و نام تجهیز</th>
                    <th className="py-3 px-3 font-semibold">برند</th>
                    <th className="py-3 px-3 font-semibold text-center font-mono-num">جریان (In)</th>
                    <th className="py-3 px-3 font-semibold text-center font-mono-num">قدرت قطع (Icu)</th>
                    <th className="py-3 px-3 font-semibold text-center">پل</th>
                    <th className="py-3 px-3 font-semibold">ولتاژ / بوبین</th>
                    <th className="py-3 px-3 font-semibold text-center">انبار</th>
                    <th className="py-3 px-4 font-semibold text-left">قیمت واحد (تومان)</th>
                    <th className="py-3 px-3 text-center w-28">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222a3d]">
                  {filteredProducts.map((product) => {
                    const inCompare = isProductInCompare(product.id);

                    return (
                      <tr
                        key={product.id}
                        className="group hover:bg-[#1a233a] transition-colors"
                      >
                        {/* Compare Checkbox */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={inCompare}
                            onChange={() => onToggleCompare(product)}
                            className="h-3.5 w-3.5 rounded border-[#534434] bg-[#131b2e] text-[#ffc174] focus:ring-0 cursor-pointer"
                            title="مقایسه"
                          />
                        </td>

                        {/* Tiny Thumbnail */}
                        <td className="py-2 px-3 text-center">
                          <div
                            onClick={() => onSelectProduct(product)}
                            className="h-9 w-9 mx-auto rounded-lg bg-[#0b1326] border border-[#2d3449] p-1 flex items-center justify-center cursor-pointer group-hover:border-[#ffc174]/50"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="max-h-full max-w-full object-contain"
                              loading="lazy"
                            />
                          </div>
                        </td>

                        {/* Name & SKU */}
                        <td className="py-2.5 px-4 min-w-[200px]">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-mono-num text-[11px] font-bold text-[#ffc174]">
                              {product.sku}
                            </span>
                            <span className="text-[11px] text-[#a08e7a]">
                              ({product.model})
                            </span>
                            {product.hasCad && (
                              <span className="rounded bg-amber-500/20 px-1 font-mono-num text-[9px] text-[#ffc174] border border-[#ffc174]/40 font-bold">
                                3D
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => onSelectProduct(product)}
                            className="font-medium text-white hover:text-[#ffc174] text-right truncate block max-w-[280px] sm:max-w-[340px]"
                            title={product.name}
                          >
                            {product.name}
                          </button>
                        </td>

                        {/* Brand */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="rounded bg-[#222a3d] px-2 py-0.5 text-[11px] font-semibold text-[#ffc174] border border-[#2d3449]">
                            {product.brand}
                          </span>
                        </td>

                        {/* Rated Amps */}
                        <td className="py-2.5 px-3 text-center font-mono-num font-bold text-[#ffc174] whitespace-nowrap">
                          {product.ratingAmps} A
                        </td>

                        {/* Breaking Capacity */}
                        <td className="py-2.5 px-3 text-center font-mono-num font-bold text-sky-400 whitespace-nowrap">
                          {product.breakingCapacityKa} kA
                        </td>

                        {/* Poles */}
                        <td className="py-2.5 px-3 text-center font-mono-num text-white whitespace-nowrap">
                          {product.poles}
                        </td>

                        {/* Voltage / Coil */}
                        <td className="py-2.5 px-3 text-emerald-400 font-mono-num text-[11px] whitespace-nowrap">
                          {product.coilVoltage || product.voltage}
                        </td>

                        {/* Stock */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                              product.inStock
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                product.inStock ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                              }`}
                            />
                            {product.inStock ? product.stockLocation : 'استعلام'}
                          </span>
                        </td>

                        {/* Unit Price */}
                        <td className="py-2.5 px-4 text-left whitespace-nowrap">
                          {product.unitPrice > 0 ? (
                            <div className="font-mono-num font-bold text-white">
                              {product.unitPrice.toLocaleString('fa-IR')}{' '}
                              <span className="text-[10px] text-[#a08e7a] font-normal">تومان</span>
                            </div>
                          ) : (
                            <span className="text-amber-400 text-[11px]">استعلام برخط</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => onSelectProduct(product)}
                              className="rounded-lg p-1.5 text-[#dae2fd] hover:bg-[#222a3d] hover:text-[#ffc174] transition-colors"
                              title="مشاهده جزئیات و مشخصات فنی"
                            >
                              <span className="material-symbols-outlined text-[17px]">visibility</span>
                            </button>
                            <button
                              onClick={() => onAddToCart(product)}
                              className="flex items-center gap-1 rounded-lg bg-[#ffc174] px-2 py-1 text-[11px] font-bold text-[#472a00] hover:bg-[#ffb95f] transition-all"
                              title="افزودن به سبد / BOM"
                            >
                              <span className="material-symbols-outlined text-[15px]">add</span>
                              <span>BOM</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty Search Result Fallback */}
        {filteredProducts.length === 0 && (
          <div className="my-12 rounded-2xl border border-dashed border-[#2d3449] bg-[#131b2e] p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-[#a08e7a]">search_off</span>
            <h3 className="mt-3 text-lg font-bold text-white">هیچ تجهیز مطابق با فیلتر یافت نشد</h3>
            <p className="mt-1 text-sm text-[#a08e7a]">
              لطفاً عبارات جستجو یا فیلترهای برند و تعداد پل را تغییر دهید.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedBrand('all');
                setSelectedPole('all');
                setSelectedBreaking('all');
                setInStockOnly(false);
              }}
              className="mt-4 rounded-xl bg-[#ffc174] px-4 py-2 text-xs font-bold text-[#472a00]"
            >
              پاک کردن همه فیلترها
            </button>
          </div>
        )}
      </div>

      {/* Floating Compare Action Bar */}
      {compareList.length > 0 && (
        <aside aria-label="مقایسه فنی تجهیزات" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 rounded-2xl border-2 border-[#ffc174] bg-[#171f33]/95 px-5 py-3 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffc174]">compare_arrows</span>
            <span className="text-sm font-bold text-white">
              <span className="font-mono-num font-extrabold text-[#ffc174] ml-1">
                {compareList.length}
              </span>
              تجهیز در ماتریس مقایسه
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToCompare}
              className="flex items-center gap-1.5 rounded-xl bg-[#ffc174] px-4 py-2 text-xs font-bold text-[#472a00] hover:bg-[#ffb95f] transition-all shadow-md"
            >
              <span>مشاهده جدول مقایسه</span>
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>

            <button
              onClick={onClearCompare}
              className="rounded-xl border border-[#2d3449] bg-[#131b2e] px-3 py-2 text-xs text-[#a08e7a] hover:text-white hover:border-[#534434]"
              title="پاک کردن لیست مقایسه"
            >
              <span className="material-symbols-outlined text-base">delete</span>
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};
