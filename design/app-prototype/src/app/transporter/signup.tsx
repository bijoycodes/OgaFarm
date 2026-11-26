/* Transporter sign-up, step 2 of 3: details, vehicle and capacity, areas, documents.
   Reached after the one-time email confirmation, or from "Add a role". States: default, submitted. */
import { Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { AREAS, VEHICLES } from '@/data/transporter';
import { useAccount, useNav, useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';
import { Icon, type IconName } from '@/ui/Icon';
import { Alert, Badge, Button, Card, Checklist, Chip, Empty, Field, Input, Press, Rise, Row, Steps, T } from '@/ui/kit';
import { PhoneInput } from '@/ui/pickers';
import { Screen } from '@/ui/screen';

function Doc({ icon, title, note, done, onPress }: { icon: IconName; title: string; note: string; done: boolean; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Press onPress={onPress} label={`${title}${done ? ', added' : ''}`} scaleTo={0.98}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.md, borderWidth: 1.5, borderStyle: done ? 'solid' : 'dashed', borderColor: done ? c.primary : c.lineStrong, backgroundColor: done ? c.primarySoft : c.card }}>
      <View style={{ width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? c.card : c.sunken }}><Icon name={done ? 'check' : icon} size={20} color={done ? c.ok : c.ink2} weight={done ? 'bold' : 'regular'} /></View>
      <View style={{ flex: 1 }}><T v="label">{title}</T><T v="xs" muted>{done ? 'Added · tap to replace' : note}</T></View>
    </Press>
  );
}

/** Re-created when the sample account changes, so the form starts with that person's details. */
export default function TransporterSignupScreen() {
  const acct = useAccount();
  return <TransporterSignup key={acct.key} />;
}

