import React, { useState } from 'react';
import { IndustrialOrder } from '../types';

interface AdminOrdersViewProps {
  orders: IndustrialOrder[];
  onSelectOrder: (order: IndustrialOrder) => void;
  onUpdateStatus: (orderId: string, newStatus: IndustrialOrder['status'], newStep: number) => void;
}

export const AdminOrdersView: React.FC<AdminOrdersViewProps> = ({
  orders,
  onSelectOrder,
  onUpdateStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = filterStatus === 'all' || ord.status === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.engCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // KPI calculations
  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const totalValueM = (orders.reduce((acc, o) => acc + o.subtotal, 0) / 1000000).toFixed(1);

  return (
    <div className="min-h-screen bg-[#0b1326] pb-24 text-[#dae2fd]">
      {/* Header */}
      <section className="border-b border-[#2d3449] bg-gradient-to-b from-[#131b2e] to-[#0b1326] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded bg-[#ffc174]/15 px-2 py-0.5 font-mono-num text-xs font-bold text-[#ffc174] border border-[#ffc174]/30">
                  DISPATCH CONSOLE
                </span>
                <span className="text-xs text-[#a08e7a]">میز کار تدارکات و لجستیک تابلو برق</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                کارتابل سفارشات و مدیریت ترخیص انبار
              </h1>
              <p className="mt-1 text-sm text-[#d8c3ad]">
                بررسی دیاگرام‌های تابلویی، صدور پیش‌فاکتور رسمی، پالت‌بندی و پایش تعهدات SLA
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3 py-1.5 text-xs text-emerald-400 font-mono-num">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                ERP DISPATCH ONLINE
              </span>
            </div>
          </div>

          {/* KPI Cards (from HTML 1.2) */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-[#2d3449] bg-[#171f33] p-4">
              <div className="flex items-center justify-between text-[#a08e7a] text-xs">
                <span>کل سفارشات ثبت شده</span>
                <span className="material-symbols-outlined text-[#ffc174]">receipt_long</span>
              </div>
              <div className="mt-2 font-mono-num text-2xl font-bold text-white">{totalOrders}</div>
              <div className="text-[11px] text-[#a08e7a] mt-1">امروز در کلیه مناطق صنعتی</div>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-[#171f33] p-4">
              <div className="flex items-center justify-between text-amber-400 text-xs">
                <span>نیازمند تعیین قیمت روز</span>
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
              <div className="mt-2 font-mono-num text-2xl font-bold text-amber-400">{pendingCount}</div>
              <div className="text-[11px] text-[#a08e7a] mt-1">استعلام بازرگانی لاله زار</div>
            </div>

            <div className="rounded-2xl border border-sky-500/30 bg-[#171f33] p-4">
              <div className="flex items-center justify-between text-sky-400 text-xs">
                <span>در حال آماده‌سازی و پالت</span>
                <span className="material-symbols-outlined">inventory_2</span>
              </div>
              <div className="mt-2 font-mono-num text-2xl font-bold text-sky-400">{preparingCount}</div>
              <div className="text-[11px] text-[#a08e7a] mt-1">انبار مرکزی شمس‌آباد</div>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-[#171f33] p-4">
              <div className="flex items-center justify-between text-emerald-400 text-xs">
                <span>ارزش ریالی سفارشات</span>
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div className="mt-2 font-mono-num text-2xl font-bold text-white">
                {totalValueM}{' '}
                <span className="text-xs font-normal text-[#a08e7a]">م. تومان</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">تراکنش‌های ۲۴ ساعت گذشته</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Table Area */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
        {/* Toolbar: Search and Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[#2d3449] bg-[#171f33] p-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {[
              { id: 'all', label: 'همه سفارشات' },
              { id: 'pending', label: 'در انتظار بررسی' },
              { id: 'confirmed', label: 'تایید شده' },
              { id: 'preparing', label: 'در حال آماده‌سازی' },
              { id: 'completed', label: 'تکمیل شده' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`rounded-xl px-3 py-1.5 font-bold transition-all whitespace-nowrap ${
                  filterStatus === tab.id
                    ? 'bg-[#ffc174] text-[#472a00]'
                    : 'text-[#d8c3ad] hover:bg-[#131b2e]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute right-3 top-2.5 text-[#a08e7a] text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو بر اساس کد، مهندس یا کارگاه..."
              className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] py-2 pr-9 pl-3 text-xs text-white placeholder-[#a08e7a] focus:border-[#ffc174] focus:outline-none"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#2d3449] bg-[#171f33] shadow-xl">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-[#2d3449] bg-[#131b2e] text-[#a08e7a]">
              <tr>
                <th className="p-4 font-bold">شماره سفارش</th>
                <th className="p-4 font-bold">تاریخ و ساعت</th>
                <th className="p-4 font-bold">متقاضی و پروژه</th>
                <th className="p-4 font-bold">دسته‌بندی تجهیزات</th>
                <th className="p-4 font-bold text-center">اقلام</th>
                <th className="p-4 font-bold text-left">مبلغ سفارش</th>
                <th className="p-4 font-bold text-center">وضعیت</th>
                <th className="p-4 font-bold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222a3d]">
              {filteredOrders.map((ord) => {
                const isPending = ord.status === 'pending';
                const isConfirmed = ord.status === 'confirmed';
                const isPreparing = ord.status === 'preparing';
                const isCompleted = ord.status === 'completed';

                return (
                  <tr key={ord.id} className="hover:bg-[#131b2e]/50 transition-colors">
                    <td className="p-4 font-mono-num font-bold text-white">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectOrder(ord)}
                          className="hover:text-[#ffc174] text-right"
                        >
                          {ord.orderNumber}
                        </button>
                        {ord.twoFactorVerified && (
                          <span
                            className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] text-emerald-400 font-bold border border-emerald-500/40 flex items-center gap-0.5 shrink-0"
                            title={`تایید دو مرحله‌ای ۲FA توسط ${ord.twoFactorApprover || 'مدیریت فنی'}`}
                          >
                            <span className="material-symbols-outlined text-[11px]">verified_user</span>
                            <span>2FA</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-mono-num text-[#d8c3ad]">
                      <div>{ord.date}</div>
                      <div className="text-[10px] text-[#a08e7a]">{ord.time}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-white">{ord.clientName}</div>
                      <div className="text-[11px] text-[#a08e7a] truncate max-w-[180px]">
                        {ord.company} ({ord.engCode})
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="rounded bg-[#131b2e] px-2 py-0.5 font-mono-num text-[11px] text-[#ffc174] border border-[#222a3d]">
                        {ord.tagGroup}
                      </span>
                    </td>

                    <td className="p-4 text-center font-mono-num font-bold text-white">
                      {ord.items.length} قلم
                    </td>

                    <td className="p-4 text-left font-mono-num font-bold text-white">
                      {ord.subtotal > 0 ? (
                        <>
                          {ord.subtotal.toLocaleString('fa-IR')}{' '}
                          <span className="text-[10px] text-[#a08e7a]">تومان</span>
                        </>
                      ) : (
                        <span className="text-amber-400">استعلام</span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold border ${
                          isPending
                            ? 'border-amber-500/40 bg-amber-950/40 text-amber-400'
                            : isConfirmed
                            ? 'border-sky-500/40 bg-sky-950/40 text-sky-400'
                            : isPreparing
                            ? 'border-indigo-500/40 bg-indigo-950/40 text-indigo-400'
                            : isCompleted
                            ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400'
                            : 'border-slate-500/40 bg-slate-950/40 text-slate-400'
                        }`}
                      >
                        {ord.statusLabel}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onSelectOrder(ord)}
                          className="rounded-lg bg-[#222a3d] px-2.5 py-1 text-xs text-[#ffc174] hover:bg-[#2d3449] border border-[#2d3449]"
                          title="مشاهده پیش‌فاکتور و رهگیری"
                        >
                          بررسی
                        </button>

                        <button
                          onClick={() => onSelectOrder(ord)}
                          className="flex items-center justify-center rounded-lg bg-[#222a3d] p-1 text-xs text-[#d8c3ad] hover:text-[#ffc174] hover:bg-[#2d3449] border border-[#2d3449]"
                          title="گفتگو با کارشناس بازرگانی انبار در مورد این سفارش"
                        >
                          <span className="material-symbols-outlined text-sm">chat</span>
                        </button>

                        {/* Quick Workflow Stepper Advancement */}
                        {isPending && (
                          <button
                            onClick={() => onUpdateStatus(ord.id, 'confirmed', 2)}
                            className="rounded-lg bg-sky-500/20 px-2 py-1 text-xs text-sky-400 hover:bg-sky-500/30 border border-sky-500/40"
                            title="تایید فنی و مالی"
                          >
                            تایید
                          </button>
                        )}
                        {isConfirmed && (
                          <button
                            onClick={() => onUpdateStatus(ord.id, 'preparing', 3)}
                            className="rounded-lg bg-indigo-500/20 px-2 py-1 text-xs text-indigo-400 hover:bg-indigo-500/30 border border-indigo-500/40"
                            title="ارسال به واحد بسته‌بندی انبار"
                          >
                            تجهیز
                          </button>
                        )}
                        {isPreparing && (
                          <button
                            onClick={() => onUpdateStatus(ord.id, 'completed', 5)}
                            className="rounded-lg bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40"
                            title="تحویل قطعی در کارگاه"
                          >
                            تحویل
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
