/* Transporter · My jobs: active and finished deliveries, with earnings. States: default, empty. */
import { useState } from 'react';
import { Text, View } from 'react-native';
import { useVerified } from '@/components/transporter';
import { naira } from '@/data/sample';
import { JOBS } from '@/data/transporter';
import { useNav, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, size } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Button, Card, Empty, Press, Rise, Row, Status, T } from '@/ui/kit';
import { Screen, TabHeader } from '@/ui/screen';

export default function Jobs() {
  const { c } = useTheme();
  const [state] = useScreenState('/transporter/jobs', 'My jobs', ['default', 'empty']);
  const verified = useVerified();
  const [tab, setTab] = useState<'Active' | 'Done'>('Active');
  const nav = useNav();
  const empty = state === 'empty' || !verified;
  const list = JOBS.filter(j => (tab === 'Done') === (j.status === 'Delivered'));
  const earned = JOBS.filter(j => j.status === 'Delivered').reduce((a, j) => a + j.price, 0);
  return (
    <Screen tabs refresh header={<TabHeader role="transporter" title="My jobs" />}>
      {empty ? (
        <Rise><Empty icon="truck" title="No jobs yet" action={<Button title="See delivery requests" onPress={() => nav.replace('/transporter/requests')} />}>When a buyer accepts your quote, the job appears here with the pickup and drop-off details.</Empty></Rise>
      ) : <>
        <View accessibilityRole="tablist" style={{ flexDirection: 'row', padding: 4, gap: 4, borderRadius: radius.md, backgroundColor: c.sunken }}>
          {(['Active', 'Done'] as const).map(t => {
            const n = JOBS.filter(j => (t === 'Done') === (j.status === 'Delivered')).length;
            return (
              <Press key={t} onPress={() => { haptic.select(); setTab(t); }} role="tab" selected={tab === t} label={`${t}, ${n}`}
                style={{ flex: 1, minHeight: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: tab === t ? c.card : 'transparent' }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: size.sm, color: tab === t ? c.primaryInk : c.muted }}>{t} · {n}</Text>
              </Press>
            );
          })}
        </View>
        {tab === 'Done' && <Rise><Card tone="soft"><Row between><T v="label">Earned from these jobs</T><Text style={{ fontFamily: fonts.display, fontSize: size.xl, color: c.ink, fontVariant: ['tabular-nums'] }}>{naira(earned)}</Text></Row><T v="xs" muted>Buyers pay you the delivery price. OgaFarm takes no commission.</T></Card></Rise>}
        {list.map((j, i) => (
          <Rise key={j.id} i={i}>
            <Card onPress={() => nav.push('/transporter/job', j.state)}>
              <Row between><Row gap={8}><Icon name="route" size={16} color={c.muted} /><T v="xs" muted>{j.id}</T></Row><Status s={j.status} /></Row>
              <View style={{ gap: 2 }}><T v="label">{j.route}</T><T v="xs" muted>{j.cargo} · {j.when}</T></View>
              <Row between>
                <Text style={{ fontFamily: fonts.display, fontSize: size.lg, color: c.ink, fontVariant: ['tabular-nums'] }}>{naira(j.price)}</Text>
                <Row gap={4}><T v="small" color={c.primaryInk} bold>{j.status === 'Delivered' ? 'View' : 'Open job'}</T><Icon name="chev" size={14} color={c.primaryInk} /></Row>
              </Row>
            </Card>
          </Rise>
        ))}
      </>}
    </Screen>
  );
}
