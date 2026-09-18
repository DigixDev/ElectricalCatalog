import React, { useState } from 'react';
import {
  ScreenType,
  CartItem,
  EquipmentProduct,
  IndustrialOrder,
  DrawingMarkup,
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  TECHNICAL_DOCUMENTS,
  INITIAL_MARKUPS,
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { CatalogView } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { CompareView } from './components/CompareView';
import { CartView } from './components/CartView';
import { OrderPreviewView } from './components/OrderPreviewView';
import { OrderSuccessView } from './components/OrderSuccessView';
import { AdminOrdersView } from './components/AdminOrdersView';
import { AdminCatalogView } from './components/AdminCatalogView';
import { SldViewerView } from './components/SldViewerView';
import { DocumentsView } from './components/DocumentsView';
import { AccountView } from './components/AccountView';
import { AuthModal } from './components/AuthModal';
import { VerificationData } from './components/OrderHighValue2FAModal';

export default function App() {
  // Main Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('catalog');

  // Products state (can be extended by Admin catalog)
  const [products, setProducts] = useState<EquipmentProduct[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<EquipmentProduct>(INITIAL_PRODUCTS[0]);

  // Initial cart with items to make the app interactive right away
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 2 },
    { product: INITIAL_PRODUCTS[1], quantity: 3 },
    { product: INITIAL_PRODUCTS[2], quantity: 4 },
  ]);

  // Comparison list (EquipmentProduct objects)
  const [compareList, setCompareList] = useState<EquipmentProduct[]>([
    INITIAL_PRODUCTS[0],
    INITIAL_PRODUCTS[1],
  ]);

  // Orders State
  const [orders, setOrders] = useState<IndustrialOrder[]>(INITIAL_ORDERS);
  const [activeOrder, setActiveOrder] = useState<IndustrialOrder>(INITIAL_ORDERS[0]);

  // CAD Markups State
  const [markups, setMarkups] = useState<DrawingMarkup[]>(INITIAL_MARKUPS);

  // Authentication State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState({
    name: 'مهندس علیرضا رضوانی',
    engCode: 'ENG-88421',
    isLoggedIn: true,
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Cart operations
  const handleAddToCart = (product: EquipmentProduct, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast(`«${product.name}» به سبد استعلام افزوده شد.`);
  };

  const handleUpdateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('آیتم از سبد استعلام حذف شد.');
  };

  // Compare operations
  const handleToggleCompare = (product: EquipmentProduct) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast('از جدول مقایسه حذف شد.');
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        showToast('حداکثر ۴ تجهیز می‌توانید همزمان مقایسه کنید.');
        return prev;
      }
      showToast('به جدول مقایسه پارامتریک افزوده شد.');
      return [...prev, product];
    });
  };

  const handleRemoveFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleClearCompare = () => {
    setCompareList([]);
    showToast('لیست مقایسه پاک شد.');
  };

  // Order Submission Workflow
  const handleProceedToPreview = () => {
    if (cartItems.length === 0) {
      showToast('سبد استعلام خالی است!');
      return;
    }
    setCurrentScreen('order-preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmOrder = (notes: string, verificationData?: VerificationData) => {
    const fixedTotal = cartItems.reduce(
      (acc, it) => acc + (it.product.unitPrice > 0 ? it.product.unitPrice * it.quantity : 0),
      0
    );
    const rfqPending = cartItems.filter((it) => it.product.unitPrice === 0).length;

    const newOrder: IndustrialOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-20260918-000${orders.length + 124}`,
      date: '1403/08/25',
      time: '12:30',
      clientName: user.name,
      company: 'تابلوسازی پیشرو الکتریک',
      phone: '09123456789',
      engCode: user.engCode,
      address:
        'تهران، شهرک صنعتی شمس‌آباد، بلوار بوستان، خیابان گلبن دهم، پلاک ۲۸، کارگاه فنی تابلوسازی توان صنعت پایتخت',
      status: 'pending',
      statusLabel: 'در انتظار بررسی فنی',
      currentStep: 1,
      tagGroup: 'LV-PANEL-BOM',
      subtotal: fixedTotal,
      fixedSubtotal: fixedTotal,
      pendingRfqCount: rfqPending,
      engineerNote: notes,
      dispatchSlaNote: 'تطابق با دیاگرام تک‌خطی و تخصیص قفسه انبار ظرف ۲ ساعت کاری',
      twoFactorVerified: !!verificationData,
      twoFactorApprover: verificationData?.approver,
      twoFactorMethod: verificationData?.method,
      twoFactorTimestamp: verificationData?.timestamp,
      twoFactorToken: verificationData?.token,
      items: cartItems.map((c) => ({
        product: c.product,
        quantity: c.quantity,
        unitPrice: c.product.unitPrice,
        priceType: c.product.unitPrice > 0 ? 'fixed' : 'rfq',
        statusLabel: c.product.inStock ? 'تخصیص انبار شمس‌آباد' : 'استعلام بازرگانی',
        statusColor: c.product.inStock ? 'emerald' : 'amber',
      })),
    };

    setOrders([newOrder, ...orders]);
    setActiveOrder(newOrder);
    setCartItems([]); // Cleared after conversion to official order
    setCurrentScreen('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (verificationData) {
      showToast('سفارش با موفقیت و پس از تایید دو مرحله‌ای (2FA) مدیریت فنی ثبت شد.');
    } else {
      showToast('سفارش شما با موفقیت ثبت شد.');
    }
  };

  // Admin Order Actions
  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: IndustrialOrder['status'],
    newStep: number
  ) => {
    const statusLabels: Record<IndustrialOrder['status'], string> = {
      pending: 'در انتظار بررسی فنی',
      confirmed: 'تایید فنی و مالی',
      preparing: 'تجهیز و بسته‌بندی پالت',
      ready: 'آماده تحویل و بارگیری',
      completed: 'تحویل قطعی در کارگاه',
      cancelled: 'لغو شده',
    };

    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: newStatus,
              statusLabel: statusLabels[newStatus],
              currentStep: newStep,
            }
          : ord
      )
    );
    setActiveOrder((curr) =>
      curr && curr.id === orderId
        ? {
            ...curr,
            status: newStatus,
            statusLabel: statusLabels[newStatus],
            currentStep: newStep,
          }
        : curr
    );
    showToast(`وضعیت سفارش به «${statusLabels[newStatus]}» ارتقا یافت.`);
  };

  // Replacement of out-of-stock / low-stock equipment from live central warehouse widget
  const handleReplaceOrderItem = (
    originalProductId: string,
    replacementProduct: EquipmentProduct
  ) => {
    const updateOrderItems = (order: IndustrialOrder): IndustrialOrder => {
      const updatedItems = order.items.map((item) => {
        if (item.product.id === originalProductId) {
          return {
            ...item,
            product: replacementProduct,
            unitPrice: replacementProduct.unitPrice,
            statusLabel: replacementProduct.inStock
              ? 'موجود در انبار مرکزی تهران'
              : 'استعلام بازار',
          };
        }
        return item;
      });

      const newSubtotal = updatedItems.reduce(
        (sum, item) => sum + (item.unitPrice > 0 ? item.unitPrice * item.quantity : 0),
        0
      );

      return {
        ...order,
        items: updatedItems,
        subtotal: newSubtotal,
        fixedSubtotal: newSubtotal,
      };
    };

    if (activeOrder) {
      const updated = updateOrderItems(activeOrder);
      setActiveOrder(updated);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      showToast(
        `تجهیز جایگزین «${replacementProduct.name}» با موفقیت در پیش‌فاکتور سفارش ثبت شد.`
      );
    }
  };

  // Admin Catalog Actions
  const handleAddProduct = (newProd: EquipmentProduct) => {
    setProducts([newProd, ...products]);
    showToast(`تجهیز جدید «${newProd.name}» در کاتالوگ ثبت گردید.`);
  };

  const handleToggleProductStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              inStock: !p.inStock,
              stockLocation: !p.inStock ? 'موجود در انبار تهران' : 'استعلام بازرگانی',
            }
          : p
      )
    );
    showToast('وضعیت موجودی انبار بروزرسانی شد.');
  };

  // Markup Actions
  const handleAddMarkup = (newMarkup: DrawingMarkup) => {
    setMarkups([newMarkup, ...markups]);
    showToast('تذکر فنی با موفقیت روی دیاگرام ثبت گردید.');
  };

  const handleResolveMarkup = (id: number) => {
    setMarkups((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'resolved' } : m))
    );
    showToast('اصلاحیه نقشه به عنوان رفع شده علامت‌گذاری شد.');
  };

  // Navigation handlers
  const handleViewProduct = (product: EquipmentProduct) => {
    setSelectedProduct(product);
    setCurrentScreen('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans antialiased selection:bg-[#ffc174] selection:text-[#472a00]">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-[#ffc174]/60 bg-[#171f33] px-5 py-3 text-xs font-bold text-white shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-[#ffc174] text-base">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Persistent Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={totalCartCount}
        compareCount={compareList.length}
        isLoggedIn={user.isLoggedIn}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Primary Screen Router */}
      <main className="w-full">
        {currentScreen === 'catalog' && (
          <CatalogView
            products={products}
            onSelectProduct={handleViewProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onGoToCompare={() => setCurrentScreen('compare')}
            onClearCompare={handleClearCompare}
          />
        )}

        {currentScreen === 'product-detail' && (
          <ProductDetailView
            product={selectedProduct}
            allProducts={products}
            onAddToCart={(p, qty) => handleAddToCart(p, qty)}
            onToggleCompare={handleToggleCompare}
            isCompared={compareList.some((p) => p.id === selectedProduct.id)}
            onSelectRelated={handleViewProduct}
            onBack={() => setCurrentScreen('catalog')}
          />
        )}

        {currentScreen === 'compare' && (
          <CompareView
            compareList={compareList}
            allProducts={products}
            onRemoveFromCompare={handleRemoveFromCompare}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onAddProductToCompare={handleToggleCompare}
            onClearCompare={handleClearCompare}
            onSelectProduct={handleViewProduct}
          />
        )}

        {currentScreen === 'cart' && (
          <CartView
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onProceedToOrderPreview={handleProceedToPreview}
            onContinueShopping={() => setCurrentScreen('catalog')}
            isLoggedIn={user.isLoggedIn}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentScreen === 'order-preview' && (
          <OrderPreviewView
            cartItems={cartItems}
            onConfirmOrder={handleConfirmOrder}
            onBackToCart={() => setCurrentScreen('cart')}
          />
        )}

        {currentScreen === 'order-success' && (
          <OrderSuccessView
            order={activeOrder}
            onViewAllOrders={() => setCurrentScreen('admin-orders')}
            onBackToCatalog={() => setCurrentScreen('catalog')}
            onReplaceOrderItem={handleReplaceOrderItem}
          />
        )}

        {currentScreen === 'admin-orders' && (
          <AdminOrdersView
            orders={orders}
            onSelectOrder={(ord) => {
              setActiveOrder(ord);
              setCurrentScreen('order-success');
            }}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )}

        {currentScreen === 'admin-catalog' && (
          <AdminCatalogView
            products={products}
            onAddProduct={handleAddProduct}
            onToggleStock={handleToggleProductStock}
            onSelectProduct={handleViewProduct}
          />
        )}

        {(currentScreen === 'sld-viewer' || currentScreen === 'sld-markup') && (
          <SldViewerView
            markups={markups}
            onAddMarkup={handleAddMarkup}
            onResolveMarkup={handleResolveMarkup}
          />
        )}

        {currentScreen === 'documents' && (
          <DocumentsView documents={TECHNICAL_DOCUMENTS} />
        )}

        {currentScreen === 'account' && (
          <AccountView
            onLogout={() => {
              setUser({ name: '', engCode: '', isLoggedIn: false });
              showToast('با موفقیت از سامانه خارج شدید.');
            }}
            onNavigateToCart={() => setCurrentScreen('cart')}
            onNavigateToOrders={() => setCurrentScreen('admin-orders')}
            cartCount={totalCartCount}
          />
        )}

        {currentScreen === 'auth' && (
          <div className="py-12">
            <AuthModal
              isOpen={true}
              onClose={() => setCurrentScreen('catalog')}
              onSuccessLogin={(name) => {
                setUser({ name, engCode: 'ENG-88421', isLoggedIn: true });
                showToast(`خوش آمدید، ${name}`);
                setCurrentScreen('catalog');
              }}
              cartCount={totalCartCount}
            />
          </div>
        )}
      </main>

      {/* Auth / Login Modal when triggered from header */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccessLogin={(name) => {
          setUser({ name, engCode: 'ENG-88421', isLoggedIn: true });
          showToast(`خوش آمدید، ${name}`);
        }}
        cartCount={totalCartCount}
      />
    </div>
  );
}
