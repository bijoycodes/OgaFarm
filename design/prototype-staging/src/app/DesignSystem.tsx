import type { CSSProperties } from 'react';
import { Icon } from '@shared/ui/Icon';
import { Btn, Status, Verified, Alert, Empty, ProductCard, Timeline, Field, Chips, Skel, Badge } from '@shared/ui/ui';
import { PRODUCTS } from '@shared/data/sample';

const SWATCHES: [string, string][] = [
  ['Primary (earth green)', '--primary'], ['Primary soft', '--primary-soft'], ['Primary text', '--primary-ink'], ['Leaf (decor)', '--leaf'],
  ['Harvest gold', '--harvest-fill'], ['Harvest soft', '--harvest-soft'], ['Harvest text', '--harvest'],
  ['Ink', '--ink'], ['Muted', '--muted'], ['Background', '--bg'], ['Card', '--card'], ['Panel', '--band'], ['Line', '--line'],
  ['Success', '--ok'], ['Warning', '--warn'], ['Danger', '--danger'], ['Info', '--info']
];
const TYPE: [string, CSSProperties, string][] = [
  ['Display 48 · Lora', { fontSize: 'var(--fs-4xl)', fontFamily: 'var(--font-display)', fontWeight: 600 }, 'Fresh from the farm'],
  ['Heading 36 · Lora', { fontSize: 'var(--fs-3xl)', fontFamily: 'var(--font-display)', fontWeight: 600 }, 'Okafor Family Farm'],
  ['Heading 28 · Lora', { fontSize: 'var(--fs-2xl)', fontFamily: 'var(--font-display)', fontWeight: 600 }, 'Recent orders'],
  ['Body 16 · Nunito Sans', { fontSize: 'var(--fs-md)' }, 'Firm, deep-red Roma tomatoes for stews and sauces.'],
  ['Small 14', { fontSize: 'var(--fs-sm)' }, '2,000 kg available · Issele-Uku, Delta State'],
  ['Label 12', { fontSize: 'var(--fs-xs)', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' }, 'Stock confirmed']
];

export function DesignSystem() {
  return (
    <>
      <div className="idx-head stack">
        <div className="eyebrow">Shared by every version</div>
        <h1>OgaFarm design system</h1>
        <p className="muted" style={{ maxWidth: '64ch' }}>Built with the UI/UX Pro Max skill: <b>Organic Biophilic</b> style and the <b>Agriculture</b> palette (earth green and harvest gold), softened for a calm feel. Lora for headings, Nunito Sans for text and prices. Phosphor icons. Rounded 16–24 px corners, soft natural shadows, one gentle screen fade that turns off for people who prefer reduced motion. Every colour has a dark-mode pair and text pairs meet WCAG AA. Full notes: <code>design/prototype/DESIGN-SYSTEM.md</code>.</p>
      </div>
      <section className="idx-group stack-lg">
        <div className="stack"><h3>Colour</h3><div className="swatches">{SWATCHES.map(([n, v]) => <div key={v} className="swatch"><div style={{ background: `var(${v})` }} /><p><b>{n}</b><br /><span className="muted">{v}</span></p></div>)}</div></div>
        <div className="stack"><h3>Type</h3><div className="card">{TYPE.map(([l, s, t]) => <div key={l} className="type-row"><span className="xs">{l}</span><span style={s}>{t}</span></div>)}</div></div>
        <div className="g2">
          <div className="card stack"><h3>Buttons</h3>
            <div className="row"><Btn>Buy now</Btn><Btn variant="secondary">Share</Btn><Btn variant="soft">Message</Btn><Btn variant="ghost">View all</Btn></div>
            <div className="row"><Btn size="sm" variant="wheat">Highlight</Btn><Btn size="sm" variant="wa" icon="chat">WhatsApp</Btn><Btn size="sm" variant="danger">Cancel order</Btn><Btn size="sm" disabled>Disabled</Btn></div>
          </div>
          <div className="card stack"><h3>Badges and status</h3>
            <div className="row">{['Available now', 'Expected soon', 'Seasonal', 'Sold out', 'New', 'Preparing', 'Ready for pickup', 'Payment pending'].map(s => <Status key={s} s={s} />)}<Verified /><Verified yes={false} /></div>
            <Chips items={['All', 'Crops', 'Livestock']} />
          </div>
          <div className="card stack"><h3>Form fields</h3>
            <Field label="Product name"><input className="input" defaultValue="Fresh tomatoes (Roma)" /></Field>
            <Field label="Price per unit" hint="Buyers see this price."><div className="input-group"><span>₦</span><input className="input" defaultValue="350" /></div></Field>
            <Field label="Email address" error="Enter a full email address."><input className="input is-error" defaultValue="emeka.okafor@" /></Field>
            <label className="check"><input type="checkbox" defaultChecked />Verified farms only</label>
          </div>
          <div className="card stack"><h3>Alerts</h3>
            <Alert tone="ok" icon="check" title="Order confirmed">The farmer is preparing your order.</Alert>
            <Alert tone="warn" icon="clock" title="Confirm stock">Last confirmed 6 days ago.</Alert>
            <Alert tone="danger" icon="alert" title="Plan ended">Your storefront is hidden.</Alert>
            <Alert tone="info" icon="info" title="Pickup only for now">Delivery arrives in version 2.</Alert>
          </div>
          <div className="card stack"><h3>Product card</h3><div style={{ maxWidth: 260 }}><ProductCard p={PRODUCTS[0]} /></div></div>
          <div className="card stack"><h3>Order progress</h3><Timeline steps={[['Paid', '11:30 am'], ['Preparing'], ['Ready for pickup']]} done={1} /></div>
          <div className="card stack"><h3>Loading, empty and error</h3><Skel w="70%" /><Skel w="45%" />
            <Empty card={false} icon="box" title="No products yet" /><Empty card={false} icon="wifi" tone="danger" title="We could not load produce" /></div>
          <div className="card stack"><h3>Share sheet</h3><Btn variant="secondary" icon="share" modal="share-store" style={{ alignSelf: 'flex-start' }}>Open share sheet</Btn><p className="small muted">Copy link, WhatsApp and the phone's own share menu, with a preview of how the link looks in chat.</p><Badge tone="wheat" icon="tag">Phosphor icons, regular weight, 20 px</Badge><div className="row">{['home', 'store', 'box', 'receipt', 'bell', 'shield', 'truck', 'users'].map(i => <span key={i} className="ri"><Icon name={i} /></span>)}</div></div>
        </div>
      </section>
    </>
  );
}
