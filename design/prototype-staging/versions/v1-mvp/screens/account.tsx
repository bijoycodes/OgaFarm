/* v1 · Add another role. Sign-up creates one role; more are added here (business rules BR-ACC-01, 02, 06). */
import { useState } from 'react';
import { Icon } from '@shared/ui/Icon';
import { Btn, Alert, Badge } from '@shared/ui/ui';
import { AppShell } from '@shared/layout/shells';
import { accountFor, ROLE_INFO } from '@shared/layout/RoleMenu';
import { useProto } from '@app/context';
import { ROLE_CATALOG } from '@shared/data/roles';

/* Same list as sign-up: src/shared/data/roles.ts */
const OPTIONS = ROLE_CATALOG;

export function AddRole({ state }: { state: string }) {
  const { version, setState, go, toast } = useProto();
  const v = Number(version.slice(1));
  const acct = accountFor('buyer');
  const held = acct.roles as string[];
  const [pick, setPick] = useState(() => OPTIONS.find(o => !held.includes(o.key) && o.since <= v)?.key ?? 'farmer');
  const chosen = OPTIONS.find(o => o.key === pick)!;
  const add = () => {
    if (chosen.key === 'farmer') setState('farmer added');
    else if (chosen.key === 'buyer') { toast('Buyer role added. Switch to it from the role menu.'); go('buyer-account'); }
    else if (chosen.next) go(chosen.next);
  };

  if (state === 'farmer added') return (
    <AppShell role="buyer" active="buyer-account" title="Add a role" back="add-role@choose">
      <div className="card stack-lg" style={{ maxWidth: 640 }}>
        <div className="row" style={{ gap: 14, flexWrap: 'nowrap' }}><span className="si-big"><Icon name="leaf" /></span><div><h2>Farmer role added</h2><p className="small muted">Finish these steps to open your storefront. Your buyer orders and messages stay under Buyer.</p></div></div>
        <ul className="checklist">
          <li className="done"><span className="ck"><Icon name="check" /></span><div className="grow">Email address verified <span className="xs muted">(already done for your account)</span></div></li>
          <li><span className="ck" /><div className="grow">Choose a farmer plan</div></li>
          <li><span className="ck" /><div className="grow">Verify your ID and farm <span className="xs muted">(your ID is checked once and reused for any later role)</span></div></li>
          <li><span className="ck" /><div className="grow">Set up your storefront</div></li>
        </ul>
        <Btn block to="choose-plan">Choose a plan</Btn>
        <Btn block variant="ghost" to="buyer-browse">Do it later</Btn>
        <p className="xs muted">You can switch between Buyer and Farmer any time from the role menu.</p>
      </div>
    </AppShell>
  );

  return (
    <AppShell role="buyer" active="buyer-account" title="Add a role" back="buyer-account">
      <div><h1>Add a role</h1><p className="muted">Use one account for everything you do on OgaFarm. Your current {held.length > 1 ? 'roles' : 'role'}: <b>{held.map(r => ROLE_INFO[r as keyof typeof ROLE_INFO]?.label).join(', ')}</b>.</p></div>
      <div className="role-pick" role="radiogroup" aria-label="Choose a role to add">
        {OPTIONS.map(o => {
          const has = held.includes(o.key), soon = o.since > v;
          return (
            <button key={o.key} type="button" role="radio" aria-checked={pick === o.key} disabled={has || soon} className="rp-card" onClick={() => setPick(o.key)}>
              <span className="rp-top"><span className="rp-ic"><Icon name={o.icon} /></span>
                {has ? <Badge tone="ok" icon="check">You have this</Badge> : soon ? <Badge>Coming in V{o.since}</Badge> : <Badge tone={o.price === 'Free' ? 'ok' : 'wheat'}>{o.price}</Badge>}
              </span>
              <b>{o.label}</b>
              <span className="small muted">{o.what}</span>
              <span className="rp-needs"><Icon name="info" />{o.needs}</span>
            </button>
          );
        })}
      </div>
      <Alert tone="info" icon="info">Adding a role never changes the plan of another role. Each role keeps its own orders, listings and notifications, and you switch between them from the role menu.</Alert>
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <Btn variant="ghost" to="buyer-account">Cancel</Btn>
        <Btn onClick={add}>Add {chosen.label.toLowerCase()} role</Btn>
      </div>
    </AppShell>
  );
}
