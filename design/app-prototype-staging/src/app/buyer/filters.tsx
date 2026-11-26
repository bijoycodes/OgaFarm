/* Buyer · Filters (native form sheet over Browse). Changes apply live; the button shows how many match. */
import { router } from 'expo-router';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AVAIL, CATS, RADIUS, SORTS } from '@/data/delivery';
import { PRODUCTS } from '@/data/sample';
import { applyFilters, DEFAULT_FILTERS, setFilters, useFilters } from '@/proto/filters';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size, space } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Button, Chip, IconButton, Press, Row, SwitchCard, T } from '@/ui/kit';

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <Row between><T v="label">{title}</T>{note && <T v="xs" muted>{note}</T>}</Row>
      {children}
    </View>
  );
}

function Segmented<V extends string>({ items, value, onChange, label }: { items: readonly V[]; value: V; onChange: (v: V) => void; label: string }) {
  const { c } = useTheme();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: 'row', padding: 4, gap: 4, borderRadius: radius.md, backgroundColor: c.sunken }}>
      {items.map(it => (
        <Press key={it} onPress={() => { haptic.select(); onChange(it); }} role="radio" selected={value === it} label={it}
          style={{ flex: 1, minHeight: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, backgroundColor: value === it ? c.card : 'transparent' }}>
          <Text numberOfLines={1} style={{ fontFamily: fonts.bodyBold, fontSize: size.sm, color: value === it ? c.primaryInk : c.muted }}>{it}</Text>
        </Press>
      ))}
    </View>
  );
}

export default function FiltersSheet() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const f = useFilters();
  const n = applyFilters(f).length;
  const toggle = (key: 'cats' | 'avail', v: string) => setFilters(s => ({ [key]: s[key].includes(v) ? s[key].filter(x => x !== v) : [...s[key], v] }));
  const priceBox = (label: string, value: number, set: (v: number) => void) => (
    <View style={{ flex: 1, gap: 4 }}>
      <T v="xs" muted>{label}</T>
      <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48, borderRadius: radius.md, borderWidth: 1, borderColor: c.lineStrong, backgroundColor: c.card, paddingHorizontal: 12, gap: 4 }}>
        <Text style={{ fontFamily: fonts.bodyBold, color: c.muted }}>₦</Text>
        <TextInput value={value ? value.toLocaleString('en-NG') : ''} placeholder={label === 'Min' ? '0' : 'Any'} placeholderTextColor={c.muted} keyboardType="number-pad" accessibilityLabel={`${label} price in naira`}
          onChangeText={t => set(Number(t.replace(/\D/g, '')) || 0)} style={{ flex: 1, minWidth: 0, minHeight: 46, fontFamily: fonts.bodyBold, fontSize: size.md, color: c.ink, fontVariant: ['tabular-nums'] }} />
      </View>
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Row between style={{ paddingHorizontal: space[4], paddingTop: space[4], paddingBottom: space[3] }}>
        <T v="h2">Filters</T>
        <IconButton icon="close" label="Close filters" onPress={() => router.back()} />
      </Row>
      <ScrollView contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: space[5], gap: space[5] }} keyboardShouldPersistTaps="handled">
        <Section title="Sort by"><Row gap={8} wrap>{SORTS.map(o => <Chip key={o} label={o} on={f.sort === o} onPress={() => setFilters({ sort: o })} />)}</Row></Section>

        <Section title="Category" note={f.cats.length ? `${f.cats.length} selected` : 'Choose one or more'}>
          <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, overflow: 'hidden' }}>
            {CATS.map(([name, icon], i) => {
              const on = f.cats.includes(name), count = PRODUCTS.filter(p => p.cat === name).length;
              return (
                <Press key={name} onPress={() => { haptic.select(); toggle('cats', name); }} role="checkbox" selected={on} label={`${name}, ${count}`} scaleTo={0.99}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingHorizontal: 14, borderTopWidth: i ? 1 : 0, borderTopColor: c.line, backgroundColor: on ? c.primarySoft : 'transparent' }}>
                  <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center', borderColor: on ? c.primary : c.lineStrong, backgroundColor: on ? c.primary : 'transparent' }}>
                    {on && <Icon name="check" size={13} color={c.onPrimary} weight="bold" />}
                  </View>
                  <Icon name={icon} size={18} color={c.ink2} />
                  <Text style={{ flex: 1, fontFamily: fonts.bodySemi, fontSize: size.md, color: c.ink }}>{name}</Text>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.xs, color: c.muted }}>{count}</Text>
                </Press>
              );
            })}
          </View>
        </Section>

        <Section title="Distance from Asaba"><Segmented items={RADIUS} value={f.radius} onChange={radius => setFilters({ radius })} label="Distance" /></Section>

        <Section title="Price per unit">
          <Row gap={10} style={{ alignItems: 'flex-end' }}>
            {priceBox('Min', f.min, min => setFilters({ min }))}
            <View style={{ width: 12, height: 2, backgroundColor: c.lineStrong, marginBottom: 23 }} />
            {priceBox('Max', f.max, max => setFilters({ max }))}
          </Row>
        </Section>

        <Section title="Availability">
          <Row gap={8} wrap>{AVAIL.map(([a]) => <Chip key={a} label={a} on={f.avail.includes(a)} onPress={() => toggle('avail', a)} />)}</Row>
        </Section>

        <Section title="Trust">
          <SwitchCard label="Verified farms only" on={f.verified} onChange={verified => setFilters({ verified })} onText="Checked by the OgaFarm team" offText="Show all farms" />
          <SwitchCard label="Fresh stock only" on={f.fresh} onChange={fresh => setFilters({ fresh })} onText="Stock confirmed today" offText="Any confirmation date" />
        </Section>
      </ScrollView>
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: space[4], paddingTop: space[3], paddingBottom: Math.max(insets.bottom, space[3]), borderTopWidth: 1, borderTopColor: c.line, backgroundColor: c.card }}>
        <Button title="Clear all" variant="secondary" onPress={() => setFilters({ ...DEFAULT_FILTERS, q: f.q })} />
        <Button title={n ? `Show ${n} ${n === 1 ? 'result' : 'results'}` : 'No results'} onPress={() => router.back()} style={{ flex: 1 }} />
      </View>
    </View>
  );
}
