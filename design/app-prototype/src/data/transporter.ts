/* Transporter sample data (Sunday Ike, Ike Haulage). Same as the web prototype
   (design/prototype/versions/v2-delivery-trust/screens/transporter.tsx). */
import type { IconName } from '@/ui/Icon';
import { DELIVERY as D } from './delivery';

export interface Request { id: string; from: string; to: string; cargo: string; when: string; dist: string; quotes: string; perishable: boolean; today: boolean; fits: boolean; state: string }

export const REQUESTS: Request[] = [
  { id: 'DR-3301', from: 'Issele-Uku', to: 'Asaba', cargo: `${D.item} · ${D.qty} · ${D.packing}`, when: 'Today, by 4:00 pm', dist: D.distance, quotes: '3 quotes so far', perishable: true, today: true, fits: true, state: 'default' },
  { id: 'DR-3298', from: 'Agbor', to: 'Issele-Uku', cargo: 'Layer eggs · 10 crates', when: 'Tomorrow, morning', dist: '52 km', quotes: '1 quote so far', perishable: true, today: false, fits: true, state: 'default' },
  { id: 'DR-3290', from: 'Ibusa', to: 'Asaba', cargo: 'Yellow maize · 24 × 100 kg bags', when: 'Fri 28 Nov', dist: '21 km', quotes: 'No quotes yet', perishable: false, today: false, fits: false, state: 'too heavy' },
  { id: 'DR-3287', from: 'Issele-Uku', to: 'Ogwashi-Uku', cargo: 'Ripe plantain · 30 bunches', when: 'Sat 29 Nov', dist: '17 km', quotes: '2 quotes so far', perishable: false, today: false, fits: true, state: 'default' }
];

/** Jobs: the active one plus finished ones. `state` = which demo state the job screen opens in. */
export const JOBS: { id: string; route: string; cargo: string; when: string; price: number; status: string; state: string }[] = [
  { id: D.id, route: 'Issele-Uku → Asaba', cargo: `${D.item} · ${D.qty}`, when: 'Pickup today by 2:00 pm', price: D.fee, status: 'Assigned', state: 'assigned' },
  { id: 'OGF-10288', route: 'Ughelli → Asaba', cargo: 'Live catfish · 8 kg', when: '20 Nov', price: 9000, status: 'Delivered', state: 'delivered' },
  { id: 'OGF-10241', route: 'Issele-Uku → Agbor', cargo: 'Sweet peppers · 40 Derica', when: '18 Nov', price: 7500, status: 'Delivered', state: 'delivered' },
  { id: 'OGF-10199', route: 'Agbor → Asaba', cargo: 'Layer eggs · 12 crates', when: '15 Nov', price: 6000, status: 'Delivered', state: 'delivered' }
];

export const TRANSPORTER_NOTES: { icon: IconName; title: string; body: string; when: string; unread: boolean; href?: string; state?: string }[] = [
  { icon: 'check', title: 'You got the job', body: 'Ngozi Eze accepted your ₦6,500 quote for 60 kg of tomatoes. Pickup today by 2:00 pm.', when: '15 min ago', unread: true, href: '/transporter/job', state: 'assigned' },
  { icon: 'route', title: 'New request near you', body: 'Agbor → Issele-Uku · Layer eggs · 10 crates · tomorrow.', when: '1 h ago', unread: true, href: '/transporter/bid?id=DR-3298', state: 'default' },
  { icon: 'star', title: 'New 5-star review', body: '“Arrived before time and the tomatoes were well covered.”', when: '20 Nov', unread: false, href: '/transporter/profile' },
  { icon: 'shield', title: 'You are verified', body: 'You can now send quotes and be assigned to deliveries.', when: '2 Oct', unread: false }
];

export const PROFILE_REVIEWS: { who: string; stars: number; text: string; when: string }[] = [
  { who: 'Ngozi Eze', stars: 5, text: 'Arrived before time and the tomatoes were well covered.', when: '20 Nov' },
  { who: 'Mama Put Kitchen', stars: 4, text: 'Good driver. Called ahead when he was close.', when: '14 Nov' },
  { who: 'Okafor Family Farm', stars: 5, text: 'Careful with our baskets. We use him every week.', when: '9 Nov' }
];

export const VEHICLES: [string, IconName][] = [['Motorcycle', 'route'], ['Keke (tricycle)', 'route'], ['Pickup truck', 'truck'], ['Small truck', 'truck'], ['Large truck', 'truck'], ['Refrigerated van', 'truck'], ['Other', 'box']];
export const AREAS = ['Aniocha North', 'Oshimili South (Asaba)', 'Ika South (Agbor)', 'Oshimili North (Ibusa)', 'Ughelli North'];
