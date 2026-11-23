import type { VersionDef } from '../../src/shared/registry';

// Planned version. Screens are added to ./screens when this version is designed.
const v6: VersionDef = {
  id: 'v6',
  folder: 'v6-launch',
  name: "Launch polish",
  increment: 'I6',
  status: 'planned',
  summary: "Mostly behind-the-scenes work: live payment and messaging providers, security and speed. Visible changes are small.",
  planned: [
      "Notification channel settings (SMS, WhatsApp, email, push)",
      "Language picker (English, Yorùbá, Igbo, Hausa)",
      "App store screenshots and store listing",
      "Final copy and accessibility pass on all screens"
  ],
  screens: []
};
export default v6;
