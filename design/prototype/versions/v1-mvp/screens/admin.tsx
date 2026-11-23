/* v1 · Admin console (minimum for the MVP): 2-step sign in, verification, users, payments, audit log */
import { Icon } from '@shared/ui/Icon';
import { useState } from 'react';
import { Btn, Clickable, Status, Alert, Empty, Field, Kv, Chips, Badge } from '@shared/ui/ui';
import { AppShell, Logo } from '@shared/layout/shells';
import { naira } from '@shared/data/sample';

const QUEUE: [string, string, string, string, string][] = [
  ['Okafor Family Farm', 'Emeka Okafor', 'Farmer · Issele-Uku', '2 h ago', 'Pending review'],
  ['Delta Poultry', 'Grace Ufuoma', 'Farmer · Agbor', '5 h ago', 'Pending review'],
  ['Asaba Grain Hub', 'Ibrahim Musa', 'Farmer · Asaba', 'Yesterday', 'More info needed'],
  ['Oghara Greens', 'Blessing Okoro', 'Farmer · Oghara', 'Yesterday', 'Pending review'],
  ['Ughelli Fish Farm', 'Ese Oghene', 'Farmer · Ughelli', '21 Nov', 'Approved']
];

export function AdminLogin({ state }: { state: string }) {
  const code = state === '2-step code';
  const [show, setShow] = useState(false);
  return (
    <div className="auth" style={{ minHeight: 700 }}>
      <form className="card stack-lg" onSubmit={e => e.preventDefault()}>
        <Logo to="admin-login" />
        <div><div className="eyebrow">Admin console</div><h2>{code ? 'Enter your 2-step code' : 'Staff sign in'}</h2><p className="small muted">{code ? 'Open your authenticator app and enter the 6-digit code for OgaFarm Admin.' : 'For OgaFarm staff only. Every action is recorded.'}</p></div>
        {code ? <>
          <div className="code-boxes">{'731904'.split('').map((d, i) => <input key={i} defaultValue={i < 3 ? d : ''} aria-label={`Digit ${i + 1}`} inputMode="numeric" maxLength={1} />)}</div>
          <Btn block to="admin-overview">Verify and sign in</Btn>
        </> : <>
          <Field label="Work email" required><input className="input" type="email" autoComplete="username" defaultValue="aisha.bello@farmoga.com" required /></Field>
          <Field label="Password" required><div className="input-group"><input className="input" type={show ? 'text' : 'password'} autoComplete="current-password" defaultValue="prototype" required /><button type="button" className="icon-btn" aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} onClick={() => setShow(v => !v)}><Icon name={show ? 'eyeOff' : 'eye'} /></button></div></Field>
          <Btn block state="2-step code">Continue</Btn>
        </>}
        <p className="xs muted row" style={{ gap: 6, flexWrap: 'nowrap' }}><Icon name="lock" />2-step sign in is required for every admin account.</p>
      </form>
    </div>
  );
}

export function AdminOverview() {
  return (
    <AppShell role="admin" active="admin-overview" title="Overview">
      <div><h1>Good morning, Aisha</h1><p className="muted">What needs attention today.</p></div>
      <div className="g4">
        <div className="card card-tight stat"><span className="si gold"><Icon name="shield" /></span><span className="l">Waiting for verification</span><span className="v">7</span><span className="xs muted">Oldest: 26 hours</span></div>
        <div className="card card-tight stat"><span className="si"><Icon name="users" /></span><span className="l">Active paid farmers</span><span className="v">148</span><span className="xs muted">+12 this week</span></div>
        <div className="card card-tight stat"><span className="si"><Icon name="receipt" /></span><span className="l">Orders today</span><span className="v">36</span><span className="xs muted">{naira(612400)} paid</span></div>
        <div className="card card-tight stat"><span className="si gold"><Icon name="alert" /></span><span className="l">Payment mismatches</span><span className="v">1</span><span className="xs muted">Needs finance review</span></div>
      </div>
      <div className="split">
        <div className="card stack"><div className="row-between"><h3>Verification queue</h3><Btn variant="ghost" size="sm" to="admin-verification">Open queue</Btn></div>
          <div className="list">{QUEUE.slice(0, 3).map(([farm, person, role, when, s]) => (
            <Clickable key={farm} className="list-row" to="admin-review"><span className="avatar">{farm.split(' ').map(w => w[0]).join('').slice(0, 2)}</span><div className="grow"><div className="t">{farm}</div><div className="xs muted">{person} · {role}</div></div><div style={{ textAlign: 'right' }}><Status s={s} /><div className="xs muted">{when}</div></div></Clickable>
          ))}</div>
        </div>
        <div className="card stack"><h3>Alerts</h3>
          <Alert tone="warn" icon="card" title="Payment mismatch">OGF-SUB-88190: provider says ₦54,000, plan is ₦95,000. Plan not activated.</Alert>
          <Alert tone="info" icon="clock" title="12 listings with stale stock">Not confirmed for more than 7 days.</Alert>
        </div>
      </div>
    </AppShell>
  );
}

