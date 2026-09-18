import React, { useState, useEffect, useRef } from 'react';
import { IndustrialOrder } from '../types';

interface ChatMessage {
  id: string;
  sender: 'engineer' | 'expert';
  senderName: string;
  senderRole: string;
  text: string;
  time: string;
  isRead?: boolean;
}

interface OrderCommercialChatWidgetProps {
  order: IndustrialOrder;
}

export const OrderCommercialChatWidget: React.FC<OrderCommercialChatWidgetProps> = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      sender: 'expert',
      senderName: 'مهندس مرادی',
      senderRole: 'کارشناس ارشد بازرگانی و ترخیص انبار شمس‌آباد',
      text: `درود مهندس گرامی! من مرادی هستم، مسئول بازرگانی و تخصیص انبار مرکزی. در خصوص اقلام و زمان‌بندی ترابری سفارش ${order.orderNumber} در خدمت شما هستم. در صورت نیاز به هماهنگی پالت، تست رله‌ها یا تعویض اقلام بفرمایید.`,
      time: order.time || '۱۰:۳۰',
      isRead: true,
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Quick prompt chips tailored for switchgear electrical engineers
  const quickPrompts = [
    'زمان تقریبی بارگیری پالت از انبار شمس‌آباد؟',
    'درخواست انجام تست عایقی مگر قبل از بارگیری',
    'هماهنگی تماس راننده ۱ ساعت قبل از ورود به کارگاه',
    'آیا قطعات تماماً ساخت اصل فرانسه و آلمان هستند؟',
  ];

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

    const newEngineerMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'engineer',
      senderName: order.clientName || 'مهندس ناظر',
      senderRole: 'مهندس ناظر پروژه',
      text: messageText,
      time: timeStr,
      isRead: true,
    };

    setMessages((prev) => [...prev, newEngineerMsg]);
    if (!textToSend) setInputValue('');

    // Simulate expert thinking and replying
    setIsTyping(true);
    setTimeout(() => {
      let replyText = `پیام شما در رابطه با سفارش ${order.orderNumber} دریافت شد. با واحد انبار مرکزی هماهنگی لازم انجام پذیرفت و نتیجه در پرونده سفارش درج گردید.`;

      const lower = messageText.toLowerCase();
      if (lower.includes('زمان') || lower.includes('بارگیری') || lower.includes('ارسال')) {
        replyText = `مهندس عزیز، اقلام سفارش شما هم‌اکنون در مرحله بسته‌بندی نهایی است. طبق زمان‌بندی ترابری، فردا صبح ساعت ۹:۰۰ بارنامه صادر شده و تا پیش از ظهر به کارگاه شما تحویل خواهد شد.`;
      } else if (lower.includes('تست') || lower.includes('مگر') || lower.includes('کیفیت')) {
        replyText = `دستور تست مقاومت عایقی (Megger 1000V) برای کلیدها و کنتاکتورهای سفارش به کارشناس QC ارجاع شد. برگه نتیجه تست همراه با گارانتی ۲۴ ماهه داخل پاکت مدارک پالت قرار خواهد گرفت.`;
      } else if (lower.includes('تماس') || lower.includes('راننده') || lower.includes('کارگاه')) {
        replyText = `شماره تماس سرپرست کارگاه شما (${order.phone}) بر روی بارنامه دولتی ثبت شد و به راننده ابلاغ گردید حداقل ۲ ساعت قبل از تخلیه با شما هماهنگ فرماید.`;
      } else if (lower.includes('اصل') || lower.includes('فرانسه') || lower.includes('آلمان') || lower.includes('اصالت')) {
        replyText = `کلیه قطعات اشنایدر و زیمنس این سفارش دارای برچسب هولوگرام اصالت کالا و گواهی مبدأ (Certificate of Origin) رسمی بوده و تایپ‌تست بین‌المللی IEC 60947 دارند.`;
      } else if (lower.includes('جایگزین') || lower.includes('تغییر') || lower.includes('موجودی')) {
        replyText = `در صورت نیاز به هرگونه تغییر در تیپ کلیدها، از طریق ویجت موجودی زنده می‌توانید قطعه جایگزین را انتخاب فرمایید یا بفرمایید تا مستقیماً برای شما از لاله زار تخصیص دهیم.`;
      }

      const expertReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'expert',
        senderName: 'مهندس مرادی',
        senderRole: 'کارشناس بازرگانی انبار شمس‌آباد',
        text: replyText,
        time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
      };

      setMessages((prev) => [...prev, expertReply]);
      setIsTyping(false);

      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }
    }, 1200);
  };

  return (
    <aside aria-label="پشتیبانی آنلاین بازرگانی انبار" className="fixed bottom-4 left-4 sm:left-6 z-40 font-sans print:hidden">
      {/* Minimized Non-Intrusive Floating Dock/Badge */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 rounded-2xl border border-[#ffc174]/50 bg-[#131b2e]/95 p-2.5 sm:px-4 sm:py-3 shadow-2xl backdrop-blur-md hover:bg-[#1a233a] hover:border-[#ffc174] transition-all duration-300"
          title="گفتگوی مستقیم با کارشناس بازرگانی انبار"
        >
          {/* Avatar with live pulse dot */}
          <div className="relative shrink-0">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffc174] to-[#f59e0b] text-[#472a00] font-bold shadow-md">
              <span className="material-symbols-outlined text-xl">support_agent</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#131b2e]"></span>
            </span>
          </div>

          {/* Text Labels (responsive: icon-only on very narrow screen or full info) */}
          <div className="text-right hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white group-hover:text-[#ffc174] transition-colors">
                گفتگو با کارشناس بازرگانی انبار
              </span>
              <span className="rounded bg-[#ffc174]/15 px-1.5 py-0.2 font-mono-num text-[10px] text-[#ffc174] border border-[#ffc174]/30">
                {order.orderNumber}
              </span>
            </div>
            <p className="text-[10px] text-[#a08e7a] flex items-center gap-1 mt-0.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>مهندس مرادی (پاسخگویی آنلاین در مورد این سفارش)</span>
            </p>
          </div>

          {/* Unread badge */}
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ffc174] px-1 font-mono-num text-[10px] font-bold text-[#472a00] shadow-sm animate-bounce">
              {unreadCount}
            </span>
          )}

          <span className="material-symbols-outlined text-base text-[#a08e7a] group-hover:text-white transition-transform">
            chat
          </span>
        </button>
      )}

      {/* Expanded Non-Intrusive Chat Box Window */}
      {isOpen && (
        <div className="flex flex-col w-[320px] sm:w-[380px] h-[480px] rounded-2xl border border-[#ffc174]/50 bg-[#0f172a] shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Top Bar Header */}
          <div className="flex items-center justify-between border-b border-[#222a3d] bg-[#131b2e] px-4 py-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffc174] to-[#f59e0b] text-[#472a00] font-bold">
                  <span className="material-symbols-outlined text-lg">support_agent</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#131b2e]"></span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white">مهندس مرادی</h4>
                  <span className="rounded bg-emerald-950/60 px-1.5 py-0.2 text-[9px] text-emerald-400 border border-emerald-500/30">
                    آنلاین در انبار
                  </span>
                </div>
                <p className="text-[10px] text-[#a08e7a] truncate max-w-[200px]">
                  هماهنگی فنی سفارش {order.orderNumber}
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-[#a08e7a] hover:bg-[#1e293b] hover:text-white transition-colors"
                title="کوچک‌نمایی چت"
              >
                <span className="material-symbols-outlined text-base">expand_more</span>
              </button>
            </div>
          </div>

          {/* Context Badge of Order */}
          <div className="flex items-center justify-between bg-[#171f33] px-3.5 py-1.5 border-b border-[#222a3d] text-[10px] text-[#a08e7a]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#ffc174]">inventory</span>
              <span>تجهیزات: {order.items.length} قلم تابلویی</span>
            </span>
            <span className="font-mono-num text-[#ffc174]">{order.statusLabel}</span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((msg) => {
              const isMe = msg.sender === 'engineer';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1 text-[10px] text-[#a08e7a] mb-1 font-mono-num px-1">
                    <span>{msg.senderName}</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 leading-relaxed text-xs shadow-sm ${
                      isMe
                        ? 'bg-[#ffc174] text-[#472a00] rounded-tl-xs font-medium'
                        : 'bg-[#1e293b] text-white rounded-tr-xs border border-[#2d3449]'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-[#a08e7a] text-[11px] bg-[#1e293b]/60 px-3 py-2 rounded-xl w-fit border border-[#2d3449]">
                <span className="flex h-2 w-2 rounded-full bg-[#ffc174] animate-ping"></span>
                <span>مهندس مرادی در حال تایپ پاسخ...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="border-t border-[#222a3d] bg-[#131b2e]/70 px-3 py-2 shrink-0">
            <div className="text-[10px] text-[#a08e7a] mb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#ffc174]">bolt</span>
              <span>پرسش‌های سریع متداول ناظرین فنی:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="shrink-0 rounded-lg border border-[#2d3449] bg-[#0b1326] px-2.5 py-1 text-[10px] text-[#d8c3ad] hover:border-[#ffc174] hover:text-white transition-all whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input & Send Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="border-t border-[#222a3d] bg-[#0f172a] p-3 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="پیام به انبار شمس‌آباد..."
              className="flex-1 rounded-xl border border-[#2d3449] bg-[#131b2e] px-3 py-2 text-xs text-white placeholder-[#5d647a] focus:border-[#ffc174] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffc174] text-[#472a00] hover:bg-[#ffb95f] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shrink-0"
              title="ارسال پیام"
            >
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </form>
        </div>
      )}
    </aside>
  );
};
