import React from "react";
import { AppScreen, Header } from "../../../shared/components/layout";
import { BannerCard, SectionHeading } from "../../../shared/components/common";
import { SearchCard } from "../components/search-card.component";
import { RecentSearchList } from "../components/recent-search-list.component";
import { RecommendationStatus } from "../../recommendations/components/recommendation-status.component";
import { RecommendationSection } from "../../recommendations/components/recommendation-section.component";
import { useExploreMore } from "../../../hooks/use-explore-more.hook";
import { colors } from "../../../theme/colors";

export function ExploreMoreScreen() {
  const {
    query,
    searchPlaceholder,
    recommendations,
    loading,
    routingPath,
    error,
    hasZeroMatch,
    recentSearches,
    onQueryChange,
    onSearch,
    onRecentSearch,
  } = useExploreMore();

  return (
    <>

      <BannerCard
        backgroundColor={colors.green}
        icon="◆"
        iconBackgroundColor={colors.surface}
        iconColor={colors.green}
        title="Find your next reward game"
        subtitle="Tell us your mood, time, or reward goal."
      />

      <SectionHeading title="Search Recommendations" />
      <SearchCard
        query={query}
        placeholder={searchPlaceholder}
        loading={loading}
        onQueryChange={onQueryChange}
        onSearch={onSearch}
      />

      <SectionHeading title="Recent Searches" />
      <RecentSearchList searches={recentSearches} onRecentSearch={onRecentSearch} />

      <RecommendationStatus loading={loading} routingPath={routingPath} error={error} />
      <RecommendationSection recommendations={recommendations} hasZeroMatch={hasZeroMatch} query={query} />
    </>
  );
}
