/* Farmer · Dashboard: numbers that count up, share my storefront, recent orders, what needs attention.
   States: default, new account, unverified, expired. A farmer role added in the demo opens on "new account". */
import { router } from 'expo-router';
import { View } from 'react-native';
import { FarmerOrderRow } from '@/components/farmer';
import { FARMER_ORDERS } from '@/data/farmer';
import { naira } from '@/data/sample';
import { useAccount, useNav, useProto, useScreenState } from '@/proto/Proto';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Alert, Button, Card, Empty, Rise, Row, Stat, StatGrid, T, TextLink } from '@/ui/kit';
import { ListCard } from '@/ui/market';
import { Screen, TabHeader } from '@/ui/screen';
import { Icon } from '@/ui/Icon';
import { Press } from '@/ui/kit';

export default function Home() {
  const { c } = useTheme();
  const acct = useAccount();
  const [picked] = useScreenState('/farmer/home', 'Farmer dashboard', ['default', 'new account', 'unverified', 'expired']);
  const state = acct.key === 'emeka' ? picked : 'new account';
  const nav = useNav();
  const stockDone = useProto().states['farmer:stock'] === 'confirmed';
  const first = acct.name.split(' ')[0];
  const expired = state === 'expired';

  if (state === 'new account') {
    const steps: [string, string, boolean, () => void][] = [
      ['Choose a plan and verify your farm', 'Your storefront goes live after both', false, () => nav.push('/farmer/plan')],
      ['Set up your storefront', 'Name, photos, pickup location', acct.key === 'emeka', () => nav.push('/farmer/storefront-editor', 'default')],
      ['Add your first product', 'Price, quantity and unit', false, () => nav.push('/farmer/product-form', 'add')],
      ['Share your storefront', 'Send your link on WhatsApp', false, () => nav.push('/farmer/farm')]
    ];
    return (
      <Screen tabs header={<TabHeader role="farmer" title={`Welcome, ${first}`} subtitle="A few steps to your first order." />}>
        <Rise>
          <Card>
            <Row between><T v="h3">Get your farm ready</T><T v="small" muted>{steps.filter(s => s[2]).length} of {steps.length} done</T></Row>
            {steps.map(([t, sub, done, go], i) => (
              <Press key={t} onPress={go} label={`${t}${done ? ', done' : ''}`} scaleTo={0.985}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: c.line, backgroundColor: done ? c.primarySoft : c.card }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: done ? c.primary : c.lineStrong, backgroundColor: done ? c.primary : 'transparent' }}>
                  {done ? <Icon name="check" size={14} color={c.onPrimary} weight="bold" /> : <T v="xs" bold>{i + 1}</T>}
                </View>
                <View style={{ flex: 1 }}><T v="label">{t}</T><T v="xs" muted>{sub}</T></View>
                <Icon name="chev" size={16} color={c.muted} />
              </Press>
            ))}
          </Card>
        </Rise>
        <Rise i={1}><Empty icon="receipt" title="No orders yet">When buyers order from your storefront, they appear here.</Empty></Rise>
      </Screen>
    );
  }

  return (
    <Screen tabs refresh header={<TabHeader role="farmer" title={`Hi, ${first}`} subtitle="Good morning. Here is your farm today." />}>
      {state === 'unverified' && <Rise><Alert tone="info" icon="clock" title="Verification in progress">Your storefront is ready but hidden from buyers until our team approves your documents (usually 1 working day).</Alert></Rise>}
      {expired && <Rise><Alert tone="danger" icon="alert" title="Your plan ended on 20 Nov" action={<View style={{ marginTop: 8 }}><Button title="Renew" small onPress={() => nav.push('/farmer/plan')} /></View>}>Your storefront and 5 listings are hidden from buyers. Nothing was deleted. Renew to show them again.</Alert></Rise>}

      <StatGrid>
        <Stat i={0} icon="box" label="Active listings" value={expired ? '0' : '5'} sub={expired ? '5 hidden' : stockDone ? 'All stock confirmed' : '1 needs a stock check'} />
        <Stat i={1} icon="receipt" gold label="New orders" value="1" sub={`${naira(7000)} waiting`} />
        <Stat i={2} icon="wallet" label="Sales this month" value={naira(136000)} sub="12 orders" />
        <Stat i={3} icon="star" label="Rating" value="4.8" sub="23 reviews" />
      </StatGrid>

      <Rise i={4}><Button title="Add product" icon="plus" onPress={() => nav.push('/farmer/product-form', 'add')} /></Rise>

      <Rise i={5} style={{ gap: 8 }}>
        <T v="h3">Needs your attention</T>
        <Alert tone="info" icon="receipt" title="New order from Ngozi Eze" action={<View style={{ marginTop: 6 }}><TextLink title="Open order" onPress={() => nav.push('/farmer/order', 'pickup · new')} /></View>}>20 kg tomatoes · confirm within 2 hours.</Alert>
        {!stockDone && <Alert tone="warn" icon="clock" title="Confirm stock: Yellow maize" action={<View style={{ marginTop: 6 }}><TextLink title="Update stock" onPress={() => router.push('/farmer/stock' as never)} /></View>}>Last confirmed 6 days ago. Buyers trust fresh stock.</Alert>}
      </Rise>

      <Rise i={6} style={{ gap: 8 }}>
        <Row between><T v="h3">Recent orders</T><TextLink title="View all" onPress={() => nav.replace('/farmer/orders')} /></Row>
        <ListCard>{FARMER_ORDERS.slice(0, 3).map((o, i) => <FarmerOrderRow key={o.id} o={o} first={i === 0} />)}</ListCard>
      </Rise>

    </Screen>
  );
}
