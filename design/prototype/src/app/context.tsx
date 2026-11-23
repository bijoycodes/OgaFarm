import { createContext, useContext } from 'react';

export interface Proto {
  go: (screenId: string) => void;          // navigate to a screen, or "soon:v2" for a later version
  toast: (message: string) => void;
  openModal: (name: string) => void;
  closeModal: () => void;
  setState: (state: string) => void;       // switch the current screen to another of its states
  theme: Theme;                             // chosen colour theme ('system' follows the device)
  setTheme: (theme: Theme) => void;
}

export type Theme = 'system' | 'light' | 'dark';

export const ProtoContext = createContext<Proto>({
  go: () => {}, toast: () => {}, openModal: () => {}, closeModal: () => {}, setState: () => {}, theme: 'system', setTheme: () => {}
});

export const useProto = () => useContext(ProtoContext);
