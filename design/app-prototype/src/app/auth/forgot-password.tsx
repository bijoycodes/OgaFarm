/* Forgot password: email code, then a new password. Other devices are signed out (BR-ACC-10). */
import { router } from 'expo-router';
import { useState } from 'react';
import { useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { Button, CodeBoxes, Field, Input, PasswordInput, Rise, Stack, T } from '@/ui/kit';
import { Screen } from '@/ui/screen';

export default function ForgotPassword() {
  const [state, setState] = useScreenState('forgot-password', 'Forgot password', ['email', 'reset']);
  const { toast } = useProto();
  const [email, setEmail] = useState('emeka.okafor@example.com');
  const [pw, setPw] = useState('');
  if (state === 'reset') return (
    <Screen keyboard>
      <Rise i={0}><Stack gap={4}><T v="h1">Set a new password</T><T muted>Enter the 6-digit code we sent to {email}, then choose a new password.</T></Stack></Rise>
      <Rise i={1}><Field label="Code from your email"><CodeBoxes value="615204" /></Field></Rise>
      <Rise i={2}><Field label="New password" required><PasswordInput value={pw} onChangeText={setPw} strength autoComplete="new-password" /></Field></Rise>
      <Rise i={3}><Stack gap={10}>
        <Button title="Save new password" onPress={() => { haptic.success(); setState('email'); router.back(); toast('Password changed. Sign in with your new password'); }} />
        <T v="xs" muted center>For your safety, you will be signed out on other devices.</T>
      </Stack></Rise>
    </Screen>
  );
  return (
    <Screen keyboard>
      <Rise i={0}><Stack gap={4}><T v="h1">Reset your password</T><T muted>Enter your account email. We will send you a code to set a new password.</T></Stack></Rise>
      <Rise i={1}><Field label="Email address" required><Input value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" /></Field></Rise>
      <Rise i={2}><Button title="Email me a reset code" onPress={() => setState('reset')} /></Rise>
    </Screen>
  );
}
