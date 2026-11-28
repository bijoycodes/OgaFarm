/* Farmer · Add or edit a product: photos, name, category, storefront tab, unit, price, quantity,
   minimum order, availability, dates, pickup, description. States: add, edit. */
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { AVAILABILITY, STORE_TABS, UNITS } from '@/data/farmer';
import { PRODUCTS } from '@/data/sample';
import { useNav, useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Button, Card, Chip, Field, Input, Press, Rise, Row, T } from '@/ui/kit';
import { Photo, TextArea } from '@/ui/market';
import { Screen } from '@/ui/screen';
import { Select } from '@/ui/select';

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains & cereals', 'Tubers & roots', 'Eggs & poultry', 'Fish', 'Processed foods'];

export default function ProductForm() {
  const { c } = useTheme();
  const [state] = useScreenState('/farmer/product-form', 'Add or edit product', ['add', 'edit']);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const edit = state === 'edit';
  const p = PRODUCTS.find(x => x.id === id) ?? PRODUCTS[0];
  const nav = useNav();
  const { toast } = useProto();
  const [photos, setPhotos] = useState(edit ? 3 : 0);
  const [name, setName] = useState(edit ? p.name : '');
  const [cat, setCat] = useState(edit ? p.cat : 'Vegetables');
  const [tab, setTab] = useState('Vegetables');
  const [unit, setUnit] = useState(edit ? p.unit : 'kg');
  const [price, setPrice] = useState(edit ? String(p.price) : '');
  const [qty, setQty] = useState(edit ? p.qty.replace(/[^\d]/g, '') : '');
  const [min, setMin] = useState(edit ? String(p.min) : '1');
  const [avail, setAvail] = useState(edit ? p.status : 'Available now');
  const [from, setFrom] = useState('23 Nov 2026');
  const [until, setUntil] = useState('15 Dec 2026');
  const [pickup, setPickup] = useState('Farm gate, Issele-Uku');
  const [desc, setDesc] = useState(edit ? 'Firm, deep-red Roma tomatoes for stews and sauces. Picked to order and sorted by size.' : '');
  const [tried, setTried] = useState(false);
  const missing = { name: !name.trim(), price: !Number(price), qty: !Number(qty), photos: photos === 0 };
  const invalid = Object.values(missing).some(Boolean);

  const publish = () => {
    setTried(true);
    if (invalid) { haptic.warn(); toast('Fill in the marked fields'); return; }
    haptic.success(); toast(edit ? 'Changes saved' : 'Product published'); nav.replace('/farmer/listings');
  };

  return (
    <Screen keyboard footer={<Row gap={10}>
      <Button title="Save draft" variant="secondary" onPress={() => { toast('Saved as draft'); nav.replace('/farmer/listings'); }} />
      <Button title={edit ? 'Save changes' : 'Publish product'} icon="check" onPress={publish} style={{ flex: 1 }} />
    </Row>}>
      <Stack.Screen options={{ title: '' }} />
      <Rise style={{ gap: 4 }}>
        <T v="h1">{edit ? 'Edit product' : 'Add a product'}</T>
        <T v="small" muted>Clear photos and an honest stock count get more orders.</T>
      </Rise>

      <Rise i={1}>
        <Card>
          <Row between><T v="h3">Photos</T><T v="xs" muted>{photos} of 6</T></Row>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {Array.from({ length: photos }, (_, i) => <Photo key={i} src={p.img} ratio={1} style={{ width: 88 }} label={`Photo ${i + 1}`} />)}
            {photos < 6 && (
              <Press onPress={() => { haptic.tap(); setPhotos(n => n + 1); }} label="Add photo"
                style={{ width: 88, height: 88, borderRadius: radius.md, borderWidth: 1.5, borderStyle: 'dashed', borderColor: tried && missing.photos ? c.danger : c.lineStrong, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Icon name="camera" size={22} color={c.ink2} /><T v="xs" muted>Add photo</T>
              </Press>
            )}
          </ScrollView>
          <T v="xs" color={tried && missing.photos ? c.danger : c.muted}>{tried && missing.photos ? 'Add at least one photo.' : 'Up to 6 photos. We compress them so they load fast on mobile data.'}</T>
        </Card>
      </Rise>

      <Rise i={2}>
        <Card>
          <Field label="Product name" required error={tried && missing.name ? 'Enter a product name.' : undefined}>
            <Input value={name} onChangeText={setName} placeholder="e.g. Fresh tomatoes (Roma)" invalid={tried && missing.name} />
          </Field>
          <Field label="Category"><Select label="Category" options={CATEGORIES} value={cat} onChange={setCat} /></Field>
          <Field label="Storefront tab" hint="Which tab of your storefront it shows under."><Select label="Storefront tab" options={STORE_TABS} value={tab} onChange={setTab} /></Field>
        </Card>
      </Rise>

      <Rise i={3}>
        <Card>
          <T v="h3">Price and quantity</T>
          <Field label="Sell by"><Select label="Sell by" options={UNITS} value={unit} onChange={setUnit} /></Field>
          <Row gap={10} style={{ alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}><Field label={`Price per ${unit}`} required error={tried && missing.price ? 'Enter a price.' : undefined}>
              <Input value={price} onChangeText={t => setPrice(t.replace(/\D/g, ''))} keyboardType="number-pad" placeholder="₦" invalid={tried && missing.price} />
            </Field></View>
            <View style={{ flex: 1 }}><Field label="Quantity" required error={tried && missing.qty ? 'Enter a quantity.' : undefined}>
              <Input value={qty} onChangeText={t => setQty(t.replace(/\D/g, ''))} keyboardType="number-pad" invalid={tried && missing.qty} />
            </Field></View>
          </Row>
          <Field label={`Minimum order (${unit})`}><Input value={min} onChangeText={t => setMin(t.replace(/\D/g, ''))} keyboardType="number-pad" /></Field>
        </Card>
      </Rise>

      <Rise i={4}>
        <Card>
          <T v="h3">Availability</T>
          <Field label="Status"><Select label="Availability" options={AVAILABILITY} value={avail} onChange={setAvail} /></Field>
          <Row gap={10}>
            <View style={{ flex: 1 }}><Field label="From"><Input value={from} onChangeText={setFrom} /></Field></View>
            <View style={{ flex: 1 }}><Field label="Until"><Input value={until} onChangeText={setUntil} /></Field></View>
          </Row>
          <Field label="Pickup location"><Input value={pickup} onChangeText={setPickup} /></Field>
          <Field label="Description" hint="Size, freshness, packing. Keep it honest."><TextArea value={desc} onChangeText={setDesc} /></Field>
        </Card>
      </Rise>
    </Screen>
  );
}
