import type { VersionDef } from '../../src/shared/registry';

// Planned version. Screens are added to ./screens when this version is designed.
const v4: VersionDef = {
  id: 'v4',
  folder: 'v4-group-rescue',
  name: "Group buying and rescue produce",
  increment: 'I4',
  status: 'planned',
  summary: "Buyers organise group orders through a shared link and each member pays their own share. Farmers sell imperfect or urgent produce at a fixed price.",
  planned: [
      "Create a group order",
      "Shared group page (/group/{id})",
      "Join a group and pay your share",
      "Group funding progress and deadline",
      "Farmer approves the pickup point",
      "Cancellation and refunds",
      "Rescue produce listing with condition disclosure",
      "Rescue fixed-price checkout"
  ],
  screens: []
};
export default v4;
