/* v1 · Farmer workspace */
import { Icon } from '@shared/ui/Icon';
import { Btn, IconBtn, Clickable, Status, Alert, Empty, Photo, Tabs, Chips, Timeline, Field, Kv, LinkBox, Badge } from '@shared/ui/ui';
import { AppShell } from '@shared/layout/shells';
import { PRODUCTS, ORDERS, naira, initials, IMG } from '@shared/data/sample';

const mine = PRODUCTS.filter(p => p.farm === 'okafor');

export function FarmerDashboard({ state }: { state: string }) {
  if (state === 'new account') return (
    <AppShell role="farmer" active="farmer-dashboard" title="Dashboard">
      <div><h1>Welcome, Emeka</h1><p className="muted">Three steps to your first order.</p></div>
      <div className="card stack">
        <div className="row-between"><h3>Get your farm ready</h3><span className="small muted">1 of 3 done</span></div>
        <ul className="checklist">
          <li className="done"><span className="ck"><Icon name="check" /></span><div className="grow"><b>Set up your storefront</b><div className="xs muted">Name, photos, pickup location</div></div></li>
          <li><span className="ck" /><div className="grow"><b>Add your first product</b><div className="xs muted">Price, quantity and unit</div></div><Btn size="sm" to="listing-form">Add product</Btn></li>
          <li><span className="ck" /><div className="grow"><b>Share your storefront</b><div className="xs muted">Send your link on WhatsApp</div></div><Btn size="sm" variant="secondary" modal="share-store">Share</Btn></li>
        </ul>
      </div>
      <Empty icon="receipt" title="No orders yet">When buyers order from your storefront, they appear here.</Empty>
    </AppShell>
  );
  const expired = state === 'expired';
  return (
    <AppShell role="farmer" active="farmer-dashboard" title="Dashboard" actions={<span className="hide-m"><Btn size="sm" variant="secondary" to="farm-storefront">View storefront</Btn></span>}>
      {state === 'unverified' && <Alert tone="info" icon="clock" title="Verification in progress">Your storefront is ready but hidden from buyers until our team approves your documents (usually 1 working day).</Alert>}
      {expired && <Alert tone="danger" icon="alert" title="Your plan ended on 20 Nov" action={<Btn size="sm" to="subscription">Renew</Btn>}>Your storefront and 5 listings are hidden from buyers. Nothing was deleted. Renew to show them again.</Alert>}
      <div className="row-between"><div><h1>Good morning, Emeka</h1><p className="muted">Here is your farm today.</p></div><Btn icon="plus" to="listing-form">Add product</Btn></div>
      <div className="g4">
        <div className="card card-tight stat"><span className="si"><Icon name="box" /></span><span className="l">Active listings</span><span className="v">{expired ? 0 : 5}</span><span className="xs muted">{expired ? '5 hidden' : '1 needs a stock check'}</span></div>
        <div className="card card-tight stat"><span className="si gold"><Icon name="receipt" /></span><span className="l">New orders</span><span className="v">1</span><span className="xs muted">{naira(7000)} waiting</span></div>
        <div className="card card-tight stat"><span className="si"><Icon name="check" /></span><span className="l">Ready for pickup</span><span className="v">1</span><span className="xs muted">Mama Put Kitchen</span></div>
        <div className="card card-tight stat"><span className="si"><Icon name="card" /></span><span className="l">Plan</span><span className="v" style={{ fontSize: 'var(--fs-xl)' }}>{expired ? 'Expired' : 'Annual'}</span><span className="xs muted">{expired ? 'Ended 20 Nov 2026' : 'Paid until 23 Nov 2027'}</span></div>
      </div>
      <div className="card share-strip stack">
        <div><h3>Share my storefront</h3><p className="small muted">Send your link to customers, WhatsApp groups and your status.</p></div>
        <LinkBox url="farmoga.com/farm/okafor-family-farm" />
        <div className="row"><Btn variant="wa" icon="chat" toast="Opens WhatsApp with your storefront link">WhatsApp</Btn><Btn variant="secondary" icon="share" modal="share-store">More options</Btn></div>
      </div>
      <div className="split">
        <div className="card stack">
          <div className="row-between"><h3>Recent orders</h3><Btn variant="ghost" size="sm" to="farmer-orders">View all</Btn></div>
          <div className="list">{ORDERS.slice(0, 3).map(o => (
            <Clickable key={o.id} className="list-row" to="farmer-order-detail"><span className="avatar">{initials(o.buyer)}</span><div className="grow"><div className="t">{o.buyer}</div><div className="xs muted">{o.qty} · {o.item}</div></div><div style={{ textAlign: 'right' }}><div className="num" style={{ fontWeight: 700 }}>{naira(o.total)}</div><Status s={o.status} /></div></Clickable>
          ))}</div>
        </div>
        <div className="card stack"><h3>Needs your attention</h3>
          <Alert tone="warn" icon="clock" title="Confirm stock: Yellow maize">Last confirmed 6 days ago. Buyers trust fresh stock.<div style={{ marginTop: 8 }}><Btn size="sm" variant="secondary" modal="stock">Update stock</Btn></div></Alert>
          <Alert tone="info" icon="receipt" title="New order from Ngozi Eze">20 kg tomatoes · confirm within 2 hours.</Alert>
        </div>
      </div>
    </AppShell>
  );
}

