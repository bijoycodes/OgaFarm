/* Light haptic feedback for key actions on phones. Does nothing on web. */
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const on = Platform.OS === 'ios' || Platform.OS === 'android';
export const haptic = {
  tap: () => { if (on) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); },
  select: () => { if (on) Haptics.selectionAsync().catch(() => {}); },
  success: () => { if (on) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); },
  warn: () => { if (on) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {}); }
};
