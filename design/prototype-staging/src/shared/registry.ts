import type { ComponentType } from 'react';

export type Role = 'visitor' | 'farmer' | 'buyer' | 'admin' | 'supplier' | 'transporter' | 'jobseeker' | 'consultant';

/** One clickable screen in the prototype. */
export interface ScreenDef {
  id: string;                 // used in the URL hash, e.g. #farmer-dashboard
  title: string;
  spec: string;               // PRD / spec reference, e.g. "S02" or "F04 · BR-PAY"
  role: Role | null;          // null = reference page (index, design system)
  group: string;              // heading in the screen index
  states?: string[];          // other states shown as pills (first one is the default)
  status?: 'new' | 'updated'; // what this version did to the screen
  Component: ComponentType<{ state: string }>;
}

/** One release version of the design, kept in its own folder under /versions. */
export interface VersionDef {
  id: string;                 // "v1"
  folder: string;             // "v1-mvp"
  name: string;               // "MVP: Farmer sells, buyer buys"
  increment: string;          // roadmap increment, e.g. "I1"
  status: 'built' | 'planned';
  summary: string;
  planned: string[];          // planned screens (for versions not built yet)
  screens: ScreenDef[];
}
