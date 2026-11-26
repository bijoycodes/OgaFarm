import { Redirect } from 'expo-router';
/* The app opens on the welcome screen. */
export default function Index() { return <Redirect href="/auth/welcome" />; }
