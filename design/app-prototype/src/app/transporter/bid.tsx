/* Transporter · One request: route, cargo, and send a price (with a capacity check).
   States: default, too heavy, sent. Unverified transporters can look but not quote. */
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useVerified } from '@/components/transporter';
import { DELIVERY as D, TRANSPORTERS } from '@/data/delivery';
import { naira } from '@/data/sample';
import { REQUESTS } from '@/data/transporter';
import { useNav, useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size } from '@/theme/tokens';
import { Alert, Button, Card, Chip, Field, Input, Kv, Rise, Row, Status, T } from '@/ui/kit';
import { Route, TextArea } from '@/ui/market';
import { Screen } from '@/ui/screen';

const T_ = TRANSPORTERS.ike;

export default function Bid() {
  const { c } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const r = REQUESTS.find(x => x.id === id) ?? REQUESTS[0];
  const [state, setState] = useScreenState('/transporter/bid', 'Send a quote', ['default', 'too heavy', 'sent']);
  const verified = useVerified();
  const heavy = state === 'too heavy', sent = state === 'sent';
  const nav = useNav();
  const { toast } = useProto();
  const [price, setPrice] = useState(String(D.fee));
  const [pickup, setPickup] = useState('12:30 pm');
  const [by, setBy] = useState('3:30 pm');
  const [note, setNote] = useState('I have covers for the baskets.');
  const [busy, setBusy] = useState(false);
  const cargo = heavy ? 'Yellow maize · 24 × 100 kg bags' : r.cargo;
  const blocked = heavy || !verified;
  const send = () => { setBusy(true); setTimeout(() => { setBusy(false); haptic.success(); setState('sent'); }, 900); };

  return (
    <Screen keyboard footer={sent
      ? <Row gap={10}><Button title="Withdraw" variant="ghost" onPress={() => { toast('Quote withdrawn'); nav.replace('/transporter/requests'); }} /><Button title="Change quote" variant="secondary" onPress={() => setState('default')} style={{ flex: 1 }} /></Row>
      : <>
          <Button title={!verified ? 'Available after verification' : heavy ? 'Too heavy for your vehicle' : `Send quote · ${naira(Number(price) || 0)}`} icon={blocked ? 'lock' : 'check'} disabled={blocked || !Number(price)} loading={busy} onPress={send} />
          {!blocked && <T v="xs" muted center>By quoting you confirm your vehicle can carry this load safely.</T>}
        </>}>
      <Stack.Screen options={{ title: `Request ${r.id}` }} />
      <Rise style={{ gap: 6 }}>
        <T v="h1">{r.from} → {r.to}</T>
        <Row gap={8} wrap><Status s={sent ? 'Quote sent' : 'Open'} /><T v="xs" muted>Posted 25 min ago · {r.quotes}</T></Row>
      </Rise>
      {sent && <Rise><Alert tone="ok" icon="check" title={`Your quote of ${naira(Number(price) || D.fee)} was sent`}>The buyer is comparing quotes. We will notify you if you are chosen. You can change or withdraw your quote until then.</Alert></Rise>}
      {heavy && <Rise><Alert tone="danger" icon="alert" title="This load is too heavy for your vehicle">The cargo is 2,400 kg. Your pickup truck carries up to 1,500 kg, so you can't quote for this request.</Alert></Rise>}
      {!verified && !heavy && <Rise><Alert tone="warn" icon="lock" title="You can't send quotes yet">Only verified transporters can quote. Your documents are under review.</Alert></Rise>}

      <Rise i={1}>
        <Card>
          <T v="h3">Route</T>
          <Route from={`${D.farm} · ${D.pickup}`} to={`${D.dropArea} (exact address shared after you are assigned)`} />
          <Kv rows={[['Distance', `About ${r.dist}`], ['Needed by', r.when], ['Pickup from', 'Today, 12:00 pm']]} />
        </Card>
      </Rise>
      <Rise i={2}>
        <Card>
          <T v="h3">Cargo</T>
          <Kv rows={[['Item', cargo], ['Weight', heavy ? '2,400 kg' : `${D.qty} · ${D.packing}`], ['Handling', heavy ? 'Dry, keep covered' : 'Perishable. Keep shaded, do not stack baskets']]} />
        </Card>
      </Rise>

      <Rise i={3}>
        <Card style={blocked && !sent ? { opacity: 0.6 } : undefined}>
          {sent ? <>
            <T v="h3">Your quote</T>
            <Kv rows={[['Price', naira(Number(price) || D.fee)], ['Pickup', `Today, ${pickup}`], ['Delivery by', `Today, ${by}`], ['Vehicle', `${T_.vehicle} · ${T_.plate}`]]} />
          </> : <>
            <T v="h3">Send your price</T>
            <Field label="Your price for this delivery" required hint="The full price for the buyer. The farmer does not set or change it.">
              <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 56, borderRadius: radius.md, borderWidth: 1.5, borderColor: c.lineStrong, backgroundColor: c.card, paddingHorizontal: 14, gap: 6 }}>
                <Text style={{ fontFamily: fonts.display, fontSize: size.xl, color: c.muted }}>₦</Text>
                <TextInput value={price ? Number(price).toLocaleString('en-NG') : ''} onChangeText={t => setPrice(t.replace(/\D/g, ''))} editable={!blocked} keyboardType="number-pad" accessibilityLabel="Your price in naira"
                  style={{ flex: 1, minWidth: 0, minHeight: 54, fontFamily: fonts.display, fontSize: size.xl, color: c.ink, fontVariant: ['tabular-nums'] }} />
              </View>
            </Field>
            <Row gap={8} wrap>{[5000, 6500, 8000].map(p => <Chip key={p} label={naira(p)} on={Number(price) === p} onPress={() => !blocked && setPrice(String(p))} />)}</Row>
            <Row gap={10}>
              <View style={{ flex: 1 }}><Field label="Pickup time"><Input value={pickup} onChangeText={setPickup} editable={!blocked} /></Field></View>
              <View style={{ flex: 1 }}><Field label="Delivered by"><Input value={by} onChangeText={setBy} editable={!blocked} /></Field></View>
            </Row>
            <Field label="Vehicle"><View style={{ padding: 12, borderRadius: radius.md, backgroundColor: c.sunken }}><T v="small">{T_.vehicle} · {T_.plate} · up to {T_.payload}</T></View></Field>
            <Field label="Note to buyer (optional)"><TextArea value={heavy ? '' : note} onChangeText={setNote} editable={!blocked} style={{ minHeight: 72 }} /></Field>
          </>}
        </Card>
      </Rise>
    </Screen>
  );
}
