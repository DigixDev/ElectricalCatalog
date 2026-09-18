import React from 'react';
import { CartItem } from '../types';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToOrderPreview: () => void;
  onContinueShopping: () => void;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToOrderPreview,
  onContinueShopping,
  isLoggedIn,
  onOpenAuth,
}) => {
  // Calculations
  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalWeightKg = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.product.weightKg,
    0
  );

  const fixedTotalPrice = cartItems.reduce((acc, item) => {
    return acc + (item.product.unitPrice > 0 ? item.product.unitPrice * item.quantity : 0);
  }, 0);

  const rfqCount = cartItems.filter((item) => item.product.unitPrice === 0).length;

  return (
    <div className="min-h-screen bg-[#0b1326] pb-24 text-[#dae2fd]">
      {/* Header */}
      <section className="border-b border-[#2d3449] bg-gradient-to-b from-[#131b2e] to-[#0b1326] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded bg-[#ffc174]/15 px-2 py-0.5 font-mono-num text-xs font-bold text-[#ffc174] border border-[#ffc174]/30">
              BOM ESTIMATOR
            </span>
            <span className="text-xs text-[#a08e7a]">صورت متریال و برآورد تجهیزات الکتریکال</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            سبد استعلام و برآورد تجهیزات تابلو
          </h1>
          <p className="mt-1 text-sm text-[#d8c3ad]">
            بررسی اقلام فیزیکی، وزن محموله کارگاهی و آماده‌سازی برای ثبت سفارش مهندسی
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Guest Warning Banner if not logged in (from HTML 3) */}
        {!isLoggedIn && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs">
            <div className="flex items-center gap-2 text-amber-200">
              <span className="material-symbols-outlined text-amber-400">info</span>
              <span>
                <strong>حالت مهمان مهندسی:</strong> لیست قطعات شما در حافظه محلی ذخیره شده است. جهت صدور پیش‌فاکتور رسمی و تطبیق با سامانه مودیان، وارد حساب شوید.
              </span>
            </div>
            <button
              onClick={onOpenAuth}
              className="rounded-xl bg-amber-400 px-4 py-1.5 font-bold text-[#472a00] hover:bg-amber-300 transition-colors whitespace-nowrap text-center"
            >
              ورود یا ثبت‌نام مهندسی
            </button>
          </div>
        )}

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: BOM Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#a08e7a] pb-2 border-b border-[#2d3449]">
                <span>اقلام انتخاب شده ({cartItems.length} ردیف تجهیز)</span>
                <span>تعداد کل قطعات فیزیکی: {totalUnits} عدد</span>
              </div>

              {cartItems.map((item) => {
                const p = item.product;
                const lineTotal = p.unitPrice * item.quantity;

                return (
                  <div
                    key={p.id}
                    className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-[#2d3449] bg-[#171f33] p-4 transition-all hover:border-[#ffc174]/50"
                  >
                    {/* Thumbnail */}
                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-[#0b1326] p-2 border border-[#222a3d]">
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono-num text-xs font-bold text-[#ffc174]">
                              {p.brand}
                            </span>
                            <span className="font-mono-num text-[11px] text-[#a08e7a]">
                              SKU: {p.sku}
                            </span>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => onRemoveItem(p.id)}
                            className="text-[#a08e7a] hover:text-rose-400 p-1"
                            title="حذف از سبد"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>

                        <h3 className="mt-1 text-sm font-bold text-white">{p.name}</h3>

                        {/* Parameter pills */}
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                          <span className="rounded bg-[#131b2e] px-2 py-0.5 font-mono-num text-[#ffc174] border border-[#222a3d]">
                            {p.ratingAmps} A
                          </span>
                          <span className="rounded bg-[#131b2e] px-2 py-0.5 font-mono-num text-sky-400 border border-[#222a3d]">
                            {p.breakingCapacityKa} kA
                          </span>
                          <span className="rounded bg-[#131b2e] px-2 py-0.5 text-[#d8c3ad] border border-[#222a3d]">
                            وزن: {p.weightKg} kg
                          </span>
                          <span className="rounded bg-emerald-950/60 px-2 py-0.5 text-emerald-400 border border-emerald-500/20">
                            {p.stockLocation}
                          </span>
                        </div>
                      </div>

                      {/* Quantity and Price */}
                      <div className="mt-4 pt-3 border-t border-[#222a3d] flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#a08e7a]">تعداد:</span>
                          <div className="flex items-center rounded-xl border border-[#2d3449] bg-[#131b2e] font-mono-num text-xs">
                            <button
                              onClick={() => onUpdateQuantity(p.id, item.quantity - 1)}
                              className="px-2.5 py-1 text-white hover:bg-[#222a3d] rounded-r-xl"
                            >
                              -
                            </button>
                            <span className="px-3 font-bold text-white">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(p.id, item.quantity + 1)}
                              className="px-2.5 py-1 text-white hover:bg-[#222a3d] rounded-l-xl"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-left font-mono-num">
                          {p.unitPrice > 0 ? (
                            <div>
                              <div className="text-xs text-[#a08e7a]">
                                {p.unitPrice.toLocaleString('fa-IR')} × {item.quantity}
                              </div>
                              <div className="font-bold text-sm text-white">
                                {lineTotal.toLocaleString('fa-IR')}{' '}
                                <span className="text-xs font-normal text-[#a08e7a]">تومان</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-amber-400 font-bold">
                              استعلام قیمت روز بازرگانی
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Order Estimate Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#222a3d] pb-3">
                  <h3 className="font-bold text-sm text-white">خلاصه برآورد فنی BOM</h3>
                  <span className="font-mono-num text-[11px] text-[#ffc174]">IEC 61439</span>
                </div>

                {/* Technical Diagnostic Metrics */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-[#d8c3ad]">
                    <span className="text-[#a08e7a]">تعداد کل تجهیزات فیزیکی:</span>
                    <span className="font-mono-num font-bold text-white">{totalUnits} قطعه</span>
                  </div>

                  <div className="flex items-center justify-between text-[#d8c3ad]">
                    <span className="text-[#a08e7a]">تخمین وزن بسته بارگاهی:</span>
                    <span className="font-mono-num font-bold text-sky-400">
                      {totalWeightKg.toFixed(2)} kg ± 5%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#d8c3ad]">
                    <span className="text-[#a08e7a]">استانداردهای مرجع:</span>
                    <span className="font-mono-num text-[#ffc174]">IEC 60947 / 60898</span>
                  </div>

                  <div className="flex items-center justify-between text-[#d8c3ad]">
                    <span className="text-[#a08e7a]">نوع بسته‌بندی کارگاهی:</span>
                    <span className="text-white">پالت چوبی صنعتی ضد رطوبت</span>
                  </div>
                </div>

                <div className="border-t border-[#222a3d] pt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#a08e7a]">مجموع اقلام قیمت‌دار:</span>
                    <span className="font-mono-num font-bold text-white text-base">
                      {fixedTotalPrice.toLocaleString('fa-IR')}{' '}
                      <span className="text-xs font-normal text-[#a08e7a]">تومان</span>
                    </span>
                  </div>

                  {rfqCount > 0 && (
                    <div className="flex items-center justify-between text-[11px] text-amber-400">
                      <span>اقلام نیازمند استعلام روز:</span>
                      <span className="font-mono-num font-bold">{rfqCount} قلم</span>
                    </div>
                  )}
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={onProceedToOrderPreview}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffc174] to-[#f59e0b] py-3 text-xs font-bold text-[#472a00] hover:from-[#ffb95f] hover:to-[#d97706] transition-all shadow-lg shadow-[#f59e0b]/20"
                >
                  <span>ادامه و پیش‌نمایش سفارش مهندسی</span>
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                </button>

                <button
                  onClick={onContinueShopping}
                  className="w-full text-center text-xs text-[#a08e7a] hover:text-white py-1 transition-colors"
                >
                  افزودن تجهیزات دیگر از کاتالوگ
                </button>
              </div>

              {/* Guarantees Box */}
              <div className="rounded-xl border border-[#222a3d] bg-[#131b2e] p-4 text-[11px] text-[#a08e7a] space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span>تضمین اصالت تجهیزات و گواهی KEMA/CE</span>
                </div>
                <p>
                  کلیه تجهیزات صنعتی با پارت نامبر و لیبل اصالت کمپانی اصلی عرضه شده و پیش از بارگیری توسط ناظر فنی کنترل کیفی می‌گردند.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className="my-16 rounded-2xl border border-dashed border-[#2d3449] bg-[#171f33] p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-[#a08e7a]">
              shopping_cart_off
            </span>
            <h2 className="mt-4 text-lg font-bold text-white">سبد استعلام تجهیزات خالی است</h2>
            <p className="mt-1 text-sm text-[#a08e7a]">
              لطفاً تجهیزات مورد نیاز تابلو را از کاتالوگ پارامتریک انتخاب کرده و به سبد BOM اضافه کنید.
            </p>
            <button
              onClick={onContinueShopping}
              className="mt-6 rounded-xl bg-[#ffc174] px-6 py-2.5 text-xs font-bold text-[#472a00] hover:bg-[#ffb95f] transition-all shadow-md"
            >
              مشاهده کاتالوگ تجهیزات برق
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
