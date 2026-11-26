/* Base UI kit for the app prototype. Same look as the web prototype (tokens in src/theme/tokens.ts),
   built from native components: smooth press feedback, haptics on key actions, 44 pt touch targets. */
import { Children, useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, ActivityIndicator, Pressable, StyleSheet, useWindowDimensions, Text, TextInput, View, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';
import Animated, { Easing, FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme, type ThemeMode } from '@/theme/ThemeProvider';
import { fonts, motion, radius, size, space, tap } from '@/theme/tokens';
import { haptic } from '@/proto/haptics';
import { Icon, type IconName } from './Icon';

const ease = Easing.bezier(0.22, 0.8, 0.36, 1);

/* ---------- Text ---------- */
type TVariant = 'h1' | 'h2' | 'h3' | 'lead' | 'body' | 'small' | 'xs' | 'label' | 'eyebrow' | 'price';
const tv: Record<TVariant, TextStyle> = {
  h1: { fontFamily: fonts.display, fontSize: size.x2, lineHeight: 34 },
  h2: { fontFamily: fonts.display, fontSize: size.xl, lineHeight: 28 },
  h3: { fontFamily: fonts.display, fontSize: size.lg, lineHeight: 24 },
  lead: { fontFamily: fonts.body, fontSize: size.lg, lineHeight: 27 },
  body: { fontFamily: fonts.body, fontSize: size.md, lineHeight: 24 },
  small: { fontFamily: fonts.body, fontSize: size.sm, lineHeight: 20 },
  xs: { fontFamily: fonts.body, fontSize: size.xs, lineHeight: 17 },
  label: { fontFamily: fonts.bodyBold, fontSize: size.sm, lineHeight: 20 },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: size.xs, letterSpacing: 1.2, textTransform: 'uppercase' },
  price: { fontFamily: fonts.display, fontSize: size.xl, fontVariant: ['tabular-nums', 'lining-nums'] }
};
export function T({ v = 'body', muted, color, bold, center, style, children, numberOfLines }:
  { v?: TVariant; muted?: boolean; color?: string; bold?: boolean; center?: boolean; style?: StyleProp<TextStyle>; children: ReactNode; numberOfLines?: number }) {
  const { c } = useTheme();
  return (
    <Text numberOfLines={numberOfLines} style={[tv[v], { color: color ?? (muted ? c.muted : v === 'eyebrow' ? c.muted : c.ink) },
      bold && { fontFamily: fonts.bodyBold }, center && { textAlign: 'center' }, style]}>{children}</Text>
  );
}

/* ---------- Layout helpers ---------- */
export const Row = ({ gap = 12, children, style, wrap, between }: { gap?: number; children: ReactNode; style?: StyleProp<ViewStyle>; wrap?: boolean; between?: boolean }) =>
  <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, wrap && { flexWrap: 'wrap' }, between && { justifyContent: 'space-between' }, style]}>{children}</View>;
export const Stack = ({ gap = 12, children, style }: { gap?: number; children: ReactNode; style?: StyleProp<ViewStyle> }) =>
  <View style={[{ gap }, style]}>{children}</View>;

