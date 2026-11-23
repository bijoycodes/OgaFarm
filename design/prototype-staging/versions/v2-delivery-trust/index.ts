import type { VersionDef } from '../../src/shared/registry';
import { TransporterSignup, TransporterDashboard, TransporterRequests, TransporterBid, TransporterJob, TransporterProfile } from './screens/transporter';
import { Checkout, DeliveryQuotes, OrderStatus, ReceiveInspect, Dispute, LeaveReview } from './screens/buyer';
import { FarmerOrderDetail, FarmerReviews, ReviewAppeal } from './screens/farmer';
import { AdminTransporters, AdminTransporterReview, AdminDisputes, AdminDisputeCase, AdminReviews } from './screens/admin';

const v2: VersionDef = {
  id: 'v2',
  folder: 'v2-delivery-trust',
  name: 'Delivery and trust',
  increment: 'I2',
  status: 'built',
  summary: 'Orders can now be delivered, not only collected. Verified transporters quote, get assigned and prove delivery. Buyers check what arrives, can open a dispute, and leave reviews that are checked before they are published.',
  planned: [],
  screens: [
    // Transporter
    { id: 'transporter-signup', title: 'Transporter sign-up: vehicle and documents', spec: 'F12 · BR-TRN-02', role: 'transporter', group: 'Transporter', status: 'new', states: ['form', 'submitted'], Component: TransporterSignup },
    { id: 'transporter-dashboard', title: 'Transporter dashboard', spec: 'F12', role: 'transporter', group: 'Transporter', status: 'new', states: ['default', 'pending verification'], Component: TransporterDashboard },
    { id: 'transporter-requests', title: 'Delivery requests', spec: 'F12 · BR-TRN-01', role: 'transporter', group: 'Transporter', status: 'new', states: ['default', 'empty', 'not verified'], Component: TransporterRequests },
    { id: 'transporter-bid', title: 'Send a delivery quote', spec: 'F12 · BR-TRN-03', role: 'transporter', group: 'Transporter', status: 'new', states: ['default', 'too heavy', 'sent'], Component: TransporterBid },
    { id: 'transporter-job', title: 'Job: pickup, on the way, proof of delivery', spec: 'S10 · BR-TRN-05', role: 'transporter', group: 'Transporter', status: 'new', states: ['assigned', 'in transit', 'proof of delivery', 'delivered'], Component: TransporterJob },
    { id: 'transporter-profile', title: 'Public transporter profile', spec: 'F12 · BR-REV-05', role: 'visitor', group: 'Transporter', status: 'new', states: ['default', 'few reviews'], Component: TransporterProfile },
    // Buyer
    { id: 'checkout', title: 'Checkout with pickup or delivery', spec: 'S06 · BR-ORD-07', role: 'buyer', group: 'Buyer', status: 'updated', states: ['pickup', 'delivery', 'price changed'], Component: Checkout },
    { id: 'delivery-quotes', title: 'Compare and accept a delivery quote', spec: 'F12 · BR-TRN-01', role: 'buyer', group: 'Buyer', status: 'new', states: ['quotes ready', 'waiting'], Component: DeliveryQuotes },
    { id: 'order-status', title: 'Order status and delivery tracking', spec: 'S10 · BR-TRN-04', role: 'buyer', group: 'Buyer', status: 'updated', states: ['driver assigned', 'in transit', 'delivered', 'pickup order', 'confirming', 'failed'], Component: OrderStatus },
    { id: 'receive-inspect', title: 'Receive and check the order', spec: 'F21 · BR-ORD-08', role: 'buyer', group: 'Buyer', status: 'new', states: ['check', 'issue'], Component: ReceiveInspect },
    { id: 'dispute', title: 'Dispute case', spec: 'F21', role: 'buyer', group: 'Buyer', status: 'new', states: ['open', 'under review', 'resolved'], Component: Dispute },
    { id: 'leave-review', title: 'Leave a verified review', spec: 'F20 · BR-REV-01/02', role: 'buyer', group: 'Buyer', status: 'new', states: ['form', 'submitted'], Component: LeaveReview },
    // Farmer
    { id: 'farmer-order-detail', title: 'Order detail (delivery or pickup)', spec: 'F08 · BR-ORD-07', role: 'farmer', group: 'Farmer', status: 'updated', states: ['delivery · new', 'delivery · handed over', 'pickup · new', 'pickup · ready'], Component: FarmerOrderDetail },
    { id: 'farmer-reviews', title: 'Reviews of my farm', spec: 'F20 · BR-REV-03', role: 'farmer', group: 'Farmer', status: 'new', Component: FarmerReviews },
    { id: 'review-appeal', title: 'Request a review investigation', spec: 'F20 · BR-REV-04', role: 'farmer', group: 'Farmer', status: 'new', states: ['form', 'submitted'], Component: ReviewAppeal },
    // Admin
    { id: 'admin-transporters', title: 'Transporter verification queue', spec: 'F03 · BR-TRN-02', role: 'admin', group: 'Admin console', status: 'new', states: ['default', 'empty'], Component: AdminTransporters },
    { id: 'admin-transporter-review', title: 'Review a transporter', spec: 'F03 · BR-TRN-02', role: 'admin', group: 'Admin console', status: 'new', states: ['pending', 'approved'], Component: AdminTransporterReview },
    { id: 'admin-disputes', title: 'Disputes', spec: 'F21 · BR-ORD-08', role: 'admin', group: 'Admin console', status: 'new', states: ['default', 'empty'], Component: AdminDisputes },
    { id: 'admin-dispute-case', title: 'Decide a dispute', spec: 'F21', role: 'admin', group: 'Admin console', status: 'new', states: ['review', 'decided'], Component: AdminDisputeCase },
    { id: 'admin-reviews', title: 'Review moderation and investigations', spec: 'F20 · BR-REV-03/04', role: 'admin', group: 'Admin console', status: 'new', states: ['waiting for checks', 'investigations'], Component: AdminReviews }
  ]
};
export default v2;