export function StorefrontEditor({ state }: { state: string }) {
  const taken = state === 'slug taken';
  return (
    <AppShell role="farmer" active="storefront-editor" title="My farm">
      <div className="row-between"><div><h1>My farm storefront</h1><p className="muted">This is what buyers see at your link.</p></div><div className="row"><Btn variant="secondary" to="farm-storefront">Preview</Btn><Btn toast="Storefront saved">Save changes</Btn></div></div>
      <div className="card stack-lg"><h3>Photos</h3>
        <div className="g2">
          <div className="field"><span>Cover photo</span><div className="store-cover has-photo" style={{ borderRadius: 'var(--r-md)', height: 120, backgroundImage: `url(${IMG('farm-cover')})` }} /><Btn size="sm" variant="secondary" icon="image" toast="Choose a cover photo" style={{ alignSelf: 'flex-start' }}>Change cover</Btn></div>
          <div className="field"><span>Logo</span><div className="row"><div className="store-logo" style={{ margin: 0, width: 84, height: 84, fontSize: 'var(--fs-2xl)' }}>OF</div><Btn size="sm" variant="secondary" icon="upload" toast="Choose a logo">Upload logo</Btn></div></div>
        </div>
      </div>
      <div className="card"><div className="form-grid">
        <Field label="Farm name"><input className="input" defaultValue="Okafor Family Farm" /></Field>
        <label className="field"><span>Storefront link</span>
          <div className="input-group"><span>farmoga.com/farm/</span><input className={`input ${taken ? 'is-error' : ''}`} defaultValue={taken ? 'okafor-farm' : 'okafor-family-farm'} /></div>
          {taken ? <span className="err">okafor-farm is taken. Try okafor-family-farm or okafor-farm-issele-uku.</span> : <span className="ok-text"><Icon name="check" />Available</span>}
        </label>
        <Field label="About your farm" full><textarea className="textarea" defaultValue="Family-run mixed farm growing vegetables, plantain and maize on 6 hectares. Harvested to order, picked up fresh from our gate." /></Field>
        <Field label="Pickup location"><input className="input" defaultValue="Farm gate, Issele-Uku" /></Field>
        <Field label="Opening hours"><input className="input" defaultValue="Mon–Sat · 7:00 am – 5:00 pm" /></Field>
      </div></div>
      <div className="card stack-lg">
        <div className="row-between"><div><h3>Storefront tabs</h3><p className="small muted">Up to five tabs. Products stay unlimited.</p></div>
          <Field label="Start from a template"><select className="select"><option>Mixed farm</option><option>Crop farm</option><option>Poultry farm</option><option>Livestock farm</option><option>Fish farm</option></select></Field></div>
        <div className="g2">{['Vegetables', 'Fruits', 'Grains & Cereals', 'Livestock & Poultry', 'Processed & Dried'].map((t, i) => <Field key={t} label={`Tab ${i + 1}`}><input className="input" defaultValue={t} /></Field>)}</div>
        <p className="xs muted">Renaming a tab keeps all its products.</p>
      </div>
    </AppShell>
  );
}

