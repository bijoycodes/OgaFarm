/* OgaFarm logo, from docs/reference/images/ogafarm_logo.png, in three cuts that keep their real proportions:
   full = emblem + name + tagline (stacked), mark = emblem only, name = "OgaFarm" lettering only.
   Night mode uses a version where the dark-green lettering is lightened so it stays readable. */
import { Image } from 'expo-image';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

const FILES = {
  full: { light: require('@/assets/images/logo.png'), dark: require('@/assets/images/logo-dark.png'), ratio: 900 / 856 },
  mark: { light: require('@/assets/images/logo-mark.png'), dark: require('@/assets/images/logo-mark.png'), ratio: 512 / 448 },
  name: { light: require('@/assets/images/logo-name.png'), dark: require('@/assets/images/logo-name-dark.png'), ratio: 900 / 206 }
};

/** Give a height; the width follows the logo's own shape. */
export function Logo({ variant = 'full', height, style }: { variant?: keyof typeof FILES; height: number; style?: StyleProp<ViewStyle> }) {
  const { scheme } = useTheme();
  const f = FILES[variant];
  return (
    <View style={[{ height, width: Math.round(height * f.ratio) }, style]} accessible accessibilityRole="image" accessibilityLabel="OgaFarm">
      <Image source={scheme === 'dark' ? f.dark : f.light} style={{ flex: 1 }} contentFit="contain" />
    </View>
  );
}

/** Horizontal lockup for bars and chips: emblem + "OgaFarm" lettering. */
export function LogoLockup({ height = 32 }: { height?: number }) {
  return (
    <View accessible accessibilityRole="image" accessibilityLabel="OgaFarm" style={{ flexDirection: 'row', alignItems: 'center', gap: Math.round(height * 0.22) }}>
      <Logo variant="mark" height={height} />
      <Logo variant="name" height={Math.round(height * 0.62)} />
    </View>
  );
}
