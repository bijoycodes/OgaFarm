/* v2 · Buyer: checkout with delivery, compare delivery quotes, order tracking, receive and inspect, dispute, review */
import { Icon } from '@shared/ui/Icon';
import { Btn, Status, Alert, Empty, Photo, Stepper, Field, Kv, Badge, Verified, Timeline, Upload, Chips } from '@shared/ui/ui';
import { AppShell } from '@shared/layout/shells';
import { PRODUCTS, naira } from '@shared/data/sample';
import { OrderStatus as PickupOrderStatus } from '../../v1-mvp/screens/buyer';
import { TRANSPORTERS, DELIVERY as D, Route, Rating, RateInput } from '../parts';

const T = TRANSPORTERS.ike;

/* ---------- Checkout: pickup or delivery (updated from V1) ---------- */
export function Checkout({ state }: { state: string }) {
  const delivery = state === 'delivery', changed = state === 'price changed';
  const qty = delivery ? D.qtyN : 20, unit = changed ? 380 : 350, total = unit * qty;
  return (
    <AppShell role="buyer" active="buyer-browse" title="Checkout" back="buyer-browse">
      <div className="row-between"><h1>Checkout</h1><span className="timer"><Icon name="clock" />Stock held for you · <b className="num">14:32</b></span></div>
      {changed && <Alert tone="warn" icon="alert" title="The price changed">Okafor Family Farm updated tomatoes from ₦350 to ₦380 per kg while you were checking out. Please review the new total.</Alert>}
      <div className="split">
        <div className="stack-lg">
          <div className="card stack"><h3>Your order</h3>
            <div className="list-row wrap-m" style={{ border: 0, padding: 0 }}><div style={{ width: 64, flex: 'none' }}><Photo p={PRODUCTS[0]} /></div><div className="grow"><b>Fresh tomatoes (Roma)</b><div className="xs muted">Okafor Family Farm · Verified</div></div><Stepper value={qty} label="Quantity in kg" /></div>
          </div>
          <div className="card stack"><h3>How you get it</h3>
            <label className="choice"><input type="radio" name="how" defaultChecked={!delivery} aria-label="Pickup" /><b>Pickup at the farm</b><span className="small muted">Farm gate, Issele-Uku · Mon–Sat, 7am–5pm · free</span></label>
            <label className="choice"><input type="radio" name="how" defaultChecked={delivery} aria-label="Delivery" /><b>Delivery by a verified transporter</b><span className="small muted">Transporters near the farm send you a price. You pick one.</span></label>
          </div>
          {delivery ? (
            <div className="card stack"><h3>Deliver to</h3><div className="form-grid">
              <Field label="Recipient name" required><input className="input" defaultValue="Ngozi Eze" autoComplete="name" required /></Field>
              <Field label="Recipient phone" required hint="Shared with the transporter after you accept a quote."><div className="input-group"><span>+234</span><input className="input" type="tel" inputMode="tel" defaultValue="806 555 0142" required /></div></Field>
              <Field label="Address" required full><input className="input" defaultValue="14 Okpanam Road, Asaba" autoComplete="street-address" required /></Field>
              <Field label="Landmark" hint="Helps the driver find you."><input className="input" defaultValue="Near Shoprite" /></Field>
              <Field label="Deliver by"><select className="select"><option>Today, before 4 pm</option><option>Tomorrow</option><option>Flexible</option></select></Field>
            </div></div>
          ) : (
            <div className="card"><div className="form-grid">
              <Field label="Your name"><input className="input" defaultValue="Ngozi Eze" /></Field>
              <Field label="Phone"><div className="input-group"><span>+234</span><input className="input" defaultValue="806 555 0142" /></div></Field>
            </div></div>
          )}
        </div>
        <aside className="card stack buy-box"><h3>Summary</h3>
          <Kv rows={[[`${qty} kg × ${naira(unit)}`, naira(total)], delivery ? ['Delivery', <span key="d" className="muted">Price from transporters</span>] : ['Pickup', 'Free']]} /><hr className="divider" />
          <div className="row-between"><b>{delivery ? 'Produce total' : 'Total'}</b><b className="price-big num" style={{ fontSize: 'var(--fs-2xl)' }}>{naira(total)}</b></div>
          {delivery
            ? <Btn block to="delivery-quotes@waiting">Get delivery quotes</Btn>
            : <Btn block to="order-status@pickup order">{changed ? 'Accept new price and pay' : `Pay ${naira(total)}`}</Btn>}
          <p className="xs muted row" style={{ gap: 6, flexWrap: 'nowrap' }}><Icon name="info" />{delivery ? 'Delivery is a separate cost set by the transporter, never by the farmer. You pay after you choose a quote.' : 'Paid securely through our payment provider.'}</p>
        </aside>
      </div>
    </AppShell>
  );
}

