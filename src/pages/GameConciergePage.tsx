import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, Pressable, View } from 'react-native';
import { Button } from '../components/common/Button';
import { RecommendationList } from '../components/recommendations/RecommendationList';
import { StreamingIndicator } from '../components/recommendations/StreamingIndicator';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { useGameSearch } from '../hooks/useGameSearch';

const placeholders = ['Games like Prince of Persia...', 'Something relaxing before bed...', 'I want a game that challenges me logically...', 'I only have 10 minutes...', 'I want the highest rewards...'];
const chips = ['Story', 'Rewards', 'Adventure', 'Logic', 'Competitive', 'Relaxing', 'Surprise Me'];

export const GameConciergePage = () => {
  const { query, setQuery, recommendations, loading, streamingStatus, error, routingPath, submitSearch } = useGameSearch();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  useEffect(() => { const interval = setInterval(() => setPlaceholderIndex((current) => (current + 1) % placeholders.length), 3000); return () => clearInterval(interval); }, []);
  const placeholder = useMemo(() => placeholders[placeholderIndex], [placeholderIndex]);
  const onSubmit = useCallback(() => { void submitSearch(); }, [submitSearch]);
  const onChip = useCallback((chip: string) => { const value = chip === 'Surprise Me' ? 'Surprise me with something rewarding and fun' : chip; setQuery(value); void submitSearch(value); }, [setQuery, submitSearch]);
  return <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><Text style={styles.title}>✨ AI Game Concierge</Text><Text style={styles.subtitle}>Tell us what you'd like to play today</Text><TextInput value={query} onChangeText={setQuery} placeholder={placeholder} placeholderTextColor={colors.textSecondary} multiline style={styles.input} textAlignVertical="top" returnKeyType="search" /><Button title="Find Games" onPress={onSubmit} loading={loading} disabled={loading} /><View style={styles.chips}>{chips.map((chip) => <Pressable key={chip} onPress={() => onChip(chip)} style={styles.chip}><Text style={styles.chipText}>{chip}</Text></Pressable>)}</View>{loading && routingPath !== 'keyword' ? <StreamingIndicator status={streamingStatus} /> : null}{routingPath ? <Text style={styles.path}>Matched via {routingPath === 'keyword' ? 'local intent extraction' : 'AI intent extraction'}</Text> : null}{error ? <Text style={styles.error}>{error}</Text> : null}<RecommendationList recommendations={recommendations} /></ScrollView>;
};
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, paddingBottom: spacing.xxl }, title: { color: colors.textPrimary, fontSize: 30, fontWeight: '900', textAlign: 'center', marginTop: spacing.lg }, subtitle: { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg }, input: { minHeight: 150, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: spacing.borderRadius.lg, padding: spacing.lg, color: colors.textPrimary, fontSize: 18, marginBottom: spacing.md }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center', marginVertical: spacing.lg }, chip: { backgroundColor: colors.badge, borderRadius: spacing.borderRadius.xl, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }, chipText: { color: colors.badgeText, fontWeight: '800' }, error: { color: colors.badgeText, textAlign: 'center', marginBottom: spacing.md, fontWeight: '700' }, path: { color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.md, fontWeight: '700' } });
