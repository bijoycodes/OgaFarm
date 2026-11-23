/* v1 · Public pages for visitors */
import { Icon } from '@shared/ui/Icon';
import { useProto } from '@app/context';
import { Btn, Clickable, ProductCard, Photo, Status, Verified, Alert, Empty, Stepper, Tabs, Kv, Skel, Badge } from '@shared/ui/ui';
import { PublicShell } from '@shared/layout/shells';
import { Plans, Browse } from '@shared/blocks';
import { FARMS, PRODUCTS, naira, IMG } from '@shared/data/sample';

const ROLES: [string, string, string, string, string][] = [
  ['leaf', 'Farmer', 'Sell produce, livestock and eggs from your own storefront.', 'Paid plan', 'signup'],
  ['search', 'Individual buyer', 'Buy fresh food for your household straight from farms.', 'Free', 'signup'],
  ['store', 'Business buyer', 'Source in volume for your restaurant, shop or factory.', 'Free', 'soon:v3'],
  ['users', 'Group buyer', 'Buy together with others and share pickup or delivery.', 'Free', 'soon:v4'],
  ['seed', 'Farm supplier', 'Sell seed, feed, fertiliser, chicks and equipment.', 'Paid plan', 'soon:v3'],
  ['truck', 'Transporter', 'Offer your vehicle and earn from farm deliveries.', 'Free', 'soon:v2:transporter-signup']
];

const FEATURES: [string, string, string][] = [
  ['tag', 'Farmers set the price', 'No middleman deciding what your harvest is worth. Buyers see the farmer’s own price.'],
  ['shield', 'Checked farms', 'The Verified badge appears only after our team reviews ID and farm documents.'],
  ['clock', 'Fresh stock, honestly shown', 'Every listing shows when the farmer last confirmed what is in stock.'],
  ['lock', 'Safe payment', 'Orders start only when the payment provider confirms you paid.']
];

