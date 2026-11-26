/* Transporter · Job: confirm pickup at the farm, on the way, proof of delivery with the buyer's code, done.
   States: assigned, in transit, proof of delivery, delivered. */
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Linking, TextInput, View } from 'react-native';
import { DELIVERY as D } from '@/data/delivery';
import { naira } from '@/data/sample';
import { useNav, useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Alert, Button, Card, Field, Input, Kv, Press, Rise, Row, Status, T, Timeline } from '@/ui/kit';
import { Choice, Route, Who } from '@/ui/market';
import { Screen } from '@/ui/screen';

const ID = '/transporter/job';

function PhotoTile({ done, onPress, label }: { done: boolean; onPress: () => void; label: string }) {
  const { c } = useTheme();
  return (
    <Press onPress={onPress} label={label} scaleTo={0.98}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: radius.md, borderWidth: 1.5, borderStyle: done ? 'solid' : 'dashed', borderColor: done ? c.primary : c.lineStrong, backgroundColor: done ? c.primarySoft : c.card }}>
      <Icon name={done ? 'check' : 'camera'} size={20} color={done ? c.ok : c.ink2} weight={done ? 'bold' : 'regular'} />
      <T v="label">{done ? 'Photo added' : label}</T>
    </Press>
  );
}

export default function Job() {
  const { c } = useTheme();
  const [state, setState] = useScreenState(ID, 'Job', ['assigned', 'in transit', 'proof of delivery', 'delivered']);
  const step = ['assigned', 'in transit', 'proof of delivery', 'delivered'].indexOf(state);
  const nav = useNav();
  const { toast } = useProto();
  const [loaded, setLoaded] = useState(`${D.qty} · ${D.packing}`);
  const [goodAtPickup, setGoodAtPickup] = useState(true);
  const [photo1, setPhoto1] = useState(false);
  const [code, setCode] = useState('');
  const [cond, setCond] = useState(0);
  const [photo2, setPhoto2] = useState(false);
  const [busy, setBusy] = useState(false);
  const wrong = code.length === 4 && code !== D.code;
  const go = (s: string, msg: string) => { setBusy(true); setTimeout(() => { setBusy(false); haptic.success(); setState(s); toast(msg); }, 900); };
  const steps: [string, string?][] = [['Assigned to you', 'Today, 11:58 am'], ['Picked up at the farm', step >= 1 ? '12:41 pm' : 'By 2:00 pm'], ['On the way', step >= 1 ? '12:45 pm' : ''], ['Delivered', step >= 3 ? '3:12 pm' : 'By 3:30 pm']];
  const call = (n: string) => Linking.openURL(`tel:${n.replace(/\s/g, '')}`).catch(() => toast(`Calls ${n}`));

  const footer = step === 0 ? <Button title="Confirm pickup and start" icon="truck" loading={busy} onPress={() => go('in transit', 'Pickup confirmed. The buyer has been told.')} />
    : step === 1 ? <>
        <Button title="I have arrived" icon="pin" onPress={() => { haptic.tap(); setState('proof of delivery'); }} />
        <Button title="Running late" icon="clock" variant="secondary" onPress={() => toast('The buyer is told you are running late. Add a new time.')} />
      </>
    : step === 2 ? <Button title="Confirm delivery" icon="check" disabled={code.length !== 4 || wrong} loading={busy} onPress={() => go('delivered', 'Delivery confirmed')} />
    : <Row gap={10}><Button title="Rate the buyer" icon="star" variant="secondary" onPress={() => toast('Opens a short review of the buyer')} style={{ flex: 1 }} /><Button title="Next job" onPress={() => nav.replace('/transporter/requests')} style={{ flex: 1 }} /></Row>;

  return (
    <Screen keyboard footer={footer}>
      <Stack.Screen options={{ title: `Job ${D.id}` }} />
      <Rise style={{ gap: 6 }}>
        <T v="h2">Issele-Uku → Asaba</T>
        <Row gap={8} wrap><Status s={['Assigned', 'In transit', 'In transit', 'Delivered'][step]} /><T v="xs" muted>{D.item} · {D.qty} · your price {naira(D.fee)}</T></Row>
      </Rise>
      {step === 3 && <Rise><Alert tone="ok" icon="check" title="Delivered at 3:12 pm">The buyer confirmed with their delivery code. Thank you for delivering on time.</Alert></Rise>}

      <Rise i={1}>
        <Card>
          {step === 0 && <>
            <T v="h3">At the farm: confirm pickup</T>
            <T v="small" muted>Count the load with the farmer before you leave.</T>
            <Field label="Quantity loaded"><Input value={loaded} onChangeText={setLoaded} /></Field>
            <Choice on={goodAtPickup} onPress={() => setGoodAtPickup(true)} title="Good, matches the order" />
            <Choice on={!goodAtPickup} onPress={() => setGoodAtPickup(false)} title="Some damage" sub="Describe it to the farmer and add a photo" />
            <PhotoTile done={photo1} onPress={() => { setPhoto1(true); haptic.tap(); }} label="Photo of the load (helps later)" />
          </>}
          {step === 1 && <>
            <T v="h3">On the way</T>
            <T v="small" muted>The buyer sees each update. There is no live map in this version.</T>
            <Kv rows={[['Picked up', '12:41 pm · 60 kg'], ['Deliver by', '3:30 pm'], ['Drop-off', D.dropFull]]} />
            <Button title="Directions" icon="map" variant="soft" small onPress={() => toast('Opens directions in maps')} />
          </>}
          {step === 2 && <>
            <T v="h3">Proof of delivery</T>
            <T v="small" muted>Let the buyer check the order first. Then ask for their 4-digit delivery code.</T>
            <Field label="Buyer's delivery code" required error={wrong ? 'That code does not match this order.' : undefined} hint="Sample code: 7316">
              <TextInput value={code} onChangeText={t => setCode(t.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" maxLength={4} placeholder="• • • •" placeholderTextColor={c.muted} accessibilityLabel="Buyer's delivery code"
                style={{ minHeight: 60, borderWidth: 1.5, borderRadius: radius.md, borderColor: wrong ? c.danger : code.length === 4 ? c.primary : c.lineStrong, backgroundColor: c.card, textAlign: 'center', letterSpacing: 12, fontFamily: fonts.bodyHeavy, fontSize: size.x2, color: c.ink }} />
            </Field>
            <View style={{ gap: 8 }}>
              <T v="label">Condition</T>
              {['Matches the order', 'Small difference', 'Damaged'].map((t, i) => <Choice key={t} on={cond === i} onPress={() => setCond(i)} title={t} />)}
            </View>
            <PhotoTile done={photo2} onPress={() => { setPhoto2(true); haptic.tap(); }} label="Photo at drop-off (optional)" />
          </>}
          {step === 3 && <>
            <T v="h3">Done</T>
            <Kv rows={[['Delivered', 'Today, 3:12 pm'], ['Received by', D.buyer], ['Condition', 'Matches the order'], ['Your price', naira(D.fee)]]} />
          </>}
        </Card>
      </Rise>

      <Rise i={2}><Card><T v="h3">Route · {D.distance}</T><Route from={`${D.farm} · ${D.pickup}`} to={D.dropFull} /></Card></Rise>

      <Rise i={3}>
        <Card>
          <T v="h3">Contacts</T>
          <Who initials="EO" name={D.farmer} sub="Farmer · pickup" right={<Button title="Call" icon="phone" variant="soft" small onPress={() => call('+234 803 123 4567')} />} />
          <Who initials="NE" name={D.buyer} sub="Buyer · drop-off" right={<Button title="Call" icon="phone" variant="soft" small onPress={() => call('+234 806 555 0142')} />} />
        </Card>
      </Rise>

      <Rise i={4}><Card><T v="h3">Progress</T><Timeline steps={steps} done={step >= 3 ? 4 : step >= 1 ? 3 : 1} /></Card></Rise>
    </Screen>
  );
}
