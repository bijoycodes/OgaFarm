/* Buyer · Checkout: stock held with a live timer, quantity, pickup or delivery (V2), contact / address, summary.
   States: pickup, delivery, price changed. */
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { FARMS, naira, PRODUCTS, qtyText, unitFor } from '@/data/sample';
import { useNav, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Alert, Button, Card, Chip, Field, Input, Kv, Rise, Row, T } from '@/ui/kit';
import { Choice, Photo, Stepper } from '@/ui/market';
import { PhoneInput } from '@/ui/pickers';
import { Screen } from '@/ui/screen';
import { Select } from '@/ui/select';

const ID = '/buyer/checkout';

function HeldTimer() {
  const { c } = useTheme();
  const [s, setS] = useState(14 * 60 + 32);
  useEffect(() => { const t = setInterval(() => setS(v => Math.max(0, v - 1)), 1000); return () => clearInterval(t); }, []);
  return (
    <View accessible accessibilityLabel={`Stock held for you for ${Math.floor(s / 60)} minutes`} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.md, backgroundColor: c.harvestSoft }}>
      <Icon name="clock" size={16} color={c.harvest} />
      <Text style={{ fontFamily: fonts.bodySemi, fontSize: size.sm, color: c.harvest }}>Stock held for you · <Text style={{ fontFamily: fonts.bodyHeavy, fontVariant: ['tabular-nums'] }}>{Math.floor(s / 60)}:{String(s % 60).padStart(2, '0')}</Text></Text>
    </View>
  );
}

export default function Checkout() {
  const { c } = useTheme();
  const { id, qty: q } = useLocalSearchParams<{ id?: string; qty?: string }>();
  const p = PRODUCTS.find(x => x.id === id) ?? PRODUCTS[0], f = FARMS[p.farm];
  const [state, setState] = useScreenState(ID, 'Checkout', ['pickup', 'delivery', 'price changed']);
  const delivery = state === 'delivery', changed = state === 'price changed';
  const [qty, setQty] = useState(Number(q) || (delivery ? 60 : p.min));
  const [name, setName] = useState('Ngozi Eze');
  const [phone, setPhone] = useState('806 555 0142');
  const [address, setAddress] = useState('14 Okpanam Road, Asaba');
  const [landmark, setLandmark] = useState('Near Shoprite');
  const [when, setWhen] = useState('Today, before 4 pm');
  const [paying, setPaying] = useState(false);
  const nav = useNav();
  const unit = changed ? Math.round(p.price * 1.086 / 10) * 10 : p.price, total = unit * qty;
  const gate = `Farm gate, ${f.place.split(',')[0]}`;

  const pay = () => {
    setPaying(true);
    setTimeout(() => { setPaying(false); haptic.success(); nav.replace('/buyer/order', 'pickup order'); }, 1400);
  };

  return (
    <Screen keyboard footer={<>
      <Row between>
        <T v="label">{delivery ? 'Produce total' : 'Total'}</T>
        <Text style={{ fontFamily: fonts.display, fontSize: size.xl, color: c.ink, fontVariant: ['tabular-nums'] }}>{naira(total)}</Text>
      </Row>
      {delivery
        ? <Button title="Get delivery quotes" icon="truck" onPress={() => nav.push('/buyer/quotes', 'waiting')} />
        : <Button title={changed ? 'Accept new price and pay' : `Pay ${naira(total)}`} icon="lock" loading={paying} onPress={pay} />}
    </>}>
      <Stack.Screen options={{ title: 'Checkout' }} />
      <Rise><HeldTimer /></Rise>
      {changed && <Rise><Alert tone="warn" icon="alert" title="The price changed">{f.name} updated {p.name.toLowerCase()} from {naira(p.price)} to {naira(unit)} per {p.unit} while you were checking out. Please review the new total.</Alert></Rise>}

      <Rise i={1}>
        <Card>
          <T v="h3">Your order</T>
          <Row gap={12}>
            <Photo src={p.img} ratio={1} style={{ width: 64 }} />
            <View style={{ flex: 1 }}><T v="label">{p.name}</T><T v="xs" muted>{f.name}{f.verified ? ' · Verified' : ''}</T><T v="xs" muted>{naira(unit)} per {p.unit}</T></View>
          </Row>
          <Stepper value={qty} onChange={setQty} min={p.min} step={p.min >= 10 ? 5 : 1} unit={unitFor(p.unit, qty)} label="Quantity" />
        </Card>
      </Rise>

      <Rise i={2} style={{ gap: 10 }}>
        <T v="h3">How you get it</T>
        <Choice icon="pin" on={!delivery} onPress={() => setState('pickup')} title="Pickup at the farm" sub={`${gate} · Mon–Sat, 7am–5pm · free`} />
        <Choice icon="truck" on={delivery} onPress={() => setState('delivery')} title="Delivery by a verified transporter" sub="Transporters near the farm send you a price. You pick one." />
      </Rise>

      <Rise i={3}>
        <Card>
          {delivery ? <>
            <T v="h3">Deliver to</T>
            <Field label="Recipient name" required><Input value={name} onChangeText={setName} autoComplete="name" textContentType="name" /></Field>
            <Field label="Recipient phone" required hint="Shared with the transporter after you accept a quote."><PhoneInput value={phone} onChangeText={setPhone} /></Field>
            <Field label="Address" required><Input value={address} onChangeText={setAddress} autoComplete="street-address" textContentType="fullStreetAddress" /></Field>
            <Field label="Landmark" hint="Helps the driver find you."><Input value={landmark} onChangeText={setLandmark} /></Field>
            <Field label="Deliver by"><Select label="Deliver by" options={['Today, before 4 pm', 'Tomorrow', 'Flexible']} value={when} onChange={setWhen} /></Field>
          </> : <>
            <T v="h3">Your details</T>
            <Field label="Your name"><Input value={name} onChangeText={setName} autoComplete="name" textContentType="name" /></Field>
            <Field label="Phone" hint="The farmer can call you about pickup."><PhoneInput value={phone} onChangeText={setPhone} /></Field>
          </>}
        </Card>
      </Rise>

      <Rise i={4}>
        <Card tone="sunken">
          <T v="h3">Summary</T>
          <Kv rows={[[`${qtyText(qty, p.unit)} × ${naira(unit)}`, naira(total)], delivery ? ['Delivery', 'Price from transporters'] : ['Pickup', 'Free']]} />
          <Row gap={8} style={{ alignItems: 'flex-start' }}>
            <Icon name={delivery ? 'info' : 'lock'} size={15} color={c.muted} />
            <T v="xs" muted style={{ flex: 1 }}>{delivery ? 'Delivery is a separate cost set by the transporter, never by the farmer. You pay after you choose a quote.' : 'Paid securely through our payment provider. The farmer is paid for this order directly.'}</T>
          </Row>
        </Card>
      </Rise>
    </Screen>
  );
}
