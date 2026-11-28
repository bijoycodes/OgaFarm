/* Compact Select: one input-sized row showing the choice; tapping opens a bottom sheet with the options.
   Replaces long rows of chips / radio cards that grow with every option. `multiple` lets people pick several.
   Lists with more than 8 options get a search box. */
import { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size, space } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { BottomSheet } from './bottom-sheet';
import { Button, IconButton, Press, T } from './kit';

export type Option = string | { value: string; label?: string; sub?: string; icon?: IconName };
const norm = (o: Option) => typeof o === 'string' ? { value: o, label: o } : { ...o, label: o.label ?? o.value };

type Single = { multiple?: false; value: string; onChange: (v: string) => void };
type Multi = { multiple: true; value: string[]; onChange: (v: string[]) => void };

export function Select(p: { label: string; options: Option[]; placeholder?: string; invalid?: boolean; disabled?: boolean } & (Single | Multi)) {
  const { c } = useTheme();
  const opts = useMemo(() => p.options.map(norm), [p.options]);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState<string[]>([]);
  const chosen = p.multiple ? p.value : p.value ? [p.value] : [];
  const current = opts.filter(o => chosen.includes(o.value));
  const icon = !p.multiple ? current[0]?.icon : undefined;
  const shown = p.multiple
    ? (current.length === 0 ? '' : current.length <= 2 ? current.map(o => o.label).join(', ') : `${current.slice(0, 2).map(o => o.label).join(', ')} +${current.length - 2}`)
    : current[0]?.label ?? '';
  const searchable = opts.length > 8;
  const list = q.trim() ? opts.filter(o => o.label.toLowerCase().includes(q.trim().toLowerCase())) : opts;

  const show = () => { if (p.disabled) return; haptic.tap(); setDraft(chosen); setQ(''); setOpen(true); };
  const close = () => setOpen(false);
  const pick = (v: string) => {
    haptic.select();
    if (p.multiple) setDraft(d => d.includes(v) ? d.filter(x => x !== v) : [...d, v]);
    else { (p.onChange as (v: string) => void)(v); close(); }
  };
  const done = () => { (p.onChange as (v: string[]) => void)(draft); close(); };
  const sel = p.multiple ? draft : chosen;

  return (
    <>
      <Press onPress={show} disabled={p.disabled} label={`${p.label}: ${shown || 'not chosen'}. Change`} scaleTo={0.99}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 50, paddingHorizontal: 14, borderWidth: 1, borderRadius: radius.md,
          borderColor: p.invalid ? c.danger : c.lineStrong, backgroundColor: c.card }}>
        {icon && <Icon name={icon} size={18} color={c.ink2} />}
        <Text numberOfLines={1} style={{ flex: 1, fontFamily: fonts.body, fontSize: size.md, color: shown ? c.ink : c.muted }}>{shown || p.placeholder || 'Choose'}</Text>
        {p.multiple && current.length > 0 && (
          <View style={{ minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 6, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fonts.bodyHeavy, fontSize: size.xs, color: c.primaryInk }}>{current.length}</Text>
          </View>
        )}
        <Icon name="chevDown" size={16} color={c.muted} />
      </Press>

      <BottomSheet visible={open} onClose={close}
        header={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: space[4], paddingTop: space[2], paddingBottom: space[3] }}>
            <View style={{ flex: 1 }}>
              <T v="h3">{p.label}</T>
              {p.multiple && <T v="xs" muted>Choose one or more</T>}
            </View>
            <IconButton icon="close" label="Close" onPress={close} />
          </View>
        }
        footer={p.multiple ? (
          <View style={{ paddingHorizontal: space[4], paddingTop: space[2] }}>
            <Button title={draft.length ? `Done · ${draft.length} selected` : 'Done'} onPress={done} />
          </View>
        ) : undefined}>
            {searchable && (
              <View style={{ paddingHorizontal: space[4], paddingBottom: space[2] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: c.lineStrong, borderRadius: radius.md, paddingHorizontal: 12, backgroundColor: c.card }}>
                  <Icon name="search" size={18} color={c.muted} />
                  <TextInput value={q} onChangeText={setQ} placeholder={`Search ${p.label.toLowerCase()}`} placeholderTextColor={c.muted} accessibilityLabel={`Search ${p.label}`}
                    style={{ flex: 1, minWidth: 0, minHeight: 44, fontFamily: fonts.body, fontSize: size.md, color: c.ink }} />
                </View>
              </View>
            )}
            <FlatList data={list} keyExtractor={o => o.value} keyboardShouldPersistTaps="handled"
              accessibilityRole={p.multiple ? undefined : 'radiogroup'} contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: space[2] }}
              ListEmptyComponent={<T v="small" muted style={{ padding: space[3] }}>Nothing matches</T>}
              renderItem={({ item: o, index }) => {
                const on = sel.includes(o.value);
                return (
                  <Press onPress={() => pick(o.value)} role={p.multiple ? 'checkbox' : 'radio'} selected={on} label={o.sub ? `${o.label}. ${o.sub}` : o.label} scaleTo={0.99}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingVertical: 8, paddingHorizontal: 10, borderRadius: radius.md,
                      backgroundColor: on ? c.primarySoft : 'transparent', borderTopWidth: index && !on && !sel.includes(list[index - 1]?.value) ? 1 : 0, borderTopColor: c.line }}>
                    {p.multiple && (
                      <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center', borderColor: on ? c.primary : c.lineStrong, backgroundColor: on ? c.primary : 'transparent' }}>
                        {on && <Icon name="check" size={13} color={c.onPrimary} weight="bold" />}
                      </View>
                    )}
                    {o.icon && <Icon name={o.icon} size={18} color={on ? c.primaryInk : c.ink2} />}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: on ? fonts.bodyBold : fonts.bodySemi, fontSize: size.md, color: on ? c.primaryInk : c.ink }}>{o.label}</Text>
                      {o.sub && <Text style={{ fontFamily: fonts.body, fontSize: size.xs, color: c.muted }}>{o.sub}</Text>}
                    </View>
                    {!p.multiple && on && <Icon name="check" size={18} color={c.primaryInk} weight="bold" />}
                  </Press>
                );
              }} />
      </BottomSheet>
    </>
  );
}
