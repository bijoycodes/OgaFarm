import type { ReactNode, CSSProperties } from 'react';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useProto } from '@app/context';
import { Icon } from './Icon';
import { FARMS, naira, type Product } from '../data/sample';

/** Anything clickable in the prototype: navigates, shows a toast, opens a modal or switches state. */
interface ActionProps { to?: string; toast?: string; modal?: string; state?: string; close?: boolean; onClick?: () => void }
function useAction({ to, toast, modal, state, close, onClick }: ActionProps) {
  const p = useProto();
  return () => {
    onClick?.();
    if (close) p.closeModal();
    if (state) p.setState(state);
    if (modal) p.openModal(modal);
    if (toast) p.toast(toast);
    if (to) { p.closeModal(); p.go(to); }
  };
}

type Variant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'wheat' | 'danger' | 'wa';
export function Btn({ children, variant = 'primary', size, block, icon, disabled, className = '', style, label, ...action }:
  ActionProps & { children?: ReactNode; variant?: Variant; size?: 'sm'; block?: boolean; icon?: string; disabled?: boolean; className?: string; style?: CSSProperties; label?: string }) {
  const run = useAction(action);
  return (
    <button type="button" className={`btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${block ? 'btn-block' : ''} ${className}`} style={style} disabled={disabled} aria-label={label} onClick={run}>
      {icon && <Icon name={icon} />}{children}
    </button>
  );
}
export function IconBtn({ icon, label, dot, ...action }: ActionProps & { icon: string; label: string; dot?: boolean }) {
  const run = useAction(action);
  return <button type="button" className="icon-btn" aria-label={label} onClick={run}><Icon name={icon} />{dot && <span className="dot" />}</button>;
}
export function Clickable({ children, className = '', style, current, label, ...action }: ActionProps & { children: ReactNode; className?: string; style?: CSSProperties; current?: boolean; label?: string }) {
  const run = useAction(action);
  return <button type="button" className={className} style={style} aria-current={current ? 'page' : undefined} aria-label={label} onClick={run}>{children}</button>;
}

const STATUS: Record<string, string> = {
  'New': 'b-wheat', 'Preparing': 'b-info', 'Ready for pickup': 'b-ok', 'Collected': 'b-neutral', 'Cancelled': 'b-danger',
  'Available now': 'b-ok', 'Recurring supply': 'b-ok', 'Expected soon': 'b-info', 'Seasonal': 'b-neutral', 'Sold out': 'b-danger',
  'Paid': 'b-ok', 'Payment pending': 'b-warn', 'Refunded': 'b-neutral', 'Draft': 'b-neutral', 'Hidden': 'b-danger',
  'Pending review': 'b-warn', 'Approved': 'b-ok', 'Rejected': 'b-danger', 'More info needed': 'b-info', 'Active': 'b-ok', 'Expired': 'b-danger', 'Expiring': 'b-warn',
  'Waiting for quotes': 'b-warn', 'Quote sent': 'b-info', 'Quoted': 'b-info', 'Assigned': 'b-info', 'Picked up': 'b-info', 'In transit': 'b-info', 'Delivered': 'b-ok',
  'Inspecting': 'b-warn', 'Issue reported': 'b-danger', 'Dispute open': 'b-danger', 'Under review': 'b-warn', 'Resolved': 'b-ok', 'Waiting for reply': 'b-warn',
  'Published': 'b-ok', 'Pending moderation': 'b-warn', 'Investigation requested': 'b-warn', 'Kept': 'b-neutral', 'Removed': 'b-danger', 'Open': 'b-ok', 'Closed': 'b-neutral'
};
export const Badge = ({ tone = 'neutral', icon, children }: { tone?: 'ok' | 'warn' | 'danger' | 'info' | 'neutral' | 'wheat'; icon?: string; children: ReactNode }) =>
  <span className={`badge b-${tone}`}>{icon && <Icon name={icon} />}{children}</span>;
export const Status = ({ s }: { s: string }) => <span className={`badge ${STATUS[s] ?? 'b-neutral'}`}>{s}</span>;
export const Verified = ({ yes = true }: { yes?: boolean }) => yes ? <Badge tone="ok" icon="shield">Verified</Badge> : <Badge icon="clock">Not yet verified</Badge>;

export function Alert({ tone, icon, title, children, action }: { tone: 'ok' | 'warn' | 'danger' | 'info'; icon: string; title?: string; children?: ReactNode; action?: ReactNode }) {
  return <div className={`alert alert-${tone}`} role={tone === 'danger' ? 'alert' : undefined}><Icon name={icon} /><div className="alert-body">{title && <b>{title}</b>}{children}</div>{action}</div>;
}
export const Proposal = ({ n, children }: { n: number; children: ReactNode }) =>
  <div className="proposal"><b>Proposed change #{n} (awaiting client approval):</b> {children}</div>;