/* ---------- Compare and accept a delivery quote ---------- */
export function DeliveryQuotes({ state }: { state: string }) {
  const waiting = state === 'waiting';
  const quotes: [typeof T, number, string, string?][] = [
    [TRANSPORTERS.ike, 6500, 'Pickup 12:30 pm · arrives by 3:30 pm', 'Best value'],
    [TRANSPORTERS.okada, 4000, 'Pickup 1:00 pm · arrives by 2:30 pm · 2 trips needed', 'Lowest price'],
    [TRANSPORTERS.cold, 9000, 'Tomorrow · pickup 8:00 am · arrives by 10:00 am · refrigerated']
  ];
  return (
    <AppShell role="buyer" active="buyer-orders" title="Delivery quotes" back="checkout@delivery">
      <div><h1>Choose your delivery</h1><p className="muted">{D.item} · {D.qty} · from {D.farm} to {D.dropArea}</p></div>
      {waiting && <Alert tone="info" icon="clock" title="Asking verified transporters near the farm">Your stock is held while you wait. We will notify you as each quote arrives. 1 of 3 quotes received.</Alert>}
      <div className="split">
        <div className="stack">
          {(waiting ? quotes.slice(0, 1) : quotes).map(([t, price, when, tag], i) => (
            <label key={t.id} className="choice">
              <input type="radio" name="quote" defaultChecked={i === 0} aria-label={`${t.name}, ${naira(price)}`} />
              <div className="quote">
                <span className="avatar">{t.initials}</span>
                <div className="stack" style={{ gap: 4 }}>
                  <div className="row" style={{ gap: 8 }}><b>{t.name}</b>{t.verified && <Verified />}{tag && <Badge tone="wheat">{tag}</Badge>}</div>
                  <div className="xs muted">{t.vehicle} · up to {t.payload}</div>
                  <Rating value={t.rating} count={t.reviews} />
                  <div className="xs muted row" style={{ gap: 6, flexWrap: 'nowrap', alignItems: 'flex-start' }}><Icon name="clock" /><span>{when}</span></div>
                </div>
                <span className="price">{naira(price)}</span>
              </div>
            </label>
          ))}
          {waiting && <div className="card card-tight row" style={{ gap: 10 }}><span className="skel" style={{ width: 40, height: 40, borderRadius: '50%' }} /><div className="grow stack" style={{ gap: 6 }}><div className="skel" style={{ height: 12, width: '50%' }} /><div className="skel" style={{ height: 10, width: '30%' }} /></div></div>}
          <Btn variant="ghost" icon="info" toast="Opens a transporter's public profile and reviews" style={{ alignSelf: 'flex-start' }}>How we check transporters</Btn>
        </div>
        <aside className="card stack buy-box"><h3>Summary</h3>
          <Kv rows={[[`${D.qty} × ${naira(D.unit)}`, naira(D.subtotal)], ['Delivery · Ike Haulage', naira(D.fee)]]} /><hr className="divider" />
          <div className="row-between"><b>Total</b><b className="price-big num" style={{ fontSize: 'var(--fs-2xl)' }}>{naira(D.subtotal + D.fee)}</b></div>
          <Btn block to="order-status@driver assigned">Accept and pay {naira(D.subtotal + D.fee)}</Btn>
          <p className="xs muted">Produce and delivery are shown separately on your receipt. Only verified transporters can quote.</p>
        </aside>
      </div>
    </AppShell>
  );
}

