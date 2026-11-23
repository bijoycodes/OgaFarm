import type { ReactNode } from 'react';
import { Icon } from '../ui/Icon';
import { Btn, IconBtn, Clickable, Badge, ThemeToggle } from '../ui/ui';

const ICON_SRC = './icon.png';

export const Logo = ({ to = 'landing' }: { to?: string }) =>
  <Clickable className="logo" to={to}><img src={ICON_SRC} alt="" />OgaFarm</Clickable>;

/* ---------------- public pages ---------------- */
const PUB_NAV: [string, string][] = [['marketplace', 'Browse produce'], ['soon:v3', 'Suppliers'], ['soon:v5', 'Jobs'], ['soon:v5', 'Markets'], ['pricing', 'Pricing']];

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
          <span className="menu-btn"><IconBtn icon="menu" label="Menu" toast="Menu: Browse, Suppliers, Jobs, Markets, Pricing, Sign in" /></span>
        </div>
      </header>
      <main>{children}</main>
      {!noFooter && <Footer />}
    </>
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
type NavItem = { to: string; icon: string; label: string; short?: string; count?: string };
const NAV: Record<'farmer' | 'buyer' | 'admin', NavItem[]> = {
  farmer: [
    { to: 'farmer-dashboard', icon: 'home', label: 'Dashboard', short: 'Home' },
    { to: 'storefront-editor', icon: 'store', label: 'My farm', short: 'Farm' },
    { to: 'farmer-listings', icon: 'box', label: 'Listings', short: 'Listings' },
    { to: 'farmer-orders', icon: 'receipt', label: 'Orders', short: 'Orders', count: '3' },
    { to: 'notifications', icon: 'bell', label: 'Notifications', short: 'Alerts' },
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
    { to: 'admin-audit', icon: 'list', label: 'Audit log', short: 'Audit' }
  ]
};
const WHO = {
  farmer: { n: 'Emeka Okafor', s: 'Okafor Family Farm', i: 'EO', notif: 'notifications' },
  buyer: { n: 'Ngozi Eze', s: 'Individual buyer · Asaba', i: 'NE', notif: 'buyer-notifications' },
  admin: { n: 'Aisha Bello', s: 'Verification reviewer', i: 'AB', notif: 'admin-verification' }
};

export function AppShell({ role, active, title, back, actions, children }:
  { role: 'farmer' | 'buyer' | 'admin'; active: string; title: string; back?: string; actions?: ReactNode; children: ReactNode }) {
  const items = NAV[role], who = WHO[role];
  return (
    <div className={`app ${role === 'admin' ? 'admin' : ''}`}>
      <aside className="sidebar">
        <Logo to={items[0].to} />
        {role === 'admin' && <span className="eyebrow" style={{ padding: '0 12px 8px' }}>Admin console</span>}
        {items.map(it => (
          <Clickable key={it.to} className="side-link" to={it.to} current={it.to === active}><Icon name={it.icon} />{it.label}{it.count && <span className="count">{it.count}</span>}</Clickable>
        ))}
        <div className="side-foot">
          <div className="row" style={{ gap: 10, flexWrap: 'nowrap' }}><span className="avatar">{who.i}</span><div className="grow"><b className="small">{who.n}</b><div className="xs muted">{who.s}</div></div></div>
          {role === 'farmer' && <Badge tone="ok" icon="check">Annual plan · 8 months left</Badge>}
          {role === 'admin' && <Badge tone="info" icon="lock">Signed in with 2-step</Badge>}
        </div>
      </aside>
      <div className="main">
        <div className="topbar">
          {back ? <IconBtn icon="back" label="Back" to={back} /> : <img className="mobile-logo" src={ICON_SRC} alt="OgaFarm" />}
          <div className="title">{title}</div>
          <div className="acts">{actions}<ThemeToggle /><IconBtn icon="bell" label="Notifications" dot to={who.notif} /></div>
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
