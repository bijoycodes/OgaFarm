/* Sign in with email and password (no code each time). Keep me signed in, Forgot password. */
import { router } from 'expo-router';
import { useState } from 'react';
import { useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { Alert, Button, CheckRow, Field, Input, PasswordInput, Rise, Row, Stack, T, TextLink } from '@/ui/kit';
import { Screen } from '@/ui/screen';

export default function Signin() {
  const [state] = useScreenState('signin', 'Sign in', ['default', 'wrong password']);
  const wrong = state === 'wrong password';
  const { setAccount, toast } = useProto();
  const [email, setEmail] = useState('emeka.okafor@example.com');
  const [pw, setPw] = useState('farmfresh2026');
  const [keep, setKeep] = useState(true);
  const signIn = () => {
    if (wrong) { haptic.warn(); return; }
    haptic.success(); setAccount('emeka'); if (router.canDismiss()) router.dismissAll(); router.replace('/farmer/home'); toast('Welcome back, Emeka');
  };
  return (
    <Screen keyboard>
      <Rise i={0}><Stack gap={4}><T v="h1">Welcome back</T><T muted>Sign in with your email and password.</T></Stack></Rise>
      {wrong && <Rise><Alert tone="danger" icon="alert">That email and password don't match. Check them and try again, or reset your password. 3 tries left before a short pause.</Alert></Rise>}
      <Rise i={1}><Field label="Email address" required><Input value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="username" /></Field></Rise>
      <Rise i={2}><Field label="Password" required right={<TextLink title="Forgot password?" onPress={() => router.push('/auth/forgot-password')} />}>
        <PasswordInput value={wrong ? 'farmfresh' : pw} onChangeText={setPw} invalid={wrong} />
      </Field></Rise>
      <Rise i={3}><CheckRow label="Keep me signed in on this phone" on={keep} onChange={setKeep} /></Rise>
      <Rise i={4}><Stack gap={12}>
        <Button title="Sign in" onPress={signIn} />
        <Row gap={6} style={{ justifyContent: 'center' }}><T v="small" muted>New to OgaFarm?</T><TextLink title="Create an account" onPress={() => router.replace('/auth/signup')} /></Row>
      </Stack></Rise>
    </Screen>
  );
}
