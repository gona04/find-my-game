import React, { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { fontSizes, spacingSize } from "../../theme/spacing";

type Props = {
  title: string;
  actionText?: string;
  onPress?: () => void;
};

export const SectionHeading = memo(
  ({ title, actionText, onPress }: Props): React.ReactElement => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        {actionText && (
          <Pressable onPress={onPress}>
            <Text style={styles.action}>{actionText}</Text>
          </Pressable>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingSize.ss_10,
  },

  title: {
    fontSize: fontSizes.fs_18,
    fontWeight: "bold",
    color: colors.blackShadeOne,
  },

  action: {
    fontSize: fontSizes.fs_16,
    fontWeight: "600",
    color: colors.blackShadeOne,
  },
});