/** Fades and rises in when the screen opens; `i` staggers items (70 ms apart). Off with Reduce Motion. */
// Web preview only: localStorage "noanim" turns entrance animations off (for layout checks).
const NO_ANIM = typeof window !== 'undefined' && (() => { try { return !!window.localStorage?.getItem('noanim'); } catch { return false; } })();
export function Rise({ i = 0, children, style }: { i?: number; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  if (NO_ANIM) return <View style={style}>{children}</View>;
  return <Animated.View entering={FadeInDown.delay(Math.min(i, 7) * motion.stagger).duration(motion.slow).easing(ease)} style={style}>{children}</Animated.View>;
}

/* ---------- Pressable with smooth scale ---------- */
export function Press({ onPress, children, style, disabled, scaleTo = 0.97, label, role = 'button', selected, hapticOnPress }:
  { onPress?: () => void; children: ReactNode; style?: StyleProp<ViewStyle>; disabled?: boolean; scaleTo?: number; label?: string; role?: 'button' | 'link' | 'radio' | 'checkbox' | 'tab' | 'switch' | 'menuitem'; selected?: boolean; hapticOnPress?: boolean }) {
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  // Size/flex/margin belong to the touch area; everything else (colours, padding…) to the animated layer
  const flat = (StyleSheet.flatten(style) ?? {}) as ViewStyle;
  const OUTER = ['flex', 'flexGrow', 'flexShrink', 'flexBasis', 'alignSelf', 'width', 'minWidth', 'maxWidth', 'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginHorizontal', 'marginVertical'] as const;
  const outer: Record<string, unknown> = {}, inner: Record<string, unknown> = { ...flat };
  for (const k of OUTER) if (flat[k] !== undefined) { outer[k] = flat[k]; delete inner[k]; }
  if (outer.flex !== undefined || outer.width !== undefined || outer.flexGrow !== undefined) inner.flexGrow = 1;
  return (
    <Pressable disabled={disabled} style={outer as ViewStyle} onPress={() => { if (hapticOnPress) haptic.tap(); onPress?.(); }}
      onPressIn={() => { s.value = withTiming(scaleTo, { duration: motion.fast, easing: ease }); }}
      onPressOut={() => { s.value = withTiming(1, { duration: motion.normal, easing: ease }); }}
      accessibilityRole={role === 'menuitem' ? 'menuitem' : role} accessibilityLabel={label}
      accessibilityState={{ disabled, selected, checked: role === 'checkbox' || role === 'radio' || role === 'switch' ? !!selected : undefined }}
      hitSlop={6}>
      <Animated.View style={[a, inner as ViewStyle, disabled && { opacity: 0.5 }]}>{children}</Animated.View>
    </Pressable>
  );
}

/* ---------- Buttons ---------- */
type BVariant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger' | 'wa';
export function Button({ title, onPress, variant = 'primary', icon, disabled, small, style, hapticOnPress = true, loading }:
  { title: string; onPress?: () => void; variant?: BVariant; icon?: IconName; disabled?: boolean; small?: boolean; style?: StyleProp<ViewStyle>; hapticOnPress?: boolean; loading?: boolean }) {
  const { c } = useTheme();
  const look: Record<BVariant, { bg: string; fg: string; border: string }> = {
    primary: { bg: c.primary, fg: c.onPrimary, border: c.primary },
    secondary: { bg: c.card, fg: c.ink, border: c.lineStrong },
    soft: { bg: c.primarySoft, fg: c.primaryInk, border: c.primarySoft },
    ghost: { bg: 'transparent', fg: c.primaryInk, border: 'transparent' },
    danger: { bg: c.dangerBg, fg: c.danger, border: c.dangerBg },
    wa: { bg: c.okBg, fg: c.ok, border: c.okBg }
  };
  const l = look[variant];
  return (
    <Press onPress={loading ? undefined : onPress} disabled={disabled} label={loading ? `${title}, working` : title} hapticOnPress={!loading && hapticOnPress && variant === 'primary'}
      style={[{ minHeight: small ? 40 : 50, paddingHorizontal: small ? 14 : 18, borderRadius: radius.ctl, backgroundColor: l.bg, borderWidth: 1, borderColor: l.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, style]}>
      {loading ? <ActivityIndicator color={l.fg} /> : icon && <Icon name={icon} size={small ? 16 : 18} color={l.fg} />}
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: small ? size.sm : size.md, color: l.fg }}>{loading ? 'Please wait…' : title}</Text>
    </Press>
  );
}

