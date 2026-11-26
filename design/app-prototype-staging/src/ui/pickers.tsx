/* Pickers that open as native sheets (iOS page sheet; Android slides up):
   phone number with country picker, and the sign-up role picker. Same content as the web prototype. */
import { useMemo, useState, type ReactNode } from 'react';
import { FlatList, Modal, Platform, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size, space } from '@/theme/tokens';
import { haptic } from '@/proto/haptics';
import { ROLE_CATALOG, roleDef, type RoleKey } from '@/data/roles';
import { Icon } from './Icon';
import { Badge, IconButton, Press, T } from './kit';

/** Sheet shell: title row with close button, safe-area aware. */
export function Sheet({ visible, onClose, title, subtitle, children }: { visible: boolean; onClose: () => void; title: string; subtitle?: string; children: ReactNode }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide" presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}>
      <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: Platform.OS === 'ios' ? 0 : insets.top, paddingBottom: insets.bottom }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: space[4], borderBottomWidth: 1, borderBottomColor: c.line, backgroundColor: c.card }}>
          <View style={{ flex: 1 }}><T v="h2">{title}</T>{subtitle && <T v="small" muted>{subtitle}</T>}</View>
          <IconButton icon="close" label="Close" onPress={onClose} />
        </View>
        {children}
      </View>
    </Modal>
  );
}

/* ---------- Phone number with country picker ---------- */
type Country = { iso: string; name: string; dial: string; example: string };
const COMMON: Country[] = [
  { iso: 'NG', name: 'Nigeria', dial: '+234', example: '803 123 4567' },
  { iso: 'GH', name: 'Ghana', dial: '+233', example: '24 123 4567' },
  { iso: 'GB', name: 'United Kingdom', dial: '+44', example: '7400 123456' },
  { iso: 'US', name: 'United States', dial: '+1', example: '(201) 555 0123' },
  { iso: 'CA', name: 'Canada', dial: '+1', example: '(506) 234 5678' }
];
const OTHERS: Country[] = [
  { iso: 'BJ', name: 'Benin', dial: '+229', example: '90 01 12 34' }, { iso: 'CM', name: 'Cameroon', dial: '+237', example: '6 71 23 45 67' },
  { iso: 'CN', name: 'China', dial: '+86', example: '131 2345 6789' }, { iso: 'CI', name: "Côte d'Ivoire", dial: '+225', example: '01 23 45 67 89' },
  { iso: 'FR', name: 'France', dial: '+33', example: '6 12 34 56 78' }, { iso: 'DE', name: 'Germany', dial: '+49', example: '1512 3456789' },
  { iso: 'IN', name: 'India', dial: '+91', example: '81234 56789' }, { iso: 'IE', name: 'Ireland', dial: '+353', example: '85 012 3456' },
  { iso: 'IT', name: 'Italy', dial: '+39', example: '312 345 6789' }, { iso: 'KE', name: 'Kenya', dial: '+254', example: '712 345678' },
  { iso: 'NL', name: 'Netherlands', dial: '+31', example: '6 12345678' }, { iso: 'NE', name: 'Niger', dial: '+227', example: '93 12 34 56' },
  { iso: 'SA', name: 'Saudi Arabia', dial: '+966', example: '51 234 5678' }, { iso: 'SN', name: 'Senegal', dial: '+221', example: '70 123 45 67' },
  { iso: 'ZA', name: 'South Africa', dial: '+27', example: '71 123 4567' }, { iso: 'TG', name: 'Togo', dial: '+228', example: '90 11 22 33' },
  { iso: 'AE', name: 'United Arab Emirates', dial: '+971', example: '50 123 4567' }
];
const flag = (iso: string) => String.fromCodePoint(...[...iso].map(ch => 0x1f1e6 + ch.charCodeAt(0) - 65));