/* ---------- Order status with delivery tracking (updated from V1) ---------- */
export function OrderStatus({ state }: { state: string }) {
  if (state === 'confirming' || state === 'failed') return <PickupOrderStatus state={state} />;
  if (state === 'pickup order') return <PickupOrderStatus state="confirmed" />;
  const step = ['driver assigned', 'in transit', 'delivered'].indexOf(state);
  const steps: [string, string?][] = [['Paid', 'Today, 11:52 am'], ['Transporter assigned', '11:58 am'], ['Picked up at the farm', step >= 1 ? '12:41 pm' : 'Expected 12:30 pm'], ['On the way', step >= 1 ? '12:45 pm' : ''], ['Delivered', step >= 2 ? '3:12 pm' : 'Expected by 3:30 pm']];
  return (
    <AppShell role="buyer" active="buyer-orders" title={`Order ${D.id}`} back="buyer-orders">
      <div><div className="row" style={{ gap: 8 }}><h1 style={{ fontSize: 'var(--fs-2xl)' }}>Order {D.id}</h1><Status s={['Assigned', 'In transit', 'Delivered'][step]} /></div><p className="small muted">{D.item} · {D.qty} · from {D.farm}</p></div>
      {step === 0 && <Alert tone="ok" icon="check" title="Paid. Ike Haulage is collecting your order">Sunday will pick up at the farm around 12:30 pm and deliver by 3:30 pm.</Alert>}
      {step === 1 && <Alert tone="info" icon="truck" title="On the way · expected by 3:30 pm">Updates come from the driver. Check your order when it arrives, before you give your code.</Alert>}
      {step === 2 && <Alert tone="ok" icon="check" title="Delivered at 3:12 pm">You confirmed 60 kg in good condition. If you find a problem, you can still report it from this order.</Alert>}
      <div className="split aside-first-m">
        <div className="stack-lg">
          <div className="card stack"><h3>Progress</h3><Timeline steps={steps} done={step === 0 ? 2 : step === 1 ? 4 : 5} /></div>
          <div className="card stack"><h3>Route</h3><Route from={`${D.farm} · ${D.pickup}`} to={D.dropFull} /></div>
        </div>
        <aside className="stack-lg">
          {step < 2 ? (
            <div className="card stack" style={{ textAlign: 'center', alignItems: 'center' }}><div className="eyebrow">Your delivery code</div><div className="pickup-code num">{D.code}</div><p className="small muted" style={{ maxWidth: '34ch' }}>Give this code to the driver only after you have checked your order.</p>
              {step === 1 && <Btn block to="receive-inspect">My order has arrived</Btn>}</div>
          ) : (
            <div className="card stack"><h3>What's next</h3>
              <Btn block icon="star" to="leave-review">Leave a review</Btn>
              <Btn block variant="secondary" icon="flag" to="receive-inspect@issue">Report a problem</Btn>
            </div>
          )}
          <div className="card stack"><h3>Driver</h3>
            <div className="row"><span className="avatar">{T.initials}</span><div className="grow"><b>{T.person}</b><div className="xs muted">{T.name} · {T.vehicle} · {T.plate}</div></div></div>
            <Btn block variant="soft" icon="phone" toast="Calls +234 802 441 9087">Call driver</Btn>
          </div>
          <div className="card stack"><h3>Payment</h3><Kv rows={[['Produce', naira(D.subtotal)], ['Delivery', naira(D.fee)], ['Total paid', <b key="t" className="num">{naira(D.subtotal + D.fee)}</b>]]} /></div>
        </aside>
      </div>
    </AppShell>
  );
}

