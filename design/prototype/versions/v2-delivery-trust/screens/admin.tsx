/* v2 · Admin: transporter verification, dispute cases, review moderation and investigations */
import { Icon } from '@shared/ui/Icon';
import { Btn, Status, Alert, Empty, Field, Kv, Chips, Badge, Timeline, TableWrap } from '@shared/ui/ui';
import { AppShell } from '@shared/layout/shells';
import { naira } from '@shared/data/sample';
import { TRANSPORTERS, DELIVERY as D, Rating } from '../parts';

const T = TRANSPORTERS.ike;

/* ---------- Transporter verification queue ---------- */
const TQUEUE: [string, string, string, string, string][] = [
  ['Ike Haulage', 'Sunday Ike', 'Pickup truck · 1,500 kg · Issele-Uku', '3 h ago', 'Pending review'],
  ['Warri Movers', 'Kelvin Ejiro', 'Small truck · 5,000 kg · Warri', '6 h ago', 'Pending review'],
  ['Ofili Keke', 'Joy Ofili', 'Keke · 300 kg · Asaba', 'Yesterday', 'More info needed'],
  ['Agbor Cold Van', 'Peter Nwachukwu', 'Refrigerated van · 2,000 kg · Agbor', '20 Nov', 'Approved']
];
export function AdminTransporters({ state }: { state: string }) {
  return (
    <AppShell role="admin" active="admin-transporters" title="Transporters">
      <div><h1>Transporter verification</h1><p className="muted">Only approved transporters can quote or be assigned to a delivery.</p></div>
      <Chips items={['Pending (2)', 'More info needed (1)', 'Approved', 'Rejected']} />
      {state === 'empty' ? <Empty icon="truck" tone="ok" title="Queue is clear">No transporters are waiting for review.</Empty> :
        <TableWrap><table>
          <thead><tr><th>Transporter</th><th>Person</th><th>Vehicle and base</th><th>Submitted</th><th>Status</th><th /></tr></thead>
          <tbody>{TQUEUE.map(([n, p, v, w, s]) => (
            <tr key={n}><td><b>{n}</b></td><td>{p}</td><td className="muted">{v}</td><td>{w}</td><td><Status s={s} /></td><td><Btn size="sm" variant="secondary" to="admin-transporter-review">Review</Btn></td></tr>
          ))}</tbody>
        </table></TableWrap>}
    </AppShell>
  );
}

/* ---------- Review one transporter ---------- */
export function AdminTransporterReview({ state }: { state: string }) {
  const ok = state === 'approved';
  return (
    <AppShell role="admin" active="admin-transporters" title="Review transporter" back="admin-transporters">
      <div><div className="row" style={{ gap: 8 }}><h1 style={{ fontSize: 'var(--fs-2xl)' }}>{T.name}</h1><Status s={ok ? 'Approved' : 'Pending review'} /></div><p className="small muted">Submitted today, 8:40 am · {T.vehicle} · {T.base}</p></div>
      {ok && <Alert tone="ok" icon="check" title="Approved by you at 11:20 am">Sunday has been notified. He can now quote for deliveries and appears as Verified.</Alert>}
      <div className="split">
        <div className="stack-lg">
          <div className="card stack"><h3>Documents</h3>
            <div className="g3">
              {[["Driver's licence", 'doc'], ['Utility bill (Oct 2026)', 'doc'], ['Vehicle photo', 'image']].map(([n, ic]) => (
                <div key={n} className="stack" style={{ gap: 6 }}><div className="doc-preview"><Icon name={ic} /></div><div className="row-between small"><span>{n}</span><Btn size="sm" variant="ghost" icon="eye" toast="Opens through a 10-minute private link">View</Btn></div></div>
              ))}
            </div>
            <p className="xs muted row" style={{ gap: 6, flexWrap: 'nowrap' }}><Icon name="lock" />Every document view is recorded in the audit log.</p>
          </div>
          <div className="card stack"><h3>Checks</h3>
            <ul className="checklist">
              <li className="done"><span className="ck"><Icon name="check" /></span>Email address verified by code</li>
              <li className="done"><span className="ck"><Icon name="check" /></span><div className="grow">Name on licence matches: <b style={{ display: 'inline' }}>Sunday Ikechukwu Ike</b></div></li>
              <li className={ok ? 'done' : ''}><span className="ck">{ok && <Icon name="check" />}</span><div className="grow">Utility bill address is in the operating area <span className="xs muted">(Issele-Uku)</span></div></li>
              <li className={ok ? 'done' : ''}><span className="ck">{ok && <Icon name="check" />}</span><div className="grow">Plate {T.plate} visible on the vehicle photo</div></li>
              <li className={ok ? 'done' : ''}><span className="ck">{ok && <Icon name="check" />}</span><div className="grow">Declared load ({T.payload}, {T.bags}) is realistic for a pickup truck</div></li>
            </ul>
          </div>
        </div>
        <aside className="card stack"><h3>Applicant</h3>
          <Kv rows={[['Name on ID', 'Sunday Ikechukwu Ike'], ['Shown as', T.name], ['Phone', '+234 802 441 9087'], ['Vehicle', `${T.vehicle} · ${T.plate}`], ['Max load', T.payload], ['Areas', T.areas.join(', ')]]} />
          <hr className="divider" />
          {ok ? <Btn block variant="secondary" toast="Opens the change-decision form with a required reason">Change decision</Btn> : <>
            <Btn block state="approved">Approve transporter</Btn>
            <Btn block variant="secondary" toast="Sends a message asking for a clearer utility bill">Ask for more information</Btn>
            <Field label="Reason (required to reject)"><textarea className="textarea" placeholder="For example: the name on the licence does not match." /></Field>
            <Btn block variant="danger" toast="Rejected with reason. The transporter is notified.">Reject</Btn>
          </>}
        </aside>
      </div>
    </AppShell>
  );
}

