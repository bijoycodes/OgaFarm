/* Marketplace and order parts: photos, product cards, quantity stepper, ratings, route,
   choice cards, list rows, chat bubbles, codes. Same content as the web prototype, laid out for phones. */
import { Image } from 'expo-image';
import { useEffect, useState, type ReactNode } from 'react';
import { Share, StyleSheet, Text, TextInput, View, type ImageSourcePropType, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { FARMS, naira, qtyText, type Product } from '@/data/sample';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size, space, tap } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { Avatar, Badge, Card, Press, Row, Status, T, Verified } from './kit';

/** Photo that fades in (no layout jump: the box keeps its size). */
export function Photo({ src, ratio = 4 / 3, style, label, rounded = radius.md }: { src: ImageSourcePropType; ratio?: number; style?: StyleProp<ViewStyle>; label?: string; rounded?: number }) {
  const { c } = useTheme();
  return (
    <View style={[{ aspectRatio: ratio, borderRadius: rounded, overflow: 'hidden', backgroundColor: c.sunken }, style]} accessible={!!label} accessibilityRole={label ? 'image' : undefined} accessibilityLabel={label}>
      <Image source={src as never} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
    </View>
  );
}

/** Loading placeholder with a soft pulse. */
export function Skel({ w = '100%', h = 14, r = radius.sm, style }: { w?: number | `${number}%`; h?: number; r?: number; style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  const o = useSharedValue(0.5);
  useEffect(() => { o.value = withRepeat(withTiming(1, { duration: 900 }), -1, true); }, [o]);
  const a = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[{ width: w, height: h, borderRadius: r, backgroundColor: c.line }, a, style]} />;
}

/** Product card, full width on phones (one at a time reads better than two small ones). */
export function ProductCard({ p, onPress }: { p: Product; onPress: () => void }) {
  const { c } = useTheme();
  const f = FARMS[p.farm];
  return (
    <Card onPress={onPress} tight style={{ padding: 0, gap: 0, overflow: 'hidden' }}>
      <View>
        <Photo src={p.img} ratio={16 / 9} rounded={0} label={p.name} />
        <View style={{ position: 'absolute', top: 10, left: 10 }}><Status s={p.status} /></View>
      </View>
      <View style={{ padding: space[3], gap: 6 }}>
        <Row between gap={8} style={{ alignItems: 'flex-start' }}>
          <T v="h3" style={{ flex: 1 }} numberOfLines={2}>{p.name}</T>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontFamily: fonts.display, fontSize: size.lg, color: c.ink, fontVariant: ['tabular-nums'] }}>{naira(p.price)}</Text>
            <T v="xs" muted>per {p.unit}</T>
          </View>
        </Row>
        <Row gap={6}>
          <Icon name="store" size={14} color={c.muted} />
          <T v="small" muted numberOfLines={1} style={{ flexShrink: 1 }}>{f.name} · {f.place.split(',')[0]}</T>
          {f.verified && <Icon name="shield" size={15} color={c.ok} label="Verified farm" />}
        </Row>
        <Row gap={6}>
          <Icon name="clock" size={14} color={p.stale ? c.warn : c.muted} />
          <T v="xs" color={p.stale ? c.warn : c.muted}>{p.stale ? `Stock last confirmed ${p.confirmed}` : `Stock confirmed ${p.confirmed.toLowerCase()}`} · Min {qtyText(p.min, p.unit)}</T>
        </Row>
      </View>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card tight style={{ padding: 0, gap: 0, overflow: 'hidden' }}>
      <Skel h={180} r={0} />
      <View style={{ padding: space[3], gap: 8 }}><Skel w="70%" h={18} /><Skel w="45%" /><Skel w="80%" h={12} /></View>
    </Card>
  );
}