export function IconButton({ icon, label, onPress, badge, color }: { icon: IconName; label: string; onPress?: () => void; badge?: boolean; color?: string }) {
  const { c } = useTheme();
  return (
    <Press onPress={onPress} label={label} scaleTo={0.92}
      style={{ width: tap, height: tap, borderRadius: radius.ctl, alignItems: 'center', justifyContent: 'center', backgroundColor: c.card, borderWidth: 1, borderColor: c.line }}>
      <Icon name={icon} size={20} color={color ?? c.ink} />
      {badge && <View style={{ position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: c.harvestFill, borderWidth: 1.5, borderColor: c.card }} />}
    </Press>
  );
}

/* ---------- Surfaces ---------- */
export function Card({ children, style, tight, onPress, tone }: { children: ReactNode; style?: StyleProp<ViewStyle>; tight?: boolean; onPress?: () => void; tone?: 'sunken' | 'soft' }) {
  const { c } = useTheme();
  const base: ViewStyle = { backgroundColor: tone === 'sunken' ? c.sunken : tone === 'soft' ? c.primarySoft : c.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: tone ? 'transparent' : c.line, padding: tight ? space[3] : space[4], gap: space[3],
    shadowColor: c.shadow, shadowOpacity: tone ? 0 : 0.5, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: tone ? 0 : 1 };
  return onPress ? <Press onPress={onPress} style={[base, style]} scaleTo={0.985}>{children}</Press> : <View style={[base, style]}>{children}</View>;
}
export const Divider = () => { const { c } = useTheme(); return <View style={{ height: 1, backgroundColor: c.line }} />; };

export function Avatar({ initials, size: s = 40, tone = 'soft' }: { initials: string; size?: number; tone?: 'soft' | 'gold' }) {
  const { c } = useTheme();
  return (
    <View style={{ width: s, height: s, borderRadius: s / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: tone === 'gold' ? c.harvestFill : c.primarySoft }}>
      <Text style={{ fontFamily: fonts.bodyHeavy, fontSize: s * 0.34, color: tone === 'gold' ? c.onHarvestFill : c.primaryInk }}>{initials}</Text>
    </View>
  );
}

/* ---------- Badges and status ---------- */
type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'neutral' | 'gold';
/** Small label. Sits at the start of a column; pass `align="center"` inside rows. */
export function Badge({ tone = 'neutral', icon, children, align = 'flex-start' }: { tone?: Tone; icon?: IconName; children: ReactNode; align?: 'flex-start' | 'center' | 'flex-end' }) {
  const { c } = useTheme();
  const m: Record<Tone, [string, string]> = { ok: [c.okBg, c.ok], warn: [c.warnBg, c.warn], danger: [c.dangerBg, c.danger], info: [c.infoBg, c.info], neutral: [c.sunken, c.ink2], gold: [c.harvestSoft, c.harvest] };
  const [bg, fg] = m[tone];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: align, backgroundColor: bg, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3 }}>
      {icon && <Icon name={icon} size={13} color={fg} />}
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.xs, color: fg }}>{children}</Text>
    </View>
  );
}
const STATUS_TONE: Record<string, Tone> = {
  'New': 'gold', 'Preparing': 'info', 'Ready for pickup': 'ok', 'Collected': 'neutral', 'Cancelled': 'danger', 'Available now': 'ok', 'Recurring supply': 'ok',
  'Expected soon': 'info', 'Seasonal': 'neutral', 'Sold out': 'danger', 'Paid': 'ok', 'Payment pending': 'warn', 'Active': 'ok', 'Expiring': 'warn', 'Expired': 'danger',
  'Pending review': 'warn', 'Approved': 'ok', 'Assigned': 'info', 'In transit': 'info', 'Delivered': 'ok', 'Open': 'ok', 'Quote sent': 'info',
  'Under review': 'warn', 'Resolved': 'ok', 'Waiting for reply': 'warn', 'Published': 'ok'
};
export const Status = ({ s }: { s: string }) => <Badge tone={STATUS_TONE[s] ?? 'neutral'}>{s}</Badge>;
export const Verified = () => <Badge tone="ok" icon="shield">Verified</Badge>;

