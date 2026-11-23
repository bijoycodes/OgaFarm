import type { VersionDef } from '../../src/shared/registry';

// Planned version. Screens are added to ./screens when this version is designed.
const v3: VersionDef = {
  id: 'v3',
  folder: 'v3-suppliers-b2b',
  name: "Suppliers and business buying",
  increment: 'I3',
  status: 'planned',
  summary: "Farm-input suppliers get their own storefront and catalogue. Businesses post buying requests, matching sellers are alerted and quote, and the business compares quotes and orders.",
  planned: [
      "Supplier sign-up and verification",
      "Public supplier storefront (/supplier/{slug})",
      "Supplier catalogue editor",
      "Enquiry and supplier quote",
      "Business buyer profile",
      "Post a buying request (RFQ)",
      "Seller demand alerts and response",
      "Quote comparison and order",
      "Updated: marketplace filters for farm inputs"
  ],
  screens: []
};
export default v3;