/** Quantity stepper: big − / + targets, haptic tick, respects the minimum order. */
export function Stepper({ value, onChange, min = 1, step = 1, unit, label }: { value: number; onChange: (v: number) => void; min?: number; step?: number; unit?: string; label: string }) {
  const { c } = useTheme();
  const btn = (icon: IconName, l: string, next: number, disabled: boolean) => (
    <Press onPress={() => { haptic.select(); onChange(next); }} disabled={disabled} label={l} scaleTo={0.9}
      style={{ width: tap, height: tap, borderRadius: radius.ctl, alignItems: 'center', justifyContent: 'center', backgroundColor: c.sunken }}>
      <Icon name={icon} size={18} color={c.ink} weight="bold" />
    </Press>
  );
  return (
    <View accessibilityLabel={`${label}: ${value}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, padding: 3, borderRadius: radius.md, borderWidth: 1, borderColor: c.lineStrong, backgroundColor: c.card, alignSelf: 'flex-start', flexShrink: 0 }}>
      {btn('minus', `Less ${label.toLowerCase()}`, Math.max(min, value - step), value <= min)}
      <Text numberOfLines={1} style={{ minWidth: 56, paddingHorizontal: 4, textAlign: 'center', fontFamily: fonts.bodyHeavy, fontSize: size.md, color: c.ink, fontVariant: ['tabular-nums'] }}>{value}{unit ? ` ${unit}` : ''}</Text>
      {btn('plus', `More ${label.toLowerCase()}`, value + step, false)}
    </View>
  );
}

/** Read-only stars with the number and count; small samples are flagged (BR-REV-05). */
export function Rating({ value, count }: { value: number; count?: number }) {
  const { c } = useTheme();
  return (
    <Row gap={6} wrap>
      <View accessible accessibilityLabel={`${value} out of 5`} style={{ flexDirection: 'row', gap: 1 }}>
        {[1, 2, 3, 4, 5].map(i => <Icon key={i} name="star" size={14} weight={i <= Math.round(value) ? 'fill' : 'regular'} color={i <= Math.round(value) ? c.harvestFill : c.lineStrong} />)}
      </View>
      <T v="label">{value.toFixed(1)}</T>
      {count !== undefined && <T v="xs" muted>({count} {count === 1 ? 'review' : 'reviews'})</T>}
      {count !== undefined && count < 5 && <Badge tone="info" align="center">Few reviews</Badge>}
    </Row>
  );
}

/** Tap-to-rate stars, 44 pt targets. */
export function RateInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const { c } = useTheme();
  const words = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];
  return (
    <View style={{ gap: 4 }}>
      <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <Press key={i} onPress={() => { haptic.select(); onChange(i); }} role="radio" selected={value === i} label={`${i} star${i > 1 ? 's' : ''}`} scaleTo={0.8}
            style={{ width: tap, height: tap, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="star" size={30} weight={i <= value ? 'fill' : 'regular'} color={i <= value ? c.harvestFill : c.lineStrong} />
          </Press>
        ))}
      </View>
      <T v="xs" muted>{value ? words[value] : 'Tap a star'}</T>
    </View>
  );
}

/** Pickup → drop-off. */
export function Route({ from, to, fromLbl = 'Pickup', toLbl = 'Drop-off' }: { from: string; to: string; fromLbl?: string; toLbl?: string }) {
  const { c } = useTheme();
  const stop = (lbl: string, txt: string, end: boolean) => (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <View style={{ alignItems: 'center', width: 16 }}>
        <View style={{ width: 14, height: 14, borderRadius: end ? 3 : 7, marginTop: 3, backgroundColor: end ? c.harvestFill : c.primary }} />
        {!end && <View style={{ flex: 1, width: 2, marginVertical: 3, backgroundColor: c.line }} />}
      </View>
      <View style={{ flex: 1, paddingBottom: end ? 0 : 14 }}><T v="eyebrow">{lbl}</T><T v="small">{txt}</T></View>
    </View>
  );
  return <View>{stop(fromLbl, from, false)}{stop(toLbl, to, true)}</View>;
}

/** Radio card (pickup or delivery, a quote, a role…). */
export function Choice({ on, onPress, title, sub, right, children, disabled, icon }:
  { on: boolean; onPress: () => void; title: string; sub?: string; right?: ReactNode; children?: ReactNode; disabled?: boolean; icon?: IconName }) {
  const { c } = useTheme();
  return (
    <Press onPress={() => { haptic.select(); onPress(); }} role="radio" selected={on} disabled={disabled} label={title} scaleTo={0.985}
      style={{ flexDirection: 'row', gap: 12, padding: space[3], borderRadius: radius.lg, borderWidth: on ? 2 : 1, borderColor: on ? c.primary : c.line, backgroundColor: on ? c.primarySoft : c.card, margin: on ? 0 : 1 }}>
      <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, marginTop: 1, borderColor: on ? c.primary : c.lineStrong, alignItems: 'center', justifyContent: 'center' }}>
        {on && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.primary }} />}
      </View>
      {icon && <Icon name={icon} size={22} color={on ? c.primaryInk : c.ink2} />}
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.md, color: c.ink }}>{title}</Text>
        {sub && <Text style={{ fontFamily: fonts.body, fontSize: size.sm, lineHeight: 20, color: c.muted }}>{sub}</Text>}
        {children}
      </View>
      {right}
    </Press>
  );
}

/** Settings-style list row inside a Card with `pad={false}`. */
export function ListRow({ icon, title, sub, right, onPress, first, danger }: { icon?: IconName; title: string; sub?: string; right?: ReactNode; onPress?: () => void; first?: boolean; danger?: boolean }) {
  const { c } = useTheme();
  const inner = (
    <>
      {icon && <View style={{ width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: danger ? c.dangerBg : c.sunken }}><Icon name={icon} size={18} color={danger ? c.danger : c.ink2} /></View>}
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.bodySemi, fontSize: size.md, color: danger ? c.danger : c.ink }}>{title}</Text>
        {sub && <Text style={{ fontFamily: fonts.body, fontSize: size.xs, color: c.muted }}>{sub}</Text>}
      </View>
      {right}
      {onPress && <Icon name="chev" size={16} color={c.muted} />}
    </>
  );
  const style: ViewStyle = { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: first ? 0 : 1, borderTopColor: c.line };
  return onPress ? <Press onPress={onPress} label={title} scaleTo={0.99} style={style}>{inner}</Press> : <View style={style}>{inner}</View>;
}

/** Card holding ListRows edge to edge. */
export function ListCard({ children }: { children: ReactNode }) {
  const { c } = useTheme();
  return <View style={{ borderRadius: radius.lg, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, overflow: 'hidden' }}>{children}</View>;
}

export function TextArea({ style, ...p }: TextInputProps) {
  const { c } = useTheme();
  const [focus, setFocus] = useState(false);
  return (
    <TextInput multiline textAlignVertical="top" placeholderTextColor={c.muted} {...p} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={[{ minHeight: 96, borderWidth: 1, borderRadius: radius.md, padding: 12, fontFamily: fonts.body, fontSize: size.md, lineHeight: 22, color: c.ink, backgroundColor: c.card, borderColor: focus ? c.primary : c.lineStrong }, style]} />
  );
}

/** Chat bubble for dispute cases. */
export function Bubble({ who, text, me, staff }: { who: string; text: string; me?: boolean; staff?: boolean }) {
  const { c } = useTheme();
  return (
    <View style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '88%', gap: 4 }}>
      <T v="xs" muted style={{ textAlign: me ? 'right' : 'left' }}>{who}</T>
      <View style={{ padding: 12, borderRadius: radius.lg, borderBottomRightRadius: me ? radius.sm : radius.lg, borderBottomLeftRadius: me ? radius.lg : radius.sm,
        backgroundColor: me ? c.primary : staff ? c.infoBg : c.sunken }}>
        <Text style={{ fontFamily: fonts.body, fontSize: size.sm, lineHeight: 20, color: me ? c.onPrimary : staff ? c.info : c.ink }}>{text}</Text>
      </View>
    </View>
  );
}

/** Big pickup / delivery code, read out digit by digit to screen readers. */
export function CodeCard({ label, code, note, children }: { label: string; code: string; note: string; children?: ReactNode }) {
  const { c } = useTheme();
  return (
    <Card style={{ alignItems: 'center' }}>
      <T v="eyebrow">{label}</T>
      <View accessible accessibilityLabel={`${label}: ${code.split('').join(' ')}`} style={{ flexDirection: 'row', gap: 8 }}>
        {code.split('').map((d, i) => (
          <View key={i} style={{ width: 54, height: 64, borderRadius: radius.md, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fonts.display, fontSize: 34, color: c.primaryInk }}>{d}</Text>
          </View>
        ))}
      </View>
      <T v="small" muted center style={{ maxWidth: 300 }}>{note}</T>
      {children && <View style={{ alignSelf: 'stretch', gap: 8 }}>{children}</View>}
    </Card>
  );
}

/** Person or business row: avatar, name, line, optional right side. */
export function Who({ initials, name, sub, right, verified, gold }: { initials: string; name: string; sub?: string; right?: ReactNode; verified?: boolean; gold?: boolean }) {
  return (
    <Row gap={12}>
      <Avatar initials={initials} size={44} tone={gold ? 'gold' : 'soft'} />
      <View style={{ flex: 1, gap: 2 }}>
        <Row gap={6} wrap><T v="label">{name}</T>{verified && <Verified />}</Row>
        {sub && <T v="xs" muted>{sub}</T>}
      </View>
      {right}
    </Row>
  );
}

/** Opens the phone's share sheet; falls back to a toast where sharing is not available (web). */
export async function shareLink(message: string, url: string, toast: (m: string) => void) {
  try { await Share.share({ message: `${message}\n${url}`, url }); }
  catch { toast('Link copied'); }
}
