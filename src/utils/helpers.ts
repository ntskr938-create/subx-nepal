import { Order, Product } from '../types';

export const WHATSAPP_NUMBER = '9765617156';
export const WHATSAPP_COUNTRY_CODE = '977';
export const FULL_WHATSAPP_PHONE = '9779765617156';

export function formatNpr(amount: number): string {
  return `NPR ${amount.toLocaleString('en-IN')}`;
}

export function generateOrderWhatsAppUrl(order: Partial<Order>, productTitle?: string): string {
  const text = `*New Subscription Order - SubX Nepal* 🇳🇵
------------------------------------
*Order ID:* ${order.id || 'Pending'}
*Product:* ${productTitle || order.productTitle || 'Digital Subscription'}
*Duration:* ${order.planDuration || '1 Month'}
*Amount:* NPR ${order.amountNpr || 0}
------------------------------------
*Customer Name:* ${order.customerName || ''}
*Phone:* ${order.customerPhone || ''}
*Email:* ${order.customerEmail || ''}
*Payment Method:* ${(order.paymentMethod || 'esewa').toUpperCase()}
*Transaction / Ref ID:* ${order.paymentRefId || 'Not provided'}
------------------------------------
I have completed the payment. Please activate my subscription!`;

  return `https://wa.me/${FULL_WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

export function generateGeneralWhatsAppUrl(customMessage?: string): string {
  const message = customMessage || "I want to buy a subscription from SubX Nepal.";
  return `https://wa.me/${FULL_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function generateCustomerWhatsAppUpdateUrl(phone: string, orderId: string, status: string): string {
  const cleanedPhone = phone.replace(/\D/g, '');
  const targetPhone = cleanedPhone.startsWith('977') ? cleanedPhone : `977${cleanedPhone}`;
  
  const text = `Hello from SubX Nepal! 🇳🇵
Your Order *${orderId}* status has been updated to: *${status}*.
Thank you for choosing SubX Nepal! If you need any assistance, feel free to reply to this chat.`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

// LocalStorage Persistence Helpers
const LOCAL_STORAGE_PRODUCTS_KEY = 'subx_products_v1';
const LOCAL_STORAGE_ORDERS_KEY = 'subx_orders_v1';

export function getSavedProducts(defaultProducts: Product[]): Product[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load products from storage', e);
  }
  return defaultProducts;
}

export function saveProducts(products: Product[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products to storage', e);
  }
}

export function getSavedOrders(defaultOrders: Order[]): Order[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load orders from storage', e);
  }
  return defaultOrders;
}

export function saveOrders(orders: Order[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to storage', e);
  }
}
