/* Add another role (BR-ACC-01, 02, 06). Sign-up creates one role; more are added here.
   Roles designed in later versions are shown but disabled. States: choose, farmer added. */
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { ROLE_CATALOG, ROLE_INFO, type AppRole } from '@/data/roles';
import { useAccount, useNav, useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Alert, Badge, Button, Card, Checklist, Press, Rise, Row, T } from '@/ui/kit';
import { Screen } from '@/ui/screen';

const ID = '/buyer/add-role';
const VERSION = 2; // prototype covers V1 + V2

export default function AddRole() {
  const { c } = useTheme();
  const [state, setState] = useScreenState(ID, 'Add another role', ['choose', 'farmer added']);
  const acct = useAccount();
  const nav = useNav();
  const { toast } = useProto();
  const held = acct.roles as string[];
  const [pick, setPick] = useState(() => ROLE_CATALOG.find(o => !held.includes(o.key) && o.since <= VERSION)?.key ?? 'farmer');
  const chosen = ROLE_CATALOG.find(o => o.key === pick)!;

  const add = () => {
    haptic.success();
    if (chosen.key === 'farmer') { acct.addRole('farmer'); setState('farmer added'); }
    else if (chosen.key === 'transporter') { acct.addRole('transporter'); nav.push('/transporter/signup', 'default'); }
    else { toast(`${chosen.label} role added`); nav.replace('/buyer/browse'); }
  };

  if (state === 'farmer added') return (
    <Screen footer={<>
      <Button title="Choose a plan" onPress={() => nav.push('/farmer/plan')} />
      <Button title="Do it later" variant="ghost" onPress={() => nav.replace('/buyer/browse')} />
    </>}>
      <Stack.Screen options={{ title: 'Role added' }} />
      <Rise>
        <Card>
          <Row gap={14}>
            <View style={{ width: 56, height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: c.primarySoft }}><Icon name="leaf" size={28} color={c.primaryInk} /></View>
            <View style={{ flex: 1 }}><T v="h2">Farmer role added</T><T v="small" muted>Finish these steps to open your storefront.</T></View>
          </Row>
          <T v="small" muted>Your buyer orders and messages stay under Buyer.</T>
        </Card>
      </Rise>
      <Checklist items={[['Email address verified (already done for your account)', true], ['Choose a farmer plan', false], ['Verify your ID and farm (your ID is checked once and reused for any later role)', false], ['Set up your storefront', false]]} />
      <T v="xs" muted>You can switch between Buyer and Farmer any time from the role menu.</T>
    </Screen>
  );

  return (
    <Screen footer={<Button title={`Add ${chosen.label.toLowerCase()} role`} icon="plus" onPress={add} />}>
      <Stack.Screen options={{ title: '' }} />
      <Rise style={{ gap: 4 }}>
        <T v="h1">Add a role</T>
        <T v="small" muted>Use one account for everything you do on OgaFarm. Your current {held.length > 1 ? 'roles' : 'role'}: <Text style={{ fontFamily: fonts.bodyBold, color: c.ink }}>{held.map(r => ROLE_INFO[r as AppRole].label).join(', ')}</Text>.</T>
      </Rise>
      <View accessibilityRole="radiogroup" accessibilityLabel="Choose a role to add" style={{ gap: 10 }}>
        {ROLE_CATALOG.map((o, i) => {
          const has = held.includes(o.key), soon = o.since > VERSION, on = pick === o.key && !has && !soon;
          return (
            <Rise key={o.key} i={i}>
              <Press onPress={() => { haptic.select(); setPick(o.key); }} disabled={has || soon} role="radio" selected={on} label={`${o.label}. ${o.what}${has ? ' You have this role.' : soon ? ` Coming in version ${o.since}.` : ''}`} scaleTo={0.985}
                style={{ flexDirection: 'row', gap: 12, padding: 14, borderRadius: radius.lg, borderWidth: on ? 2 : 1, margin: on ? 0 : 1, borderColor: on ? c.primary : c.line, backgroundColor: on ? c.primarySoft : c.card, opacity: soon ? 0.6 : 1 }}>
                <View style={{ width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? c.card : c.sunken }}><Icon name={o.icon} size={22} color={c.primaryInk} /></View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Row between gap={8}>
                    <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.md, color: c.ink }}>{o.label}</Text>
                    {has ? <Badge tone="ok" icon="check" align="center">You have this</Badge> : soon ? <Badge align="center">Coming in V{o.since}</Badge> : <Badge tone={o.price === 'Free' ? 'ok' : 'gold'} align="center">{o.price}</Badge>}
                  </Row>
                  <T v="small" muted>{o.what}</T>
                  <Row gap={6}><Icon name="info" size={13} color={c.muted} /><T v="xs" muted>{o.needs}</T></Row>
                </View>
              </Press>
            </Rise>
          );
        })}
      </View>
      <Alert tone="info" icon="info">Adding a role never changes the plan of another role. Each role keeps its own orders, listings and notifications, and you switch between them from the role menu.</Alert>
    </Screen>
  );
}
