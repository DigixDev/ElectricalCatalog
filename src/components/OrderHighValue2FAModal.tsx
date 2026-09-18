import React, { useState, useEffect, useRef } from 'react';

export interface VerificationData {
  approver: string;
  method: 'code' | 'email';
  token: string;
  timestamp: string;
}

interface OrderHighValue2FAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (data: VerificationData) => void;
  totalAmount: number;
  rfqCount: number;
  itemsCount: number;
  clientName: string;
  companyName: string;
}

export const OrderHighValue2FAModal: React.FC<OrderHighValue2FAModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  totalAmount,
  rfqCount,
  itemsCount,
  clientName,
  companyName,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'email'>('code');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [isEmailSimulating, setIsEmailSimulating] = useState(false);
  const [emailApproved, setEmailApproved] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const expectedDemoCode = '784210';

  // Countdown timer for code resend
  useEffect(() => {
    if (!isOpen) return;
    setCountdown(120);
    setCanResend(false);
    setErrorMsg(null);
    setOtpDigits(['', '', '', '', '', '']);
    setEmailApproved(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, '');
    if (!cleanVal && val !== '') return;

    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal.slice(-1);
    setOtpDigits(newDigits);
    setErrorMsg(null);

    // Auto focus next input
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleFillDemoCode = () => {
    const chars = expectedDemoCode.split('');
    setOtpDigits(chars);
    setErrorMsg(null);
  };

  const handleResendCode = () => {
    setCountdown(120);
    setCanResend(false);
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMsg(null);
  };

  const handleVerifyCodeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredCode = otpDigits.join('');

    if (enteredCode.length < 6) {
      setErrorMsg('لطفاً کد تایید ۶ رقمی را به‌طور کامل وارد فرمایید.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    setTimeout(() => {
      // Allow demo code or any 6-digit entered for testing flexibility
      if (enteredCode === expectedDemoCode || enteredCode.length === 6) {
        const now = new Date();
        const timestamp = now.toLocaleDateString('fa-IR') + ' ' + now.toLocaleTimeString('fa-IR');
        onVerified({
          approver: 'مهندس محمدرضا شریفی (مدیریت ارشد فنی کارگاه تابلوسازی)',
          method: 'code',
          token: `2FA-OTP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          timestamp,
        });
      } else {
        setErrorMsg('کد امنیتی وارد شده صحیح نمی‌باشد. کد نمونه: ۷۸۴۲۱۰');
        setIsVerifying(false);
      }
    }, 800);
  };

  const handleSimulateEmailApprove = () => {
    setIsEmailSimulating(true);
    setTimeout(() => {
      setIsEmailSimulating(false);
      setEmailApproved(true);
      setTimeout(() => {
        const now = new Date();
        const timestamp = now.toLocaleDateString('fa-IR') + ' ' + now.toLocaleTimeString('fa-IR');
        onVerified({
          approver: 'دکتر علیرضا میرزایی (مدیریت مهندسی و مدیر فنی کارگاه)',
          method: 'email',
          token: `2FA-EMAIL-SIGN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          timestamp,
        });
      }, 700);
    }, 1000);
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border-2 border-[#ffc174]/70 bg-[#0f172a] p-6 sm:p-8 shadow-2xl shadow-black text-right text-[#dae2fd] my-8 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#ffc174]/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-amber-600/10 blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#222a3d] pb-5 mb-6 relative">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffc174] to-[#f59e0b] text-[#472a00] shadow-lg shadow-[#ffc174]/20 shrink-0">
              <span className="material-symbols-outlined text-2xl font-bold">lock_person</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  احراز هویت دو مرحله‌ای (2FA) سفارشات صنعتی
                </h3>
                <span className="rounded bg-rose-500/20 px-2 py-0.5 font-mono-num text-[10px] font-bold text-rose-400 border border-rose-500/40">
                  HIGH VALUE SECURITY
                </span>
              </div>
              <p className="text-xs text-[#a08e7a] mt-0.5">
                تاییدیه دومرحله‌ای مدیریت فنی و تطابق استاندارد تابلوسازی (IEC 61439)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#a08e7a] hover:bg-[#1e293b] hover:text-white transition-colors"
            title="انصراف"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Order Amount & High Value Justification Summary Card */}
        <div className="rounded-2xl border border-amber-500/30 bg-[#171f33] p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#222a3d] pb-3 mb-3">
            <div>
              <div className="text-[11px] text-[#a08e7a]">مبلغ نهایی پیش‌فاکتور سفارش:</div>
              <div className="font-mono-num font-bold text-lg sm:text-xl text-[#ffc174]">
                {totalAmount > 0 ? `${totalAmount.toLocaleString('fa-IR')} تومان` : 'استعلام جامع بازرگانی'}
              </div>
            </div>

            <div className="text-right sm:text-left text-xs font-mono-num text-[#dae2fd]">
              <div>تعداد اقلام: <strong className="text-white">{itemsCount} تجهیز</strong></div>
              <div className="text-[11px] text-[#a08e7a]">{companyName}</div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-[#d8c3ad] leading-relaxed">
            <span className="material-symbols-outlined text-amber-400 text-base mt-0.5 shrink-0">
              policy
            </span>
            <p className="text-[11px]">
              با توجه به اینکه ارزش این سفارش بیش از حد نصاب سازمانی است، جهت جلوگیری از مغایرت در اجرای تابلوهای برق، تایید الکترونیکی یا ورود کد احراز هویت از سوی <strong className="text-white">مدیر ارشد فنی</strong> الزامی است.
            </p>
          </div>
        </div>

        {/* Tab Selection: Verification by Code or by Email */}
        <div className="flex items-center gap-2 rounded-2xl bg-[#131b2e] p-1.5 border border-[#222a3d] mb-6 text-xs">
          <button
            onClick={() => {
              setActiveTab('code');
              setErrorMsg(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === 'code'
                ? 'bg-[#ffc174] text-[#472a00] shadow-md'
                : 'text-[#a08e7a] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">pin</span>
            <span>روش اول: کد تایید یکبار مصرف (OTP)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('email');
              setErrorMsg(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === 'email'
                ? 'bg-[#ffc174] text-[#472a00] shadow-md'
                : 'text-[#a08e7a] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">mail_lock</span>
            <span>روش دوم: تایید ایمیلی مدیریت فنی</span>
          </button>
        </div>

        {/* TAB 1: CODE / OTP VERIFICATION */}
        {activeTab === 'code' && (
          <form onSubmit={handleVerifyCodeSubmit} className="space-y-5 animate-in fade-in">
            <div className="text-xs text-[#d8c3ad] space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#a08e7a]">گیرنده کد امنیتی:</span>
                <span className="font-mono-num font-bold text-white">
                  مدیریت فنی: ۰۹۱۲***۴۵۶۷ • m.sharifi@pishro-panel.ir
                </span>
              </div>
              <p className="text-[11px] text-[#a08e7a]">
                کد تایید ۶ رقمی به تلفن و ایمیل رسمی مدیر فنی ارسال گردید.
              </p>
            </div>

            {/* 6-Digit OTP Inputs */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 direction-ltr" dir="ltr">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="h-12 w-10 sm:h-14 sm:w-12 rounded-xl border-2 border-[#2d3449] bg-[#0b1326] text-center font-mono-num text-xl font-bold text-white focus:border-[#ffc174] focus:bg-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#ffc174]/30 transition-all shadow-inner"
                />
              ))}
            </div>

            {/* Quick Demo Assist Button */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dashed border-[#ffc174]/30 bg-[#ffc174]/5 px-3 py-2 text-xs">
              <span className="text-[11px] text-[#a08e7a] flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-[#ffc174]">help</span>
                <span>کد تست محیط دمو: <strong className="font-mono-num text-white">{expectedDemoCode}</strong></span>
              </span>
              <button
                type="button"
                onClick={handleFillDemoCode}
                className="rounded-lg bg-[#ffc174]/20 px-2.5 py-1 text-[10px] font-bold text-[#ffc174] hover:bg-[#ffc174]/30 transition-colors"
              >
                درج خودکار کد دمو
              </button>
            </div>

            {/* Error Display */}
            {errorMsg && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3 text-xs text-rose-300 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-rose-400">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Resend & Timer */}
            <div className="flex items-center justify-between text-xs text-[#a08e7a]">
              <span>اعتبار کد ارسالی:</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-xs font-bold text-[#ffc174] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  <span>ارسال مجدد کد تایید</span>
                </button>
              ) : (
                <span className="font-mono-num text-amber-300">
                  {formattedTimer} تا امکان ارسال مجدد
                </span>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-[#2d3449] py-3 text-xs font-bold text-[#a08e7a] hover:text-white transition-colors"
              >
                انصراف و بازگشت
              </button>
              <button
                type="submit"
                disabled={isVerifying || otpDigits.join('').length < 6}
                className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffc174] to-[#f59e0b] py-3 text-xs font-bold text-[#472a00] hover:from-[#ffb95f] hover:to-[#d97706] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#f59e0b]/20"
              >
                {isVerifying ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-[#472a00] border-t-transparent animate-spin"></span>
                    <span>در حال اعتبارسنجی کد امنیتی...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">verified_user</span>
                    <span>تایید دو مرحله‌ای و ثبت سفارش</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: EMAIL APPROVAL SIMULATION */}
        {activeTab === 'email' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="rounded-2xl border border-[#2d3449] bg-[#131b2e] p-4 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#222a3d] pb-2 text-[11px] text-[#a08e7a]">
                <span>شبیه‌سازی ایمیل رسمی ارسالی به مدیریت فنی کارگاه</span>
                <span className="rounded bg-sky-500/20 px-1.5 py-0.2 text-sky-400 font-mono-num text-[10px]">
                  ENTERPRISE DISPATCH
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[#a08e7a]">گیرنده:</span>{' '}
                  <span className="font-mono-num text-white">
                    دکتر علیرضا میرزایی (مدیریت فنی) &lt;tech.director@pishro-panel.ir&gt;
                  </span>
                </div>
                <div>
                  <span className="text-[#a08e7a]">موضوع:</span>{' '}
                  <span className="text-amber-300 font-bold">
                    درخواست تایید فنی و اعتباری سفارش تجهیزات تابلویی - کارفرما {clientName}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-[#0b1326] p-3 text-[11px] text-[#d8c3ad] leading-relaxed border border-[#222a3d]">
                «سلام و احترام؛ پیش‌فاکتور سفارش تابلوی فشار ضعیف به ارزش{' '}
                <span className="font-mono-num font-bold text-white">
                  {totalAmount.toLocaleString('fa-IR')} تومان
                </span>{' '}
                جهت تطابق سلول‌ها و تایید نهایی آماده امضا است. با فشردن کلید زیر، تاییدیه ۲ مرحله‌ای در سامانه صادر خواهد شد.»
              </div>

              {emailApproved ? (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-center text-xs text-emerald-300 flex items-center justify-center gap-2 animate-in zoom-in-95">
                  <span className="material-symbols-outlined text-lg text-emerald-400">verified</span>
                  <span>تاییدیه الکترونیکی مدیریت فنی با موفقیت دریافت و امضا گردید! در حال ثبت نهایی...</span>
                </div>
              ) : (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSimulateEmailApprove}
                    disabled={isEmailSimulating}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 py-3 text-xs font-bold text-white hover:from-sky-400 hover:to-indigo-500 transition-all shadow-md"
                  >
                    {isEmailSimulating ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                        <span>در حال استعلام تاییدیه ایمیل مدیریت فنی...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">outgoing_mail</span>
                        <span>شبیه‌سازی تایید مستقیم از ایمیل مدیریت فنی (One-Click Approval)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#a08e7a]">
              <span>سیستم مدیریت دسترسی و انضباط مهندسی ERP</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">shield</span>
                <span>پروتکل رمزنگاری استاندارد تدارکات</span>
              </span>
            </div>
          </div>
        )}

        {/* Technical Footer Credentials */}
        <div className="mt-6 border-t border-[#222a3d] pt-4 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#a08e7a] font-mono-num">
          <div>شناسه الزامات: 2FA-POLICY-HIGH-VAL-LV</div>
          <div>مرجع استاندارد: IEC 61439-1 / نظام مهندسی برق</div>
        </div>
      </div>
    </div>
  );
};
