/* v2 · Transporter: sign up with vehicle and documents, dashboard, delivery requests, quote, job with proof of delivery, public profile */
import { PhoneInput } from '@shared/ui/PhoneInput';
import { Icon } from '@shared/ui/Icon';
import { Btn, Clickable, Status, Alert, Empty, Field, Upload, Steps, Kv, Badge, Verified, Chips, Timeline, Switch } from '@shared/ui/ui';
import { AppShell, PublicShell } from '@shared/layout/shells';
import { naira, IMG } from '@shared/data/sample';
import { TRANSPORTERS, DELIVERY as D, Route, Rating } from '../parts';

const T = TRANSPORTERS.ike;
const VEHICLES = ['Motorcycle', 'Keke (tricycle)', 'Pickup truck', 'Small truck', 'Large truck', 'Refrigerated van', 'Other'];

const REQUESTS: [string, string, string, string, string, string, boolean][] = [
  ['DR-3301', 'Issele-Uku → Asaba', `${D.item} · ${D.qty} · ${D.packing}`, 'Today, by 4:00 pm', D.distance, '3 quotes so far', true],
  ['DR-3298', 'Agbor → Issele-Uku', 'Layer eggs · 10 crates', 'Tomorrow, morning', '52 km', '1 quote so far', true],
  ['DR-3290', 'Ibusa → Asaba', 'Yellow maize · 8 × 100 kg bags', 'Fri 28 Nov', '21 km', 'No quotes yet', false],
  ['DR-3287', 'Issele-Uku → Ogwashi-Uku', 'Ripe plantain · 30 bunches', 'Sat 29 Nov', '17 km', '2 quotes so far', false]
];

/* ---------- Sign up: vehicle and documents ---------- */
export function TransporterSignup({ state }: { state: string }) {
  const sent = state === 'submitted';
  return (
    <PublicShell noFooter>
      <section className="section"><div className="wrap stack-lg" style={{ maxWidth: 860 }}>
        <div className="stack" style={{ gap: 8 }}><div className="row-between small"><b>Step {sent ? 3 : 2} of 3</b><span className="muted">{sent ? 'Review' : 'Vehicle and documents'}</span></div><Steps n={sent ? 3 : 2} of={3} /></div>
        {sent ? (
          <div className="card stack-lg">
            <Empty card={false} icon="shield" tone="ok" title="Documents sent for review">Our team checks transporter documents within 1 working day. We will email you the result. You can look at delivery requests now, and send quotes once you are approved.</Empty>
            <ul className="checklist">
              <li className="done"><span className="ck"><Icon name="check" /></span>Email address verified</li>
              <li className="done"><span className="ck"><Icon name="check" /></span>Vehicle and capacity added</li>
              <li><span className="ck" />ID and utility bill reviewed by OgaFarm</li>
            </ul>
            <Btn to="transporter-dashboard@pending verification" style={{ alignSelf: 'center' }}>Go to my dashboard</Btn>
          </div>
        ) : (
          <form className="stack-lg" onSubmit={e => e.preventDefault()}>
            <div><h1>Your vehicle and documents</h1><p className="muted">Transporting on OgaFarm is free. Only verified transporters can send quotes and be assigned to deliveries.</p></div>
            <fieldset className="card stack"><legend><h3>Your details</h3></legend><div className="form-grid">
              <Field label="Full name, exactly as on your ID" required hint="It must match your driver's licence or National ID."><input className="input" defaultValue="Sunday Ikechukwu Ike" autoComplete="name" required /></Field>
              <Field label="Name customers will see" hint="Your business name, or your own name."><input className="input" defaultValue="Ike Haulage" /></Field>
              <Field label="Phone number" required hint="Shared with a customer only after you are assigned to their delivery."><PhoneInput defaultValue="802 441 9087" required /></Field>
              <Field label="Where you are based" required><input className="input" defaultValue="Issele-Uku, Delta" required /></Field>
            </div></fieldset>
            <fieldset className="card stack"><legend><h3>Vehicle</h3></legend>
              <div className="field"><span>Vehicle type<span className="req" aria-hidden="true">*</span></span>
                <div className="g3 choice-grid">{VEHICLES.map(v => <label key={v} className="choice"><input type="radio" name="veh" defaultChecked={v === 'Pickup truck'} aria-label={v} /><b className="small">{v}</b></label>)}</div>
              </div>
              <div className="form-grid">
                <Field label="Plate number" required hint="Required for motor vehicles."><input className="input" defaultValue="AGB 482 KT" style={{ textTransform: 'uppercase' }} required /></Field>
                <Field label="Maximum load (kg)" required><input className="input num" inputMode="numeric" defaultValue="1500" required /></Field>
                <Field label="How many 50 kg bags fit"><input className="input num" inputMode="numeric" defaultValue="25" /></Field>
                <Field label="How many 100 kg bags fit"><input className="input num" inputMode="numeric" defaultValue="12" /></Field>
              </div>
              <div className="field"><span>Areas you cover</span><Chips items={['Aniocha North', 'Oshimili South (Asaba)', 'Ika South (Agbor)', '+ Add area']} /></div>
            </fieldset>
            <fieldset className="card stack"><legend><h3>Documents</h3></legend>
              <p className="small muted row" style={{ gap: 6, flexWrap: 'nowrap' }}><Icon name="lock" />Private. Only the OgaFarm review team can see them. They are never shown on your profile.</p>
              <div className="g3">
                <Upload icon="doc" title="Driver's licence or National ID" note="Photo or PDF · required" />
                <Upload icon="doc" title="Utility bill" note="Last 3 months · required" />
                <Upload icon="camera" title="Vehicle photo" note="Plate visible · optional" />
              </div>
            </fieldset>
            <div className="row" style={{ justifyContent: 'flex-end' }}><Btn variant="ghost" to="landing">Save and finish later</Btn><Btn state="submitted">Send for review</Btn></div>
          </form>
        )}
      </div></section>
    </PublicShell>
  );
}

