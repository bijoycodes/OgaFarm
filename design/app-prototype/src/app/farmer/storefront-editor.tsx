/* Farmer · Storefront editor: cover, logo, name, link (checks if taken), about, pickup, hours,
   and up to five storefront tabs from a template. States: default, slug taken. */
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { FARM_TYPES, STORE_TABS } from '@/data/farmer';
import { PHOTOS } from '@/data/sample';
import { useNav, useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Button, Card, Chip, Field, Input, Rise, Row, T } from '@/ui/kit';
import { Photo, TextArea } from '@/ui/market';
import { Screen } from '@/ui/screen';

const TEMPLATES: Record<string, string[]> = {
  'Mixed farm': STORE_TABS,
  'Crop farm': ['Vegetables', 'Fruits', 'Grains & cereals', 'Tubers & roots', 'Processed & dried'],
  'Poultry farm': ['Eggs', 'Live birds', 'Dressed chicken', 'Manure', 'Feed'],
  'Livestock farm': ['Goats', 'Cattle', 'Pigs', 'Sheep', 'Meat'],
  'Fish farm': ['Live fish', 'Smoked fish', 'Fingerlings', 'Juveniles', 'Feed']
};

export default function StorefrontEditor() {
  const { c } = useTheme();
  const [state] = useScreenState('/farmer/storefront-editor', 'Storefront editor', ['default', 'slug taken']);
  const nav = useNav();
  const { toast } = useProto();
  const [name, setName] = useState('Okafor Family Farm');
  const [slug, setSlug] = useState('okafor-family-farm');
  const [about, setAbout] = useState('Family-run mixed farm growing vegetables, plantain and maize on 6 hectares. Harvested to order, picked up fresh from our gate.');
  const [pickup, setPickup] = useState('Farm gate, Issele-Uku');
  const [hours, setHours] = useState('Mon–Sat · 7:00 am – 5:00 pm');
  const [template, setTemplate] = useState('Mixed farm');
  const [tabs, setTabs] = useState(STORE_TABS);
  useEffect(() => { setSlug(state === 'slug taken' ? 'okafor-farm' : 'okafor-family-farm'); }, [state]);
  const taken = slug === 'okafor-farm';
  const save = () => { if (taken) { haptic.warn(); toast('Choose a link that is not taken'); return; } haptic.success(); toast('Storefront saved'); nav.replace('/farmer/farm'); };

  return (
    <Screen keyboard footer={<Row gap={10}>
      <Button title="Preview" icon="eye" variant="secondary" onPress={() => nav.push('/buyer/storefront?farm=okafor', 'default')} />
      <Button title="Save changes" icon="check" onPress={save} style={{ flex: 1 }} />
    </Row>}>
      <Stack.Screen options={{ title: 'Edit storefront' }} />
      <Rise>
        <Card>
          <T v="h3">Photos</T>
          <View>
            <Photo src={PHOTOS.farmCover} ratio={16 / 6} label="Cover photo" />
            <View style={{ position: 'absolute', right: 8, bottom: 8 }}><Button title="Change cover" icon="image" small variant="secondary" onPress={() => toast('Choose a cover photo')} /></View>
          </View>
          <Row gap={12}>
            <View style={{ width: 64, height: 64, borderRadius: radius.lg, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: fonts.display, fontSize: size.xl, color: c.onPrimary }}>OF</Text>
            </View>
            <View style={{ flex: 1, gap: 6 }}><T v="label">Logo</T><Button title="Upload logo" icon="upload" small variant="secondary" onPress={() => toast('Choose a logo')} style={{ alignSelf: 'flex-start' }} /></View>
          </Row>
        </Card>
      </Rise>

      <Rise i={1}>
        <Card>
          <Field label="Farm name"><Input value={name} onChangeText={setName} /></Field>
          <Field label="Storefront link" error={taken ? 'okafor-farm is taken. Try okafor-family-farm or okafor-farm-issele-uku.' : undefined}>
            <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 50, borderRadius: radius.md, borderWidth: 1, borderColor: taken ? c.danger : c.lineStrong, backgroundColor: c.card, overflow: 'hidden' }}>
              <View style={{ alignSelf: 'stretch', justifyContent: 'center', paddingHorizontal: 10, backgroundColor: c.sunken }}><T v="xs" muted>farmoga.com/farm/</T></View>
              <Input value={slug} onChangeText={t => setSlug(t.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} autoCapitalize="none" style={{ flex: 1, borderWidth: 0, minHeight: 48, borderRadius: 0 }} />
            </View>
          </Field>
          {!taken && <Row gap={6}><Icon name="check" size={15} color={c.ok} weight="bold" /><T v="xs" color={c.ok} bold>Available</T></Row>}
          {taken && <Row gap={8} wrap>{['okafor-family-farm', 'okafor-farm-issele-uku'].map(s => <Chip key={s} label={s} onPress={() => setSlug(s)} />)}</Row>}
          <Field label="About your farm"><TextArea value={about} onChangeText={setAbout} /></Field>
          <Field label="Pickup location"><Input value={pickup} onChangeText={setPickup} /></Field>
          <Field label="Opening hours"><Input value={hours} onChangeText={setHours} /></Field>
        </Card>
      </Rise>

      <Rise i={2}>
        <Card>
          <View style={{ gap: 2 }}><T v="h3">Storefront tabs</T><T v="small" muted>Up to five tabs. Products stay unlimited.</T></View>
          <Field label="Start from a template"><Row gap={8} wrap>{FARM_TYPES.map(t => <Chip key={t} label={t} on={template === t} onPress={() => { setTemplate(t); setTabs(TEMPLATES[t]); }} />)}</Row></Field>
          {tabs.map((t, i) => (
            <Field key={i} label={`Tab ${i + 1}`}><Input value={t} onChangeText={v => setTabs(ts => ts.map((x, j) => j === i ? v : x))} /></Field>
          ))}
          <T v="xs" muted>Renaming a tab keeps all its products.</T>
        </Card>
      </Rise>
    </Screen>
  );
}
