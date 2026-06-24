import React, { useCallback, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { DiscoverPage } from '../../pages/DiscoverPage';
import { GameConciergePage } from '../../pages/GameConciergePage';

type Tab = 'Discover' | 'Surprise';
export const BottomTabs = () => {
  const [tab, setTab] = useState<Tab>('Discover');
  const onDiscover = useCallback(() => setTab('Discover'), []);
  const onSurprise = useCallback(() => setTab('Surprise'), []);
  return <SafeAreaView style={styles.safe}><View style={styles.screen}>{tab === 'Discover' ? <DiscoverPage /> : <GameConciergePage />}</View><View style={styles.tabs}><Pressable onPress={onDiscover} style={[styles.tab, tab === 'Discover' && styles.active]}><Text style={[styles.label, tab === 'Discover' && styles.activeLabel]}>Discover</Text></Pressable><Pressable onPress={onSurprise} style={[styles.tab, tab === 'Surprise' && styles.active]}><Text style={[styles.label, tab === 'Surprise' && styles.activeLabel]}>✨ Surprise Me</Text></Pressable></View></SafeAreaView>;
};
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, screen: { flex: 1 }, tabs: { flexDirection: 'row', padding: spacing.md, gap: spacing.sm, backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1 }, tab: { flex: 1, alignItems: 'center', padding: spacing.md, borderRadius: spacing.borderRadius.xl }, active: { backgroundColor: colors.primaryLight }, label: { color: colors.textSecondary, fontWeight: '800' }, activeLabel: { color: colors.primary } });
