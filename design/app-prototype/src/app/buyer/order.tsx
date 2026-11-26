/* Buyer · Order status. Delivery orders (V2): progress, delivery code, driver, route, payment.
   Pickup orders (V1): pickup code and details. States: driver assigned, in transit, delivered,
   pickup order, confirming (payment), failed (payment). */
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { DELIVERY as D, TRANSPORTERS } from '@/data/delivery';
import { naira } from '@/data/sample';
import { useNav, useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { Alert, Button, Card, Empty, Kv, Rise, Row, Status, T, Timeline } from '@/ui/kit';
import { CodeCard, Route, Who } from '@/ui/market';
import { Screen } from '@/ui/screen';

const ID = '/buyer/order';
const T_ = TRANSPORTERS.ike;

export default function Order() {
  const [state, setState] = useScreenState(ID, 'Order status', ['driver assigned', 'in transit', 'delivered', 'pickup order', 'confirming', 'failed']);
  const nav = useNav();
  const { toast } = useProto();

  // Payment confirmation arrives a moment later
  useEffect(() => {
    if (state !== 'confirming') return;
    const t = setTimeout(() => { haptic.success(); setState('pickup order'); }, 3000);
    return () => clearTimeout(t);
  }, [state, setState]);

  if (state === 'confirming' || state === 'failed') return (
    <Screen>
      <Stack.Screen options={{ title: 'Order OGF-10421' }} />
      <Rise>{state === 'confirming'
        ? <Empty icon="clock" tone="warn" title="Confirming your payment">Your stock is held. We confirm the order as soon as the payment provider confirms your payment.</Empty>
        : <Empty icon="alert" tone="danger" title="Payment failed" action={<Button title="Try again" onPress={() => nav.replace('/buyer/checkout', 'pickup')} />}>No money was taken and the stock was released. You can try again while the farmer still has stock.</Empty>}
      </Rise>
    </Screen>
  );

  if (state === 'pickup order') return (
    <Screen>
      <Stack.Screen options={{ title: 'Order OGF-10421' }} />
      <Rise><Alert tone="ok" icon="check" title="Order confirmed">Okafor Family Farm has your 20 kg of tomatoes. We will tell you when it is ready.</Alert></Rise>
      <Rise i={1}><CodeCard label="Your pickup code" code="4821" note="Show this code to the farmer when you collect. Do not share it before you have your order." /></Rise>
      <Rise i={2}>
        <Card>
          <T v="h3">Pickup details</T>
          <Kv rows={[['Where', 'Farm gate, Issele-Uku'], ['When', 'Mon–Sat, 7am–5pm'], ['Farmer', 'Emeka Okafor'], ['Paid', naira(7000)]]} />
          <Row gap={10}>
            <Button title="Directions" icon="map" variant="secondary" small onPress={() => toast('Opens directions in maps')} style={{ flex: 1 }} />
            <Button title="Call farmer" icon="phone" variant="soft" small onPress={() => Linking.openURL('tel:+2348031234567').catch(() => toast('Calls +234 803 123 4567'))} style={{ flex: 1 }} />
          </Row>
        </Card>
      </Rise>
    </Screen>
  );

  const step = ['driver assigned', 'in transit', 'delivered'].indexOf(state);
  const steps: [string, string?][] = [['Paid', 'Today, 11:52 am'], ['Transporter assigned', '11:58 am'], ['Picked up at the farm', step >= 1 ? '12:41 pm' : 'Expected 12:30 pm'], ['On the way', step >= 1 ? '12:45 pm' : ''], ['Delivered', step >= 2 ? '3:12 pm' : 'Expected by 3:30 pm']];
  return (
    <Screen>
      <Stack.Screen options={{ title: `Order ${D.id}` }} />
      <Rise style={{ gap: 6 }}>
        <Row gap={8}><T v="h2">{D.item}</T></Row>
        <Row gap={8}><Status s={['Assigned', 'In transit', 'Delivered'][step]} /><T v="small" muted>{D.qty} · from {D.farm}</T></Row>
      </Rise>
      <Rise i={1}>
        {step === 0 && <Alert tone="ok" icon="check" title="Paid. Ike Haulage is collecting your order">Sunday will pick up at the farm around 12:30 pm and deliver by 3:30 pm.</Alert>}
        {step === 1 && <Alert tone="info" icon="truck" title="On the way · expected by 3:30 pm">Updates come from the driver. Check your order when it arrives, before you give your code.</Alert>}
        {step === 2 && <Alert tone="ok" icon="check" title="Delivered at 3:12 pm">You confirmed 60 kg in good condition. If you find a problem, you can still report it from this order.</Alert>}
      </Rise>

      <Rise i={2}>
        {step < 2
          ? <CodeCard label="Your delivery code" code={D.code} note="Give this code to the driver only after you have checked your order.">
              {step === 1 && <Button title="My order has arrived" onPress={() => nav.push('/buyer/receive', 'default')} />}
            </CodeCard>
          : <Card>
              <T v="h3">What’s next</T>
              <Button title="Leave a review" icon="star" onPress={() => nav.push('/buyer/review', 'default')} />
              <Button title="Report a problem" icon="flag" variant="secondary" onPress={() => nav.push('/buyer/receive', 'issue')} />
            </Card>}
      </Rise>

      <Rise i={3}><Card><T v="h3">Progress</T><Timeline steps={steps} done={step === 0 ? 2 : step === 1 ? 4 : 5} /></Card></Rise>

      <Rise i={4}>
        <Card>
          <T v="h3">Driver</T>
          <Who initials={T_.initials} name={T_.person} sub={`${T_.name} · ${T_.vehicle} · ${T_.plate}`} verified={T_.verified} />
          <Button title="Call driver" icon="phone" variant="soft" onPress={() => Linking.openURL(`tel:${T_.phone}`).catch(() => toast('Calls +234 802 441 9087'))} />
        </Card>
      </Rise>

      <Rise i={5}><Card><T v="h3">Route · {D.distance}</T><Route from={`${D.farm} · ${D.pickup}`} to={D.dropFull} /></Card></Rise>

      <Rise i={6}><Card><T v="h3">Payment</T><Kv rows={[['Produce', naira(D.subtotal)], ['Delivery', naira(D.fee)], ['Total paid', naira(D.subtotal + D.fee)]]} /></Card></Rise>
    </Screen>
  );
}
