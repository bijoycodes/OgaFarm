/* Buyer · My orders: active and past orders, each opens its status screen. States: default, empty. */
import { useState } from 'react';
import { Text, View } from 'react-native';
import { BUYER_ORDERS } from '@/data/delivery';
import { naira } from '@/data/sample';
import { useNav, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Button, Card, Empty, Press, Rise, Row, Status, T } from '@/ui/kit';
import { Screen, TabHeader } from '@/ui/screen';

const DONE = ['Delivered', 'Collected'];

export default function Orders() {
  const { c } = useTheme();
  const [state] = useScreenState('/buyer/orders', 'My orders', ['default', 'empty']);
  const [tab, setTab] = useState<'Active' | 'Past'>('Active');
  const nav = useNav();
  const list = BUYER_ORDERS.filter(o => (tab === 'Past') === DONE.includes(o.status));
  return (
    <Screen tabs refresh header={<TabHeader role="buyer" title="My orders" />}>
      {state === 'empty' ? (
        <Rise><Empty icon="receipt" title="No orders yet" action={<Button title="Browse produce" onPress={() => nav.replace('/buyer/browse')} />}>Fresh produce from verified farms is a few taps away.</Empty></Rise>
      ) : <>
        <View accessibilityRole="tablist" style={{ flexDirection: 'row', padding: 4, gap: 4, borderRadius: radius.md, backgroundColor: c.sunken }}>
          {(['Active', 'Past'] as const).map(t => {
            const n = BUYER_ORDERS.filter(o => (t === 'Past') === DONE.includes(o.status)).length;
            return (
              <Press key={t} onPress={() => { haptic.select(); setTab(t); }} role="tab" selected={tab === t} label={`${t}, ${n}`}
                style={{ flex: 1, minHeight: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: tab === t ? c.card : 'transparent' }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.sm, color: tab === t ? c.primaryInk : c.muted }}>{t} · {n}</Text>
              </Press>
            );
          })}
        </View>
        {list.map((o, i) => (
          <Rise key={o.id} i={i}>
            <Card onPress={() => nav.push('/buyer/order', o.state)}>
              <Row between>
                <Row gap={8}><Icon name={o.how === 'Delivery' ? 'truck' : 'pin'} size={16} color={c.muted} /><T v="xs" muted>{o.id} · {o.how}</T></Row>
                <Status s={o.status} />
              </Row>
              <View style={{ gap: 2 }}>
                <T v="label">{o.item}</T>
                <T v="xs" muted>{o.farm}</T>
              </View>
              <Row between>
                <Text style={{ fontFamily: fonts.display, fontSize: size.lg, color: c.ink, fontVariant: ['tabular-nums'] }}>{naira(o.total)}</Text>
                <Row gap={4}><T v="small" color={c.primaryInk} bold>{o.status === 'In transit' ? 'Track' : 'View'}</T><Icon name="chev" size={14} color={c.primaryInk} /></Row>
              </Row>
            </Card>
          </Rise>
        ))}
      </>}
    </Screen>
  );
}
