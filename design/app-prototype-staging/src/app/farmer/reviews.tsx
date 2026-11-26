/* Farmer · Reviews of my farm (V2). Negative reviews stay; the farmer can ask for a rules check. */
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { REVIEWS } from '@/data/farmer';
import { initials } from '@/data/sample';
import { useNav, useScreenState } from '@/proto/Proto';
import { space } from '@/theme/tokens';
import { Avatar, Button, Card, Rise, Row, Stat, StatGrid, T } from '@/ui/kit';
import { Rating } from '@/ui/market';
import { Screen } from '@/ui/screen';

export default function Reviews() {
  useScreenState('/farmer/reviews', 'Reviews');
  const nav = useNav();
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Reviews' }} />
      <Rise><T v="small" muted>Only buyers with a delivered or collected order can review your farm.</T></Rise>
      <StatGrid>
        <Stat i={0} icon="star" gold label="Average" value="4.8" sub="23 reviews" />
        <Stat i={1} icon="thumbsup" label="4 or 5 stars" value="91%" sub="21 of 23" />
      </StatGrid>
      {REVIEWS.map((r, i) => (
        <Rise key={r.who} i={i + 2}>
          <Card>
            <Row gap={12}>
              <Avatar initials={initials(r.who)} size={40} />
              <View style={{ flex: 1 }}><T v="label">{r.who}</T><T v="xs" muted>{r.when} · verified order</T></View>
            </Row>
            <Rating value={r.stars} />
            <T v="body">{r.text}</T>
            {r.stars <= 2 && <Button title="Ask us to check this review" icon="flag" variant="secondary" small onPress={() => nav.push('/farmer/review-appeal', 'default')} />}
          </Card>
        </Rise>
      ))}
      <T v="xs" muted center>A review is never removed just because it is negative. You can ask us to check a review that breaks the rules.</T>
    </Screen>
  );
}
