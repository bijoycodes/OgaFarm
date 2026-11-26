/* Confirm email (one time only). After this, users sign in with email and password. */
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { ROLE_HOME, type AppRole } from '@/data/roles';
import { useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from '@/ui/Icon';
import { Alert, Button, CodeBoxes, Rise, Stack, T } from '@/ui/kit';
import { Screen } from '@/ui/screen';

export default function ConfirmEmail() {
  const [state] = useScreenState('confirm-email', 'Confirm email', ['default', 'wrong code']);
  const wrong = state === 'wrong code';
  const { c } = useTheme();
  const { setAccount, toast } = useProto();
  const { role = 'buyer' } = useLocalSearchParams<{ role?: string }>();
  const next = () => {
    if (wrong) { haptic.warn(); return; }
    haptic.success();
    const r = (['buyer', 'farmer', 'transporter'].includes(role) ? role : 'buyer') as AppRole;
    setAccount(r === 'farmer' ? 'emeka' : r === 'transporter' ? 'sunday' : 'ngozi');
    if (router.canDismiss()) router.dismissAll();
    // Transporters add their vehicle and documents next (step 2 of 3)
    router.replace((r === 'transporter' ? '/transporter/signup' : ROLE_HOME[r]) as never);
    toast('Email confirmed. Welcome to OgaFarm');
  };
  return (
    <Screen keyboard>
      <Rise i={0}><View style={{ alignItems: 'center', gap: 12, paddingTop: 12 }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: c.primarySoft }}><Icon name="mail" size={32} color={c.primaryInk} /></View>
        <T v="h1" center>Confirm your email</T>
        <T muted center>Enter the 6-digit code we sent to ngozi.eze@example.com.</T>
        <T v="xs" muted center>We only ask once. After this you sign in with your email and password.</T>
      </View></Rise>
      <Rise i={1}><CodeBoxes value={wrong ? '482193' : '4821'} invalid={wrong} /></Rise>
      {wrong && <Rise><Alert tone="danger" icon="alert">That code is not right. Check the latest email from OgaFarm and try again. 2 tries left.</Alert></Rise>}
      <Rise i={2}><Stack gap={10}>
        <Button title="Confirm and continue" onPress={next} />
        <T v="small" muted center>Not there? Check your spam folder. Resend code in 0:42</T>
      </Stack></Rise>
    </Screen>
  );
}
