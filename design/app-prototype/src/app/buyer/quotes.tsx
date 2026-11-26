/* Buyer · Delivery quotes: compare verified transporters and accept one. States: waiting, ready.
   In "waiting" the other quotes arrive after a few seconds (with a haptic), like the real app would. */
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { DELIVERY as D, QUOTES } from '@/data/delivery';
import { naira } from '@/data/sample';
import { useNav, useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, size } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Alert, Badge, Button, Card, Kv, Rise, Row, T, TextLink } from '@/ui/kit';
import { Choice, Rating, Skel } from '@/ui/market';
import { Screen } from '@/ui/screen';

const ID = '/buyer/quotes';

export default function Quotes() {
  const { c } = useTheme();
  const [state, setState] = useScreenState(ID, 'Delivery quotes', ['waiting', 'ready']);
  const waiting = state === 'waiting';
  const [pick, setPick] = useState(0);
  const [paying, setPaying] = useState(false);
  const nav = useNav();
  const { toast } = useProto();
  const q = QUOTES[pick];

  useEffect(() => {
    if (!waiting) return;
    const t = setTimeout(() => { haptic.success(); setState('ready'); toast('2 more quotes arrived'); }, 4000);
    return () => clearTimeout(t);
  }, [waiting, setState, toast]);

  const pay = () => { setPaying(true); setTimeout(() => { setPaying(false); haptic.success(); nav.replace('/buyer/order', 'driver assigned'); }, 1400); };
  const list = waiting ? QUOTES.slice(0, 1) : QUOTES;

  return (
    <Screen footer={<>
      <Row between>
        <View><T v="xs" muted>Produce {naira(D.subtotal)} + delivery {naira(q.price)}</T><T v="label">Total</T></View>
        <Text style={{ fontFamily: fonts.display, fontSize: size.xl, color: c.ink, fontVariant: ['tabular-nums'] }}>{naira(D.subtotal + q.price)}</Text>
      </Row>
      <Button title={`Accept and pay ${naira(D.subtotal + q.price)}`} icon="lock" loading={paying} onPress={pay} />
    </>}>
      <Stack.Screen options={{ title: 'Delivery quotes' }} />
      <Rise style={{ gap: 4 }}>
        <T v="h1">Choose your delivery</T>
        <T v="small" muted>{D.item} · {D.qty} · from {D.farm} to {D.dropArea}</T>
      </Rise>

      {waiting && <Rise><Alert tone="info" icon="clock" title="Asking verified transporters near the farm">Your stock is held while you wait. We notify you as each quote arrives. 1 of 3 quotes received.</Alert></Rise>}

      <View style={{ gap: 10 }} accessibilityRole="radiogroup" accessibilityLabel="Delivery quotes">
        {list.map(({ t, price, when, tag }, i) => (
          <Rise key={t.id} i={i}>
            <Choice on={pick === i} onPress={() => setPick(i)} title={t.name}
              right={<Text style={{ fontFamily: fonts.display, fontSize: size.lg, color: c.ink, fontVariant: ['tabular-nums'] }}>{naira(price)}</Text>}>
              <Row gap={6} wrap>{t.verified && <Badge tone="ok" icon="shield">Verified</Badge>}{tag && <Badge tone="gold">{tag}</Badge>}</Row>
              <T v="xs" muted>{t.vehicle} · up to {t.payload} · {t.jobs} jobs</T>
              <Rating value={t.rating} count={t.reviews} />
              <Row gap={6} style={{ alignItems: 'flex-start' }}><Icon name="clock" size={14} color={c.muted} /><T v="xs" muted style={{ flex: 1 }}>{when}</T></Row>
            </Choice>
          </Rise>
        ))}
        {waiting && [0, 1].map(i => (
          <Card key={i} tight style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Skel w={40} h={40} r={20} />
            <View style={{ flex: 1, gap: 8 }}><Skel w="55%" /><Skel w="35%" h={10} /></View>
            <Skel w={56} h={18} />
          </Card>
        ))}
      </View>

      <Rise i={4}>
        <Card tone="sunken">
          <Kv rows={[[`${D.qty} × ${naira(D.unit)}`, naira(D.subtotal)], [`Delivery · ${q.t.name}`, naira(q.price)]]} />
          <T v="xs" muted>Produce and delivery are shown separately on your receipt. Only verified transporters can quote.</T>
          <TextLink title="How we check transporters" onPress={() => toast('ID, utility bill and a vehicle check before the first job')} />
        </Card>
      </Rise>
    </Screen>
  );
}
