import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '../ui/Icon';
import { Btn, IconBtn, Clickable, Badge, ThemeToggle } from '../ui/ui';
import { useProto } from '@app/context';
import { RoleMenu } from './RoleMenu';

const ICON_SRC = './icon.png';

export const Logo = ({ to = 'landing' }: { to?: string }) =>
  <Clickable className="logo" to={to}><img src={ICON_SRC} alt="" />OgaFarm</Clickable>;

/* ---------------- public pages ---------------- */
const PUB_NAV: [string, string][] = [['marketplace', 'Browse produce'], ['soon:v3', 'Suppliers'], ['soon:v5', 'Jobs'], ['soon:v5', 'Markets'], ['pricing', 'Pricing']];
const NAV_ICON: Record<string, string> = { 'Browse produce': 'search', Suppliers: 'seed', Jobs: 'briefcase', Markets: 'pin', Pricing: 'tag' };

export function PublicShell({ active, url, noFooter, children }: { active?: string; url?: string; noFooter?: boolean; children: ReactNode }) {
  return (
    <>
      {url && <div className="urlbar"><Icon name="lock" />farmoga.com{url}</div>}
      <header className="pub-header">
        <Logo />
        <nav className="pub-nav" aria-label="Main">
          {PUB_NAV.map(([to, label]) => <Clickable key={label} to={to} current={to === active}>{label}</Clickable>)}
        </nav>
        <div className="pub-actions">
          <ThemeToggle />
          <Btn variant="ghost" className="hide-m" to="signin">Sign in</Btn>
          <Btn size="sm" to="signup">Get started</Btn>
          <MobileMenu active={active} />
        </div>
      </header>
      <main>{children}</main>
      {!noFooter && <Footer />}
    </>
  );
}

/* Mobile menu: a full-screen panel that slides in from the right. It covers the visible screen
   (the header is sticky, so the panel is anchored to it and sized to the screen height).
   Closes on a link, Escape or the X; the page behind does not scroll while it is open. */
function MobileMenu({ active }: { active?: string }) {
  const { go, version } = useProto();
  const [open, setOpen] = useState(false);
  const [h, setH] = useState<number>();
  const ref = useRef<HTMLSpanElement>(null);
  const v = Number(version.slice(1));
  useEffect(() => {
    if (!open) return;
    const scroller = (ref.current?.closest('#device') as HTMLElement | null) ?? document.documentElement;
    const prev = scroller.style.overflow;
    // Height = from the top of the (sticky) header to the bottom of the visible screen
    const size = () => {
      const top = (ref.current?.closest('.pub-header') as HTMLElement | null)?.getBoundingClientRect().top ?? 0;
      const bottom = scroller === document.documentElement ? window.innerHeight : scroller.getBoundingClientRect().top + scroller.clientTop + scroller.clientHeight;
      setH(Math.round(bottom - top));
    };
    size(); scroller.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey); window.addEventListener('resize', size);
    (ref.current?.querySelector('.mm-close') as HTMLElement | null)?.focus();
    return () => { scroller.style.overflow = prev; document.removeEventListener('keydown', onKey); window.removeEventListener('resize', size); };
  }, [open]);
  const close = () => { setOpen(false); setTimeout(() => (ref.current?.querySelector('.menu-toggle') as HTMLElement | null)?.focus(), 0); };
  const nav = (to: string) => { setOpen(false); go(to); };
  return (
    <span className="menu-btn" ref={ref}>
      <button type="button" className="icon-btn menu-toggle" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>
        <Icon name="menu" />
      </button>
      {open && (
        <div className="mm-panel" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" style={h ? { height: h } : undefined}>
          <div className="mm-head">
            <span className="logo"><img src={ICON_SRC} alt="" />OgaFarm</span>
            <button type="button" className="icon-btn mm-close" aria-label="Close menu" onClick={close}><Icon name="close" /></button>
          </div>
          <nav className="mm-body" aria-label="Main">
            {PUB_NAV.map(([to, label]) => {
              const soonV = to.startsWith('soon:') ? Number(to.slice(6)) : 0;
              return (
                <button key={label} type="button" className="mm-link" aria-current={to === active ? 'page' : undefined} onClick={() => nav(to)}>
                  <span className="mm-ic"><Icon name={NAV_ICON[label] ?? 'chev'} /></span><span className="grow">{label}</span>
                  {soonV > v ? <Badge>Coming in V{soonV}</Badge> : <Icon name="chev" className="mm-chev" />}
                </button>
              );
            })}
          </nav>
          <div className="mm-foot">
            <div className="mm-actions">
              <Btn variant="secondary" onClick={() => nav('signin')}>Sign in</Btn>
              <Btn onClick={() => nav('signup')}>Get started</Btn>
            </div>
            <p className="xs muted mm-note">Buyers join free. Farmers choose a plan.</p>
          </div>
        </div>
      )}
    </span>
  );
}

function Footer() {
  return (
    <footer className="pub-footer">
      <div className="stack"><div className="logo"><img src={ICON_SRC} alt="" />OgaFarm</div><p className="small" style={{ maxWidth: '32ch' }}>Your farm. Your market. Buy fresh produce, livestock and farm inputs directly from Nigerian farmers.</p></div>
      <div><h4>Buy</h4><a>Browse produce</a><a>Rescue produce</a><a>Group buying</a><a>Business buying</a></div>
      <div><h4>Sell</h4><a>Start selling</a><a>Pricing</a><a>Farm suppliers</a><a>Transporters</a></div>
      <div><h4>Help</h4><a>Support</a><a>Privacy</a><a>Terms</a><a>Local markets</a></div>
      <div className="fine">© 2026 OgaFarm · farmoga.com · Prices and stock are set and confirmed by each seller.</div>
    </footer>
  );
}

