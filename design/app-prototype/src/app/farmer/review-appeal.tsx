/* Farmer · Ask us to check a review (V2). The review stays visible while it is checked. States: default, submitted. */
import { Stack } from 'expo-router';
import { useState } from 'react';
import { useNav, useProto, useScreenState } from '@/proto/Proto';
import { haptic } from '@/proto/haptics';
import { Alert, Button, Card, Field, Rise, Row, T, Timeline } from '@/ui/kit';
import { Choice, Rating, TextArea } from '@/ui/market';
import { Screen } from '@/ui/screen';
import { Select } from '@/ui/select';

const WHY = ['Abusive or insulting', 'False information', 'Shares private information', 'Discriminatory', 'No real order behind it', 'Posted by a competitor'];

export default function ReviewAppeal() {
  const [state, setState] = useScreenState('/farmer/review-appeal', 'Check a review', ['default', 'submitted']);
  const sent = state === 'submitted';
  const [why, setWhy] = useState(0);
  const [text, setText] = useState('The order was collected in full and the buyer thanked us on the phone. Calling us thieves is insulting and not true.');
  const [files, setFiles] = useState(0);
  const nav = useNav();
  const { toast } = useProto();
  const steps: [string, string?][] = [['Request logged', 'Today, 9:10 am'], ['First check', 'Within 1 working day'], ['Investigation', ''], ['Decision', '']];

  return (
    <Screen keyboard footer={sent ? <Button title="Back to reviews" variant="secondary" onPress={() => nav.replace('/farmer/reviews')} /> : <Row gap={10}>
      <Button title="Cancel" variant="ghost" onPress={() => nav.replace('/farmer/reviews')} />
      <Button title="Send request" icon="flag" disabled={!text.trim()} onPress={() => { haptic.success(); setState('submitted'); }} style={{ flex: 1 }} />
    </Row>}>
      <Stack.Screen options={{ title: 'Check a review' }} />
      <Rise style={{ gap: 4 }}>
        <T v="h1">Ask us to check a review</T>
        <T v="small" muted>The review stays visible while we look into it. We contact both sides before deciding.</T>
      </Rise>
      <Rise i={1}>
        <Card tone="sunken">
          <Row between><T v="label">Chuka Obi · 17 Nov</T><Rating value={1} /></Row>
          <T v="body">“Terrible farm, never buy from them. They are thieves.”</T>
          <T v="xs" muted>Linked to order OGF-10322 · collected 16 Nov</T>
        </Card>
      </Rise>
      {sent ? <>
        <Rise i={2}><Alert tone="ok" icon="check" title="Request received · case RV-118">We will email you after the first check. You can add more information at any time.</Alert></Rise>
        <Rise i={3}><Card><T v="h3">Progress</T><Timeline steps={steps} done={1} /></Card></Rise>
      </> : <>
        <Rise i={2}>
          <Field label="Why should we check it?" required><Select label="Reason" options={WHY} value={WHY[why]} onChange={v => setWhy(WHY.indexOf(v))} /></Field>
        </Rise>
        <Rise i={3}>
          <Card>
            <Field label="Explain what happened" required><TextArea value={text} onChangeText={setText} /></Field>
            <Button title={files ? `${files} file${files > 1 ? 's' : ''} added · add more` : 'Add evidence (optional)'} icon={files ? 'check' : 'upload'} variant="secondary" small onPress={() => { setFiles(n => n + 1); toast('Evidence added'); }} />
            <T v="xs" muted>Messages, photos or receipts.</T>
          </Card>
        </Rise>
      </>}
    </Screen>
  );
}