/* ---------- Receive and inspect ---------- */
export function ReceiveInspect({ state }: { state: string }) {
  const issue = state === 'issue';
  return (
    <AppShell role="buyer" active="buyer-orders" title="Check your order" back="order-status@in transit">
      <div><h1>Check your order</h1><p className="muted">Before you give your delivery code, check the quantity and condition with the driver.</p></div>
      {issue && <Alert tone="warn" icon="alert" title="52 kg received of 60 kg ordered">You can accept what arrived and report the shortfall. The order stays open until it is settled.</Alert>}
      <div className="split">
        <form className="card stack" onSubmit={e => e.preventDefault()}>
          <div className="g2">
            <div className="card card-tight stat"><span className="l">Ordered</span><span className="v num">60 kg</span><span className="xs muted">{D.packing}</span></div>
            <Field label="Received (kg)" required error={issue ? 'This is 8 kg less than you ordered.' : undefined}><input className={`input num ${issue ? 'is-error' : ''}`} inputMode="numeric" defaultValue={issue ? '52' : '60'} required /></Field>
          </div>
          <div className="field"><span>Condition</span>
            <div className="g2">{['Matches the order', 'Small difference', 'Damaged or spoiled', 'Wrong product'].map((c, i) => <label key={c} className="choice"><input type="radio" name="cond" defaultChecked={i === 0} aria-label={c} /><b className="small">{c}</b></label>)}</div>
          </div>
          <Upload icon="camera" title="Add photos" note={issue ? 'Show the baskets and the scale reading' : 'Optional'} />
          <Field label="Notes (optional)"><textarea className="textarea" defaultValue={issue ? 'Third basket was half full.' : ''} /></Field>
        </form>
        <aside className="card stack">{issue ? <>
          <h3>What would you like to do?</h3>
          <Btn block to="dispute@open">Accept 52 kg and report the shortfall</Btn>
          <Btn block variant="danger" toast="Refuse flow: the driver returns the order and a dispute is opened">Refuse the delivery</Btn>
          <p className="xs muted">OgaFarm reviews the photos and replies from the farmer and the transporter before deciding.</p>
        </> : <>
          <h3>All good?</h3><p className="small muted">Give the driver your code to confirm delivery.</p>
          <div className="code-display" style={{ textAlign: 'center' }}>{D.code}</div>
          <Btn block to="order-status@delivered">Everything is fine</Btn>
          <Btn block variant="secondary" icon="flag" state="issue">Something is wrong</Btn>
        </>}</aside>
      </div>
    </AppShell>
  );
}

