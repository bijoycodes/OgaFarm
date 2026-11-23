/* v2 · Farmer: delivery order handover, reviews, and requesting a review investigation */
import { Icon } from '@shared/ui/Icon';
import { Btn, Status, Alert, Photo, Field, Kv, Badge, Timeline, Upload, LinkBox } from '@shared/ui/ui';
import { AppShell } from '@shared/layout/shells';
import { PRODUCTS, naira } from '@shared/data/sample';
import { FarmerOrderDetail as PickupOrderDetail } from '../../v1-mvp/screens/farmer';
import { TRANSPORTERS, DELIVERY as D, Route, Rating } from '../parts';

const T = TRANSPORTERS.ike;

/* ---------- Order detail: delivery orders (updated from V1; pickup states unchanged) ---------- */
export function FarmerOrderDetail({ state }: { state: string }) {
  if (state === 'pickup · new') return <PickupOrderDetail state="new" />;
  if (state === 'pickup · ready') return <PickupOrderDetail state="ready for pickup" />;
  const handed = state === 'delivery · handed over';
  const steps: [string, string?][] = [['Paid', 'Today, 11:52 am'], ['Confirmed by you', '11:55 am'], ['Transporter assigned', '11:58 am'], ['Handed to the driver', handed ? '12:41 pm' : ''], ['Delivered to the buyer', '']];
  return (
    <AppShell role="farmer" active="farmer-orders" title={D.id} back="farmer-orders">
      <div><div className="row" style={{ gap: 8 }}><h1 style={{ fontSize: 'var(--fs-2xl)' }}>Order {D.id}</h1><Status s={handed ? 'In transit' : 'Assigned'} /><Badge tone="info" icon="truck">Delivery</Badge></div><p className="small muted">Placed today, 11:52 am · {D.buyer}</p></div>
      {handed && <Alert tone="info" icon="truck" title="On the way to the buyer">Sunday picked up 60 kg at 12:41 pm. We will tell you when the buyer confirms delivery.</Alert>}
      <div className="split aside-first-m">
        <div className="stack-lg">
          <div className="card stack"><h3>Items</h3>
            <div className="list-row" style={{ border: 0, padding: 0 }}><div style={{ width: 64, flex: 'none' }}><Photo p={PRODUCTS[0]} /></div><div className="grow"><b>{D.item}</b><div className="small muted num">{D.qty} × {naira(D.unit)}</div></div><b className="num">{naira(D.subtotal)}</b></div>
            <hr className="divider" />
            <Kv rows={[['Your sale', naira(D.subtotal)], ['Delivery (buyer pays the transporter)', <span key="d" className="muted">{naira(D.fee)}</span>]]} />
            <p className="xs muted row" style={{ gap: 6, flexWrap: 'nowrap' }}><Icon name="info" />The transporter sets the delivery price. You never set or pay it.</p>
          </div>
          <div className="card stack"><h3>Progress</h3><Timeline steps={steps} done={handed ? 4 : 3} /></div>
        </div>
        <aside className="stack-lg">
          <div className="card stack"><h3>Transporter</h3>
            <div className="row"><span className="avatar">{T.initials}</span><div className="grow"><b>{T.person}</b><div className="xs muted">{T.name} · Verified</div></div></div>
            <Kv rows={[['Vehicle', T.vehicle], ['Plate', T.plate], ['Arrives', 'Around 12:30 pm']]} />
            <LinkBox url="+234 802 441 9087" toast="Number copied" />
          </div>
          <div className="card stack">{handed ? <>
            <h3>Handover done</h3><Kv rows={[['Loaded', `${D.qty} · ${D.packing}`], ['Condition', 'Good'], ['Photo', 'Added by driver']]} />
          </> : <>
            <h3>Hand over to the driver</h3>
            <ul className="checklist">
              <li><span className="ck" /><span className="grow">Check the plate is <b style={{ display: 'inline' }}>{T.plate}</b></span></li>
              <li><span className="ck" /><span className="grow">Count the load together: {D.qty}, {D.packing}</span></li>
            </ul>
            <Upload icon="camera" title="Photo of the load" note="Optional, helps if there is a question later" />
            <Btn block state="delivery · handed over">Confirm handover</Btn>
          </>}</div>
          <div className="card stack"><h3>Delivering to</h3><Route from={D.pickup} to={D.dropArea} /></div>
        </aside>
      </div>
    </AppShell>
  );
}