/* ---------- Dashboard ---------- */
export function TransporterDashboard({ state }: { state: string }) {
  const pending = state === 'pending verification';
  return (
    <AppShell role="transporter" active="transporter-dashboard" title="Dashboard">
      <div className="row-between"><div><h1>Good morning, Sunday</h1><p className="muted">{pending ? 'Your documents are being reviewed.' : 'You have 4 delivery requests near you.'}</p></div>
        <Switch label="Available for jobs" on={!pending} onText="Buyers near you can send you requests" offText="You won't get new requests" /></div>
      {pending && <Alert tone="warn" icon="clock" title="Waiting for verification">You can look at delivery requests, but you can send quotes only after our team approves your ID and utility bill. This usually takes 1 working day.</Alert>}
      <div className="g4">
        <div className="card card-tight stat"><span className="si"><Icon name="list" /></span><span className="l">New requests</span><span className="v">4</span><span className="xs muted">Within your areas</span></div>
        <div className="card card-tight stat"><span className="si gold"><Icon name="truck" /></span><span className="l">Active jobs</span><span className="v">{pending ? 0 : 1}</span><span className="xs muted">{pending ? 'None yet' : 'Pickup by 2:00 pm'}</span></div>
        <div className="card card-tight stat"><span className="si"><Icon name="coins" /></span><span className="l">Earned this month</span><span className="v">{pending ? naira(0) : naira(86500)}</span><span className="xs muted">{pending ? '—' : '14 deliveries'}</span></div>
        <div className="card card-tight stat"><span className="si gold"><Icon name="star" /></span><span className="l">Your rating</span><span className="v">{pending ? '—' : T.rating}</span><span className="xs muted">{pending ? 'After your first delivery' : `${T.reviews} reviews`}</span></div>
      </div>
      <div className="split">
        <div className="card stack"><div className="row-between"><h3>New delivery requests</h3><Btn variant="ghost" size="sm" to="transporter-requests">See all</Btn></div>
          <div className="list">{REQUESTS.slice(0, 3).map(([id, route, cargo, when]) => (
            <Clickable key={id} className="list-row" to="transporter-bid"><span className="avatar"><Icon name="route" /></span><div className="grow"><div className="t">{route}</div><div className="xs muted">{cargo}</div><div className="xs muted">{when}</div></div><Icon name="chev" /></Clickable>
          ))}</div>
        </div>
        {pending ? (
          <div className="card stack"><h3>Your vehicle</h3><Kv rows={[['Vehicle', T.vehicle], ['Plate', T.plate], ['Max load', T.payload], ['Bags', T.bags]]} /><Status s="Pending review" /></div>
        ) : (
          <div className="card stack"><div className="row-between"><h3>Active job</h3><Status s="Assigned" /></div>
            <Route from={`${D.farm}, Issele-Uku`} to={D.dropArea} />
            <Kv rows={[['Cargo', `${D.item} · ${D.qty}`], ['Pickup', 'Today by 2:00 pm'], ['Your price', naira(D.fee)]]} />
            <Btn block to="transporter-job">Open job</Btn>
          </div>
        )}
      </div>
    </AppShell>
  );
}

