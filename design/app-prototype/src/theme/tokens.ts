/* OgaFarm design tokens for the app. Same values as the web prototype
   (design/prototype/src/shared/styles/tokens.css): soft "Organic Biophilic" greens + harvest gold,
   Lora headings + Nunito Sans body, 6/8/12 radius, calm motion. */

export const light = {
  primary: '#2D7A4E', primaryInk: '#22603D', primarySoft: '#E5F2E9', onPrimary: '#FFFFFF',
  leaf: '#7CC08F', harvest: '#A16207', harvestSoft: '#FCF1DA', harvestFill: '#E9BE6B', onHarvestFill: '#3F2B04',
  bg: '#F5FAF6', card: '#FFFFFF', sunken: '#EEF5F0', band: '#E4F1E8', band2: '#F8EEDB',
  ink: '#173D2A', ink2: '#345644', muted: '#536A5D', line: '#DCEADF', lineStrong: '#C3D8C9',
  overlay: 'rgba(18, 38, 27, 0.42)',
  ok: '#23703F', okBg: '#E4F3E8', warn: '#8A5509', warnBg: '#FCF1DA',
  danger: '#B42318', dangerBg: '#FCEBE8', info: '#285F92', infoBg: '#E7F0F8',
  tintCrop: '#E2F0DE', tintAnimal: '#FAEEDB', tintBulk: '#F1EADD', tintFish: '#DFEEF1',
  shadow: 'rgba(23, 61, 42, 0.16)'
};

export type Colors = typeof light;

export const dark: Colors = {
  primary: '#7FC79A', primaryInk: '#97D4AD', primarySoft: '#1D3528', onPrimary: '#0C1F14',
  leaf: '#5FA574', harvest: '#E8BE6E', harvestSoft: '#33291A', harvestFill: '#D9AE5C', onHarvestFill: '#2A1C03',
  bg: '#101A14', card: '#172420', sunken: '#13201A', band: '#1B2E23', band2: '#2A2519',
  ink: '#E3EEE6', ink2: '#C3D6C9', muted: '#9DB3A5', line: '#26382D', lineStrong: '#34493B',
  overlay: 'rgba(0, 0, 0, 0.58)',
  ok: '#8BD3A5', okBg: '#1A3324', warn: '#EBC27A', warnBg: '#33291A',
  danger: '#F4A397', dangerBg: '#3B1F1B', info: '#9CC5EE', infoBg: '#172A3B',
  tintCrop: '#1E3223', tintAnimal: '#332A1B', tintBulk: '#2C281F', tintFish: '#183034',
  shadow: 'rgba(0, 0, 0, 0.55)'
};

/** Spacing scale (4/8 grid) */
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64 } as const;

/** Corner radius: small, medium (controls), large (cards). Pills only for avatars/dots. */
export const radius = { sm: 6, md: 8, lg: 12, ctl: 8, full: 999 } as const;

/** Font families (loaded in app/_layout.tsx) */
export const fonts = {
  display: 'Lora_600SemiBold',
  displayMedium: 'Lora_500Medium',
  displayItalic: 'Lora_600SemiBold_Italic',
  body: 'NunitoSans_400Regular',
  bodySemi: 'NunitoSans_600SemiBold',
  bodyBold: 'NunitoSans_700Bold',
  bodyHeavy: 'NunitoSans_800ExtraBold'
} as const;

/** Type scale (px). Body text never below 14 on phones. */
export const size = { xs: 12, sm: 14, md: 16, lg: 18, xl: 22, x2: 28, x3: 36 } as const;

/** Motion: calm, matching the web after review (fast 200, normal 360, slow 560 ms). */
export const motion = { fast: 200, normal: 360, slow: 560, stagger: 70 } as const;

/** Minimum touch target */
export const tap = 44;

/** Top bar for inner screens (native stack header): same page colour and Lora title as the main screens. */
export const stackHeader = (c: Colors) => ({
  headerStyle: { backgroundColor: c.bg },
  headerShadowVisible: false,
  headerTintColor: c.primaryInk,
  headerBackButtonDisplayMode: 'minimal' as const,
  headerTitleStyle: { fontFamily: fonts.display, fontSize: size.lg + 1, color: c.ink },
  contentStyle: { backgroundColor: c.bg }
});