/* ---------- Dispute case ---------- */
export function Dispute({ state }: { state: string }) {
  const step = ['open', 'under review', 'resolved'].indexOf(state);
  const steps: [string, string?][] = [['Problem reported', 'Today, 3:20 pm'], ['Farmer and transporter replied', step >= 1 ? 'Today, 5:05 pm' : 'Waiting, up to 24 h'], ['OgaFarm review', step >= 1 ? 'Started 6:30 pm' : ''], ['Decision', step >= 2 ? '25 Nov, 10:15 am' : '']];
  return (
    <AppShell role="buyer" active="buyer-orders" title="Case DSP-2031" back="order-status@delivered">
      <div><div className="row" style={{ gap: 8 }}><h1 style={{ fontSize: 'var(--fs-2xl)' }}>Quantity shortfall</h1><Status s={['Waiting for reply', 'Under review', 'Resolved'][step]} /></div><p className="small muted">Case DSP-2031 · order {D.id} · 8 kg of tomatoes missing</p></div>
      {step === 2 && <Alert tone="ok" icon="check" title={`Decision: refund of ${naira(2800)}`}>8 kg × ₦350 is refunded to your card. Refunds usually arrive in 3–5 working days.</Alert>}
      <div className="split">
        <div className="stack-lg">
          <div className="card stack"><h3>Messages</h3>
            <div className="thread">
              <div className="msg me"><div className="who">You · 3:20 pm</div><div className="small">Received 52 kg instead of 60 kg. Third basket was half full. Photos attached.</div></div>
              {step >= 1 && <div className="msg"><div className="who">Emeka Okafor, farmer · 4:40 pm</div><div className="small">We loaded 3 full baskets, 60 kg. Photo of the scale at loading attached.</div></div>}
              {step >= 1 && <div className="msg"><div className="who">Sunday Ike, transporter · 5:05 pm</div><div className="small">I confirmed 60 kg at pickup. One basket tipped on the Ibusa road. I am sorry.</div></div>}
              {step === 2 && <div className="msg"><div className="who">OgaFarm support · 25 Nov, 10:15 am</div><div className="small">Pickup proof shows 60 kg; drop-off shows 52 kg. The loss happened in transit. The buyer is refunded ₦2,800.</div></div>}
            </div>
            {step < 2 && <><Field label="Add a message"><textarea className="textarea" placeholder="Add more details for the review team" /></Field><div className="row"><Btn variant="secondary" icon="image" toast="Add photos">Add photos</Btn><Btn toast="Message sent">Send</Btn></div></>}
          </div>
        </div>
        <aside className="stack-lg">
          <div className="card stack"><h3>Progress</h3><Timeline steps={steps} done={step === 0 ? 1 : step === 1 ? 2 : 4} /></div>
          <div className="card stack"><h3>Evidence</h3><Kv rows={[['Your photos', '3'], ['Pickup proof', '60 kg · photo'], ['Drop-off proof', '52 kg · photo']]} /></div>
        </aside>
      </div>
    </AppShell>
  );
}

/* ---------- Leave a verified review ---------- */
export function LeaveReview({ state }: { state: string }) {
  if (state === 'submitted') return (
    <AppShell role="buyer" active="buyer-orders" title="Review sent" back="order-status@delivered">
      <Empty icon="star" tone="ok" title="Thank you for your review" actions={<Btn to="buyer-browse">Back to browsing</Btn>}>We check every review before it is published, usually within a day. It will show on the farm and the transporter profiles.</Empty>
    </AppShell>
  );
  return (
    <AppShell role="buyer" active="buyer-orders" title="Leave a review" back="order-status@delivered">
      <div><h1>How was your order?</h1><p className="muted">Order {D.id} · delivered today. Only buyers with a delivered order can review.</p></div>
      <div className="g2">
        <div className="card stack"><div className="row"><span className="avatar">OF</span><div className="grow"><b>{D.farm}</b><div className="xs muted">The farm and the produce</div></div></div>
          <RateInput label="Rating for Okafor Family Farm" initial={5} />
          <div className="field"><span>What went well?</span><Chips items={['Quality', 'Quantity was right', 'Good communication', 'Fair price']} /></div>
          <Field label="Your review (optional)"><textarea className="textarea" defaultValue="Very fresh tomatoes, well packed." /></Field>
        </div>
        <div className="card stack"><div className="row"><span className="avatar">{T.initials}</span><div className="grow"><b>{T.name}</b><div className="xs muted">The delivery</div></div></div>
          <RateInput label="Rating for Ike Haulage" initial={4} />
          <div className="field"><span>What went well?</span><Chips items={['On time', 'Careful with goods', 'Called ahead', 'Polite']} /></div>
          <Field label="Your review (optional)"><textarea className="textarea" defaultValue="Arrived early. One basket tipped over, but it was sorted out." /></Field>
        </div>
      </div>
      <div className="row" style={{ justifyContent: 'flex-end' }}><Btn variant="ghost" to="order-status@delivered">Not now</Btn><Btn state="submitted">Send reviews</Btn></div>
    </AppShell>
  );
}