export function Listings({ state }: { state: string }) {
  const empty = state === 'empty';
  return (
    <AppShell role="farmer" active="farmer-listings" title="Listings">
      <div className="row-between"><div><h1>My listings</h1>{!empty && <p className="muted">5 products · 1 needs a stock check</p>}</div><Btn icon="plus" to="listing-form">Add product</Btn></div>
      {empty ? <Empty icon="box" title="No products yet" actions={<Btn icon="plus" to="listing-form">Add product</Btn>}>Add your first product with a price and quantity. It shows on your storefront right away.</Empty> : <>
        <Chips items={['All (5)', 'Available (3)', 'Expected (1)', 'Seasonal (1)', 'Hidden (0)']} />
        <div className="table-wrap hide-m"><table>
          <thead><tr><th>Product</th><th>Status</th><th className="num">Price</th><th className="num">Available</th><th>Stock confirmed</th><th /></tr></thead>
          <tbody>{mine.map(p => (
            <tr key={p.id}>
              <td><div className="row" style={{ flexWrap: 'nowrap' }}><div style={{ width: 52, flex: 'none' }}><Photo p={p} /></div><div><b>{p.name}</b><div className="xs muted">{p.tab}</div></div></div></td>
              <td><Status s={p.status} /></td><td className="num">{naira(p.price)} / {p.unit}</td><td className="num">{p.qty}</td>
              <td>{p.stale ? <Badge tone="warn" icon="clock">{p.confirmed}</Badge> : <span className="small muted">{p.confirmed}</span>}</td>
              <td><div className="row" style={{ flexWrap: 'nowrap', justifyContent: 'flex-end' }}><Btn size="sm" variant="secondary" modal="stock">Update stock</Btn><IconBtn icon="edit" label="Edit" to="listing-form" /></div></td>
            </tr>))}</tbody>
        </table></div>
        <div className="card list show-m" style={{ paddingBlock: 4 }}>{mine.map(p => (
          <div key={p.id} className="list-row"><div style={{ width: 56, flex: 'none' }}><Photo p={p} /></div><div className="grow"><div className="t">{p.name}</div><div className="xs muted num">{naira(p.price)} / {p.unit} · {p.qty}</div><div className="row" style={{ gap: 6, marginTop: 4 }}><Status s={p.status} />{p.stale && <Badge tone="warn">Check stock</Badge>}</div></div><IconBtn icon="edit" label="Update stock" modal="stock" /></div>
        ))}</div>
      </>}
    </AppShell>
  );
}

export function ListingForm() {
  return (
    <AppShell role="farmer" active="farmer-listings" title="Add product" back="farmer-listings">
      <div><h1>Add a product</h1><p className="muted">Clear photos and an honest stock count get more orders.</p></div>
      <div className="card stack"><h3>Photos</h3>
        <div className="g4">{[0, 1, 2].map(i => <Photo key={i} p={PRODUCTS[0]} />)}<div className="upload" style={{ aspectRatio: '4/3', padding: 8 }}><Icon name="plus" /><b className="small">Add photo</b></div></div>
        <p className="xs muted">Up to 6 photos. We compress them so they load fast on mobile data.</p>
      </div>
      <div className="card"><div className="form-grid">
        <Field label="Product name" full><input className="input" defaultValue="Fresh tomatoes (Roma)" /></Field>
        <Field label="Section"><select className="select"><option>Crops & Fresh Produce</option><option>Livestock & Animal Products</option><option>Bulk Produce & Other Farm Goods</option></select></Field>
        <Field label="Category"><select className="select"><option>Vegetables</option><option>Fruits</option><option>Grains & Cereals</option><option>Tubers & Roots</option></select></Field>
        <Field label="Storefront tab"><select className="select"><option>Vegetables</option><option>Fruits</option><option>Grains & Cereals</option><option>Livestock & Poultry</option><option>Processed & Dried</option></select></Field>
        <Field label="Sell by"><select className="select"><option>kg</option><option>crate</option><option>50 kg bag</option><option>100 kg bag</option><option>Derica</option><option>Mudu</option><option>paint bucket</option><option>basket</option><option>bunch</option><option>piece</option></select></Field>
        <Field label="Price per unit"><div className="input-group"><span>₦</span><input className="input" defaultValue="350" inputMode="numeric" /></div></Field>
        <Field label="Quantity available"><input className="input" defaultValue="2000" inputMode="numeric" /></Field>
        <Field label="Minimum order"><input className="input" defaultValue="20" inputMode="numeric" /></Field>
        <Field label="Availability"><select className="select"><option>Available now</option><option>Expected soon</option><option>Recurring supply</option><option>Seasonal</option></select></Field>
        <Field label="Available from"><input className="input" type="date" defaultValue="2026-11-23" /></Field>
        <Field label="Available until"><input className="input" type="date" defaultValue="2026-12-15" /></Field>
        <Field label="Pickup location" full><input className="input" defaultValue="Farm gate, Issele-Uku" /></Field>
        <Field label="Description" full><textarea className="textarea" defaultValue="Firm, deep-red Roma tomatoes for stews and sauces. Picked to order and sorted by size." /></Field>
      </div></div>
      <div className="row"><Btn to="farmer-listings" toast="Product published">Publish product</Btn><Btn variant="secondary" toast="Saved as draft">Save as draft</Btn></div>
    </AppShell>
  );
}

