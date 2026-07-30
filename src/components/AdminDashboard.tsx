import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageCircle, 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  ShoppingBag, 
  Edit3, 
  Save, 
  Plus, 
  Send,
  Calendar,
  Lock,
  RefreshCw,
  Trash2,
  LogOut,
  Image as ImageIcon,
  Sparkles,
  Bot,
  Youtube,
  Video,
  Tv,
  Palette,
  Music,
  Cpu,
  Tag
} from 'lucide-react';
import { Category, Order, OrderStatus, Product } from '../types';
import { formatNpr, generateCustomerWhatsAppUpdateUrl } from '../utils/helpers';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, deliveryNotes?: string) => void;
  products: Product[];
  onUpdateProductPrice: (productId: string, planId: string, newPrice: number) => void;
  onUpdateProduct?: (updatedProduct: Product) => void;
  onAddProduct?: (newProduct: Product) => void;
  onDeleteProduct?: (productId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  products,
  onUpdateProductPrice,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'customers'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Product Edit state
  const [editingPriceMap, setEditingPriceMap] = useState<Record<string, number>>({});
  const [editingProductModal, setEditingProductModal] = useState<Product | null>(null);

  // Helper render icon
  const renderLogoPreview = (logoIcon: string) => {
    if (
      logoIcon.startsWith('http://') || 
      logoIcon.startsWith('https://') || 
      logoIcon.startsWith('data:') || 
      logoIcon.startsWith('/')
    ) {
      return (
        <img 
          src={logoIcon} 
          alt="Logo" 
          className="w-6 h-6 object-contain rounded" 
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }} 
        />
      );
    }
    switch (logoIcon) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-300" />;
      case 'Youtube': return <Youtube className="w-5 h-5 text-red-400" />;
      case 'Video': return <Video className="w-5 h-5 text-cyan-300" />;
      case 'Tv': return <Tv className="w-5 h-5 text-red-500" />;
      case 'Bot': return <Bot className="w-5 h-5 text-emerald-400" />;
      case 'Palette': return <Palette className="w-5 h-5 text-purple-300" />;
      case 'Music': return <Music className="w-5 h-5 text-emerald-300" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-amber-400" />;
      default: return <Sparkles className="w-5 h-5 text-emerald-400" />;
    }
  };

  // Stats Calculations
  const totalRevenue = orders
    .filter((o) => o.status === 'Completed' || o.status === 'Payment Verified')
    .reduce((sum, o) => sum + o.amountNpr, 0);

  const pendingCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Payment Verified').length;
  const totalOrdersCount = orders.length;

  // Filter Orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerPhone.includes(q) ||
      order.productTitle.toLowerCase().includes(q) ||
      order.paymentRefId.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const handlePriceChange = (productId: string, planId: string, value: string) => {
    const price = parseInt(value, 10);
    if (!isNaN(price)) {
      setEditingPriceMap((prev) => ({
        ...prev,
        [`${productId}_${planId}`]: price
      }));
    }
  };

  const handleSavePrice = (productId: string, planId: string) => {
    const key = `${productId}_${planId}`;
    const newPrice = editingPriceMap[key];
    if (newPrice !== undefined) {
      onUpdateProductPrice(productId, planId, newPrice);
      alert('Product price updated successfully!');
    }
  };

  const handleSaveProductModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductModal) return;

    if (onUpdateProduct) {
      const exists = products.some(p => p.id === editingProductModal.id);
      if (exists) {
        onUpdateProduct(editingProductModal);
      } else if (onAddProduct) {
        onAddProduct(editingProductModal);
      }
    }
    setEditingProductModal(null);
    alert('Product details & logo updated successfully!');
  };

  const handleAddNewProductClick = () => {
    const newId = `prod-${Date.now()}`;
    const newProd: Product = {
      id: newId,
      title: 'New Subscription',
      brand: 'SubX',
      category: 'AI Tools',
      description: 'Authentic digital subscription with warranty.',
      iconBg: 'from-emerald-500/20 to-teal-500/20',
      brandColor: 'text-emerald-400',
      logoIcon: 'Bot',
      plans: [
        { id: `${newId}-1m`, name: '1 Month', duration: '1 Month', priceNpr: 500, popular: true },
        { id: `${newId}-1y`, name: '1 Year', duration: '1 Year', priceNpr: 4500 }
      ],
      selectedPlanId: `${newId}-1m`,
      features: ['Private Account Activation', 'Nepal Warranty', 'Instant Delivery'],
      stockStatus: 'In Stock',
      deliveryTime: '5-15 Mins',
      rating: 5.0,
      reviewsCount: 12
    };
    setEditingProductModal(newProd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-2xl bg-[#0e1420] border border-emerald-500/30 text-white shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        
        {/* Admin Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">SubX Nepal Admin Control Center</h2>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                  LIVE PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400">Manage Orders, Product Pricing, Logos & Catalog</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                sessionStorage.removeItem('subx_admin_auth');
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout & Exit</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="p-4 bg-slate-950/80 border-b border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Revenue</span>
            <div className="text-lg font-black text-emerald-400 font-mono">{formatNpr(totalRevenue)}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Orders</span>
            <div className="text-lg font-black text-white font-mono">{totalOrdersCount}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Action Needed</span>
            <div className="text-lg font-black text-amber-400 font-mono">{pendingCount}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Active Catalog</span>
            <div className="text-lg font-black text-cyan-400 font-mono">{products.length} Products</div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="px-4 pt-3 bg-slate-900/60 border-b border-white/10 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all border-t border-x ${
                activeTab === 'orders'
                  ? 'bg-[#0e1420] text-emerald-400 border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              Manage Orders ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all border-t border-x ${
                activeTab === 'products'
                  ? 'bg-[#0e1420] text-emerald-400 border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              Manage Products, Logos & Pricing
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all border-t border-x ${
                activeTab === 'customers'
                  ? 'bg-[#0e1420] text-emerald-400 border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              Subscription Status Tracker
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={handleAddNewProductClick}
              className="mb-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </button>
          )}
        </div>

        {/* TAB 1: MANAGE ORDERS */}
        {activeTab === 'orders' && (
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            
            {/* Search & Status Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-white/10">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Name, Phone (e.g. 9841234567), or Txn Ref..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                {['All', 'Pending', 'Payment Verified', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                      statusFilter === st
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                        : 'bg-slate-950 text-slate-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table / Cards */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <p className="text-center text-slate-400 py-10 text-xs">No orders match the current filter.</p>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-white/10 hover:border-emerald-500/30 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-emerald-400">{order.id}</span>
                        <span className="text-[10px] text-slate-400">({order.createdAt})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Change Selector */}
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-slate-950 border border-white/20 rounded px-2 py-1 text-xs text-white font-bold focus:border-emerald-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Payment Verified">Payment Verified</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        {/* WhatsApp Direct Chat Button */}
                        <a
                          href={generateCustomerWhatsAppUpdateUrl(order.customerPhone, order.id, order.status)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                          title="Contact Customer on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Customer Details:</span>
                        <strong className="text-white block">{order.customerName}</strong>
                        <span className="font-mono text-cyan-300 block">{order.customerPhone}</span>
                        <span className="text-[11px] text-slate-400 block truncate">{order.customerEmail}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Subscription Ordered:</span>
                        <strong className="text-white block">{order.productTitle}</strong>
                        <span className="text-slate-300 block">Plan: {order.planDuration}</span>
                        <strong className="text-emerald-400 block">Total: {formatNpr(order.amountNpr)}</strong>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Payment Verification:</span>
                        <span className="text-purple-300 uppercase font-bold block">{order.paymentMethod}</span>
                        <span className="text-slate-200 font-mono block">Txn ID: {order.paymentRefId}</span>
                      </div>
                    </div>

                    {/* Delivery Notes / Credential Info */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
                      <div>
                        <span className="text-[10px] text-emerald-400 font-bold block">Delivery Status:</span>
                        <span>{order.deliveryNotes || 'Waiting for activation credentials.'}</span>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* TAB 2: MANAGE PRODUCTS & PRICING */}
        {activeTab === 'products' && (
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            <p className="text-xs text-slate-400">
              Modify product details, change logo/icon (URL or presets), update NPR prices, or add new subscriptions:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-3 relative group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.iconBg} p-2 flex items-center justify-center border border-white/10 shrink-0`}>
                        {renderLogoPreview(p.logoIcon)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                          <span>{p.title}</span>
                          {p.badge && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                              {p.badge}
                            </span>
                          )}
                        </h4>
                        <span className="text-[11px] text-emerald-400 block">{p.brand} • {p.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingProductModal(p)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/30 hover:border-emerald-500/40 text-emerald-400 border border-white/10 text-xs font-bold transition-all flex items-center gap-1"
                        title="Edit Logo & Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Edit Logo & Details</span>
                      </button>

                      {onDeleteProduct && (
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 bg-slate-950/60 p-2 rounded border border-white/5">
                    {p.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="text-[11px] font-bold text-slate-400 block">Plans & NPR Pricing:</label>
                    {p.plans.map((plan) => {
                      const key = `${p.id}_${plan.id}`;
                      const currentVal = editingPriceMap[key] ?? plan.priceNpr;

                      return (
                        <div key={plan.id} className="flex items-center justify-between gap-2 text-xs">
                          <span className="text-slate-300 font-medium">{plan.name} ({plan.duration}):</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">NPR</span>
                            <input
                              type="number"
                              value={currentVal}
                              onChange={(e) => handlePriceChange(p.id, plan.id, e.target.value)}
                              className="w-24 bg-slate-950 border border-white/20 rounded px-2 py-1 text-xs text-emerald-400 font-bold focus:border-emerald-500 font-mono"
                            />
                            <button
                              onClick={() => handleSavePrice(p.id, plan.id)}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER SUBSCRIPTION TRACKER */}
        {activeTab === 'customers' && (
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            <p className="text-xs text-slate-400">
              Track customer subscription activation history & send 1-click renewal reminders on WhatsApp:
            </p>

            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="p-3.5 rounded-xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-white block">{o.customerName}</strong>
                    <span className="text-emerald-400 font-mono">{o.customerPhone}</span>
                    <span className="text-slate-400 block">{o.productTitle} — {o.planDuration}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Active
                    </span>
                    <a
                      href={generateCustomerWhatsAppUpdateUrl(o.customerPhone, o.id, "Subscription Renewal Due Soon")}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Send Renewal Reminder</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* PRODUCT LOGO & DETAILS EDIT MODAL */}
      {editingProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-[#0f1522] border border-emerald-500/30 text-white shadow-2xl p-6 space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Edit Product & Logo Details
                  </h3>
                  <p className="text-xs text-slate-400">Change name, brand, category, logo image URL or icon presets</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingProductModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductModal} className="space-y-4 text-xs">
              
              {/* Title & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Product Title:</label>
                  <input
                    type="text"
                    required
                    value={editingProductModal.title}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, title: e.target.value })}
                    className="w-full bg-slate-950 border border-white/15 rounded-lg p-2.5 text-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Brand Name:</label>
                  <input
                    type="text"
                    required
                    value={editingProductModal.brand}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, brand: e.target.value })}
                    className="w-full bg-slate-950 border border-white/15 rounded-lg p-2.5 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category:</label>
                  <select
                    value={editingProductModal.category}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, category: e.target.value as Category })}
                    className="w-full bg-slate-950 border border-white/15 rounded-lg p-2.5 text-white focus:border-emerald-500 font-bold"
                  >
                    <option value="AI Tools">AI Tools</option>
                    <option value="Streaming">Streaming</option>
                    <option value="Design & Video">Design & Video</option>
                    <option value="Productivity">Productivity</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Badge Tag (Optional):</label>
                  <input
                    type="text"
                    placeholder="e.g. BEST SELLER, HOT DEAL"
                    value={editingProductModal.badge || ''}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, badge: e.target.value })}
                    className="w-full bg-slate-950 border border-white/15 rounded-lg p-2.5 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Logo / Image URL Customization */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>Product Logo (Image URL or Icon Preset)</span>
                  </label>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/20 flex items-center justify-center">
                    {renderLogoPreview(editingProductModal.logoIcon)}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-[11px] block mb-1">
                    Enter Image URL (http://...) or preset icon name:
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/logo.png or Bot, Youtube, Tv, Palette..."
                    value={editingProductModal.logoIcon}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, logoIcon: e.target.value })}
                    className="w-full bg-slate-900 border border-white/15 rounded-lg p-2.5 text-white font-mono text-xs focus:border-emerald-500"
                  />
                </div>

                {/* Preset Icon Selector Buttons */}
                <div>
                  <span className="text-slate-400 text-[10px] block mb-1.5">Quick Preset Icons:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Bot', label: '🤖 ChatGPT/Bot' },
                      { name: 'Tv', label: '📺 Netflix/Tv' },
                      { name: 'Palette', label: '🎨 Canva/Palette' },
                      { name: 'Youtube', label: '▶️ Youtube' },
                      { name: 'Music', label: '🎵 Spotify/Music' },
                      { name: 'Video', label: '🎥 Prime/Video' },
                      { name: 'Sparkles', label: '✨ Sparkles' },
                      { name: 'Cpu', label: '⚡ Cpu' }
                    ].map((ic) => (
                      <button
                        type="button"
                        key={ic.name}
                        onClick={() => setEditingProductModal({ ...editingProductModal, logoIcon: ic.name })}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all ${
                          editingProductModal.logoIcon === ic.name
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                            : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                        }`}
                      >
                        {ic.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={editingProductModal.description}
                  onChange={(e) => setEditingProductModal({ ...editingProductModal, description: e.target.value })}
                  className="w-full bg-slate-950 border border-white/15 rounded-lg p-2.5 text-white focus:border-emerald-500"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProductModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/30"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