export function Landing() {
  const { version } = useProto();
  // "soon:v2:screen" links are live once the viewed version reaches v2
  const isSoon = (to: string) => { const [k, v, target] = to.split(':'); return k === 'soon' && !(target && Number(v.slice(1)) <= Number(version.slice(1))); };
  return (
    <PublicShell active="landing">
      <section className="hero">
        <div className="wrap">
          <div>
            <Badge tone="wheat" icon="sun">Now live in Delta State</Badge>
            <h1 style={{ marginTop: 16 }}>Buy straight from the farm. <em>Sell</em> without the middleman.</h1>
            <p className="lead">Fresh produce, livestock and farm inputs from verified Nigerian farmers. Prices are set by the people who grow them.</p>
            <form className="searchbar" role="search" onSubmit={e => e.preventDefault()}>
              <label className="sb-field"><Icon name="search" /><span className="sr">What do you need?</span><input className="input" placeholder="Tomatoes, eggs, garri…" /></label>
              <span className="sep" aria-hidden="true" />
              <label className="sb-field"><Icon name="pin" /><span className="sr">Where?</span><input className="input" placeholder="Asaba, Delta State" /></label>
              <Btn to="marketplace">Search</Btn>
            </form>
            <div className="hero-trust"><span><Icon name="shield" />Verified farms</span><span><Icon name="tag" />Farmer-set prices</span><span><Icon name="lock" />Secure payment</span></div>
          </div>
          <div className="hero-visual">
          <img className="hero-photo" src={IMG('market-hero')} alt="Buyers choosing fresh tomatoes at a Nigerian market" />
          <div className="hero-card" aria-hidden="true">
            <div className="row"><span className="avatar">EO</span><div><b>Okafor Family Farm</b><div className="xs muted">shared on WhatsApp</div></div></div>
            <div className="chat">Fresh Roma tomatoes harvested this morning. ₦350/kg, pickup in Issele-Uku. Order here.</div>
            <Photo p={PRODUCTS[0]} />
            <div className="row-between"><b className="num" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-xl)', color: 'var(--primary-ink)' }}>₦350 / kg</b><Badge tone="ok" icon="check">2,000 kg in stock</Badge></div>
          </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head"><div className="stack" style={{ gap: 6 }}><div className="eyebrow">Why OgaFarm</div><h2>Fair trade, from field to table</h2></div></div>
          <div className="feature-grid">
            {FEATURES.map(([i, t, d]) => <div key={t} className="card feature"><span className="ri"><Icon name={i} /></span><h3 style={{ fontSize: 'var(--fs-lg)' }}>{t}</h3><p>{d}</p></div>)}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <div className="sec-head"><div className="stack" style={{ gap: 6 }}><div className="eyebrow">Get started</div><h2>How will you use OgaFarm?</h2></div><p className="muted small">Buyers, transporters and job seekers join free. Farmers and suppliers choose a plan.</p></div>
          <div className="role-grid">
            {ROLES.map(([i, t, d, p, to]) => (
              <Clickable key={t} className="role-card" to={to}>
                <div className="row-between"><span className="ri"><Icon name={i} /></span><Badge tone={p === 'Free' ? 'ok' : 'wheat'}>{p}</Badge></div>
                <b style={{ fontSize: 'var(--fs-lg)' }}>{t}</b>
                <p className="small muted">{d}</p>
                <span className="go">{isSoon(to) ? 'Coming soon' : 'Get started'}<Icon name="chev" /></span>
              </Clickable>
            ))}
          </div>
          <div className="row" style={{ marginTop: 'var(--s-5)' }}><Btn variant="secondary" icon="briefcase" to="soon:v5">Find farm work · free</Btn><Btn variant="secondary" icon="users" to="soon:v5">Hire farm workers</Btn></div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head"><div className="stack" style={{ gap: 6 }}><div className="eyebrow">Fresh this week</div><h2>Near Asaba</h2></div><Btn variant="ghost" to="marketplace">See all produce <Icon name="chev" /></Btn></div>
          <div className="pgrid">{PRODUCTS.slice(0, 4).map(p => <ProductCard key={p.id} p={p} />)}</div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap g2" style={{ alignItems: 'center', gap: 'var(--s-7)' }}>
          <div className="stack-lg">
            <div className="stack" style={{ gap: 6 }}><div className="eyebrow">For farmers</div><h2>Your storefront, ready to share on WhatsApp</h2></div>
            <ol className="how">
              <li><b>Set up your farm</b><span className="small muted">Add your farm, products, prices and pickup location.</span></li>
              <li><b>Share your link</b><span className="small muted">Send farmoga.com/farm/your-farm to customers and groups.</span></li>
              <li><b>Get paid orders</b><span className="small muted">Buyers pay securely. You prepare and hand over.</span></li>
            </ol>
            <div className="row"><Btn to="signup">Start selling</Btn><Btn variant="secondary" to="pricing">See plans from ₦30,000</Btn></div>
          </div>
          <div className="card stack" style={{ background: 'var(--sunken)', boxShadow: 'none' }}>
            <div className="linkbox"><code>farmoga.com/farm/okafor-family-farm</code><Badge tone="ok" icon="check">Live</Badge></div>
            <div className="g3 thumb-strip">{[PRODUCTS[0], PRODUCTS[5], PRODUCTS[6]].map(p => <Photo key={p.id} p={p} />)}</div>
            <p className="small muted">Buyers open your page in any browser. No app download needed.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack-lg">
          <div className="g2">
            <div className="card stack"><span className="ri wheat"><Icon name="pin" /></span><h3>Know a local market?</h3><p className="small muted">Help farmers find produce markets, livestock markets and collection centres near them.</p><Btn variant="secondary" to="soon:v5" style={{ alignSelf: 'flex-start' }}>Suggest a market</Btn></div>
            <div className="card stack"><span className="ri"><Icon name="briefcase" /></span><h3>Farm jobs near you</h3><p className="small muted">Find harvest and poultry work, or hire workers. Job seekers join free and stay private.</p><Btn variant="secondary" to="soon:v5" style={{ alignSelf: 'flex-start' }}>Browse jobs</Btn></div>
          </div>
          <div className="cta-band">
            <div className="stack" style={{ gap: 6, maxWidth: '46ch' }}><h2>Ready to sell your next harvest?</h2><p className="muted">Set up your storefront in minutes and share it with your customers today.</p></div>
            <div className="row"><Btn to="signup">Start selling</Btn><Btn variant="secondary" to="marketplace">Browse produce</Btn></div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

export function Pricing() {
  return (
    <PublicShell active="pricing">
      <section className="section"><div className="wrap stack-lg">
        <div className="stack" style={{ maxWidth: 640 }}><div className="eyebrow">Plans for farmers and farm suppliers</div><h1>Simple pricing. No commission surprises.</h1><p className="muted">Buyers, transporters, job seekers and consultants join free. A plan gives sellers their storefront and orders. It does not guarantee sales.</p></div>
        <Plans />
        <div className="g2">
          <div className="card stack"><h3>Free accounts</h3><div className="chips">{['Individual buyer', 'Business buyer', 'Group buyer', 'Diaspora buyer', 'Transporter', 'Job seeker', 'Consultant'].map(x => <Badge key={x} tone="ok">{x}</Badge>)}</div></div>
          <div className="card stack"><h3>Common questions</h3>
            <div className="small"><b>What happens when my plan ends?</b><p className="muted">Your storefront is hidden from buyers, never deleted. Renew and it comes back exactly as it was.</p></div>
            <div className="small"><b>When does my plan start?</b><p className="muted">As soon as the payment provider confirms your payment.</p></div>
          </div>
        </div>
      </div></section>
    </PublicShell>
  );
}

export const Marketplace = ({ state }: { state: string }) =>
  <PublicShell active="marketplace"><section className="section"><div className="wrap stack-lg"><Browse state={state} /></div></section></PublicShell>;

export function FarmStorefront({ state }: { state: string }) {
  const f = FARMS.okafor;
  const mine = PRODUCTS.filter(p => p.farm === 'okafor');
  return (
    <PublicShell url="/farm/okafor-family-farm">
      <div className="store-cover has-photo" role="img" aria-label="Farm cover photo: crop rows at Okafor Family Farm" style={{ backgroundImage: `url(${IMG('farm-cover')})` }} />
      <div className="store-head">
        <div className="store-logo">{f.initials}</div>
        <div className="grow stack" style={{ gap: 6, paddingBottom: 6 }}>
          <div className="row"><h1 style={{ fontSize: 'var(--fs-2xl)' }}>{f.name}</h1><Verified /></div>
          <div className="row small muted"><span className="row" style={{ gap: 4 }}><Icon name="pin" />{f.place}</span><span className="row" style={{ gap: 4 }}><Icon name="clock" />{f.hours}</span><span className="row" style={{ gap: 4, color: 'var(--warn)' }}><Icon name="star" />{f.rating} ({f.reviews} reviews)</span></div>
        </div>
        <div className="row" style={{ paddingBottom: 6 }}><Btn variant="secondary" icon="share" modal="share-store">Share</Btn><Btn variant="soft" icon="chat" to="soon:v5">Message</Btn></div>
      </div>
      <section className="section" style={{ paddingTop: 'var(--s-5)' }}><div className="wrap stack-lg">
        <Tabs items={['All products', 'Vegetables', 'Fruits', 'Grains & Cereals', 'Livestock & Poultry', 'Processed & Dried']} />
        <div className="split">
          <div className="pgrid">{state === 'loading'
            ? Array.from({ length: 4 }, (_, i) => <div key={i} className="pcard"><div className="skel" style={{ aspectRatio: '4/3' }} /><Skel w="60%" /><Skel h={18} w="40%" /></div>)
            : mine.map(p => <ProductCard key={p.id} p={p} />)}</div>
          <aside className="card stack">
            <h3>About the farm</h3>
            <p className="small muted">Family-run mixed farm growing vegetables, plantain and maize on 6 hectares. Harvested to order, picked up fresh from our gate.</p>
            <Kv rows={[['Pickup', 'Farm gate, Issele-Uku'], ['Hours', 'Mon–Sat, 7am–5pm'], ['On OgaFarm since', f.since], ['Farm type', f.type]]} />
            <hr className="divider" /><div className="xs muted">Prices and stock are set and confirmed by the farmer. Last stock update today, 9:20 am.</div>
          </aside>
        </div>
      </div></section>
    </PublicShell>
  );
}

export function ProductDetail({ state }: { state: string }) {
  const delivery = Number(useProto().version.slice(1)) >= 2; // V2 adds delivery
  const p = PRODUCTS[0], f = FARMS.okafor, out = state === 'sold out';
  return (
    <PublicShell active="marketplace" url="/product/okafor-roma-tomatoes">
      <section className="section" style={{ paddingTop: 'var(--s-5)' }}><div className="wrap stack-lg">
        <nav aria-label="Breadcrumb"><ol className="breadcrumb"><li><Clickable to="marketplace">Browse</Clickable></li><li aria-hidden="true"><Icon name="chev" /></li><li>Vegetables</li><li aria-hidden="true"><Icon name="chev" /></li><li aria-current="page">{p.name}</li></ol></nav>
        <div className="split">
          <div className="gallery"><Photo p={p} /><div className="thumbs">{['50% 50%', '20% 30%', '80% 70%', '50% 90%'].map((pos, i) => <div key={i} style={{ aspectRatio: '1', display: 'grid' }}><Photo p={p} pos={pos} /></div>)}</div></div>
          <aside className="card stack buy-box">
            <div className="row-between"><Badge>Vegetables</Badge><Status s={out ? 'Sold out' : p.status} /></div>
            <h2>{p.name}</h2>
            <div className="price-big num">{naira(p.price)} <small>per kg</small></div>
            {out
              ? <Alert tone="warn" icon="alert" title="Sold out for now">The farmer expects more on 30 Nov. Ask to be notified or see similar produce.</Alert>
              : <>
                  <Kv rows={[['Available', '2,000 kg'], ['Minimum order', '20 kg'], ['Available until', '15 Dec 2026'], ['Stock confirmed', p.confirmed]]} />
                  <div className="field"><span>Quantity (kg)</span><div className="row-between"><Stepper value={20} label="Quantity in kg" /><b className="num">{naira(7000)}</b></div></div>
                </>}
            {delivery
              ? <Alert tone="info" icon="truck" title="Pickup or delivery">Collect at the farm gate in Issele-Uku, or get it delivered by a verified transporter. You see their price before you pay.</Alert>
              : <Alert tone="info" icon="pin" title="Pickup only for now">Farm gate, Issele-Uku · Mon–Sat 7am–5pm. Delivery arrives in version 2.</Alert>}
            {out ? <Btn block toast="We will tell you when it is back">Notify me when available</Btn> : <Btn block to="checkout">Buy now</Btn>}
            <div className="row"><Btn variant="secondary" className="grow" icon="share" modal="share-product">Share</Btn><Btn variant="secondary" className="grow" icon="chat" to="soon:v5">Message farmer</Btn></div>
            <hr className="divider" />
            <Clickable to="farm-storefront" className="row" style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left', flexWrap: 'nowrap' }}><span className="avatar">OF</span><div className="grow"><b>{f.name}</b><div className="xs muted">{f.place}</div></div><Verified /></Clickable>
          </aside>
        </div>
        <div className="card stack"><h3>About this product</h3><p className="small muted">Firm, deep-red Roma tomatoes for stews and sauces. Picked to order and sorted by size. Packed in reusable crates (crate deposit refunded on return).</p></div>
      </div></section>
    </PublicShell>
  );
}

export function Unavailable() {
  return (
    <PublicShell active="marketplace" url="/product/okafor-roma-tomatoes">
      <section className="section"><div className="wrap stack-lg">
        <Empty icon="clock" tone="warn" title="This listing is no longer available" actions={<><Btn to="farm-storefront">Visit Okafor Family Farm</Btn><Btn variant="secondary" to="marketplace">Browse similar produce</Btn></>}>
          The farmer has sold out or paused “Fresh tomatoes (Roma)”. The link you opened is still correct. Here is what you can do next.
        </Empty>
        <div><h3 style={{ marginBottom: 'var(--s-4)' }}>Other vegetables near Issele-Uku</h3><div className="pgrid">{[PRODUCTS[4], PRODUCTS[7], PRODUCTS[5]].map(p => <ProductCard key={p.id} p={p} />)}</div></div>
      </div></section>
    </PublicShell>
  );
}
