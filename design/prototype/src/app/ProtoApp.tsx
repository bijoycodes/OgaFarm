import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ProtoContext, type Proto, type Theme } from './context';
import { DesignSystem } from './DesignSystem';
import { VERSIONS } from '../../versions';
import type { ScreenDef, VersionDef, Role } from '@shared/registry';
import { ShareSheet, StockModal } from '@shared/blocks';
import { Icon } from '@shared/ui/Icon';

const ROLE_HOME: Partial<Record<Role, string>> = { visitor: 'landing', farmer: 'farmer-dashboard', buyer: 'buyer-browse', admin: 'admin-login', transporter: 'transporter-dashboard' };
const ROLE_LABEL: Record<Role, string> = { visitor: 'Visitor', farmer: 'Farmer', buyer: 'Buyer', admin: 'Admin', supplier: 'Supplier', transporter: 'Transporter', jobseeker: 'Job seeker', consultant: 'Consultant' };
const FUTURE_ROLES: [Role, string][] = [['transporter', 'v2'], ['supplier', 'v3'], ['jobseeker', 'v5'], ['consultant', 'v5']];

const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } }
};

/** Screens visible in a version: everything built up to and including it; later versions override earlier screens with the same id. */
function screensFor(versionId: string) {
  const map = new Map<string, ScreenDef & { version: string }>();
  for (const v of VERSIONS) {
    if (v.status === 'built') v.screens.forEach(s => map.set(s.id, { ...s, version: v.id }));
    if (v.id === versionId) break;
  }
  return map;
}

const MODALS: Record<string, () => ReactNode> = {
  'share-store': () => <ShareSheet what="your storefront" url="/farm/okafor-family-farm" preview="Okafor Family Farm · OgaFarm" />,
  'share-product': () => <ShareSheet what="this product" url="/product/okafor-roma-tomatoes" preview="Fresh tomatoes (Roma) · ₦350/kg" />,
  'stock': () => <StockModal />
};

const THEMES: [Theme, string, string][] = [['system', 'monitor', 'Match device'], ['light', 'sun', 'Light'], ['dark', 'moon', 'Dark']];

