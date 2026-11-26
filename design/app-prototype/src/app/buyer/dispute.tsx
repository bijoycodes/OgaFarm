/* Buyer · Dispute case: messages with the farmer, transporter and OgaFarm, progress, evidence.
   States: open, under review, resolved. */
import { Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { DELIVERY as D } from '@/data/delivery';
import { naira } from '@/data/sample';
import { useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { Alert, Button, Card, Kv, Rise, Row, Status, T, Timeline } from '@/ui/kit';
import { Bubble, TextArea } from '@/ui/market';
import { Screen } from '@/ui/screen';

const ID = '/buyer/dispute';

export default function Dispute() {
  const [state] = useScreenState(ID, 'Dispute case', ['open', 'under review', 'resolved']);
  const step = ['open', 'under review', 'resolved'].indexOf(state);
  const [draft, setDraft] = useState('');
  const [mine, setMine] = useState<string[]>([]);
  const { toast } = useProto();
  const steps: [string, string?][] = [['Problem reported', 'Today, 3:20 pm'], ['Farmer and transporter replied', step >= 1 ? 'Today, 5:05 pm' : 'Waiting, up to 24 h'], ['OgaFarm review', step >= 1 ? 'Started 6:30 pm' : ''], ['Decision', step >= 2 ? '25 Nov, 10:15 am' : '']];
  const send = () => { if (!draft.trim()) return; haptic.success(); setMine(m => [...m, draft.trim()]); setDraft(''); toast('Message sent'); };

  return (
    <Screen keyboard>
      <Stack.Screen options={{ title: 'Case DSP-2031' }} />
      <Rise style={{ gap: 6 }}>
        <T v="h1">Quantity shortfall</T>
        <Row gap={8} wrap><Status s={['Waiting for reply', 'Under review', 'Resolved'][step]} /><T v="small" muted>Order {D.id} · 8 kg missing</T></Row>
      </Rise>
      {step === 2 && <Rise><Alert tone="ok" icon="check" title={`Decision: refund of ${naira(2800)}`}>8 kg × ₦350 is refunded to your card. Refunds usually arrive in 3–5 working days.</Alert></Rise>}

      <Rise i={1}>
        <Card>
          <T v="h3">Messages</T>
          <View style={{ gap: 14 }}>
            <Bubble me who="You · 3:20 pm" text="Received 52 kg instead of 60 kg. Third basket was half full. Photos attached." />
            {step >= 1 && <Bubble who="Emeka Okafor, farmer · 4:40 pm" text="We loaded 3 full baskets, 60 kg. Photo of the scale at loading attached." />}
            {step >= 1 && <Bubble who="Sunday Ike, transporter · 5:05 pm" text="I confirmed 60 kg at pickup. One basket tipped on the Ibusa road. I am sorry." />}
            {step === 2 && <Bubble staff who="OgaFarm support · 25 Nov, 10:15 am" text="Pickup proof shows 60 kg; drop-off shows 52 kg. The loss happened in transit. The buyer is refunded ₦2,800." />}
            {mine.map((m, i) => <Bubble key={i} me who="You · just now" text={m} />)}
          </View>
          {step < 2 && <>
            <TextArea value={draft} onChangeText={setDraft} placeholder="Add more details for the review team" style={{ minHeight: 72 }} />
            <Row gap={10}>
              <Button title="Photos" icon="image" variant="secondary" small onPress={() => toast('Photo added')} style={{ flex: 1 }} />
              <Button title="Send" icon="chat" small disabled={!draft.trim()} onPress={send} style={{ flex: 1 }} />
            </Row>
          </>}
        </Card>
      </Rise>

      <Rise i={2}><Card><T v="h3">Progress</T><Timeline steps={steps} done={step === 0 ? 1 : step === 1 ? 2 : 4} /></Card></Rise>
      <Rise i={3}><Card><T v="h3">Evidence</T><Kv rows={[['Your photos', '3'], ['Pickup proof', '60 kg · photo'], ['Drop-off proof', '52 kg · photo']]} /></Card></Rise>
    </Screen>
  );
}
