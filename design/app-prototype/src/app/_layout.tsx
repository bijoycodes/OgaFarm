/* App root: fonts, splash, theme, native stack. Two native sheets: the role menu and the prototype "Screens" helper. */
import { Lora_500Medium, Lora_600SemiBold, Lora_600SemiBold_Italic } from '@expo-google-fonts/lora';
import { NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold, NunitoSans_800ExtraBold } from '@expo-google-fonts/nunito-sans';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScreensButton } from '@/components/ScreensButton';
import { ProtoProvider } from '@/proto/Proto';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { fonts, stackHeader } from '@/theme/tokens';
import { Toast } from '@/ui/screen';

SplashScreen.preventAutoHideAsync();

function Root() {
  const { c, scheme } = useTheme();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = { ...base, colors: { ...base.colors, primary: c.primary, background: c.bg, card: c.card, text: c.ink, border: c.line, notification: c.harvestFill } };
  return (
    <NavThemeProvider value={navTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg }, headerTitleStyle: { fontFamily: fonts.bodyBold } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="buyer" />
          <Stack.Screen name="farmer" />
          <Stack.Screen name="transporter" />
          <Stack.Screen name="account" options={{ ...stackHeader(c), headerShown: true, title: 'Account and settings' }} />
          <Stack.Screen name="role-menu" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.62, 0.95], sheetGrabberVisible: true, sheetCornerRadius: 20, contentStyle: { backgroundColor: c.bg } }} />
          <Stack.Screen name="screens" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.8, 1], sheetGrabberVisible: true, sheetCornerRadius: 20, contentStyle: { backgroundColor: c.bg } }} />
        </Stack>
        <ScreensButton />
        <Toast />
      </View>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({ Lora_500Medium, Lora_600SemiBold, Lora_600SemiBold_Italic, NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold, NunitoSans_800ExtraBold });
  useEffect(() => { if (loaded || error) SplashScreen.hideAsync(); }, [loaded, error]);
  if (!loaded && !error) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ProtoProvider>
            <Root />
          </ProtoProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
