import React from 'react';
import { ScreenType } from '../types';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  cartCount: number;
  compareCount: number;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  cartCount,
  compareCount,
  isLoggedIn,
  onOpenAuth,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2d3449] bg-[#0b1326]/95 backdrop-blur-md">
      {/* Top Status Bar */}
      <div className="hidden border-b border-[#222a3d] bg-[#060e20] px-4 py-1 text-xs text-[#d8c3ad] sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono-num text-[11px] text-emerald-400">IEC 60947 / 61439 COMPLIANT</span>
          </div>
          <span className="text-[#534434]">|</span>
          <span className="text-[#a08e7a]">سامانه استعلام و مهندسی تجهیزات تابلو برق صنعتی</span>
        </div>
        <div className="flex items-center gap-4 font-mono-num text-[11px]">
          <span className="text-[#a08e7a]">ERP STATUS: <span className="text-[#ffc174]">SYNCED</span></span>
          <span className="text-[#534434]">|</span>
          <span className="text-[#a08e7a]">SERVER: <span className="text-sky-400">IR-TEH-DC01</span></span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('catalog')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#ffc174] to-[#f59e0b] text-[#472a00] shadow-md shadow-[#f59e0b]/20">
            <span className="material-symbols-outlined text-2xl font-bold">bolt</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">الکترو کاتالوگ</span>
              <span className="rounded bg-[#ffc174]/15 px-1.5 py-0.5 font-mono-num text-[10px] font-semibold text-[#ffc174] border border-[#ffc174]/30">
                PRO v4.2
              </span>
            </div>
            <p className="text-[11px] text-[#a08e7a]">مهندسی تابلو برق، مدارات قدرت و فرمان</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#131b2e] p-1 rounded-xl border border-[#2d3449]">
          <button
            onClick={() => onNavigate('catalog')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentScreen === 'catalog' || currentScreen === 'product-detail'
                ? 'bg-[#ffc174] text-[#472a00] font-bold shadow-sm'
                : 'text-[#d8c3ad] hover:text-white hover:bg-[#171f33]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            <span>کاتالوگ تجهیزات</span>
          </button>

          <button
            onClick={() => onNavigate('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentScreen === 'compare'
                ? 'bg-[#ffc174] text-[#472a00] font-bold shadow-sm'
                : 'text-[#d8c3ad] hover:text-white hover:bg-[#171f33]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">compare</span>
            <span>مقایسه فنی</span>
            {compareCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f59e0b] px-1 font-mono-num text-[10px] font-bold text-[#472a00]">
                {compareCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('sld-viewer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentScreen === 'sld-viewer' || currentScreen === 'sld-markup'
                ? 'bg-[#ffc174] text-[#472a00] font-bold shadow-sm'
                : 'text-[#d8c3ad] hover:text-white hover:bg-[#171f33]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">schema</span>
            <span>نقشه تک‌خطی SLD</span>
          </button>

          <button
            onClick={() => onNavigate('documents')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentScreen === 'documents'
                ? 'bg-[#ffc174] text-[#472a00] font-bold shadow-sm'
                : 'text-[#d8c3ad] hover:text-white hover:bg-[#171f33]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">folder_open</span>
            <span>اسناد و CAD</span>
          </button>

          <button
            onClick={() => onNavigate('admin-orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentScreen === 'admin-orders'
                ? 'bg-[#ffc174] text-[#472a00] font-bold shadow-sm'
                : 'text-[#d8c3ad] hover:text-white hover:bg-[#171f33]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">orders</span>
            <span>کارتابل سفارشات</span>
            <span className="h-2 w-2 rounded-full bg-amber-400"></span>
          </button>

          <button
            onClick={() => onNavigate('admin-catalog')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentScreen === 'admin-catalog'
                ? 'bg-[#ffc174] text-[#472a00] font-bold shadow-sm'
                : 'text-[#d8c3ad] hover:text-white hover:bg-[#171f33]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">settings_suggest</span>
            <span>مدیریت EAV</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Compare Quick Toggle */}
          {compareCount > 0 && (
            <button
              onClick={() => onNavigate('compare')}
              className="flex items-center gap-1.5 rounded-lg border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-2.5 py-1.5 text-xs text-[#ffc174] hover:bg-[#f59e0b]/20 transition-colors"
              title="مشاهده ماتریس مقایسه"
            >
              <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
              <span className="hidden sm:inline">مقایسه:</span>
              <span className="font-mono-num font-bold">{compareCount}</span>
            </button>
          )}

          {/* Cart / BOM Estimator Button */}
          <button
            onClick={() => onNavigate('cart')}
            className={`relative flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              currentScreen === 'cart' || currentScreen === 'order-preview' || currentScreen === 'order-success'
                ? 'border-[#ffc174] bg-[#ffc174]/20 text-[#ffc174]'
                : 'border-[#2d3449] bg-[#171f33] text-[#dae2fd] hover:border-[#ffc174]/60'
            }`}
            title="سبد استعلام تجهیزات تابلو"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            <span className="hidden sm:inline">سبد BOM</span>
            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f59e0b] px-1.5 font-mono-num text-[11px] font-bold text-[#472a00] shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Engineer Profile / Auth */}
          {isLoggedIn ? (
            <button
              onClick={() => onNavigate('account')}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                currentScreen === 'account'
                  ? 'border-[#ffc174] bg-[#ffc174]/20 text-[#ffc174]'
                  : 'border-[#2d3449] bg-[#171f33] text-[#dae2fd] hover:border-[#534434]'
              }`}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <span className="material-symbols-outlined text-sm">engineering</span>
              </div>
              <span className="hidden sm:inline text-xs">م. رضوانی</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 rounded-lg bg-[#ffc174] px-3 py-1.5 text-xs font-bold text-[#472a00] hover:bg-[#ffb95f] transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>ورود مهندسی</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex lg:hidden overflow-x-auto border-t border-[#222a3d] bg-[#131b2e] px-2 py-1.5 gap-1 no-scrollbar">
        <button
          onClick={() => onNavigate('catalog')}
          className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap ${currentScreen === 'catalog' ? 'bg-[#ffc174] text-[#472a00] font-bold' : 'text-[#d8c3ad]'}`}
        >
          کاتالوگ
        </button>
        <button
          onClick={() => onNavigate('compare')}
          className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap ${currentScreen === 'compare' ? 'bg-[#ffc174] text-[#472a00] font-bold' : 'text-[#d8c3ad]'}`}
        >
          مقایسه ({compareCount})
        </button>
        <button
          onClick={() => onNavigate('sld-viewer')}
          className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap ${currentScreen === 'sld-viewer' || currentScreen === 'sld-markup' ? 'bg-[#ffc174] text-[#472a00] font-bold' : 'text-[#d8c3ad]'}`}
        >
          نقشه SLD
        </button>
        <button
          onClick={() => onNavigate('documents')}
          className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap ${currentScreen === 'documents' ? 'bg-[#ffc174] text-[#472a00] font-bold' : 'text-[#d8c3ad]'}`}
        >
          اسناد CAD
        </button>
        <button
          onClick={() => onNavigate('admin-orders')}
          className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap ${currentScreen === 'admin-orders' ? 'bg-[#ffc174] text-[#472a00] font-bold' : 'text-[#d8c3ad]'}`}
        >
          کارتابل سفارشات
        </button>
        <button
          onClick={() => onNavigate('admin-catalog')}
          className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap ${currentScreen === 'admin-catalog' ? 'bg-[#ffc174] text-[#472a00] font-bold' : 'text-[#d8c3ad]'}`}
        >
          مدیریت تجهیزات
        </button>
      </div>
    </header>
  );
};
