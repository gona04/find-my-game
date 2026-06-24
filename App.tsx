import { StatusBar } from 'expo-status-bar';
import { BottomTabs } from './src/app/navigation/BottomTabs';

export default function App() {
  return (
    <>
      <BottomTabs />
      <StatusBar style="dark" />
    </>
  );
}
