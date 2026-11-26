/* Buyer · Farm storefront: cover, farm details, category tabs, products, about. States: default, loading. */
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { FARMS, PHOTOS, PRODUCTS } from '@/data/sample';
import { useNav, useProto, useScreenState } from '@/proto/Proto';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size, space } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Button, Card, Chip, Empty, IconButton, Kv, Rise, Row, T, Verified } from '@/ui/kit';
import { Photo, ProductCard, ProductCardSkeleton, shareLink } from '@/ui/market';
import { Screen } from '@/ui/screen';

const TABS = ['All products', 'Vegetables', 'Fruits', 'Grains & cereals', 'Eggs & poultry', 'Fish', 'Processed foods'];

export default function Storefront() {
  const { c } = useTheme();
  const { farm } = useLocalSearchParams<{ farm?: string }>();
  const key = (farm && farm in FARMS ? farm : 'okafor') as keyof typeof FARMS;
  const f = FARMS[key] as (typeof FARMS)['okafor'];
  const [state] = useScreenState('/buyer/storefront', 'Farm storefront', ['default', 'loading']);
  const [tab, setTab] = useState(TABS[0]);
  const nav = useNav();
  const { toast } = useProto();
  const mine = PRODUCTS.filter(p => p.farm === key);
  const tabs = TABS.filter(t => t === TABS[0] || mine.some(p => p.cat === t));
  const shown = tab === TABS[0] ? mine : mine.filter(p => p.cat === tab);
  const share = () => shareLink(`${f.name} on OgaFarm`, `https://farmoga.com/farm/${f.slug}`, toast);

  return (
    <>
      <Stack.Screen options={{ title: '', headerRight: () => <IconButton icon="share" label="Share storefront" onPress={share} /> }} />
      <Screen pad={false}>
        <View>
          <Photo src={PHOTOS.farmCover} ratio={16 / 7} rounded={0} label={`Cover photo of ${f.name}`} />
          <View style={{ position: 'absolute', left: space[4], bottom: -30, width: 72, height: 72, borderRadius: radius.lg, backgroundColor: c.primary, borderWidth: 3, borderColor: c.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fonts.display, fontSize: size.xl, color: c.onPrimary }}>{f.initials}</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: space[4], paddingTop: 34, gap: space[4] }}>
          <Rise style={{ gap: 8 }}>
            <Row gap={8} wrap><T v="h1">{f.name}</T>{f.verified && <Verified />}</Row>
            <View style={{ gap: 4 }}>
              <Row gap={6}><Icon name="pin" size={15} color={c.muted} /><T v="small" muted>{f.place}</T></Row>
              {f.hours && <Row gap={6}><Icon name="clock" size={15} color={c.muted} /><T v="small" muted>{f.hours}</T></Row>}
              <Row gap={6}><Icon name="star" size={15} weight="fill" color={c.harvestFill} /><T v="small" muted>{f.rating} · {f.reviews} reviews from buyers</T></Row>
            </View>
            <Row gap={10}>
              <Button title="Share" icon="share" variant="secondary" small onPress={share} style={{ flex: 1 }} />
              <Button title="Message" icon="chat" variant="soft" small onPress={() => toast('Messaging arrives in version 5')} style={{ flex: 1 }} />
            </Row>
          </Rise>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space[4] }} contentContainerStyle={{ paddingHorizontal: space[4], gap: 8 }}>
            {tabs.map(t => <Chip key={t} label={t} on={tab === t} onPress={() => setTab(t)} />)}
          </ScrollView>

          {state === 'loading'
            ? [0, 1].map(i => <ProductCardSkeleton key={i} />)
            : shown.length ? shown.map((p, i) => <Rise key={p.id} i={i}><ProductCard p={p} onPress={() => nav.push(`/buyer/product?id=${p.id}`, 'default')} /></Rise>)
            : <Empty icon="leaf" title="Nothing in this category yet" />}

          <Rise i={3}>
            <Card>
              <T v="h3">About the farm</T>
              <T v="small" muted>Family-run mixed farm growing vegetables, plantain and maize on 6 hectares. Harvested to order, picked up fresh from our gate.</T>
              <Kv rows={[['Pickup', 'Farm gate, Issele-Uku'], ['Hours', 'Mon–Sat, 7am–5pm'], ['On OgaFarm since', f.since ?? 'June 2026'], ['Farm type', f.type ?? 'Mixed farm']]} />
              <T v="xs" muted>Prices and stock are set and confirmed by the farmer. Last stock update today, 9:20 am.</T>
            </Card>
          </Rise>
        </View>
      </Screen>
    </>
  );
}
