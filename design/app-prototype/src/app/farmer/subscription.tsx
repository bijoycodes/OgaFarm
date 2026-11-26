/* Farmer · Subscription: current plan, what it includes, payment history. States: active, expiring. */
import { Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { naira } from '@/data/sample';
import { useNav, useScreenState } from '@/proto/Proto';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, size } from '@/theme/tokens';
import { Alert, Button, Card, Checklist, Kv, Rise, Row, Status, T } from '@/ui/kit';
import { ListCard, ListRow } from '@/ui/market';
import { Screen } from '@/ui/screen';

export default function Subscription() {
  const { c } = useTheme();
  const [state] = useScreenState('/farmer/subscription', 'Subscription', ['active', 'expiring']);
  const soon = state === 'expiring';
  const nav = useNav();
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Subscription' }} />
      {soon && <Rise><Alert tone="warn" icon="clock" title="Your plan ends in 9 days">Renew now to keep your storefront visible. Your new term starts when the current one ends, so you lose no days.</Alert></Rise>}
      <Rise i={1}>
        <Card>
          <T v="eyebrow">Current plan</T>
          <Row between><T v="h1">Annual</T><Status s={soon ? 'Expiring' : 'Active'} /></Row>
          <Kv rows={[['Paid until', soon ? '2 Dec 2026' : '23 Nov 2027'], ['Price', `${naira(95000)} / 12 months`], ['Started', '23 Nov 2026']]} />
          <Row gap={10}>
            <Button title="Renew now" onPress={() => nav.push('/farmer/plan')} style={{ flex: 1 }} />
            <Button title="Change plan" variant="secondary" onPress={() => nav.push('/farmer/plan')} style={{ flex: 1 }} />
          </Row>
        </Card>
      </Rise>
      <Rise i={2} style={{ gap: 8 }}>
        <T v="h3">What your plan includes</T>
        <Checklist items={[['Storefront with five tabs', true], ['Unlimited listings', true], ['Orders and buyer messages', true], ['Weekly and monthly reports', true]]} />
      </Rise>
      <Rise i={3} style={{ gap: 8 }}>
        <T v="h3">Payment history</T>
        <ListCard>
          {([['Annual plan', '23 Nov 2026 · OGF-SUB-88213', 95000], ['Quarterly plan', '23 Aug 2026 · OGF-SUB-61057', 30000]] as const).map(([plan, meta, amt], i) => (
            <ListRow key={meta} first={i === 0} icon="receipt" title={plan} sub={meta}
              right={<View style={{ alignItems: 'flex-end', gap: 4 }}><Text style={{ fontFamily: fonts.bodyHeavy, fontSize: size.sm, color: c.ink, fontVariant: ['tabular-nums'] }}>{naira(amt)}</Text><Status s="Paid" /></View>} />
          ))}
        </ListCard>
      </Rise>
    </Screen>
  );
}
