/* Prototype state: the signed-in sample account, toasts, and each screen's demo states
   (default, empty, error…) that the floating "Screens" helper can switch between. */
import { router, useFocusEffect } from 'expo-router';
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { ACCOUNTS, type AccountKey, type AppRole } from '@/data/roles';

interface ScreenMeta { id: string; title: string; states: string[] }
interface ProtoValue {
  account: AccountKey; setAccount: (a: AccountKey) => void;
  toastMsg: string | null; toast: (m: string) => void;
  current: ScreenMeta | null; setCurrent: (m: ScreenMeta | null) => void;
  states: Record<string, string>; setScreenState: (id: string, s: string) => void;
  /** Roles added during the demo (Add a role), per sample account. */
  added: Partial<Record<AccountKey, AppRole[]>>; addRole: (r: AppRole) => void;
}
const Ctx = createContext<ProtoValue | null>(null);

export function ProtoProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AccountKey>('ngozi');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [current, setCurrent] = useState<ScreenMeta | null>(null);
  const [states, setStates] = useState<Record<string, string>>({});
  const [added, setAdded] = useState<Partial<Record<AccountKey, AppRole[]>>>({});
  const addRole = useCallback((r: AppRole) => setAdded(v => ({ ...v, [account]: [...(v[account] ?? []), r] })), [account]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useCallback((m: string) => {
    setToastMsg(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastMsg(null), 2800);
  }, []);
  const setScreenState = useCallback((id: string, s: string) => setStates(v => ({ ...v, [id]: s })), []);
  const value = useMemo(() => ({ account, setAccount, toastMsg, toast, current, setCurrent, states, setScreenState, added, addRole }),
    [account, toastMsg, toast, current, states, setScreenState, added, addRole]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProto() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useProto must be used inside ProtoProvider');
  return v;
}

/** Current account (sample person) and its details. */
export function useAccount() {
  const { account, setAccount, added, addRole } = useProto();
  const base = ACCOUNTS[account], extra = (added[account] ?? []).filter(r => !base.roles.includes(r));
  const sub = { ...base.sub } as Partial<Record<AppRole, string>>;
  extra.forEach(r => { sub[r] = r === 'farmer' ? 'Setting up your farm' : 'Setting up'; });
  return { key: account, setAccount, addRole, ...base, roles: [...base.roles, ...extra], sub };
}

/**
 * Registers a screen's demo states with the Screens helper while the screen is focused,
 * and returns the active state (the first one by default).
 */
export function useScreenState(id: string, title: string, list: string[] = ['default']) {
  const { states, setCurrent, setScreenState } = useProto();
  const key = list.join('|');
  // Remember the last real screen (sheets opened on top don't replace it)
  useFocusEffect(useCallback(() => { setCurrent({ id, title, states: key.split('|') }); }, [id, title, key, setCurrent]));
  const state = states[id] && list.includes(states[id]) ? states[id] : list[0];
  return [state, (s: string) => setScreenState(id, s)] as const;
}

/**
 * Navigation that can also pick the demo state of the screen it opens
 * (screen ids are their hrefs, e.g. push('/buyer/order', 'in transit')).
 */
export function useNav() {
  const { setScreenState } = useProto();
  const set = (href: string, s?: string) => { if (s) setScreenState(href.split('?')[0], s); };
  return {
    push: (href: string, s?: string) => { set(href, s); router.push(href as never); },
    replace: (href: string, s?: string) => { set(href, s); router.replace(href as never); },
    /** Change the state of a screen without navigating (e.g. "Something is wrong" on the same screen). */
    state: (href: string, s: string) => setScreenState(href, s)
  };
}
