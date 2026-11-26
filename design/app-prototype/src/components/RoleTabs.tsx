/* Native tab bar (UITabBar on iPhone, Material bar on Android) for a role. */
import { NativeTabs } from 'expo-router/native-tabs';
import type { AppRole } from '@/data/roles';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';
import { TABS } from './tabs-config';

export default function RoleTabs({ role }: { role: AppRole }) {
  const { c } = useTheme();
  return (
    <NativeTabs
      backgroundColor={c.card}
      tintColor={c.primary}
      iconColor={{ default: c.muted, selected: c.primaryInk }}
      indicatorColor={c.primarySoft}
      badgeBackgroundColor={c.harvestFill}
      badgeTextColor={c.onHarvestFill}
      labelStyle={{ default: { color: c.muted, fontFamily: fonts.bodySemi }, selected: { color: c.primaryInk, fontFamily: fonts.bodyBold } }}>
      {TABS[role].map(t => (
        <NativeTabs.Trigger key={t.name} name={t.name}>
          <NativeTabs.Trigger.Label>{t.label}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={t.sf as never} md={t.md as never} />
          {t.badge ? <NativeTabs.Trigger.Badge>{t.badge}</NativeTabs.Trigger.Badge> : null}
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
