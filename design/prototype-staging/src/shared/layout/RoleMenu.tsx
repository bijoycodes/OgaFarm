/* Role menu: shows the active role, switches between the roles an account holds, and opens "Add another role".
   Sign-up creates one role; more roles are added later (business rules BR-ACC-01…05). */
import { useEffect, useRef, useState } from 'react';
import { Icon } from '../ui/Icon';
import { useProto } from '@app/context';

export type MarketRole = 'farmer' | 'buyer' | 'transporter';

export const ROLE_INFO: Record<MarketRole, { label: string; icon: string; home: string; notif: string }> = {
  farmer: { label: 'Farmer', icon: 'leaf', home: 'farmer-dashboard', notif: 'notifications' },
  buyer: { label: 'Buyer', icon: 'sack', home: 'buyer-browse', notif: 'buyer-notifications' },
  transporter: { label: 'Transporter', icon: 'truck', home: 'transporter-dashboard', notif: 'transporter-requests' }
};

/** Sample accounts. Each holds one or more roles; `sub` is the line shown under the name for that role. */
export const ACCOUNTS = {
  emeka: { n: 'Emeka Okafor', i: 'EO', roles: ['farmer', 'buyer'] as MarketRole[], sub: { farmer: 'Okafor Family Farm', buyer: 'Buyer · Issele-Uku' } as Partial<Record<MarketRole, string>>, unread: { buyer: 1 } as Partial<Record<MarketRole, number>> },
  ngozi: { n: 'Ngozi Eze', i: 'NE', roles: ['buyer'] as MarketRole[], sub: { buyer: 'Individual buyer · Asaba' } as Partial<Record<MarketRole, string>>, unread: {} as Partial<Record<MarketRole, number>> },
  sunday: { n: 'Sunday Ike', i: 'SI', roles: ['transporter', 'buyer'] as MarketRole[], sub: { transporter: 'Ike Haulage · Pickup truck', buyer: 'Buyer · Issele-Uku' } as Partial<Record<MarketRole, string>>, unread: {} as Partial<Record<MarketRole, number>> }
};
type AccountKey = keyof typeof ACCOUNTS;
const DEFAULT: Record<MarketRole, AccountKey> = { farmer: 'emeka', buyer: 'ngozi', transporter: 'sunday' };
const KEY = 'oga-account';
const read = () => { try { return sessionStorage.getItem(KEY) as AccountKey | null; } catch { return null; } };
const write = (k: AccountKey) => { try { sessionStorage.setItem(KEY, k); } catch { /* storage blocked */ } };

/** The account shown for a role: the one the user switched from (if it holds this role), else the role's sample account. */
export function accountFor(role: MarketRole) {
  const k = read();
  const key = k && ACCOUNTS[k]?.roles.includes(role) ? k : DEFAULT[role];
  return { key, ...ACCOUNTS[key] };
}

export function RoleMenu({ role, variant }: { role: MarketRole; variant: 'side' | 'top' }) {
  const { go, toast, version } = useProto();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const acct = accountFor(role);
  const roles = acct.roles.filter(r => r !== 'transporter' || Number(version.slice(1)) >= 2);
  const info = ROLE_INFO[role];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); (ref.current?.querySelector('.rm-trigger') as HTMLElement | null)?.focus(); } };
    document.addEventListener('mousedown', onDoc); document.addEventListener('keydown', onKey);
    (ref.current?.querySelector('.rm-item') as HTMLElement | null)?.focus();
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const switchTo = (r: MarketRole) => {
    setOpen(false);
    if (r === role) return;
    write(acct.key); go(ROLE_INFO[r].home); toast(`Switched to ${ROLE_INFO[r].label}`);
  };

  return (
    <div className={`role-menu rm-${variant}`} ref={ref}>
      <button type="button" className="rm-trigger" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(o => !o)}
        aria-label={`Current role: ${info.label}. Switch or add a role`}>
        {variant === 'side' ? <>
          <span className="avatar">{acct.i}</span>
          <span className="grow rm-who"><b className="small">{acct.n}</b><span className="rm-role"><Icon name={info.icon} />{info.label}{roles.length > 1 && <span className="xs muted"> · {roles.length} roles</span>}</span></span>
          <Icon name="chev" className="rm-caret" />
        </> : <>
          <Icon name={info.icon} /><span>{info.label}</span><Icon name="chev" className="rm-caret" />
          {roles.some(r => r !== role && acct.unread[r]) && <span className="dot" />}
        </>}
      </button>
      {open && (
        <div className="rm-pop" role="menu" aria-label="Your roles">
          <div className="rm-head"><span className="eyebrow">Switch role</span><span className="xs muted">{acct.n}</span></div>
          {roles.map(r => (
            <button key={r} type="button" role="menuitemradio" aria-checked={r === role} className="rm-item" onClick={() => switchTo(r)}>
              <span className="rm-ic"><Icon name={ROLE_INFO[r].icon} /></span>
              <span className="grow"><b className="small">{ROLE_INFO[r].label}</b><span className="xs muted">{acct.sub[r]}</span></span>
              {!!acct.unread[r] && r !== role && <span className="rm-badge" aria-label={`${acct.unread[r]} unread`}>{acct.unread[r]}</span>}
              {r === role && <Icon name="check" className="rm-check" />}
            </button>
          ))}
          <div className="rm-sep" />
          <button type="button" role="menuitem" className="rm-item rm-add" onClick={() => { setOpen(false); write(acct.key); go('add-role'); }}>
            <span className="rm-ic"><Icon name="plus" /></span><span className="grow"><b className="small">Add another role</b><span className="xs muted">Buyer, transporter, farmer and more</span></span>
          </button>
          <button type="button" role="menuitem" className="rm-item rm-plain" onClick={() => { setOpen(false); toast('Account settings open'); }}><Icon name="user" />Account settings</button>
          <button type="button" role="menuitem" className="rm-item rm-plain" onClick={() => { setOpen(false); toast('Signed out'); }}><Icon name="logout" />Sign out</button>
        </div>
      )}
    </div>
  );
}
