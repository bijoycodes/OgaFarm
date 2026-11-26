/* Screen frame: safe areas, scrolling page with pull-to-refresh, sticky tab header bar, and the toast. */
import { router, usePathname } from 'expo-router';
import { createContext, isValidElement, useContext, useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, motion, radius, size, space } from '@/theme/tokens';
import type { AppRole } from '@/data/roles';
import { useAccount, useProto } from '@/proto/Proto';
import { TABS } from '@/components/tabs-config';
import { Icon } from './Icon';
import { Avatar, Press } from './kit';
import { LogoLockup } from './Logo';

/** True once the page has scrolled, so the sticky header can show its bottom border. */
const ScrolledCtx = createContext(false);

/** Pages never get wider than this (tablets, web preview): content stays centred and readable. */
export const MAX_W = 720;

/**
 * Scrolling page. `tabs` adds room for the tab bar; `refresh` enables pull-to-refresh.
 * `header` (a TabHeader) stays fixed on top while the page scrolls; its title and subtitle open the page and scroll with it.
 */
export function Screen({ children, header, refresh, tabs, keyboard, pad = true, footer, onRefresh: onRefreshProp }:
  { children: ReactNode; header?: ReactNode; refresh?: boolean; tabs?: boolean; keyboard?: boolean; pad?: boolean; footer?: ReactNode; onRefresh?: () => void }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { toast } = useProto();
  const [refreshing, setRefreshing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const onRefresh = () => { setRefreshing(true); setTimeout(() => { setRefreshing(false); if (onRefreshProp) onRefreshProp(); else toast('Up to date'); }, 900); };
  const hp = isValidElement<{ title?: string; subtitle?: string }>(header) ? header.props : undefined;
  const body = (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="automatic"
      scrollEventThrottle={32} onScroll={header ? e => { const y = e.nativeEvent.contentOffset.y > 4; if (y !== scrolled) setScrolled(y); } : undefined}
      contentContainerStyle={{ width: '100%', maxWidth: MAX_W, alignSelf: 'center', paddingHorizontal: pad ? space[4] : 0, paddingTop: header ? space[1] : space[4], paddingBottom: (tabs ? 110 : footer ? 24 : 40) + (footer ? 0 : insets.bottom), gap: space[4] }}
      refreshControl={refresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.primary} colors={[c.primary]} /> : undefined}>
      {hp?.title && (
        <View style={{ gap: 2, marginBottom: -space[1] }}>
          <Text accessibilityRole="header" style={{ fontFamily: fonts.display, fontSize: size.x2 + 2, lineHeight: 38, color: c.ink }}>{hp.title}</Text>
          {hp.subtitle && <Text style={{ fontFamily: fonts.body, fontSize: size.md, lineHeight: 22, color: c.muted }}>{hp.subtitle}</Text>}
        </View>
      )}
      {children}
    </ScrollView>
  );
  const page = header ? <View style={{ flex: 1, backgroundColor: c.bg }}><ScrolledCtx.Provider value={scrolled}>{header}</ScrolledCtx.Provider>{body}</View> : body;
  const withFooter = footer ? <View style={{ flex: 1, backgroundColor: c.bg }}>{page}<BottomBar>{footer}</BottomBar></View> : page;
  return keyboard ? <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>{withFooter}</KeyboardAvoidingView> : withFooter;
}

/** Action bar fixed under the page (Buy now, Pay…), above the home indicator. */
export function BottomBar({ children }: { children: ReactNode }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingHorizontal: space[4], paddingTop: space[3], paddingBottom: Math.max(insets.bottom, space[3]), backgroundColor: c.card, borderTopWidth: 1, borderTopColor: c.line, gap: space[2],
      shadowColor: c.shadow, shadowOpacity: 0.6, shadowRadius: 12, shadowOffset: { width: 0, height: -4 }, elevation: 8 }}>
      <View style={{ width: '100%', maxWidth: MAX_W - space[4] * 2, alignSelf: 'center', gap: space[2] }}>{children}</View>
    </View>
  );
}

/**
 * Sticky top bar for main tab screens: OgaFarm logo on the left; page actions and the avatar (role menu) on the right.
 * `title` and `subtitle` are shown as the page heading under the bar (see Screen). Notifications are a bottom tab,
 * and day/night is in the role menu, so neither is repeated here.
 */
export function TabHeader({ role, right }: { title: string; subtitle?: string; role: AppRole; right?: ReactNode }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const acct = useAccount();
  const scrolled = useContext(ScrolledCtx);
  const unreadElsewhere = Object.values(acct.unread).some(Boolean);
  return (
    <View style={{ paddingTop: insets.top + space[2], paddingBottom: space[2], backgroundColor: c.bg, borderBottomWidth: 1, borderBottomColor: scrolled ? c.line : 'transparent', zIndex: 2 }}>
      <View style={{ width: '100%', maxWidth: MAX_W, alignSelf: 'center', paddingHorizontal: space[4], flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 }}>
        <View style={{ flex: 1 }}><LogoLockup height={32} /></View>
        {right}
        <Press onPress={() => router.push(`/role-menu?from=${role}` as never)} label={`Account and roles: ${acct.name}`} scaleTo={0.92}>
          <View>
            <Avatar initials={acct.initials} size={40} />
            {unreadElsewhere && <View style={{ position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: c.harvestFill, borderWidth: 2, borderColor: c.bg }} />}
          </View>
        </Press>
      </View>
    </View>
  );
}

/** Toast shown above the tab bar; announced to screen readers. */
export function Toast() {
  const { toastMsg } = useProto();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const path = usePathname();
  // Above the tab bar on main tabs; above the action bar on detail screens
  const [, role, tab] = path.split('/');
  const detail = ['buyer', 'farmer', 'transporter'].includes(role) && !TABS[role as AppRole].some(t => t.name === tab);
  if (!toastMsg) return null;
  return (
    <Animated.View key={toastMsg} entering={FadeInDown.duration(motion.normal)} exiting={FadeOutDown.duration(motion.fast)} pointerEvents="none"
      accessibilityLiveRegion="polite" style={{ position: 'absolute', left: space[4], right: space[4], bottom: insets.bottom + (detail ? 140 : 96), alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: c.ink, paddingHorizontal: 16, paddingVertical: 12, borderRadius: radius.ctl,
        shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 }}>
        <Icon name="check" size={16} color={c.bg} />
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.sm, color: c.bg }}>{toastMsg}</Text>
      </View>
    </Animated.View>
  );
}
