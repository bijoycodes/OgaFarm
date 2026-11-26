/* Transporter · Notifications tab: jobs won, new requests, reviews. States: default, empty. */
import { useState } from 'react';
import { Text, View } from 'react-native';
import { TRANSPORTER_NOTES } from '@/data/transporter';
import { useNav, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Badge, Empty, Press, Rise, T, TextLink, Row } from '@/ui/kit';
import { ListCard } from '@/ui/market';
import { Screen, TabHeader } from '@/ui/screen';

export default function Alerts() {
  const { c } = useTheme();
  const [state] = useScreenState('/transporter/alerts', 'Notifications', ['default', 'empty']);
  const [read, setRead] = useState<string[]>([]);
  const nav = useNav();
  const unread = TRANSPORTER_NOTES.filter(n => n.unread && !read.includes(n.title)).length;
  return (
    <Screen tabs refresh header={<TabHeader role="transporter" title="Notifications" />}>
      {state === 'default' && unread > 0 && (
        <Row between>
          <T v="small" muted>{unread} new</T>
          <TextLink title="Mark all read" onPress={() => { haptic.success(); setRead(TRANSPORTER_NOTES.map(n => n.title)); }} />
        </Row>
      )}
      {state === 'empty' ? <Rise><Empty icon="bell" title="You are all caught up">New requests, jobs and reviews will appear here.</Empty></Rise> : (
        <Rise>
          <ListCard>
            {TRANSPORTER_NOTES.map((n, i) => {
              const isNew = n.unread && !read.includes(n.title);
              return (
                <Press key={n.title} onPress={() => { setRead(r => [...r, n.title]); if (n.href) nav.push(n.href, n.state); }} label={`${isNew ? 'New: ' : ''}${n.title}. ${n.body}`} scaleTo={0.99}
                  style={{ flexDirection: 'row', gap: 12, padding: 14, borderTopWidth: i ? 1 : 0, borderTopColor: c.line, backgroundColor: isNew ? c.primarySoft : 'transparent' }}>
                  <View style={{ width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: isNew ? c.card : c.sunken }}><Icon name={n.icon} size={20} color={isNew ? c.primaryInk : c.muted} /></View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ flex: 1, fontFamily: fonts.bodyBold, fontSize: size.sm, color: c.ink }}>{n.title}</Text>
                      {isNew && <Badge tone="gold" align="center">New</Badge>}
                    </View>
                    <T v="small" muted>{n.body}</T>
                    <T v="xs" muted>{n.when}</T>
                  </View>
                </Press>
              );
            })}
          </ListCard>
        </Rise>
      )}
    </Screen>
  );
}