/* ---------- Reviews of my farm ---------- */
const REVIEWS: [string, number, string, string, string][] = [
  ['Ngozi Eze', 5, 'Very fresh tomatoes, well packed.', '24 Nov', 'Published'],
  ['FreshMart Foods', 5, 'Consistent quality every week. Peppers were firm and clean.', '19 Nov', 'Published'],
  ['Chuka Obi', 1, 'Terrible farm, never buy from them. They are thieves.', '17 Nov', 'Published'],
  ['Mama Put Kitchen', 4, 'Good ugu. Pickup took a little long on Saturday.', '12 Nov', 'Published']
];
export function FarmerReviews() {
  return (
    <AppShell role="farmer" active="farmer-reviews" title="Reviews">
      <div><h1>Reviews</h1><p className="muted">Only buyers with a delivered or collected order can review your farm.</p></div>
      <div className="g3">
        <div className="card card-tight stat"><span className="si gold"><Icon name="star" /></span><span className="l">Average</span><span className="v">4.8</span><Rating value={4.8} count={23} /></div>
        <div className="card card-tight stat"><span className="si"><Icon name="thumbsup" /></span><span className="l">4 or 5 stars</span><span className="v">91%</span><span className="xs muted">21 of 23</span></div>
        <div className="card card-tight stat"><span className="si"><Icon name="clock" /></span><span className="l">Waiting for checks</span><span className="v">1</span><span className="xs muted">Not public yet</span></div>
      </div>
      <div className="card list" style={{ paddingBlock: 4 }}>{REVIEWS.map(([who, r, text, when]) => (
        <div key={who} className="list-row wrap-m" style={{ alignItems: 'flex-start' }}>
          <span className="avatar">{who.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
          <div className="grow stack" style={{ gap: 4 }}><div className="row" style={{ gap: 8 }}><b className="small">{who}</b><span className="xs muted">{when}</span></div><Rating value={r} /><p className="small">{text}</p></div>
          {r <= 2 && <Btn size="sm" variant="secondary" icon="flag" to="review-appeal">Request investigation</Btn>}
        </div>
      ))}</div>
      <p className="xs muted">A review is never removed just because it is negative. You can ask us to check a review that breaks the rules.</p>
    </AppShell>
  );
}

/* ---------- Request a review investigation ---------- */
export function ReviewAppeal({ state }: { state: string }) {
  const sent = state === 'submitted';
  const steps: [string, string?][] = [['Request logged', 'Today, 9:10 am'], ['First check', sent ? 'Within 1 working day' : ''], ['Investigation', ''], ['Decision', '']];
  return (
    <AppShell role="farmer" active="farmer-reviews" title="Request investigation" back="farmer-reviews">
      <div><h1>Ask us to check a review</h1><p className="muted">The review stays visible while we look into it. We contact both sides before deciding.</p></div>
      <div className="card stack"><div className="row-between"><b className="small">Chuka Obi · 17 Nov</b><Rating value={1} /></div><p className="small">"Terrible farm, never buy from them. They are thieves."</p><div className="xs muted">Linked to order OGF-10322 · collected 16 Nov</div></div>
      {sent ? (
        <div className="split">
          <Alert tone="ok" icon="check" title="Request received · case RV-118">We will email you after the first check. You can add more information at any time.</Alert>
          <div className="card stack"><h3>Progress</h3><Timeline steps={steps} done={1} /></div>
        </div>
      ) : (
        <form className="card stack" onSubmit={e => e.preventDefault()}>
          <div className="field"><span>Why should we check it?<span className="req" aria-hidden="true">*</span></span>
            <div className="g2">{['Abusive or insulting', 'False information', 'Shares private information', 'Discriminatory', 'No real order behind it', 'Posted by a competitor'].map((c, i) => <label key={c} className="choice"><input type="radio" name="why" defaultChecked={i === 0} aria-label={c} /><b className="small">{c}</b></label>)}</div>
          </div>
          <Field label="Explain what happened" required><textarea className="textarea" defaultValue="The order was collected in full and the buyer thanked us on the phone. Calling us thieves is insulting and not true." required /></Field>
          <Upload icon="upload" title="Add evidence" note="Messages, photos or receipts · optional" />
          <div className="row" style={{ justifyContent: 'flex-end' }}><Btn variant="ghost" to="farmer-reviews">Cancel</Btn><Btn state="submitted">Send request</Btn></div>
        </form>
      )}
    </AppShell>
  );
}

