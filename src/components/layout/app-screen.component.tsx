import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { spacingSize } from "../../theme/spacing";
import { colors } from "../../theme/colors";

type Props = {
  children: React.ReactNode;
};

export function AppScreen({ children }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  content: {
    paddingHorizontal: spacingSize.ss_5,
    paddingTop: spacingSize.ss_24,
    paddingBottom: spacingSize.ss_20,
  },
});