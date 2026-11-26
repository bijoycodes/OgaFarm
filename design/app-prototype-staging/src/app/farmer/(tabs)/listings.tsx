/* Farmer · Listings: filter by status, update stock in a sheet, edit a product. States: default, empty. */
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { naira, PRODUCTS } from '@/data/sample';
import { useNav, useScreenState } from '@/proto/Proto';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, size, space } from '@/theme/tokens';
import { Badge, Button, Chip, Empty, IconButton, Press, Rise, Row, Status, T } from '@/ui/kit';
import { ListCard, Photo } from '@/ui/market';
import { Screen, TabHeader } from '@/ui/screen';

const MINE = PRODUCTS.filter(p => p.farm === 'okafor');
const FILTERS: [string, (p: (typeof MINE)[number]) => boolean][] = [
  ['All', () => true], ['Available', p => p.status === 'Available now'], ['Expected', p => p.status === 'Expected soon'], ['Seasonal', p => p.status === 'Seasonal'], ['Check stock', p => !!p.stale]
];

export default function Listings() {
  const { c } = useTheme();
  const [state] = useScreenState('/farmer/listings', 'Listings', ['default', 'empty']);
  const [filter, setFilter] = useState('All');
  const nav = useNav();
  const list = MINE.filter(FILTERS.find(f => f[0] === filter)![1]);
  const add = () => nav.push('/farmer/product-form', 'add');
  return (
    <Screen tabs refresh header={<TabHeader role="farmer" title="Listings" subtitle={state === 'empty' ? undefined : `${MINE.length} products · 1 needs a stock check`}
      right={<IconButton icon="plus" label="Add product" onPress={add} />} />}>
      {state === 'empty' ? (
        <Rise><Empty icon="box" title="No products yet" action={<Button title="Add product" icon="plus" onPress={add} />}>Add your first product with a price and quantity. It shows on your storefront right away.</Empty></Rise>
      ) : <>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space[4] }} contentContainerStyle={{ paddingHorizontal: space[4], gap: 8 }}>
          {FILTERS.map(([f, test]) => <Chip key={f} label={`${f} · ${MINE.filter(test).length}`} on={filter === f} onPress={() => setFilter(f)} />)}
        </ScrollView>
        <Rise>
          <ListCard>
            {list.map((p, i) => (
              <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderTopWidth: i ? 1 : 0, borderTopColor: c.line }}>
                <Press onPress={() => nav.push(`/farmer/product-form?id=${p.id}`, 'edit')} label={`Edit ${p.name}`} scaleTo={0.98} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Photo src={p.img} ratio={1} style={{ width: 60 }} />
                  <View style={{ flex: 1, gap: 3 }}>
                    <T v="label" numberOfLines={2}>{p.name}</T>
                    <Text style={{ fontFamily: fonts.body, fontSize: size.xs, color: c.muted, fontVariant: ['tabular-nums'] }}>{naira(p.price)} / {p.unit} · {p.qty}</Text>
                    <Row gap={6} wrap><Status s={p.status} />{p.stale && <Badge tone="warn" icon="clock">{p.confirmed}</Badge>}</Row>
                  </View>
                </Press>
                <Button title="Stock" small variant={p.stale ? 'primary' : 'secondary'} onPress={() => router.push(`/farmer/stock?id=${p.id}` as never)} />
              </View>
            ))}
          </ListCard>
        </Rise>
        <T v="xs" muted center>Tap a product to edit it. “Stock” confirms how much you have today.</T>
      </>}
    </Screen>
  );
}
