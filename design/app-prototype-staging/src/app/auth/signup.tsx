/* Sign up: one role to start (Buyer by default), email + phone (with country) + password. Code by email, once. */
import { router } from 'expo-router';
import { useState } from 'react';
import type { RoleKey } from '@/data/roles';
import { useScreenState } from '@/proto/Proto';
import { Alert, Button, CheckRow, Field, Input, PasswordInput, Rise, Row, Stack, T, TextLink } from '@/ui/kit';
import { PhoneInput, RolePicker } from '@/ui/pickers';
import { Screen } from '@/ui/screen';

export default function Signup() {
  const [state] = useScreenState('signup', 'Sign up', ['default', 'error']);
  const bad = state === 'error';
  const [role, setRole] = useState<RoleKey>('buyer');
  const [name, setName] = useState('Ngozi Eze');
  const [email, setEmail] = useState('ngozi.eze@example.com');
  const [phone, setPhone] = useState('806 555 0142');
  const [pw, setPw] = useState('farmfresh2026');
  const [terms, setTerms] = useState(true);
  const [offers, setOffers] = useState(false);
  return (
    <Screen keyboard>
      <Rise i={0}><Stack gap={4}><T v="h1">Create your account</T><T muted>Takes about a minute. We email you a code once, to confirm your address.</T></Stack></Rise>
      {bad && <Rise><Alert tone="danger" icon="alert" title="There is a problem">Enter a full email address.</Alert></Rise>}
      <Rise i={1}><Field label="I want to join as" required hint="Pick one to start. You can add more roles later from your account."><RolePicker value={role} onChange={setRole} /></Field></Rise>
      <Rise i={2}><Field label="Full name" required><Input value={name} onChangeText={setName} autoComplete="name" textContentType="name" /></Field></Rise>
      <Rise i={3}><Field label="Email address" required error={bad ? 'Enter a full email address, for example ngozi@example.com.' : undefined}>
        <Input value={bad ? 'ngozi.eze@' : email} onChangeText={setEmail} invalid={bad} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
      </Field></Rise>
      <Rise i={4}><Field label="Phone number" hint="So sellers and drivers can call you about orders. We never send codes to your phone."><PhoneInput value={phone} onChangeText={setPhone} /></Field></Rise>
      <Rise i={5}><Field label="Create a password" required><PasswordInput value={pw} onChangeText={setPw} strength autoComplete="new-password" /></Field></Rise>
      <Rise i={6}><Stack gap={2}>
        <CheckRow label="I agree to the Terms and Privacy Policy." on={terms} onChange={setTerms} />
        <CheckRow label="Send me offers and farm updates (optional)." on={offers} onChange={setOffers} />
      </Stack></Rise>
      <Rise i={7}><Stack gap={12}>
        <Button title="Create account" disabled={!terms} onPress={() => router.push({ pathname: '/auth/confirm-email', params: { role } })} />
        <Row gap={6} style={{ justifyContent: 'center' }}><T v="small" muted>Already have an account?</T><TextLink title="Sign in" onPress={() => router.replace('/auth/signin')} /></Row>
      </Stack></Rise>
    </Screen>
  );
}
