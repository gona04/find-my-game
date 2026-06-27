import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {ScrollView, View} from 'react-native'
import { BottomTabs } from './src/shared/components/layout/bottom-navigation.component';

export default function App(): React.ReactElement {
  return (
    <>
      <BottomTabs />
      <StatusBar style="dark" />
    </>
  );
}
