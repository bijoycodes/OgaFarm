/* Transporter · Delivery requests near your areas; filters; send a price. States: default, not verified, empty. */
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { RequestRow, useVerified } from '@/components/transporter';
import { REQUESTS, type Request } from '@/data/transporter';
import { useScreenState } from '@/proto/Proto';
import { space } from '@/theme/tokens';
import { Alert, Chip, Empty, Rise, T } from '@/ui/kit';
import { ListCard } from '@/ui/market';
import { Screen, TabHeader } from '@/ui/screen';

const FILTERS: [string, (r: Request) => boolean][] = [['All', () => true], ['Fits my vehicle', r => r.fits], ['Today', r => r.today], ['Perishable', r => r.perishable]];

export default function Requests() {
  const [state] = useScreenState('/transporter/requests', 'Delivery requests', ['default', 'not verified', 'empty']);
  const verifiedAcct = useVerified();
  const verified = verifiedAcct && state !== 'not verified';
  const [filter, setFilter] = useState('All');
  const list = REQUESTS.filter(FILTERS.find(f => f[0] === filter)![1]);
  return (
    <Screen tabs refresh header={<TabHeader role="transporter" title="Delivery requests" subtitle="Buyers near your areas who need a delivery. Send a price; the buyer picks one quote." />}>
      {!verified && <Rise><Alert tone="warn" icon="lock" title="You can't send quotes yet">Only verified transporters can quote or be assigned. Your documents are under review.</Alert></Rise>}
      {state === 'empty' ? (
        <Rise><Empty icon="truck" title="No requests right now">We will notify you when a buyer in your areas needs a delivery. Adding more areas brings more requests.</Empty></Rise>
      ) : <>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space[4] }} contentContainerStyle={{ paddingHorizontal: space[4], gap: 8 }}>
          {FILTERS.map(([f, test]) => <Chip key={f} label={`${f} · ${REQUESTS.filter(test).length}`} on={filter === f} onPress={() => setFilter(f)} />)}
        </ScrollView>
        <Rise><ListCard>{list.map((r, i) => <RequestRow key={r.id} r={r} first={i === 0} verified={verified} />)}</ListCard></Rise>
        <T v="xs" muted center>Exact addresses are shared only after you are assigned.</T>
      </>}
    </Screen>
  );
}
