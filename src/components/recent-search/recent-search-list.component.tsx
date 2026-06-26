import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type RecentSearchListProps = {
  searches: string[];
  onSelect: (search: string) => void;
};

export const RecentSearchList = ({
  searches,
  onSelect,
}: RecentSearchListProps) => {
  return (
    <View style={styles.card}>
      {searches.map((search) => (
        <TouchableOpacity
          key={search}
          onPress={() => onSelect(search)}
          style={styles.recentRow}
        >
          <Text style={styles.recentText}>{search}</Text>
          <Text style={styles.recentArrow}>→</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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

  recentText: {
    color: "#050505",
    fontWeight: "700",
  },

  recentArrow: {
    color: "#050505",
    fontWeight: "bold",
  },
});