function TransporterSignup() {
  const { c } = useTheme();
  const [state, setState] = useScreenState('/transporter/signup', 'Transporter sign-up', ['default', 'submitted']);
  const acct = useAccount();
  const nav = useNav();
  const { toast } = useProto();
  const sunday = acct.key === 'sunday';
  const [legal, setLegal] = useState(sunday ? 'Sunday Ikechukwu Ike' : acct.name);
  const [shown, setShown] = useState(sunday ? 'Ike Haulage' : acct.name);
  const [phone, setPhone] = useState(sunday ? '802 441 9087' : '806 555 0142');
  const [base, setBase] = useState(sunday ? 'Issele-Uku, Delta' : 'Asaba, Delta');
  const [veh, setVeh] = useState('Pickup truck');
  const [plate, setPlate] = useState(sunday ? 'AGB 482 KT' : '');
  const [load, setLoad] = useState('1500');
  const [bags, setBags] = useState('25');
  const [areas, setAreas] = useState(['Aniocha North', 'Oshimili South (Asaba)', 'Ika South (Agbor)']);
  const [id, setId] = useState(false);
  const [bill, setBill] = useState(false);
  const [photo, setPhoto] = useState(false);
  const motor = veh !== 'Other';
  const ready = id && bill && !!legal.trim() && (!motor || !!plate.trim()) && !!Number(load);

  if (state === 'submitted') return (
    <Screen footer={<Button title="Go to my dashboard" onPress={() => nav.replace('/transporter/home', 'pending verification')} />}>
      <Stack.Screen options={{ title: 'Sign-up sent', headerBackVisible: false }} />
      <Rise><View style={{ gap: 6 }}><Row between><Badge tone="info" align="center">Transporter sign-up</Badge><T v="xs" muted>Step 3 of 3</T></Row><Steps n={3} of={3} /></View></Rise>
      <Rise i={1}><Empty icon="shield" tone="ok" title="Documents sent for review">Our team checks transporter documents within 1 working day. We will email you the result. You can look at delivery requests now, and send quotes once you are approved.</Empty></Rise>
      <Checklist items={[['Email address verified', true], ['Vehicle and capacity added', true], ['ID and utility bill reviewed by OgaFarm', false]]} />
    </Screen>
  );

  return (
    <Screen keyboard footer={<>
      <Button title="Send for review" icon="check" disabled={!ready} onPress={() => { haptic.success(); setState('submitted'); }} />
      {!ready && <T v="xs" muted center>Add your ID and utility bill{motor && !plate.trim() ? ', and your plate number' : ''} to continue.</T>}
    </>}>
      <Stack.Screen options={{ title: 'Become a transporter' }} />
      <Rise><View style={{ gap: 6 }}><Row between><Badge tone="info" align="center">Transporter sign-up</Badge><T v="xs" muted>Step 2 of 3</T></Row><Steps n={2} of={3} /></View></Rise>
      <Rise i={1} style={{ gap: 4 }}>
        <T v="h1">Your vehicle and documents</T>
        <T v="small" muted>Transporting on OgaFarm is free. Only verified transporters can send quotes and be assigned to deliveries.</T>
      </Rise>

      <Rise i={2}>
        <Card>
          <T v="h3">Your details</T>
          <Field label="Full name, exactly as on your ID" required hint="It must match your driver's licence or National ID."><Input value={legal} onChangeText={setLegal} autoComplete="name" /></Field>
          <Field label="Name customers will see" hint="Your business name, or your own name."><Input value={shown} onChangeText={setShown} /></Field>
          <Field label="Phone number" required hint="Shared with a customer only after you are assigned to their delivery."><PhoneInput value={phone} onChangeText={setPhone} /></Field>
          <Field label="Where you are based" required><Input value={base} onChangeText={setBase} /></Field>
        </Card>
      </Rise>

      <Rise i={3}>
        <Card>
          <T v="h3">Vehicle</T>
          <Field label="Vehicle type" required><Row gap={8} wrap>{VEHICLES.map(([v, icon]) => <Chip key={v} label={v} icon={icon} on={veh === v} onPress={() => setVeh(v)} />)}</Row></Field>
          {motor && <Field label="Plate number" required hint="Required for motor vehicles."><Input value={plate} onChangeText={t => setPlate(t.toUpperCase())} autoCapitalize="characters" placeholder="e.g. AGB 482 KT" /></Field>}
          <Row gap={10} style={{ alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}><Field label="Max load (kg)" required><Input value={load} onChangeText={t => setLoad(t.replace(/\D/g, ''))} keyboardType="number-pad" /></Field></View>
            <View style={{ flex: 1 }}><Field label="50 kg bags that fit"><Input value={bags} onChangeText={t => setBags(t.replace(/\D/g, ''))} keyboardType="number-pad" /></Field></View>
          </Row>
          <Field label="Areas you cover" hint="More areas bring more requests."><Row gap={8} wrap>{AREAS.map(a => <Chip key={a} label={a} on={areas.includes(a)} onPress={() => setAreas(v => v.includes(a) ? v.filter(x => x !== a) : [...v, a])} />)}</Row></Field>
        </Card>
      </Rise>

      <Rise i={4}>
        <Card>
          <T v="h3">Documents</T>
          <Row gap={8} style={{ alignItems: 'flex-start' }}><Icon name="lock" size={15} color={c.muted} /><T v="xs" muted style={{ flex: 1 }}>Private. Only the OgaFarm review team can see them. They are never shown on your profile.</T></Row>
          <Doc icon="doc" title="Driver's licence or National ID" note="Photo or PDF · required" done={id} onPress={() => { haptic.tap(); setId(true); toast('ID added'); }} />
          <Doc icon="doc" title="Utility bill" note="Last 3 months · required" done={bill} onPress={() => { haptic.tap(); setBill(true); toast('Utility bill added'); }} />
          <Doc icon="camera" title="Vehicle photo" note="Plate visible · optional" done={photo} onPress={() => { haptic.tap(); setPhoto(true); toast('Vehicle photo added'); }} />
        </Card>
      </Rise>
      {!sunday && <Rise i={5}><Alert tone="info" icon="info">Your ID is checked once and reused for any later role. Your buyer orders stay under Buyer.</Alert></Rise>}
    </Screen>
  );
}
