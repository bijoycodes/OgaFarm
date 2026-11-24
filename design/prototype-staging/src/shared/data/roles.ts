/* Every user type, in one place. Buyer comes first and is the default choice at sign-up. Sign-up (pick one) and "Add a role" (add more later) both read this list.
   `since` = first prototype version where the role is designed; later ones show as "coming". */
export type RoleKey = 'farmer' | 'buyer' | 'transporter' | 'supplier' | 'farmowner' | 'jobseeker' | 'consultant';

export interface RoleDef {
  key: RoleKey; label: string; verb: string; icon: string; price: 'Free' | 'Paid plan';
  what: string; needs: string; since: number;
  next?: string;            // where sign-up continues after the email code
}

export const ROLE_CATALOG: RoleDef[] = [
  { key: 'buyer', label: 'Buyer', verb: 'Buy produce', icon: 'sack', price: 'Free', what: 'Buy for your home, shop, restaurant or business.', needs: 'Ready at once', since: 1, next: 'buyer-browse' },
  { key: 'farmer', label: 'Farmer', verb: 'Sell my produce', icon: 'leaf', price: 'Paid plan', what: 'Sell produce, livestock and eggs from your own storefront.', needs: 'Plan, then farm verification', since: 1, next: 'choose-plan' },
  { key: 'transporter', label: 'Transporter', verb: 'Deliver for farms', icon: 'truck', price: 'Free', what: 'Earn from farm deliveries with your vehicle.', needs: 'ID, utility bill and vehicle check', since: 2, next: 'transporter-signup' },
  { key: 'supplier', label: 'Farm supplier', verb: 'Sell farm inputs', icon: 'seed', price: 'Paid plan', what: 'Sell seed, feed, fertiliser, chicks and equipment.', needs: 'Plan, then business verification', since: 3 },
  { key: 'farmowner', label: 'Farm owner', verb: 'Hire farm workers', icon: 'users', price: 'Paid plan', what: 'Post farm jobs and hire workers.', needs: 'Plan, then farm verification', since: 5 },
  { key: 'jobseeker', label: 'Job seeker', verb: 'Find farm work', icon: 'briefcase', price: 'Free', what: 'Find farm work. Your profile stays private.', needs: 'Availability profile', since: 5 },
  { key: 'consultant', label: 'Consultant', verb: 'Offer expert advice', icon: 'seal', price: 'Free', what: 'Advise farmers on crops, livestock, soil or business.', needs: 'Credentials check', since: 5 }
];

export const roleDef = (k: string) => ROLE_CATALOG.find(r => r.key === k) ?? ROLE_CATALOG[0];
