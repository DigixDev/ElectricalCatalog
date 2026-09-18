import React, { useState } from 'react';
import { EquipmentProduct } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockData';

export interface WarehouseStockStatus {
  sku: string;
  centralWarehouseQty: number; // انبار مرکزی شمس‌آباد تهران
  tehranBazaarQty: number;     // انبار لاله زار تهران
  shelfLocation: string;       // کد لوکیشن قفسه در انبار
  status: 'available' | 'low_stock' | 'out_of_stock' | 'in_rfq';
  statusText: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  icon: string;
  replacements: EquipmentProduct[];
  estimatedRestockDays?: number;
  lastUpdated: string;
}

// Function to calculate or retrieve live central warehouse inventory and smart replacements
export function getLiveWarehouseStock(product: EquipmentProduct, requestedQty: number): WarehouseStockStatus {
  // Deterministic mock logic based on product properties
  let centralWarehouseQty = 0;
  let tehranBazaarQty = 0;
  let shelfLocation = 'قفسه عمومی B-02';
  let status: 'available' | 'low_stock' | 'out_of_stock' | 'in_rfq' = 'available';

  if (product.id === 'prod-6') { // NSX250F
    centralWarehouseQty = 14;
    tehranBazaarQty = 6;
    shelfLocation = 'سالن A - راهرو ۴ - پالت ۱۲';
    status = 'available';
  } else if (product.id === 'prod-8') { // LC1D32M7
    centralWarehouseQty = 38;
    tehranBazaarQty = 25;
    shelfLocation = 'سالن C - قفسه A-14';
    status = 'available';
  } else if (product.id === 'prod-9') { // A9F74116
    centralWarehouseQty = 2; // Low stock
    tehranBazaarQty = 0;
    shelfLocation = 'انبار لاله زار (در حال تخلیه بار)';
    status = 'low_stock';
  } else if (product.id === 'prod-4') { // MT-32
    centralWarehouseQty = 0;
    tehranBazaarQty = 0;
    shelfLocation = 'ناموجود - نیازمند استعلام بازرگانی';
    status = 'out_of_stock';
  } else if (product.id === 'prod-1') { // A9F74332
    centralWarehouseQty = 120;
    tehranBazaarQty = 45;
    shelfLocation = 'سالن B - قفسه MCB-07';
    status = 'available';
  } else if (product.id === 'prod-2') { // 3RT2026
    centralWarehouseQty = 28;
    tehranBazaarQty = 12;
    shelfLocation = 'سالن A - قفسه Siemens-03';
    status = 'available';
  } else if (product.id === 'prod-7') { // 5SY4332-7
    centralWarehouseQty = 65;
    tehranBazaarQty = 30;
    shelfLocation = 'سالن B - قفسه زیمنس 5SY';
    status = 'available';
  } else {
    centralWarehouseQty = product.inStock ? 15 : 0;
    tehranBazaarQty = product.inStock ? 5 : 0;
    shelfLocation = 'انبار متمرکز شمس‌آباد - ردیف استاندارد';
    status = product.inStock ? (centralWarehouseQty < requestedQty ? 'low_stock' : 'available') : 'out_of_stock';
  }

  // Adjust status based on requested quantity
  if (centralWarehouseQty === 0 && tehranBazaarQty === 0) {
    status = 'out_of_stock';
  } else if (centralWarehouseQty < requestedQty) {
    status = 'low_stock';
  }

  // Smart engineering replacements based on category, poles, current rating, and functional compatibility
  const replacements = INITIAL_PRODUCTS.filter((candidate) => {
    if (candidate.id === product.id) return false;
    // Match same category
    if (candidate.category !== product.category) return false;
    // Similar rating or functional equivalent
    const ratingDiff = Math.abs(candidate.ratingAmps - product.ratingAmps);
    const isSamePoles = candidate.poles === product.poles;
    return isSamePoles || ratingDiff <= 10;
  });

  const config = {
    available: {
      statusText: 'موجود آماده تحویل در انبار مرکزی',
      badgeBg: 'bg-emerald-950/40',
      badgeText: 'text-emerald-400',
      badgeBorder: 'border-emerald-500/40',
      dotColor: 'bg-emerald-400',
      icon: 'check_circle',
    },
    low_stock: {
      statusText: 'موجودی محدود (کمتر از حد نصاب)',
      badgeBg: 'bg-amber-950/40',
      badgeText: 'text-amber-400',
      badgeBorder: 'border-amber-500/40',
      dotColor: 'bg-amber-400',
      icon: 'warning',
    },
    out_of_stock: {
      statusText: 'عدم موجودی انبار مرکزی - نیاز به جایگزین',
      badgeBg: 'bg-rose-950/40',
      badgeText: 'text-rose-400',
      badgeBorder: 'border-rose-500/40',
      dotColor: 'bg-rose-400',
      icon: 'cancel',
    },
    in_rfq: {
      statusText: 'در حال استعلام آنلاین از شبکه توزیع لاله زار',
      badgeBg: 'bg-sky-950/40',
      badgeText: 'text-sky-400',
      badgeBorder: 'border-sky-500/40',
      dotColor: 'bg-sky-400',
      icon: 'sync',
    },
  }[status];

  return {
    sku: product.sku,
    centralWarehouseQty,
    tehranBazaarQty,
    shelfLocation,
    status,
    statusText: config.statusText,
    badgeBg: config.badgeBg,
    badgeText: config.badgeText,
    badgeBorder: config.badgeBorder,
    dotColor: config.dotColor,
    icon: config.icon,
    replacements,
    estimatedRestockDays: status === 'out_of_stock' ? 3 : undefined,
    lastUpdated: 'لحظه‌ای (ارتباط زنده با سیستم WMS انبار)',
  };
}

