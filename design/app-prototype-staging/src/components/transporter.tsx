/* Transporter parts used on several screens: verified check, availability card, request row. */
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import type { Request } from '@/data/transporter';
import { useAccount, useNav, useProto } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size, space } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Badge, Press, Row, T } from '@/ui/kit';

/** Sunday is verified unless his dashboard is switched to "pending verification";
    a transporter role added in the demo is always waiting for review. */
export function useVerified() {
  const acct = useAccount();
  const { states } = useProto();
  return acct.key === 'sunday' && states['/transporter/home'] !== 'pending verification';
}

/** Available for jobs: big, clear on/off card with a live dot and a smooth switch. */
export function AvailabilityCard({ on, onChange, disabled }: { on: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  const { c } = useTheme();
  const x = useSharedValue(on ? 22 : 0);
  const pulse = useSharedValue(1);
  useEffect(() => { x.value = withTiming(on ? 22 : 0, { duration: 360, easing: Easing.bezier(0.22, 0.8, 0.36, 1) }); }, [on, x]);
  useEffect(() => { pulse.value = on ? withRepeat(withTiming(2.2, { duration: 1400, easing: Easing.out(Easing.quad) }), -1, false) : 1; }, [on, pulse]);
  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const ring = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }], opacity: on ? (2.2 - pulse.value) / 1.2 * 0.6 : 0 }));
  return (
    <Press onPress={() => { haptic.select(); onChange(!on); }} disabled={disabled} role="switch" selected={on} label={`Available for jobs, ${on ? 'on' : 'off'}`} scaleTo={0.985}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: space[4], borderRadius: radius.lg, borderWidth: 1,
        borderColor: on ? c.primary : c.line, backgroundColor: on ? c.primarySoft : c.card }}>
      <View style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? c.card : c.sunken }}>
        <Animated.View style={[{ position: 'absolute', width: 14, height: 14, borderRadius: 7, backgroundColor: c.ok }, ring]} />
        <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: on ? c.ok : c.muted, borderWidth: 2, borderColor: on ? c.card : c.sunken }} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontFamily: fonts.bodyHeavy, fontSize: size.md, color: c.ink }}>{on ? 'Available for jobs' : 'Offline'}</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: size.xs, lineHeight: 17, color: c.muted }}>{disabled ? 'Available after your documents are approved' : on ? 'Buyers near you can send you requests' : 'You won’t get new requests'}</Text>
      </View>
      <View style={{ width: 52, height: 30, borderRadius: 15, padding: 4, backgroundColor: on ? c.primary : c.lineStrong }}>
        <Animated.View style={[{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } }, thumb]}>
          {on && <Icon name="check" size={12} color={c.primary} weight="bold" />}
        </Animated.View>
      </View>
    </Press>
  );
}

/** One delivery request: route, cargo, timing, tags; opens the quote screen. */
export function RequestRow({ r, first, verified }: { r: Request; first?: boolean; verified: boolean }) {
  const { c } = useTheme();
  const nav = useNav();
  return (
    <Press onPress={() => nav.push(`/transporter/bid?id=${r.id}`, r.state)} label={`${r.from} to ${r.to}. ${r.cargo}. ${r.when}. ${verified && r.fits ? 'Send quote' : 'View'}`} scaleTo={0.99}
      style={{ gap: 8, padding: 14, borderTopWidth: first ? 0 : 1, borderTopColor: c.line }}>
      <Row between gap={8}>
        <Row gap={6} style={{ flexShrink: 1 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.md, color: c.ink }}>{r.from}</Text>
          <Icon name="chev" size={14} color={c.muted} />
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.md, color: c.ink, flexShrink: 1 }} numberOfLines={1}>{r.to}</Text>
        </Row>
        <T v="xs" muted>{r.dist}</T>
      </Row>
      <T v="small">{r.cargo}</T>
      <Row gap={6} wrap>
        {r.today && <Badge tone="gold" icon="clock" align="center">Today</Badge>}
        {r.perishable && <Badge tone="warn" icon="leaf" align="center">Perishable</Badge>}
        {!r.fits && <Badge tone="danger" icon="alert" align="center">Too heavy for you</Badge>}
        <T v="xs" muted>{r.when} · {r.quotes}</T>
      </Row>
    </Press>
  );
}
