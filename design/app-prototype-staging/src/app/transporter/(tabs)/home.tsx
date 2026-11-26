/* Transporter · Dashboard: availability, numbers, active job, new requests nearby.
   States: default, pending verification (always pending for a transporter role added in the demo). */
import { useState } from 'react';
import { View } from 'react-native';
import { AvailabilityCard, RequestRow, useVerified } from '@/components/transporter';
import { DELIVERY as D, TRANSPORTERS } from '@/data/delivery';
import { naira } from '@/data/sample';
import { REQUESTS } from '@/data/transporter';
import { useAccount, useNav, useProto, useScreenState } from '@/proto/Proto';
import { space } from '@/theme/tokens';
import { Alert, Button, Card, Kv, Rise, Row, Stat, StatGrid, Status, T, TextLink } from '@/ui/kit';
import { ListCard, Route } from '@/ui/market';
import { Screen, TabHeader } from '@/ui/screen';

const T_ = TRANSPORTERS.ike;

export default function Home() {
  useScreenState('/transporter/home', 'Transporter dashboard', ['default', 'pending verification']);
  const verified = useVerified();
  const acct = useAccount();
  const nav = useNav();
  const { toast } = useProto();
  const [on, setOn] = useState(true);
  const first = acct.name.split(' ')[0];
  const live = verified && on;

  return (
    <Screen tabs refresh header={<TabHeader role="transporter" title={`Hi, ${first}`} subtitle={verified ? 'Good morning. You have 4 delivery requests near you.' : 'Good morning. Your documents are being reviewed.'} />}>
      <Rise><AvailabilityCard on={live} disabled={!verified} onChange={v => { setOn(v); toast(v ? 'You are available for jobs' : 'You are offline. No new requests.'); }} /></Rise>
      {!verified && <Rise><Alert tone="warn" icon="clock" title="Waiting for verification">You can look at delivery requests, but you can send quotes only after our team approves your ID and utility bill. This usually takes 1 working day.</Alert></Rise>}

      <StatGrid>
        <Stat i={0} icon="list" label="New requests" value="4" sub="In your areas" />
        <Stat i={1} icon="truck" gold label="Active jobs" value={verified ? '1' : '0'} sub={verified ? 'Pickup by 2:00 pm' : 'None yet'} />
        <Stat i={2} icon="coins" label="Earned this month" value={verified ? naira(86500) : naira(0)} sub={verified ? '14 deliveries' : '—'} />
        <Stat i={3} icon="star" gold label="Your rating" value={verified ? String(T_.rating) : '—'} sub={verified ? `${T_.reviews} reviews` : 'After your first delivery'} />
      </StatGrid>

      {verified ? (
        <Rise i={4}>
          <Card>
            <Row between><T v="h3">Active job</T><Status s="Assigned" /></Row>
            <Route from={`${D.farm}, Issele-Uku`} to={D.dropArea} />
            <Kv rows={[['Cargo', `${D.item} · ${D.qty}`], ['Pickup', 'Today by 2:00 pm'], ['Your price', naira(D.fee)]]} />
            <Button title="Open job" icon="truck" onPress={() => nav.push('/transporter/job', 'assigned')} />
          </Card>
        </Rise>
      ) : (
        <Rise i={4}>
          <Card>
            <Row between><T v="h3">Your vehicle</T><Status s="Pending review" /></Row>
            <Kv rows={[['Vehicle', T_.vehicle], ['Plate', T_.plate], ['Max load', T_.payload]]} />
          </Card>
        </Rise>
      )}

      <Rise i={5} style={{ gap: 8 }}>
        <Row between><T v="h3">New delivery requests</T><TextLink title="See all" onPress={() => nav.replace('/transporter/requests')} /></Row>
        <ListCard>{REQUESTS.slice(0, 3).map((r, i) => <RequestRow key={r.id} r={r} first={i === 0} verified={verified} />)}</ListCard>
      </Rise>
    </Screen>
  );
}
