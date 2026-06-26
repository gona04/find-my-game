import React, { memo, useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { QuestLogPage } from '../../pages/QuestLogPage';
import { ExploreMorePage } from '../../pages/ExploreMorePage';
import { spacingSize } from '../../theme/spacing';

type Tab = 'Quest Log' | 'Explore More';
type IconProps = { active: boolean };

const iconColor = (active: boolean) => (active ? '#1A1A2E' : '#9CA3AF');

const ScrollText = memo(({ active }: IconProps) => (
  <View style={[styles.iconBox, { borderColor: iconColor(active) }]}>
    <View style={[styles.iconLine, { backgroundColor: iconColor(active), width: 14 }]} />
    <View style={[styles.iconLine, { backgroundColor: iconColor(active), width: 10 }]} />
    <View style={[styles.iconLine, { backgroundColor: iconColor(active), width: 12 }]} />
  </View>
));

const Compass = memo(({ active }: IconProps) => (
  <View style={[styles.compass, { borderColor: iconColor(active) }]}>
    <View style={[styles.needle, { borderBottomColor: iconColor(active) }]} />
  </View>
));

export const BottomTabs = () => {
  const [tab, setTab] = useState<Tab>('Quest Log');
  const showQuestLog = useCallback(() => setTab('Quest Log'), []);
  const showExploreMore = useCallback(() => setTab('Explore More'), []);
  const questActive = tab === 'Quest Log';
  const exploreActive = tab === 'Explore More';

  return (
    <>
     <View style={styles.safeArea}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.screen}>{questActive ? <QuestLogPage /> : <ExploreMorePage />}</View>
            </ScrollView>
            
            </View>
      <View style={styles.tabs}>
        <Pressable onPress={showQuestLog} style={styles.tab}>
          <ScrollText active={questActive} />
          <Text style={[styles.label, questActive && styles.activeLabel]}>Quest Log</Text>
        </Pressable>
        <Pressable onPress={showExploreMore} style={styles.tab}>
          <Compass active={exploreActive} />
          <Text style={[styles.label, exploreActive && styles.activeLabel]}>Explore More</Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
    scrollContent: { paddingHorizontal: spacingSize.ss_10, paddingTop: spacingSize.ss_24, paddingBottom: spacingSize.ss_20 },
  safeArea: { flex: 1, backgroundColor: '#fff' },
  screen: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EFEFF4',
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 8,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  label: { color: '#9CA3AF', fontSize: 12, fontWeight: '700' },
  activeLabel: { color: '#1A1A2E' },
  iconBox: { width: 24, height: 24, borderWidth: 2, borderRadius: 5, alignItems: 'center', justifyContent: 'center', gap: 3 },
  iconLine: { height: 2, borderRadius: 2 },
  compass: { width: 24, height: 24, borderWidth: 2, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  needle: { width: 0, height: 0, borderLeftWidth: 4, borderRightWidth: 4, borderBottomWidth: 13, borderLeftColor: 'transparent', borderRightColor: 'transparent', transform: [{ rotate: '35deg' }] },
});
