/* Prototype helper sheet: switch the current screen's demo state, day/night, and jump to any screen. */
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProto } from '@/proto/Proto';
import { BUILT, REGISTRY } from '@/proto/registry';
import { haptic } from '@/proto/haptics';
import { useTheme, type ThemeMode } from '@/theme/ThemeProvider';
import { fonts, radius, size, space } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Badge, Chip, Press, Row, T } from '@/ui/kit';

const MODES: [ThemeMode, string][] = [['system', 'Match phone'], ['light', 'Day'], ['dark', 'Night']];

export default function ScreensSheet() {
  const { c, mode, setMode } = useTheme();
  const { current, states, setScreenState } = useProto();
  const insets = useSafeAreaInsets();
  const go = (href: string) => { haptic.tap(); router.back(); setTimeout(() => router.navigate(href as never), 60); };
  const active = current ? (states[current.id] && current.states.includes(states[current.id]) ? states[current.id] : current.states[0]) : null;
  return (
    <ScrollView contentContainerStyle={{ padding: space[4], paddingBottom: insets.bottom + space[6], gap: space[5] }}>
      <View style={{ gap: 4 }}>
        <T v="eyebrow">Prototype</T>
        <T v="h2">Screens</T>
        <T v="small" muted>Sample data only. This button is not part of the real app.</T>
      </View>

      {current && current.states.length > 1 && (
        <View style={{ gap: 10 }}>
          <T v="label">State of “{current.title}”</T>
          <Row gap={8} wrap>{current.states.map(s => <Chip key={s} label={s[0].toUpperCase() + s.slice(1)} on={s === active} onPress={() => setScreenState(current.id, s)} />)}</Row>
        </View>
      )}

      <View style={{ gap: 10 }}>
        <T v="label">Look</T>
        <View style={{ flexDirection: 'row', padding: 4, borderRadius: radius.md, backgroundColor: c.sunken, gap: 4 }}>
          {MODES.map(([m, label]) => (
            <Press key={m} onPress={() => { haptic.select(); setMode(m); }} role="radio" selected={mode === m} label={label}
              style={{ flex: 1, minHeight: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: mode === m ? c.card : 'transparent' }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.sm, color: mode === m ? c.primaryInk : c.muted }}>{label}</Text>
            </Press>
          ))}
        </View>
      </View>

      {REGISTRY.map(g => (
        <View key={g.title} style={{ gap: 6 }}>
          <T v="label">{g.title}</T>
          <View style={{ borderRadius: radius.lg, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, overflow: 'hidden' }}>
            {g.screens.map((s, i) => {
              const ready = BUILT.includes(s.batch);
              return (
                <Press key={s.href + s.title} disabled={!ready} onPress={() => go(s.href)} label={`${s.title}${ready ? '' : ', designed in a later batch'}`} scaleTo={0.99}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 50, paddingHorizontal: 14, borderTopWidth: i ? 1 : 0, borderTopColor: c.line }}>
                  <Text style={{ flex: 1, fontFamily: fonts.bodySemi, fontSize: size.md, color: c.ink }}>{s.title}</Text>
                  <Badge align="center" tone={s.version === 'V2' ? 'info' : 'neutral'}>{s.version}</Badge>
                  {ready ? <Icon name="chev" size={16} color={c.muted} /> : <Badge align="center">Batch {s.batch}</Badge>}
                </Press>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
