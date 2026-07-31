import React, { useState, useRef } from 'react';
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
  Tag,
  Upload,
  RotateCcw,
  FileImage,
  Check,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Layers,
  Sliders
} from 'lucide-react';
import { Category, Order, OrderStatus, Product, PromoPoster, SiteSettings } from '../types';
import { DEFAULT_SITE_SETTINGS, formatNpr, generateCustomerWhatsAppUpdateUrl } from '../utils/helpers';

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
  siteSettings?: SiteSettings;
  onUpdateSiteSettings?: (settings: SiteSettings) => void;
  promoPosters?: PromoPoster[];
  onUpdatePromoPosters?: (posters: PromoPoster[]) => void;
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
  onDeleteProduct,
  siteSettings,
  onUpdateSiteSettings,
  promoPosters = [],
  onUpdatePromoPosters
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'customers' | 'posters' | 'settings'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Site settings local state
  const [localSiteSettings, setLocalSiteSettings] = useState<SiteSettings>(
    siteSettings || DEFAULT_SITE_SETTINGS
  );
  const [siteSettingsSuccessMsg, setSiteSettingsSuccessMsg] = useState<string>('');
  const siteLogoFileInputRef = useRef<HTMLInputElement>(null);

  // Poster state
  const [localPosters, setLocalPosters] = useState<PromoPoster[]>(promoPosters);
  const [editingPoster, setEditingPoster] = useState<PromoPoster | null>(null);
  const [isAddPosterOpen, setIsAddPosterOpen] = useState(false);
  const posterFileInputRef = useRef<HTMLInputElement>(null);

  // Product Edit state
  const [editingPriceMap, setEditingPriceMap] = useState<Record<string, number>>({});
  const [editingProductModal, setEditingProductModal] = useState<Product | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImageToServer = async (base64Str: string): Promise<string> => {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Str })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) return data.url;
      }
    } catch (err) {
      console.warn('Image upload to server failed, using base64 fallback', err);
    }
    return base64Str;
  };

  const handleSavePosters = (updated: PromoPoster[]) => {
    setLocalPosters(updated);
    if (onUpdatePromoPosters) {
      onUpdatePromoPosters(updated);
    }
  };

  const handleTogglePosterActive = (posterId: string) => {
    const updated = localPosters.map((p) =>
      p.id === posterId ? { ...p, isActive: !p.isActive } : p
    );
    handleSavePosters(updated);
  };

  const handleDeletePoster = (posterId: string) => {
    if (window.confirm('Are you sure you want to delete this promotional poster?')) {
      const updated = localPosters.filter((p) => p.id !== posterId);
      handleSavePosters(updated);
    }
  };

  const handleMovePoster = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= localPosters.length) return;

    const updated = [...localPosters];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    const reordered = updated.map((p, idx) => ({ ...p, displayOrder: idx + 1 }));
    handleSavePosters(reordered);
  };

  const handlePosterImageUpload = (file: File) => {
    if (!file || !editingPoster) return;
    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.result) {
        const base64Str = reader.result as string;
        const uploadedUrl = await uploadImageToServer(base64Str);
        setEditingPoster((prev) => (prev ? { ...prev, imageUrl: uploadedUrl } : null));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSiteLogoUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.result) {
        const base64Str = reader.result as string;
        const uploadedUrl = await uploadImageToServer(base64Str);
        setLocalSiteSettings((prev) => ({
          ...prev,
          logoUrl: uploadedUrl
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeviceImageUpload = (file: File) => {
    setUploadError('');
    if (!file) return;

    // Validate image format: PNG, JPG, JPEG, WEBP, SVG
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError('Unsupported file format! Please upload a PNG, JPG, JPEG, WEBP, or SVG image.');
      return;
    }

    // Validate image file size <= 5MB
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      setUploadError('File size exceeds the 5MB limit. Please choose an image under 5MB.');
      return;
    }

    // Convert to Base64 and upload to server
    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.result && editingProductModal) {
        const base64Str = reader.result as string;
        const uploadedUrl = await uploadImageToServer(base64Str);
        setEditingProductModal((prev) => prev ? {
          ...prev,
          logoIcon: uploadedUrl
        } : null);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file from device. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Helper render icon preview
  const renderLogoPreview = (logoIcon: string) => {
    if (
      !logoIcon ||
      logoIcon.startsWith('http://') || 
      logoIcon.startsWith('https://') || 
      logoIcon.startsWith('data:') || 
      logoIcon.startsWith('/')
    ) {
      if (!logoIcon) return <Sparkles className="w-5 h-5 text-emerald-400" />;
      return (
        <img 
          src={logoIcon} 
          alt="Logo" 
          className="w-full h-full object-contain rounded-lg" 
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }} 
        />
      );
    }
    const iconKey = logoIcon.toLowerCase();
    if (iconKey.includes('bot') || iconKey.includes('chatgpt')) return <Bot className="w-5 h-5 text-emerald-400" />;
    if (iconKey.includes('tv') || iconKey.includes('netflix')) return <Tv className="w-5 h-5 text-red-500" />;
    if (iconKey.includes('palette') || iconKey.includes('canva')) return <Palette className="w-5 h-5 text-purple-300" />;
    if (iconKey.includes('youtube')) return <Youtube className="w-5 h-5 text-red-400" />;
    if (iconKey.includes('music') || iconKey.includes('spotify')) return <Music className="w-5 h-5 text-emerald-300" />;
    if (iconKey.includes('video') || iconKey.includes('prime')) return <Video className="w-5 h-5 text-cyan-300" />;
    if (iconKey.includes('cpu')) return <Cpu className="w-5 h-5 text-amber-400" />;
    if (iconKey.includes('gemini') || iconKey.includes('sparkles')) return <Sparkles className="w-5 h-5 text-amber-300" />;
    return <Sparkles className="w-5 h-5 text-emerald-400" />;
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

            <button
              onClick={() => setActiveTab('posters')}
              className={`px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all border-t border-x flex items-center gap-1.5 ${
                activeTab === 'posters'
                  ? 'bg-[#0e1420] text-purple-400 border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Promotional Posters ({localPosters.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all border-t border-x flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-[#0e1420] text-emerald-400 border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Website Logo & Settings</span>
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

          {activeTab === 'posters' && (
            <button
              onClick={() => {
                setEditingPoster({
                  id: `poster_${Date.now()}`,
                  title: '',
                  subtitle: '',
                  buttonText: 'Claim Offer',
                  productId: products[0]?.id || '',
                  imageUrl: '',
                  isActive: true,
                  displayOrder: localPosters.length + 1,
                  createdAt: new Date().toISOString()
                });
                setIsAddPosterOpen(true);
              }}
              className="mb-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Poster</span>
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

        {/* TAB 4: WEBSITE LOGO & SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 max-w-3xl">
            <div className="space-y-1">
              <h3 className="font-black text-lg text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Website Brand & Logo Configuration</span>
              </h3>
              <p className="text-xs text-slate-400">
                Customize your website logo image, store brand name, and support details instantly.
              </p>
            </div>

            {siteSettingsSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{siteSettingsSuccessMsg}</span>
              </div>
            )}

            <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-5">
              
              {/* Website Logo Upload Section */}
              <div className="space-y-3 pb-5 border-b border-white/10">
                <label className="text-xs font-bold text-slate-300 block">
                  Website Main Logo Image:
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Logo Preview Container */}
                  <div className="w-20 h-20 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 flex items-center justify-center p-2 shadow-xl overflow-hidden relative group">
                    {localSiteSettings.logoUrl ? (
                      <img 
                        src={localSiteSettings.logoUrl} 
                        alt="Website Logo" 
                        className="w-full h-full object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[1.5px] rounded-xl">
                        <div className="w-full h-full bg-[#070a12] rounded-[10px] flex items-center justify-center font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
                          S<span className="text-emerald-400">X</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2">
                    <input 
                      type="file" 
                      ref={siteLogoFileInputRef}
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleSiteLogoUpload(file);
                      }}
                    />

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => siteLogoFileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Logo from Device</span>
                      </button>

                      {localSiteSettings.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setLocalSiteSettings(prev => ({ ...prev, logoUrl: '' }))}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-all"
                        >
                          Reset to Default
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Supports PNG, JPG, WEBP, SVG (Max 5MB). Recommended size: square or 1:1 aspect ratio.
                    </p>
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    Website Name:
                  </label>
                  <input
                    type="text"
                    value={localSiteSettings.siteName}
                    onChange={(e) => setLocalSiteSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. SubX Nepal"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    Website Sub-Tagline:
                  </label>
                  <input
                    type="text"
                    value={localSiteSettings.tagline}
                    onChange={(e) => setLocalSiteSettings(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. PREMIUM DIGITAL STORE"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    WhatsApp Admin Support Number:
                  </label>
                  <input
                    type="text"
                    value={localSiteSettings.whatsappNumber}
                    onChange={(e) => setLocalSiteSettings(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder="e.g. 9765617156"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    Delivery Speed Tagline:
                  </label>
                  <input
                    type="text"
                    value={localSiteSettings.deliveryTagline}
                    onChange={(e) => setLocalSiteSettings(prev => ({ ...prev, deliveryTagline: e.target.value }))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. 5-15 Min Instant Delivery"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateSiteSettings) {
                      onUpdateSiteSettings(localSiteSettings);
                      setSiteSettingsSuccessMsg('Website Logo & Branding settings saved successfully!');
                      setTimeout(() => setSiteSettingsSuccessMsg(''), 3000);
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Website Settings</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: PROMOTIONAL POSTERS */}
        {activeTab === 'posters' && (
          <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
            
            {/* Header & Safe ON/OFF Toggle */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-slate-900 border border-purple-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    Show Promotional Posters Section on Website
                  </h3>
                </div>
                <p className="text-xs text-slate-300">
                  SAFE ON/OFF Control. Turn OFF to completely hide the promotional poster slider from the customer website without leaving any empty space.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const newStatus = localSiteSettings.showPromotionalPosters === false ? true : false;
                    const updated = { ...localSiteSettings, showPromotionalPosters: newStatus };
                    setLocalSiteSettings(updated);
                    if (onUpdateSiteSettings) {
                      onUpdateSiteSettings(updated);
                      setSiteSettingsSuccessMsg(
                        newStatus
                          ? 'Promotional Posters turned ON (Visible on website)'
                          : 'Promotional Posters turned OFF (Hidden from website)'
                      );
                      setTimeout(() => setSiteSettingsSuccessMsg(''), 3000);
                    }
                  }}
                  className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    localSiteSettings.showPromotionalPosters !== false ? 'bg-purple-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      localSiteSettings.showPromotionalPosters !== false ? 'translate-x-8' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`text-xs font-black uppercase tracking-wider ${
                  localSiteSettings.showPromotionalPosters !== false ? 'text-purple-400' : 'text-slate-500'
                }`}>
                  {localSiteSettings.showPromotionalPosters !== false ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>

            {siteSettingsSuccessMsg && (
              <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{siteSettingsSuccessMsg}</span>
              </div>
            )}

            {/* List & Add Header */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <h4 className="text-sm font-extrabold text-white">Promotional Slides ({localPosters.length})</h4>
                <p className="text-xs text-slate-400">Manage, edit, reorder or disable individual slide banners.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingPoster({
                    id: `poster_${Date.now()}`,
                    title: '',
                    subtitle: '',
                    buttonText: 'Claim Offer',
                    productId: products[0]?.id || '',
                    imageUrl: '',
                    isActive: true,
                    displayOrder: localPosters.length + 1,
                    createdAt: new Date().toISOString()
                  });
                  setIsAddPosterOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Poster</span>
              </button>
            </div>

            {/* Posters List */}
            {localPosters.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto opacity-50" />
                <p className="text-xs font-bold text-slate-300">No promotional posters found.</p>
                <p className="text-[11px] text-slate-500">Click "Add New Poster" to create your first promotional banner slide!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {localPosters.map((poster, index) => {
                  const linkedProd = products.find(p => p.id === poster.productId);
                  return (
                    <div
                      key={poster.id}
                      className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        {/* Order Controls */}
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMovePoster(index, 'up')}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === localPosters.length - 1}
                            onClick={() => handleMovePoster(index, 'down')}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Thumbnail */}
                        <div className="w-16 h-12 rounded-xl bg-slate-950 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                          {poster.imageUrl ? (
                            <img src={poster.imageUrl} alt={poster.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-purple-900/50 to-cyan-900/50 flex items-center justify-center text-purple-300">
                              <Sparkles className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        {/* Text Information */}
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-black text-white truncate">{poster.title || 'Untitled Poster'}</h5>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                poster.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              {poster.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{poster.subtitle || 'No subtitle provided'}</p>
                          <div className="flex items-center gap-2 text-[10px] text-purple-300 pt-0.5">
                            <span>CTA: "{poster.buttonText || 'Claim Offer'}"</span>
                            {linkedProd && (
                              <>
                                <span>•</span>
                                <span className="text-cyan-400 font-semibold">Opens: {linkedProd.title}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePosterActive(poster.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                            poster.isActive
                              ? 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'
                              : 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/30'
                          }`}
                        >
                          {poster.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{poster.isActive ? 'Disable' : 'Enable'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingPoster(poster);
                            setIsAddPosterOpen(true);
                          }}
                          className="p-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
                          title="Edit Poster"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePoster(poster.id)}
                          className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
                          title="Delete Poster"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

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

              {/* Product Logo & Image Upload System */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-4 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <label className="text-emerald-400 font-extrabold text-xs flex items-center gap-1.5 uppercase tracking-wide">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>Product Logo & Image Upload</span>
                  </label>

                  {/* Indicator tag */}
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    {editingProductModal.logoIcon?.startsWith('data:') 
                      ? 'Base64 Device Image' 
                      : editingProductModal.logoIcon?.startsWith('http') 
                        ? 'Image URL' 
                        : 'Preset Icon Active'}
                  </span>
                </div>

                {/* 1. Device Image Upload Button & Dropzone */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 block">1. Upload Image from Device (PNG, JPG, WEBP • Max 5MB):</span>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleDeviceImageUpload(e.target.files[0]);
                      }
                      e.target.value = '';
                    }}
                  />

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 bg-slate-900/80 hover:bg-slate-900 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-emerald-300">
                        Click to Choose Image File
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Supports PNG, JPG, JPEG, WEBP format up to 5MB size
                      </p>
                    </div>
                  </div>

                  {uploadError && (
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>

                {/* 2. Image Preview & Control Box */}
                {(editingProductModal.logoIcon?.startsWith('data:') || editingProductModal.logoIcon?.startsWith('http') || editingProductModal.logoIcon?.startsWith('/')) && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-3">
                    <span className="text-[11px] font-bold text-slate-300 block">Uploaded Image Preview:</span>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl bg-slate-950 border border-emerald-500/40 p-1.5 flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden">
                        <img 
                          src={editingProductModal.logoIcon} 
                          alt="Product Logo Preview" 
                          className="w-full h-full object-contain rounded-lg"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-xs font-bold text-white">Custom Product Image</p>
                        <p className="text-[10px] text-emerald-400 font-mono truncate max-w-[200px] sm:max-w-[280px]">
                          {editingProductModal.logoIcon.substring(0, 42)}...
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold transition-all flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Replace Image</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingProductModal({
                                ...editingProductModal,
                                logoIcon: 'Bot'
                              });
                              setUploadError('');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-[11px] font-bold transition-all flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove Image</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Fallback Preset Icons Selector */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 block">
                      2. Fallback Preset Icons:
                    </span>
                    <span className="text-[10px] text-slate-400">Select standard icon if no image uploaded</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {[
                      { key: 'Bot', name: 'ChatGPT/Bot', icon: <Bot className="w-4 h-4 text-emerald-400" /> },
                      { key: 'Tv', name: 'Netflix', icon: <Tv className="w-4 h-4 text-red-500" /> },
                      { key: 'Palette', name: 'Canva', icon: <Palette className="w-4 h-4 text-purple-300" /> },
                      { key: 'Youtube', name: 'YouTube', icon: <Youtube className="w-4 h-4 text-red-400" /> },
                      { key: 'Music', name: 'Spotify', icon: <Music className="w-4 h-4 text-emerald-300" /> },
                      { key: 'Video', name: 'Prime Video', icon: <Video className="w-4 h-4 text-cyan-300" /> },
                      { key: 'Gemini', name: 'Gemini AI', icon: <Sparkles className="w-4 h-4 text-amber-300" /> },
                      { key: 'Sparkles', name: 'Sparkles', icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
                      { key: 'Cpu', name: 'CPU', icon: <Cpu className="w-4 h-4 text-amber-400" /> }
                    ].map((ic) => {
                      const isSelected = editingProductModal.logoIcon?.toLowerCase() === ic.key.toLowerCase() || 
                        (ic.key === 'Gemini' && editingProductModal.logoIcon?.toLowerCase() === 'sparkles');
                      
                      return (
                        <button
                          type="button"
                          key={ic.key}
                          onClick={() => {
                            setEditingProductModal({ ...editingProductModal, logoIcon: ic.key });
                            setUploadError('');
                          }}
                          className={`p-2 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-950/40'
                              : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white hover:border-white/20'
                          }`}
                        >
                          {ic.icon}
                          <span className="truncate">{ic.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Direct Image Web URL Input */}
                <div className="pt-2 border-t border-white/10 space-y-1">
                  <label className="text-[11px] text-slate-400 block font-medium">
                    Or enter direct Image Web URL (http://...):
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/logo.png"
                    value={editingProductModal.logoIcon?.startsWith('data:') ? '' : editingProductModal.logoIcon}
                    onChange={(e) => {
                      setEditingProductModal({ ...editingProductModal, logoIcon: e.target.value });
                      setUploadError('');
                    }}
                    className="w-full bg-slate-900 border border-white/15 rounded-lg p-2.5 text-white font-mono text-xs focus:border-emerald-500 placeholder-slate-600"
                  />
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

              {/* Stock & Delivery Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Stock Status:</label>
                  <input
                    type="text"
                    placeholder="Instant Auto-Deliver or In Stock"
                    value={editingProductModal.stockStatus || 'Instant Auto-Deliver'}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, stockStatus: e.target.value })}
                    className="w-full bg-slate-950 border border-white/15 rounded-lg p-2.5 text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Delivery Time Guarantee:</label>
                  <input
                    type="text"
                    placeholder="5-15 Mins"
                    value={editingProductModal.deliveryTime || '5-15 Mins'}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, deliveryTime: e.target.value })}
                    className="w-full bg-slate-950 border border-white/15 rounded-lg p-2.5 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Plans & Pricing Section */}
              <div className="p-4 rounded-xl bg-slate-950 border border-white/15 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <label className="text-emerald-400 font-extrabold text-xs flex items-center gap-1.5 uppercase">
                    <Tag className="w-4 h-4 text-emerald-400" />
                    <span>Plans & NPR Pricing</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newPlanId = `${editingProductModal.id}-plan-${Date.now()}`;
                      setEditingProductModal({
                        ...editingProductModal,
                        plans: [
                          ...editingProductModal.plans,
                          { id: newPlanId, name: '6 Months', duration: '6 Months', priceNpr: 1000 }
                        ]
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1"
                  >
                    <span>+ Add Plan</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {editingProductModal.plans.map((pl, idx) => (
                    <div key={pl.id} className="p-2.5 rounded-lg bg-slate-900 border border-white/10 flex flex-col sm:flex-row items-center gap-2">
                      <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Plan Name:</span>
                          <input
                            type="text"
                            value={pl.name}
                            onChange={(e) => {
                              const updatedPlans = [...editingProductModal.plans];
                              updatedPlans[idx] = { ...updatedPlans[idx], name: e.target.value, duration: e.target.value };
                              setEditingProductModal({ ...editingProductModal, plans: updatedPlans });
                            }}
                            className="w-full bg-slate-950 border border-white/15 rounded px-2 py-1 text-white font-bold"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">NPR Price (Rs.):</span>
                          <input
                            type="number"
                            value={pl.priceNpr}
                            onChange={(e) => {
                              const updatedPlans = [...editingProductModal.plans];
                              updatedPlans[idx] = { ...updatedPlans[idx], priceNpr: parseInt(e.target.value, 10) || 0 };
                              setEditingProductModal({ ...editingProductModal, plans: updatedPlans });
                            }}
                            className="w-full bg-slate-950 border border-white/15 rounded px-2 py-1 text-emerald-400 font-extrabold font-mono"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1 flex items-center pt-3">
                          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300">
                            <input
                              type="checkbox"
                              checked={pl.popular || false}
                              onChange={(e) => {
                                const updatedPlans = [...editingProductModal.plans];
                                updatedPlans[idx] = { ...updatedPlans[idx], popular: e.target.checked };
                                setEditingProductModal({ ...editingProductModal, plans: updatedPlans });
                              }}
                              className="rounded bg-slate-950 border-white/20 text-emerald-500 focus:ring-emerald-500"
                            />
                            <span>Popular Badge</span>
                          </label>
                        </div>
                      </div>

                      {editingProductModal.plans.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedPlans = editingProductModal.plans.filter((_, i) => i !== idx);
                            setEditingProductModal({ ...editingProductModal, plans: updatedPlans });
                          }}
                          className="p-1.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 shrink-0"
                          title="Remove Plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Features List Editor */}
              <div className="p-4 rounded-xl bg-slate-950 border border-white/15 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <label className="text-emerald-400 font-extrabold text-xs flex items-center gap-1.5 uppercase">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Product Feature Highlights (Bullet Points)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProductModal({
                        ...editingProductModal,
                        features: [...editingProductModal.features, 'Instant Account Activation & Warranty']
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1"
                  >
                    <span>+ Add Feature</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {editingProductModal.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => {
                          const updatedFeats = [...editingProductModal.features];
                          updatedFeats[idx] = e.target.value;
                          setEditingProductModal({ ...editingProductModal, features: updatedFeats });
                        }}
                        className="flex-1 bg-slate-900 border border-white/15 rounded-lg p-2 text-white text-xs focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedFeats = editingProductModal.features.filter((_, i) => i !== idx);
                          setEditingProductModal({ ...editingProductModal, features: updatedFeats });
                        }}
                        className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 shrink-0"
                        title="Delete Feature"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
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

      {/* PROMOTIONAL POSTER ADD / EDIT MODAL */}
      {isAddPosterOpen && editingPoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0f1522] border border-purple-500/30 text-white shadow-2xl p-6 space-y-4 my-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {localPosters.some(p => p.id === editingPoster.id) ? 'Edit Promotional Poster' : 'Add New Promotional Poster'}
                  </h3>
                  <p className="text-xs text-slate-400">Customize offer title, banner image, linked product and action button</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAddPosterOpen(false);
                  setEditingPoster(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editingPoster.title.trim()) {
                  alert('Please enter a poster title');
                  return;
                }

                const exists = localPosters.some(p => p.id === editingPoster.id);
                let updated: PromoPoster[];
                if (exists) {
                  updated = localPosters.map(p => p.id === editingPoster.id ? editingPoster : p);
                } else {
                  updated = [editingPoster, ...localPosters];
                }

                handleSavePosters(updated);
                setIsAddPosterOpen(false);
                setEditingPoster(null);
              }}
              className="space-y-4 text-xs"
            >
              {/* Poster Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Poster Title / Headline *</label>
                <input
                  type="text"
                  required
                  value={editingPoster.title}
                  onChange={(e) => setEditingPoster({ ...editingPoster, title: e.target.value })}
                  placeholder="e.g. Gemini AI Pro — Special Offer"
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Short Subtitle / Description</label>
                <input
                  type="text"
                  value={editingPoster.subtitle}
                  onChange={(e) => setEditingPoster({ ...editingPoster, subtitle: e.target.value })}
                  placeholder="e.g. Multimodal AI & 2TB Cloud Storage • Best Price in Nepal"
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Button Text & Product Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Button CTA Text</label>
                  <input
                    type="text"
                    value={editingPoster.buttonText}
                    onChange={(e) => setEditingPoster({ ...editingPoster, buttonText: e.target.value })}
                    placeholder="e.g. Claim Offer / Buy Now"
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Opens Product</label>
                  <select
                    value={editingPoster.productId || ''}
                    onChange={(e) => setEditingPoster({ ...editingPoster, productId: e.target.value })}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">General Store / Default Checkout</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.brand})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Poster Image Upload */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Poster Background Image (Optional)</label>
                <input
                  type="file"
                  ref={posterFileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePosterImageUpload(file);
                  }}
                />

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => posterFileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image from Device</span>
                  </button>

                  {editingPoster.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setEditingPoster({ ...editingPoster, imageUrl: '' })}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Remove Custom Image
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 pt-1">
                  If no image is uploaded, SubX Nepal theme dark gradient with brand icons will be used automatically.
                </p>

                {editingPoster.imageUrl && (
                  <div className="mt-2 h-20 w-full rounded-xl overflow-hidden bg-slate-950 border border-white/10 relative">
                    <img src={editingPoster.imageUrl} alt="Poster preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Status and Order */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingPoster.isActive}
                    onChange={(e) => setEditingPoster({ ...editingPoster, isActive: e.target.checked })}
                    className="rounded bg-slate-950 border-white/20 text-purple-500 focus:ring-purple-500"
                  />
                  <span>Enable Poster Immediately (Active)</span>
                </label>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span>Display Order:</span>
                  <input
                    type="number"
                    min="1"
                    value={editingPoster.displayOrder || 1}
                    onChange={(e) => setEditingPoster({ ...editingPoster, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-16 bg-slate-950 border border-white/15 rounded-lg px-2 py-1 text-center font-bold text-purple-400"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddPosterOpen(false);
                    setEditingPoster(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 text-xs cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Poster</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
