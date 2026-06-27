import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { spacingSize } from "../../../theme/spacing";

type HorizontalScrollProps<T> = {
  data: T[];
  Component: React.ComponentType<T>;
  keyExtractor?: (item: T, index: number) => string;
};

export function HorizontalScroll<T>({ data, Component, keyExtractor }: HorizontalScrollProps<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCards}>
      {data.map((item, index) => (
        <Component key={keyExtractor ? keyExtractor(item, index) : index.toString()} {...item} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  horizontalCards: {
    gap: spacingSize.ss_14,
    paddingBottom: spacingSize.ss_22,
  },
});
