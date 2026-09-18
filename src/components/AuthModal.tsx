import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (name: string) => void;
  cartCount: number;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  cartCount,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('09123456789');
  const [password, setPassword] = useState('••••••••');
  const [fullName, setFullName] = useState('مهندس علیرضا رضوانی');
  const [engCode, setEngCode] = useState('ENG-88421-THR');
  const [company, setCompany] = useState('تابلوسازی پیشرو الکتریک');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccessLogin(fullName || 'مهندس رضوانی');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-[#ffc174]/40 bg-[#171f33] p-6 shadow-2xl space-y-5 text-xs text-[#dae2fd]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-[#a08e7a] hover:text-white p-1"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Modal Header */}
        <div className="text-center pt-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffc174] to-[#f59e0b] text-[#472a00] shadow-md shadow-[#f59e0b]/20 mb-2">
            <span className="material-symbols-outlined text-2xl font-bold">engineering</span>
          </div>
          <h2 className="text-lg font-bold text-white">سامانه احراز هویت مهندسی تابلو برق</h2>
          <p className="text-[11px] text-[#a08e7a] mt-0.5">
            دسترسی به کاتالوگ قیمت‌های روز، صدور پیش‌فاکتور و استعلامات کارگاهی
          </p>
        </div>

        {/* Guest Continuity Banner (from HTML 4.2) */}
        {cartCount > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-3 text-[11px] text-emerald-300">
            <span className="material-symbols-outlined text-emerald-400 text-base">sync</span>
            <span>
              <strong>یکپارچه‌سازی سبد:</strong> {cartCount} قلم کالا در سبد جاری شما پس از ورود به پرونده مهندسی منتقل خواهد شد.
            </span>
          </div>
        )}

        {/* Segmented Tab Switch */}
        <div className="flex rounded-xl bg-[#0b1326] p-1 border border-[#2d3449]">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              tab === 'login' ? 'bg-[#ffc174] text-[#472a00]' : 'text-[#a08e7a] hover:text-white'
            }`}
          >
            ورود به حساب مهندسی
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              tab === 'register' ? 'bg-[#ffc174] text-[#472a00]' : 'text-[#a08e7a] hover:text-white'
            }`}
          >
            ثبت‌نام کارگاه جدید
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'register' && (
            <>
              <div>
                <label className="block text-[#a08e7a] mb-1">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-2.5 text-white focus:border-[#ffc174] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#a08e7a] mb-1">کد نظام مهندسی / مجوز فعالیت:</label>
                <input
                  type="text"
                  required
                  value={engCode}
                  onChange={(e) => setEngCode(e.target.value)}
                  className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-2.5 text-white font-mono-num focus:border-[#ffc174] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#a08e7a] mb-1">نام شرکت یا کارگاه تابلوسازی:</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-2.5 text-white focus:border-[#ffc174] focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[#a08e7a] mb-1">شماره تلفن همراه سازمانی (+98):</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-2.5 text-white font-mono-num text-left focus:border-[#ffc174] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[#a08e7a]">رمز عبور پرتال:</label>
              {tab === 'login' && (
                <button type="button" className="text-[11px] text-[#ffc174] hover:underline">
                  ورود با پیامک یکبار مصرف (OTP)
                </button>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-2.5 text-white font-mono-num text-left focus:border-[#ffc174] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffc174] to-[#f59e0b] py-3 text-xs font-bold text-[#472a00] hover:from-[#ffb95f] hover:to-[#d97706] transition-all shadow-lg shadow-[#f59e0b]/20"
          >
            <span className="material-symbols-outlined text-base">login</span>
            <span>{tab === 'login' ? 'ورود به سامانه مهندسی' : 'ثبت‌نام و احراز هویت کارگاهی'}</span>
          </button>
        </form>

        {/* Security & Compliance Badges Footer (from HTML 4.2) */}
        <div className="pt-3 border-t border-[#222a3d] flex items-center justify-around text-[10px] text-[#a08e7a]">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="material-symbols-outlined text-xs">lock</span>
            <span>TLS 1.3 ENCRYPTED</span>
          </span>
          <span>•</span>
          <span>مبحث ۱۳ مقررات ملی</span>
          <span>•</span>
          <span>سامانه مودیان دارایی</span>
        </div>
      </div>
    </div>
  );
};
