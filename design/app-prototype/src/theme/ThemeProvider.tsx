/* Theme: follows the phone's light/dark setting until the user taps the day/night button. */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { dark, light, type Colors } from './tokens';

export type ThemeMode = 'system' | 'light' | 'dark';
interface ThemeValue { mode: ThemeMode; setMode: (m: ThemeMode) => void; scheme: 'light' | 'dark'; c: Colors; toggle: () => void }

const ThemeCtx = createContext<ThemeValue>({ mode: 'system', setMode: () => {}, scheme: 'light', c: light, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const device = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');
  const scheme: 'light' | 'dark' = mode === 'system' ? (device === 'dark' ? 'dark' : 'light') : mode;
  const value = useMemo<ThemeValue>(() => ({
    mode, setMode, scheme, c: scheme === 'dark' ? dark : light,
    toggle: () => setMode(scheme === 'dark' ? 'light' : 'dark')
  }), [mode, scheme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
