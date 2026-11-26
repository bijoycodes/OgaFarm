/* Farmer · Update stock (native form sheet): quantity and availability, then confirm. Opens on Yellow maize
   (the stale listing) unless a product id is passed. */
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AVAILABILITY } from '@/data/farmer';
import { PRODUCTS } from '@/data/sample';
import { useProto } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Alert, Button, Chip, Field, IconButton, Row, T } from '@/ui/kit';
import { Photo, Stepper } from '@/ui/market';

export default function Stock() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const p = PRODUCTS.find(x => x.id === id) ?? PRODUCTS.find(x => x.stale)!;
  const [qty, setQty] = useState(parseInt(p.qty.replace(/,/g, ''), 10) || 0);
  const [avail, setAvail] = useState(p.status);
  const { toast, setScreenState } = useProto();
  const unit = p.qty.replace(/^[\d,]+\s*/, '');
  const step = qty >= 200 ? 50 : qty >= 20 ? 5 : 1;
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Row between style={{ paddingHorizontal: space[4], paddingTop: space[4], paddingBottom: space[3] }}>
        <T v="h2">Update stock</T>
        <IconButton icon="close" label="Close" onPress={() => router.back()} />
      </Row>
      <ScrollView contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: space[5], gap: space[4] }}>
        <Row gap={12}>
          <Photo src={p.img} ratio={1} style={{ width: 56 }} />
          <View style={{ flex: 1 }}><T v="label">{p.name}</T><T v="xs" muted>Last confirmed {p.confirmed}</T></View>
        </Row>
        {p.stale && <Alert tone="warn" icon="clock">Buyers see when stock was last confirmed. Fresh confirmations get more orders.</Alert>}
        <Field label={`How much do you have today? (${unit})`}><Stepper value={qty} onChange={setQty} min={0} step={step} unit={unit} label="Quantity available" /></Field>
        <Field label="Availability"><Row gap={8} wrap>{AVAILABILITY.map(a => <Chip key={a} label={a} on={avail === a} onPress={() => setAvail(a)} />)}<Chip label="Sold out" on={avail === 'Sold out'} onPress={() => setAvail('Sold out')} /></Row></Field>
      </ScrollView>
      <View style={{ paddingHorizontal: space[4], paddingTop: space[3], paddingBottom: Math.max(insets.bottom, space[3]), borderTopWidth: 1, borderTopColor: c.line, backgroundColor: c.card }}>
        <Button title="Confirm stock is correct" icon="check" onPress={() => { haptic.success(); if (p.stale) setScreenState('farmer:stock', 'confirmed'); router.back(); toast(`${p.name} confirmed · ${qty} ${unit}`); }} />
      </View>
    </View>
  );
}