/* ---------- Delivery requests ---------- */
export function TransporterRequests({ state }: { state: string }) {
  return (
    <AppShell role="transporter" active="transporter-requests" title="Delivery requests">
      <div><h1>Delivery requests</h1><p className="muted">Buyers near your areas who need a delivery. Send a price; the buyer picks one quote.</p></div>
      {state === 'not verified' && <Alert tone="warn" icon="lock" title="You can't send quotes yet">Only verified transporters can quote or be assigned. Your documents are under review.</Alert>}
      <Chips items={['All (4)', 'Fits my vehicle', 'Today', 'Near me']} />
      {state === 'empty' ? <Empty icon="truck" title="No requests right now">We will notify you when a buyer in your areas needs a delivery. Adding more areas brings more requests.</Empty> :
        <div className="card list" style={{ paddingBlock: 4 }}>{REQUESTS.map(([id, route, cargo, when, dist, quotes, perishable]) => (
          <div key={id} className="list-row wrap-m">
            <div className="grow"><div className="row" style={{ gap: 8 }}><span className="t">{route}</span>{perishable && <Badge tone="warn" icon="leaf">Perishable</Badge>}</div>
              <div className="small">{cargo}</div><div className="xs muted">{when} · {dist} · {quotes}</div></div>
            <Btn size="sm" variant="secondary" to="transporter-bid">{state === 'not verified' ? 'View' : 'Send quote'}</Btn>
          </div>
        ))}</div>}
    </AppShell>
  );
}

