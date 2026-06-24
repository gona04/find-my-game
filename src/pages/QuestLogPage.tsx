import React, { memo, useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { games } from '../data/games';

const RewardCard = memo(({ title, subtitle, color }: { title: string; subtitle: string; color: string }) => (
  <View style={[styles.rewardCard, { backgroundColor: color }]}>
    <Text style={styles.rewardIcon}>◆</Text>
    <Text style={styles.rewardTitle}>{title}</Text>
    <Text style={styles.rewardSubtitle}>{subtitle}</Text>
    <TouchableOpacity style={styles.darkButton}><Text style={styles.darkButtonText}>Continue</Text></TouchableOpacity>
  </View>
));

const GameTile = memo(({ title, imageUrl, reward }: { title: string; imageUrl: string; reward: number }) => (
  <View style={styles.gameTile}>
    <Text numberOfLines={1} style={styles.gameTitle}>{title}</Text>
    <Image source={{ uri: imageUrl }} style={styles.gameImage} />
    <Text style={styles.rewardAmount}>{reward} 💎</Text>
    <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
  </View>
));

export const QuestLogPage = () => {
  const keepPlaying = useMemo(() => games.slice(0, 3), []);
  const recommendations = useMemo(() => games.slice(3, 6), []);

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Quest Log</Text>
          <Text style={styles.gemCount}>1770 💎</Text>
        </View>

        <View style={styles.claimedBanner}>
          <View style={styles.bannerBadge}><Text style={styles.bannerBadgeText}>✓</Text></View>
          <Text style={styles.bannerTitle}>All done! Come back tomorrow!</Text>
          <Text style={styles.claimedText}>Claimed</Text>
        </View>

        <Text style={styles.sectionHeader}>Extra Rewards</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCards}>
          <RewardCard title="Daily Streak" subtitle="Get up to 4054 gems" color="#FFD153" />
          <RewardCard title="2x Boost" subtitle="2x gems on new games!" color="#A8F66A" />
          <RewardCard title="Invite a Friend" subtitle="And get bonus coins" color="#FF9DA8" />
        </ScrollView>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionHeader}>Keep Playing</Text>
          <Text style={styles.seeAll}>See All →</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCards}>
          {keepPlaying.map((game, index) => <GameTile key={game.id} title={game.title} imageUrl={game.imageUrl} reward={[844, 322, 50762][index]} />)}
        </ScrollView>

        <Text style={styles.sectionHeader}>Recommended For You</Text>
        {recommendations.map((game) => (
          <View key={game.id} style={styles.wideCard}>
            <Text style={styles.wideTitle}>{game.title}</Text>
            <Image source={{ uri: game.imageUrl }} style={styles.wideImage} />
            <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Play and earn</Text></TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#050505' },
  gemCount: { fontSize: 22, fontWeight: 'bold', color: '#050505' },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#050505' },
  claimedBanner: { backgroundColor: '#FFD153', borderRadius: 10, padding: 15, marginBottom: 24, flexDirection: 'row', alignItems: 'center', gap: 10 },
  bannerBadge: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center' },
  bannerBadgeText: { color: '#9EFF62', fontSize: 24, fontWeight: 'bold' },
  bannerTitle: { flex: 1, fontSize: 16, fontWeight: 'bold' },
  claimedText: { fontWeight: 'bold', color: '#4B5563' },
  horizontalCards: { gap: 14, paddingBottom: 22 },
  rewardCard: { width: 190, padding: 15, borderRadius: 16 },
  rewardIcon: { fontSize: 38, color: '#050505' },
  rewardTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  rewardSubtitle: { fontSize: 15, marginTop: 2 },
  darkButton: { marginTop: 16, backgroundColor: '#050505', padding: 12, alignItems: 'center', borderRadius: 24 },
  darkButtonText: { color: '#fff', fontWeight: 'bold' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAll: { fontWeight: 'bold', fontSize: 15 },
  gameTile: { width: 210, borderRadius: 16, backgroundColor: '#F7F7FB', overflow: 'hidden', borderWidth: 1, borderColor: '#E8E8EF' },
  gameTitle: { fontSize: 16, fontWeight: 'bold', padding: 10 },
  gameImage: { height: 120, width: '100%' },
  rewardAmount: { fontSize: 22, fontWeight: 'bold', paddingHorizontal: 14, paddingTop: 10 },
  progressTrack: { height: 4, backgroundColor: '#D8D8E0', margin: 14, borderRadius: 4 },
  progressFill: { height: 4, width: '44%', backgroundColor: '#050505', borderRadius: 4 },
  wideCard: { padding: 15, borderRadius: 16, backgroundColor: '#F7F7FB', marginBottom: 20, overflow: 'hidden' },
  wideTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  wideImage: { height: 160, borderRadius: 12, marginBottom: 10 },
  button: { marginTop: 10, backgroundColor: '#fff', padding: 8, alignItems: 'center', borderRadius: 8 },
  buttonText: { fontWeight: 'bold' },
});
