/* Farmer · Order detail. Pickup (V1): confirm, then check the buyer's code at handover.
   Delivery (V2): hand over to the verified driver with a short checklist.
   States: pickup · new, pickup · ready, delivery · assigned, delivery · handed over. */
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Linking, TextInput, View } from 'react-native';
import { DELIVERY as D, TRANSPORTERS } from '@/data/delivery';
import { naira, PRODUCTS } from '@/data/sample';
import { useNav, useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Alert, Badge, Button, Card, Field, Kv, Press, Rise, Row, Status, T, Timeline } from '@/ui/kit';
import { Photo, Route, Who } from '@/ui/market';
import { Screen } from '@/ui/screen';

const ID = '/farmer/order';
const T_ = TRANSPORTERS.ike;

function Tick({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Press onPress={() => { haptic.select(); onPress(); }} role="checkbox" selected={on} label={label} scaleTo={0.98}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: on ? c.primary : c.line, backgroundColor: on ? c.primarySoft : c.card }}>
      <View style={{ width: 24, height: 24, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center', borderColor: on ? c.primary : c.lineStrong, backgroundColor: on ? c.primary : 'transparent' }}>
        {on && <Icon name="check" size={14} color={c.onPrimary} weight="bold" />}
      </View>
      <T v="small" style={{ flex: 1 }}>{label}</T>
    </Press>
  );
}

