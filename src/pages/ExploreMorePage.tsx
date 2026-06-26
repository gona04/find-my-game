import React from "react";
import { AppScreen } from "../components/layout/app-screen.component";
import { Header } from "../components/layout/header.component";
import { BannerCard } from "../components/common/banner-card.component";
import { SectionHeading } from "../components/common/section-heading.component";
import { SearchCard } from "../components/search-card/search-card.component";
import { RecentSearchList } from "../components/recent-search/recent-search-list.component";
import { RecommendationStatus } from "../components/recommendations/recommendation-status.component";
import { RecommendationSection } from "../components/recommendations/recommendation-section.component";
import { useExploreMore } from "../hooks/use-explore-more.hook";
import { colors } from "../theme/colors";

export const ExploreMorePage = () => {
  const {
    query,
    searchPlaceholder,
    recommendations,
    loading,
    routingPath,
    error,
    recentSearches,
    onQueryChange,
    onSearch,
    onRecentSearch,
  } = useExploreMore();

  return (
    <AppScreen>
      <Header title="Explore More" />

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
      <RecommendationSection recommendations={recommendations} />
    </AppScreen>
  );
};
