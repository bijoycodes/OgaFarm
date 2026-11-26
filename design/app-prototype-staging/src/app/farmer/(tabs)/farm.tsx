/* Farmer · My farm: storefront at a glance, share it, and everything about the farm
   (edit storefront, reviews, subscription, verification). */
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { ShareStore } from '@/components/farmer';
import { FARMS, PHOTOS } from '@/data/sample';
import { useNav, useScreenState } from '@/proto/Proto';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size, space } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Badge, Button, Card, Rise, Row, T, Verified } from '@/ui/kit';
import { ListCard, ListRow, Photo } from '@/ui/market';
import { Screen, TabHeader } from '@/ui/screen';

export default function Farm() {
  const { c } = useTheme();
  useScreenState('/farmer/farm', 'My farm');
  const nav = useNav();
  const f = FARMS.okafor;
  return (
    <Screen tabs refresh header={<TabHeader role="farmer" title="My farm" subtitle="What buyers see at your link" />}>
      <Rise>
        <Card style={{ padding: 0, gap: 0, overflow: 'hidden' }}>
          <Photo src={PHOTOS.farmCover} ratio={16 / 6} rounded={0} label="Your cover photo" />
          <View style={{ padding: space[4], paddingTop: 0, gap: 10 }}>
            <View style={{ marginTop: -28, width: 56, height: 56, borderRadius: radius.lg, backgroundColor: c.primary, borderWidth: 3, borderColor: c.card, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: fonts.display, fontSize: size.lg, color: c.onPrimary }}>{f.initials}</Text>
            </View>
            <Row gap={8} wrap><T v="h2">{f.name}</T><Verified /></Row>
            <Row gap={14} wrap>
              <Row gap={4}><Icon name="star" size={14} weight="fill" color={c.harvestFill} /><T v="small" muted>{f.rating} ({f.reviews})</T></Row>
              <Row gap={4}><Icon name="box" size={14} color={c.muted} /><T v="small" muted>5 products</T></Row>
              <Row gap={4}><Icon name="eye" size={14} color={c.muted} /><T v="small" muted>214 visits this week</T></Row>
            </Row>
            <Row gap={10}>
              <Button title="Edit" icon="edit" small onPress={() => nav.push('/farmer/storefront-editor', 'default')} style={{ flex: 1 }} />
              <Button title="Preview" icon="eye" variant="secondary" small onPress={() => nav.push('/buyer/storefront?farm=okafor', 'default')} style={{ flex: 1 }} />
            </Row>
          </View>
        </Card>
      </Rise>

      <Rise i={1}><ShareStore /></Rise>

      <Rise i={2} style={{ gap: 8 }}>
        <T v="eyebrow">Your farm</T>
        <ListCard>
          <ListRow first icon="star" title="Reviews" sub="4.8 average · 1 waiting for checks" onPress={() => nav.push('/farmer/reviews')} />
          <ListRow icon="card" title="Subscription" sub="Annual · paid until 23 Nov 2027" right={<Badge tone="ok" align="center">Active</Badge>} onPress={() => nav.push('/farmer/subscription', 'active')} />
          <ListRow icon="shield" title="Verification" sub="Approved 22 Nov 2026" right={<Badge tone="ok" align="center">Verified</Badge>} onPress={() => nav.push('/farmer/verification', 'submitted')} />
        </ListCard>
      </Rise>
    </Screen>
  );
}
