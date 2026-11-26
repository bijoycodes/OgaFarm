/* V2 delivery and trust sample data, plus buyer lists. Same as the web prototype
   (design/prototype/versions/v2-delivery-trust/parts.tsx and v1-mvp/screens/buyer.tsx). */
import type { IconName } from '@/ui/Icon';

export interface Transporter {
  id: string; name: string; person: string; initials: string; vehicle: string; plate: string; phone: string;
  payload: string; base: string; rating: number; reviews: number; jobs: number; verified: boolean;
}

export const TRANSPORTERS: Record<'ike' | 'okada' | 'cold', Transporter> = {
  ike: { id: 'ike', name: 'Ike Haulage', person: 'Sunday Ike', initials: 'IH', vehicle: 'Pickup truck', plate: 'AGB 482 KT', phone: '+2348024419087', payload: '1,500 kg', base: 'Issele-Uku, Delta', rating: 4.7, reviews: 31, jobs: 58, verified: true },
  okada: { id: 'okada', name: 'Tega Express', person: 'Tega Omoru', initials: 'TE', vehicle: 'Motorcycle', plate: 'ASB 117 QA', phone: '+2348031110000', payload: '80 kg', base: 'Asaba, Delta', rating: 4.5, reviews: 12, jobs: 27, verified: true },
  cold: { id: 'cold', name: 'Agbor Cold Van', person: 'Peter Nwachukwu', initials: 'AC', vehicle: 'Refrigerated van', plate: 'AGR 905 LM', phone: '+2348032220000', payload: '2,000 kg', base: 'Agbor, Delta', rating: 4.9, reviews: 4, jobs: 9, verified: true }
};

/** Delivery quotes for the sample order: transporter, price, timing, tag. */
export const QUOTES: { t: Transporter; price: number; when: string; tag?: string }[] = [
  { t: TRANSPORTERS.ike, price: 6500, when: 'Pickup 12:30 pm · arrives by 3:30 pm', tag: 'Best value' },
  { t: TRANSPORTERS.okada, price: 4000, when: 'Pickup 1:00 pm · arrives by 2:30 pm · 2 trips needed', tag: 'Lowest price' },
  { t: TRANSPORTERS.cold, price: 9000, when: 'Tomorrow · pickup 8:00 am · arrives by 10:00 am · refrigerated' }
];

/** The delivery order used across V2 screens. */
export const DELIVERY = {
  id: 'OGF-10452', item: 'Fresh tomatoes (Roma)', qty: '60 kg', qtyN: 60, unit: 350, subtotal: 21000,
  farm: 'Okafor Family Farm', farmer: 'Emeka Okafor', pickup: 'Farm gate, Issele-Uku',
  buyer: 'Ngozi Eze', dropArea: 'Okpanam Road, Asaba', dropFull: '14 Okpanam Road, near Shoprite, Asaba',
  distance: '38 km', fee: 6500, code: '7316', packing: '3 baskets'
};

/** Buyer's orders. `state` = which demo state the order screen opens in. */
export const BUYER_ORDERS: { id: string; item: string; farm: string; total: number; status: string; how: 'Delivery' | 'Pickup'; state: string }[] = [
  { id: 'OGF-10452', item: 'Fresh tomatoes (Roma) · 60 kg', farm: 'Okafor Family Farm', total: 27500, status: 'In transit', how: 'Delivery', state: 'in transit' },
  { id: 'OGF-10421', item: 'Fresh tomatoes (Roma) · 20 kg', farm: 'Okafor Family Farm', total: 7000, status: 'Preparing', how: 'Pickup', state: 'pickup order' },
  { id: 'OGF-10356', item: 'Layer eggs · 3 crates', farm: 'Delta Poultry', total: 15600, status: 'Ready for pickup', how: 'Pickup', state: 'pickup order' },
  { id: 'OGF-10288', item: 'Live catfish · 8 kg', farm: 'Ughelli Fish Farm', total: 22400, status: 'Delivered', how: 'Delivery', state: 'delivered' }
];

export const BUYER_NOTES: { icon: IconName; title: string; body: string; when: string; unread: boolean; href?: string; state?: string }[] = [
  { icon: 'truck', title: 'Your order is on the way', body: 'Ike Haulage picked up 60 kg of tomatoes. Expected by 3:30 pm.', when: '2 min ago', unread: true, href: '/buyer/order', state: 'in transit' },
  { icon: 'coins', title: '3 delivery quotes received', body: 'Compare prices for order OGF-10452 and pick one.', when: '1 h ago', unread: true, href: '/buyer/quotes', state: 'ready' },
  { icon: 'check', title: 'Order OGF-10421 confirmed', body: 'Okafor Family Farm is preparing your tomatoes.', when: 'Today, 9:05 am', unread: false, href: '/buyer/order', state: 'pickup order' },
  { icon: 'receipt', title: 'Payment received', body: '₦7,000 confirmed. Your pickup code is 4821.', when: 'Today, 9:00 am', unread: false },
  { icon: 'star', title: 'How was your catfish?', body: 'Rate Ughelli Fish Farm and the delivery.', when: '20 Nov', unread: false, href: '/buyer/review', state: 'default' }
];

/** Marketplace categories (multi-select) with sample counts. */
export const CATS: [string, IconName][] = [['Vegetables', 'leaf'], ['Fruits', 'heart'], ['Eggs & poultry', 'egg'], ['Fish', 'fish'], ['Grains & cereals', 'plant'], ['Processed foods', 'box']];
export const AVAIL: [string, string][] = [['Available now', 'Available now'], ['Expected soon', 'Expected soon'], ['Recurring', 'Recurring supply'], ['Seasonal', 'Seasonal']];
export const RADIUS = ['10 km', '25 km', '50 km', 'State'] as const;
export const SORTS = ['Nearest first', 'Lowest price', 'Recently confirmed'] as const;
