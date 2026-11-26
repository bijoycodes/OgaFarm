/* Web preview of the tab bar: same tabs and badges as the native bar, drawn with our own components. */
import { TabList, TabSlot, TabTrigger, Tabs, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, Text, View } from 'react-native';
import type { AppRole } from '@/data/roles';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { TABS, type TabDef } from './tabs-config';

function TabButton({ tab, isFocused, onPress, onLongPress }: TabTriggerSlotProps & { tab: TabDef }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} accessibilityLabel={tab.label + (tab.badge ? `, ${tab.badge} new` : '')} accessibilityRole="tab" accessibilityState={{ selected: !!isFocused }} style={{ flex: 1, alignItems: 'center', gap: 2, paddingVertical: 6 }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 4, borderRadius: radius.full, backgroundColor: isFocused ? c.primarySoft : 'transparent' }}>
        <Icon name={tab.icon} size={22} color={isFocused ? c.primaryInk : c.muted} weight={isFocused ? 'fill' : 'regular'} />
        {tab.badge && <View style={{ position: 'absolute', top: -2, right: 6, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, backgroundColor: c.harvestFill, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: fonts.bodyHeavy, fontSize: 10, color: c.onHarvestFill }}>{tab.badge}</Text></View>}
      </View>
      <Text style={{ fontFamily: isFocused ? fonts.bodyBold : fonts.bodySemi, fontSize: size.xs, color: isFocused ? c.primaryInk : c.muted }}>{tab.label}</Text>
    </Pressable>
  );
}

export default function RoleTabs({ role }: { role: AppRole }) {
  const { c } = useTheme();
  return (
    <Tabs>
      <TabSlot style={{ flex: 1 }} />
      <TabList style={{ flexDirection: 'row', backgroundColor: c.card, borderTopWidth: 1, borderTopColor: c.line, paddingBottom: 8 }}>
        {TABS[role].map(t => (
          <TabTrigger key={t.name} name={t.name} href={`/${role}/${t.name}` as never} asChild>
            <TabButton tab={t} />
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}