interface LiveWarehouseStockWidgetProps {
  product: EquipmentProduct;
  requestedQty: number;
  onSelectReplacement?: (replacement: EquipmentProduct) => void;
}

export const LiveWarehouseStockWidget: React.FC<LiveWarehouseStockWidgetProps> = ({
  product,
  requestedQty,
  onSelectReplacement,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const stockInfo = getLiveWarehouseStock(product, requestedQty);
  const hasEnoughStock = stockInfo.centralWarehouseQty >= requestedQty;

  return (
    <div className="relative inline-block text-right">
      {/* Trigger Live Status Badge with pulse animation and icon */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold border transition-all ${stockInfo.badgeBg} ${stockInfo.badgeText} ${stockInfo.badgeBorder} hover:brightness-125 shadow-sm`}
          title="مشاهده موجودی آنلاین انبار مرکزی تهران و قطعات جایگزین"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${stockInfo.dotColor}`}
            ></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${stockInfo.dotColor}`}></span>
          </span>

          <span className="material-symbols-outlined text-sm">{stockInfo.icon}</span>

          <span className="font-mono-num font-bold">
            انبار تهران: {stockInfo.centralWarehouseQty > 0 ? `${stockInfo.centralWarehouseQty} عدد` : 'اتمام موجودی'}
          </span>

          <span className="material-symbols-outlined text-xs text-[#a08e7a] group-hover:text-white transition-transform">
            {isOpen ? 'expand_less' : 'tune'}
          </span>
        </button>

        {/* Suggestion Indicator if Stock is Low/Out or Replacements Available */}
        {(!hasEnoughStock || stockInfo.replacements.length > 0) && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold border transition-all ${
              !hasEnoughStock
                ? 'bg-amber-950/50 text-amber-300 border-amber-500/40 animate-pulse hover:bg-amber-900/60'
                : 'bg-[#131b2e] text-[#ffc174] border-[#2d3449] hover:border-[#ffc174]'
            }`}
          >
            <span className="material-symbols-outlined text-xs">alt_route</span>
            <span>
              {!hasEnoughStock
                ? `پیشنهاد ${stockInfo.replacements.length} جایگزین فوری`
                : `${stockInfo.replacements.length} قطعه مشابه`}
            </span>
          </button>
        )}
      </div>

      {/* Expanded Modal/Flyout Popover with Live Warehouse Telemetry & Replacements */}
      {isOpen && (
        <>
          {/* Backdrop on mobile */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-50 w-[330px] sm:w-[390px] rounded-2xl border border-[#ffc174]/40 bg-[#0f172a] p-4 text-xs shadow-2xl shadow-black/80 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#222a3d] pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ffc174]/20 text-[#ffc174] border border-[#ffc174]/30">
                  <span className="material-symbols-outlined text-base">warehouse</span>
                </span>
                <div>
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span>مانیتورینگ زنده موجودی انبار مرکزی تهران</span>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  </h4>
                  <div className="font-mono-num text-[10px] text-[#a08e7a]">
                    SKU: {product.sku} • {product.brand}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-[#a08e7a] hover:bg-[#1e293b] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Warehouse Stock Breakdown Cards */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-xl border border-[#2d3449] bg-[#131b2e] p-2.5 text-right">
                <div className="text-[10px] text-[#a08e7a] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-sky-400">domain</span>
                  <span>انبار مرکزی شمس‌آباد:</span>
                </div>
                <div className="mt-1 font-mono-num font-bold text-base text-white flex items-baseline gap-1">
                  <span className={stockInfo.centralWarehouseQty >= requestedQty ? 'text-emerald-400' : 'text-amber-400'}>
                    {stockInfo.centralWarehouseQty}
                  </span>
                  <span className="text-[10px] text-[#a08e7a]">عدد فیزیکی</span>
                </div>
                <div className="text-[10px] text-[#ffc174] truncate font-mono-num mt-0.5">
                  لوکیشن: {stockInfo.shelfLocation.split('-')[0]}
                </div>
              </div>

              <div className="rounded-xl border border-[#2d3449] bg-[#131b2e] p-2.5 text-right">
                <div className="text-[10px] text-[#a08e7a] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-amber-400">storefront</span>
                  <span>هاب تجاری لاله زار:</span>
                </div>
                <div className="mt-1 font-mono-num font-bold text-base text-white flex items-baseline gap-1">
                  <span className="text-sky-400">{stockInfo.tehranBazaarQty}</span>
                  <span className="text-[10px] text-[#a08e7a]">عدد آماده ترخیص</span>
                </div>
                <div className="text-[10px] text-[#a08e7a] mt-0.5">تحویل ۲ ساعته به کارگاه</div>
              </div>
            </div>

            {/* Detailed Location & Shelf Track */}
            <div className="mb-3 rounded-xl border border-[#222a3d] bg-[#0b1326] p-2.5 text-[11px] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#a08e7a]">موقعیت دقیق در انبار:</span>
                <span className="font-bold text-white font-mono-num">{stockInfo.shelfLocation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#a08e7a]">تعداد درخواستی در این سفارش:</span>
                <span className="font-mono-num font-bold text-amber-400">{requestedQty} عدد</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#a08e7a]">وضعیت پوشش سفارش:</span>
                <span
                  className={`font-bold flex items-center gap-1 ${
                    hasEnoughStock ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">
                    {hasEnoughStock ? 'check_circle' : 'pending'}
                  </span>
                  <span>{hasEnoughStock ? 'کفایت کامل موجودی' : 'کسری نیازمند جایگزینی یا استعلام'}</span>
                </span>
              </div>
            </div>

            {/* Smart Replacement Recommendations Section */}
            <div className="border-t border-[#222a3d] pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <span className="material-symbols-outlined text-[#ffc174] text-base">alt_route</span>
                  <span>قطعات فنی جایگزین پیشنهادی (سازگار با تابلو)</span>
                </span>
                <span className="font-mono-num text-[10px] rounded bg-[#ffc174]/15 px-1.5 py-0.2 text-[#ffc174]">
                  {stockInfo.replacements.length} گزینه
                </span>
              </div>

              {stockInfo.replacements.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {stockInfo.replacements.map((rep) => {
                    const repStock = rep.inStock ? 'موجود در انبار تهران' : 'استعلام روز';
                    return (
                      <div
                        key={rep.id}
                        className="rounded-xl border border-[#2d3449] bg-[#131b2e] p-2.5 hover:border-[#ffc174]/60 transition-all text-right"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={rep.image}
                              alt={rep.name}
                              referrerPolicy="no-referrer"
                              className="h-8 w-8 rounded bg-[#0b1326] p-1 object-contain border border-[#222a3d] shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white text-[11px] leading-tight line-clamp-1">
                                {rep.name}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5 font-mono-num text-[10px] text-[#a08e7a]">
                                <span className="text-[#ffc174]">{rep.brand}</span>
                                <span>•</span>
                                <span>{rep.sku}</span>
                                <span>•</span>
                                <span>{rep.ratingAmps}A</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-left shrink-0">
                            <span className="font-mono-num font-bold text-white text-xs block">
                              {rep.unitPrice > 0 ? `${rep.unitPrice.toLocaleString('fa-IR')}` : 'استعلام'}
                            </span>
                            <span className="text-[9px] text-[#a08e7a]">تومان</span>
                          </div>
                        </div>

                        {/* Engineering Compatibility Highlights */}
                        <div className="mt-2 flex items-center justify-between border-t border-[#222a3d]/50 pt-1.5 text-[10px]">
                          <div className="flex items-center gap-1 text-emerald-400">
                            <span className="material-symbols-outlined text-xs">verified</span>
                            <span>مطابق با استاندارد {rep.complianceStd.split('&')[0]}</span>
                          </div>

                          {onSelectReplacement && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectReplacement(rep);
                                setIsOpen(false);
                              }}
                              className="flex items-center gap-1 rounded bg-[#ffc174] px-2 py-0.5 text-[10px] font-bold text-[#472a00] hover:bg-[#ffb95f] transition-colors"
                            >
                              <span>جایگزینی در سفارش</span>
                              <span className="material-symbols-outlined text-xs">swap_horiz</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#2d3449] p-3 text-center text-[#a08e7a] text-[11px]">
                  مورد جایگزین مستقیم با مشخصات الکتریکی مشابه در این رده نیافت نشد.
                </div>
              )}
            </div>

            {/* Footer Telemetry Stamp */}
            <div className="mt-3 flex items-center justify-between border-t border-[#222a3d] pt-2 text-[10px] text-[#a08e7a] font-mono-num">
              <span>آخرین پایش موجودی: هم‌اکنون</span>
              <span className="text-emerald-400 flex items-center gap-0.5">
                <span className="material-symbols-outlined text-xs">wifi_tethering</span>
                <span>متصل به شبکه WMS</span>
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
