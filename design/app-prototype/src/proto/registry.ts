/* Every app screen, for the floating "Screens" helper. `batch` = when it is designed:
   Batches not yet in BUILT are shown greyed out. */
export type Batch = 'A' | 'B' | 'C' | 'D';
export interface ScreenEntry { href: string; title: string; version: 'V1' | 'V2'; batch: Batch }
export interface ScreenGroup { title: string; screens: ScreenEntry[] }

export const BUILT: Batch[] = ['A', 'B', 'C', 'D'];

export const REGISTRY: ScreenGroup[] = [
  { title: 'Account and sign-in', screens: [
    { href: '/auth/welcome', title: 'Welcome', version: 'V1', batch: 'A' },
    { href: '/auth/signup', title: 'Sign up', version: 'V1', batch: 'A' },
    { href: '/auth/confirm-email', title: 'Confirm email (one time)', version: 'V1', batch: 'A' },
    { href: '/auth/signin', title: 'Sign in', version: 'V1', batch: 'A' },
    { href: '/auth/forgot-password', title: 'Forgot password', version: 'V1', batch: 'A' },
    { href: '/account', title: 'Account and settings (all roles)', version: 'V1', batch: 'A' }
  ] },
  { title: 'Buyer', screens: [
    { href: '/buyer/browse', title: 'Browse produce', version: 'V1', batch: 'B' },
    { href: '/buyer/product', title: 'Product', version: 'V1', batch: 'B' },
    { href: '/buyer/storefront', title: 'Farm storefront', version: 'V1', batch: 'B' },
    { href: '/buyer/checkout', title: 'Checkout (pickup or delivery)', version: 'V2', batch: 'B' },
    { href: '/buyer/quotes', title: 'Delivery quotes', version: 'V2', batch: 'B' },
    { href: '/buyer/order', title: 'Order status and tracking', version: 'V2', batch: 'B' },
    { href: '/buyer/receive', title: 'Check your order at delivery', version: 'V2', batch: 'B' },
    { href: '/buyer/dispute', title: 'Dispute case', version: 'V2', batch: 'B' },
    { href: '/buyer/review', title: 'Leave a review', version: 'V2', batch: 'B' },
    { href: '/buyer/orders', title: 'My orders', version: 'V1', batch: 'B' },
    { href: '/buyer/alerts', title: 'Notifications', version: 'V1', batch: 'B' },
    { href: '/buyer/add-role', title: 'Add another role', version: 'V1', batch: 'B' }
  ] },
  { title: 'Farmer', screens: [
    { href: '/farmer/home', title: 'Dashboard', version: 'V1', batch: 'C' },
    { href: '/farmer/plan', title: 'Choose a plan', version: 'V1', batch: 'C' },
    { href: '/farmer/payment', title: 'Payment status', version: 'V1', batch: 'C' },
    { href: '/farmer/verification', title: 'Verify your farm', version: 'V1', batch: 'C' },
    { href: '/farmer/farm', title: 'My farm', version: 'V1', batch: 'C' },
    { href: '/farmer/storefront-editor', title: 'Storefront editor', version: 'V1', batch: 'C' },
    { href: '/farmer/listings', title: 'Listings', version: 'V1', batch: 'C' },
    { href: '/farmer/product-form', title: 'Add or edit product', version: 'V1', batch: 'C' },
    { href: '/farmer/stock', title: 'Update stock (sheet)', version: 'V1', batch: 'C' },
    { href: '/farmer/orders', title: 'Orders', version: 'V1', batch: 'C' },
    { href: '/farmer/order', title: 'Order detail (pickup and delivery)', version: 'V2', batch: 'C' },
    { href: '/farmer/subscription', title: 'Subscription', version: 'V1', batch: 'C' },
    { href: '/farmer/reviews', title: 'Reviews', version: 'V2', batch: 'C' },
    { href: '/farmer/review-appeal', title: 'Ask us to check a review', version: 'V2', batch: 'C' },
    { href: '/farmer/alerts', title: 'Notifications', version: 'V1', batch: 'C' }
  ] },
  { title: 'Transporter', screens: [
    { href: '/transporter/signup', title: 'Sign-up: vehicle and documents', version: 'V2', batch: 'D' },
    { href: '/transporter/home', title: 'Dashboard', version: 'V2', batch: 'D' },
    { href: '/transporter/requests', title: 'Delivery requests', version: 'V2', batch: 'D' },
    { href: '/transporter/bid', title: 'Send a quote', version: 'V2', batch: 'D' },
    { href: '/transporter/jobs', title: 'My jobs', version: 'V2', batch: 'D' },
    { href: '/transporter/job', title: 'Job and proof of delivery', version: 'V2', batch: 'D' },
    { href: '/transporter/profile', title: 'Profile', version: 'V2', batch: 'D' },
    { href: '/transporter/alerts', title: 'Notifications', version: 'V2', batch: 'D' }
  ] }
];