export function Empty({ icon, tone, title, children, actions, card = true }: { icon: string; tone?: 'warn' | 'danger' | 'ok'; title: string; children?: ReactNode; actions?: ReactNode; card?: boolean }) {
  return (
    <div className={`${card ? 'card ' : ''}empty`}>
      <span className={`em-ic ${tone ?? ''}`}><Icon name={icon} /></span>
      <h3>{title}</h3>
      {children && <p className="small muted" style={{ maxWidth: '44ch' }}>{children}</p>}
      {actions && <div className="row" style={{ justifyContent: 'center' }}>{actions}</div>}
    </div>
  );
}
export const Skel = ({ h = 14, w = '100%', r }: { h?: number | string; w?: number | string; r?: number }) => <div className="skel" style={{ height: h, width: w, borderRadius: r }} />;

export const Photo = ({ p, tag, pos }: { p: Pick<Product, 'kind' | 'icon' | 'name' | 'img'>; tag?: ReactNode; pos?: string }) =>
  <div className={`ph ${p.kind} ${p.img ? 'has-img' : ''}`}>
    {p.img ? <img src={p.img} alt={p.name} loading="lazy" decoding="async" style={pos ? { objectPosition: pos } : undefined}
      ref={el => { if (el?.complete) el.classList.add('is-loaded'); }} onLoad={e => e.currentTarget.classList.add('is-loaded')} /> : <><Icon name={p.icon} /><span className="sr">Photo of {p.name}</span></>}
    {tag && <span className="tag">{tag}</span>}
  </div>;

export function ProductCard({ p, to = 'product' }: { p: Product; to?: string }) {
  const f = FARMS[p.farm];
  return (
    <Clickable className="pcard" to={to}>
      <Photo p={p} tag={p.status !== 'Available now' ? <Status s={p.status} /> : undefined} />
      <div className="body">
        <div className="name">{p.name}</div>
        <div className="price num">{naira(p.price)} <small>/ {p.unit}</small></div>
        <div className="meta">
          <span><Icon name="box" />{p.qty} available</span>
          <span><Icon name="pin" />{f.place}</span>
          <span><Icon name="clock" />Stock confirmed {p.confirmed.toLowerCase()}</span>
        </div>
        <div className="seller"><span className="small" style={{ fontWeight: 700 }}>{f.name}</span>{f.verified && <Verified />}</div>
      </div>
    </Clickable>
  );
}

export function Stepper({ value, label }: { value: number; label: string }) {
  return <div className="stepper"><button type="button" aria-label="Less">−</button><input defaultValue={value} aria-label={label} inputMode="numeric" /><button type="button" aria-label="More">+</button></div>;
}
export function Tabs({ items, active = 0 }: { items: string[]; active?: number }) {
  return <div className="tabs" role="tablist">{items.map((t, i) => <button key={t} type="button" className="tab" role="tab" aria-selected={i === active}>{t}</button>)}</div>;
}
export function Chips({ items, active = 0 }: { items: string[]; active?: number }) {
  return <div className="chips">{items.map((c, i) => <button key={c} type="button" className="chip" aria-pressed={i === active}>{c}</button>)}</div>;
}
export function Timeline({ steps, done }: { steps: [string, string?][]; done: number }) {
  return (
    <ol className="timeline">
      {steps.map(([t, when], i) => (
        <li key={t} className={i < done ? 'done' : i === done ? 'now' : ''}>
          <span className="node">{i < done && <Icon name="check" />}</span>
          <div><div className="t">{t}</div><div className="xs muted">{when || (i === done ? 'Next step' : '')}</div></div>
        </li>
      ))}
    </ol>
  );
}
export const Steps = ({ n, of }: { n: number; of: number }) =>
  <div className="steps">{Array.from({ length: of }, (_, i) => <span key={i} className={i < n ? 'on' : ''} />)}</div>;
