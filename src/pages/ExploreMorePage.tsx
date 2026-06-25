import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RecommendationList } from '../components/recommendations/RecommendationList';
import { StreamingIndicator } from '../components/recommendations/StreamingIndicator';
import { useGameSearch } from '../hooks/useGameSearch';

const placeholders = [
  'Games like Prince of Persia...',
  'Something relaxing before bed...',
  'I want a game that challenges me logically...',
  'I only have 10 minutes...',
  'I want the highest rewards...',
];
// const suggestedSearches = ['Story adventure', 'Highest rewards', 'Quick puzzle', 'Relaxing idle', 'Competitive cards', 'Music rhythm'];
const recentSearches = ['Cozy games before bed', 'Games with lots of gems', 'Short logic challenge'];

export const ExploreMorePage = () => {
  const { query, setQuery, recommendations, loading, streamingStatus, error, routingPath, submitSearch } = useGameSearch();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPlaceholderIndex((current) => (current + 1) % placeholders.length), 3000);
    return () => clearInterval(interval);
  }, []);

  const placeholder = useMemo(() => placeholders[placeholderIndex], [placeholderIndex]);
  const runSearch = useCallback(() => { void submitSearch(); }, [submitSearch]);
  const runSuggestedSearch = useCallback((value: string) => {
    setQuery(value);
    void submitSearch(value);
  }, [setQuery, submitSearch]);

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Explore More</Text>
          <Text style={styles.gemCount}>1770 💎</Text>
        </View>

        <View style={styles.searchBanner}>
          <View style={styles.bannerCopy}>
            <Text style={styles.bannerTitle}>Find your next reward game</Text>
            <Text style={styles.bannerText}>Tell us your mood, time, or reward goal.</Text>
          </View>
          <View style={styles.bannerIcon}><Text style={styles.bannerIconText}>◆</Text></View>
        </View>

        <Text style={styles.sectionHeader}>Search Recommendations</Text>
        <View style={styles.card}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={placeholder}
            placeholderTextColor="#8B8B96"
            multiline
            style={styles.input}
            textAlignVertical="top"
          />
          <TouchableOpacity disabled={loading} onPress={runSearch} style={[styles.primaryButton, loading && styles.disabledButton]}>
            <Text style={styles.primaryButtonText}>{loading ? 'Finding games...' : 'Find Games'}</Text>
          </TouchableOpacity>
        </View>

       {/*  <Text style={styles.sectionHeader}>Suggested Searches</Text>
        <View style={styles.card}>
          <View style={styles.chips}>
            {suggestedSearches.map((chip) => (
              <Pressable key={chip} onPress={() => runSuggestedSearch(chip)} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </Pressable>
            ))}
          </View>
        </View> */}

        <Text style={styles.sectionHeader}>Recent Searches</Text>
        <View style={styles.card}>
          {recentSearches.map((search) => (
            <TouchableOpacity key={search} onPress={() => runSuggestedSearch(search)} style={styles.recentRow}>
              <Text style={styles.recentText}>{search}</Text>
              <Text style={styles.recentArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading && routingPath !== 'keyword' ? <StreamingIndicator status={streamingStatus} /> : null}
        {routingPath ? <Text style={styles.routeText}>Matched with {routingPath === 'keyword' ? 'catalog search' : 'AI preference extraction'}</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.sectionHeader}>Recommendation Cards</Text>
        <RecommendationList recommendations={recommendations} />

        {!recommendations.length ? (
          <View style={styles.previewCard}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80' }} style={styles.previewImage} />
            <Text style={styles.previewTitle}>Personalized picks will appear here</Text>
            <Text style={styles.previewText}>Search by mood, rewards, genre, or time to get explainable matches.</Text>
          </View>
        ) : null}
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
  searchBanner: { backgroundColor: '#A8F66A', borderRadius: 16, padding: 15, marginBottom: 24, flexDirection: 'row', alignItems: 'center' },
  bannerCopy: { flex: 1 },
  bannerTitle: { fontSize: 20, fontWeight: 'bold', color: '#050505' },
  bannerText: { fontSize: 15, marginTop: 4, color: '#202020' },
  bannerIcon: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center' },
  bannerIconText: { color: '#A8F66A', fontSize: 30 },
  card: { padding: 15, borderRadius: 16, backgroundColor: '#F7F7FB', marginBottom: 22 },
  input: { minHeight: 92, backgroundColor: '#fff', borderRadius: 12, padding: 12, color: '#050505', fontSize: 16, marginBottom: 10 },
  primaryButton: { marginTop: 10, backgroundColor: '#050505', padding: 14, alignItems: 'center', borderRadius: 24 },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  disabledButton: { opacity: 0.7 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { backgroundColor: '#FFD153', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20 },
  chipText: { fontWeight: 'bold', color: '#050505' },
  recentRow: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recentText: { color: '#050505', fontWeight: '700' },
  recentArrow: { color: '#050505', fontWeight: 'bold' },
  routeText: { textAlign: 'center', color: '#6B7280', fontWeight: '700', marginBottom: 12 },
  errorText: { textAlign: 'center', color: '#B45309', fontWeight: '700', marginBottom: 12 },
  previewCard: { padding: 15, borderRadius: 16, backgroundColor: '#FFD153', marginTop: 4 },
  previewImage: { height: 130, borderRadius: 12, marginBottom: 12 },
  previewTitle: { fontSize: 18, fontWeight: 'bold', color: '#050505' },
  previewText: { marginTop: 4, color: '#202020' },
});
