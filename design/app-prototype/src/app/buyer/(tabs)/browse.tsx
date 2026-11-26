/* Buyer · Browse produce: search, category chips (multi-select), Filters sheet, removable active filters,
   results (one card per row on phones, two on tablets). States: default, loading, empty, error. */
import { router } from 'expo-router';
import { ScrollView, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { CATS } from '@/data/delivery';
import { useNav, useProto, useScreenState } from '@/proto/Proto';
import { activeChips, applyFilters, DEFAULT_FILTERS, setFilters, useFilters } from '@/proto/filters';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size, space, tap } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Button, Chip, Empty, Press, Rise, Row, T } from '@/ui/kit';
import { ProductCard, ProductCardSkeleton } from '@/ui/market';
import { Screen, TabHeader } from '@/ui/screen';

export default function Browse() {
  const { c } = useTheme();
  const { width } = useWindowDimensions();
  const [state] = useScreenState('/buyer/browse', 'Browse produce', ['default', 'loading', 'empty', 'error']);
  const f = useFilters();
  const nav = useNav();
  const { toast } = useProto();
  const results = applyFilters(f);
  const chips = activeChips(f);
  const cols = width >= 700 ? 2 : 1;
  const filterCount = chips.length;
  const toggleCat = (name: string) => setFilters(v => ({ cats: v.cats.includes(name) ? v.cats.filter(x => x !== name) : [...v.cats, name] }));
  const empty = state === 'empty' || (state === 'default' && results.length === 0);

  let body;
  if (state === 'loading') body = Array.from({ length: 3 }, (_, i) => <ProductCardSkeleton key={i} />);
  else if (state === 'error') body = [<Rise key="e"><Empty icon="alert" tone="danger" title="We could not load produce" action={<Button title="Try again" icon="swap" onPress={() => toast('Trying again…')} />}>Check your connection and try again. Anything you saved is still here.</Empty></Rise>];
  else if (empty) body = [<Rise key="e"><Empty icon="search" title={state === 'empty' ? 'No “cocoyam” near Asaba yet' : 'Nothing matches these filters'}
    action={<>
      <Button title={state === 'empty' ? 'Search all of Delta State' : 'Clear all filters'} variant="secondary" onPress={() => { setFilters(state === 'empty' ? { radius: 'State' } : { ...DEFAULT_FILTERS }); toast(state === 'empty' ? 'Area widened to Delta State' : 'Filters cleared'); }} />
      <Button title="Save this search" icon="bell" onPress={() => toast('Search saved. We will tell you when a farm lists it.')} />
    </>}>Try a wider area, or save this search and we will tell you when a farm lists it.</Empty></Rise>];
  else body = results.map((p, i) => <Rise key={p.id} i={i} style={cols === 2 ? { flexBasis: '48%', flexGrow: 1 } : undefined}><ProductCard p={p} onPress={() => nav.push(`/buyer/product?id=${p.id}`, 'default')} /></Rise>);

  return (
    <Screen tabs refresh onRefresh={() => toast('Stock and prices updated')} header={<TabHeader role="buyer" title="Browse produce" subtitle="Fresh from verified farms near Asaba" />}>
      {/* Search + Filters */}
      <Row gap={8}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 50, paddingHorizontal: 14, borderRadius: radius.md, borderWidth: 1, borderColor: c.lineStrong, backgroundColor: c.card }}>
          <Icon name="search" size={18} color={c.muted} />
          <TextInput value={state === 'empty' ? 'cocoyam' : f.q} onChangeText={q => setFilters({ q })} placeholder="Search produce, farms…" placeholderTextColor={c.muted} returnKeyType="search" accessibilityLabel="Search"
            style={{ flex: 1, minHeight: 48, fontFamily: fonts.body, fontSize: size.md, color: c.ink }} />
          {!!f.q && <Press onPress={() => setFilters({ q: '' })} label="Clear search" style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={16} color={c.muted} /></Press>}
        </View>
        <Press onPress={() => { haptic.tap(); router.push('/buyer/filters' as never); }} label={`Filters${filterCount ? `, ${filterCount} on` : ''}`} scaleTo={0.94}
          style={{ height: 50, minWidth: tap + 6, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radius.md, borderWidth: 1,
            borderColor: filterCount ? c.primary : c.lineStrong, backgroundColor: filterCount ? c.primarySoft : c.card }}>
          <Icon name="filter" size={18} color={filterCount ? c.primaryInk : c.ink} />
          {filterCount > 0 && <View style={{ minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 5, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fonts.bodyHeavy, fontSize: 11, color: c.onPrimary }}>{filterCount}</Text></View>}
        </Press>
      </Row>

      {/* Categories: choose one or more */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space[4] }} contentContainerStyle={{ paddingHorizontal: space[4], gap: 8 }} accessibilityLabel="Categories, choose one or more">
        <Chip label="All" on={f.cats.length === 0} onPress={() => setFilters({ cats: [] })} />
        {CATS.map(([name, icon]) => <Chip key={name} label={name} icon={icon} on={f.cats.includes(name)} onPress={() => toggleCat(name)} />)}
      </ScrollView>

      {/* Active filters */}
      {chips.length > 0 && state === 'default' && (
        <Row gap={8} wrap>
          {chips.map(ch => (
            <Press key={ch.label} onPress={() => { haptic.select(); setFilters(ch.clear); }} label={`Remove filter: ${ch.label}`} scaleTo={0.94}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 34, paddingLeft: 12, paddingRight: 8, borderRadius: radius.sm, backgroundColor: c.ink }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.xs, color: c.bg }}>{ch.label}</Text><Icon name="close" size={13} color={c.bg} />
            </Press>
          ))}
          <Press onPress={() => { haptic.select(); setFilters({ ...DEFAULT_FILTERS, q: f.q }); }} label="Clear all filters" style={{ minHeight: 34, justifyContent: 'center', paddingHorizontal: 6 }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.xs, color: c.primaryInk, textDecorationLine: 'underline' }}>Clear all</Text>
          </Press>
        </Row>
      )}

      {state === 'default' && !empty && (
        <Row between>
          <T v="small" muted>{results.length} {results.length === 1 ? 'result' : 'results'} · {f.radius === 'State' ? 'Delta State' : `within ${f.radius}`}</T>
          <Press onPress={() => router.push('/buyer/filters' as never)} label={`Sort: ${f.sort}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 36 }}>
            <Icon name="list" size={14} color={c.primaryInk} /><Text style={{ fontFamily: fonts.bodyBold, fontSize: size.sm, color: c.primaryInk }}>{f.sort}</Text>
          </Press>
        </Row>
      )}

      <View style={cols === 2 ? { flexDirection: 'row', flexWrap: 'wrap', gap: space[4] } : { gap: space[4] }}>{body}</View>
    </Screen>
  );
}
