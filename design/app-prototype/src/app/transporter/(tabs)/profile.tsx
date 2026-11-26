/* Transporter · Profile: the public profile buyers see (vehicle, rating, reviews from delivered orders),
   plus your vehicle, areas and documents. States: default, few reviews (a new transporter). */
import { Text, View } from 'react-native';
import { useVerified } from '@/components/transporter';
import { TRANSPORTERS } from '@/data/delivery';
import { initials, PHOTOS } from '@/data/sample';
import { PROFILE_REVIEWS } from '@/data/transporter';
import { useNav, useProto, useScreenState } from '@/proto/Proto';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size, space } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Avatar, Badge, Button, Card, Kv, Rise, Row, T, Verified } from '@/ui/kit';
import { ListCard, ListRow, Photo, Rating, shareLink } from '@/ui/market';
import { Screen, TabHeader } from '@/ui/screen';

export default function Profile() {
  const { c } = useTheme();
  const [state] = useScreenState('/transporter/profile', 'Profile', ['default', 'few reviews']);
  const verified = useVerified();
  const nav = useNav();
  const { toast } = useProto();
  const few = state === 'few reviews';
  const t = few ? TRANSPORTERS.cold : TRANSPORTERS.ike;
  const reviews = few ? [{ who: 'FreshMart Foods', stars: 5, text: 'Fish arrived cold and on time.', when: '18 Nov' }] : PROFILE_REVIEWS;
  const slug = few ? 'agbor-cold-van' : 'ike-haulage';
  return (
    <Screen tabs refresh header={<TabHeader role="transporter" title="Profile" subtitle="What buyers see when you quote" />}>
      <Rise>
        <Card style={{ padding: 0, gap: 0, overflow: 'hidden' }}>
          <Photo src={PHOTOS.truckCover} ratio={16 / 6} rounded={0} label="Cover photo: a truck on a farm road" />
          <View style={{ padding: space[4], paddingTop: 0, gap: 10 }}>
            <View style={{ marginTop: -28, width: 56, height: 56, borderRadius: radius.lg, backgroundColor: c.primary, borderWidth: 3, borderColor: c.card, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: fonts.display, fontSize: size.lg, color: c.onPrimary }}>{t.initials}</Text>
            </View>
            <Row gap={8} wrap><T v="h2">{t.name}</T>{verified ? <Verified /> : <Badge tone="warn" icon="clock">Pending review</Badge>}</Row>
            <Row gap={14} wrap>
              <Row gap={4}><Icon name="truck" size={14} color={c.muted} /><T v="small" muted>{t.vehicle}</T></Row>
              <Row gap={4}><Icon name="pin" size={14} color={c.muted} /><T v="small" muted>{t.base}</T></Row>
              <Row gap={4}><Icon name="check" size={14} color={c.muted} /><T v="small" muted>{t.jobs} deliveries</T></Row>
            </Row>
            <Rating value={t.rating} count={t.reviews} />
            <Button title="Share my profile" icon="share" variant="secondary" small onPress={() => shareLink(`${t.name} on OgaFarm`, `https://farmoga.com/transporter/${slug}`, toast)} />
          </View>
        </Card>
      </Rise>

      <Rise i={1} style={{ gap: 8 }}>
        <T v="h3">Delivery reviews</T>
        {reviews.map(r => (
          <Card key={r.who}>
            <Row gap={12}>
              <Avatar initials={initials(r.who)} size={40} />
              <View style={{ flex: 1 }}><T v="label">{r.who}</T><T v="xs" muted>{r.when}</T></View>
            </Row>
            <Rating value={r.stars} />
            <T v="body">{r.text}</T>
            <Badge tone="ok" icon="seal">From a delivered order</Badge>
          </Card>
        ))}
      </Rise>

      <Rise i={2}>
        <Card>
          <T v="h3">Vehicle and capacity</T>
          <Kv rows={[['Vehicle', `${t.vehicle} · ${t.plate}`], ['Max load', t.payload], ['Areas', 'Aniocha North, Asaba, Agbor']]} />
        </Card>
      </Rise>

      <Rise i={3} style={{ gap: 8 }}>
        <T v="eyebrow">Your business</T>
        <ListCard>
          <ListRow first icon="truck" title="Edit vehicle and capacity" sub="Change vehicle, plate or load" onPress={() => nav.push('/transporter/signup', 'default')} />
          <ListRow icon="map" title="Areas you cover" sub="3 areas" onPress={() => toast('Areas open')} />
          <ListRow icon="doc" title="Documents" sub={verified ? 'ID and utility bill approved' : 'Under review'} right={<Badge tone={verified ? 'ok' : 'warn'} align="center">{verified ? 'Verified' : 'Pending'}</Badge>} />
        </ListCard>
      </Rise>

    </Screen>
  );
}
