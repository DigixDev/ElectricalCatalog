import React, { useState } from 'react';

interface AccountViewProps {
  onLogout: () => void;
  onNavigateToCart: () => void;
  onNavigateToOrders: () => void;
  cartCount: number;
}

export const AccountView: React.FC<AccountViewProps> = ({
  onLogout,
  onNavigateToCart,
  onNavigateToOrders,
  cartCount,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'tax' | 'security'>('profile');
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: 'کارگاه اصلی تابلوسازی (شمس‌آباد)',
      address: 'تهران، شهرک صنعتی شمس‌آباد، بلوار بوستان، خیابان گلبن دهم، پلاک ۲۸، تابلوسازی توان صنعت پایتخت',
      phone: '09123456789',
      isDefault: true,
    },
    {
      id: 2,
      title: 'سایت کارگاهی سیمین‌دشت (کرج)',
      address: 'البرز، کرج، شهرک صنعتی سیمین‌دشت، خیابان سوم غربی، سوله شماره ۱۲ مهندسی',
      phone: '09121112233',
      isDefault: false,
    },
  ]);

  return (
    <div className="min-h-screen bg-[#0b1326] pb-24 text-[#dae2fd]">
      {/* Header Profile Section */}
      <section className="border-b border-[#2d3449] bg-gradient-to-b from-[#131b2e] to-[#0b1326] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffc174] to-[#f59e0b] text-[#472a00] shadow-lg shadow-[#f59e0b]/20">
                <span className="material-symbols-outlined text-3xl font-bold">engineering</span>
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-black text-xs font-bold border-2 border-[#0b1326]">
                  ✓
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">مهندس علیرضا رضوانی</h1>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono-num text-xs text-emerald-400 border border-emerald-500/30 font-bold">
                    پایه ۱ طراحی تاسیسات برق
                  </span>
                </div>
                <p className="text-xs text-[#a08e7a] mt-1">
                  پروانه اشتغال نظام مهندسی: <span className="font-mono-num font-bold text-[#ffc174]">ENG-88421-THR</span> • تابلوسازی پیشرو الکتریک
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/20 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-colors self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>خروج از حساب</span>
            </button>
          </div>

          {/* KPI Dashboard Cards */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={onNavigateToOrders}
              className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-4 cursor-pointer hover:border-[#ffc174] transition-all"
            >
              <div className="flex items-center justify-between text-[#a08e7a] text-xs">
                <span>سفارشات ثبت شده</span>
                <span className="material-symbols-outlined text-[#ffc174]">orders</span>
              </div>
              <div className="mt-2 font-mono-num text-2xl font-bold text-white">۱۲</div>
              <div className="text-[11px] text-emerald-400 mt-1">۴ سفارش فعال در خط انبار</div>
            </div>

            <div
              onClick={onNavigateToCart}
              className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-4 cursor-pointer hover:border-[#ffc174] transition-all"
            >
              <div className="flex items-center justify-between text-[#a08e7a] text-xs">
                <span>سبد استعلام جاری (BOM)</span>
                <span className="material-symbols-outlined text-sky-400">shopping_cart</span>
              </div>
              <div className="mt-2 font-mono-num text-2xl font-bold text-sky-400">{cartCount}</div>
              <div className="text-[11px] text-[#a08e7a] mt-1">مشاهده و ویرایش پیش‌فاکتور</div>
            </div>

            <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-4">
              <div className="flex items-center justify-between text-[#a08e7a] text-xs">
                <span>پروژه‌های تابلوسازی</span>
                <span className="material-symbols-outlined text-amber-400">schema</span>
              </div>
              <div className="mt-2 font-mono-num text-2xl font-bold text-white">۴</div>
              <div className="text-[11px] text-[#a08e7a] mt-1">دیاگرام تک‌خطی متصل به ERP</div>
            </div>

            <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-4">
              <div className="flex items-center justify-between text-[#a08e7a] text-xs">
                <span>اسناد CAD و ماکروها</span>
                <span className="material-symbols-outlined text-purple-400">folder_open</span>
              </div>
              <div className="mt-2 font-mono-num text-2xl font-bold text-white">۸</div>
              <div className="text-[11px] text-[#a08e7a] mt-1">کش آفلاین در مرورگر</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tabs */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
        {/* Navigation Sub-tabs */}
        <div className="flex items-center gap-2 border-b border-[#2d3449] pb-2 text-xs">
          {[
            { id: 'profile', label: 'مشخصات مهندسی', icon: 'badge' },
            { id: 'addresses', label: 'نشانی‌های کارگاه و تحویل بار', icon: 'local_shipping' },
            { id: 'tax', label: 'اطلاعات حقوقی و مودیان دارایی', icon: 'receipt_long' },
            { id: 'security', label: 'امنیت و نشست‌های فعال', icon: 'security' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#ffc174] text-[#472a00]'
                  : 'text-[#d8c3ad] hover:bg-[#171f33]'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-6 space-y-4">
            <h3 className="font-bold text-sm text-white">اطلاعات پرونده مهندس</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#a08e7a]">نام و نام خانوادگی:</span>
                <div className="font-bold text-white mt-1">علیرضا رضوانی</div>
              </div>
              <div>
                <span className="text-[#a08e7a]">کد عضویت نظام مهندسی:</span>
                <div className="font-mono-num font-bold text-[#ffc174] mt-1">ENG-88421-THR</div>
              </div>
              <div>
                <span className="text-[#a08e7a]">تلفن همراه وریفای شده:</span>
                <div className="font-mono-num font-bold text-white mt-1">09123456789</div>
              </div>
              <div>
                <span className="text-[#a08e7a]">پست الکترونیک رسمی:</span>
                <div className="font-mono-num text-[#d8c3ad] mt-1">a.rezvani@pishro-panel.ir</div>
              </div>
              <div>
                <span className="text-[#a08e7a]">عنوان مجموعه / کارگاه:</span>
                <div className="text-white mt-1">تابلوسازی پیشرو الکتریک (سهامی خاص)</div>
              </div>
              <div>
                <span className="text-[#a08e7a]">صلاحیت حرفه‌ای:</span>
                <div className="text-emerald-400 mt-1">طراحی و نظارت تابلوهای فشار متوسط و ضعیف (MV/LV)</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">محل‌های ثبت شده جهت تحویل بار و پالت‌های صنعتی</h3>
              <button
                onClick={() => alert('فرم افزودن آدرس جدید باز شد.')}
                className="flex items-center gap-1 rounded-xl bg-[#ffc174] px-3 py-1.5 text-xs font-bold text-[#472a00]"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>افزودن نشانی جدید</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-5 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#ffc174] text-base">factory</span>
                      <span>{addr.title}</span>
                    </span>
                    {addr.isDefault && (
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono-num text-[10px] text-emerald-400 border border-emerald-500/30">
                        پیش‌فرض ارسال
                      </span>
                    )}
                  </div>

                  <p className="text-[#d8c3ad] leading-relaxed bg-[#131b2e] p-3 rounded-xl border border-[#222a3d]">
                    {addr.address}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#a08e7a]">
                    <span>تلفن تماس تحویل‌گیرنده: <strong className="font-mono-num text-white">{addr.phone}</strong></span>
                    <button className="text-[#ffc174] hover:underline">ویرایش نشانی</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Corporate Tax Credentials (from HTML 2.3) */}
        {activeTab === 'tax' && (
          <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222a3d] pb-3">
              <h3 className="font-bold text-sm text-white">مشخصات حقوقی و مالیاتی جهت صدور صورتحساب الکترونیکی</h3>
              <span className="rounded bg-[#131b2e] px-2 py-0.5 font-mono-num text-[11px] text-emerald-400 border border-[#2d3449]">
                سامانه جامع مودیان
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[#a08e7a]">شناسه ملی حقوقی شرکت:</span>
                <div className="font-mono-num font-bold text-white mt-1">10103456789</div>
              </div>
              <div>
                <span className="text-[#a08e7a]">کد اقتصادی ۱۶ رقمی:</span>
                <div className="font-mono-num font-bold text-[#ffc174] mt-1">4114-8923-9901-2281</div>
              </div>
              <div>
                <span className="text-[#a08e7a]">شماره ثبت در اداره ثبت شرکت‌ها:</span>
                <div className="font-mono-num font-bold text-white mt-1">428910</div>
              </div>
              <div>
                <span className="text-[#a08e7a]">کد پستی ده رقمی رسمی:</span>
                <div className="font-mono-num font-bold text-white mt-1">1834199023</div>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#a08e7a]">وضعیت استعلام مالیات بر ارزش افزوده:</span>
                <div className="text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>گواهی ثبت‌نام در نظام مالیات بر ارزش افزوده معتبر تا پایان سال جاری</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Security */}
        {activeTab === 'security' && (
          <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-white">تنظیمات امنیت حساب و نشست‌های فعال</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-[#131b2e] p-3 border border-[#222a3d]">
                <div>
                  <div className="font-bold text-white">تایید هویت دو مرحله‌ای مهندسی (2FA SMS)</div>
                  <div className="text-[11px] text-[#a08e7a]">ارسال کد تایید به شماره 0912***6789 در زمان ورود</div>
                </div>
                <span className="rounded bg-emerald-500/20 px-2 py-1 font-bold text-emerald-400">فعال است</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#131b2e] p-3 border border-[#222a3d]">
                <div>
                  <div className="font-bold text-white">نشست فعال فعلی (Current Active Session)</div>
                  <div className="font-mono-num text-[11px] text-[#a08e7a]">Chrome 128 / Windows 11 • IP: 185.142.20.12 (Tehran, Iran)</div>
                </div>
                <span className="font-mono-num text-xs text-sky-400">ONLINE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
