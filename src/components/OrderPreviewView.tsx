import React, { useState } from 'react';
import { CartItem } from '../types';
import { OrderHighValue2FAModal, VerificationData } from './OrderHighValue2FAModal';

interface OrderPreviewViewProps {
  cartItems: CartItem[];
  onConfirmOrder: (notes: string, verificationData?: VerificationData) => void;
  onBackToCart: () => void;
}

export const OrderPreviewView: React.FC<OrderPreviewViewProps> = ({
  cartItems,
  onConfirmOrder,
  onBackToCart,
}) => {
  const [engineerNotes, setEngineerNotes] = useState(
    'لطفاً شینه‌های مسی متناسب با کلید اتوماتیک ۲۵۰ آمپر از برند اشنایدر اصلی ارسال شود و رله مغناطیسی روی حداقل مقدار Icu تنظیم گردد. کنتاکتورها با بوبین ۲۲۰ ولت حتماً در یک پالت بارکددار ارسال گردند.'
  );

  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [force2FAVerification, setForce2FAVerification] = useState(false);

  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const fixedTotalPrice = cartItems.reduce((acc, item) => {
    return acc + (item.product.unitPrice > 0 ? item.product.unitPrice * item.quantity : 0);
  }, 0);
  const rfqCount = cartItems.filter((item) => item.product.unitPrice === 0).length;

  // High value threshold: 25,000,000 Tomans OR presence of heavy industrial breakers (>= 250A)
  const HIGH_VALUE_THRESHOLD = 25_000_000;
  const hasHeavyEquipment = cartItems.some((item) => (item.product.ratingAmps || 0) >= 250);
  const isHighValueOrder = fixedTotalPrice >= HIGH_VALUE_THRESHOLD || hasHeavyEquipment;
  const requires2FA = isHighValueOrder || force2FAVerification;

  const handleInitiateConfirm = () => {
    if (requires2FA) {
      setIs2FAModalOpen(true);
    } else {
      onConfirmOrder(engineerNotes);
    }
  };

  const handle2FAVerified = (verificationData: VerificationData) => {
    setIs2FAModalOpen(false);
    onConfirmOrder(engineerNotes, verificationData);
  };

  return (
    <div className="min-h-screen bg-[#0b1326] pb-24 text-[#dae2fd]">
      {/* Header & Stepper */}
      <section className="border-b border-[#2d3449] bg-gradient-to-b from-[#131b2e] to-[#0b1326] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {/* Stepper (From HTML 2) */}
          <div className="mb-6 flex items-center justify-center gap-2 sm:gap-6 font-mono-num text-xs">
            {/* Step 1 */}
            <div className="flex items-center gap-2 text-emerald-400">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/50">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className="font-bold">۱. سبد خرید BOM</span>
            </div>

            <div className="h-0.5 w-8 sm:w-16 bg-[#2d3449]"></div>

            {/* Step 2 */}
            <div className="flex items-center gap-2 text-[#ffc174]">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffc174]/20 border border-[#ffc174] shadow-md shadow-[#ffc174]/30">
                <span className="text-xs font-bold">۲</span>
              </div>
              <span className="font-bold">۲. پیش‌نمایش سفارش مهندسی</span>
            </div>

            <div className="h-0.5 w-8 sm:w-16 bg-[#2d3449]"></div>

            {/* Step 3 */}
            <div className="flex items-center gap-2 text-[#a08e7a]">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#171f33] border border-[#2d3449]">
                <span className="text-xs">۳</span>
              </div>
              <span className="hidden sm:inline">۳. صدور پیش‌فاکتور و تسویه</span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              پیش‌نمایش و تایید مدارک فنی سفارش
            </h1>
            <p className="mt-1 text-sm text-[#d8c3ad]">
              بررسی نهایی مشخصات تجهیزات، آدرس کارگاه و ثبت یادداشت‌های الزامی ناظر فنی
            </p>
          </div>
        </div>
      </section>

      {/* Main Form Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
        {/* Security Warning Notice (from HTML 2) */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs text-emerald-200 flex items-start gap-3">
          <span className="material-symbols-outlined text-emerald-400 text-lg mt-0.5">verified_user</span>
          <div>
            <h4 className="font-bold text-emerald-300">بدون تعهد پرداخت مالی در این مرحله:</h4>
            <p className="mt-0.5 text-[#d8c3ad] leading-relaxed">
              ثبت این مرحله بدون هیچ‌گونه تعهد پرداخت مالی است. صرفاً اطلاعات فنی، سازگاری تجهیزات با دیاگرام تک‌خطی و موجودی قطعات در زنجیره انبار تابلوسازی مورد بررسی واحد مهندسی قرار می‌گیرد.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Client Credentials & Items (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Engineer Profile Card */}
            <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-6">
              <div className="flex items-center justify-between border-b border-[#222a3d] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffc174]">badge</span>
                  <h3 className="font-bold text-sm text-white">مشخصات مهندس و کارگاه تابلوسازی</h3>
                </div>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono-num text-[11px] text-emerald-400 border border-emerald-500/30">
                  VERIFIED PROFILE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#a08e7a]">نام و نام خانوادگی متقاضی:</span>
                  <div className="font-bold text-white mt-1">مهندس علیرضا رضوانی</div>
                </div>

                <div>
                  <span className="text-[#a08e7a]">کد نظام مهندسی / مجوز:</span>
                  <div className="font-mono-num font-bold text-[#ffc174] mt-1">ENG-88421-THR</div>
                </div>

                <div>
                  <span className="text-[#a08e7a]">شماره همراه تایید شده:</span>
                  <div className="font-mono-num font-bold text-white mt-1 flex items-center gap-1">
                    <span>09123456789</span>
                    <span className="material-symbols-outlined text-xs text-emerald-400">check_circle</span>
                  </div>
                </div>

                <div>
                  <span className="text-[#a08e7a]">پست الکترونیک رسمی:</span>
                  <div className="font-mono-num text-[#d8c3ad] mt-1">a.rezvani@pishro-panel.ir</div>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[#a08e7a]">آدرس دقیق کارگاه جهت ارسال و تحویل بار:</span>
                  <div className="text-white mt-1 bg-[#131b2e] p-3 rounded-xl border border-[#222a3d] leading-relaxed">
                    تهران، شهرک صنعتی شمس‌آباد، بلوار بوستان، خیابان گلبن دهم، پلاک ۲۸، کارگاه فنی تابلوسازی توان صنعت پایتخت
                  </div>
                </div>
              </div>
            </div>

            {/* Itemized Equipments Preview */}
            <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-6">
              <div className="flex items-center justify-between border-b border-[#222a3d] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffc174]">inventory</span>
                  <h3 className="font-bold text-sm text-white">ردیف اقلام تجهیزات انتخاب شده</h3>
                </div>
                <span className="font-mono-num text-xs text-[#a08e7a]">
                  {cartItems.length} قلم کالا • {totalUnits} واحد فیزیکی
                </span>
              </div>

              <div className="space-y-3">
                {cartItems.map((item, idx) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#222a3d] bg-[#131b2e] p-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono-num font-bold text-[#a08e7a]">#{idx + 1}</span>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 object-contain rounded bg-[#0b1326] p-1 border border-[#222a3d]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono-num text-[11px] text-[#ffc174]">
                            {item.product.brand}
                          </span>
                          <span className="font-mono-num text-[10px] text-[#a08e7a]">
                            {item.product.sku}
                          </span>
                        </div>
                        <h4 className="font-bold text-white line-clamp-1">{item.product.name}</h4>
                        <div className="text-[11px] text-emerald-400 mt-0.5">
                          {item.product.stockLocation}
                        </div>
                      </div>
                    </div>

                    <div className="text-left font-mono-num">
                      <div className="font-bold text-white text-sm">
                        {item.quantity} عدد
                      </div>
                      <div className="text-[11px] text-[#a08e7a]">
                        {item.product.unitPrice > 0 ? (
                          `${(item.product.unitPrice * item.quantity).toLocaleString('fa-IR')} ت`
                        ) : (
                          <span className="text-amber-400">استعلام روز</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engineer Special Instructions & Notes */}
            <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffc174]">edit_note</span>
                  <h3 className="font-bold text-sm text-white">یادداشت‌ها و الزامات فنی ناظر کارگاه</h3>
                </div>
                <span className="text-[11px] text-[#a08e7a]">قابل مشاهده توسط واحد مهندسی</span>
              </div>

              <textarea
                rows={3}
                value={engineerNotes}
                onChange={(e) => setEngineerNotes(e.target.value)}
                placeholder="هرگونه الزام بسته‌بندی، تاریخ تحویل یا تنظیمات رله را اینجا ثبت کنید..."
                className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-3 text-xs text-white placeholder-[#a08e7a] focus:border-[#ffc174] focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Right Column: Order Confirmation Action & SLA (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-[#ffc174]/40 bg-[#171f33] p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#222a3d] pb-3">
                <h3 className="font-bold text-sm text-white">تاییدیه نهایی پیش‌فاکتور</h3>
                <span className="rounded bg-[#ffc174]/20 px-2 py-0.5 font-mono-num text-[11px] text-[#ffc174]">
                  ERP READY
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-[#d8c3ad]">
                  <span className="text-[#a08e7a]">تعداد کل اقلام فیزیکی:</span>
                  <span className="font-mono-num font-bold text-white">{totalUnits} قطعه</span>
                </div>

                <div className="flex items-center justify-between text-[#d8c3ad]">
                  <span className="text-[#a08e7a]">جمع اقلام مشخص:</span>
                  <span className="font-mono-num font-bold text-white">
                    {fixedTotalPrice.toLocaleString('fa-IR')} تومان
                  </span>
                </div>

                {rfqCount > 0 && (
                  <div className="flex items-center justify-between text-amber-400">
                    <span>اقلام در حال استعلام:</span>
                    <span className="font-mono-num font-bold">{rfqCount} قلم</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[#d8c3ad]">
                  <span className="text-[#a08e7a]">مالیات بر ارزش افزوده:</span>
                  <span className="text-[11px] text-[#a08e7a]">محاسبه در پیش‌فاکتور نهایی</span>
                </div>
              </div>

              {/* 2FA Security Level Card */}
              <div className={`rounded-xl border p-3.5 text-xs transition-all ${
                requires2FA
                  ? 'border-amber-500/40 bg-amber-950/20'
                  : 'border-[#2d3449] bg-[#131b2e]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-base ${
                      requires2FA ? 'text-amber-400' : 'text-[#a08e7a]'
                    }`}>
                      {requires2FA ? 'shield_lock' : 'verified_user'}
                    </span>
                    <span className="font-bold text-white">تاییدیه ۲ مرحله‌ای (2FA)</span>
                  </div>
                  {requires2FA ? (
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono-num text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      الزامی مبالغ بالا
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setForce2FAVerification(!force2FAVerification)}
                      className="text-[10px] text-[#ffc174] hover:underline"
                    >
                      فعال‌سازی تایید
                    </button>
                  )}
                </div>

                <p className="mt-1.5 text-[11px] text-[#d8c3ad] leading-relaxed">
                  {requires2FA
                    ? 'این سفارش با ارزش بالا مشمول آیین‌نامه انضباط مالی و نیازمند تایید پیامکی/کدی یا ایمیلی مدیریت ارشد فنی کارگاه است.'
                    : 'ارزش سفارش زیر حد نصاب است. در صورت نیاز به تایید مدیریت فنی، می‌توانید آن را فعال فرمایید.'}
                </p>

                {requires2FA && (
                  <div className="mt-2 rounded-lg bg-[#0b1326] p-2 text-[10px] text-[#a08e7a] flex items-center justify-between font-mono-num border border-[#222a3d]">
                    <span>تاییدکننده مجاز: مدیریت فنی</span>
                    <span className="text-[#ffc174]">دکتر میرزایی / مهندس شریفی</span>
                  </div>
                )}
              </div>

              <div className="border-t border-[#222a3d] pt-4 space-y-3">
                {/* Submit button */}
                <button
                  onClick={handleInitiateConfirm}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffc174] to-[#f59e0b] py-3.5 text-xs font-bold text-[#472a00] hover:from-[#ffb95f] hover:to-[#d97706] transition-all shadow-xl shadow-[#f59e0b]/25"
                >
                  <span className="material-symbols-outlined text-lg font-bold">
                    {requires2FA ? 'lock' : 'check_circle'}
                  </span>
                  <span>
                    {requires2FA
                      ? 'تایید با احراز هویت دو مرحله‌ای (2FA)'
                      : 'تایید نهایی و ثبت رسمی سفارش صنعتی'}
                  </span>
                </button>

                <button
                  onClick={onBackToCart}
                  className="w-full text-center text-xs text-[#a08e7a] hover:text-white py-1 transition-colors"
                >
                  بازگشت و ویرایش سبد تجهیزات
                </button>
              </div>
            </div>

            {/* Compliance Checklist */}
            <div className="rounded-xl border border-[#2d3449] bg-[#131b2e] p-4 text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="material-symbols-outlined text-base">checklist</span>
                <span>تضمین‌های قانونی و کیفیتی</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-[#d8c3ad] list-disc list-inside">
                <li>صدور فاکتور رسمی معتبر جهت سامانه مودیان دارایی</li>
                <li>تطابق با دیاگرام تک‌خطی و استانداردهای IEC 61439</li>
                <li>بسته‌بندی صنعتی ضد لرزش با هولوگرام اصالت</li>
                <li>پشتیبانی و بررسی مهندسی پیش از ترخیص انبار</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 2FA Verification Modal for High-Value Orders */}
      <OrderHighValue2FAModal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        onVerified={handle2FAVerified}
        totalAmount={fixedTotalPrice}
        rfqCount={rfqCount}
        itemsCount={totalUnits}
        clientName="مهندس علیرضا رضوانی"
        companyName="تابلوسازی پیشرو الکتریک"
      />
    </div>
  );
};
