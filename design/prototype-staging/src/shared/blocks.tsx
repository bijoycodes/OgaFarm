/* Blocks reused by several screens and versions */
import { useState, type ReactNode } from 'react';
import { Icon } from './ui/Icon';
import { Btn, IconBtn, LinkBox, Chips, Field, Empty, ProductCard, Skel, Clickable, Photo, Switch } from './ui/ui';
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
          <div style={{ width: 76, flex: 'none' }}><Photo p={PRODUCTS[0]} /></div>
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

/* ---------- Marketplace filters (sidebar on desktop, sheet on mobile) ---------- */
const CATS: [string, string, number][] = [['All produce', 'grid', 8], ['Vegetables', 'leaf', 3], ['Fruits', 'leaf', 1], ['Eggs & poultry', 'egg', 1], ['Fish', 'fish', 1], ['Grains & cereals', 'seed', 1], ['Processed foods', 'sack', 1]];
const AVAIL = ['Available now', 'Expected soon', 'Recurring', 'Seasonal'];
const RADIUS = ['10 km', '25 km', '50 km', 'State'];

function FilterSection({ title, children, open = true, note }: { title: string; children: ReactNode; open?: boolean; note?: string }) {
  return (
    <details className="f-sec" open={open}>
      <summary><span>{title}{note && <span className="f-sec-note">{note}</span>}</span><Icon name="chev" /></summary>
      <div className="f-body">{children}</div>
    </details>
  );
}

function PriceRange() {
  const MAX = 50000;
  const [lo, setLo] = useState(300), [hi, setHi] = useState(45000);
  const pct = (v: number) => `${(v / MAX) * 100}%`;
  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="range" style={{ ['--lo' as string]: pct(lo), ['--hi' as string]: pct(hi) }}>
        <input type="range" min={0} max={MAX} step={100} value={lo} aria-label="Minimum price" onChange={e => setLo(Math.min(+e.target.value, hi - 500))} />
        <input type="range" min={0} max={MAX} step={100} value={hi} aria-label="Maximum price" onChange={e => setHi(Math.max(+e.target.value, lo + 500))} />
      </div>
      <div className="price-pair">
        <label><span className="xs muted">Min</span><span className="pp-in"><span>₦</span><input className="num" inputMode="numeric" value={lo.toLocaleString('en-NG')} onChange={e => setLo(Number(e.target.value.replace(/\D/g, '')) || 0)} aria-label="Minimum price in naira" /></span></label>
        <span className="pp-sep" aria-hidden="true" />
        <label><span className="xs muted">Max</span><span className="pp-in"><span>₦</span><input className="num" inputMode="numeric" value={hi.toLocaleString('en-NG')} onChange={e => setHi(Number(e.target.value.replace(/\D/g, '')) || 0)} aria-label="Maximum price in naira" /></span></label>
      </div>
    </div>
  );
}

function ToggleChips({ items, initial }: { items: string[]; initial: string[] }) {
  const [on, setOn] = useState<string[]>(initial);
  return <div className="f-chips">{items.map(c => (
    <button key={c} type="button" className="f-chip" aria-pressed={on.includes(c)} onClick={() => setOn(v => v.includes(c) ? v.filter(x => x !== c) : [...v, c])}>{on.includes(c) && <Icon name="check" />}{c}</button>
  ))}</div>;
}

export function Filters({ sheet }: { sheet?: boolean }) {
  // Categories are multi-select. An empty list means "All produce".
  const [cats, setCats] = useState<string[]>([]);
  const toggleCat = (name: string) => {
    if (name === 'All produce') { setCats([]); return; }
    setCats(v => v.includes(name) ? v.filter(x => x !== name) : [...v, name]);
  };
  const isOn = (name: string) => name === 'All produce' ? cats.length === 0 : cats.includes(name);
  const matching = cats.length ? CATS.filter(([n]) => cats.includes(n)).reduce((a, [, , n]) => a + n, 0) : 8;
  const [radius, setRadius] = useState('50 km');
  return (
    <div className={`filters ${sheet ? 'filters-sheet' : ''}`}>
      <div className="f-head">
        <h3>Filters <span className="f-count">3</span></h3>
        {sheet ? <IconBtn icon="close" label="Close filters" close /> : <Clickable className="f-clear" toast="All filters cleared">Clear all</Clickable>}
      </div>
      <FilterSection title="Category" note={cats.length ? `${cats.length} selected` : undefined}>
        <div className="f-cats" role="group" aria-label="Category (choose one or more)">{CATS.map(([name, ic, n]) => (
          <button key={name} type="button" role="checkbox" aria-checked={isOn(name)} className="f-cat" onClick={() => toggleCat(name)}>
            <span className="f-box" aria-hidden="true"><Icon name="check" /></span>
            <span className="f-ic"><Icon name={ic} /></span><span className="grow">{name}</span><span className="f-n">{n}</span>
          </button>
        ))}</div>
      </FilterSection>
      <FilterSection title="Location">
        <div className="input-group"><span><Icon name="pin" /></span><input className="input" defaultValue="Asaba, Delta State" aria-label="Location" /></div>
        <div className="seg-f" role="radiogroup" aria-label="Distance">{RADIUS.map(r => (
          <button key={r} type="button" role="radio" aria-checked={radius === r} onClick={() => setRadius(r)}>{r}</button>
        ))}</div>
      </FilterSection>
      <FilterSection title="Price per unit"><PriceRange /></FilterSection>
      <FilterSection title="Availability"><ToggleChips items={AVAIL} initial={['Available now', 'Recurring']} /></FilterSection>
      <FilterSection title="How you get it"><ToggleChips items={['Pickup at farm', 'Delivery']} initial={['Pickup at farm', 'Delivery']} /></FilterSection>
      <FilterSection title="Trust">
        <div className="stack" style={{ gap: 8 }}>
          <Switch label="Verified farms only" on onText="Checked by the OgaFarm team" offText="Show all farms" />
          <Switch label="Fresh stock only" onText="Stock confirmed in the last 24 hours" offText="Any confirmation date" />
        </div>
      </FilterSection>
      {sheet && <div className="f-foot"><Btn variant="secondary" toast="All filters cleared">Clear all</Btn><Btn close toast={`Showing ${matching} results`}>Show {matching} results</Btn></div>}
    </div>
  );
}

/** Active filters above the results: each can be removed, plus "Clear all". */
function ActiveFilters() {
  const [items, setItems] = useState(['Asaba · 50 km', 'Verified farms', 'Available now', 'Recurring']);
  if (!items.length) return null;
  return (
    <div className="active-filters" aria-label="Active filters">
      {items.map(i => <button key={i} type="button" className="af-chip" aria-label={`Remove filter: ${i}`} onClick={() => setItems(v => v.filter(x => x !== i))}>{i}<Icon name="close" /></button>)}
      <Clickable className="f-clear" onClick={() => setItems([])}>Clear all</Clickable>
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
        <div className="row browse-tools"><Btn variant="secondary" size="sm" className="filter-btn" icon="filter" modal="filters">Filters · 3</Btn><select className="select" style={{ width: 'auto', minHeight: 36 }} aria-label="Sort"><option>Nearest first</option><option>Lowest price</option><option>Recently confirmed</option></select></div>
      </div>
      <div className="input-group"><span><Icon name="search" /></span><input className="input" defaultValue={state === 'empty' ? 'cocoyam' : ''} placeholder="Search produce, livestock, inputs" aria-label="Search" /></div>
      <div className="browse"><aside className="filter-panel card"><Filters /></aside><div className="stack">{state === 'default' && <ActiveFilters />}{results}</div></div>
    </>
  );
}