export function Alert({ tone, icon, title, children, action }: { tone: 'ok' | 'warn' | 'danger' | 'info'; icon: IconName; title?: string; children?: ReactNode; action?: ReactNode }) {
  const { c } = useTheme();
  const m = { ok: [c.okBg, c.ok], warn: [c.warnBg, c.warn], danger: [c.dangerBg, c.danger], info: [c.infoBg, c.info] }[tone];
  return (
    <View accessibilityRole={tone === 'danger' ? 'alert' : undefined} style={{ flexDirection: 'row', gap: 10, padding: space[3], borderRadius: radius.lg, backgroundColor: m[0] }}>
      <Icon name={icon} size={20} color={m[1]} />
      <View style={{ flex: 1, gap: 2 }}>
        {title && <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.sm, color: m[1] }}>{title}</Text>}
        {children && <Text style={{ fontFamily: fonts.body, fontSize: size.sm, lineHeight: 20, color: m[1] }}>{children}</Text>}
        {action}
      </View>
    </View>
  );
}

export function Empty({ icon, title, children, action, tone }: { icon: IconName; title: string; children?: ReactNode; action?: ReactNode; tone?: 'ok' | 'warn' | 'danger' }) {
  const { c } = useTheme();
  const bg = tone === 'warn' ? c.warnBg : tone === 'danger' ? c.dangerBg : c.primarySoft, fg = tone === 'warn' ? c.warn : tone === 'danger' ? c.danger : c.primaryInk;
  return (
    <Card style={{ alignItems: 'center', paddingVertical: space[6] }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={28} color={fg} /></View>
      <T v="h3" center>{title}</T>
      {children && <T v="small" muted center style={{ maxWidth: 300 }}>{children}</T>}
      {action && <View style={{ alignSelf: 'stretch', gap: 10 }}>{action}</View>}
    </Card>
  );
}

export function Kv({ rows }: { rows: [string, ReactNode][] }) {
  const { c } = useTheme();
  return (
    <View style={{ gap: 10 }}>
      {rows.map(([k, v]) => (
        <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: size.sm, color: c.muted }}>{k}</Text>
          {typeof v === 'string' ? <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.sm, color: c.ink, flexShrink: 1, textAlign: 'right' }}>{v}</Text> : v}
        </View>
      ))}
    </View>
  );
}

/* ---------- Form fields ---------- */
export function Field({ label, required, hint, error, children, right }: { label: string; required?: boolean; hint?: string; error?: string; children: ReactNode; right?: ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.sm, color: c.ink2 }}>{label}{required && <Text style={{ color: c.danger }}> *</Text>}</Text>
        {right}
      </View>
      {children}
      {error ? <Row gap={6}><Icon name="alert" size={15} color={c.danger} /><Text style={{ fontFamily: fonts.bodySemi, fontSize: size.xs, color: c.danger, flex: 1 }}>{error}</Text></Row>
        : hint ? <Text style={{ fontFamily: fonts.body, fontSize: size.xs, color: c.muted }}>{hint}</Text> : null}
    </View>
  );
}

export function Input({ invalid, style, ...p }: TextInputProps & { invalid?: boolean }) {
  const { c } = useTheme();
  const [focus, setFocus] = useState(false);
  return (
    <TextInput placeholderTextColor={c.muted} {...p} onFocus={e => { setFocus(true); p.onFocus?.(e); }} onBlur={e => { setFocus(false); p.onBlur?.(e); }}
      style={[{ minWidth: 0, minHeight: 50, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: p.multiline ? 12 : 0, textAlignVertical: p.multiline ? 'top' : 'center', fontFamily: fonts.body, fontSize: size.md, color: c.ink, backgroundColor: c.card,
        borderColor: invalid ? c.danger : focus ? c.primary : c.lineStrong }, style]} />
  );
}

