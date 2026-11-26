/* Farmer · Choose a plan (setup step 1 of 3, also used to renew or change plan). */
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SetupSteps } from '@/components/farmer';
import { naira, PLANS } from '@/data/sample';
import { useNav, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size, space } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Badge, Button, Press, Rise, Row, T } from '@/ui/kit';
import { Screen } from '@/ui/screen';

export default function Plan() {
  const { c } = useTheme();
  useScreenState('/farmer/plan', 'Choose a plan');
  const [pick, setPick] = useState('a');
  const [paying, setPaying] = useState(false);
  const nav = useNav();
  const plan = PLANS.find(p => p.key === pick)!;
  const pay = () => { setPaying(true); setTimeout(() => { setPaying(false); nav.replace('/farmer/payment', 'pending'); }, 1000); };
  return (
    <Screen footer={<>
      <Row between><View><T v="label">{plan.name} plan</T><T v="xs" muted>{plan.per} · {plan.monthly}</T></View>
        <Text style={{ fontFamily: fonts.display, fontSize: size.xl, color: c.ink, fontVariant: ['tabular-nums'] }}>{naira(plan.price)}</Text></Row>
      <Button title={`Pay ${naira(plan.price)}`} icon="lock" loading={paying} onPress={pay} />
    </>}>
      <Stack.Screen options={{ title: '' }} />
      <Rise><SetupSteps n={1} label="Plan" /></Rise>
      <Rise i={1} style={{ gap: 4 }}>
        <T v="h1">Choose your plan</T>
        <T v="small" muted>Your storefront goes live when your payment is confirmed and your farm is verified. Prices are set by OgaFarm and can change.</T>
      </Rise>
      <View accessibilityRole="radiogroup" accessibilityLabel="Plans" style={{ gap: space[3] }}>
        {PLANS.map((p, i) => {
          const on = pick === p.key;
          return (
            <Rise key={p.key} i={i + 2}>
              <Press onPress={() => { haptic.select(); setPick(p.key); }} role="radio" selected={on} label={`${p.name}, ${naira(p.price)} for ${p.per}`} scaleTo={0.985}
                style={{ padding: space[4], gap: 10, borderRadius: radius.lg, borderWidth: on ? 2 : 1, margin: on ? 0 : 1, borderColor: on ? c.primary : c.line, backgroundColor: on ? c.primarySoft : c.card }}>
                <Row between style={{ alignItems: 'flex-start' }}>
                  <View style={{ gap: 4 }}>
                    <Row gap={8}><T v="h3">{p.name}</T>{p.popular && <Badge tone="gold" align="center">Most popular</Badge>}{p.key === 'a' && <Badge tone="ok" align="center">Best value</Badge>}</Row>
                    <T v="xs" muted>{p.per} · {p.monthly}</T>
                  </View>
                  <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: on ? c.primary : c.lineStrong, alignItems: 'center', justifyContent: 'center' }}>
                    {on && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: c.primary }} />}
                  </View>
                </Row>
                <Text style={{ fontFamily: fonts.display, fontSize: size.x2, color: c.ink, fontVariant: ['tabular-nums'] }}>{naira(p.price)}</Text>
                <View style={{ gap: 6 }}>
                  {p.features.map(f => <Row key={f} gap={8}><Icon name="check" size={15} color={c.ok} weight="bold" /><T v="small">{f}</T></Row>)}
                </View>
              </Press>
            </Rise>
          );
        })}
      </View>
      <Row gap={8} style={{ alignItems: 'flex-start' }}><Icon name="lock" size={15} color={c.muted} /><T v="xs" muted style={{ flex: 1 }}>Paid securely through our payment provider. Your plan starts only after the provider confirms payment.</T></Row>
    </Screen>
  );
}
