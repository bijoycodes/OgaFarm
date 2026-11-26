/* Buyer · Product: swipeable photos, price, stock facts, quantity, pickup or delivery, the farm, Buy now bar.
   States: default, sold out. */
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { FARMS, naira, PRODUCTS, qtyText, unitFor } from '@/data/sample';
import { useNav, useProto, useScreenState } from '@/proto/Proto';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size, space } from '@/theme/tokens';
import { Alert, Badge, Button, Card, IconButton, Kv, Rise, Row, Status, T, Verified } from '@/ui/kit';
import { Stepper, Who, shareLink } from '@/ui/market';
import { Screen } from '@/ui/screen';

const ABOUT: Record<string, string> = {
  crop: 'Picked to order and sorted by size. Packed in reusable crates (crate deposit refunded on return).',
  animal: 'Collected daily from healthy, vaccinated layers. Packed in 30-egg crates.',
  bulk: 'Dried, cleaned and bagged at the farm. Weight checked on a calibrated scale before pickup.',
  fish: 'Pond-raised and sold live. Weighed in front of you; cleaning on request.'
};
const CROPS = [{ left: '50%', top: '50%' }, { left: '15%', top: '30%' }, { left: '85%', top: '70%' }, { left: '50%', top: '95%' }] as const;

export default function ProductScreen() {
  const { c } = useTheme();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const p = PRODUCTS.find(x => x.id === id) ?? PRODUCTS[0], f = FARMS[p.farm];
  const [state] = useScreenState('/buyer/product', 'Product', ['default', 'sold out']);
  const out = state === 'sold out';
  const [qty, setQty] = useState(p.min);
  const [slide, setSlide] = useState(0);
  const nav = useNav();
  const { toast } = useProto();
  const share = () => shareLink(`${p.name} from ${f.name} on OgaFarm`, `https://farmoga.com/product/${p.id}`, toast);
  // Each photo is exactly as wide as its box (measured), so swiping lands on whole photos at any screen size
  const [photoW, setPhotoW] = useState(Math.min(width, 720) - space[4] * 2);

  return (
    <>
      <Stack.Screen options={{ title: '', headerRight: () => <IconButton icon="share" label="Share product" onPress={share} /> }} />
      <Screen footer={out
        ? <Button title="Notify me when available" icon="bell" onPress={() => toast('We will tell you when it is back')} />
        : <Row gap={12}>
            <View style={{ flex: 1 }}><T v="xs" muted>{qtyText(qty, p.unit)} × {naira(p.price)}</T><Text style={{ fontFamily: fonts.display, fontSize: size.xl, color: c.ink, fontVariant: ['tabular-nums'] }}>{naira(qty * p.price)}</Text></View>
            <Button title="Buy now" onPress={() => nav.push(`/buyer/checkout?id=${p.id}&qty=${qty}`, 'pickup')} style={{ flex: 1.3 }} />
          </Row>}>
        {/* Photos: swipe left and right */}
        <Rise>
          <View onLayout={e => setPhotoW(Math.round(e.nativeEvent.layout.width))} style={{ borderRadius: radius.lg, overflow: 'hidden', backgroundColor: c.sunken }}>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={e => setSlide(Math.round(e.nativeEvent.contentOffset.x / photoW))}
              accessibilityLabel={`Photos of ${p.name}, ${CROPS.length} photos`}>
              {CROPS.map((pos, i) => <Image key={i} source={p.img as never} contentFit="cover" contentPosition={pos} transition={300} style={{ width: photoW, aspectRatio: 4 / 3 }} accessibilityLabel={`${p.name}, photo ${i + 1}`} />)}
            </ScrollView>
            <View style={{ position: 'absolute', top: 12, left: 12 }}><Status s={out ? 'Sold out' : p.status} /></View>
            <View style={{ position: 'absolute', bottom: 10, alignSelf: 'center', flexDirection: 'row', gap: 6, padding: 6, borderRadius: radius.full, backgroundColor: 'rgba(0,0,0,0.35)' }}>
              {CROPS.map((_, i) => <View key={i} style={{ width: i === slide ? 16 : 6, height: 6, borderRadius: 3, backgroundColor: i === slide ? '#fff' : 'rgba(255,255,255,0.6)' }} />)}
            </View>
          </View>
        </Rise>

        <Rise i={1} style={{ gap: 6 }}>
          <Badge>{p.cat}</Badge>
          <T v="h1">{p.name}</T>
          <Text style={{ fontFamily: fonts.display, fontSize: size.x2, color: c.ink, fontVariant: ['tabular-nums'] }}>
            {naira(p.price)} <Text style={{ fontFamily: fonts.body, fontSize: size.md, color: c.muted }}>per {p.unit}</Text>
          </Text>
        </Rise>

        {out ? (
          <Rise i={2}><Alert tone="warn" icon="alert" title="Sold out for now">The farmer expects more on 30 Nov. Ask to be notified, or see similar produce.</Alert></Rise>
        ) : (
          <Rise i={2}>
            <Card>
              <Kv rows={[['Available', p.qty], ['Minimum order', qtyText(p.min, p.unit)], ['Available until', '15 Dec 2026'], ['Stock confirmed', p.confirmed]]} />
              <View style={{ height: 1, backgroundColor: c.line }} />
              <Row between>
                <View style={{ gap: 2, flex: 1 }}><T v="label">Quantity</T><T v="xs" muted>Minimum {qtyText(p.min, p.unit)}</T></View>
                <Stepper value={qty} onChange={setQty} min={p.min} step={p.min >= 10 ? 5 : 1} unit={unitFor(p.unit, qty)} label="Quantity" />
              </Row>
            </Card>
          </Rise>
        )}

        <Rise i={3}><Alert tone="info" icon="truck" title="Pickup or delivery">Collect at the farm gate, or get it delivered by a verified transporter. You see their price before you pay.</Alert></Rise>

        <Rise i={4}>
          <Card onPress={() => nav.push(`/buyer/storefront?farm=${p.farm}`, 'default')}>
            <Who initials={f.initials} name={f.name} sub={`${f.place} · ★ ${f.rating} (${f.reviews})`} right={<T v="small" color={c.primaryInk} bold>Visit</T>} />
            {f.verified && <Verified />}
          </Card>
        </Rise>

        <Rise i={5}>
          <Card>
            <T v="h3">About this product</T>
            <T v="small" muted>{ABOUT[p.kind]}</T>
            <Row gap={10}>
              <Button title="Share" icon="share" variant="secondary" small onPress={share} style={{ flex: 1 }} />
              <Button title="Message" icon="chat" variant="secondary" small onPress={() => toast('Messaging arrives in version 5')} style={{ flex: 1 }} />
            </Row>
          </Card>
        </Rise>
      </Screen>
    </>
  );
}