/** Password with show/hide and an optional strength meter (BR-ACC-09: 8+ characters, letters and numbers). */
export function PasswordInput({ value, onChangeText, strength, invalid, autoComplete = 'current-password' }:
  { value: string; onChangeText: (v: string) => void; strength?: boolean; invalid?: boolean; autoComplete?: 'current-password' | 'new-password' }) {
  const { c } = useTheme();
  const [show, setShow] = useState(false);
  const score = [value.length >= 8, /[a-z]/i.test(value) && /\d/.test(value), value.length >= 12, /[^a-z0-9]/i.test(value)].filter(Boolean).length;
  const words = ['Too short', 'Weak', 'Okay', 'Good', 'Strong'];
  const barColor = score <= 1 ? c.danger : score === 2 ? c.harvestFill : c.primary;
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 50, borderWidth: 1, borderRadius: radius.md, backgroundColor: c.card, borderColor: invalid ? c.danger : c.lineStrong }}>
        <TextInput value={value} onChangeText={onChangeText} secureTextEntry={!show} autoComplete={autoComplete} autoCapitalize="none" textContentType={autoComplete === 'new-password' ? 'newPassword' : 'password'}
          style={{ flex: 1, paddingHorizontal: 14, fontFamily: fonts.body, fontSize: size.md, color: c.ink, minHeight: 48 }} placeholderTextColor={c.muted} />
        <Press onPress={() => setShow(v => !v)} label={show ? 'Hide password' : 'Show password'} style={{ width: tap, height: tap, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={show ? 'eyeOff' : 'eye'} size={20} color={c.muted} />
        </Press>
      </View>
      {strength && (
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', gap: 4 }}>{[1, 2, 3, 4].map(i => <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= score ? barColor : c.lineStrong }} />)}</View>
          <Text style={{ fontFamily: fonts.body, fontSize: size.xs, color: c.muted }}>
            {value ? <Text style={{ fontFamily: fonts.bodyBold, color: c.ink }}>{words[score]} · </Text> : null}At least 8 characters, with letters and numbers.
          </Text>
        </View>
      )}
    </View>
  );
}

export function Chip({ label, on, onPress, icon }: { label: string; on?: boolean; onPress?: () => void; icon?: IconName }) {
  const { c } = useTheme();
  return (
    <Press onPress={() => { haptic.select(); onPress?.(); }} role="checkbox" selected={on} label={label} scaleTo={0.94}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 38, paddingHorizontal: 14, borderRadius: radius.full, borderWidth: 1,
        borderColor: on ? c.primary : c.lineStrong, backgroundColor: on ? c.primarySoft : c.card }}>
      {on ? <Icon name="check" size={14} color={c.primaryInk} /> : icon ? <Icon name={icon} size={14} color={c.ink2} /> : null}
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.sm, color: on ? c.primaryInk : c.ink2 }}>{label}</Text>
    </Press>
  );
}

/** On/off card (filters, settings). Whole card is the touch target; the switch shows a tick when on. */
export function SwitchCard({ label, on, onChange, onText, offText }: { label: string; on: boolean; onChange: (v: boolean) => void; onText?: string; offText?: string }) {
  const { c } = useTheme();
  const x = useSharedValue(on ? 22 : 0);
  useEffect(() => { x.value = withTiming(on ? 22 : 0, { duration: motion.normal, easing: ease }); }, [on, x]);
  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return (
    <Press onPress={() => { haptic.select(); onChange(!on); }} role="switch" selected={on} label={label} scaleTo={0.985}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64, paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.lg, borderWidth: 1,
        borderColor: on ? c.primary : c.line, backgroundColor: on ? c.primarySoft : c.card }}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.md, color: c.ink }}>{label}</Text>
        {(on ? onText : offText) && <Text style={{ fontFamily: fonts.body, fontSize: size.xs, lineHeight: 17, color: c.muted }}>{on ? onText : offText}</Text>}
      </View>
      <View style={{ width: 52, height: 30, borderRadius: 15, padding: 4, backgroundColor: on ? c.primary : c.lineStrong }}>
        <Animated.View style={[{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } }, thumb]}>
          {on && <Icon name="check" size={12} color={c.primary} weight="bold" />}
        </Animated.View>
      </View>
    </Press>
  );
}

