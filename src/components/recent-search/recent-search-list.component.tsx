import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../theme/colors";
import { spacingSize } from "../../theme/spacing";
import { RecentSearchItem } from "./recent-search-item.component";

type RecentSearchListProps = {
  searches: string[];
  onRecentSearch: (search: string) => void;
};

export const RecentSearchList = ({ searches, onRecentSearch }: RecentSearchListProps) => {
  return (
    <View style={styles.card}>
      {searches.map((search) => (
        <RecentSearchItem key={search} label={search} onPress={onRecentSearch} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacingSize.ss_15,
    borderRadius: spacingSize.ss_16,
    backgroundColor: colors.primaryLight,
    marginBottom: spacingSize.ss_22,
  },
});