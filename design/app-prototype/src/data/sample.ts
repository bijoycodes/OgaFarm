/* Sample data for the app prototype. Same fictional farms, products and orders as the web prototype
   (design/prototype/src/shared/data/sample.ts). Photos: assets/images/photos (see CREDITS.md). */
import type { ImageSourcePropType } from 'react-native';

export type Kind = 'crop' | 'animal' | 'bulk' | 'fish';

export interface Farm {
  slug: string; name: string; owner: string; initials: string; place: string;
  verified: boolean; rating: number; reviews: number; since?: string; hours?: string; type?: string;
}
export interface Product {
  id: string; name: string; farm: keyof typeof FARMS; kind: Kind; price: number; unit: string;
  qty: string; min: number; cat: string; status: string; confirmed: string; stale?: boolean; img: ImageSourcePropType;
}
export interface Order {
  id: string; buyer: string; buyerType: string; item: string; qty: string; total: number; status: string; when: string; code: string;
}

export const PHOTOS = {
  tomatoes: require('@/assets/images/photos/tomatoes.jpg'),
  eggs: require('@/assets/images/photos/eggs.jpg'),
  garri: require('@/assets/images/photos/garri.jpg'),
  catfish: require('@/assets/images/photos/catfish.jpg'),
  peppers: require('@/assets/images/photos/peppers.jpg'),
  plantain: require('@/assets/images/photos/plantain.jpg'),
  maize: require('@/assets/images/photos/maize.jpg'),
  ugu: require('@/assets/images/photos/ugu.jpg'),
  farmCover: require('@/assets/images/photos/farm-cover.jpg'),
  truckCover: require('@/assets/images/photos/truck-cover.jpg'),
  market: require('@/assets/images/photos/market-hero.jpg')
};

export const FARMS = {
  okafor: { slug: 'okafor-family-farm', name: 'Okafor Family Farm', owner: 'Emeka Okafor', initials: 'OF', place: 'Issele-Uku, Delta State', verified: true, rating: 4.8, reviews: 23, since: 'March 2026', hours: 'Mon–Sat · 7:00 am – 5:00 pm', type: 'Mixed farm' },
  deltapoultry: { slug: 'delta-poultry', name: 'Delta Poultry', owner: 'Grace Ufuoma', initials: 'DP', place: 'Agbor, Delta State', verified: true, rating: 4.6, reviews: 41 },
  asabagrain: { slug: 'asaba-grain-hub', name: 'Asaba Grain Hub', owner: 'Ibrahim Musa', initials: 'AG', place: 'Asaba, Delta State', verified: false, rating: 4.4, reviews: 9 },
  ughellifish: { slug: 'ughelli-fish-farm', name: 'Ughelli Fish Farm', owner: 'Ese Oghene', initials: 'UF', place: 'Ughelli, Delta State', verified: true, rating: 4.9, reviews: 17 }
} satisfies Record<string, Farm>;

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Fresh tomatoes (Roma)', farm: 'okafor', kind: 'crop', price: 350, unit: 'kg', qty: '2,000 kg', min: 20, cat: 'Vegetables', status: 'Available now', confirmed: 'Today, 9:20 am', img: PHOTOS.tomatoes },
  { id: 'p2', name: 'Layer eggs', farm: 'deltapoultry', kind: 'animal', price: 5200, unit: 'crate', qty: '120 crates', min: 2, cat: 'Eggs & poultry', status: 'Recurring supply', confirmed: 'Yesterday', img: PHOTOS.eggs },
  { id: 'p3', name: 'Yellow garri', farm: 'asabagrain', kind: 'bulk', price: 42000, unit: '50 kg bag', qty: '80 bags', min: 1, cat: 'Processed foods', status: 'Available now', confirmed: '2 days ago', img: PHOTOS.garri },
  { id: 'p4', name: 'Live catfish', farm: 'ughellifish', kind: 'fish', price: 2800, unit: 'kg', qty: '600 kg', min: 5, cat: 'Fish', status: 'Available now', confirmed: 'Today, 7:45 am', img: PHOTOS.catfish },
  { id: 'p5', name: 'Sweet peppers (tatashe)', farm: 'okafor', kind: 'crop', price: 1800, unit: 'Derica', qty: '300 Derica', min: 5, cat: 'Vegetables', status: 'Available now', confirmed: 'Today, 9:20 am', img: PHOTOS.peppers },
  { id: 'p6', name: 'Ripe plantain', farm: 'okafor', kind: 'crop', price: 4500, unit: 'bunch', qty: '90 bunches', min: 1, cat: 'Fruits', status: 'Expected soon', confirmed: '3 days ago', img: PHOTOS.plantain },
  { id: 'p7', name: 'Yellow maize', farm: 'okafor', kind: 'bulk', price: 38000, unit: '100 kg bag', qty: '25 bags', min: 1, cat: 'Grains & cereals', status: 'Seasonal', confirmed: '6 days ago', stale: true, img: PHOTOS.maize },
  { id: 'p8', name: 'Ugu (pumpkin leaves)', farm: 'okafor', kind: 'crop', price: 600, unit: 'bunch', qty: '150 bunches', min: 10, cat: 'Vegetables', status: 'Available now', confirmed: 'Today, 9:20 am', img: PHOTOS.ugu }
];

