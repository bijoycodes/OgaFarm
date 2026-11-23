import type { VersionDef } from '../../src/shared/registry';

// Planned version. Screens are added to ./screens when this version is designed.
const v5: VersionDef = {
  id: 'v5',
  folder: 'v5-jobs-consultants-markets',
  name: "Jobs, consultants and markets",
  increment: 'I5',
  status: 'planned',
  summary: "Farm jobs with private worker matching, a verified consultant directory, the local market directory and messaging.",
  planned: [
      "Job board and job page (/jobs/{id})",
      "Post a farm job (paid employers)",
      "Private worker profile",
      "Anonymous matches and contact approval",
      "Consultant application",
      "Consultant directory",
      "Local market directory",
      "Suggest or correct a market",
      "Admin: market and job moderation",
      "Messages between buyers and sellers",
      "Notification preferences"
  ],
  screens: []
};
export default v5;
