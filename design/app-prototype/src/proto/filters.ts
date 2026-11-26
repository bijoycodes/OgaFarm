/* Marketplace filters, shared by Browse and the Filters sheet. Results are really filtered (sample data). */
import { useSyncExternalStore } from 'react';
import { FARMS, PRODUCTS, type Product } from '@/data/sample';
import { AVAIL, RADIUS, SORTS } from '@/data/delivery';

export interface Filters {
  q: string; cats: string[]; avail: string[]; radius: (typeof RADIUS)[number]; min: number; max: number;
  verified: boolean; fresh: boolean; sort: (typeof SORTS)[number];
}
export const DEFAULT_FILTERS: Filters = { q: '', cats: [], avail: [], radius: '50 km', min: 0, max: 0, verified: false, fresh: false, sort: 'Nearest first' };

let state = DEFAULT_FILTERS;
const subs = new Set<() => void>();
export const setFilters = (patch: Partial<Filters> | ((f: Filters) => Partial<Filters>)) => {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
  subs.forEach(s => s());
};
export const useFilters = () => useSyncExternalStore(cb => { subs.add(cb); return () => { subs.delete(cb); }; }, () => state, () => state);

const FRESH = (p: Product) => p.confirmed.startsWith('Today');

export function applyFilters(f: Filters, list: Product[] = PRODUCTS) {
  const q = f.q.trim().toLowerCase();
  const statuses = f.avail.map(a => AVAIL.find(([k]) => k === a)?.[1]);
  const out = list.filter(p =>
    (!q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || FARMS[p.farm].name.toLowerCase().includes(q)) &&
    (!f.cats.length || f.cats.includes(p.cat)) &&
    (!statuses.length || statuses.includes(p.status)) &&
    (!f.verified || FARMS[p.farm].verified) &&
    (!f.fresh || FRESH(p)) &&
    (!f.min || p.price >= f.min) && (!f.max || p.price <= f.max));
  if (f.sort === 'Lowest price') out.sort((a, b) => a.price - b.price);
  if (f.sort === 'Recently confirmed') out.sort((a, b) => Number(FRESH(b)) - Number(FRESH(a)));
  return out;
}

/** Removable chips shown above the results. */
export function activeChips(f: Filters): { label: string; clear: Partial<Filters> }[] {
  const chips: { label: string; clear: Partial<Filters> }[] = [];
  f.cats.forEach(c => chips.push({ label: c, clear: { cats: f.cats.filter(x => x !== c) } }));
  f.avail.forEach(a => chips.push({ label: a, clear: { avail: f.avail.filter(x => x !== a) } }));
  if (f.radius !== DEFAULT_FILTERS.radius) chips.push({ label: f.radius === 'State' ? 'All of Delta State' : `Within ${f.radius}`, clear: { radius: DEFAULT_FILTERS.radius } });
  if (f.min || f.max) chips.push({ label: `₦${(f.min || 0).toLocaleString('en-NG')} – ${f.max ? '₦' + f.max.toLocaleString('en-NG') : 'any'}`, clear: { min: 0, max: 0 } });
  if (f.verified) chips.push({ label: 'Verified farms', clear: { verified: false } });
  if (f.fresh) chips.push({ label: 'Fresh stock', clear: { fresh: false } });
  return chips;
}
