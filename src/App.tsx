import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { TrustSection } from './components/TrustSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';

import { Order, OrderStatus, Product } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/initialData';
import { 
  getSavedOrders, 
  getSavedProducts, 
  getSavedSiteSettings, 
  saveOrders, 
  saveProducts, 
  saveSiteSettings 
} from './utils/helpers';
import { Order, OrderStatus, Product, SiteSettings } from './types';

export default function App() {
  // Load persisted state or initial data
  const [products, setProducts] = useState<Product[]>(() => getSavedProducts(INITIAL_PRODUCTS));
  const [orders, setOrders] = useState<Order[]>(() => getSavedOrders(INITIAL_ORDERS));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => getSavedSiteSettings());

  // Modals & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProductId, setCheckoutProductId] = useState<string | undefined>(undefined);
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | undefined>(undefined);

  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);

  // Hidden Admin Route & Authentication state
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    return path === '/admin' || path.endsWith('/admin') || hash === '#admin';
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('subx_admin_auth') === 'true';
  });

  // Listen to browser URL changes (/admin or #admin)
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const onAdmin = path === '/admin' || path.endsWith('/admin') || hash === '#admin';
      setIsAdminRoute(onAdmin);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    saveProducts(products);
  }, [products]);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    saveSiteSettings(siteSettings);
  }, [siteSettings]);

  // Modal Triggers
  const handleOpenCheckout = (productId?: string, planId?: string) => {
    setCheckoutProductId(productId || products[0].id);
    setCheckoutPlanId(planId);
    setIsCheckoutOpen(true);
  };

  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, deliveryNotes?: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status,
              deliveryNotes: deliveryNotes !== undefined ? deliveryNotes : ord.deliveryNotes
            }
          : ord
      )
    );
  };

  const handleUpdateProductPrice = (productId: string, planId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          return {
            ...prod,
            plans: prod.plans.map((pl) =>
              pl.id === planId ? { ...pl, priceNpr: newPrice } : pl
            )
          };
        }
        return prod;
      })
    );
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleBuyNowFromHero = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleOpenCheckout();
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminRoute(false);
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    } else if (window.location.pathname.endsWith('/admin')) {
      window.history.pushState({}, '', '/');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white font-sans antialiased selection:bg-emerald-500 selection:text-slate-950 pb-16 sm:pb-0">
      
      {/* Top Header */}
      <Header
        onOpenCheckout={handleOpenCheckout}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        siteSettings={siteSettings}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <Hero
          onBuyNowClick={handleBuyNowFromHero}
          onOpenCheckoutWithProduct={(prodId) => handleOpenCheckout(prodId)}
        />

        {/* Product Subscription Store Section */}
        <ProductCatalog
          products={products}
          onOpenCheckout={handleOpenCheckout}
          searchQuery={searchQuery}
        />

        {/* Customer Trust, Guarantee & How It Works */}
        <TrustSection />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
      />

      {/* Floating WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Mobile Sticky Navigation */}
      <MobileBottomNav
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
      />

      {/* Customer Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        products={products}
        initialProductId={checkoutProductId}
        initialPlanId={checkoutPlanId}
        onOrderCreated={handleOrderCreated}
      />

      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        orders={orders}
      />

      {/* Admin Route Handling at /admin or #admin */}
      {isAdminRoute && (
        isAdminAuthenticated ? (
          <AdminDashboard
            isOpen={true}
            onClose={handleCloseAdmin}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            products={products}
            onUpdateProductPrice={handleUpdateProductPrice}
            onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            siteSettings={siteSettings}
            onUpdateSiteSettings={setSiteSettings}
          />
        ) : (
          <AdminLoginModal
            isOpen={true}
            onClose={handleCloseAdmin}
            onSuccessLogin={() => setIsAdminAuthenticated(true)}
          />
        )
      )}

    </div>
  );
}