/* ---------------- signed-in app ---------------- */
/** `since`: first version that has this item (e.g. 'v2'). Earlier versions hide it. */
type NavItem = { to: string; icon: string; label: string; short?: string; count?: string; since?: string };
export type AppRole = 'farmer' | 'buyer' | 'admin' | 'transporter';
const NAV: Record<AppRole, NavItem[]> = {
  farmer: [
    { to: 'farmer-dashboard', icon: 'home', label: 'Dashboard', short: 'Home' },
    { to: 'storefront-editor', icon: 'store', label: 'My farm', short: 'Farm' },
    { to: 'farmer-listings', icon: 'box', label: 'Listings', short: 'Listings' },
    { to: 'farmer-orders', icon: 'receipt', label: 'Orders', short: 'Orders', count: '3' },
    { to: 'notifications', icon: 'bell', label: 'Notifications', short: 'Alerts' },
    { to: 'farmer-reviews', icon: 'star', label: 'Reviews', since: 'v2' },
    { to: 'subscription', icon: 'card', label: 'Subscription' }
  ],
  buyer: [
    { to: 'buyer-browse', icon: 'search', label: 'Browse', short: 'Browse' },
    { to: 'buyer-orders', icon: 'receipt', label: 'My orders', short: 'Orders' },
    { to: 'buyer-notifications', icon: 'bell', label: 'Notifications', short: 'Alerts' },
    { to: 'buyer-account', icon: 'user', label: 'Account', short: 'Account' }
  ],
  admin: [
    { to: 'admin-overview', icon: 'grid', label: 'Overview', short: 'Home' },
    { to: 'admin-verification', icon: 'shield', label: 'Verification', short: 'Verify', count: '7' },
    { to: 'admin-users', icon: 'users', label: 'Users', short: 'Users' },
    { to: 'admin-payments', icon: 'card', label: 'Payments', short: 'Payments' },
    { to: 'admin-transporters', icon: 'truck', label: 'Transporters', count: '3', since: 'v2' },
    { to: 'admin-disputes', icon: 'scales', label: 'Disputes', count: '2', since: 'v2' },
    { to: 'admin-reviews', icon: 'star', label: 'Reviews', since: 'v2' },
    { to: 'admin-audit', icon: 'list', label: 'Audit log', short: 'Audit' }
  ],
  transporter: [
    { to: 'transporter-dashboard', icon: 'home', label: 'Dashboard', short: 'Home' },
    { to: 'transporter-requests', icon: 'list', label: 'Delivery requests', short: 'Requests', count: '4' },
    { to: 'transporter-job', icon: 'truck', label: 'My jobs', short: 'Jobs' },
    { to: 'transporter-profile', icon: 'user', label: 'My profile', short: 'Profile' }
  ]
};
const WHO = {
  farmer: { n: 'Emeka Okafor', s: 'Okafor Family Farm', i: 'EO', notif: 'notifications' },
  buyer: { n: 'Ngozi Eze', s: 'Individual buyer · Asaba', i: 'NE', notif: 'buyer-notifications' },
  admin: { n: 'Aisha Bello', s: 'Verification reviewer', i: 'AB', notif: 'admin-verification' },
  transporter: { n: 'Sunday Ike', s: 'Ike Haulage · Pickup truck', i: 'SI', notif: 'transporter-requests' }
};

export function AppShell({ role, active, title, back, actions, children }:
  { role: AppRole; active: string; title: string; back?: string; actions?: ReactNode; children: ReactNode }) {
  const { version } = useProto();
  const vn = (v?: string) => Number((v ?? 'v1').slice(1));
  const items = NAV[role].filter(it => vn(it.since) <= vn(version)), who = WHO[role];
  return (
    <div className={`app ${role === 'admin' ? 'admin' : ''}`}>
      <aside className="sidebar">
        <Logo to={items[0].to} />
        {role === 'admin' && <span className="eyebrow" style={{ padding: '0 12px 8px' }}>Admin console</span>}
        {items.map(it => (
          <Clickable key={it.to} className="side-link" to={it.to} current={it.to === active}><Icon name={it.icon} />{it.label}{it.count && <span className="count">{it.count}</span>}</Clickable>
        ))}
        <div className="side-foot">
          {role === 'admin'
            ? <div className="row" style={{ gap: 10, flexWrap: 'nowrap' }}><span className="avatar">{who.i}</span><div className="grow"><b className="small">{who.n}</b><div className="xs muted">{who.s}</div></div></div>
            : <RoleMenu role={role} variant="side" />}
          {role === 'farmer' && <Badge tone="ok" icon="check">Annual plan · 8 months left</Badge>}
          {role === 'admin' && <Badge tone="info" icon="lock">Signed in with 2-step</Badge>}
          {role === 'transporter' && <Badge tone="ok" icon="shield">Verified transporter</Badge>}
        </div>
      </aside>
      <div className="main">
        <div className={`topbar ${role !== 'admin' && !back ? 'has-role' : ''}`}>
          {back ? <IconBtn icon="back" label="Back" to={back} /> : <img className="mobile-logo" src={ICON_SRC} alt="OgaFarm" />}
          <div className="title">{title}</div>
          <div className="acts">{actions}{role !== 'admin' && <span className="show-m"><RoleMenu role={role} variant="top" /></span>}<ThemeToggle /><IconBtn icon="bell" label="Notifications" dot to={who.notif} /></div>
        </div>
        <div className="page">{children}</div>
        <nav className="bottom-tabs" aria-label="App">
          {items.filter(i => i.short).map(it => (
            <Clickable key={it.to} to={it.to} current={it.to === active}><Icon name={it.icon} />{it.short}{it.count && <span className="dot" />}</Clickable>
          ))}
        </nav>
      </div>
    </div>
  );
}
