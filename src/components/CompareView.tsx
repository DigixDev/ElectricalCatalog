import React, { useState } from 'react';
import { EquipmentProduct } from '../types';

interface CompareViewProps {
  compareList: EquipmentProduct[];
  allProducts: EquipmentProduct[];
  onRemoveFromCompare: (productId: string) => void;
  onAddToCart: (product: EquipmentProduct) => void;
  onAddProductToCompare: (product: EquipmentProduct) => void;
  onClearCompare: () => void;
  onSelectProduct: (product: EquipmentProduct) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  compareList,
  allProducts,
  onRemoveFromCompare,
  onAddToCart,
  onAddProductToCompare,
  onClearCompare,
  onSelectProduct,
}) => {
  const [diffOnly, setDiffOnly] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // If no products in compare list, use default products
  const displayProducts =
    compareList.length > 0
      ? compareList
      : [allProducts[0], allProducts[6] || allProducts[1]];

  // Standard comparison metrics definition
  const specs = [
    { key: 'ratingAmps', label: 'جریان نامی (In)', unit: 'A', format: (p: EquipmentProduct) => `${p.ratingAmps} آمپر` },
    {
      key: 'breakingCapacityKa',
      label: 'قدرت قطع نامی (Icn/Icu)',
      unit: 'kA',
      format: (p: EquipmentProduct) => `${p.breakingCapacityKa} kA`,
      isCritical: true,
    },
    { key: 'voltage', label: 'ولتاژ نامی کاری (Ue)', format: (p: EquipmentProduct) => p.voltage },
    { key: 'poles', label: 'تعداد پل‌های حفاظتی', format: (p: EquipmentProduct) => p.poles },
    { key: 'tripCurve', label: 'تیپ و منحنی قطع', format: (p: EquipmentProduct) => p.tripCurve || 'منحنی استاندارد C' },
    { key: 'weightKg', label: 'وزن فیزیکی خالص', format: (p: EquipmentProduct) => `${p.weightKg} کیلوگرم` },
    { key: 'dinMount', label: 'استاندارد نصب تابلویی', format: (p: EquipmentProduct) => p.dinMount || 'DIN Rail 35mm' },
    { key: 'complianceStd', label: 'استاندارد مرجع', format: (p: EquipmentProduct) => p.complianceStd },
    { key: 'brandOrigin', label: 'کشور سازنده / اصالت', format: (p: EquipmentProduct) => p.brandOrigin },
    { key: 'stockLocation', label: 'وضعیت انبار و تحویل', format: (p: EquipmentProduct) => p.stockLocation },
  ];

  // Filter if diffOnly
  const displayedSpecs = diffOnly
    ? specs.filter((s) => {
        if (displayProducts.length <= 1) return true;
        const firstVal = s.format(displayProducts[0]);
        return displayProducts.some((p) => s.format(p) !== firstVal);
      })
    : specs;

  return (
    <div className="min-h-screen bg-[#0b1326] pb-24 text-[#dae2fd]">
      {/* Header */}
      <section className="border-b border-[#2d3449] bg-gradient-to-b from-[#131b2e] to-[#0b1326] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded bg-[#ffc174]/15 px-2 py-0.5 font-mono-num text-xs font-bold text-[#ffc174] border border-[#ffc174]/30">
                  PARAMETRIC MATRIX
                </span>
                <span className="text-xs text-[#a08e7a]">تحلیل تفاوت‌های پارامتریک و استانداردهای تابلویی</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                ماتریس مقایسه فنی تجهیزات
              </h1>
              <p className="mt-1 text-sm text-[#d8c3ad]">
                بررسی موازی پارامترهای قدرت قطع، جریان نامی، تاییدیه‌ها و شرایط محیطی برای انتخاب بهینه در تابلوسازی
              </p>
            </div>

            {/* Filter Toggle Controls */}
            <div className="flex items-center gap-3">
              <div className="flex rounded-xl bg-[#171f33] p-1 border border-[#2d3449]">
                <button
                  onClick={() => setDiffOnly(false)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    !diffOnly ? 'bg-[#ffc174] text-[#472a00]' : 'text-[#a08e7a] hover:text-white'
                  }`}
                >
                  همه پارامترها ({specs.length})
                </button>
                <button
                  onClick={() => setDiffOnly(true)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    diffOnly ? 'bg-[#ffc174] text-[#472a00]' : 'text-[#a08e7a] hover:text-white'
                  }`}
                >
                  فقط تفاوت‌ها
                </button>
              </div>

              {compareList.length > 0 && (
                <button
                  onClick={onClearCompare}
                  className="rounded-xl border border-[#2d3449] bg-[#171f33] px-3 py-2 text-xs text-[#a08e7a] hover:text-rose-400 hover:border-rose-500/30"
                >
                  پاک کردن همه
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Comparison Body */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
        {/* AI Engineering Recommendation Box (from HTML 5) */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#171f33] via-[#1a233a] to-[#171f33] p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffc174] to-[#f59e0b] text-[#472a00] shadow-md shadow-[#f59e0b]/20">
              <span className="material-symbols-outlined text-2xl font-bold">psychology</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">تحلیل و پیشنهاد مهندسی هوش مصنوعی (RAG AI Recommendation)</span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono-num text-[10px] text-emerald-400 border border-emerald-500/30">
                  OPTIMIZED CHOICE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#d8c3ad] leading-relaxed">
                در مقایسه بین تجهیزات انتخاب شده، کلید زیمنس سری <span className="text-[#ffc174] font-semibold">5SY4332-7</span> دارای قدرت قطع <span className="text-emerald-400 font-bold">10kA</span> است که در مقایسه با استاندارد معمول 6kA، تا ۶۶٪ مقاومت بالاتری در برابر جریان‌های خطای اتصال کوتاه نشان می‌دهد. اگر تابلو برق به عنوان تابلوی توزیع اصلی (MDP) در نزدیکی ترانسفورماتور قرار دارد، زیمنس 10kA انتخاب فنی برتر است. اما برای تابلوهای فرعی روشنایی و مصرف عمومی کارگاهی، سری Acti9 اشنایدر به دلیل ارزش قیمتی بهینه‌تر پیشنهاد می‌شود.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#2d3449] bg-[#171f33] shadow-xl">
          <table className="w-full text-right text-xs">
            {/* Table Head: Product Cards */}
            <thead>
              <tr className="border-b border-[#2d3449] bg-[#131b2e]">
                <th className="w-48 p-4 font-bold text-[#a08e7a] align-bottom">
                  <span>پارامتر فنی</span>
                </th>
                {displayProducts.map((prod) => (
                  <th key={prod.id} className="min-w-[240px] p-4 align-top">
                    <div className="flex flex-col justify-between h-full space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-[#222a3d] px-2 py-0.5 text-[11px] font-bold text-[#ffc174] border border-[#2d3449]">
                          {prod.brand}
                        </span>
                        {displayProducts.length > 1 && (
                          <button
                            onClick={() => onRemoveFromCompare(prod.id)}
                            className="text-[#a08e7a] hover:text-rose-400"
                            title="حذف از مقایسه"
                          >
                            <span className="material-symbols-outlined text-base">close</span>
                          </button>
                        )}
                      </div>

                      {/* Image */}
                      <div
                        onClick={() => onSelectProduct(prod)}
                        className="flex h-32 w-full items-center justify-center rounded-xl bg-[#0b1326] p-2 cursor-pointer border border-[#222a3d] hover:border-[#ffc174]"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* Name & SKU */}
                      <div>
                        <div className="font-mono-num text-[11px] text-[#a08e7a]">{prod.sku}</div>
                        <h4
                          onClick={() => onSelectProduct(prod)}
                          className="font-bold text-white hover:text-[#ffc174] cursor-pointer line-clamp-2 mt-0.5"
                        >
                          {prod.name}
                        </h4>
                      </div>

                      {/* Price */}
                      <div className="font-mono-num font-bold text-sm text-white">
                        {prod.unitPrice > 0 ? (
                          <>
                            {prod.unitPrice.toLocaleString('fa-IR')}{' '}
                            <span className="text-[10px] text-[#a08e7a]">تومان</span>
                          </>
                        ) : (
                          <span className="text-amber-400 text-xs">استعلام بازار</span>
                        )}
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => onAddToCart(prod)}
                        className="flex items-center justify-center gap-1 w-full rounded-xl bg-[#ffc174] py-2 font-bold text-[#472a00] hover:bg-[#ffb95f] transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                        <span>افزودن به BOM</span>
                      </button>
                    </div>
                  </th>
                ))}

                {/* Slot to add another product if < 3 */}
                {displayProducts.length < 3 && (
                  <th className="min-w-[220px] p-4 align-middle">
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#2d3449] bg-[#0b1326]/50 p-6 text-center">
                      <span className="material-symbols-outlined text-3xl text-[#a08e7a]">add_circle</span>
                      <span className="mt-2 font-bold text-white text-xs">افزودن تجهیز سوم</span>
                      <p className="mt-1 text-[11px] text-[#a08e7a]">جهت مقایسه همزمان سه محصول</p>
                      <button
                        onClick={() => setIsAddingProduct(!isAddingProduct)}
                        className="mt-3 rounded-lg bg-[#222a3d] px-3 py-1.5 text-xs text-[#ffc174] border border-[#2d3449] hover:bg-[#2d3449]"
                      >
                        انتخاب از کاتالوگ
                      </button>
                    </div>
                  </th>
                )}
              </tr>
            </thead>

            {/* Table Rows: Technical Parameters */}
            <tbody className="divide-y divide-[#222a3d]">
              {displayedSpecs.map((spec) => {
                const values = displayProducts.map((p) => spec.format(p));
                const isDifferent = values.length > 1 && values.some((v) => v !== values[0]);

                return (
                  <tr
                    key={spec.key}
                    className={`transition-colors ${
                      isDifferent ? 'bg-[#ffc174]/5' : 'hover:bg-[#131b2e]/50'
                    }`}
                  >
                    <td className="p-4 font-semibold text-[#d8c3ad] bg-[#131b2e]/60">
                      <div className="flex items-center gap-1.5">
                        {isDifferent && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#ffc174]" title="تفاوت پارامتر"></span>
                        )}
                        <span>{spec.label}</span>
                      </div>
                    </td>

                    {displayProducts.map((prod) => {
                      const val = spec.format(prod);
                      return (
                        <td key={prod.id} className="p-4 font-mono-num font-medium text-white">
                          <div className="flex items-center justify-between">
                            <span>{val}</span>
                            {spec.key === 'breakingCapacityKa' && prod.breakingCapacityKa > 6 && (
                              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-400 border border-emerald-500/30">
                                +۶۶٪ تقویت شده
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {displayProducts.length < 3 && <td></td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal/Dropdown to Add a Product to Compare */}
        {isAddingProduct && (
          <div className="rounded-2xl border border-[#ffc174]/50 bg-[#171f33] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-white">تجهیز مورد نظر را برای مقایسه انتخاب کنید:</h3>
              <button
                onClick={() => setIsAddingProduct(false)}
                className="text-xs text-[#a08e7a] hover:text-white"
              >
                بستن
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {allProducts
                .filter((p) => !displayProducts.some((dp) => dp.id === p.id))
                .slice(0, 6)
                .map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onAddProductToCompare(prod);
                      setIsAddingProduct(false);
                    }}
                    className="flex items-center gap-3 rounded-xl border border-[#2d3449] bg-[#131b2e] p-3 cursor-pointer hover:border-[#ffc174]"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 object-contain rounded bg-[#0b1326] p-1"
                    />
                    <div>
                      <div className="text-[10px] font-mono-num text-[#ffc174]">{prod.brand}</div>
                      <div className="text-xs font-bold text-white line-clamp-1">{prod.name}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
