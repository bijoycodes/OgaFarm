/* Blocks reused by several screens and versions */
import { Icon } from './ui/Icon';
import { Btn, IconBtn, LinkBox, Chips, Field, Empty, ProductCard, Skel, Clickable } from './ui/ui';
import { PLANS, PRODUCTS, naira } from './data/sample';

export function Plans({ selectable }: { selectable?: boolean }) {
  return (
    <div className="plans">
      {PLANS.map(pl => {
        const body = (
          <>
            {pl.popular && <span className="badge b-wheat ribbon">Most chosen</span>}
            {selectable && <input type="radio" name="plan" defaultChecked={pl.key === 'a'} aria-label={pl.name} />}
            <div className="eyebrow">{pl.name}</div>
            <div className="price num">{naira(pl.price)} <small>/ {pl.per}</small></div>
            <div className="small muted">{pl.monthly}</div>
            <ul>{pl.features.map(f => <li key={f}><Icon name="check" />{f}</li>)}</ul>
            {!selectable && <Btn variant={pl.popular ? 'primary' : 'secondary'} block to="signup" style={{ marginTop: 'auto' }}>Choose {pl.name}</Btn>}
          </>
        );
        return selectable
          ? <label key={pl.key} className={`plan ${pl.popular ? 'is-popular' : ''}`}>{body}</label>
          : <div key={pl.key} className={`plan ${pl.popular ? 'is-popular' : ''}`}>{body}</div>;
      })}
    </div>
  );
}

export function ShareSheet({ what, url, preview }: { what: string; url: string; preview: string }) {
  return (
    <>
      <div className="row-between"><h3>Share {what}</h3><IconBtn icon="close" label="Close" close /></div>
      <LinkBox url={`farmoga.com${url}`} />
      <Clickable className="share-opt" toast="Opens WhatsApp with a ready message and the link"><span className="si" style={{ background: '#E3F4E9', color: '#1C6B3E' }}><Icon name="chat" /></span><div><b>WhatsApp</b><div className="xs muted">Send to a chat, group or status</div></div></Clickable>
      <Clickable className="share-opt" toast="Opens your phone's share menu"><span className="si"><Icon name="share" /></span><div><b>More options</b><div className="xs muted">Facebook, SMS, email and other apps</div></div></Clickable>
      <div className="card card-tight" style={{ background: 'var(--sunken)' }}>
        <div className="eyebrow">How the link looks in chat</div>
        <div className="row" style={{ marginTop: 8, alignItems: 'flex-start', flexWrap: 'nowrap' }}>
          <div className="ph crop" style={{ width: 76, flex: 'none' }}><Icon name="leaf" /></div>
          <div className="grow small"><b>{preview}</b><div className="muted xs">Fresh produce from Issele-Uku, Delta State. Order on OgaFarm.</div><div className="xs" style={{ color: 'var(--primary-ink)' }}>farmoga.com</div></div>
        </div>
      </div>
    </>
  );
}

export function StockModal() {
  return (
    <>
      <div className="row-between"><h3>Update stock</h3><IconBtn icon="close" label="Close" close /></div>
      <p className="small muted">Yellow maize · last confirmed 6 days ago</p>
      <Field label="Availability"><select className="select"><option>Available now</option><option>Expected soon</option><option>Seasonal</option><option>Sold out</option><option>Temporarily unavailable</option></select></Field>
      <Field label="Quantity available (100 kg bags)"><input className="input" defaultValue="25" inputMode="numeric" /></Field>
      <Field label="Price per bag"><div className="input-group"><span>₦</span><input className="input" defaultValue="38000" /></div></Field>
      <p className="xs muted">Saving records that you confirmed this stock today.</p>
      <Btn block close toast="Stock confirmed today">Confirm stock</Btn>
    </>
  );
}

function Filters() {
  return (
    <div className="stack">
      <div className="field"><span>Section</span><Chips items={['All', 'Crops', 'Livestock', 'Bulk goods']} /></div>
      <Field label="Category"><select className="select"><option>All categories</option><option>Vegetables</option><option>Fruits</option><option>Eggs</option><option>Fish & Aquaculture</option><option>Grains & Cereals</option></select></Field>
      <Field label="Location"><input className="input" defaultValue="Asaba, Delta State" /></Field>
      <div className="field"><span>Price per unit</span><div className="row" style={{ flexWrap: 'nowrap' }}><input className="input" placeholder="Min ₦" aria-label="Minimum price" /><input className="input" placeholder="Max ₦" aria-label="Maximum price" /></div></div>
      <label className="check"><input type="checkbox" defaultChecked />Verified farms only</label>
      <label className="check"><input type="checkbox" />Stock confirmed in the last 24 hours</label>
    </div>
  );
}

export function Browse({ state, productTo = 'product' }: { state: string; productTo?: string }) {
  let results;
  if (state === 'loading') results = <div className="pgrid">{Array.from({ length: 6 }, (_, i) => <div key={i} className="pcard"><div className="skel" style={{ aspectRatio: '4/3' }} /><Skel w="70%" /><Skel h={18} w="45%" /><Skel h={12} w="80%" /></div>)}</div>;
  else if (state === 'empty') results = <Empty icon="search" title="No “cocoyam” near Warri yet" actions={<><Btn variant="secondary" toast="Area widened to Delta State">Search all of Delta State</Btn><Btn toast="Search saved. We will tell you when a farm lists it.">Save this search</Btn></>}>Try a wider area, or save this search and we will tell you when a farm lists it.</Empty>;
  else if (state === 'error') results = <Empty icon="wifi" tone="danger" title="We could not load produce" actions={<Btn toast="Trying again…">Try again</Btn>}>Check your connection and try again. Anything you saved is still here.</Empty>;
  else results = <div className="pgrid">{PRODUCTS.map(p => <ProductCard key={p.id} p={p} to={productTo} />)}</div>;
  return (
    <>
      <div className="row-between">
        <div><h2>Browse produce</h2><p className="small muted">{state === 'default' ? '8 results near Asaba, Delta State' : ' '}</p></div>
        <div className="row"><Btn variant="secondary" size="sm" className="filter-btn" icon="filter" toast="Opens filters">Filters</Btn><select className="select" style={{ width: 'auto', minHeight: 36 }} aria-label="Sort"><option>Nearest first</option><option>Lowest price</option><option>Recently confirmed</option></select></div>
      </div>
      <div className="input-group"><span><Icon name="search" /></span><input className="input" defaultValue={state === 'empty' ? 'cocoyam' : ''} placeholder="Search produce, livestock, inputs" aria-label="Search" /></div>
      <div className="browse"><aside className="filter-panel card"><Filters /></aside><div className="stack">{results}</div></div>
    </>
  );
}