export default function FarmerOrder() {
  const { c } = useTheme();
  const [state, setState] = useScreenState(ID, 'Order detail', ['pickup · new', 'pickup · ready', 'delivery · assigned', 'delivery · handed over']);
  const nav = useNav();
  const { toast } = useProto();
  const [code, setCode] = useState('');
  const [plate, setPlate] = useState(false);
  const [load, setLoad] = useState(false);
  const [photo, setPhoto] = useState(false);
  const [busy, setBusy] = useState(false);
  const p = PRODUCTS[0];
  const later = (fn: () => void) => { setBusy(true); setTimeout(() => { setBusy(false); haptic.success(); fn(); }, 900); };

  if (state.startsWith('pickup')) {
    const ready = state === 'pickup · ready';
    const wrong = code.length === 4 && code !== '4821';
    const steps: [string, string?][] = [['Paid', '23 Nov, 11:30 am'], ['Confirmed by you', ready ? '11:41 am' : ''], ['Preparing', ready ? '12:10 pm' : ''], ['Ready for pickup', ready ? '2:05 pm' : ''], ['Collected by buyer', '']];
    return (
      <Screen keyboard footer={ready
        ? <Button title="Confirm handover" icon="check" disabled={code.length !== 4 || wrong} loading={busy} onPress={() => later(() => { toast('Order marked as collected'); nav.replace('/farmer/orders'); })} />
        : <>
            <Button title="Confirm and start preparing" icon="check" loading={busy} onPress={() => later(() => { setState('pickup · ready'); toast('Buyer notified: order confirmed'); })} />
            <Button title="Cannot fulfil · cancel and refund" variant="danger" onPress={() => toast('Cancel flow: the buyer is refunded in full')} />
          </>}>
        <Stack.Screen options={{ title: 'Order OGF-10421' }} />
        <Rise style={{ gap: 6 }}>
          <T v="h2">Fresh tomatoes (Roma)</T>
          <Row gap={8} wrap><Status s={ready ? 'Ready for pickup' : 'New'} /><Badge icon="pin" align="center">Pickup</Badge><T v="xs" muted>Placed 23 Nov, 11:30 am</T></Row>
        </Rise>
        {!ready && <Rise><Alert tone="warn" icon="clock" title="Confirm within 2 hours">So the buyer knows you have the stock. The buyer has already paid.</Alert></Rise>}
        {ready && (
          <Rise>
            <Card>
              <T v="h3">Hand over the order</T>
              <T v="small" muted>Ask the buyer for their pickup code before you hand over.</T>
              <Field label="Buyer's pickup code" error={wrong ? 'That code does not match this order.' : undefined} hint="Sample code: 4821">
                <TextInput value={code} onChangeText={t => setCode(t.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" maxLength={4} placeholder="• • • •" placeholderTextColor={c.muted} accessibilityLabel="Buyer's pickup code"
                  style={{ minHeight: 60, borderWidth: 1.5, borderRadius: radius.md, borderColor: wrong ? c.danger : code.length === 4 ? c.primary : c.lineStrong, backgroundColor: c.card, textAlign: 'center', letterSpacing: 12, fontFamily: fonts.bodyHeavy, fontSize: size.x2, color: c.ink }} />
              </Field>
            </Card>
          </Rise>
        )}
        <Rise i={1}>
          <Card>
            <Row gap={12}>
              <Photo src={p.img} ratio={1} style={{ width: 56 }} />
              <View style={{ flex: 1 }}><T v="label">{p.name}</T><T v="xs" muted>20 kg × {naira(350)}</T></View>
              <T v="label">{naira(7000)}</T>
            </Row>
            <Kv rows={[['Payment', 'Paid · confirmed by provider']]} />
          </Card>
        </Rise>
        <Rise i={2}>
          <Card>
            <T v="h3">Buyer</T>
            <Who initials="NE" name="Ngozi Eze" sub="Individual buyer · Asaba" />
            <Button title="Call buyer" icon="phone" variant="soft" small onPress={() => Linking.openURL('tel:+2348065550142').catch(() => toast('Calls +234 806 555 0142'))} />
          </Card>
        </Rise>
        <Rise i={3}><Card><T v="h3">Progress</T><Timeline steps={steps} done={ready ? 4 : 1} /></Card></Rise>
      </Screen>
    );
  }

  const handed = state === 'delivery · handed over';
  const steps: [string, string?][] = [['Paid', 'Today, 11:52 am'], ['Confirmed by you', '11:55 am'], ['Transporter assigned', '11:58 am'], ['Handed to the driver', handed ? '12:41 pm' : ''], ['Delivered to the buyer', '']];
  return (
    <Screen footer={handed ? undefined : <Button title="Confirm handover" icon="check" disabled={!plate || !load} loading={busy} onPress={() => later(() => { setState('delivery · handed over'); toast('Handover confirmed'); })} />}>
      <Stack.Screen options={{ title: `Order ${D.id}` }} />
      <Rise style={{ gap: 6 }}>
        <T v="h2">{D.item}</T>
        <Row gap={8} wrap><Status s={handed ? 'In transit' : 'Assigned'} /><Badge tone="info" icon="truck" align="center">Delivery</Badge><T v="xs" muted>{D.buyer} · today, 11:52 am</T></Row>
      </Rise>
      {handed && <Rise><Alert tone="info" icon="truck" title="On the way to the buyer">Sunday picked up 60 kg at 12:41 pm. We will tell you when the buyer confirms delivery.</Alert></Rise>}

      <Rise i={1}>
        <Card>
          {handed ? <>
            <T v="h3">Handover done</T>
            <Kv rows={[['Loaded', `${D.qty} · ${D.packing}`], ['Condition', 'Good'], ['Photo', photo ? 'Added by you' : 'Added by driver']]} />
          </> : <>
            <T v="h3">Hand over to the driver</T>
            <T v="small" muted>Arrives around 12:30 pm. Tick both before you hand over.</T>
            <Tick label={`The plate is ${T_.plate}`} on={plate} onPress={() => setPlate(v => !v)} />
            <Tick label={`We counted the load together: ${D.qty}, ${D.packing}`} on={load} onPress={() => setLoad(v => !v)} />
            <Button title={photo ? 'Photo of the load added' : 'Add a photo of the load (optional)'} icon={photo ? 'check' : 'camera'} variant="secondary" small onPress={() => { setPhoto(true); toast('Photo added'); }} />
          </>}
        </Card>
      </Rise>

      <Rise i={2}>
        <Card>
          <T v="h3">Transporter</T>
          <Who initials={T_.initials} name={T_.person} sub={`${T_.name} · ${T_.vehicle} · ${T_.plate}`} verified />
          <Button title="Call driver" icon="phone" variant="soft" small onPress={() => Linking.openURL(`tel:${T_.phone}`).catch(() => toast('Calls +234 802 441 9087'))} />
        </Card>
      </Rise>

      <Rise i={3}>
        <Card>
          <Row gap={12}>
            <Photo src={p.img} ratio={1} style={{ width: 56 }} />
            <View style={{ flex: 1 }}><T v="label">{D.item}</T><T v="xs" muted>{D.qty} × {naira(D.unit)}</T></View>
            <T v="label">{naira(D.subtotal)}</T>
          </Row>
          <Kv rows={[['Your sale', naira(D.subtotal)], ['Delivery (buyer pays the transporter)', naira(D.fee)]]} />
          <Row gap={6} style={{ alignItems: 'flex-start' }}><Icon name="info" size={14} color={c.muted} /><T v="xs" muted style={{ flex: 1 }}>The transporter sets the delivery price. You never set or pay it.</T></Row>
        </Card>
      </Rise>

      <Rise i={4}><Card><T v="h3">Delivering to</T><Route from={D.pickup} to={D.dropArea} /></Card></Rise>
      <Rise i={5}><Card><T v="h3">Progress</T><Timeline steps={steps} done={handed ? 4 : 3} /></Card></Rise>
    </Screen>
  );
}
