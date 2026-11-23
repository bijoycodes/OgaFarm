/* One icon family for the whole product: Phosphor, regular weight (UI/UX Pro Max default).
   The shapes come from scripts/build-icons.mjs, which keeps only the icons and weight we use,
   so the app stays light on mobile data. Add a name there and re-run it to add an icon. */
import { ICON_PATHS } from './icons.generated';

export type IconName = keyof typeof ICON_PATHS | string;

/** Decorative by default (hidden from screen readers). Pass `label` when the icon carries meaning on its own. */
export function Icon({ name, className = '', size, label }: { name: IconName; className?: string; size?: number; label?: string }) {
  return (
    <svg
      className={`ic ${className}`} viewBox="0 0 256 256" fill="currentColor" width={size} height={size}
      aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label}
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] ?? ICON_PATHS.info }}
    />
  );
}