export function AdminVerification({ state }: { state: string }) {
  return (
    <AppShell role="admin" active="admin-verification" title="Verification">
      <div className="row-between"><div><h1>Verification queue</h1><p className="muted">Oldest first. Aim to review within 1 working day.</p></div></div>
      <Chips items={['Pending (4)', 'More info needed (1)', 'Approved', 'Rejected']} />
      {state === 'empty' ? <Empty icon="shield" tone="ok" title="Queue is clear">No farms are waiting for review.</Empty> :
        <div className="table-wrap"><table>
          <thead><tr><th>Farm</th><th>Owner</th><th>Type and place</th><th>Submitted</th><th>Status</th><th /></tr></thead>
          <tbody>{QUEUE.map(([farm, person, role, when, s]) => (
            <tr key={farm}><td><b>{farm}</b></td><td>{person}</td><td className="muted">{role}</td><td>{when}</td><td><Status s={s} /></td><td><Btn size="sm" variant="secondary" to="admin-review">Review</Btn></td></tr>
          ))}</tbody>
        </table></div>}
    </AppShell>
  );
}

export function AdminReview({ state }: { state: string }) {
  const decided = state === 'approved';
  return (
    <AppShell role="admin" active="admin-verification" title="Review farm" back="admin-verification">
      <div className="row-between"><div><div className="row" style={{ gap: 8 }}><h1 style={{ fontSize: 'var(--fs-2xl)' }}>Okafor Family Farm</h1><Status s={decided ? 'Approved' : 'Pending review'} /></div><p className="small muted">Submitted 23 Nov 2026, 9:14 am · Annual plan active</p></div></div>
      {decided && <Alert tone="ok" icon="check" title="Approved by you at 11:02 am">Emeka has been notified. The Verified badge now shows on the storefront.</Alert>}
      <div className="split">
        <div className="stack-lg">
          <div className="card stack"><h3>Documents</h3>
            <div className="g2">
              <div className="stack" style={{ gap: 6 }}><div className="doc-preview"><Icon name="doc" /></div><div className="row-between small"><span>National ID (NIN slip)</span><Btn size="sm" variant="ghost" icon="eye" toast="Opens the document through a 10-minute private link">View</Btn></div></div>
              <div className="stack" style={{ gap: 6 }}><div className="ph crop" style={{ aspectRatio: '3/2' }}><Icon name="image" /></div><div className="row-between small"><span>Farm photo</span><Btn size="sm" variant="ghost" icon="eye" toast="Opens the photo through a 10-minute private link">View</Btn></div></div>
            </div>
            <p className="xs muted row" style={{ gap: 6, flexWrap: 'nowrap' }}><Icon name="lock" />Documents open through short-lived private links. Viewing is recorded in the audit log.</p>
          </div>
          <div className="card stack"><h3>Checks</h3>
            <ul className="checklist">
              <li className="done"><span className="ck"><Icon name="check" /></span>Email address verified by code</li>
              <li className="done"><span className="ck"><Icon name="check" /></span>Name on ID matches the account name</li>
              <li><span className="ck" /><div className="grow">Farm address looks real <span className="xs muted">(Aniocha North, Delta)</span></div></li>
              <li><span className="ck" /><div className="grow">Farm photo matches the farm type</div></li>
            </ul>
          </div>
        </div>
        <aside className="card stack">
          <h3>Applicant</h3>
          <Kv rows={[['Name', 'Emeka Okafor'], ['Email', 'emeka.okafor@example.com'], ['Phone', '+234 803 123 4567'], ['Farm type', 'Mixed farm'], ['Location', 'Issele-Uku, Delta'], ['Plan', 'Annual · paid']]} />
          <hr className="divider" />
          {decided ? <Btn block variant="secondary" toast="Opens the change-decision form with a required reason">Change decision</Btn> : <>
            <Btn block state="approved">Approve and verify</Btn>
            <Btn block variant="secondary" toast="Opens a message asking the farmer for more information">Ask for more information</Btn>
            <Field label="Reason (required to reject)"><textarea className="textarea" placeholder="For example: the name on the ID does not match the account." /></Field>
            <Btn block variant="danger" toast="Rejected with reason. The farmer is notified.">Reject</Btn>
          </>}
        </aside>
      </div>
    </AppShell>
  );
}

