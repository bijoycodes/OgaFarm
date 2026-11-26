/* User types and sample accounts. Same list as the web (design/prototype/src/shared/data/roles.ts).
   Sign-up creates one role; more roles are added later (business rules BR-ACC-01…05). */
import type { IconName } from '@/ui/Icon';

export type RoleKey = 'buyer' | 'farmer' | 'transporter' | 'supplier' | 'farmowner' | 'jobseeker' | 'consultant';
export type AppRole = 'buyer' | 'farmer' | 'transporter';

export interface RoleDef { key: RoleKey; label: string; icon: IconName; price: 'Free' | 'Paid plan'; what: string; needs: string; since: number }

/** Buyer first and default at sign-up. `since` = prototype version where the role is designed. */
export const ROLE_CATALOG: RoleDef[] = [
  { key: 'buyer', label: 'Buyer', icon: 'basket', price: 'Free', what: 'Buy for your home, shop, restaurant or business.', needs: 'Ready at once', since: 1 },
  { key: 'farmer', label: 'Farmer', icon: 'leaf', price: 'Paid plan', what: 'Sell produce, livestock and eggs from your own storefront.', needs: 'Plan, then farm verification', since: 1 },
  { key: 'transporter', label: 'Transporter', icon: 'truck', price: 'Free', what: 'Earn from farm deliveries with your vehicle.', needs: 'ID, utility bill and vehicle check', since: 2 },
  { key: 'supplier', label: 'Farm supplier', icon: 'plant', price: 'Paid plan', what: 'Sell seed, feed, fertiliser, chicks and equipment.', needs: 'Plan, then business verification', since: 3 },
  { key: 'farmowner', label: 'Farm owner', icon: 'users', price: 'Paid plan', what: 'Post farm jobs and hire workers.', needs: 'Plan, then farm verification', since: 5 },
  { key: 'jobseeker', label: 'Job seeker', icon: 'briefcase', price: 'Free', what: 'Find farm work. Your profile stays private.', needs: 'Availability profile', since: 5 },
  { key: 'consultant', label: 'Consultant', icon: 'seal', price: 'Free', what: 'Advise farmers on crops, livestock, soil or business.', needs: 'Credentials check', since: 5 }
];
export const roleDef = (k: string) => ROLE_CATALOG.find(r => r.key === k) ?? ROLE_CATALOG[0];

export const ROLE_HOME: Record<AppRole, string> = { buyer: '/buyer/browse', farmer: '/farmer/home', transporter: '/transporter/home' };
export const ROLE_INFO: Record<AppRole, { label: string; icon: IconName }> = {
  buyer: { label: 'Buyer', icon: 'basket' }, farmer: { label: 'Farmer', icon: 'leaf' }, transporter: { label: 'Transporter', icon: 'truck' }
};

/** Sample accounts. Each holds one or more roles; `sub` is the line under the name for that role. */
export const ACCOUNTS = {
  emeka: { name: 'Emeka Okafor', initials: 'EO', roles: ['farmer', 'buyer'] as AppRole[], sub: { farmer: 'Okafor Family Farm', buyer: 'Buyer · Issele-Uku' } as Partial<Record<AppRole, string>>, unread: { buyer: 1 } as Partial<Record<AppRole, number>> },
  ngozi: { name: 'Ngozi Eze', initials: 'NE', roles: ['buyer'] as AppRole[], sub: { buyer: 'Individual buyer · Asaba' } as Partial<Record<AppRole, string>>, unread: {} as Partial<Record<AppRole, number>> },
  sunday: { name: 'Sunday Ike', initials: 'SI', roles: ['transporter', 'buyer'] as AppRole[], sub: { transporter: 'Ike Haulage · Pickup truck', buyer: 'Buyer · Issele-Uku' } as Partial<Record<AppRole, string>>, unread: {} as Partial<Record<AppRole, number>> }
};
export type AccountKey = keyof typeof ACCOUNTS;
export const DEFAULT_ACCOUNT: Record<AppRole, AccountKey> = { buyer: 'ngozi', farmer: 'emeka', transporter: 'sunday' };
