import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageCircle, 
  Copy, 
  Check, 
  PackageCheck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Order } from '../types';
import { formatNpr, generateGeneralWhatsAppUrl } from '../utils/helpers';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchedOrder(null);
      return;
    }

    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === query ||
        o.customerPhone.includes(query) ||
        o.paymentRefId.toLowerCase().includes(query)
    );

    setSearchedOrder(found || null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
      case 'Payment Verified': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40';
      case 'Processing': return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
      default: return 'text-purple-400 bg-purple-500/20 border-purple-500/40';
    }
  };

  const copyRef = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0e1420] border border-white/10 text-white shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Track Your Order Status</h3>
              <p className="text-[11px] text-slate-400">SubX Nepal Realtime Order Tracker</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              Enter Order ID, WhatsApp Phone, or Txn Reference ID:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. SUBX-90124 or 9841234567"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
              >
                Search
              </button>
            </div>
          </form>

          {/* Search Results */}
          {hasSearched && !searchedOrder && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 text-center space-y-2 text-xs">
              <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="font-semibold text-slate-200">No order found matching "{searchQuery}"</p>
              <p className="text-slate-400 text-[11px]">
                Please verify your Order ID or phone number. If you just placed your order, you can contact us directly on WhatsApp for instant status!
              </p>
              <a
                href={generateGeneralWhatsAppUrl(`Hi SubX Nepal, please check my order status for: ${searchQuery}`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold mt-2"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Ask Support on WhatsApp</span>
              </a>
            </div>
          )}

          {searchedOrder && (
            <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-4 text-xs">
              
              {/* Order Status Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-slate-400 block text-[10px]">Order ID:</span>
                  <strong className="text-white text-sm font-mono">{searchedOrder.id}</strong>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${getStatusColor(searchedOrder.status)}`}>
                  {searchedOrder.status}
                </span>
              </div>

              {/* Progress Steps Timeline */}
              <div className="py-2 space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Order Timeline:
                </p>
                <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-semibold">
                  <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    1. Received
                  </div>
                  <div className={`p-1.5 rounded border ${
                    searchedOrder.status === 'Completed' || searchedOrder.status === 'Payment Verified'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-white/5'
                  }`}>
                    2. Verified
                  </div>
                  <div className={`p-1.5 rounded border ${
                    searchedOrder.status === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-white/5'
                  }`}>
                    3. Delivered
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-1.5 pt-2 border-t border-white/10 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subscription:</span>
                  <strong className="text-white">{searchedOrder.productTitle} ({searchedOrder.planDuration})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Price:</span>
                  <span className="text-emerald-400 font-bold">{formatNpr(searchedOrder.amountNpr)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Method:</span>
                  <span className="uppercase font-mono">{searchedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Txn Ref ID:</span>
                  <span className="font-mono text-cyan-300">{searchedOrder.paymentRefId}</span>
                </div>
              </div>

              {/* Delivery / Credential Notes */}
              {searchedOrder.deliveryNotes && (
                <div className="p-3 rounded-lg bg-slate-950 border border-white/10 text-slate-300 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block">
                    Delivery Note / Activation Info:
                  </span>
                  <p className="text-xs">{searchedOrder.deliveryNotes}</p>
                </div>
              )}

              {/* WhatsApp Helper Button */}
              <a
                href={generateGeneralWhatsAppUrl(`Hi SubX Nepal, I am checking my order #${searchedOrder.id} for ${searchedOrder.productTitle}.`)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>Contact Admin on WhatsApp</span>
              </a>

            </div>
          )}

          {/* Quick Tip */}
          <div className="text-[11px] text-slate-400 text-center bg-slate-900/40 p-3 rounded-xl border border-white/5">
            💡 Sample Order IDs for Testing: <strong className="text-cyan-300 font-mono">SUBX-90124</strong> or <strong className="text-cyan-300 font-mono">SUBX-90123</strong>
          </div>

        </div>
      </div>
    </div>
  );
};
