/* Bottom sheet: the shade fades in on its own while only the panel slides up (no sliding shade).
   Close by tapping the shade, the close button, or swiping the top of the panel down.
   Follows Reduce Motion (Reanimated skips the animation when it is on). */
import { useEffect, useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, View, useWindowDimensions } from 'react-native';
import { GestureDetector, GestureHandlerRootView, usePanGesture } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';

const OPEN = { duration: 320, easing: Easing.bezier(0.2, 0.9, 0.3, 1) };    // quick start, soft landing
const CLOSE = { duration: 220, easing: Easing.bezier(0.4, 0, 1, 1) };        // exits a little faster than it enters

export function BottomSheet({ visible, onClose, header, children, footer }:
  { visible: boolean; onClose: () => void; header: ReactNode; children: ReactNode; footer?: ReactNode }) {
  const { c, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: screenH } = useWindowDimensions();
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(0);   // 0 = hidden, 1 = open
  const drag = useSharedValue(0);       // how far the panel is pulled down by a finger
  const panelH = useSharedValue(screenH * 0.8);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      drag.value = 0;
      progress.value = withTiming(1, OPEN);
    } else if (mounted) {
      progress.value = withTiming(0, CLOSE, done => { if (done) runOnJS(setMounted)(false); });
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const pan = usePanGesture({
    activeOffsetY: 6,
    onUpdate: e => { drag.value = Math.max(0, e.translationY); },
    onDeactivate: e => {
      if (e.translationY > 90 || e.velocityY > 900) runOnJS(onClose)();
      else drag.value = withSpring(0, { damping: 22, stiffness: 260 });
    }
  });

  const shade = useAnimatedStyle(() => ({
    opacity: progress.value * Math.max(0.35, 1 - drag.value / Math.max(panelH.value, 1))
  }));
  const panel = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * (panelH.value + 40) + drag.value }]
  }));

  if (!mounted) return null;
  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1, justifyContent: 'flex-end' }}>
        {/* soft brand-tinted shade, fades only */}
        <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: scheme === 'dark' ? 'rgba(0, 0, 0, 0.55)' : 'rgba(16, 38, 26, 0.38)' }, shade]}>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" style={{ flex: 1 }} />
        </Animated.View>

        {/* the panel moves up with the keyboard, so a search box never hides the list */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} pointerEvents="box-none" style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Animated.View onLayout={e => { panelH.value = e.nativeEvent.layout.height; }}
          style={[{ maxHeight: '86%', backgroundColor: c.bg, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: Math.max(insets.bottom, space[3]),
            shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: -6 }, elevation: 16 }, panel]}>
          {/* grab handle + header: swipe down here to close */}
          <GestureDetector gesture={pan}>
            <View>
              <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 2 }}>
                <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: c.lineStrong }} />
              </View>
              {header}
            </View>
          </GestureDetector>
          {children}
          {footer}
        </Animated.View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
}
