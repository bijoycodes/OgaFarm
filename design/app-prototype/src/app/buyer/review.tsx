/* Buyer · Leave verified reviews for the farm and the transporter. States: default, submitted. */
import { Stack } from 'expo-router';
import { useState } from 'react';
import { DELIVERY as D, TRANSPORTERS } from '@/data/delivery';
import { useNav, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { Button, Card, Chip, Empty, Field, Rise, Row, T } from '@/ui/kit';
import { RateInput, TextArea, Who } from '@/ui/market';
import { Screen } from '@/ui/screen';

const ID = '/buyer/review';
const T_ = TRANSPORTERS.ike;

function ReviewCard({ initials, name, sub, initial, tags, text, i }: { initials: string; name: string; sub: string; initial: number; tags: string[]; text: string; i: number }) {
  const [stars, setStars] = useState(initial);
  const [on, setOn] = useState<string[]>([tags[0]]);
  const [t, setT] = useState(text);
  return (
    <Rise i={i}>
      <Card>
        <Who initials={initials} name={name} sub={sub} />
        <RateInput label={`Rating for ${name}`} value={stars} onChange={setStars} />
        <Field label="What went well?"><Row gap={8} wrap>{tags.map(x => <Chip key={x} label={x} on={on.includes(x)} onPress={() => setOn(v => v.includes(x) ? v.filter(y => y !== x) : [...v, x])} />)}</Row></Field>
        <Field label="Your review (optional)"><TextArea value={t} onChangeText={setT} /></Field>
      </Card>
    </Rise>
  );
}

export default function Review() {
  const [state, setState] = useScreenState(ID, 'Leave a review', ['default', 'submitted']);
  const nav = useNav();
  if (state === 'submitted') return (
    <Screen>
      <Stack.Screen options={{ title: 'Review sent' }} />
      <Rise><Empty icon="star" tone="ok" title="Thank you for your review" action={<Button title="Back to browsing" onPress={() => nav.replace('/buyer/browse')} />}>We check every review before it is published, usually within a day. It will show on the farm and the transporter profiles.</Empty></Rise>
    </Screen>
  );
  return (
    <Screen keyboard footer={<Row gap={10}>
      <Button title="Not now" variant="ghost" onPress={() => nav.replace('/buyer/order', 'delivered')} />
      <Button title="Send reviews" icon="check" onPress={() => { haptic.success(); setState('submitted'); }} style={{ flex: 1 }} />
    </Row>}>
      <Stack.Screen options={{ title: 'Leave a review' }} />
      <Rise style={{ gap: 4 }}>
        <T v="h1">How was your order?</T>
        <T v="small" muted>Order {D.id} · delivered today. Only buyers with a delivered order can review.</T>
      </Rise>
      <ReviewCard i={1} initials="OF" name={D.farm} sub="The farm and the produce" initial={5} tags={['Quality', 'Quantity was right', 'Good communication', 'Fair price']} text="Very fresh tomatoes, well packed." />
      <ReviewCard i={2} initials={T_.initials} name={T_.name} sub="The delivery" initial={4} tags={['On time', 'Careful with goods', 'Called ahead', 'Polite']} text="Arrived early. One basket tipped over, but it was sorted out." />
    </Screen>
  );
}
