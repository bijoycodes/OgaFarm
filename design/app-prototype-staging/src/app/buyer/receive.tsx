/* Buyer · Check your order at delivery: quantity, condition, photos, notes; then give the code or report.
   States: default, issue. */
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { DELIVERY as D } from '@/data/delivery';
import { useNav, useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Alert, Button, Card, Field, Input, Press, Rise, Row, T } from '@/ui/kit';
import { Choice, CodeCard, TextArea } from '@/ui/market';
import { Screen } from '@/ui/screen';

const ID = '/buyer/receive';
const CONDITIONS = ['Matches the order', 'Small difference', 'Damaged or spoiled', 'Wrong product'];

export default function Receive() {
  const { c } = useTheme();
  const [state, setState] = useScreenState(ID, 'Check your order', ['default', 'issue']);
  const issue = state === 'issue';
  const [got, setGot] = useState(issue ? '52' : '60');
  const [cond, setCond] = useState(issue ? 1 : 0);
  const [notes, setNotes] = useState(issue ? 'Third basket was half full.' : '');
  const [photos, setPhotos] = useState(issue ? 2 : 0);
  const nav = useNav();
  const { toast } = useProto();
  useEffect(() => { setGot(issue ? '52' : '60'); setCond(issue ? 1 : 0); setNotes(issue ? 'Third basket was half full.' : ''); setPhotos(issue ? 2 : 0); }, [issue]);
  const short = Number(got) < D.qtyN;

  return (
    <Screen keyboard footer={issue || short ? <>
      <Button title={`Accept ${got || 0} kg and report the shortfall`} onPress={() => { haptic.warn(); nav.replace('/buyer/dispute', 'open'); }} />
      <Button title="Refuse the delivery" variant="danger" onPress={() => toast('The driver returns the order and a case is opened')} />
    </> : <>
      <Button title="Everything is fine" icon="check" onPress={() => { haptic.success(); nav.replace('/buyer/order', 'delivered'); }} />
      <Button title="Something is wrong" icon="flag" variant="secondary" onPress={() => setState('issue')} />
    </>}>
      <Stack.Screen options={{ title: '' }} />
      <Rise style={{ gap: 4 }}>
        <T v="h1">Check your order</T>
        <T v="small" muted>Before you give your delivery code, check the quantity and condition with the driver.</T>
      </Rise>
      {(issue || short) && <Rise><Alert tone="warn" icon="alert" title={`${got || 0} kg received of ${D.qtyN} kg ordered`}>You can accept what arrived and report the shortfall. The order stays open until it is settled.</Alert></Rise>}

      <Rise i={1}>
        <Card>
          <Row gap={12} style={{ alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Field label="Ordered" hint={D.packing}>
                <View style={{ minHeight: 50, justifyContent: 'center', paddingHorizontal: 14, borderRadius: radius.md, backgroundColor: c.sunken }}>
                  <T v="label">{D.qty}</T>
                </View>
              </Field>
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Received (kg)" required error={short ? `${D.qtyN - Number(got || 0)} kg less than ordered.` : undefined}>
                <Input value={got} onChangeText={t => setGot(t.replace(/\D/g, ''))} keyboardType="number-pad" invalid={short} style={{ fontVariant: ['tabular-nums'] }} />
              </Field>
            </View>
          </Row>
        </Card>
      </Rise>

      <Rise i={2} style={{ gap: 10 }}>
        <T v="h3">Condition</T>
        {CONDITIONS.map((t, i) => <Choice key={t} on={cond === i} onPress={() => setCond(i)} title={t} />)}
      </Rise>

      <Rise i={3}>
        <Card>
          <T v="h3">Photos</T>
          <T v="xs" muted>{issue ? 'Show the baskets and the scale reading.' : 'Optional. Helps if anything needs checking later.'}</T>
          <Row gap={10} wrap>
            {Array.from({ length: photos }, (_, i) => (
              <View key={i} style={{ width: 72, height: 72, borderRadius: radius.md, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}><Icon name="image" size={24} color={c.primaryInk} /></View>
            ))}
            <Press onPress={() => { haptic.tap(); setPhotos(n => n + 1); toast('Photo added'); }} label="Add a photo"
              style={{ width: 72, height: 72, borderRadius: radius.md, borderWidth: 1.5, borderStyle: 'dashed', borderColor: c.lineStrong, alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Icon name="camera" size={22} color={c.ink2} /><T v="xs" muted>Add</T>
            </Press>
          </Row>
          <Field label="Notes (optional)"><TextArea value={notes} onChangeText={setNotes} placeholder="Anything the farmer or transporter should know" /></Field>
        </Card>
      </Rise>

      {!issue && !short && <Rise i={4}><CodeCard label="All good? Give the driver your code" code={D.code} note="The driver enters it to confirm delivery." /></Rise>}
    </Screen>
  );
}