/* ---------- Disputes ---------- */
const CASES: [string, string, string, string, string, string][] = [
  ['DSP-2031', 'Quantity shortfall', `${D.id} · tomatoes`, 'Ngozi Eze → Okafor Family Farm, Ike Haulage', '1 day', 'Under review'],
  ['DSP-2027', 'Damage or spoilage', 'OGF-10433 · layer eggs', 'FreshMart Foods → Delta Poultry, Tega Express', '2 days', 'Waiting for reply'],
  ['DSP-2019', 'Late delivery', 'OGF-10398 · catfish', 'Mama Put Kitchen → Ughelli Fish Farm, Agbor Cold Van', 'Closed 21 Nov', 'Resolved']
];
export function AdminDisputes({ state }: { state: string }) {
  return (
    <AppShell role="admin" active="admin-disputes" title="Disputes">
      <div><h1>Disputes</h1><p className="muted">Orders with an open dispute never close on their own.</p></div>
      <Chips items={['Open (2)', 'Resolved', 'All']} />
      {state === 'empty' ? <Empty icon="scales" tone="ok" title="No open disputes">New cases from buyers, farmers and transporters appear here.</Empty> :
        <TableWrap><table>
          <thead><tr><th>Case</th><th>Problem</th><th>Order</th><th>Parties</th><th>Age</th><th>Status</th><th /></tr></thead>
          <tbody>{CASES.map(([id, p, o, who, age, s]) => (
            <tr key={id}><td><b>{id}</b></td><td>{p}</td><td className="muted">{o}</td><td className="muted">{who}</td><td>{age}</td><td><Status s={s} /></td><td><Btn size="sm" variant="secondary" to="admin-dispute-case">Open</Btn></td></tr>
          ))}</tbody>
        </table></TableWrap>}
    </AppShell>
  );
}

export function AdminDisputeCase({ state }: { state: string }) {
  const done = state === 'decided';
  const steps: [string, string?][] = [['Reported by buyer', '24 Nov, 3:20 pm'], ['Farmer replied', '4:40 pm'], ['Transporter replied', '5:05 pm'], ['Decision', done ? '25 Nov, 10:15 am' : '']];
  return (
    <AppShell role="admin" active="admin-disputes" title="DSP-2031" back="admin-disputes">
      <div><div className="row" style={{ gap: 8 }}><h1 style={{ fontSize: 'var(--fs-2xl)' }}>Quantity shortfall</h1><Status s={done ? 'Resolved' : 'Under review'} /></div><p className="small muted">Case DSP-2031 · order {D.id} · {D.item}, {D.qty} ordered</p></div>
      {done && <Alert tone="ok" icon="check" title={`Decided: refund ${naira(2800)} to the buyer`}>All three parties were notified. The decision and the reason are in the audit log.</Alert>}
      <div className="split">
        <div className="stack-lg">
          <div className="card stack"><h3>Evidence</h3>
            <TableWrap><table>
              <thead><tr><th>Step</th><th>Who</th><th className="num">Quantity</th><th>Proof</th></tr></thead>
              <tbody>
                <tr><td>Loaded at farm</td><td>Farmer + driver</td><td className="num">60 kg</td><td><Badge tone="ok" icon="camera">Scale photo</Badge></td></tr>
                <tr><td>Pickup confirmed</td><td>Driver</td><td className="num">60 kg</td><td><Badge tone="ok" icon="camera">Load photo</Badge></td></tr>
                <tr><td>Received</td><td>Buyer</td><td className="num"><b>52 kg</b></td><td><Badge tone="warn" icon="camera">3 photos</Badge></td></tr>
              </tbody>
            </table></TableWrap>
            <Alert tone="info" icon="info">Both sides agree 60 kg left the farm. The driver says one basket tipped in transit.</Alert>
          </div>
          <div className="card stack"><h3>Statements</h3>
            <div className="thread">
              <div className="msg"><div className="who">Ngozi Eze, buyer</div><div className="small">Received 52 kg instead of 60 kg. Third basket was half full.</div></div>
              <div className="msg"><div className="who">Emeka Okafor, farmer</div><div className="small">We loaded 3 full baskets, 60 kg. Photo of the scale attached.</div></div>
              <div className="msg"><div className="who">Sunday Ike, transporter</div><div className="small">I confirmed 60 kg at pickup. One basket tipped on the Ibusa road.</div></div>
            </div>
          </div>
        </div>
        <aside className="stack-lg">
          <div className="card stack"><h3>Decision</h3>{done ? (
            <Kv rows={[['Outcome', 'Partial refund'], ['Amount', naira(2800)], ['Reason', 'Loss happened in transit'], ['By', 'Aisha Bello']]} />
          ) : <>
            {['Full refund', 'Partial refund', 'No refund'].map((o, i) => <label key={o} className="check"><input type="radio" name="out" defaultChecked={i === 1} />{o}</label>)}
            <Field label="Refund amount"><div className="input-group"><span>₦</span><input className="input num" defaultValue="2,800" inputMode="numeric" /></div></Field>
            <Field label="Reason (shared with all parties)" required><textarea className="textarea" defaultValue="Pickup proof shows 60 kg and drop-off shows 52 kg, so the loss happened in transit." required /></Field>
            <Btn block state="decided">Save decision</Btn>
            <Btn block variant="secondary" toast="Asks a party for more information and pauses the case">Ask for more information</Btn>
          </>}</div>
          <div className="card stack"><h3>Timeline</h3><Timeline steps={steps} done={done ? 4 : 3} /></div>
        </aside>
      </div>
    </AppShell>
  );
}

