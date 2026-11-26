/* Welcome: first screen of the app. Brand first — the full OgaFarm logo on the page itself (no photo, no box),
   then the promise, what OgaFarm is for (Buy · Sell · Deliver), the ways in, and why to trust it. */
import { router } from 'expo-router';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size, space, tap } from '@/theme/tokens';
import { Icon, type IconName } from '@/ui/Icon';
import { Button, Press, Rise } from '@/ui/kit';
import { Logo } from '@/ui/Logo';
import { MAX_W } from '@/ui/screen';

const ROLES: [IconName, string, string][] = [
  ['basket', 'Buy', 'Fresh from farms'],
  ['leaf', 'Sell', 'Your storefront'],
  ['truck', 'Deliver', 'Earn on trips']
];
const TRUST: [IconName, string][] = [['shield', 'Verified farms'], ['tag', 'Farmer-set prices'], ['lock', 'Secure payment']];

export default function Welcome() {
  useScreenState('welcome', 'Welcome');
  const { c, scheme, toggle } = useTheme();
  const { setAccount } = useProto();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const logoH = Math.round(Math.min(Math.max(height * 0.22, 140), 220));

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, width: '100%', maxWidth: MAX_W, paddingHorizontal: space[5], paddingTop: insets.top + space[2], paddingBottom: insets.bottom + space[4], justifyContent: 'space-between', gap: space[4] }}>

          {/* Day / night, quietly in the corner */}
          <View style={{ alignItems: 'flex-end' }}>
            <Press onPress={() => { haptic.select(); toggle(); }} label={scheme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'} scaleTo={0.9}
              style={{ width: tap, height: tap, borderRadius: tap / 2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={scheme === 'dark' ? 'sun' : 'moon'} size={22} color={c.muted} />
            </Press>
          </View>

          {/* Brand + promise */}
          <View style={{ alignItems: 'center', gap: space[4] }}>
            <Rise i={0} style={{ alignItems: 'center', justifyContent: 'center' }}>
              {/* soft sun behind the emblem, echoing the logo */}
              <View pointerEvents="none" style={{ position: 'absolute', width: logoH * 1.15, height: logoH * 1.15, borderRadius: logoH, backgroundColor: c.primarySoft, opacity: 0.8 }} />
              <View pointerEvents="none" style={{ position: 'absolute', top: -logoH * 0.02, right: -logoH * 0.08, width: logoH * 0.42, height: logoH * 0.42, borderRadius: logoH, backgroundColor: c.harvestSoft }} />
              <Logo height={logoH} />
            </Rise>
            <Rise i={1} style={{ gap: 8, alignItems: 'center' }}>
              <Text accessibilityRole="header" style={{ fontFamily: fonts.display, fontSize: size.xl + 2, lineHeight: 32, color: c.ink, textAlign: 'center' }}>
                Buy straight from the farm.{'\n'}<Text style={{ fontFamily: fonts.displayItalic, color: c.primaryInk }}>Sell</Text> without the middleman.
              </Text>
              <Text style={{ fontFamily: fonts.body, fontSize: size.md, lineHeight: 23, color: c.muted, textAlign: 'center', maxWidth: 340 }}>
                Produce, livestock and farm inputs from verified Nigerian farmers, at prices they set.
              </Text>
            </Rise>
          </View>

          {/* What OgaFarm is for */}
          <Rise i={2}>
            <View style={{ flexDirection: 'row', borderRadius: radius.lg, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, overflow: 'hidden' }}>
              {ROLES.map(([icon, title, line], i) => (
                <View key={title} accessible accessibilityLabel={`${title}: ${line}`}
                  style={{ flex: 1, alignItems: 'center', gap: 4, paddingVertical: 14, paddingHorizontal: 6, borderLeftWidth: i ? 1 : 0, borderLeftColor: c.line }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: i === 1 ? c.harvestSoft : c.primarySoft }}>
                    <Icon name={icon} size={19} color={i === 1 ? c.harvest : c.primaryInk} />
                  </View>
                  <Text style={{ fontFamily: fonts.display, fontSize: size.md + 1, color: c.ink }}>{title}</Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: size.xs, color: c.muted, textAlign: 'center' }}>{line}</Text>
                </View>
              ))}
            </View>
          </Rise>

          {/* Ways in + trust */}
          <Rise i={3} style={{ gap: 10 }}>
            <Button title="Create an account" onPress={() => router.push('/auth/signup')} />
            <Button title="Sign in" variant="secondary" onPress={() => router.push('/auth/signin')} />
            <Button title="Browse without an account" variant="ghost" icon="search" onPress={() => { setAccount('ngozi'); router.replace('/buyer/browse'); }} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: 14, rowGap: 6, marginTop: 2 }}>
              {TRUST.map(([i, t]) => (
                <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Icon name={i} size={14} color={c.primaryInk} />
                  <Text style={{ fontFamily: fonts.bodySemi, fontSize: size.xs, color: c.ink2 }}>{t}</Text>
                </View>
              ))}
            </View>
          </Rise>
        </View>
      </ScrollView>
    </View>
  );
}
