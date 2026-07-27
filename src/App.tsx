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

import { Order, OrderStatus, Product } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/initialData';
import { 
  getSavedOrders, 
  getSavedProducts, 
  saveOrders, 
  saveProducts 
} from './utils/helpers';

export default function App() {
  // Load persisted state or initial data
  const [products, setProducts] = useState<Product[]>(() => getSavedProducts(INITIAL_PRODUCTS));
  const [orders, setOrders] = useState<Order[]>(() => getSavedOrders(INITIAL_ORDERS));

  // Modals & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProductId, setCheckoutProductId] = useState<string | undefined>(undefined);
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | undefined>(undefined);

  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    saveProducts(products);
  }, [products]);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

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

  const handleBuyNowFromHero = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleOpenCheckout();
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white font-sans antialiased selection:bg-emerald-500 selection:text-slate-950 pb-16 sm:pb-0">
      
      {/* Top Header */}
      <Header
        onOpenCheckout={handleOpenCheckout}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
        isAdminOpen={isAdminOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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
        onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
      />

      {/* Floating WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Mobile Sticky Navigation */}
      <MobileBottomNav
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
        isAdminOpen={isAdminOpen}
      />

      {/* Modals */}
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

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        products={products}
        onUpdateProductPrice={handleUpdateProductPrice}
      />

    </div>
  );
}
