/* Role menu (native sheet): switch between the roles this account holds, add another role, sign out.
   Sign-up creates one role; more are added later (BR-ACC-01…05). */
import { router, useGlobalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ROLE_HOME, ROLE_INFO, type AppRole } from '@/data/roles';
import { useAccount, useProto } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size, space } from '@/theme/tokens';
import { Icon, type IconName } from '@/ui/Icon';
import { Avatar, Press, T } from '@/ui/kit';

export default function RoleMenu() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const acct = useAccount();
  const { toast } = useProto();
  const { from } = useGlobalSearchParams<{ from?: string }>();
  const active = (from as AppRole) || acct.roles[0];
  const close = (then?: () => void) => { router.back(); if (then) setTimeout(then, 80); };
  const switchTo = (r: AppRole) => {
    haptic.success();
    close(r === active ? undefined : () => { router.replace(ROLE_HOME[r] as never); toast(`Switched to ${ROLE_INFO[r].label}`); });
  };
  const Plain = ({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) => (
    <Press onPress={onPress} label={label} scaleTo={0.99} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 50, paddingHorizontal: 14 }}>
      <Icon name={icon} size={20} color={c.muted} /><Text style={{ fontFamily: fonts.bodySemi, fontSize: size.md, color: c.ink2 }}>{label}</Text>
    </Press>
  );
  return (
    <ScrollView contentContainerStyle={{ padding: space[4], paddingBottom: insets.bottom + space[5], gap: space[4] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Avatar initials={acct.initials} size={52} />
        <View style={{ flex: 1 }}><T v="h3">{acct.name}</T><T v="small" muted>{acct.roles.length > 1 ? `${acct.roles.length} roles on this account` : 'One role on this account'}</T></View>
      </View>
      <View style={{ gap: 6 }}>
        <T v="eyebrow">Switch role</T>
        {acct.roles.map(r => {
          const on = r === active, unread = acct.unread[r];
          return (
            <Press key={r} onPress={() => switchTo(r)} role="radio" selected={on} label={`${ROLE_INFO[r].label}${on ? ', current role' : ''}${unread && !on ? `, ${unread} unread` : ''}`}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60, padding: 10, borderRadius: radius.lg, borderWidth: 1,
                borderColor: on ? c.primary : c.line, backgroundColor: on ? c.primarySoft : c.card }}>
              <View style={{ width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? c.card : c.sunken }}><Icon name={ROLE_INFO[r].icon} size={20} color={c.primaryInk} /></View>
              <View style={{ flex: 1 }}><Text style={{ fontFamily: fonts.bodyBold, fontSize: size.md, color: c.ink }}>{ROLE_INFO[r].label}</Text><Text style={{ fontFamily: fonts.body, fontSize: size.xs, color: c.muted }}>{acct.sub[r]}</Text></View>
              {!!unread && !on && <View style={{ minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 6, backgroundColor: c.harvestFill, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontFamily: fonts.bodyHeavy, fontSize: size.xs, color: c.onHarvestFill }}>{unread}</Text></View>}
              {on && <Icon name="check" size={20} color={c.primaryInk} weight="bold" />}
            </Press>
          );
        })}
        <Press onPress={() => close(() => router.push('/buyer/add-role' as never))} label="Add another role"
          style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60, padding: 10, borderRadius: radius.lg, borderWidth: 1, borderStyle: 'dashed', borderColor: c.lineStrong }}>
          <View style={{ width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: c.primary }}><Icon name="plus" size={20} color={c.onPrimary} weight="bold" /></View>
          <View style={{ flex: 1 }}><Text style={{ fontFamily: fonts.bodyBold, fontSize: size.md, color: c.ink }}>Add another role</Text><Text style={{ fontFamily: fonts.body, fontSize: size.xs, color: c.muted }}>Buyer, transporter, farmer and more</Text></View>
        </Press>
      </View>
      <View style={{ borderRadius: radius.lg, backgroundColor: c.card, borderWidth: 1, borderColor: c.line }}>
        <Plain icon="gear" label="Account and settings" onPress={() => close(() => router.push('/account' as never))} />
        <View style={{ height: 1, backgroundColor: c.line }} />
        <Plain icon="logout" label="Sign out" onPress={() => close(() => router.replace('/auth/welcome'))} />
      </View>
    </ScrollView>
  );
}
