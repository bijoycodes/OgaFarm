/* Farmer parts used on several screens: share-my-storefront card, order row, onboarding progress. */
import { Linking, Text, View } from 'react-native';
import { naira, initials } from '@/data/sample';
import { FARMER_ORDERS, STORE_URL } from '@/data/farmer';
import { useNav, useProto } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Avatar, Badge, Button, Card, Press, Row, Status, Steps, T } from '@/ui/kit';
import { shareLink } from '@/ui/market';

/** Storefront link with Copy, WhatsApp and the phone's share sheet. */
export function ShareStore({ compact }: { compact?: boolean }) {
  const { c } = useTheme();
  const { toast } = useProto();
  const text = `Buy fresh from Okafor Family Farm on OgaFarm: https://${STORE_URL}`;
  return (
    <Card tone="soft">
      {!compact && <View style={{ gap: 2 }}><T v="h3">Share my storefront</T><T v="small" muted>Send your link to customers, WhatsApp groups and your status.</T></View>}
      <Press onPress={() => { haptic.success(); toast('Link copied'); }} label={`Copy link ${STORE_URL}`} scaleTo={0.98}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48, paddingHorizontal: 12, borderRadius: radius.md, backgroundColor: c.card, borderWidth: 1, borderColor: c.line }}>
        <Icon name="store" size={16} color={c.muted} />
        <Text numberOfLines={1} style={{ flex: 1, fontFamily: fonts.bodySemi, fontSize: size.sm, color: c.ink }}>{STORE_URL}</Text>
        <Row gap={4}><Icon name="copy" size={16} color={c.primaryInk} /><Text style={{ fontFamily: fonts.bodyBold, fontSize: size.sm, color: c.primaryInk }}>Copy</Text></Row>
      </Press>
      <Row gap={10}>
        <Button title="WhatsApp" icon="whatsapp" variant="wa" small style={{ flex: 1 }}
          onPress={() => Linking.openURL(`whatsapp://send?text=${encodeURIComponent(text)}`).catch(() => toast('Opens WhatsApp with your storefront link'))} />
        <Button title="More options" icon="share" variant="secondary" small style={{ flex: 1 }} onPress={() => shareLink('Okafor Family Farm on OgaFarm', `https://${STORE_URL}`, toast)} />
      </Row>
    </Card>
  );
}

/** One order in a list; opens the order screen in the matching state. */
export function FarmerOrderRow({ o, first }: { o: (typeof FARMER_ORDERS)[number]; first?: boolean }) {
  const { c } = useTheme();
  const nav = useNav();
  return (
    <Press onPress={() => nav.push('/farmer/order', o.state)} label={`${o.id}, ${o.buyer}, ${o.qty} ${o.item}, ${naira(o.total)}, ${o.status}`} scaleTo={0.99}
      style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderTopWidth: first ? 0 : 1, borderTopColor: c.line }}>
      <Avatar initials={initials(o.buyer)} size={40} tone={o.status === 'New' ? 'gold' : 'soft'} />
      <View style={{ flex: 1, gap: 2 }}>
        <Row gap={6}><Text style={{ fontFamily: fonts.bodyBold, fontSize: size.sm, color: c.ink, flexShrink: 1 }} numberOfLines={1}>{o.buyer}</Text>{o.how === 'Delivery' && <Icon name="truck" size={14} color={c.info} label="Delivery" />}</Row>
        <T v="xs" muted numberOfLines={2}>{o.qty} · {o.item}</T>
        <Row gap={6} wrap style={{ marginTop: 2 }}><Status s={o.status} /><T v="xs" muted>{o.when}</T></Row>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 2, alignSelf: 'flex-start' }}>
        <Text style={{ fontFamily: fonts.bodyHeavy, fontSize: size.sm, color: c.ink, fontVariant: ['tabular-nums'] }}>{naira(o.total)}</Text>
        <T v="xs" muted>{o.id}</T>
      </View>
    </Press>
  );
}

/** "Step 2 of 3 · Plan" bar for the farmer setup flow. */
export function SetupSteps({ n, label }: { n: number; label: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Row between><Badge tone="info" align="center">Farmer setup</Badge><T v="xs" muted numberOfLines={1}>Step {n} of 3 · {label}</T></Row>
      <Steps n={n} of={3} />
    </View>
  );
}
