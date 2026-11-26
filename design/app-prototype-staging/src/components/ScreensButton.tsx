/* Prototype only: a small floating button that opens the "Screens" sheet (jump to any screen, switch demo states, day/night). */
import { router, usePathname } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, size } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Press } from '@/ui/kit';
import { TABS } from './tabs-config';

export function ScreensButton() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const path = usePathname();
  if (path === '/screens' || path === '/role-menu') return null;
  // Main tabs: labelled pill above the tab bar. Detail screens: small round button, so it hides less of the page.
  const [, role, tab] = path.split('/');
  const inTabs = !!TABS[role as keyof typeof TABS]?.some(t => t.name === tab);
  const auth = role === 'auth';
  const detail = (!!TABS[role as keyof typeof TABS] && !inTabs) || auth;
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', right: detail ? 8 : 12, bottom: insets.bottom + (auth ? 236 : inTabs || detail ? 150 : 104) }}>
      <Press onPress={() => router.push('/screens')} label="Prototype: open the screens list" scaleTo={0.92}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 40, minWidth: 40, paddingHorizontal: detail ? 0 : 14, borderRadius: 20, backgroundColor: c.ink, opacity: detail ? 0.7 : 0.88,
          shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 }}>
        <Icon name="grid" size={16} color={c.bg} />
        {!detail && <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.xs, color: c.bg }}>Screens</Text>}
      </Press>
    </View>
  );
}
