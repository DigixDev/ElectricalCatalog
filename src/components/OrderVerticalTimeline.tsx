import React, { useState } from 'react';
import { IndustrialOrder, OrderTimelineEvent } from '../types';

interface OrderVerticalTimelineProps {
  order: IndustrialOrder;
  onAddTimelineNote?: (note: string) => void;
}

export const OrderVerticalTimeline: React.FC<OrderVerticalTimelineProps> = ({
  order,
  onAddTimelineNote,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'completed' | 'active'>('all');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<Record<string, boolean>>({
    'step-1': true,
    'step-2': true,
    'step-3': true,
    'step-4': true,
    'step-5': true,
  });
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [engineerNotes, setEngineerNotes] = useState<
    Array<{ id: string; author: string; time: string; text: string; stepNumber: number }>
  >([]);

  // Construct comprehensive timeline events based on the order's state
  const baseTimelineEvents: OrderTimelineEvent[] = [
    {
      id: 'step-1',
      stepNumber: 1,
      status: 'pending',
      title: 'ثبت اولیه سفارش و اعتبارسنجی لیست تجهیزات (BOM)',
      description:
        'استخراج مشخصات تجهیزات، تعیین اولویت تامین و تطابق کدهای فنی (SKU) با نیازمندی‌های دیاگرام تک‌خطی تابلو.',
      timestamp: `${order.date} • ${order.time}`,
      date: order.date,
      time: order.time,
      department: 'واحد مهندسی تدارکات و کارتابل ناظر برق',
      operatorName: order.clientName,
      operatorRole: `مهندس ناظر (${order.engCode})`,
      isCompleted: order.currentStep > 1 || order.status === 'completed',
      isCurrent: order.currentStep === 1 && order.status !== 'completed',
      icon: 'playlist_add_check',
      trackingCode: `REG-${order.orderNumber.slice(-6)}`,
      technicalChecks: [
        'تایید تطابق تگ‌های تابلو با نقشه SLD پروژه',
        'بررسی قدرت قطع کلیدها (Icu) متناسب با سطح اتصال کوتاه شبکه',
        `تثبیت تعداد اقلام سفارش (${order.items.length} ردیف تجهیز تابلوسازی)`,
        'تخصیص شماره پرونده سفارش در سیستم یکپارچه تدارکات',
      ],
      engineerNote: order.engineerNote || undefined,
    },
    {
      id: 'step-2',
      stepNumber: 2,
      status: 'confirmed',
      title: 'تایید فنی، استعلام قیمت روز و صدور پیش‌فاکتور رسمی',
      description:
        'بررسی هماهنگی حفاظتی (Selectivity)، محاسبه مالیات و تخفیف‌های پروژه‌ای و تثبیت قیمت قطعات در سیستم.',
      timestamp: order.currentStep >= 2 ? `${order.date} • ۱۴:۱۵:۰۰` : 'در انتظار تایید فنی و مالی',
      date: order.date,
      time: '۱۴:۱۵:۰۰',
      department: 'دپارتمان مهندسی فروش و استاندارد IEC',
      operatorName: 'مهندس حسینی',
      operatorRole: 'سرپرست مهندسی فروش صنعتی',
      isCompleted: order.currentStep > 2 || order.status === 'completed',
      isCurrent: order.currentStep === 2 && order.status !== 'completed',
      icon: 'verified',
      trackingCode: `VAL-${order.orderNumber.slice(-6)}`,
      technicalChecks: [
        'تطابق تایپ‌تست بین‌المللی تجهیزات بر اساس استاندارد IEC 60947',
        'تثبیت سهمیه ارز و قیمت ریالی تجهیزات دارای نوسان',
        'صدور پیش‌فاکتور رسمی با شناسه اقتصادی و کد مالیاتی',
        'ارسال پیامک تاییدیه به مهندس ناظر کارگاه',
      ],
    },
    {
      id: 'step-3',
      stepNumber: 3,
      status: 'preparing',
      title: 'تخصیص انبار، کنترل کیفی (QC) و پالت‌بندی اختصاصی',
      description:
        'تفکیک قطعات از قفسه‌های انبار مرکزی شمس‌آباد، اسکن بارکدهای اصالت و بسته‌بندی ضد رطوبت صنعتی.',
      timestamp: order.currentStep >= 3 ? `${order.date} • ۱۶:۴۰:۰۰` : 'طبق زمان‌بندی انبار',
      date: order.date,
      time: '۱۶:۴۰:۰۰',
      department: 'انبار مرکزی و واحد کنترل کیفیت (QC)',
      operatorName: 'مهندس کارگر / واحد بازرسی فنی',
      operatorRole: 'سرپرست انبارداری شمس‌آباد',
      isCompleted: order.currentStep > 3 || order.status === 'completed',
      isCurrent: order.currentStep === 3 && order.status !== 'completed',
      icon: 'inventory_2',
      trackingCode: `PKG-${order.orderNumber.slice(-6)}`,
      technicalChecks: [
        'کنترل سلامت فیزیکی قطعات و ترمینال‌های قدرت',
        'تست عایقی (Megger Test) برای تجهیزات حساس ولتاژ پایین',
        'بسته‌بندی بر روی پالت چوبی استاندارد با وکیوم شیرینگ محافظ',
        'نصب لیبل بارکد دوبعدی با درج شماره پروژه کارفرما',
      ],
    },
    {
      id: 'step-4',
      stepNumber: 4,
      status: 'ready',
      title: 'صدور بارنامه ترابری و بارگیری در ناوگان حمل ایمن',
      description:
        'تحویل به ناوگان حمل تجهیزات سنگین و حساس برقی با صدور بارنامه دولتی و بیمه‌نامه معتبر ترابری.',
      timestamp: order.currentStep >= 4 ? `${order.date} • ۰۹:۰۰:۰۰` : 'آماده‌سازی بعد از مونتاژ پالت',
      date: order.date,
      time: '۰۹:۰۰:۰۰',
      department: 'دپارتمان لجستیک و ترابری تخصصی تجهیزات برق',
      operatorName: 'باربری صنعت پیشرو',
      operatorRole: 'مدیر لجستیک ترابری سنگین',
      isCompleted: order.currentStep > 4 || order.status === 'completed',
      isCurrent: order.currentStep === 4 && order.status !== 'completed',
      icon: 'local_shipping',
      trackingCode: `BOL-TRB-${order.orderNumber.slice(-5)}`,
      technicalChecks: [
        'پلمب درب بارگیر با شماره سریال ثبت شده در بارنامه',
        'صدور بیمه‌نامه جامع حوادث و مسافت ترابری',
        'فعال‌سازی سیستم رهگیری پیامکی و موقعیت‌یاب ناوگان برای خریدار',
      ],
    },
    {
      id: 'step-5',
      stepNumber: 5,
      status: 'completed',
      title: 'تحویل قطعی در کارگاه تابلوسازی و امضای صورتجلسه',
      description:
        'تطابق اقلام در حضور ناظر فنی پروژه، تست مکانیکی کلیدها و بستن نهایی پرونده سفارش در سیستم.',
      timestamp: order.currentStep === 5 ? `${order.date} • ۱۱:۳۰:۰۰` : 'مقصد کارگاه تابلوسازی',
      date: order.date,
      time: '۱۱:۳۰:۰۰',
      department: 'امور تحویل کارگاهی و بازرسی نهایی',
      operatorName: order.clientName,
      operatorRole: 'ناظر فنی دریافت‌کننده',
      isCompleted: order.currentStep === 5,
      isCurrent: order.currentStep === 5,
      icon: 'task_alt',
      trackingCode: `FIN-${order.orderNumber.slice(-6)}`,
      technicalChecks: [
        'بررسی مطابقت فیزیکی اقلام تحویلی با جدول اقلام پیش‌فاکتور',
        'تحویل اصل شناسنامه، گارانتی ۲۴ ماهه و برگه تست کارخانه‌ای',
        'امضای الکترونیکی صورتجلسه تحویل قطعی در محل کارگاه',
      ],
    },
  ];

  // Merge any dynamic events stored on the order object if present
  const timelineEvents = order.history && order.history.length > 0
    ? order.history
    : baseTimelineEvents;

  // Filter based on user selection
  const filteredEvents = timelineEvents.filter((ev) => {
    if (filterMode === 'completed') return ev.isCompleted;
    if (filterMode === 'active') return ev.isCurrent;
    return true;
  });

  const toggleDetails = (stepId: string) => {
    setShowTechnicalDetails((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote = {
      id: `note-${Date.now()}`,
      author: order.clientName || 'مهندس ناظر',
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      text: newNoteText.trim(),
      stepNumber: order.currentStep,
    };

    setEngineerNotes([newNote, ...engineerNotes]);
    onAddTimelineNote?.(newNoteText.trim());
    setNewNoteText('');
    setIsAddingNote(false);
  };

  // Progress metrics
  const completedCount = timelineEvents.filter((e) => e.isCompleted).length;
  const progressPercent = Math.round((order.currentStep / 5) * 100);

  return (
    <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-6 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-[#ffc174]/5 blur-3xl pointer-events-none"></div>

      {/* Header with Title and Overall Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#222a3d] pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffc174]/20 text-[#ffc174] border border-[#ffc174]/30">
              <span className="material-symbols-outlined text-xl">conversion_path</span>
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>تایم‌لاین عمودی رهگیری گام‌به‌گام وضعیت سفارش</span>
                <span className="rounded bg-[#ffc174]/15 px-2 py-0.5 font-mono-num text-xs text-[#ffc174] border border-[#ffc174]/30">
                  {order.orderNumber}
                </span>
              </h3>
              <p className="text-xs text-[#a08e7a] mt-0.5">
                ثبت تاریخچه تغییر وضعیت‌ها، اقدامات کنترل کیفیت (QC) و تاییدات مهندسی در زنجیره تامین
              </p>
            </div>
          </div>
        </div>

        {/* Progress Badge and Quick Action */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#2d3449] bg-[#131b2e] px-4 py-2 text-right">
            <div className="text-[10px] text-[#a08e7a]">پیشرفت فرایند تامین</div>
            <div className="flex items-center gap-2 font-mono-num font-bold text-sm text-[#ffc174]">
              <span>گام {order.currentStep} از ۵</span>
              <span className="text-xs text-[#d8c3ad]">({progressPercent}٪)</span>
            </div>
          </div>

          <button
            onClick={() => setIsAddingNote(!isAddingNote)}
            className="flex items-center gap-1.5 rounded-xl border border-[#ffc174]/40 bg-[#ffc174]/15 px-3.5 py-2.5 text-xs font-bold text-[#ffc174] hover:bg-[#ffc174]/25 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-base">edit_note</span>
            <span>ثبت تذکر ناظر</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Visual Line */}
      <div className="mb-6">
        <div className="h-2 w-full rounded-full bg-[#131b2e] overflow-hidden p-0.5 border border-[#222a3d]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-[#ffc174] to-[#f59e0b] transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-[#a08e7a] font-mono-num">
          <span>شروع: ثبت سفارش در مدار</span>
          <span>وضعیت فعلی: {order.statusLabel}</span>
          <span>هدف: تحویل قطعی در کارگاه</span>
        </div>
      </div>

      {/* Quick Filter Buttons & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#131b2e] p-3 border border-[#222a3d] mb-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#a08e7a] text-[11px]">فیلتر نمایش:</span>
          <button
            onClick={() => setFilterMode('all')}
            className={`rounded-lg px-2.5 py-1 font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-[#ffc174] text-[#472a00]'
                : 'text-[#d8c3ad] hover:bg-[#171f33]'
            }`}
          >
            همه ۵ گام اصلی
          </button>
          <button
            onClick={() => setFilterMode('completed')}
            className={`rounded-lg px-2.5 py-1 font-bold transition-all ${
              filterMode === 'completed'
                ? 'bg-emerald-500 text-black'
                : 'text-[#d8c3ad] hover:bg-[#171f33]'
            }`}
          >
            گام‌های تکمیل شده ({completedCount})
          </button>
          <button
            onClick={() => setFilterMode('active')}
            className={`rounded-lg px-2.5 py-1 font-bold transition-all ${
              filterMode === 'active'
                ? 'bg-[#ffc174] text-[#472a00]'
                : 'text-[#d8c3ad] hover:bg-[#171f33]'
            }`}
          >
            گام فعال کنونی
          </button>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#a08e7a]">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            تکمیل شده
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#ffc174] animate-pulse"></span>
            در دست اقدام
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#3b4254]"></span>
            در نوبت
          </span>
        </div>
      </div>

      {/* Inline Form to Add Technical Engineer Note */}
      {isAddingNote && (
        <form
          onSubmit={handleAddNoteSubmit}
          className="mb-6 rounded-xl border border-[#ffc174]/40 bg-[#131b2e] p-4 text-xs animate-in fade-in"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ffc174] text-base">add_comment</span>
              <span>افزودن تذکر یا الزام فنی جدید به تایم‌لاین سفارش</span>
            </span>
            <button
              type="button"
              onClick={() => setIsAddingNote(false)}
              className="text-[#a08e7a] hover:text-white"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
          <p className="text-[11px] text-[#a08e7a] mb-2">
            تذکر ثبت شده توسط شما به عنوان ناظر پروژه مستقیماً در کارتابل لجستیک و انبار شمس‌آباد بازتاب خواهد یافت.
          </p>
          <textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="مثال: لطفا بر روی پالت‌ها برچسب مربوط به سلول شماره ۲ پست برق شمس‌آباد نصب گردد و قبل از اعزام با ناظر کارگاه تماس حاصل فرمایید..."
            rows={2}
            className="w-full rounded-lg border border-[#2d3449] bg-[#0b1326] p-2.5 text-white placeholder-[#5d647a] focus:border-[#ffc174] focus:outline-none"
          />
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingNote(false)}
              className="rounded-lg border border-[#2d3449] px-3 py-1.5 text-xs text-[#a08e7a] hover:text-white"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#ffc174] px-4 py-1.5 text-xs font-bold text-[#472a00] hover:bg-[#ffb95f]"
            >
              ثبت در پرونده سفارش
            </button>
          </div>
        </form>
      )}

      {/* Engineer Injected Dynamic Notes */}
      {engineerNotes.length > 0 && (
        <div className="mb-6 space-y-2">
          {engineerNotes.map((note) => (
            <div
              key={note.id}
              className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-950/20 p-3 text-xs"
            >
              <span className="material-symbols-outlined text-amber-400 text-lg mt-0.5">
                speaker_notes
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between font-mono-num text-[11px] text-amber-300">
                  <span className="font-bold font-sans">تذکر الحاقی ناظر ({note.author})</span>
                  <span>{note.time}</span>
                </div>
                <p className="text-white mt-1 leading-relaxed">{note.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* THE VERTICAL TIMELINE CONTAINER */}
      <div className="relative pr-6 sm:pr-8">
        {/* Continuous Vertical Connecting Line */}
        <div
          className="absolute right-[19px] sm:right-[27px] top-4 bottom-6 w-0.5 bg-[#222a3d] pointer-events-none"
          style={{
            background:
              order.currentStep === 5
                ? '#10b981'
                : `linear-gradient(to bottom, #10b981 0%, #10b981 ${
                    (completedCount / 5) * 100
                  }%, #ffc174 ${((completedCount + 1) / 5) * 100}%, #222a3d 100%)`,
          }}
        ></div>

        {/* List of Timeline Step Cards */}
        <div className="space-y-6">
          {filteredEvents.map((ev, idx) => {
            const isCompleted = ev.isCompleted;
            const isCurrent = ev.isCurrent;
            const isPending = !isCompleted && !isCurrent;
            const isDetailsOpen = showTechnicalDetails[ev.id] ?? false;

            return (
              <div key={ev.id} className="relative flex items-start gap-4 sm:gap-6 group">
                {/* Vertical Node Indicator Icon Circle */}
                <div className="relative z-10 shrink-0">
                  <div
                    className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border-2 transition-all shadow-lg ${
                      isCompleted
                        ? 'border-emerald-500 bg-emerald-950/80 text-emerald-400 shadow-emerald-500/20'
                        : isCurrent
                        ? 'border-[#ffc174] bg-[#ffc174]/20 text-[#ffc174] ring-4 ring-[#ffc174]/20 animate-pulse shadow-[#ffc174]/30'
                        : 'border-[#2d3449] bg-[#131b2e] text-[#a08e7a]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg sm:text-xl font-bold">
                      {isCompleted ? 'check' : ev.icon}
                    </span>
                  </div>

                  {/* Step Number Bubble */}
                  <div
                    className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full font-mono-num text-[10px] font-bold ${
                      isCompleted
                        ? 'bg-emerald-500 text-black'
                        : isCurrent
                        ? 'bg-[#ffc174] text-[#472a00]'
                        : 'bg-[#222a3d] text-[#a08e7a]'
                    }`}
                  >
                    {ev.stepNumber}
                  </div>
                </div>

                {/* Step Card Content */}
                <div
                  className={`flex-1 rounded-2xl border transition-all p-4 sm:p-5 ${
                    isCurrent
                      ? 'border-[#ffc174]/60 bg-gradient-to-r from-[#171f33] to-[#1a233a] shadow-lg shadow-[#ffc174]/10'
                      : isCompleted
                      ? 'border-emerald-500/30 bg-[#131b2e]/90 hover:border-emerald-500/50'
                      : 'border-[#222a3d] bg-[#131b2e]/40 opacity-75'
                  }`}
                >
                  {/* Top Bar of the Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#222a3d]/60 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-lg px-2 py-0.5 text-[11px] font-bold border ${
                          isCompleted
                            ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400'
                            : isCurrent
                            ? 'border-[#ffc174]/40 bg-[#ffc174]/20 text-[#ffc174]'
                            : 'border-[#2d3449] bg-[#0b1326] text-[#a08e7a]'
                        }`}
                      >
                        {isCompleted
                          ? 'تکمیل شد ✓'
                          : isCurrent
                          ? 'در دست اقدام (فعال)'
                          : 'در نوبت فرایند'}
                      </span>

                      <h4 className="font-bold text-sm sm:text-base text-white">{ev.title}</h4>
                    </div>

                    {/* Timestamp and Tracking Reference */}
                    <div className="flex items-center gap-2 font-mono-num text-xs text-[#a08e7a]">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span>{ev.timestamp}</span>
                      {ev.trackingCode && (
                        <span className="rounded bg-[#0b1326] px-1.5 py-0.5 text-[10px] text-[#ffc174] border border-[#222a3d]">
                          {ev.trackingCode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Main Description */}
                  <p className="mt-3 text-xs text-[#d8c3ad] leading-relaxed">{ev.description}</p>

                  {/* Operator & Responsible Department Badge */}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-[#a08e7a] border-t border-[#222a3d]/40 pt-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#ffc174]">
                        account_circle
                      </span>
                      <span>مسئول اقدام:</span>
                      <strong className="text-white">{ev.operatorName}</strong>
                      <span className="text-[10px]">({ev.operatorRole})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-sky-400">domain</span>
                      <span>واحد:</span>
                      <span className="text-[#dae2fd]">{ev.department}</span>
                    </div>
                  </div>

                  {/* Existing Engineer Note on this step */}
                  {ev.engineerNote && (
                    <div className="mt-3 rounded-xl border border-[#2d3449] bg-[#0b1326] p-3 text-xs text-[#dae2fd]">
                      <div className="flex items-center gap-1 font-bold text-[#ffc174] text-[11px] mb-1">
                        <span className="material-symbols-outlined text-sm">sticky_note_2</span>
                        <span>دستورالعمل مهندسی ثبت شده توسط متقاضی:</span>
                      </div>
                      <p className="text-[11px] text-[#d8c3ad] leading-relaxed font-sans">
                        «{ev.engineerNote}»
                      </p>
                    </div>
                  )}

                  {/* Technical Checklist Accordion */}
                  {ev.technicalChecks && ev.technicalChecks.length > 0 && (
                    <div className="mt-3 pt-2">
                      <button
                        onClick={() => toggleDetails(ev.id)}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-[#ffc174] hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-base transition-transform">
                          {isDetailsOpen ? 'expand_less' : 'expand_more'}
                        </span>
                        <span>
                          {isDetailsOpen
                            ? 'بستن چک‌لیست کنترل کیفیت و الزامات فنی'
                            : `مشاهده الزامات مهندسی و بازرسی فنی (${ev.technicalChecks.length} مورد)`}
                        </span>
                      </button>

                      {isDetailsOpen && (
                        <div className="mt-2.5 space-y-1.5 rounded-xl border border-[#222a3d] bg-[#0b1326]/70 p-3 animate-in fade-in">
                          {ev.technicalChecks.map((check, cIdx) => (
                            <div
                              key={cIdx}
                              className="flex items-center gap-2 text-[11px] text-[#dae2fd]"
                            >
                              <span
                                className={`material-symbols-outlined text-sm ${
                                  isCompleted
                                    ? 'text-emerald-400'
                                    : isCurrent
                                    ? 'text-[#ffc174]'
                                    : 'text-[#5d647a]'
                                }`}
                              >
                                {isCompleted ? 'check_circle' : isCurrent ? 'pending' : 'radio_button_unchecked'}
                              </span>
                              <span className={isPending ? 'text-[#8b92a5]' : ''}>{check}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Footer SLA Notice */}
      <div className="mt-8 flex flex-wrap items-center justify-between rounded-xl border border-[#222a3d] bg-[#131b2e] p-3 text-xs text-[#a08e7a] gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-base">support_agent</span>
          <span>پشتیبانی مهندسی و لجستیک: ۰۲۱-۸۸۴۲۵۶۹۰ (داخلی ۱۰۴)</span>
        </div>
        <div className="flex items-center gap-2 font-mono-num text-[11px]">
          <span>بروزرسانی زنده بر اساس گردش کار سامانه ERP</span>
        </div>
      </div>
    </div>
  );
};
