import { createContext, useContext } from 'react';

export interface Proto {
  go: (screenId: string) => void;          // navigate to a screen, "screen@state" for a state, or "soon:v2" / "soon:v2:screen-id" for a later version
  toast: (message: string) => void;
  openModal: (name: string) => void;
  closeModal: () => void;
  setState: (state: string) => void;       // switch the current screen to another of its states
  version: string;                          // version being viewed, e.g. 'v2' (screens and nav adapt to it)
  theme: Theme;                             // chosen colour theme ('system' follows the device)
  setTheme: (theme: Theme) => void;
}

export type Theme = 'system' | 'light' | 'dark';

export const ProtoContext = createContext<Proto>({
  go: () => {}, toast: () => {}, openModal: () => {}, closeModal: () => {}, setState: () => {}, version: 'v1', theme: 'system', setTheme: () => {}
});

export const useProto = () => useContext(ProtoContext);
