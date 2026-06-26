import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RecommendationList } from "../components/recommendations/recomendations-list.component";
import { StreamingIndicator } from "../components/recommendations/recomendations-streaming.component";
import { useGameSearch } from "../hooks/useGameSearch";
import { placeholders } from "../data/seach-placeholder";
import { recentSearches } from "../data/recent-search";
import { AppScreen } from "../components/layout/app-screen.component";
import { Header } from "../components/layout/header.component";
import { BannerCard } from "../components/common/banner-card.component";
import { colors } from "../theme/colors";
import { SectionHeading } from "../components/common/section-heading.component";
import { SearchCard } from "../components/search-card/search-card.component";
import { RecentSearchList } from "../components/recent-search/recent-search-list.component";

export const ExploreMorePage = () => {
  const {
    query,
    setQuery,
    recommendations,
    loading,
    streamingStatus,
    error,
    routingPath,
    submitSearch,
  } = useGameSearch();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () =>
        setPlaceholderIndex((current) => (current + 1) % placeholders.length),
      3000,
    );
    return () => clearInterval(interval);
  }, []);

  const placeholder = useMemo(
    () => placeholders[placeholderIndex],
    [placeholderIndex],
  );
  const runSearch = useCallback(() => {
    void submitSearch();
  }, [submitSearch]);
  const runSuggestedSearch = useCallback(
    (value: string) => {
      setQuery(value);
      void submitSearch(value);
    },
    [setQuery, submitSearch],
  );

  return (
    <AppScreen>
      <Header title="Explore More" />

      <BannerCard
        backgroundColor={colors.green}
        icon="◆"
        iconColor={colors.green}
        title="Find your next reward game"
        subtitle="Tell us your mood, time, or reward goal."
        subtitleColor={colors.blackShadeOne}
      />

      <SectionHeading title="Search Recommendations" />
      <SearchCard
        query={query}
        placeholder={placeholder}
        loading={loading}
        onChangeText={setQuery}
        onSearch={runSearch}
        />

      <SectionHeading title="Recent Searches"/>
         <RecentSearchList
        searches={recentSearches}
        onSelect={runSuggestedSearch}
    />

      {loading && routingPath !== "keyword" ? (
        <StreamingIndicator status={streamingStatus} />
      ) : null}
      {routingPath ? (
        <Text style={styles.routeText}>
          Matched with{" "}
          {routingPath === "keyword"
            ? "catalog search"
            : "AI preference extraction"}
        </Text>
      ) : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <SectionHeading title="Recommendation Cards"/>
      <RecommendationList recommendations={recommendations} />

      {!recommendations.length ? (
        <View style={styles.previewCard}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
            }}
            style={styles.previewImage}
          />
          <Text style={styles.previewTitle}>
            Personalized picks will appear here
          </Text>
          <Text style={styles.previewText}>
            Search by mood, rewards, genre, or time to get explainable matches.
          </Text>
        </View>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#050505" },
  gemCount: { fontSize: 22, fontWeight: "bold", color: "#050505" },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#050505",
  },
  searchBanner: {
    backgroundColor: "#A8F66A",
    borderRadius: 16,
    padding: 15,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  bannerCopy: { flex: 1 },
  bannerTitle: { fontSize: 20, fontWeight: "bold", color: "#050505" },
  bannerText: { fontSize: 15, marginTop: 4, color: "#202020" },
  bannerIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#050505",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerIconText: { color: "#A8F66A", fontSize: 30 },
  card: {
    padding: 15,
    borderRadius: 16,
    backgroundColor: "#F7F7FB",
    marginBottom: 22,
  },
  recentRow: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recentText: { color: "#050505", fontWeight: "700" },
  recentArrow: { color: "#050505", fontWeight: "bold" },
  routeText: {
    textAlign: "center",
    color: "#6B7280",
    fontWeight: "700",
    marginBottom: 12,
  },
  errorText: {
    textAlign: "center",
    color: "#B45309",
    fontWeight: "700",
    marginBottom: 12,
  },
  previewCard: {
    padding: 15,
    borderRadius: 16,
    backgroundColor: "#FFD153",
    marginTop: 4,
  },
  previewImage: { height: 130, borderRadius: 12, marginBottom: 12 },
  previewTitle: { fontSize: 18, fontWeight: "bold", color: "#050505" },
  previewText: { marginTop: 4, color: "#202020" },
});
