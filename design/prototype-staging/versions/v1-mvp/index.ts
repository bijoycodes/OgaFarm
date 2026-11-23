import type { VersionDef } from '../../src/shared/registry';
import { Landing, Pricing, Marketplace, FarmStorefront, ProductDetail, Unavailable } from './screens/public';
import { Signup, VerifyEmail, Signin, ChoosePlan, PaymentStatus, Verification } from './screens/onboarding';
import { FarmerDashboard, StorefrontEditor, Listings, ListingForm, FarmerOrders, FarmerOrderDetail, Subscription, FarmerNotifications } from './screens/farmer';
import { BuyerBrowse, Checkout, OrderStatus, BuyerOrders, BuyerNotifications, BuyerAccount } from './screens/buyer';
import { AdminLogin, AdminOverview, AdminVerification, AdminReview, AdminUsers, AdminPayments, AdminAudit } from './screens/admin';

const v1: VersionDef = {
  id: 'v1',
  folder: 'v1-mvp',
  name: 'MVP: Farmer sells, buyer buys',
  increment: 'I1',
  status: 'built',
  summary: 'A farmer signs up, pays, gets verified, builds a storefront and shares it on WhatsApp. A buyer opens the link, pays and collects the order. Admin verifies farms and checks payments.',
  planned: [],
  screens: [
    // Public pages
    { id: 'landing', title: 'Landing page and role selection', spec: 'S01', role: 'visitor', group: 'Public pages', status: 'new', Component: Landing },
    { id: 'pricing', title: 'Pricing', spec: 'S01 · F04', role: 'visitor', group: 'Public pages', status: 'new', Component: Pricing },
    { id: 'marketplace', title: 'Marketplace browse and search', spec: 'S06', role: 'visitor', group: 'Public pages', status: 'new', states: ['default', 'loading', 'empty', 'error'], Component: Marketplace },
    { id: 'farm-storefront', title: 'Public farm storefront', spec: 'S03', role: 'visitor', group: 'Public pages', status: 'new', states: ['default', 'loading'], Component: FarmStorefront },
    { id: 'product', title: 'Product detail', spec: 'S04', role: 'visitor', group: 'Public pages', status: 'new', states: ['default', 'sold out'], Component: ProductDetail },
    { id: 'unavailable', title: 'Unavailable or expired link', spec: 'S04 · BR-SHR-03', role: 'visitor', group: 'Public pages', status: 'new', Component: Unavailable },
    // Account and onboarding
    { id: 'signup', title: 'Sign up', spec: 'F02', role: 'visitor', group: 'Account and onboarding', status: 'new', states: ['default', 'error'], Component: Signup },
    { id: 'verify-email', title: 'Email code check', spec: 'F02 · BR-NOT-06', role: 'visitor', group: 'Account and onboarding', status: 'new', states: ['default', 'wrong code'], Component: VerifyEmail },
    { id: 'signin', title: 'Sign in', spec: 'F02 · BR-SHR-02', role: 'visitor', group: 'Account and onboarding', status: 'new', Component: Signin },
    { id: 'choose-plan', title: 'Choose a plan', spec: 'F04', role: 'farmer', group: 'Account and onboarding', status: 'new', Component: ChoosePlan },
    { id: 'payment-status', title: 'Plan payment status', spec: 'F04 · BR-PAY', role: 'farmer', group: 'Account and onboarding', status: 'new', states: ['pending', 'active', 'failed'], Component: PaymentStatus },
    { id: 'verification', title: 'Farm verification', spec: 'F03', role: 'farmer', group: 'Account and onboarding', status: 'new', states: ['form', 'submitted'], Component: Verification },
    // Farmer
    { id: 'farmer-dashboard', title: 'Farmer dashboard', spec: 'S02', role: 'farmer', group: 'Farmer', status: 'new', states: ['default', 'new account', 'unverified', 'expired'], Component: FarmerDashboard },
    { id: 'storefront-editor', title: 'Storefront editor', spec: 'S03', role: 'farmer', group: 'Farmer', status: 'new', states: ['default', 'slug taken'], Component: StorefrontEditor },
    { id: 'farmer-listings', title: 'My listings', spec: 'S04', role: 'farmer', group: 'Farmer', status: 'new', states: ['default', 'empty'], Component: Listings },
    { id: 'listing-form', title: 'Add or edit a product', spec: 'S04', role: 'farmer', group: 'Farmer', status: 'new', Component: ListingForm },
    { id: 'farmer-orders', title: 'Orders', spec: 'F08', role: 'farmer', group: 'Farmer', status: 'new', states: ['default', 'empty'], Component: FarmerOrders },
    { id: 'farmer-order-detail', title: 'Order detail (pickup)', spec: 'F08 · BR-ORD', role: 'farmer', group: 'Farmer', status: 'new', states: ['new', 'ready for pickup'], Component: FarmerOrderDetail },
    { id: 'subscription', title: 'Subscription and renewal', spec: 'F04', role: 'farmer', group: 'Farmer', status: 'new', states: ['active', 'expiring'], Component: Subscription },
    { id: 'notifications', title: 'Notifications', spec: 'S13', role: 'farmer', group: 'Farmer', status: 'new', states: ['default', 'empty'], Component: FarmerNotifications },
    // Buyer
    { id: 'buyer-browse', title: 'Browse (signed in)', spec: 'S06', role: 'buyer', group: 'Buyer', status: 'new', states: ['default', 'loading', 'empty', 'error'], Component: BuyerBrowse },
    { id: 'checkout', title: 'Checkout', spec: 'S06 · F08', role: 'buyer', group: 'Buyer', status: 'new', states: ['default', 'price changed'], Component: Checkout },
    { id: 'order-status', title: 'Order status and pickup code', spec: 'F08', role: 'buyer', group: 'Buyer', status: 'new', states: ['confirming', 'confirmed', 'failed'], Component: OrderStatus },
    { id: 'buyer-orders', title: 'My orders', spec: 'F08', role: 'buyer', group: 'Buyer', status: 'new', states: ['default', 'empty'], Component: BuyerOrders },
    { id: 'buyer-notifications', title: 'Notifications', spec: 'S13', role: 'buyer', group: 'Buyer', status: 'new', states: ['default', 'empty'], Component: BuyerNotifications },
    { id: 'buyer-account', title: 'Account', spec: 'F02', role: 'buyer', group: 'Buyer', status: 'new', Component: BuyerAccount },
    // Admin
    { id: 'admin-login', title: 'Admin sign in (2-step)', spec: 'F19', role: 'admin', group: 'Admin console', status: 'new', states: ['password', '2-step code'], Component: AdminLogin },
    { id: 'admin-overview', title: 'Admin overview', spec: 'F19', role: 'admin', group: 'Admin console', status: 'new', Component: AdminOverview },
    { id: 'admin-verification', title: 'Verification queue', spec: 'F03 · F19', role: 'admin', group: 'Admin console', status: 'new', states: ['default', 'empty'], Component: AdminVerification },
    { id: 'admin-review', title: 'Review a farm', spec: 'F03 · BR-NOT-05', role: 'admin', group: 'Admin console', status: 'new', states: ['pending', 'approved'], Component: AdminReview },
    { id: 'admin-users', title: 'Users', spec: 'F19', role: 'admin', group: 'Admin console', status: 'new', Component: AdminUsers },
    { id: 'admin-payments', title: 'Payments and subscriptions', spec: 'F04 · BR-PAY-05', role: 'admin', group: 'Admin console', status: 'new', Component: AdminPayments },
    { id: 'admin-audit', title: 'Audit log', spec: 'F19', role: 'admin', group: 'Admin console', status: 'new', Component: AdminAudit }
  ]
};
export default v1;