/* ---------- Progress ---------- */
export function Steps({ n, of }: { n: number; of: number }) {
  const { c } = useTheme();
  return <View style={{ flexDirection: 'row', gap: 6 }}>{Array.from({ length: of }, (_, i) => <View key={i} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i < n ? c.primary : c.line }} />)}</View>;
}

export function Checklist({ items }: { items: [string, boolean][] }) {
  const { c } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      {items.map(([t, done], i) => (
        <Rise key={t} i={i}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: c.line, backgroundColor: c.card }}>
            <View style={{ width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: done ? c.primary : c.lineStrong, backgroundColor: done ? c.primary : 'transparent' }}>
              {done && <Icon name="check" size={14} color={c.onPrimary} weight="bold" />}
            </View>
            <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: size.sm, color: c.ink }}>{t}</Text>
          </View>
        </Rise>
      ))}
    </View>
  );
}

export function Timeline({ steps, done }: { steps: [string, string?][]; done: number }) {
  const { c } = useTheme();
  return (
    <View>
      {steps.map(([t, when], i) => {
        const isDone = i < done, now = i === done;
        return (
          <View key={t} style={{ flexDirection: 'row', gap: 12, minHeight: 56 }}>
            <View style={{ alignItems: 'center', width: 28 }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2,
                borderColor: isDone ? c.primary : now ? c.harvestFill : c.lineStrong, backgroundColor: isDone ? c.primary : now ? c.harvestSoft : c.card }}>
                {isDone && <Icon name="check" size={14} color={c.onPrimary} weight="bold" />}
              </View>
              {i < steps.length - 1 && <View style={{ flex: 1, width: 2, backgroundColor: isDone ? c.leaf : c.line }} />}
            </View>
            <View style={{ flex: 1, paddingBottom: 12 }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.sm, color: c.ink }}>{t}</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: size.xs, color: c.muted }}>{when || (now ? 'Next step' : '')}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

/** Dashboard number that counts up when the screen opens (e.g. "₦86,500"). Off with Reduce Motion. */
export function CountUp({ value, style }: { value: string; style?: StyleProp<TextStyle> }) {
  // One line always; shrinks on very narrow cards instead of wrapping
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const m = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
    if (!m) { setShown(value); return; }
    const [, pre, num, post] = m, target = Number(num.replace(/,/g, '')), dec = (num.split('.')[1] ?? '').length, commas = num.includes(',');
    let raf = 0, cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then(reduce => {
      if (reduce || cancelled) { setShown(value); return; }
      const t0 = Date.now(), ms = 1200;
      const tick = () => {
        const k = Math.min(1, (Date.now() - t0) / ms), v = target * (1 - Math.pow(1 - k, 3));
        const f = commas ? Number(v.toFixed(dec)).toLocaleString('en-NG', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : v.toFixed(dec);
        setShown(k < 1 ? pre + f + post : value);
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, [value]);
  return <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} style={[{ fontVariant: ['tabular-nums', 'lining-nums'] }, style]}>{shown}</Text>;
}

/** Dashboard number card. Same size for every value so cards in a grid line up; one line for each text. */
export function Stat({ icon, label, value, sub, gold, i = 0 }: { icon: IconName; label: string; value: string; sub?: string; gold?: boolean; i?: number }) {
  const { c } = useTheme();
  return (
    <Rise i={i} style={{ flex: 1 }}>
      <Card tight style={{ gap: 6, flex: 1 }}>
        <View style={{ width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: gold ? c.harvestSoft : c.primarySoft }}>
          <Icon name={icon} size={18} color={gold ? c.harvest : c.primaryInk} />
        </View>
        <T v="small" muted numberOfLines={1}>{label}</T>
        <CountUp value={value} style={{ fontFamily: fonts.display, fontSize: size.xl + 2, lineHeight: 30, color: c.ink }} />
        {sub && <T v="xs" muted numberOfLines={1}>{sub}</T>}
      </Card>
    </Rise>
  );
}

/** Grid of Stat cards in even rows: 2 per row on phones, all in one row on wide screens. */
export function StatGrid({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const items = Children.toArray(children);
  const cols = width >= 700 ? items.length : 2;
  const rows: ReactNode[][] = [];
  for (let k = 0; k < items.length; k += cols) rows.push(items.slice(k, k + cols));
  return (
    <View style={{ gap: space[3] }}>
      {rows.map((r, k) => <View key={k} style={{ flexDirection: 'row', gap: space[3] }}>{r}{r.length < cols && Array.from({ length: cols - r.length }, (_, j) => <View key={`f${j}`} style={{ flex: 1 }} />)}</View>)}
    </View>
  );
}

/** Tick box row (terms, keep me signed in). */
export function CheckRow({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  const { c } = useTheme();
  return (
    <Press onPress={() => { haptic.select(); onChange(!on); }} role="checkbox" selected={on} label={label} scaleTo={0.98}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: tap }}>
      <View style={{ width: 24, height: 24, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center', borderColor: on ? c.primary : c.lineStrong, backgroundColor: on ? c.primary : c.card }}>
        {on && <Icon name="check" size={14} color={c.onPrimary} weight="bold" />}
      </View>
      <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: size.sm, color: c.ink }}>{label}</Text>
    </Press>
  );
}

/** Six one-digit boxes for email codes. */
export function CodeBoxes({ value, invalid }: { value: string; invalid?: boolean }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
      {Array.from({ length: 6 }, (_, i) => (
        <TextInput key={i} defaultValue={value[i] ?? ''} maxLength={1} keyboardType="number-pad" textContentType={i === 0 ? 'oneTimeCode' : 'none'} accessibilityLabel={`Digit ${i + 1}`}
          style={{ width: 46, height: 56, borderRadius: radius.md, borderWidth: 1.5, textAlign: 'center', fontFamily: fonts.bodyHeavy, fontSize: size.xl, color: c.ink, backgroundColor: c.card,
            borderColor: invalid ? c.danger : value[i] ? c.primary : c.lineStrong }} />
      ))}
    </View>
  );
}

/** Inline text link with a 44 pt tap area (padding offset by negative margin). */
export function TextLink({ title, onPress }: { title: string; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Press onPress={onPress} role="link" label={title} scaleTo={0.96} style={{ paddingVertical: 12, paddingHorizontal: 6, marginVertical: -12, marginHorizontal: -6 }}>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.sm, color: c.primaryInk, textDecorationLine: 'underline' }}>{title}</Text>
    </Press>
  );
}

/** Day / Night / Match phone switch (role menu and account screens). */
export function LookSwitch() {
  const { c, mode, setMode } = useTheme();
  const items: [ThemeMode, string, IconName][] = [['system', 'Match phone', 'monitor'], ['light', 'Day', 'sun'], ['dark', 'Night', 'moon']];
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel="Look" style={{ flexDirection: 'row', padding: 4, borderRadius: radius.md, backgroundColor: c.sunken, gap: 4 }}>
      {items.map(([m, label, icon]) => (
        <Press key={m} onPress={() => { haptic.select(); setMode(m); }} role="radio" selected={mode === m} label={label}
          style={{ flex: 1, minHeight: 44, flexDirection: 'row', gap: 6, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: mode === m ? c.card : 'transparent' }}>
          <Icon name={icon} size={16} color={mode === m ? c.primaryInk : c.muted} />
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.sm, color: mode === m ? c.primaryInk : c.muted }}>{label}</Text>
        </Press>
      ))}
    </View>
  );
}