export function PhoneInput({ value, onChangeText }: { value: string; onChangeText: (v: string) => void }) {
  const { c } = useTheme();
  const [country, setCountry] = useState(COMMON[0]);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [{ head: 'Common' } as const, ...COMMON, { head: 'All countries' } as const, ...OTHERS];
    return [...COMMON, ...OTHERS].filter(x => x.name.toLowerCase().includes(t) || x.dial.includes(t.replace(/^\+?/, '+')));
  }, [q]);
  return (
    <>
      <View style={{ flexDirection: 'row', minHeight: 50, borderWidth: 1, borderColor: c.lineStrong, borderRadius: radius.md, backgroundColor: c.card, overflow: 'hidden' }}>
        <Press onPress={() => setOpen(true)} label={`Country code ${country.name} ${country.dial}. Change country`}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, minHeight: 48, backgroundColor: c.sunken, borderRightWidth: 1, borderRightColor: c.lineStrong }}>
          <Text style={{ fontSize: 18 }}>{flag(country.iso)}</Text>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.sm, color: c.ink }}>{country.dial}</Text>
          <Icon name="chevDown" size={14} color={c.muted} />
        </Press>
        <TextInput value={value} onChangeText={onChangeText} keyboardType="phone-pad" textContentType="telephoneNumber" autoComplete="tel"
          placeholder={country.example} placeholderTextColor={c.muted} accessibilityLabel={`Phone number, ${country.name} ${country.dial}`}
          style={{ flex: 1, paddingHorizontal: 14, fontFamily: fonts.body, fontSize: size.md, color: c.ink }} />
      </View>
      <Sheet visible={open} onClose={() => setOpen(false)} title="Country code" subtitle="Nigeria is the default. Buyers abroad can pick their country.">
        <View style={{ padding: space[4], paddingBottom: space[2] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: c.lineStrong, borderRadius: radius.md, paddingHorizontal: 12, backgroundColor: c.card }}>
            <Icon name="search" size={18} color={c.muted} />
            <TextInput value={q} onChangeText={setQ} placeholder="Search country or code" placeholderTextColor={c.muted} autoFocus
              style={{ flex: 1, minHeight: 46, fontFamily: fonts.body, fontSize: size.md, color: c.ink }} />
          </View>
        </View>
        <FlatList data={list} keyExtractor={(x, i) => ('head' in x ? x.head : x.iso + x.name) + i} contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: space[6] }}
          ListEmptyComponent={<T v="small" muted style={{ padding: space[4] }}>No country found</T>}
          renderItem={({ item }) => 'head' in item
            ? <T v="eyebrow" style={{ paddingTop: space[4], paddingBottom: space[2] }}>{item.head}</T>
            : (
              <Press onPress={() => { haptic.select(); setCountry(item); setOpen(false); setQ(''); }} role="radio" selected={item.iso === country.iso} label={`${item.name} ${item.dial}`}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingHorizontal: 10, borderRadius: radius.md, backgroundColor: item.iso === country.iso ? c.primarySoft : 'transparent' }}>
                <Text style={{ fontSize: 22 }}>{flag(item.iso)}</Text>
                <Text style={{ flex: 1, fontFamily: item.iso === country.iso ? fonts.bodyBold : fonts.body, fontSize: size.md, color: c.ink }}>{item.name}</Text>
                <Text style={{ fontFamily: fonts.bodySemi, fontSize: size.sm, color: c.muted }}>{item.dial}</Text>
                {item.iso === country.iso && <Icon name="check" size={18} color={c.primaryInk} />}
              </Press>
            )} />
      </Sheet>
    </>
  );
}

/* ---------- Sign-up role picker ---------- */
export function RolePicker({ value, onChange, version = 2 }: { value: RoleKey; onChange: (k: RoleKey) => void; version?: number }) {
  const { c } = useTheme();
  const [open, setOpen] = useState(false);
  const cur = roleDef(value);
  return (
    <>
      <Press onPress={() => setOpen(true)} label={`I want to join as ${cur.label}. Change`}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 68, padding: 12, borderWidth: 1, borderColor: c.lineStrong, borderRadius: radius.md, backgroundColor: c.card }}>
        <View style={{ width: 42, height: 42, borderRadius: radius.md, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}><Icon name={cur.icon} size={20} color={c.primaryInk} /></View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.md, color: c.ink }}>{cur.label} <Text style={{ fontFamily: fonts.bodySemi, fontSize: size.sm, color: c.muted }}>· {cur.price === 'Free' ? 'free' : 'paid plan'}</Text></Text>
          <Text style={{ fontFamily: fonts.body, fontSize: size.xs, color: c.muted }} numberOfLines={2}>{cur.what}</Text>
        </View>
        <Text style={{ fontFamily: fonts.bodyHeavy, fontSize: size.sm, color: c.primaryInk }}>Change</Text>
      </Press>
      <Sheet visible={open} onClose={() => setOpen(false)} title="How will you use OgaFarm?" subtitle="Choose one. You can add more roles later.">
        <FlatList data={ROLE_CATALOG} keyExtractor={r => r.key} contentContainerStyle={{ padding: space[4], gap: 8 }}
          renderItem={({ item: r }) => {
            const soon = r.since > version, on = r.key === value;
            return (
              <Press disabled={soon} role="radio" selected={on} label={`${r.label}, ${soon ? `coming in version ${r.since}` : r.price}`}
                onPress={() => { haptic.select(); onChange(r.key); setOpen(false); }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 68, padding: 12, borderRadius: radius.lg, borderWidth: 1,
                  borderColor: on ? c.primary : c.line, backgroundColor: on ? c.primarySoft : c.card }}>
                <View style={{ width: 42, height: 42, borderRadius: radius.md, backgroundColor: on ? c.card : c.primarySoft, alignItems: 'center', justifyContent: 'center' }}><Icon name={r.icon} size={20} color={c.primaryInk} /></View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.md, color: c.ink }}>{r.label}</Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: size.xs, color: c.muted }}>{r.what}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  {soon ? <Badge align="flex-end">Coming in V{r.since}</Badge> : <Badge align="flex-end" tone={r.price === 'Free' ? 'ok' : 'gold'}>{r.price}</Badge>}
                  {on && <Icon name="check" size={18} color={c.primaryInk} />}
                </View>
              </Press>
            );
          }} />
      </Sheet>
    </>
  );
}

