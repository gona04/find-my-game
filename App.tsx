import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { BottomTabs } from './src/app/navigation/BottomTabs';

export default function App(): React.ReactElement {
  return (
    <>
      <BottomTabs />
      <StatusBar style="dark" />
    </>
  );
}
