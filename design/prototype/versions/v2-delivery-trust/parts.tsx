/* v2 · Sample data and small parts shared by the delivery and trust screens */
import { useState } from 'react';
import { Icon } from '@shared/ui/Icon';
import { Badge } from '@shared/ui/ui';

export interface Transporter {
  id: string; name: string; person: string; initials: string; vehicle: string; plate: string;
  payload: string; bags: string; base: string; areas: string[]; rating: number; reviews: number; jobs: number; verified: boolean;
}

export const TRANSPORTERS: Record<string, Transporter> = {
  ike: { id: 'ike', name: 'Ike Haulage', person: 'Sunday Ike', initials: 'IH', vehicle: 'Pickup truck', plate: 'AGB 482 KT', payload: '1,500 kg', bags: '25 × 50 kg bags', base: 'Issele-Uku, Delta', areas: ['Aniocha North', 'Oshimili South (Asaba)', 'Ika South (Agbor)'], rating: 4.7, reviews: 31, jobs: 58, verified: true },
  okada: { id: 'okada', name: 'Tega Express', person: 'Tega Omoru', initials: 'TE', vehicle: 'Motorcycle', plate: 'ASB 117 QA', payload: '80 kg', bags: '1 × 50 kg bag', base: 'Asaba, Delta', areas: ['Oshimili South (Asaba)', 'Aniocha North'], rating: 4.5, reviews: 12, jobs: 27, verified: true },
  cold: { id: 'cold', name: 'Agbor Cold Van', person: 'Peter Nwachukwu', initials: 'AC', vehicle: 'Refrigerated van', plate: 'AGR 905 LM', payload: '2,000 kg', bags: '30 × 50 kg bags', base: 'Agbor, Delta', areas: ['Ika South (Agbor)', 'Oshimili South (Asaba)', 'Ughelli North'], rating: 4.9, reviews: 4, jobs: 9, verified: true }
};

/** The delivery order used across V2 screens. */
export const DELIVERY = {
  id: 'OGF-10452', item: 'Fresh tomatoes (Roma)', qty: '60 kg', qtyN: 60, unit: 350, subtotal: 21000,
  farm: 'Okafor Family Farm', farmer: 'Emeka Okafor', farmPhone: '+234 803 123 4567', pickup: 'Farm gate, Issele-Uku',
  buyer: 'Ngozi Eze', buyerPhone: '+234 806 555 0142', dropArea: 'Okpanam Road, Asaba', dropFull: '14 Okpanam Road, near Shoprite, Asaba',
  distance: '38 km', fee: 6500, code: '7316', packing: '3 baskets'
};

export function Route({ from, to, fromLbl = 'Pickup', toLbl = 'Drop-off' }: { from: string; to: string; fromLbl?: string; toLbl?: string }) {
  return (
    <div className="route">
      <div className="stop"><span className="pt" /><div><div className="lbl">{fromLbl}</div><div className="small">{from}</div></div></div>
      <div className="stop"><span className="pt to" /><div><div className="lbl">{toLbl}</div><div className="small">{to}</div></div></div>
    </div>
  );
}

/** Read-only stars with the number and review count (BR-REV-05: always show the count, flag small samples). */
export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className="row" style={{ gap: 6 }}>
      <span className="stars" role="img" aria-label={`${value} out of 5`}>{[1, 2, 3, 4, 5].map(i => <Icon key={i} name={i <= Math.round(value) ? 'starFill' : 'star'} className={i <= Math.round(value) ? 'on' : ''} />)}</span>
      <b className="small num">{value.toFixed(1)}</b>
      {count !== undefined && <span className="xs muted">({count} {count === 1 ? 'review' : 'reviews'})</span>}
      {count !== undefined && count < 5 && <Badge tone="info">Few reviews</Badge>}
    </span>
  );
}

/** Tap-to-rate stars, 44 px targets. */
export function RateInput({ label, initial = 0 }: { label: string; initial?: number }) {
  const [v, setV] = useState(initial);
  return (
    <div className="stars" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" role="radio" aria-checked={v === i} aria-label={`${i} star${i > 1 ? 's' : ''}`} className={i <= v ? 'on' : ''} onClick={() => setV(i)}><Icon name={i <= v ? 'starFill' : 'star'} /></button>
      ))}
    </div>
  );
}
