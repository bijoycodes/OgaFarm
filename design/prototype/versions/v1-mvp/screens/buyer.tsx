/* v1 · Buyer: browse, checkout, order status, orders, account */
import { Icon } from '@shared/ui/Icon';
import { Btn, Clickable, Status, Alert, Empty, Photo, Stepper, Field, Kv } from '@shared/ui/ui';
import { AppShell } from '@shared/layout/shells';
import { Browse } from '@shared/blocks';
import { PRODUCTS, naira } from '@shared/data/sample';
import { NotificationsList } from './farmer';

export const BuyerBrowse = ({ state }: { state: string }) =>
  <AppShell role="buyer" active="buyer-browse" title="Browse"><Browse state={state} /></AppShell>;

export function Checkout({ state }: { state: string }) {
  const changed = state === 'price changed';
  const unit = changed ? 380 : 350, total = unit * 20;
  return (
    <AppShell role="buyer" active="buyer-browse" title="Checkout" back="buyer-browse">
      <div className="row-between"><h1>Checkout</h1><span className="timer"><Icon name="clock" />Stock held for you · <b className="num">14:32</b></span></div>
      {changed && <Alert tone="warn" icon="alert" title="The price changed">Okafor Family Farm updated tomatoes from ₦350 to ₦380 per kg while you were checking out. Please review the new total.</Alert>}
      <div className="split">
        <div className="stack-lg">
          <div className="card stack"><h3>Your order</h3>
            <div className="list-row wrap-m" style={{ border: 0, padding: 0 }}><div style={{ width: 64, flex: 'none' }}><Photo p={PRODUCTS[0]} /></div><div className="grow"><b>Fresh tomatoes (Roma)</b><div className="xs muted">Okafor Family Farm · Verified</div></div><Stepper value={20} label="Quantity in kg" /></div>
          </div>
          <div className="card stack"><h3>How you get it</h3>
            <label className="choice"><input type="radio" name="how" defaultChecked aria-label="Pickup" /><b>Pickup at the farm</b><span className="small muted">Farm gate, Issele-Uku · Mon–Sat, 7am–5pm</span></label>
            <label className="choice"><input type="radio" name="how" disabled aria-label="Delivery" /><b>Delivery by a transporter</b><span className="small muted">Arrives in version 2</span></label>
          </div>
          <div className="card"><div className="form-grid">
            <Field label="Your name"><input className="input" defaultValue="Ngozi Eze" /></Field>
            <Field label="Phone"><div className="input-group"><span>+234</span><input className="input" defaultValue="806 555 0142" /></div></Field>
          </div></div>
        </div>
        <aside className="card stack buy-box"><h3>Summary</h3>
          <Kv rows={[[`20 kg × ${naira(unit)}`, naira(total)], ['Pickup', 'Free']]} /><hr className="divider" />
          <div className="row-between"><b>Total</b><b className="price-big num" style={{ fontSize: 'var(--fs-2xl)' }}>{naira(total)}</b></div>
          <Btn block to="order-status">{changed ? 'Accept new price and pay' : `Pay ${naira(total)}`}</Btn>
          <p className="xs muted row" style={{ gap: 6, flexWrap: 'nowrap' }}><Icon name="lock" />Paid securely through our payment provider. The farmer is paid for this order directly.</p>
        </aside>
      </div>
    </AppShell>
  );
}

export function OrderStatus({ state }: { state: string }) {
  return (
    <AppShell role="buyer" active="buyer-orders" title="Order OGF-10421" back="buyer-orders">
      {state === 'confirming' && <Empty icon="clock" tone="warn" title="Confirming your payment">Your stock is held. We confirm the order as soon as the payment provider confirms your payment.</Empty>}
      {state === 'failed' && <Empty icon="alert" tone="danger" title="Payment failed" actions={<Btn to="checkout">Try again</Btn>}>No money was taken and the stock was released. You can try again while the farmer still has stock.</Empty>}
      {state === 'confirmed' && <>
        <Alert tone="ok" icon="check" title="Order confirmed">Okafor Family Farm has your 20 kg of tomatoes. We will tell you when it is ready.</Alert>
        <div className="split">
          <div className="card stack" style={{ textAlign: 'center', alignItems: 'center' }}><div className="eyebrow">Your pickup code</div><div className="pickup-code num">4821</div><p className="small muted" style={{ maxWidth: '36ch' }}>Show this code to the farmer when you collect. Do not share it before you have your order.</p></div>
          <div className="card stack"><h3>Pickup details</h3>
            <Kv rows={[['Where', 'Farm gate, Issele-Uku'], ['When', 'Mon–Sat, 7am–5pm'], ['Farmer', 'Emeka Okafor'], ['Paid', naira(7000)]]} />
            <Btn block variant="secondary" icon="pin" toast="Opens directions in maps">Get directions</Btn>
          </div>
        </div>
      </>}
    </AppShell>
  );
}

export function BuyerOrders({ state }: { state: string }) {
  const rows: [string, string, string, number, string][] = [
    ['OGF-10421', 'Fresh tomatoes (Roma) · 20 kg', 'Okafor Family Farm', 7000, 'Preparing'],
    ['OGF-10356', 'Layer eggs · 3 crates', 'Delta Poultry', 15600, 'Ready for pickup'],
    ['OGF-10288', 'Live catfish · 8 kg', 'Ughelli Fish Farm', 22400, 'Collected']
  ];
  return (
    <AppShell role="buyer" active="buyer-orders" title="My orders">
      <h1>My orders</h1>
      {state === 'empty' ? <Empty icon="receipt" title="No orders yet" actions={<Btn to="buyer-browse">Browse produce</Btn>}>Fresh produce from verified farms is a few taps away.</Empty> :
        <div className="card list" style={{ paddingBlock: 4 }}>{rows.map(([id, it, f, t, s]) => (
          <Clickable key={id} className="list-row" to="order-status"><div className="grow"><div className="row" style={{ gap: 8 }}><span className="t">{id}</span><Status s={s} /></div><div className="small">{it}</div><div className="xs muted">{f}</div></div><b className="num">{naira(t)}</b><Icon name="chev" /></Clickable>
        ))}</div>}
    </AppShell>
  );
}

export const BuyerNotifications = ({ state }: { state: string }) => <NotificationsList role="buyer" active="buyer-notifications" state={state} notes={[
  ['check', 'Order OGF-10421 confirmed', 'Okafor Family Farm is preparing your tomatoes.', '5 min ago', true],
  ['receipt', 'Payment received', '₦7,000 confirmed. Your pickup code is 4821.', '12 min ago', false]
]} />;

export function BuyerAccount() {
  return (
    <AppShell role="buyer" active="buyer-account" title="Account">
      <h1>Account</h1>
      <div className="card stack"><div className="row" style={{ flexWrap: 'nowrap' }}><span className="avatar" style={{ width: 56, height: 56, flex: 'none' }}>NE</span><div className="grow" style={{ minWidth: 0 }}><h3>Ngozi Eze</h3><div className="small muted">+234 806 555 0142 · Individual buyer</div></div></div></div>
      <div className="card list" style={{ paddingBlock: 4 }}>{([['user', 'Personal details'], ['pin', 'Saved pickup places'], ['bell', 'Notification settings'], ['lock', 'Privacy and data'], ['store', 'Start selling on OgaFarm']] as const).map(([i, t]) => (
        <Clickable key={t} className="list-row" toast={`${t} opens`}><Icon name={i} /><span className="grow">{t}</span><Icon name="chev" /></Clickable>
      ))}</div>
    </AppShell>
  );
}