export function FarmerOrders({ state }: { state: string }) {
  const empty = state === 'empty';
  const tabs = ['All', 'New', 'Preparing', 'Ready for pickup', 'Collected'].map(t => t === 'All' || empty ? t : `${t} (${ORDERS.filter(o => o.status === t).length})`);
  return (
    <AppShell role="farmer" active="farmer-orders" title="Orders">
      <div><h1>Orders</h1><p className="muted">Confirm new orders quickly. Buyers have already paid.</p></div>
      <Tabs items={tabs} />
      {empty ? <Empty icon="receipt" title="No orders yet" actions={<Btn icon="share" modal="share-store">Share my storefront</Btn>}>Share your storefront link to get your first order.</Empty> :
        <div className="card list" style={{ paddingBlock: 4 }}>{ORDERS.map(o => (
          <Clickable key={o.id} className="list-row" to="farmer-order-detail">
            <div className="grow"><div className="row" style={{ gap: 8 }}><span className="t">{o.id}</span><Status s={o.status} /></div><div className="small">{o.buyer} <span className="muted">· {o.buyerType}</span></div><div className="xs muted">{o.qty} {o.item} · {o.when}</div></div>
            <div style={{ textAlign: 'right' }}><div className="num" style={{ fontWeight: 700 }}>{naira(o.total)}</div><div className="xs muted">Paid</div></div><Icon name="chev" />
          </Clickable>))}</div>}
    </AppShell>
  );
}

export function FarmerOrderDetail({ state }: { state: string }) {
  const ready = state === 'ready for pickup';
  const steps: [string, string?][] = [['Paid', '23 Nov, 11:30 am'], ['Confirmed by you', ready ? '11:41 am' : ''], ['Preparing', ready ? '12:10 pm' : ''], ['Ready for pickup', ready ? '2:05 pm' : ''], ['Collected by buyer', '']];
  return (
    <AppShell role="farmer" active="farmer-orders" title="OGF-10421" back="farmer-orders">
      <div><div className="row" style={{ gap: 8 }}><h1 style={{ fontSize: 'var(--fs-2xl)' }}>Order OGF-10421</h1><Status s={ready ? 'Ready for pickup' : 'New'} /></div><p className="small muted">Placed 23 Nov 2026, 11:30 am</p></div>
      <div className="split">
        <div className="stack-lg">
          <div className="card stack"><h3>Items</h3>
            <div className="list-row" style={{ border: 0, padding: 0 }}><div style={{ width: 64, flex: 'none' }}><Photo p={PRODUCTS[0]} /></div><div className="grow"><b>Fresh tomatoes (Roma)</b><div className="small muted num">20 kg × {naira(350)}</div></div><b className="num">{naira(7000)}</b></div>
            <hr className="divider" /><Kv rows={[['Subtotal', naira(7000)], ['Payment', <Badge key="p" tone="ok" icon="check">Paid · confirmed by provider</Badge>]]} />
          </div>
          <div className="card stack"><h3>Progress</h3><Timeline steps={steps} done={ready ? 4 : 1} /></div>
        </div>
        <aside className="stack-lg">
          <div className="card stack"><h3>Buyer</h3><div className="row"><span className="avatar">NE</span><div className="grow"><b>Ngozi Eze</b><div className="xs muted">Individual buyer · Asaba</div></div></div><LinkBox url="+234 806 555 0142" toast="Number copied" /></div>
          <div className="card stack">{ready ? <>
            <h3>Hand over the order</h3><p className="small muted">Ask the buyer for their pickup code before you hand over.</p>
            <Field label="Buyer's pickup code"><input className="input" placeholder="4-digit code" inputMode="numeric" style={{ fontSize: 'var(--fs-xl)', letterSpacing: '.3em', textAlign: 'center' }} /></Field>
            <Btn block toast="Order marked as collected">Confirm handover</Btn>
          </> : <>
            <h3>Confirm this order</h3><p className="small muted">Confirm within 2 hours so the buyer knows you have the stock.</p>
            <Btn block state="ready for pickup">Confirm and start preparing</Btn>
            <Btn block variant="danger" toast="Cancel flow: the buyer is refunded in full">Cannot fulfil · cancel and refund</Btn>
          </>}</div>
        </aside>
      </div>
    </AppShell>
  );
}

