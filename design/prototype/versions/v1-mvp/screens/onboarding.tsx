/* v1 · Sign up, email code check, sign in, plan, payment and verification */
import { PhoneInput } from '@shared/ui/PhoneInput';
import type { ReactNode } from 'react';
import { Icon } from '@shared/ui/Icon';
import { useState } from 'react';
import { useProto } from '@app/context';
import { RolePicker } from '@shared/ui/RolePicker';
import { roleDef, type RoleKey } from '@shared/data/roles';
import { Btn, Clickable, Alert, Proposal, Field, Upload, Steps, Kv, Badge, PasswordInput } from '@shared/ui/ui';
import { PublicShell } from '@shared/layout/shells';
import { Plans } from '@shared/blocks';
import { naira } from '@shared/data/sample';

/* Sign-up creates one role (BR-ACC-01). The choice decides where the email-code step continues. */
const signupRole = (): RoleKey => { try { return (sessionStorage.getItem('oga-signup-role') as RoleKey) || 'buyer'; } catch { return 'buyer'; } };
const setSignupRole = (r: RoleKey) => { try { sessionStorage.setItem('oga-signup-role', r); } catch { /* storage blocked */ } };

const Auth = ({ children }: { children: ReactNode }) => <PublicShell noFooter><div className="auth">{children}</div></PublicShell>;
const linkStyle = { background: 'none', border: 0, padding: '10px 4px', margin: '-10px 0', color: 'var(--primary-ink)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 700 } as const;

export function Signup({ state }: { state: string }) {
  const bad = state === 'error';
  const v = Number(useProto().version.slice(1));
  const [role, setRole] = useState<RoleKey>(() => { const r = signupRole(); return roleDef(r).since <= v ? r : 'buyer'; });
  return (
    <Auth>
      <form className="card stack-lg" onSubmit={e => e.preventDefault()}>
        <div><h2>Create your account</h2><p className="small muted">Takes about a minute. We email you a code once, to confirm your address.</p></div>
        {bad && <div className="error-summary" role="alert" tabIndex={-1}><h3>There is a problem</h3><a href="#signup-email" onClick={e => { e.preventDefault(); document.getElementById('signup-email')?.focus(); }}>Enter a full email address</a></div>}
        <RolePicker value={role} version={v} onChange={k => { setRole(k); setSignupRole(k); }} />
        <Field label="Full name" required><input className="input" defaultValue="Emeka Okafor" autoComplete="name" required /></Field>
        <Field label="Email address" required error={bad ? 'Enter a full email address, for example emeka@example.com.' : undefined}>
          <input className={`input ${bad ? 'is-error' : ''}`} type="email" id="signup-email" defaultValue={bad ? 'emeka.okafor@' : 'emeka.okafor@example.com'} inputMode="email" autoComplete="email" required aria-invalid={bad || undefined} />
        </Field>
        <Field label="Phone number" hint="So buyers can call you about orders. We never send codes to your phone."><PhoneInput defaultValue="803 123 4567" /></Field>
        <Field label="Create a password" required><PasswordInput defaultValue="farmfresh2026" autoComplete="new-password" strength /></Field>
        <div className="stack" style={{ gap: 10 }}>
          <label className="check"><input type="checkbox" defaultChecked />I agree to the Terms and Privacy Policy.</label>
          <label className="check"><input type="checkbox" />Send me offers and farm updates by SMS or WhatsApp (optional).</label>
        </div>
        <Btn block to="verify-email">Create account</Btn>
        <p className="small muted" style={{ textAlign: 'center' }}>Already have an account? <Clickable to="signin" style={linkStyle}>Sign in</Clickable></p>
      </form>
    </Auth>
  );
}

export function VerifyEmail({ state }: { state: string }) {
  const wrong = state === 'wrong code';
  return (
    <Auth>
      <form className="card stack-lg" onSubmit={e => e.preventDefault()} style={{ textAlign: 'center' }}>
        <span className="em-ic" style={{ margin: '0 auto' }}><Icon name="mail" /></span>
        <div><h2>Confirm your email</h2><p className="small muted">Enter the 6-digit code we sent to emeka.okafor@example.com · <Clickable to="signup" style={linkStyle}>Change</Clickable></p><p className="xs muted" style={{ marginTop: 6 }}>We only ask once. After this you sign in with your email and password.</p></div>
        <div className="code-boxes">{'482193'.split('').map((d, i) => <input key={i} defaultValue={wrong || i < 4 ? d : ''} aria-label={`Digit ${i + 1}`} inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'} maxLength={1} />)}</div>
        {wrong && <div style={{ textAlign: 'left' }}><Alert tone="danger" icon="alert">That code is not right. Check the latest email from OgaFarm and try again. 2 tries left.</Alert></div>}
        <Btn block to={roleDef(signupRole()).next ?? 'choose-plan'}>Confirm and continue</Btn>
        <p className="small muted">Not there? Check your spam folder. Resend code in <b className="num">0:42</b></p>
      </form>
    </Auth>
  );
}

export function Signin({ state }: { state: string }) {
  const wrong = state === 'wrong password';
  return (
    <Auth>
      <form className="card stack-lg" onSubmit={e => e.preventDefault()}>
        <div><h2>Welcome back</h2><p className="small muted">Sign in with your email and password.</p></div>
        {wrong && <Alert tone="danger" icon="alert">That email and password don't match. Check them and try again, or reset your password. 3 tries left before a short pause.</Alert>}
        <Field label="Email address" required><input className="input" type="email" defaultValue="emeka.okafor@example.com" inputMode="email" autoComplete="username" required /></Field>
        <div className="field">
          <span className="row-between"><span>Password<span className="req" aria-hidden="true">*</span></span><Clickable to="forgot-password" style={linkStyle}>Forgot password?</Clickable></span>
          <PasswordInput defaultValue={wrong ? 'farmfresh' : 'farmfresh2026'} autoComplete="current-password" invalid={wrong} />
        </div>
        <label className="check"><input type="checkbox" defaultChecked />Keep me signed in on this device</label>
        <Btn block to="product">Sign in</Btn>
        <Alert tone="info" icon="info">You were opening <b style={{ display: 'inline', fontSize: 'inherit' }}>Fresh tomatoes (Roma)</b>. We will take you back there after you sign in.</Alert>
        <p className="small muted" style={{ textAlign: 'center' }}>New to OgaFarm? <Clickable to="signup" style={linkStyle}>Create an account</Clickable></p>
      </form>
    </Auth>
  );
}

/* Forgot password: the email code is used here (and once at sign-up), never at every sign-in. */
export function ForgotPassword({ state }: { state: string }) {
  const reset = state === 'reset';
  return (
    <Auth>
      <form className="card stack-lg" onSubmit={e => e.preventDefault()}>
        {reset ? <>
          <div><h2>Set a new password</h2><p className="small muted">Enter the 6-digit code we sent to emeka.okafor@example.com, then choose a new password.</p></div>
          <div className="field"><span>Code from your email</span><div className="code-boxes">{'615204'.split('').map((d, i) => <input key={i} defaultValue={i < 6 ? d : ''} aria-label={`Digit ${i + 1}`} inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'} maxLength={1} />)}</div></div>
          <Field label="New password" required><PasswordInput defaultValue="" autoComplete="new-password" strength /></Field>
          <Btn block to="signin">Save new password</Btn>
          <p className="xs muted">For your safety, you will be signed out on other devices.</p>
        </> : <>
          <div><h2>Reset your password</h2><p className="small muted">Enter your account email. We will send you a code to set a new password.</p></div>
          <Field label="Email address" required><input className="input" type="email" defaultValue="emeka.okafor@example.com" inputMode="email" autoComplete="email" required /></Field>
          <Btn block state="reset">Email me a reset code</Btn>
          <p className="small muted" style={{ textAlign: 'center' }}>Remembered it? <Clickable to="signin" style={linkStyle}>Back to sign in</Clickable></p>
        </>}
      </form>
    </Auth>
  );
}

function Onboard({ step, children }: { step: number; children: ReactNode }) {
  return (
    <PublicShell noFooter>
      <section className="section"><div className="wrap stack-lg" style={{ maxWidth: 980 }}>
        <div className="stack" style={{ gap: 8 }}><div className="row-between small"><b>Step {step} of 4</b><span className="muted">{['Account', 'Plan', 'Verification', 'Storefront'][step - 1]}</span></div><Steps n={step} of={4} /></div>
        {children}
      </div></section>
    </PublicShell>
  );
}

export function ChoosePlan() {
  return (
    <Onboard step={2}>
      <div><h1>Choose your plan</h1><p className="muted">Your storefront goes live when your payment is confirmed and your farm is verified.</p></div>
      <Plans selectable />
      <Proposal n={9}>farmers set up their storefront for free first, and pay to publish it.</Proposal>
      <div className="card row-between"><div><b>Annual plan</b><div className="small muted">₦95,000 for 12 months · renews 23 Nov 2027</div></div><Btn to="payment-status">Pay {naira(95000)}</Btn></div>
    </Onboard>
  );
}

export function PaymentStatus({ state }: { state: string }) {
  return (
    <Onboard step={2}>
      <div className="card stack-lg narrow" style={{ textAlign: 'center' }}>
        {state === 'pending' && <>
          <span className="em-ic warn" style={{ margin: '0 auto' }}><Icon name="clock" /></span>
          <div><h2>Confirming your payment</h2><p className="muted">We switch on your plan only after the payment provider confirms it. This usually takes under a minute.</p></div>
          <div className="skel" style={{ height: 8, borderRadius: 4 }} />
          <p className="xs muted">Reference OGF-SUB-88213 · You can close this page. We will notify you.</p>
        </>}
        {state === 'active' && <>
          <span className="em-ic ok" style={{ margin: '0 auto' }}><Icon name="check" /></span>
          <div><h2>Your Annual plan is active</h2><p className="muted">Paid until <b>23 Nov 2027</b>. Next, verify your farm so buyers can see your storefront.</p></div>
          <div style={{ textAlign: 'left' }}><Kv rows={[['Amount', naira(95000)], ['Reference', 'OGF-SUB-88213'], ['Confirmed', '23 Nov 2026, 11:42 am']]} /></div>
          <Btn block to="verification">Continue to verification</Btn>
        </>}
        {state === 'failed' && <>
          <span className="em-ic danger" style={{ margin: '0 auto' }}><Icon name="alert" /></span>
          <div><h2>Payment did not go through</h2><p className="muted">Your bank declined the payment. No money was taken. Try another card or bank transfer.</p></div>
          <Btn block to="choose-plan">Try again</Btn>
        </>}
      </div>
    </Onboard>
  );
}

export function Verification({ state }: { state: string }) {
  if (state === 'submitted') return (
    <Onboard step={3}>
      <div className="card stack-lg" style={{ maxWidth: 560 }}>
        <Badge tone="info" icon="clock">Under review</Badge>
        <h2>Thanks, Emeka. We are checking your documents.</h2>
        <p className="muted">Most farms are reviewed within 1 working day. You can set up your storefront now; it goes public once you are verified.</p>
        <ul className="checklist">
          <li className="done"><span className="ck"><Icon name="check" /></span>Email address verified</li>
          <li className="done"><span className="ck"><Icon name="check" /></span>Annual plan active</li>
          <li><span className="ck" />Identity and farm documents reviewed</li>
        </ul>
        <Btn to="storefront-editor" style={{ alignSelf: 'flex-start' }}>Set up my storefront</Btn>
      </div>
    </Onboard>
  );
  return (
    <Onboard step={3}>
      <div><h1>Verify your farm</h1><p className="muted">Buyers trust farms with the Verified badge. Your documents are private and seen only by the OgaFarm review team.</p></div>
      <Alert tone="info" icon="info">Your storefront goes live once our team approves your documents. You can keep setting it up while you wait.</Alert>
      <form className="card" onSubmit={e => e.preventDefault()}><div className="form-grid">
        <Field label="Farm name"><input className="input" defaultValue="Okafor Family Farm" /></Field>
        <Field label="Farm type"><select className="select"><option>Mixed farm</option><option>Crop farm</option><option>Poultry farm</option><option>Livestock farm</option><option>Fish farm</option></select></Field>
        <Field label="State"><select className="select"><option>Delta</option><option>Edo</option><option>Lagos</option></select></Field>
        <Field label="LGA"><input className="input" defaultValue="Aniocha North" /></Field>
        <Field label="Farm address or landmark" full><input className="input" defaultValue="Ogwashi road, behind St. Paul's school, Issele-Uku" /></Field>
        <Field label="ID document"><select className="select"><option>National ID (NIN slip)</option><option>Driver's licence</option><option>International passport</option><option>Voter's card</option></select></Field>
        <Field label="Name on ID" hint="Must match your account name."><input className="input" defaultValue="Emeka Okafor" /></Field>
        <div className="field"><span>Upload ID</span><Upload note="JPG, PNG or PDF · up to 5 MB" /></div>
        <div className="field"><span>Photo of your farm</span><Upload icon="image" note="A clear photo of your farm or produce" /></div>
      </div></form>
      <div className="row"><Btn state="submitted">Submit for review</Btn><span className="small muted row" style={{ gap: 6 }}><Icon name="lock" />Encrypted and private</span></div>
    </Onboard>
  );
}
