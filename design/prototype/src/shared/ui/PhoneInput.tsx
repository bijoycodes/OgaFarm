/* Phone number with a country picker. Nigeria is the default; common diaspora countries are listed first,
   then every other country, with a search box. The number field comes first in the markup so that a
   wrapping <label> still focuses the number; CSS shows the country button first. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from './Icon';

type Country = { iso: string; name: string; dial: string; example: string };
const COMMON: Country[] = [
  { iso: 'NG', name: 'Nigeria', dial: '+234', example: '803 123 4567' },
  { iso: 'GH', name: 'Ghana', dial: '+233', example: '24 123 4567' },
  { iso: 'GB', name: 'United Kingdom', dial: '+44', example: '7400 123456' },
  { iso: 'US', name: 'United States', dial: '+1', example: '(201) 555 0123' },
  { iso: 'CA', name: 'Canada', dial: '+1', example: '(506) 234 5678' }
];
const OTHERS: Country[] = [
  { iso: 'BJ', name: 'Benin', dial: '+229', example: '90 01 12 34' },
  { iso: 'CM', name: 'Cameroon', dial: '+237', example: '6 71 23 45 67' },
  { iso: 'CN', name: 'China', dial: '+86', example: '131 2345 6789' },
  { iso: 'CI', name: "Côte d'Ivoire", dial: '+225', example: '01 23 45 67 89' },
  { iso: 'FR', name: 'France', dial: '+33', example: '6 12 34 56 78' },
  { iso: 'DE', name: 'Germany', dial: '+49', example: '1512 3456789' },
  { iso: 'IN', name: 'India', dial: '+91', example: '81234 56789' },
  { iso: 'IE', name: 'Ireland', dial: '+353', example: '85 012 3456' },
  { iso: 'IT', name: 'Italy', dial: '+39', example: '312 345 6789' },
  { iso: 'KE', name: 'Kenya', dial: '+254', example: '712 345678' },
  { iso: 'NL', name: 'Netherlands', dial: '+31', example: '6 12345678' },
  { iso: 'NE', name: 'Niger', dial: '+227', example: '93 12 34 56' },
  { iso: 'SA', name: 'Saudi Arabia', dial: '+966', example: '51 234 5678' },
  { iso: 'SN', name: 'Senegal', dial: '+221', example: '70 123 45 67' },
  { iso: 'ZA', name: 'South Africa', dial: '+27', example: '71 123 4567' },
  { iso: 'TG', name: 'Togo', dial: '+228', example: '90 11 22 33' },
  { iso: 'AE', name: 'United Arab Emirates', dial: '+971', example: '50 123 4567' }
];
const ALL = [...COMMON, ...OTHERS];

/** Flag from the ISO code (regional indicator letters). Shows as letters on systems without flag glyphs. */
const flag = (iso: string) => String.fromCodePoint(...[...iso].map(c => 0x1f1e6 + c.charCodeAt(0) - 65));

export function PhoneInput({ defaultValue = '', defaultCountry = 'NG', required, autoComplete = 'tel-national', label = 'Phone number' }:
  { defaultValue?: string; defaultCountry?: string; required?: boolean; autoComplete?: string; label?: string }) {
  const [country, setCountry] = useState(() => ALL.find(c => c.iso === defaultCountry) ?? COMMON[0]);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const wrap = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLInputElement>(null);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return null;
    return ALL.filter(c => c.name.toLowerCase().includes(t) || c.dial.includes(t.replace(/^\+?/, '+')) || c.iso.toLowerCase() === t);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); setOpen(false); (wrap.current?.querySelector('.pi-country') as HTMLElement | null)?.focus(); } };
    document.addEventListener('mousedown', onDoc); document.addEventListener('keydown', onKey);
    (wrap.current?.querySelector('.pi-search') as HTMLElement | null)?.focus();
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const choose = (c: Country) => { setCountry(c); setOpen(false); setQ(''); numRef.current?.focus(); };
  const row = (c: Country) => (
    <button key={c.iso + c.name} type="button" role="option" aria-selected={c.iso === country.iso} className="pi-opt" onClick={e => { e.preventDefault(); choose(c); }}>
      <span className="pi-flag" aria-hidden="true">{flag(c.iso)}</span><span className="grow">{c.name}</span><span className="pi-dial">{c.dial}</span>
      {c.iso === country.iso && <Icon name="check" className="pi-check" />}
    </button>
  );

  return (
    <div className="phone-input" ref={wrap}>
      <input ref={numRef} className="input pi-number" type="tel" inputMode="tel" autoComplete={autoComplete} defaultValue={defaultValue}
        placeholder={country.example} required={required} aria-label={`${label}, ${country.name} ${country.dial}`} />
      <button type="button" className="pi-country" aria-haspopup="listbox" aria-expanded={open}
        aria-label={`Country code: ${country.name} ${country.dial}. Change country`} onClick={e => { e.preventDefault(); setOpen(o => !o); }}>
        <span className="pi-flag" aria-hidden="true">{flag(country.iso)}</span><span className="pi-dial">{country.dial}</span><Icon name="chev" className="pi-caret" />
      </button>
      {open && (
        <div className="pi-pop">
          <div className="pi-search-row"><Icon name="search" /><input className="pi-search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search country or code" aria-label="Search country or code" /></div>
          <div className="pi-list" role="listbox" aria-label="Countries">
            {list ? (list.length ? list.map(row) : <p className="xs muted pi-empty">No country found</p>) : <>
              <div className="pi-group">Common</div>{COMMON.map(row)}
              <div className="pi-group">All countries</div>{OTHERS.map(row)}
            </>}
          </div>
        </div>
      )}
    </div>
  );
}