export const ORDERS: Order[] = [
  { id: 'OGF-10421', buyer: 'Ngozi Eze', buyerType: 'Individual buyer', item: 'Fresh tomatoes (Roma)', qty: '20 kg', total: 7000, status: 'New', when: '12 min ago', code: '4821' },
  { id: 'OGF-10418', buyer: 'FreshMart Foods', buyerType: 'Business buyer', item: 'Sweet peppers (tatashe)', qty: '40 Derica', total: 72000, status: 'Preparing', when: '2 h ago', code: '1907' },
  { id: 'OGF-10409', buyer: 'Mama Put Kitchen', buyerType: 'Business buyer', item: 'Ugu (pumpkin leaves)', qty: '30 bunches', total: 18000, status: 'Ready for pickup', when: 'Today, 8:10 am', code: '5530' },
  { id: 'OGF-10377', buyer: 'Tunde Bakare', buyerType: 'Individual buyer', item: 'Ripe plantain', qty: '4 bunches', total: 18000, status: 'Collected', when: '20 Nov', code: '' }
];

export const PLANS = [
  { key: 'q', name: 'Quarterly', price: 30000, per: '3 months', monthly: '₦10,000 / month', features: ['Storefront with five category tabs', 'Unlimited product listings', 'Buyer orders and enquiries', 'Order tracking'] },
  { key: 'h', name: 'Half-yearly', price: 54000, per: '6 months', monthly: '₦9,000 / month', popular: true, features: ['Everything in Quarterly', 'Weekly activity report', 'Sales history summary', 'Renewal reminders'] },
  { key: 'a', name: 'Annual', price: 95000, per: '12 months', monthly: 'about ₦7,917 / month', features: ['Everything in Half-yearly', 'Monthly summary report', 'Exportable records', 'Best value'] }
];

export const naira = (n: number) => '₦' + n.toLocaleString('en-NG');
export const initials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2);

/* Quantity wording: "20 kg", "2 crates", "3 bunches", "1 × 50 kg bag". */
const PLURAL: Record<string, string> = { crate: 'crates', bunch: 'bunches', piece: 'pieces', basket: 'baskets', 'paint bucket': 'paint buckets' };
/** Unit word for a count, short enough for the quantity stepper ("kg", "crates", "bags"). */
export const unitFor = (unit: string, n: number) => /^\d/.test(unit) ? (n === 1 ? 'bag' : 'bags') : n === 1 ? unit : PLURAL[unit] ?? unit;
/** Full quantity text for summaries and labels. */
export const qtyText = (n: number, unit: string) => /^\d/.test(unit) ? `${n} × ${unit}` : `${n} ${unitFor(unit, n)}`;
