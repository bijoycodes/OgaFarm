/* Farmer · Payment status for a plan. States: pending (confirms by itself after a few seconds), active, failed. */
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SetupSteps } from '@/components/farmer';
import { naira } from '@/data/sample';
import { useNav, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Button, Card, Kv, Rise, T } from '@/ui/kit';
import { Skel } from '@/ui/market';
import { Screen } from '@/ui/screen';

export default function Payment() {
  const { c } = useTheme();
  const [state, setState] = useScreenState('/farmer/payment', 'Payment status', ['pending', 'active', 'failed']);
  const nav = useNav();
  useEffect(() => {
    if (state !== 'pending') return;
    const t = setTimeout(() => { haptic.success(); setState('active'); }, 3200);
    return () => clearTimeout(t);
  }, [state, setState]);
  const look = { pending: [c.warnBg, c.warn, 'clock'], active: [c.okBg, c.ok, 'check'], failed: [c.dangerBg, c.danger, 'alert'] }[state as 'pending'] as [string, string, 'clock'];
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Payment', headerBackVisible: state !== 'pending' }} />
      <Rise><SetupSteps n={2} label="Payment" /></Rise>
      <Rise i={1}>
        <Card style={{ alignItems: 'center', paddingVertical: space[6] }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: look[0] }}><Icon name={look[2]} size={34} color={look[1]} weight="bold" /></View>
          {state === 'pending' && <>
            <T v="h2" center>Confirming your payment</T>
            <T v="small" muted center>We switch on your plan only after the payment provider confirms it. This usually takes under a minute.</T>
            <Skel h={8} r={4} />
            <T v="xs" muted center>Reference OGF-SUB-88213 · You can leave this screen. We will notify you.</T>
          </>}
          {state === 'active' && <>
            <T v="h2" center>Your Annual plan is active</T>
            <T v="small" muted center>Paid until 23 Nov 2027. Next, verify your farm so buyers can see your storefront.</T>
            <View style={{ alignSelf: 'stretch' }}><Kv rows={[['Amount', naira(95000)], ['Reference', 'OGF-SUB-88213'], ['Confirmed', '23 Nov 2026, 11:42 am']]} /></View>
            <Button title="Continue to verification" onPress={() => nav.replace('/farmer/verification', 'default')} style={{ alignSelf: 'stretch' }} />
          </>}
          {state === 'failed' && <>
            <T v="h2" center>Payment did not go through</T>
            <T v="small" muted center>Your bank declined the payment. No money was taken. Try another card or bank transfer.</T>
            <Button title="Try again" onPress={() => nav.replace('/farmer/plan')} style={{ alignSelf: 'stretch' }} />
          </>}
        </Card>
      </Rise>
    </Screen>
  );
}
