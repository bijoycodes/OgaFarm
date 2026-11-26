/* Stack for a role: its tabs plus detail screens pushed on top (native header with swipe-back).
   Also makes sure the sample account holds this role (e.g. jumping to farmer screens uses Emeka). */
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { DEFAULT_ACCOUNT, type AppRole } from '@/data/roles';
import { useAccount } from '@/proto/Proto';
import { useTheme } from '@/theme/ThemeProvider';
import { stackHeader } from '@/theme/tokens';

/** `sheets` = routes in this role shown as native form sheets (e.g. buyer filters). */
export function RoleStack({ role, sheets = [] }: { role: AppRole; sheets?: string[] }) {
  const { c } = useTheme();
  const { roles, setAccount } = useAccount();
  const has = roles.includes(role);
  useEffect(() => { if (!has) setAccount(DEFAULT_ACCOUNT[role]); }, [has, role, setAccount]);
  return (
    <Stack screenOptions={stackHeader(c)}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Back' }} />
      {sheets.map(name => (
        <Stack.Screen key={name} name={name} options={{ presentation: 'formSheet', headerShown: false, sheetAllowedDetents: name === 'stock' ? [0.62, 1] : [0.88, 1], sheetGrabberVisible: true, sheetCornerRadius: 16, contentStyle: { backgroundColor: c.bg } }} />
      ))}
    </Stack>
  );
}
