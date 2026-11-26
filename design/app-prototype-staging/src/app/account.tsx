/* Account and settings — one screen for every role, opened from the avatar menu.
   (Switching and adding roles, and signing out, are in the avatar menu itself.) */
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useAccount, useProto, useScreenState } from '@/proto/Proto';
import { Avatar, Card, LookSwitch, Rise, Row, T } from '@/ui/kit';
import { ListCard, ListRow } from '@/ui/market';
import { Screen } from '@/ui/screen';

const CONTACT: Record<string, [phone: string, email: string, address: string]> = {
  ngozi: ['+234 806 555 0142', 'ngozi.eze@example.com', 'Home · 14 Okpanam Road, Asaba'],
  emeka: ['+234 803 123 4567', 'emeka.okafor@example.com', 'Farm · Farm gate, Issele-Uku'],
  sunday: ['+234 802 441 9087', 'sunday.ike@example.com', 'Base · Issele-Uku, Delta']
};

export default function Account() {
  useScreenState('/account', 'Account and settings');
  const acct = useAccount();
  const { toast } = useProto();
  const open = (t: string) => () => toast(`${t} opens`);
  const [phone, email, address] = CONTACT[acct.key];
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Account and settings' }} />
      <Rise>
        <Card>
          <Row gap={14}>
            <Avatar initials={acct.initials} size={60} />
            <View style={{ flex: 1, gap: 2 }}>
              <T v="h3">{acct.name}</T>
              <T v="small" muted>{phone}</T>
              <T v="xs" muted>{email}</T>
            </View>
          </Row>
        </Card>
      </Rise>

      <Rise i={1} style={{ gap: 8 }}>
        <T v="eyebrow">Your details</T>
        <ListCard>
          <ListRow first icon="user" title="Personal details" sub="Name, phone, email" onPress={open('Personal details')} />
          <ListRow icon="pin" title="Saved addresses" sub={address} onPress={open('Saved addresses')} />
          <ListRow icon="card" title="Payment methods" sub="Cards saved with our payment provider" onPress={open('Payment methods')} />
        </ListCard>
      </Rise>

      <Rise i={2} style={{ gap: 8 }}>
        <T v="eyebrow">Settings</T>
        <ListCard>
          <ListRow first icon="bell" title="Notification settings" sub="Orders, deliveries, reminders" onPress={open('Notification settings')} />
          <ListRow icon="lock" title="Password and security" onPress={open('Password and security')} />
          <ListRow icon="shield" title="Privacy and data" onPress={open('Privacy and data')} />
        </ListCard>
      </Rise>

      <Rise i={3} style={{ gap: 8 }}>
        <T v="eyebrow">Appearance</T>
        <LookSwitch />
      </Rise>

      <Rise i={4} style={{ gap: 8 }}>
        <ListCard>
          <ListRow first icon="chat" title="Help and support" onPress={open('Help and support')} />
          <ListRow icon="doc" title="Terms and privacy policy" onPress={open('Terms and privacy policy')} />
        </ListCard>
        <T v="xs" muted center>OgaFarm prototype · sample data</T>
      </Rise>
    </Screen>
  );
}
