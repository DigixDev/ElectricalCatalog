import React, { useState } from 'react';
import { EquipmentProduct } from '../types';

interface AdminCatalogViewProps {
  products: EquipmentProduct[];
  onAddProduct: (newProd: EquipmentProduct) => void;
  onToggleStock: (productId: string) => void;
  onSelectProduct: (product: EquipmentProduct) => void;
}

export const AdminCatalogView: React.FC<AdminCatalogViewProps> = ({
  products,
  onAddProduct,
  onToggleStock,
  onSelectProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New product form state
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Schneider Electric');
  const [model, setModel] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<'mcb' | 'mccb' | 'contactor' | 'relay'>('mcb');
  const [ratingAmps, setRatingAmps] = useState(32);
  const [breakingCapacityKa, setBreakingCapacityKa] = useState(6);
  const [poles, setPoles] = useState('3P');
  const [voltage, setVoltage] = useState('400V AC');
  const [unitPrice, setUnitPrice] = useState(450000);
  const [inStock, setInStock] = useState(true);
  const [image, setImage] = useState(products[0]?.image || '');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand;
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    return matchesSearch && matchesBrand && matchesCat;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) return;

    const newProd: EquipmentProduct = {
      id: `prod-${Date.now()}`,
      name,
      brand,
      brandOrigin: brand === 'Schneider Electric' ? 'فرانسه' : brand === 'Siemens' ? 'آلمان' : 'کره جنوبی',
      model: model || sku,
      sku,
      category,
      categoryLabel:
        category === 'mcb'
          ? 'کلید مینیاتوری'
          : category === 'mccb'
          ? 'کلید اتوماتیک'
          : category === 'contactor'
          ? 'کنتاکتور صنعتی'
          : 'بی‌متال و رله',
      image: image || products[0]?.image,
      ratingAmps: Number(ratingAmps),
      voltage,
      breakingCapacityKa: Number(breakingCapacityKa),
      poles,
      unitPrice: Number(unitPrice),
      priceNote: 'قیمت پایه انبار',
      inStock,
      stockLocation: inStock ? 'موجود در انبار تهران' : 'استعلام بازرگانی',
      weightKg: 0.45,
      complianceStd: 'IEC 60947-2',
      description: `تجهیز تابلویی استاندارد ${name} با کد انبارداری ${sku}.`,
      eavSpecs: [
        { key: 'current', label: 'جریان نامی', value: `${ratingAmps} A`, isHighlight: true },
        { key: 'breaking', label: 'قدرت قطع', value: `${breakingCapacityKa} kA`, isHighlight: true },
        { key: 'voltage', label: 'ولتاژ نامی', value: voltage },
        { key: 'poles', label: 'تعداد پل', value: poles },
      ],
    };

    onAddProduct(newProd);
    setIsModalOpen(false);
    setName('');
    setSku('');
    setModel('');
  };

  return (
    <div className="min-h-screen bg-[#0b1326] pb-24 text-[#dae2fd]">
      {/* Header */}
      <section className="border-b border-[#2d3449] bg-gradient-to-b from-[#131b2e] to-[#0b1326] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded bg-[#ffc174]/15 px-2 py-0.5 font-mono-num text-xs font-bold text-[#ffc174] border border-[#ffc174]/30">
                  EAV INVENTORY ENGINE
                </span>
                <span className="text-xs text-[#a08e7a]">مدیریت پایگاه داده و مشخصات فنی پارامتریک</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                مدیریت کاتالوگ تجهیزات برق و موجودی انبار
              </h1>
              <p className="mt-1 text-sm text-[#d8c3ad]">
                ثبت پارت‌نامبر جدید، تطبیق مشخصات EAV با استاندارد IEC و کنترل دسترسی فنی
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ffc174] to-[#f59e0b] px-4 py-2.5 text-xs font-bold text-[#472a00] hover:from-[#ffb95f] hover:to-[#d97706] transition-all shadow-lg"
            >
              <span className="material-symbols-outlined text-base font-bold">add_circle</span>
              <span>تعریف تجهیز جدید</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#2d3449] bg-[#171f33] p-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute right-3 top-2 text-[#a08e7a] text-base">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو نام کالا، پارت‌نامبر..."
                className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] py-1.5 pr-8 pl-3 text-xs text-white placeholder-[#a08e7a] focus:border-[#ffc174] focus:outline-none"
              />
            </div>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="rounded-xl border border-[#2d3449] bg-[#0b1326] px-3 py-1.5 text-xs text-[#dae2fd] focus:border-[#ffc174] focus:outline-none"
            >
              <option value="all">همه برندها</option>
              <option value="Schneider Electric">Schneider Electric</option>
              <option value="Siemens">Siemens</option>
              <option value="Hyundai Electric">Hyundai Electric</option>
              <option value="LS Electric">LS Electric</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="rounded-xl border border-[#2d3449] bg-[#0b1326] px-3 py-1.5 text-xs text-[#dae2fd] focus:border-[#ffc174] focus:outline-none"
            >
              <option value="all">همه دسته‌ها</option>
              <option value="mcb">کلید مینیاتوری MCB</option>
              <option value="mccb">کلید اتوماتیک MCCB</option>
              <option value="contactor">کنتاکتور صنعتی</option>
              <option value="relay">بی‌متال و رله</option>
            </select>
          </div>

          <div className="font-mono-num text-[11px] text-[#a08e7a]">
            مجموع تجهیزات فعال: <strong className="text-[#ffc174]">{filteredProducts.length}</strong> کالا
          </div>
        </div>

        {/* Dense Industrial Equipment Table (from HTML 3.2) */}
        <div className="overflow-x-auto rounded-2xl border border-[#2d3449] bg-[#171f33] shadow-xl">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-[#2d3449] bg-[#131b2e] text-[#a08e7a]">
              <tr>
                <th className="p-3.5 font-bold">تجهیز و برند</th>
                <th className="p-3.5 font-bold">پارت‌نامبر (SKU)</th>
                <th className="p-3.5 font-bold">پارامترهای فنی EAV</th>
                <th className="p-3.5 font-bold text-left">قیمت پایه</th>
                <th className="p-3.5 font-bold text-center">وضعیت موجودی</th>
                <th className="p-3.5 font-bold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222a3d]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#131b2e]/50 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 object-contain rounded bg-[#0b1326] p-1 border border-[#222a3d]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-mono-num text-[10px] text-[#ffc174]">
                          <span>{p.brand}</span>
                          <span className="text-[#534434]">•</span>
                          <span className="text-[#a08e7a]">{p.categoryLabel}</span>
                        </div>
                        <div
                          onClick={() => onSelectProduct(p)}
                          className="font-bold text-white hover:text-[#ffc174] cursor-pointer text-xs line-clamp-1"
                        >
                          {p.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-mono-num text-[#d8c3ad] font-semibold">{p.sku}</td>

                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded bg-[#131b2e] px-2 py-0.5 font-mono-num text-[11px] text-[#ffc174] border border-[#222a3d]">
                        {p.ratingAmps} A
                      </span>
                      <span className="rounded bg-[#131b2e] px-2 py-0.5 font-mono-num text-[11px] text-sky-400 border border-[#222a3d]">
                        {p.breakingCapacityKa} kA
                      </span>
                      <span className="rounded bg-[#131b2e] px-2 py-0.5 font-mono-num text-[11px] text-[#d8c3ad] border border-[#222a3d]">
                        {p.poles}
                      </span>
                    </div>
                  </td>

                  <td className="p-3.5 text-left font-mono-num font-bold text-white">
                    {p.unitPrice > 0 ? `${p.unitPrice.toLocaleString('fa-IR')} ت` : 'استعلام روز'}
                  </td>

                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => onToggleStock(p.id)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold border transition-colors ${
                        p.inStock
                          ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-400'
                          : 'border-amber-500/30 bg-amber-950/30 text-amber-400'
                      }`}
                    >
                      {p.inStock ? 'موجود در انبار' : 'ناموجود / استعلام'}
                    </button>
                  </td>

                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onSelectProduct(p)}
                        className="p-1 text-[#a08e7a] hover:text-[#ffc174]"
                        title="مشاهده مشخصات فنی"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(p.sku)}
                        className="p-1 text-[#a08e7a] hover:text-white"
                        title="کپی پارت‌نامبر"
                      >
                        <span className="material-symbols-outlined text-base">content_copy</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal: Define New Equipment */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl rounded-2xl border border-[#ffc174]/40 bg-[#171f33] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#222a3d] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffc174]">add_box</span>
                  <h3 className="font-bold text-sm text-white">ثبت و تعریف تجهیز صنعتی جدید</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-[#a08e7a] hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#a08e7a] mb-1">نام کامل تجهیز و مشخصات:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثلاً کلید مینیاتوری ۶۳ آمپر اشنایدر ۳ پل"
                    className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-2.5 text-white focus:border-[#ffc174] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#a08e7a] mb-1">برند سازنده:</label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-2 text-white focus:border-[#ffc174] focus:outline-none"
                    >
                      <option value="Schneider Electric">Schneider Electric</option>
                      <option value="Siemens">Siemens</option>
                      <option value="Hyundai Electric">Hyundai Electric</option>
                      <option value="LS Electric">LS Electric</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#a08e7a] mb-1">پارت‌نامبر / SKU:</label>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="مثلاً A9F74363"
                      className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-2 text-white font-mono-num focus:border-[#ffc174] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a08e7a] mb-1">دسته‌بندی تجهیز:</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-2 text-white focus:border-[#ffc174] focus:outline-none"
                    >
                      <option value="mcb">کلید مینیاتوری MCB</option>
                      <option value="mccb">کلید اتوماتیک MCCB</option>
                      <option value="contactor">کنتاکتور قدرت</option>
                      <option value="relay">بی‌متال و رله</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#a08e7a] mb-1">جریان نامی (In آمپر):</label>
                    <input
                      type="number"
                      value={ratingAmps}
                      onChange={(e) => setRatingAmps(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-2 text-white font-mono-num focus:border-[#ffc174] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a08e7a] mb-1">قدرت قطع (kA):</label>
                    <input
                      type="number"
                      value={breakingCapacityKa}
                      onChange={(e) => setBreakingCapacityKa(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-2 text-white font-mono-num focus:border-[#ffc174] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a08e7a] mb-1">قیمت واحد (تومان):</label>
                    <input
                      type="number"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#2d3449] bg-[#0b1326] p-2 text-white font-mono-num focus:border-[#ffc174] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#222a3d] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-[#2d3449] bg-[#131b2e] px-4 py-2 text-xs text-[#a08e7a] hover:text-white"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#ffc174] px-5 py-2 text-xs font-bold text-[#472a00] hover:bg-[#ffb95f]"
                  >
                    ثبت در کاتالوگ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
