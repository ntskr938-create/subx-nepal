export type Category = 'All' | 'AI Tools' | 'Streaming' | 'Design & Video' | 'Productivity';

export interface ProductPlan {
  id: string;
  name: string; // e.g. "1 Month", "1 Year"
  duration: string;
  priceNpr: number;
  originalPriceNpr?: number;
  popular?: boolean;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: Category;
  description: string;
  iconBg: string;
  brandColor: string;
  logoIcon: string; // Lucide icon name or image
  plans: ProductPlan[];
  selectedPlanId: string;
  features: string[];
  stockStatus: 'In Stock' | 'Limited Stock' | 'Instant Auto-Deliver';
  badge?: string;
  deliveryTime: string;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
}

export type PaymentMethodId = 'esewa' | 'khalti' | 'bank_transfer' | 'card_fonepay';

export interface PaymentDetails {
  id: PaymentMethodId;
  name: string;
  logoText: string;
  badgeBg: string;
  textColor: string;
  accountNumber: string;
  accountName: string;
  qrCodeUrl?: string;
  instructions: string;
}

export type OrderStatus = 'Pending' | 'Payment Verified' | 'Processing' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productId: string;
  productTitle: string;
  planDuration: string;
  amountNpr: number;
  discountNpr: number;
  paymentMethod: PaymentMethodId;
  paymentRefId: string;
  status: OrderStatus;
  deliveryNotes?: string;
  accountCredentials?: string;
  expiryDate?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface LiveOrderFeed {
  id: string;
  customerName: string;
  city: string;
  productTitle: string;
  plan: string;
  timeAgo: string;
}