/* ---------- One request: send a quote (with capacity check) ---------- */
export function TransporterBid({ state }: { state: string }) {
  const heavy = state === 'too heavy', sent = state === 'sent';
  return (
    <AppShell role="transporter" active="transporter-requests" title="Request DR-3301" back="transporter-requests">
      <div><div className="row" style={{ gap: 8 }}><h1 style={{ fontSize: 'var(--fs-2xl)' }}>Issele-Uku → Asaba</h1>{sent ? <Status s="Quote sent" /> : <Status s="Open" />}</div><p className="small muted">Request DR-3301 · posted 25 min ago · 3 quotes so far</p></div>
      {sent && <Alert tone="ok" icon="check" title={`Your quote of ${naira(D.fee)} was sent`}>The buyer is comparing quotes. We will notify you if you are chosen. You can change or withdraw your quote until then.</Alert>}
      {heavy && <Alert tone="danger" icon="alert" title="This load is too heavy for your vehicle">The cargo is 2,400 kg. Your pickup truck carries up to 1,500 kg, so you can't quote for this request.</Alert>}
      <div className="split">
        <div className="stack-lg">
          <div className="card stack"><h3>Route</h3><Route from={`${D.farm} · ${D.pickup}`} to={`${D.dropArea} (exact address shared after you are assigned)`} />
            <Kv rows={[['Distance', `About ${D.distance}`], ['Needed by', 'Today, 4:00 pm'], ['Pickup from', 'Today, 12:00 pm']]} /></div>
          <div className="card stack"><h3>Cargo</h3>
            <Kv rows={[['Item', heavy ? 'Yellow maize · 24 × 100 kg bags' : `${D.item} · ${D.qty}`], ['Weight', heavy ? '2,400 kg' : `${D.qty} · ${D.packing}`], ['Handling', heavy ? 'Dry, keep covered' : 'Perishable. Keep shaded, do not stack baskets']]} />
          </div>
        </div>
        <aside className="card stack">{sent ? <>
          <h3>Your quote</h3><Kv rows={[['Price', naira(D.fee)], ['Pickup', 'Today, 12:30 pm'], ['Delivery by', 'Today, 3:30 pm'], ['Vehicle', `${T.vehicle} · ${T.plate}`]]} />
          <Btn block variant="secondary" state="default">Change quote</Btn><Btn block variant="ghost" toast="Quote withdrawn">Withdraw</Btn>
        </> : <>
          <h3>Send your price</h3>
          <Field label="Your price for this delivery" required hint="The full price for the buyer. The farmer does not set or change it."><div className="input-group"><span>₦</span><input className="input num" inputMode="numeric" defaultValue="6,500" disabled={heavy} required /></div></Field>
          <div className="form-grid">
            <Field label="Pickup time"><input className="input" defaultValue="12:30 pm" disabled={heavy} /></Field>
            <Field label="Delivered by"><input className="input" defaultValue="3:30 pm" disabled={heavy} /></Field>
          </div>
          <Field label="Vehicle"><select className="select" disabled={heavy}><option>{T.vehicle} · {T.plate} · up to {T.payload}</option></select></Field>
          <Field label="Note to buyer (optional)"><textarea className="textarea" defaultValue={heavy ? '' : 'I have covers for the baskets.'} disabled={heavy} /></Field>
          <Btn block state="sent" disabled={heavy}>Send quote</Btn>
          <p className="xs muted">By quoting you confirm your vehicle can carry this load safely.</p>
        </>}</aside>
      </div>
    </AppShell>
  );
}

/* ---------- Assigned job: pickup, in transit, proof of delivery ---------- */
export function TransporterJob({ state }: { state: string }) {
  const step = ['assigned', 'in transit', 'proof of delivery', 'delivered'].indexOf(state);
  const steps: [string, string?][] = [['Assigned to you', 'Today, 11:58 am'], ['Picked up at the farm', step >= 1 ? '12:41 pm' : ''], ['On the way', step >= 1 ? '12:45 pm' : ''], ['Delivered', step >= 3 ? '3:12 pm' : '']];
  return (
    <AppShell role="transporter" active="transporter-job" title={`Job ${D.id}`} back="transporter-dashboard">
      <div><div className="row" style={{ gap: 8 }}><h1 style={{ fontSize: 'var(--fs-2xl)' }}>Delivery for {D.id}</h1><Status s={['Assigned', 'In transit', 'In transit', 'Delivered'][step]} /></div><p className="small muted">{D.item} · {D.qty} · {D.packing} · your price {naira(D.fee)}</p></div>
      {step === 3 && <Alert tone="ok" icon="check" title="Delivered at 3:12 pm">The buyer confirmed with their delivery code. Thank you for delivering on time.</Alert>}
      <div className="split aside-first-m">
        <div className="stack-lg">
          <div className="card stack"><h3>Route</h3><Route from={`${D.farm} · ${D.pickup}`} to={D.dropFull} />
            <div className="row"><Btn size="sm" variant="secondary" icon="map" toast="Opens directions in maps">Directions</Btn></div></div>
          <div className="card stack"><h3>Contacts</h3>
            <div className="list">
              <div className="list-row"><span className="avatar">EO</span><div className="grow"><b className="small">{D.farmer}</b><div className="xs muted">Farmer · pickup</div></div><Btn size="sm" variant="soft" icon="phone" toast={`Calls ${D.farmPhone}`}>Call</Btn></div>
              <div className="list-row"><span className="avatar">NE</span><div className="grow"><b className="small">{D.buyer}</b><div className="xs muted">Buyer · drop-off</div></div><Btn size="sm" variant="soft" icon="phone" toast={`Calls ${D.buyerPhone}`}>Call</Btn></div>
            </div>
          </div>
          <div className="card stack"><h3>Progress</h3><Timeline steps={steps} done={step >= 3 ? 4 : step >= 1 ? 3 : 1} /></div>
        </div>
        <aside className="card stack">
          {step === 0 && <>
            <h3>At the farm: confirm pickup</h3><p className="small muted">Count the load with the farmer before you leave.</p>
            <Field label="Quantity loaded"><input className="input num" defaultValue={`${D.qty} · ${D.packing}`} /></Field>
            <Field label="Condition at pickup"><select className="select"><option>Good, matches the order</option><option>Some damage (describe below)</option></select></Field>
            <Upload icon="camera" title="Photo of the load" note="Helps if there is a question later" />
            <Btn block state="in transit">Confirm pickup and start</Btn>
          </>}
          {step === 1 && <>
            <h3>On the way</h3><p className="small muted">The buyer sees each update. There is no live map in this version.</p>
            <Btn block variant="secondary" icon="clock" toast="The buyer is told you are running late. Add a new time.">Running late</Btn>
            <Btn block state="proof of delivery">I have arrived</Btn>
          </>}
          {step === 2 && <>
            <h3>Proof of delivery</h3><p className="small muted">Let the buyer check the order first. Then ask for their 4-digit delivery code.</p>
            <Field label="Buyer's delivery code" required><input className="input" placeholder="4-digit code" inputMode="numeric" maxLength={4} style={{ fontSize: 'var(--fs-xl)', letterSpacing: '.3em', textAlign: 'center' }} required /></Field>
            <Field label="Quantity delivered"><input className="input num" defaultValue={`${D.qty} · ${D.packing}`} /></Field>
            <div className="field"><span>Condition</span>
              {['Matches the order', 'Small difference', 'Damaged'].map((c, i) => <label key={c} className="check"><input type="radio" name="cond" defaultChecked={i === 0} />{c}</label>)}
            </div>
            <Upload icon="camera" title="Photo at drop-off" note="Optional" />
            <Btn block state="delivered">Confirm delivery</Btn>
          </>}
          {step === 3 && <>
            <h3>Done</h3><Kv rows={[['Delivered', 'Today, 3:12 pm'], ['Received by', D.buyer], ['Condition', 'Matches the order'], ['Your price', naira(D.fee)]]} />
            <Btn block variant="secondary" icon="star" toast="Opens a short review of the buyer">Rate the buyer</Btn>
            <Btn block variant="ghost" to="transporter-requests">Find the next job</Btn>
          </>}
        </aside>
      </div>
    </AppShell>
  );
}

/* ---------- Public transporter profile ---------- */
export function TransporterProfile({ state }: { state: string }) {
  const t = state === 'few reviews' ? TRANSPORTERS.cold : T;
  const reviews: [string, number, string, string][] = state === 'few reviews'
    ? [['FreshMart Foods', 5, 'Fish arrived cold and on time.', '18 Nov']]
    : [['Ngozi Eze', 5, 'Arrived before time and the tomatoes were well covered.', '20 Nov'], ['Mama Put Kitchen', 4, 'Good driver. Called ahead when he was close.', '14 Nov'], ['Okafor Family Farm', 5, 'Careful with our baskets. We use him every week.', '9 Nov']];
  return (
    <PublicShell url={`/transporter/${t.id === 'ike' ? 'ike-haulage' : 'agbor-cold-van'}`}>
      <div className="store-cover has-photo" role="img" aria-label="Transporter cover photo: a truck on a farm road" style={{ backgroundImage: `url(${IMG('truck-cover')})` }} />
      <div className="store-head">
        <div className="store-logo">{t.initials}</div>
        <div className="grow stack" style={{ gap: 6, paddingBottom: 6 }}>
          <div className="row"><h1 style={{ fontSize: 'var(--fs-2xl)' }}>{t.name}</h1>{t.verified && <Verified />}</div>
          <div className="row small muted"><span className="row" style={{ gap: 4 }}><Icon name="truck" />{t.vehicle}</span><span className="row" style={{ gap: 4 }}><Icon name="pin" />{t.base}</span><span className="row" style={{ gap: 4 }}><Icon name="check" />{t.jobs} deliveries</span></div>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 'var(--s-5)' }}><div className="wrap split">
        <div className="stack-lg">
          <div className="card stack"><div className="row-between"><h3>Delivery reviews</h3><Rating value={t.rating} count={t.reviews} /></div>
            <div className="list">{reviews.map(([who, r, text, when]) => (
              <div key={who} className="list-row" style={{ alignItems: 'flex-start' }}><span className="avatar">{who.split(' ').map(w => w[0]).join('').slice(0, 2)}</span><div className="grow stack" style={{ gap: 4 }}><div className="row-between"><b className="small">{who}</b><span className="xs muted">{when}</span></div><Rating value={r} /><p className="small">{text}</p><span style={{ alignSelf: 'flex-start' }}><Badge tone="ok" icon="seal">From a delivered order</Badge></span></div></div>
            ))}</div>
          </div>
        </div>
        <aside className="card stack"><h3>Vehicle and capacity</h3>
          <Kv rows={[['Vehicle', t.vehicle], ['Max load', t.payload], ['Bags', t.bags], ['Areas', t.areas.join(', ')]]} />
          <hr className="divider" />
          <p className="xs muted">Transporters are booked through an order. When you check out with delivery, verified transporters near the farm send you their price.</p>
          <Btn block variant="secondary" to="marketplace">Browse produce</Btn>
        </aside>
      </div></section>
    </PublicShell>
  );
}