/** Visible label, optional required marker, helper text below, and a specific error below the field. */
export function Field({ label, hint, error, children, full, required }: { label: ReactNode; hint?: ReactNode; error?: string; children: ReactNode; full?: boolean; required?: boolean }) {
  return (
    <label className={`field ${full ? 'full' : ''}`}>
      <span>{label}{required && <span className="req" aria-hidden="true">*</span>}{required && <span className="sr"> (required)</span>}</span>
      {children}
      {error ? <span className="err" role="alert"><Icon name="alert" />{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </label>
  );
}
export const Upload = ({ icon = 'upload', title = 'Tap to upload', note }: { icon?: string; title?: string; note: string }) =>
  <div className="upload"><Icon name={icon} /><b>{title}</b><span className="xs">{note}</span></div>;
export const LinkBox = ({ url, toast = 'Link copied' }: { url: string; toast?: string }) =>
  <div className="linkbox"><code>{url}</code><Btn size="sm" variant="soft" icon="copy" toast={toast}>Copy</Btn></div>;
export const Kv = ({ rows }: { rows: [ReactNode, ReactNode][] }) =>
  <dl className="kv">{rows.map(([k, v], i) => <div key={i} style={{ display: 'contents' }}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;

/* Day / night switch shown inside the product (public header and signed-in top bar).
   Until the user taps it, the app follows the device setting. */
export function ThemeToggle() {
  const { theme, setTheme } = useProto();
  const [deviceDark, setDeviceDark] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const on = (e: MediaQueryListEvent) => setDeviceDark(e.matches);
    mq.addEventListener('change', on); return () => mq.removeEventListener('change', on);
  }, []);
  const dark = theme === 'dark' || (theme === 'system' && deviceDark);
  const label = dark ? 'Switch to day mode' : 'Switch to night mode';
  return (
    <button type="button" className="icon-btn theme-toggle" aria-label={label} title={label} onClick={() => setTheme(dark ? 'light' : 'dark')}>
      <Icon name={dark ? 'sun' : 'moon'} />
    </button>
  );
}

/** Table wrapper: scrolls on desktop; on phones each row becomes a card. It copies each column
    heading onto its cells (data-label) so the card can show "Owner: Emeka Okafor". */
export function TableWrap({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const table = ref.current?.querySelector('table'); if (!table) return;
    const heads = [...table.querySelectorAll('thead th')].map(th => th.textContent?.trim() ?? '');
    table.querySelectorAll('tbody tr').forEach(tr => [...tr.children].forEach((td, i) => { if (heads[i]) td.setAttribute('data-label', heads[i]); }));
  });
  return <div ref={ref} className="table-wrap cards-m">{children}</div>;
}

/** On/off switch (role="switch"). Full card is the tap target; state is announced as on/off. */
export function Switch({ label, on = false, onText, offText, disabled, onChange }:
  { label: string; on?: boolean; onText?: ReactNode; offText?: ReactNode; disabled?: boolean; onChange?: (v: boolean) => void }) {
  const [v, setV] = useState(on);
  useEffect(() => setV(on), [on]);
  return (
    <button type="button" role="switch" aria-checked={v} disabled={disabled} className={`switch-card ${v ? 'is-on' : ''}`}
      onClick={() => { setV(!v); onChange?.(!v); }}>
      <span className="sw-dot" aria-hidden="true" />
      <span className="sw-text"><b>{label}</b>{(v ? onText : offText) && <span className="xs muted">{v ? onText : offText}</span>}</span>
      <span className="sw-track" aria-hidden="true"><span className="sw-thumb" /></span>
    </button>
  );
}

/** Password with show/hide. `strength` shows a 4-step meter and the rule for new passwords. */
export function PasswordInput({ defaultValue = '', autoComplete, strength, id, invalid }:
  { defaultValue?: string; autoComplete: 'current-password' | 'new-password'; strength?: boolean; id?: string; invalid?: boolean }) {
  const [show, setShow] = useState(false);
  const [val, setVal] = useState(defaultValue);
  const score = [val.length >= 8, /[a-z]/i.test(val) && /\d/.test(val), val.length >= 12, /[^a-z0-9]/i.test(val)].filter(Boolean).length;
  const words = ['Too short', 'Weak', 'Okay', 'Good', 'Strong'];
  return (
    <>
      <div className={`input-group pw-group ${invalid ? 'is-error' : ''}`}>
        <input id={id} className="input" type={show ? 'text' : 'password'} autoComplete={autoComplete} value={val} onChange={e => setVal(e.target.value)} required aria-invalid={invalid || undefined} />
        <button type="button" className="icon-btn" aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} onClick={e => { e.preventDefault(); setShow(v => !v); }}><Icon name={show ? 'eyeOff' : 'eye'} /></button>
      </div>
      {strength && (
        <span className="pw-meter" aria-live="polite">
          <span className="pw-bars" aria-hidden="true">{[1, 2, 3, 4].map(i => <span key={i} className={i <= score ? `on s${score}` : ''} />)}</span>
          <span className="xs"><b>{val ? words[score] : ' '}</b>{val && ' · '}<span className="muted">At least 8 characters, with letters and numbers.</span></span>
        </span>
      )}
    </>
  );
}
