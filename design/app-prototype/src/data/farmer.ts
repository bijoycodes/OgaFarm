/* Farmer sample data (Emeka, Okafor Family Farm). Same as the web prototype
   (design/prototype/versions/v1-mvp/screens/farmer.tsx and v2-delivery-trust/screens/farmer.tsx). */
import type { IconName } from '@/ui/Icon';

/** Farmer's orders. `state` = which demo state the order screen opens in. */
export const FARMER_ORDERS: { id: string; buyer: string; buyerType: string; item: string; qty: string; total: number; status: string; when: string; how: 'Pickup' | 'Delivery'; state: string }[] = [
  { id: 'OGF-10452', buyer: 'Ngozi Eze', buyerType: 'Individual buyer', item: 'Fresh tomatoes (Roma)', qty: '60 kg', total: 21000, status: 'Assigned', when: 'Today, 11:52 am', how: 'Delivery', state: 'delivery · assigned' },
  { id: 'OGF-10421', buyer: 'Ngozi Eze', buyerType: 'Individual buyer', item: 'Fresh tomatoes (Roma)', qty: '20 kg', total: 7000, status: 'New', when: '12 min ago', how: 'Pickup', state: 'pickup · new' },
  { id: 'OGF-10418', buyer: 'FreshMart Foods', buyerType: 'Business buyer', item: 'Sweet peppers (tatashe)', qty: '40 Derica', total: 72000, status: 'Preparing', when: '2 h ago', how: 'Pickup', state: 'pickup · new' },
  { id: 'OGF-10409', buyer: 'Mama Put Kitchen', buyerType: 'Business buyer', item: 'Ugu (pumpkin leaves)', qty: '30 bunches', total: 18000, status: 'Ready for pickup', when: 'Today, 8:10 am', how: 'Pickup', state: 'pickup · ready' },
  { id: 'OGF-10377', buyer: 'Tunde Bakare', buyerType: 'Individual buyer', item: 'Ripe plantain', qty: '4 bunches', total: 18000, status: 'Collected', when: '20 Nov', how: 'Pickup', state: 'pickup · ready' }
];

export const FARMER_NOTES: { icon: IconName; title: string; body: string; when: string; unread: boolean; href?: string; state?: string }[] = [
  { icon: 'receipt', title: 'New order OGF-10421', body: 'Ngozi Eze paid ₦7,000 for 20 kg tomatoes. Confirm within 2 hours.', when: '12 min ago', unread: true, href: '/farmer/order', state: 'pickup · new' },
  { icon: 'truck', title: 'Transporter on the way', body: 'Ike Haulage arrives around 12:30 pm for order OGF-10452.', when: '40 min ago', unread: true, href: '/farmer/order', state: 'delivery · assigned' },
  { icon: 'star', title: 'New 5-star review', body: '“Very fresh tomatoes, well packed.” — Ngozi Eze', when: 'Yesterday', unread: false, href: '/farmer/reviews' },
  { icon: 'shield', title: 'Your farm is verified', body: 'The Verified badge now shows on your storefront.', when: 'Yesterday', unread: false },
  { icon: 'card', title: 'Annual plan active', body: 'Payment of ₦95,000 confirmed. Paid until 23 Nov 2027.', when: '23 Nov', unread: false, href: '/farmer/subscription', state: 'active' },
  { icon: 'clock', title: 'Stock check due', body: 'Yellow maize was last confirmed 6 days ago.', when: '22 Nov', unread: false, href: '/farmer/stock' }
];

export const REVIEWS: { who: string; stars: number; text: string; when: string }[] = [
  { who: 'Ngozi Eze', stars: 5, text: 'Very fresh tomatoes, well packed.', when: '24 Nov' },
  { who: 'FreshMart Foods', stars: 5, text: 'Consistent quality every week. Peppers were firm and clean.', when: '19 Nov' },
  { who: 'Chuka Obi', stars: 1, text: 'Terrible farm, never buy from them. They are thieves.', when: '17 Nov' },
  { who: 'Mama Put Kitchen', stars: 4, text: 'Good ugu. Pickup took a little long on Saturday.', when: '12 Nov' }
];

export const STORE_URL = 'farmoga.com/farm/okafor-family-farm';
export const UNITS = ['kg', 'crate', '50 kg bag', '100 kg bag', 'Derica', 'Mudu', 'paint bucket', 'basket', 'bunch', 'piece'];
export const SECTIONS = ['Crops & fresh produce', 'Livestock & animal products', 'Bulk produce & other goods'];
export const STORE_TABS = ['Vegetables', 'Fruits', 'Grains & cereals', 'Livestock & poultry', 'Processed & dried'];
export const AVAILABILITY = ['Available now', 'Expected soon', 'Recurring supply', 'Seasonal'];
export const FARM_TYPES = ['Mixed farm', 'Crop farm', 'Poultry farm', 'Livestock farm', 'Fish farm'];