export function AdminUsers() {
  const rows: [string, string, string, string, string][] = [
    ['Emeka Okafor', 'Farmer', 'Annual · until 23 Nov 2027', 'Verified', 'Active'],
    ['Ngozi Eze', 'Individual buyer', 'Free', '—', 'Active'],
    ['FreshMart Foods', 'Business buyer', 'Free', '—', 'Active'],
    ['Grace Ufuoma', 'Farmer', 'Half-yearly · until 2 Mar 2027', 'Pending', 'Active'],
    ['Musa Danjuma', 'Farmer', 'Quarterly · ended 20 Nov 2026', 'Verified', 'Expired']
  ];
  return (
    <AppShell role="admin" active="admin-users" title="Users">
      <h1>Users</h1>
      <div className="input-group"><span><Icon name="search" /></span><input className="input" placeholder="Search by name, email or farm" aria-label="Search users" /></div>
      <Chips items={['All', 'Farmers', 'Buyers', 'Expired plans', 'Paused']} />
      <div className="table-wrap"><table>
        <thead><tr><th>Name</th><th>Role</th><th>Plan</th><th>Verification</th><th>Account</th><th /></tr></thead>
        <tbody>{rows.map(([n, r, p, v, a]) => (
          <tr key={n}><td><b>{n}</b></td><td>{r}</td><td className="muted">{p}</td><td>{v === '—' ? <span className="muted">—</span> : <Status s={v === 'Verified' ? 'Approved' : 'Pending review'} />}</td><td><Status s={a} /></td><td><Btn size="sm" variant="ghost" toast={`${n}: profile, orders and audit history open`}>Open</Btn></td></tr>
        ))}</tbody>
      </table></div>
    </AppShell>
  );
}

export function AdminPayments() {
  const rows: [string, string, string, number, string, string][] = [
    ['23 Nov, 11:42', 'OGF-SUB-88213', 'Emeka Okafor · Annual plan', 95000, 'Paid', 'Matched'],
    ['23 Nov, 11:31', 'OGF-10421', 'Order · Ngozi Eze → Okafor Family Farm', 7000, 'Paid', 'Matched'],
    ['23 Nov, 10:05', 'OGF-SUB-88190', 'Blessing Okoro · Annual plan', 54000, 'Payment pending', 'Amount mismatch'],
    ['22 Nov, 16:20', 'OGF-10377', 'Order · Tunde Bakare → Okafor Family Farm', 18000, 'Refunded', 'Matched']
  ];
  return (
    <AppShell role="admin" active="admin-payments" title="Payments">
      <h1>Payments and subscriptions</h1>
      <div className="g3">
        <div className="card card-tight stat"><span className="si"><Icon name="coins" /></span><span className="l">Confirmed today</span><span className="v">{naira(707400)}</span><span className="xs muted">41 payments</span></div>
        <div className="card card-tight stat"><span className="si gold"><Icon name="clock" /></span><span className="l">Waiting for provider</span><span className="v">2</span><span className="xs muted">Not activated yet</span></div>
        <div className="card card-tight stat"><span className="si gold"><Icon name="alert" /></span><span className="l">Mismatches</span><span className="v">1</span><span className="xs muted">Plan not activated</span></div>
      </div>
      <Alert tone="info" icon="info">Plans and orders switch on only after the payment provider confirms the payment. The provider's record and ours are compared every day.</Alert>
      <div className="table-wrap"><table>
        <thead><tr><th>Time</th><th>Reference</th><th>What</th><th className="num">Amount</th><th>Status</th><th>Daily check</th></tr></thead>
        <tbody>{rows.map(([t, ref, w, a, s, c]) => (
          <tr key={ref}><td>{t}</td><td><b>{ref}</b></td><td className="muted">{w}</td><td className="num">{naira(a)}</td><td><Status s={s} /></td><td>{c === 'Matched' ? <Badge tone="ok" icon="check">Matched</Badge> : <Badge tone="warn" icon="alert">{c}</Badge>}</td></tr>
        ))}</tbody>
      </table></div>
    </AppShell>
  );
}

export function AdminAudit() {
  const rows: [string, string, string, string][] = [
    ['23 Nov, 11:02', 'Aisha Bello', 'Approved verification', 'Okafor Family Farm'],
    ['23 Nov, 10:58', 'Aisha Bello', 'Viewed document (NIN slip)', 'Okafor Family Farm'],
    ['23 Nov, 10:40', 'Chidi Nwosu', 'Flagged payment mismatch', 'OGF-SUB-88190'],
    ['22 Nov, 17:15', 'Aisha Bello', 'Asked for more information', 'Asaba Grain Hub'],
    ['22 Nov, 09:03', 'System', 'Plan expired, listings hidden', 'Musa Danjuma']
  ];
  return (
    <AppShell role="admin" active="admin-audit" title="Audit log">
      <div><h1>Audit log</h1><p className="muted">Every admin and system action. Entries cannot be edited or deleted.</p></div>
      <div className="table-wrap"><table>
        <thead><tr><th>When</th><th>Who</th><th>Action</th><th>On</th></tr></thead>
        <tbody>{rows.map(([w, who, a, on]) => <tr key={w + a}><td className="num">{w}</td><td>{who}</td><td>{a}</td><td className="muted">{on}</td></tr>)}</tbody>
      </table></div>
    </AppShell>
  );
}
