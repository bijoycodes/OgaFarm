/* Compact role selector (the popup is rendered at the page root so it sits above every screen layer): one field that shows the chosen role; tapping it opens a popup with every user type.
   Keeps the sign-up page the same size however many roles are added. */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { Badge } from './ui';
import { ROLE_CATALOG, roleDef, type RoleKey } from '../data/roles';

export function RolePicker({ value, onChange, version, label = 'I want to join as' }:
  { value: RoleKey; onChange: (k: RoleKey) => void; version: number; label?: string }) {
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cur = roleDef(value);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    (popRef.current?.querySelector('[aria-checked="true"]') as HTMLElement | null)?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  const close = () => { setOpen(false); triggerRef.current?.focus(); };
  const pick = (k: RoleKey) => { onChange(k); close(); };

  return (
    <div className="field">
      <span id="role-picker-label">{label}<span className="req" aria-hidden="true">*</span></span>
      <button ref={triggerRef} type="button" className="role-select" aria-haspopup="dialog" aria-labelledby="role-picker-label role-picker-value" onClick={() => setOpen(true)}>
        <span className="sr-ic"><Icon name={cur.icon} /></span>
        <span className="sr-text" id="role-picker-value"><b>{cur.label} <span className="sr-who">· {cur.price === 'Free' ? 'free' : 'paid plan'}</span></b><span className="xs muted">{cur.what}</span></span>
        <span className="rs-change">Change<Icon name="chev" /></span>
      </button>
      <span className="hint">Pick one to start. You can add more roles later from your account.</span>

      {open && createPortal(
        <div className="modal-back" onClick={e => { if (e.target === e.currentTarget) close(); }}>
          <div className="modal role-pop" role="dialog" aria-modal="true" aria-labelledby="role-pop-title" ref={popRef}>
            <div className="rp-pop-head">
              <div><h3 id="role-pop-title">How will you use OgaFarm?</h3><p className="xs muted">Choose one. You can add more roles later.</p></div>
              <button type="button" className="icon-btn" aria-label="Close" onClick={close}><Icon name="close" /></button>
            </div>
            <div className="rp-list" role="radiogroup" aria-labelledby="role-pop-title">
              {ROLE_CATALOG.map(r => {
                const soon = r.since > version;
                return (
                  <button key={r.key} type="button" role="radio" aria-checked={r.key === value} disabled={soon} className="rp-row" onClick={() => pick(r.key)}>
                    <span className="sr-ic"><Icon name={r.icon} /></span>
                    <span className="sr-text"><b>{r.label}</b><span className="xs muted">{r.what}</span></span>
                    <span className="rp-side">{soon ? <Badge>Coming in V{r.since}</Badge> : <Badge tone={r.price === 'Free' ? 'ok' : 'wheat'}>{r.price}</Badge>}{r.key === value && <Icon name="check" className="rp-check" />}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