/* ---------- Review moderation and investigations ---------- */
export function AdminReviews({ state }: { state: string }) {
  const inv = state === 'investigations';
  const pending: [string, string, number, string, string][] = [
    ['Ngozi Eze', 'Okafor Family Farm', 5, 'Very fresh tomatoes, well packed.', D.id],
    ['Ngozi Eze', 'Ike Haulage (delivery)', 4, 'Arrived early. One basket tipped over, but it was sorted out.', D.id],
    ['Femi Adeyemi', 'Delta Poultry', 2, 'Two eggs cracked in each crate. Call me on 0803 555 1122.', 'OGF-10433']
  ];
  return (
    <AppShell role="admin" active="admin-reviews" title="Reviews">
      <div><h1>Reviews</h1><p className="muted">Every review is checked before it is published. A review is never removed just for being negative.</p></div>
      <div className="chips"><button type="button" className="chip" aria-pressed={!inv}>Waiting for checks (3)</button><button type="button" className="chip" aria-pressed={inv}>Investigations (1)</button><button type="button" className="chip" aria-pressed={false}>Published</button><button type="button" className="chip" aria-pressed={false}>Removed</button></div>
      {inv ? (
        <div className="card stack">
          <div className="row-between"><div><b>Case RV-118</b> <span className="xs muted">· requested by Okafor Family Farm · today</span></div><Status s="Investigation requested" /></div>
          <div className="card card-tight stack" style={{ background: 'var(--sunken)' }}><div className="row-between"><b className="small">Chuka Obi · 17 Nov</b><Rating value={1} /></div><p className="small">"Terrible farm, never buy from them. They are thieves."</p><div className="xs muted">Order OGF-10322 · collected 16 Nov · real order</div></div>
          <Kv rows={[['Reason given', 'Abusive or insulting'], ["Farmer's note", 'Order was collected in full; calling us thieves is not true.']]} />
          <Field label="Decision reason (required, kept in the audit log)" required><textarea className="textarea" defaultValue="Accusation of theft with no evidence breaks the review rules." required /></Field>
          <div className="row"><Btn variant="secondary" toast="Review kept. Both sides are told why.">Keep review</Btn><Btn variant="danger" toast="Review removed from public view. A restricted record is kept.">Remove from public view</Btn></div>
        </div>
      ) : (
        <div className="stack">{pending.map(([who, on, r, text, order], i) => (
          <div key={i} className="card stack">
            <div className="row-between"><div><b className="small">{who}</b> <span className="xs muted">on {on}</span></div><Rating value={r} /></div>
            <p className="small">"{text}"</p>
            <div className="row" style={{ gap: 8 }}><Badge tone="ok" icon="seal">Order {order} delivered</Badge>{i === 2 && <Badge tone="warn" icon="alert">Contains a phone number</Badge>}</div>
            <div className="row">{i === 2
              ? <><Btn variant="secondary" toast="Phone number hidden. Review published.">Hide number and publish</Btn><Btn variant="ghost" toast="Opens the reject form with a reason">Reject</Btn></>
              : <><Btn toast="Published">Publish</Btn><Btn variant="ghost" toast="Opens the reject form with a reason">Reject</Btn></>}</div>
          </div>
        ))}</div>
      )}
    </AppShell>
  );
}
