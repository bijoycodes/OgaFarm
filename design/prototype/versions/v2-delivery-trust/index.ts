import type { VersionDef } from '../../src/shared/registry';

// Planned version. Screens are added to ./screens when this version is designed.
const v2: VersionDef = {
  id: 'v2',
  folder: 'v2-delivery-trust',
  name: "Delivery and trust",
  increment: 'I2',
  status: 'planned',
  summary: "Orders can now be delivered, not only collected. Verified transporters quote, get assigned and prove delivery. Buyers and farmers can inspect, open disputes and leave reviews.",
  planned: [
      "Transporter sign-up, vehicle and documents",
      "Transporter public profile",
      "Admin: transporter verification",
      "Buyer: request delivery quotes at checkout",
      "Transporter: quote requests and bids",
      "Buyer: compare and accept a delivery quote",
      "Assignment with driver details",
      "Delivery tracking timeline",
      "Proof of delivery (receiver code, quantity, condition)",
      "Receive and inspect an order",
      "Open and follow a dispute",
      "Admin: dispute cases",
      "Leave a verified review",
      "Request a review investigation",
      "Admin: review moderation",
      "Updated: checkout, order detail and order status with delivery"
  ],
  screens: []
};
export default v2;
