/* Farmer · Orders: filter by status; buyers have already paid. States: default, empty. */
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { FarmerOrderRow } from '@/components/farmer';
import { FARMER_ORDERS } from '@/data/farmer';
import { useNav, useScreenState } from '@/proto/Proto';
import { space } from '@/theme/tokens';
import { Button, Chip, Empty, Rise, T } from '@/ui/kit';
import { ListCard } from '@/ui/market';
import { Screen, TabHeader } from '@/ui/screen';

const TABS = ['All', 'New', 'Preparing', 'Ready for pickup', 'Assigned', 'Collected'];

export default function Orders() {
  const [state] = useScreenState('/farmer/orders', 'Orders', ['default', 'empty']);
  const [tab, setTab] = useState('All');
  const nav = useNav();
  const list = FARMER_ORDERS.filter(o => tab === 'All' || o.status === tab);
  return (
    <Screen tabs refresh header={<TabHeader role="farmer" title="Orders" subtitle="Confirm new orders quickly. Buyers have already paid." />}>
      {state === 'empty' ? (
        <Rise><Empty icon="receipt" title="No orders yet" action={<Button title="Share my storefront" icon="share" onPress={() => nav.replace('/farmer/farm')} />}>Share your storefront link to get your first order.</Empty></Rise>
      ) : <>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space[4] }} contentContainerStyle={{ paddingHorizontal: space[4], gap: 8 }}>
          {TABS.map(t => {
            const n = FARMER_ORDERS.filter(o => t === 'All' || o.status === t).length;
            return <Chip key={t} label={t === 'Assigned' ? `Delivery · ${n}` : `${t} · ${n}`} on={tab === t} onPress={() => setTab(t)} />;
          })}
        </ScrollView>
        <Rise><ListCard>{list.map((o, i) => <FarmerOrderRow key={o.id} o={o} first={i === 0} />)}</ListCard></Rise>
        {!list.length && <T v="small" muted center>No orders with this status.</T>}
      </>}
    </Screen>
  );
}