export function Subscription({ state }: { state: string }) {
  const soon = state === 'expiring';
  return (
    <AppShell role="farmer" active="subscription" title="Subscription">
      <h1>Subscription</h1>
      {soon && <Alert tone="warn" icon="clock" title="Your plan ends in 9 days">Renew now to keep your storefront visible. Your new term starts when the current one ends, so you lose no days.</Alert>}
      <div className="g2">
        <div className="card stack"><div className="eyebrow">Current plan</div>
          <div className="row-between"><h2>Annual</h2><Status s={soon ? 'Expiring' : 'Active'} /></div>
          <Kv rows={[['Paid until', soon ? '2 Dec 2026' : '23 Nov 2027'], ['Price', `${naira(95000)} / 12 months`], ['Started', '23 Nov 2026']]} />
          <div className="row"><Btn to="choose-plan">Renew now</Btn><Btn variant="secondary" to="choose-plan">Change plan</Btn></div>
        </div>
        <div className="card stack"><h3>What your plan includes</h3><ul className="checklist">{['Storefront with five tabs', 'Unlimited listings', 'Orders and buyer messages', 'Weekly and monthly reports'].map(x => <li key={x} className="done"><span className="ck"><Icon name="check" /></span>{x}</li>)}</ul></div>
      </div>
      <div className="card stack"><h3>Payment history</h3>
        <div className="table-wrap hide-m" style={{ border: 0 }}><table>
          <thead><tr><th>Date</th><th>Plan</th><th>Reference</th><th className="num">Amount</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>23 Nov 2026</td><td>Annual</td><td>OGF-SUB-88213</td><td className="num">{naira(95000)}</td><td><Status s="Paid" /></td></tr>
            <tr><td>23 Aug 2026</td><td>Quarterly</td><td>OGF-SUB-61057</td><td className="num">{naira(30000)}</td><td><Status s="Paid" /></td></tr>
          </tbody>
        </table></div>
        <div className="list show-m">{([['Annual plan', '23 Nov 2026 · OGF-SUB-88213', 95000], ['Quarterly plan', '23 Aug 2026 · OGF-SUB-61057', 30000]] as const).map(([plan, meta, amt]) => (
          <div key={meta} className="list-row"><div className="grow"><div className="t small">{plan}</div><div className="xs muted">{meta}</div></div><div style={{ textAlign: 'right' }}><b className="num small">{naira(amt)}</b><div><Status s="Paid" /></div></div></div>
        ))}</div>
      </div>
    </AppShell>
  );
}

type Note = [icon: string, title: string, detail: string, when: string, unread: boolean];
export function NotificationsList({ role, active, state, notes }: { role: 'farmer' | 'buyer'; active: string; state: string; notes: Note[] }) {
  return (
    <AppShell role={role} active={active} title="Notifications">
      <div className="row-between"><h1>Notifications</h1><Btn variant="ghost" size="sm" toast="All marked as read">Mark all as read</Btn></div>
      {state === 'empty' ? <Empty icon="bell" title="You are all caught up">Order updates and reminders will appear here.</Empty> :
        <div className="card list" style={{ paddingBlock: 4 }}>{notes.map(([i, t, d, w, unread]) => (
          <div key={t} className="list-row"><span className={`avatar ${unread ? '' : 'dim'}`}><Icon name={i} /></span><div className="grow"><div className="t">{t} {unread && <Badge tone="wheat">New</Badge>}</div><div className="small muted">{d}</div></div><span className="xs muted">{w}</span></div>
        ))}</div>}
    </AppShell>
  );
}
export const FarmerNotifications = ({ state }: { state: string }) => <NotificationsList role="farmer" active="notifications" state={state} notes={[
  ['receipt', 'New order OGF-10421', 'Ngozi Eze paid ₦7,000 for 20 kg tomatoes. Confirm within 2 hours.', '12 min ago', true],
  ['shield', 'Your farm is verified', 'The Verified badge now shows on your storefront.', 'Yesterday', false],
  ['card', 'Annual plan active', 'Payment of ₦95,000 confirmed. Paid until 23 Nov 2027.', '23 Nov', false],
  ['clock', 'Stock check due', 'Yellow maize was last confirmed 6 days ago.', '22 Nov', false]
]} />;
