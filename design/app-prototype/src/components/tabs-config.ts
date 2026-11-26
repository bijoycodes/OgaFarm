/* Bottom tabs per role. `sf` = iPhone SF Symbol, `md` = Android Material icon, `icon` = web/Phosphor. */
import type { AppRole } from '@/data/roles';
import type { IconName } from '@/ui/Icon';

export interface TabDef { name: string; label: string; sf: string; md: string; icon: IconName; badge?: string }

export const TABS: Record<AppRole, TabDef[]> = {
  buyer: [
    { name: 'browse', label: 'Browse', sf: 'magnifyingglass', md: 'search', icon: 'search' },
    { name: 'orders', label: 'Orders', sf: 'shippingbox', md: 'receipt_long', icon: 'receipt' },
    { name: 'alerts', label: 'Alerts', sf: 'bell', md: 'notifications', icon: 'bell', badge: '2' }
  ],
  farmer: [
    { name: 'home', label: 'Home', sf: 'house', md: 'home', icon: 'home' },
    { name: 'farm', label: 'My farm', sf: 'storefront', md: 'storefront', icon: 'store' },
    { name: 'listings', label: 'Listings', sf: 'square.grid.2x2', md: 'grid_view', icon: 'grid' },
    { name: 'orders', label: 'Orders', sf: 'shippingbox', md: 'receipt_long', icon: 'receipt', badge: '1' },
    { name: 'alerts', label: 'Alerts', sf: 'bell', md: 'notifications', icon: 'bell', badge: '2' }
  ],
  transporter: [
    { name: 'home', label: 'Home', sf: 'house', md: 'home', icon: 'home' },
    { name: 'requests', label: 'Requests', sf: 'list.bullet', md: 'list', icon: 'list', badge: '4' },
    { name: 'jobs', label: 'Jobs', sf: 'truck.box', md: 'local_shipping', icon: 'truck' },
    { name: 'alerts', label: 'Alerts', sf: 'bell', md: 'notifications', icon: 'bell', badge: '2' },
    { name: 'profile', label: 'Profile', sf: 'checkmark.seal', md: 'verified', icon: 'seal' }
  ]
};
