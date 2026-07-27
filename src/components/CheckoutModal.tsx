import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  MessageCircle, 
  Copy, 
  Check, 
  Send, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  QrCode, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { Order, PaymentMethodId, Product } from '../types';
import { PAYMENT_METHODS } from '../data/initialData';
import { formatNpr, generateOrderWhatsAppUrl } from '../utils/helpers';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialProductId?: string;
  initialPlanId?: string;
  onOrderCreated: (newOrder: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  products,
  initialProductId,
  initialPlanId,
  onOrderCreated
}) => {
  if (!isOpen) return null;

  // Selected product logic
  const selectedProduct = products.find((p) => p.id === initialProductId) || products[0];
  const initialPlan = selectedProduct.plans.find((p) => p.id === initialPlanId) || selectedProduct.plans[0];

  // Form State
  const [selectedProductId, setSelectedProductId] = useState<string>(selectedProduct.id);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlan.id);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodId>('esewa');
  const [transactionRefId, setTransactionRefId] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Flow Step: 1 = Details & Payment, 2 = Confirmation Receipt
  const [step, setStep] = useState<1 | 2>(1);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const activePlan = activeProduct.plans.find((p) => p.id === selectedPlanId) || activeProduct.plans[0];
  const activePaymentMethod = PAYMENT_METHODS.find((m) => m.id === selectedPaymentMethod) || PAYMENT_METHODS[0];

  const subtotal = activePlan.priceNpr;
  const totalAmount = Math.max(0, subtotal - promoDiscount);

  const handleApplyPromo = () => {
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'SUBX100') {
      setPromoDiscount(100);
      setPromoApplied(true);
    } else if (promoCode.trim().toUpperCase() === 'NEPAL2026') {
      setPromoDiscount(150);
      setPromoApplied(true);
    } else {
      setPromoError('Invalid code. Try "SUBX100" for NPR 100 off!');
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }

    const newOrder: Order = {
      id: `SUBX-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim() || 'Not provided',
      customerPhone: customerPhone.trim(),
      productId: activeProduct.id,
      productTitle: activeProduct.title,
      planDuration: activePlan.duration,
      amountNpr: totalAmount,
      discountNpr: promoDiscount,
      paymentMethod: selectedPaymentMethod,
      paymentRefId: transactionRefId.trim() || 'PENDING_REF',
      status: 'Payment Verified',
      deliveryNotes: 'Order submitted. 5-15 min delivery via WhatsApp.'
    };

    onOrderCreated(newOrder);
    setCompletedOrder(newOrder);
    setStep(2);
  };

  const handleCopyOrderDetails = () => {
    if (!completedOrder) return;
    const details = `SubX Nepal Order #${completedOrder.id}
Product: ${completedOrder.productTitle} (${completedOrder.planDuration})
Amount: NPR ${completedOrder.amountNpr}
Phone: ${completedOrder.customerPhone}
Txn Ref: ${completedOrder.paymentRefId}`;
    navigator.clipboard.writeText(details);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0f1522] border border-white/10 text-white shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              SX
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                {step === 1 ? 'SubX Nepal Secure Checkout' : '🎉 Order Placed Successfully!'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {step === 1 ? 'Complete payment using eSewa, Khalti, or Bank Transfer' : 'Instant 5-15 Min Activation in Progress'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: FORM & PAYMENT */}
        {step === 1 && (
          <form onSubmit={handleCreateOrder} className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* Product & Plan Selector */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                1. Selected Subscription Item:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Select Subscription:</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => {
                      setSelectedProductId(e.target.value);
                      const p = products.find((prod) => prod.id === e.target.value);
                      if (p && p.plans.length > 0) {
                        setSelectedPlanId(p.plans[0].id);
                      }
                    }}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Select Duration Plan:</label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    {activeProduct.plans.map((pl) => (
                      <option key={pl.id} value={pl.id}>
                        {pl.name} — {formatNpr(pl.priceNpr)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Customer Contact Details */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                2. Customer Information:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">
                    Your Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suman Subedi"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">
                    WhatsApp Phone Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">+977</span>
                    <input
                      type="tel"
                      required
                      placeholder="98XXXXXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg pl-14 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">
                  Email Address (For credentials / activation invitation):
                </label>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                />
              </div>
            </div>

            {/* Payment Method Cards */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                3. Choose Payment Method:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    type="button"
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedPaymentMethod === method.id
                        ? 'bg-emerald-500/15 border-emerald-500 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-900/60 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-fit border mb-2 ${method.badgeBg}`}>
                      {method.logoText}
                    </span>
                    <span className="text-xs font-bold text-white block">
                      {method.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Payment Instructions Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold text-emerald-400">
                    Payment Receiver Account Details:
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                    VERIFIED MERCHANT
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-200 py-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Number / Account ID:</span>
                    <strong className="text-sm text-cyan-300 font-mono select-all">
                      {activePaymentMethod.accountNumber}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Account Holder Name:</span>
                    <strong className="text-sm text-white">
                      {activePaymentMethod.accountName}
                    </strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded border border-white/5">
                  👉 {activePaymentMethod.instructions}
                </p>

                {/* Transaction Reference ID Input */}
                <div className="pt-2">
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Enter Transaction Code / Reference ID (After Sending Money):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. eSewa Txn Code: 98127391 or Khalti ID: 442109"
                    value={transactionRefId}
                    onChange={(e) => setTransactionRefId(e.target.value)}
                    className="w-full bg-slate-900 border border-emerald-500/50 rounded-lg p-2.5 text-xs text-emerald-300 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    * If you haven't transferred yet, you can also submit order now and send screenshot on WhatsApp!
                  </p>
                </div>
              </div>
            </div>

            {/* Promo Code & Order Summary */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. SUBX100)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                  className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoCode.trim()}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 border border-emerald-500/30 disabled:opacity-50"
                >
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {promoError && <p className="text-[11px] text-red-400">{promoError}</p>}
              {promoApplied && <p className="text-[11px] text-emerald-400 font-bold">🎉 Coupon Applied! Saved NPR {promoDiscount}</p>}

              <div className="border-t border-white/10 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal ({activeProduct.title} - {activePlan.duration}):</span>
                  <span>{formatNpr(subtotal)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Discount Coupon:</span>
                    <span>- {formatNpr(promoDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                  <span>Total Payable Amount:</span>
                  <span className="text-emerald-400 font-mono">{formatNpr(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Confirm & Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Encrypted & Safe • 5-15 Min Instant Activation</span>
            </div>

          </form>
        )}

        {/* STEP 2: ORDER CONFIRMATION RECEIPT */}
        {step === 2 && completedOrder && (
          <div className="p-6 space-y-6 text-center max-h-[80vh] overflow-y-auto">
            
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-extrabold text-white">Order Received!</h4>
              <p className="text-xs text-slate-300">
                Your order is being processed for activation.
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-slate-400">Order ID:</span>
                <strong className="text-emerald-400 text-sm">{completedOrder.id}</strong>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Product:</span>
                <strong className="text-white">{completedOrder.productTitle}</strong>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Plan Duration:</span>
                <span>{completedOrder.planDuration}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Total Paid:</span>
                <strong className="text-emerald-400 text-sm">NPR {completedOrder.amountNpr}</strong>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Customer Name:</span>
                <span>{completedOrder.customerName}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Phone:</span>
                <span>{completedOrder.customerPhone}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Payment Method:</span>
                <span className="uppercase text-cyan-300 font-bold">{completedOrder.paymentMethod}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-white/10">
                <span className="text-slate-400">Txn Ref Code:</span>
                <span className="text-emerald-300 font-bold">{completedOrder.paymentRefId}</span>
              </div>
            </div>

            {/* Direct WhatsApp Send Call To Action */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 space-y-3 text-left">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Clock className="w-4 h-4" />
                <span>Next Step: Send Order to WhatsApp for Instant Delivery</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                To complete instant 5-15 minute activation, click the button below to send your Order ID <strong>{completedOrder.id}</strong> and payment details directly to our WhatsApp support team!
              </p>

              <a
                href={generateOrderWhatsAppUrl(completedOrder)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 fill-slate-950 text-emerald-500" />
                <span>Send Order Details via WhatsApp</span>
              </a>
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleCopyOrderDetails}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-2"
              >
                {copiedRef ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedRef ? 'Details Copied!' : 'Copy Receipt Details'}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-bold text-slate-300"
              >
                Close Window
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
