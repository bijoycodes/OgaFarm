/* Farmer · Verify your farm (setup step 3 of 3): farm details, ID and farm photo. States: default, submitted. */
import { Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { SetupSteps } from '@/components/farmer';
import { FARM_TYPES } from '@/data/farmer';
import { useAccount, useNav, useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';
import { Icon, type IconName } from '@/ui/Icon';
import { Alert, Badge, Button, Card, Checklist, Chip, Field, Input, Press, Rise, Row, T } from '@/ui/kit';
import { Screen } from '@/ui/screen';
import { Select } from '@/ui/select';

const IDS = ['National ID (NIN slip)', "Driver's licence", 'International passport', "Voter's card"];

function Upload({ icon, title, note, done, onPress }: { icon: IconName; title: string; note: string; done: boolean; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Press onPress={onPress} label={`${title}${done ? ', added' : ''}`} scaleTo={0.98}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.md, borderWidth: 1.5, borderStyle: done ? 'solid' : 'dashed', borderColor: done ? c.primary : c.lineStrong, backgroundColor: done ? c.primarySoft : c.card }}>
      <View style={{ width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? c.card : c.sunken }}><Icon name={done ? 'check' : icon} size={20} color={done ? c.ok : c.ink2} weight={done ? 'bold' : 'regular'} /></View>
      <View style={{ flex: 1 }}><T v="label">{done ? `${title} added` : title}</T><T v="xs" muted>{done ? 'Tap to replace' : note}</T></View>
    </Press>
  );
}

/** Re-created when the sample account changes, so the form starts with that person's details. */
export default function VerificationScreen() {
  const acct = useAccount();
  return <Verification key={acct.key} />;
}

function Verification() {
  const { c } = useTheme();
  const [state, setState] = useScreenState('/farmer/verification', 'Verify your farm', ['default', 'submitted']);
  const acct = useAccount();
  const nav = useNav();
  const { toast } = useProto();
  const [type, setType] = useState('Mixed farm');
  const [idType, setIdType] = useState(IDS[0]);
  const [id, setId] = useState(false);
  const [photo, setPhoto] = useState(false);
  const [farm, setFarm] = useState(acct.key === 'emeka' ? 'Okafor Family Farm' : `${acct.name.split(' ')[1]} Farm`);
  const [lga, setLga] = useState('Aniocha North');
  const [addr, setAddr] = useState("Ogwashi road, behind St. Paul's school, Issele-Uku");
  const ready = id && photo;

  if (state === 'submitted') return (
    <Screen footer={<Button title="Set up my storefront" onPress={() => nav.replace('/farmer/storefront-editor', 'default')} />}>
      <Stack.Screen options={{ title: 'Verification' }} />
      <Rise><SetupSteps n={3} label="Verification" /></Rise>
      <Rise i={1}>
        <Card>
          <Badge tone="info" icon="clock">Under review</Badge>
          <T v="h2">Thanks, {acct.name.split(' ')[0]}. We are checking your documents.</T>
          <T v="small" muted>Most farms are reviewed within 1 working day. You can set up your storefront now; it goes public once you are verified.</T>
        </Card>
      </Rise>
      <Checklist items={[['Email address verified', true], ['Annual plan active', true], ['Identity and farm documents reviewed', false]]} />
    </Screen>
  );

  return (
    <Screen keyboard footer={<>
      <Button title="Submit for review" disabled={!ready} onPress={() => { haptic.success(); setState('submitted'); }} />
      <Row gap={6} style={{ justifyContent: 'center' }}><Icon name="lock" size={13} color={c.muted} /><T v="xs" muted>{ready ? 'Encrypted and private' : 'Add your ID and a farm photo to continue'}</T></Row>
    </>}>
      <Stack.Screen options={{ title: '' }} />
      <Rise><SetupSteps n={3} label="Verification" /></Rise>
      <Rise i={1} style={{ gap: 4 }}>
        <T v="h1">Verify your farm</T>
        <T v="small" muted>Buyers trust farms with the Verified badge. Your documents are private and seen only by the OgaFarm review team.</T>
      </Rise>
      <Rise i={2}><Alert tone="info" icon="info">Your storefront goes live once our team approves your documents. You can keep setting it up while you wait.</Alert></Rise>
      <Rise i={3}>
        <Card>
          <T v="h3">Your farm</T>
          <Field label="Farm name" required><Input value={farm} onChangeText={setFarm} /></Field>
          <Field label="Farm type"><Select label="Farm type" options={FARM_TYPES} value={type} onChange={setType} /></Field>
          <Row gap={10} style={{ alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}><Field label="State"><Input value="Delta" editable={false} /></Field></View>
            <View style={{ flex: 1.4 }}><Field label="LGA"><Input value={lga} onChangeText={setLga} /></Field></View>
          </Row>
          <Field label="Farm address or landmark" required><Input value={addr} onChangeText={setAddr} multiline /></Field>
        </Card>
      </Rise>
      <Rise i={4}>
        <Card>
          <T v="h3">Your ID</T>
          <Field label="ID document"><Select label="ID document" options={IDS} value={idType} onChange={setIdType} /></Field>
          <Field label="Name on ID" hint="Must match your account name."><Input value={acct.name} editable={false} /></Field>
          <Upload icon="camera" title="Photo of your ID" note="Take a photo or choose a file · up to 5 MB" done={id} onPress={() => { haptic.tap(); setId(true); toast('ID photo added'); }} />
          <Upload icon="image" title="Photo of your farm" note="A clear photo of your farm or produce" done={photo} onPress={() => { haptic.tap(); setPhoto(true); toast('Farm photo added'); }} />
        </Card>
      </Rise>
    </Screen>
  );
}