export function ProtoApp() {
  const built = VERSIONS.filter(v => v.status === 'built');
  const [versionId, setVersionId] = useState(() => { const s = store.get('oga-version'); return built.some(v => v.id === s) ? s! : built[built.length - 1].id; });
  const [device, setDevice] = useState<'mobile' | 'desktop'>(() => store.get('oga-device') === 'mobile' ? 'mobile' : 'desktop');
  const [theme, setTheme] = useState<Theme>(() => { const t = store.get('oga-theme'); return t === 'light' || t === 'dark' ? t : 'system'; });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', theme);
    store.set('oga-theme', theme);
  }, [theme]);
  const [screenId, setScreenId] = useState(() => location.hash.slice(1) || 'index');
  const [states, setStates] = useState<Record<string, string>>({});
  const [modal, setModal] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const screens = useMemo(() => screensFor(versionId), [versionId]);
  const version = VERSIONS.find(v => v.id === versionId)!;

  useEffect(() => {
    const onHash = () => setScreenId(location.hash.slice(1) || 'index');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => { if (!toastMsg) return; const t = setTimeout(() => setToastMsg(null), 2600); return () => clearTimeout(t); }, [toastMsg]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  const firstRender = useRef(true);
  useEffect(() => {
    const dev = document.getElementById('device');
    dev?.scrollTo({ top: 0 });
    if (window.scrollY > 80) window.scrollTo({ top: 0 });
    // move focus to the new screen for keyboard and screen-reader users (not on first load)
    if (firstRender.current) { firstRender.current = false; return; }
    dev?.focus({ preventScroll: true });
  }, [screenId]);
  useEffect(() => { if (modal) (document.querySelector('.modal button, .modal input') as HTMLElement | null)?.focus(); }, [modal]);

  const go = useCallback((raw: string) => {
    // "screen@state" opens a screen in a given state (used for flows, e.g. "order-status@delivered")
    const [id, st] = raw.split('@');
    if (st) setStates(prev => ({ ...prev, [id.startsWith('soon:') ? id.split(':')[2] : id]: st }));
    if (id.startsWith('soon:')) {
      const [, vid, target] = id.split(':');
      if (target && screens.has(target)) { if (location.hash.slice(1) === target) setScreenId(target); else location.hash = target; return; }
      const v = VERSIONS.find(x => x.id === vid);
      setToastMsg(v ? `Coming in ${v.id.toUpperCase()} · ${v.name}` : 'Coming in a later version');
      return;
    }
    if (!['index', 'design-system'].includes(id) && !screens.has(id)) { setToastMsg('This screen is designed in a later version'); return; }
    if (location.hash.slice(1) === id) setScreenId(id); else location.hash = id;
  }, [screens]);

  const current = screens.get(screenId);
  const stateList = current?.states;
  const curState = stateList ? (states[screenId] && stateList.includes(states[screenId]) ? states[screenId] : stateList[0]) : 'default';

  const proto: Proto = {
    go, toast: setToastMsg, openModal: setModal, closeModal: () => setModal(null),
    setState: s => setStates(prev => ({ ...prev, [screenId]: s })),
    version: versionId, theme, setTheme
  };

  const groups = useMemo(() => {
    const g = new Map<string, (ScreenDef & { version: string })[]>();
    screens.forEach(s => { if (!g.has(s.group)) g.set(s.group, []); g.get(s.group)!.push(s); });
    return g;
  }, [screens]);

  let body: ReactNode;
  if (screenId === 'design-system') body = <DesignSystem />;
  else if (current) { const C = current.Component; body = <C state={curState} />; }
  else body = <IndexPage version={version} groups={groups} onVersion={setVersionId} />;

  const title = screenId === 'design-system' ? 'Design system' : current ? current.title : 'All screens';
  const meta = current ? `${current.spec} · ${ROLE_LABEL[current.role ?? 'visitor']} · added in ${current.version.toUpperCase()}` : `Version ${version.id.toUpperCase()} · ${version.name}`;

  return (
    <ProtoContext.Provider value={proto}>
      <a className="skip-link" href="#device" onClick={e => { e.preventDefault(); document.getElementById('device')?.focus(); }}>Skip to the screen</a>
      <div className="proto-bar" role="toolbar" aria-label="Prototype controls">
        <div className="brand"><img src="./icon.png" alt="" />OgaFarm <small>Prototype · sample data</small></div>
        <button type="button" className="plain" onClick={() => go('index')}>All screens</button>
        <label>Version
          <select value={versionId} onChange={e => { setVersionId(e.target.value); store.set('oga-version', e.target.value); }}>
            {VERSIONS.map(v => <option key={v.id} value={v.id} disabled={v.status !== 'built'}>{v.id.toUpperCase()} · {v.name}{v.status !== 'built' ? ' (planned)' : ''}</option>)}
          </select>
        </label>
        <label>Screen
          <select value={current ? screenId : ''} onChange={e => go(e.target.value)}>
            <option value="" disabled>Choose a screen</option>
            {[...groups].map(([g, items]) => <optgroup key={g} label={g}>{items.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</optgroup>)}
          </select>
        </label>
        <label>Role
          <select value={current?.role ?? 'visitor'} onChange={e => { const h = ROLE_HOME[e.target.value as Role]; if (h) go(h); }}>
            {(['visitor', 'farmer', 'buyer', 'admin'] as Role[]).map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
            {FUTURE_ROLES.map(([r, v]) => { const ready = !!ROLE_HOME[r] && screens.has(ROLE_HOME[r]!); return <option key={r} value={r} disabled={!ready}>{ROLE_LABEL[r]}{ready ? '' : ` (${v.toUpperCase()})`}</option>; })}
          </select>
        </label>
        <div className="seg" role="group" aria-label="Device">
          {(['mobile', 'desktop'] as const).map(d => <button key={d} type="button" aria-pressed={device === d} onClick={() => { setDevice(d); store.set('oga-device', d); }}>{d === 'mobile' ? 'Mobile' : 'Desktop'}</button>)}
        </div>
        <div className="seg theme-seg" role="group" aria-label="Colour theme">
          {THEMES.map(([t, ic, label]) => <button key={t} type="button" aria-pressed={theme === t} title={label} onClick={() => setTheme(t)}><Icon name={ic} /><span className="sr-only">{label}</span></button>)}
        </div>
      </div>

      <div className="proto-meta">
        <p className="spec"><b>{title}</b> · {meta}</p>
        {stateList && <div className="state-pills" aria-label="Screen states">{stateList.map(s => <button key={s} type="button" aria-pressed={s === curState} onClick={() => proto.setState(s)}>{s[0].toUpperCase() + s.slice(1)}</button>)}</div>}
      </div>

      <div id="device" tabIndex={-1} aria-label={`Screen: ${title}`} className={`device ${device === 'mobile' ? 'is-mobile' : ''}`}><div key={screenId + curState} className="screen-enter">{body}</div></div>

      {modal && MODALS[modal] && (
        <div className="modal-back" onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="modal" role="dialog" aria-modal="true" aria-label="Dialog">{MODALS[modal]()}</div>
        </div>
      )}
      <div aria-live="polite" className="sr">{toastMsg ?? ''}</div>
      {toastMsg && <div className="toast" aria-hidden="true"><Icon name="check" />{toastMsg}</div>}
    </ProtoContext.Provider>
  );
}

function IndexPage({ version, groups, onVersion }: { version: VersionDef; groups: Map<string, (ScreenDef & { version: string })[]>; onVersion: (id: string) => void }) {
  return (
    <>
      <div className="idx-head stack">
        <div className="eyebrow">OgaFarm clickable prototype · sample data only</div>
        <h1>Design versions</h1>
        <p className="muted" style={{ maxWidth: '64ch' }}>Each version matches one release on the roadmap. Pick a version to see every screen that exists at that point. Use the toolbar to switch between mobile and desktop, change the role, and see each screen's other states.</p>
      </div>
      <section className="idx-group">
        <div className="idx-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {VERSIONS.map(v => (
            <div key={v.id} className={`ver-card ${v.id === version.id ? 'is-current' : ''}`}>
              <div className="row-between"><b>{v.id.toUpperCase()} · {v.name}</b>{v.status === 'built' ? <span className="badge b-ok">Built</span> : <span className="badge b-neutral">Planned</span>}</div>
              <p className="small muted">{v.summary}</p>
              <div className="xs muted">Roadmap {v.increment} · folder <code>versions/{v.folder}</code></div>
              {v.status === 'built'
                ? <button type="button" className="btn btn-soft btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => onVersion(v.id)}>{v.id === version.id ? 'Showing below' : 'Show this version'}</button>
                : <details className="small"><summary style={{ cursor: 'pointer', color: 'var(--primary-ink)' }}>{v.planned.length} planned screens</summary><ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>{v.planned.map(p => <li key={p}>{p}</li>)}</ul></details>}
            </div>
          ))}
        </div>
      </section>
      <div className="idx-head stack" style={{ paddingTop: 'var(--s-4)' }}>
        <div className="row"><h2>{version.id.toUpperCase()} screens</h2><span className="badge b-neutral">{[...groups.values()].reduce((n, g) => n + g.length, 0)} screens</span></div>
        <div className="row"><a className="btn btn-primary" href="#landing">Start at the landing page</a><a className="btn btn-secondary" href="#design-system">Design system</a></div>
      </div>
      {[...groups].map(([g, items]) => (
        <section key={g} className="idx-group stack">
          <h3>{g}</h3>
          <div className="idx-grid">{items.map(s => (
            <a key={s.id} className="idx-item" href={`#${s.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="t">{s.title}</span>
              <span className="xs muted">{s.spec}{s.states ? ` · ${s.states.length} states` : ''}</span>
              {s.status === 'updated' && <span className="badge b-info" style={{ alignSelf: 'flex-start' }}><Icon name="edit" />Updated in {s.version.toUpperCase()}</span>}
            </a>
          ))}</div>
        </section>
      ))}
    </>
  );
}
