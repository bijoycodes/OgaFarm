/* Account screens: native stack with swipe-back; the top bar shows the OgaFarm logo, the page shows its own heading. */
import { Stack } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { stackHeader } from '@/theme/tokens';
import { LogoLockup } from '@/ui/Logo';

export default function AuthLayout() {
  const { c } = useTheme();
  return (
    <Stack screenOptions={{ ...stackHeader(c), headerTitleAlign: 'center', headerTitle: () => <LogoLockup height={28} /> }}>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: 'Create account' }} />
      <Stack.Screen name="confirm-email" options={{ title: 'Confirm email' }} />
      <Stack.Screen name="signin" options={{ title: 'Sign in' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Reset password' }} />
    </Stack>
  );
}
