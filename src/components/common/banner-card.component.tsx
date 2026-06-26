import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { spacingSize, fontSizes } from "../../theme/spacing";
import { BannerCardProps } from "../../types/BannerCardProps";

export const BannerCard = ({
  backgroundColor,
  iconBackgroundColor = colors.blackShadeOne,
  iconColor = colors.green,
  icon,
  title,
  subtitle,
  titleColor = colors.blackShadeOne,
  subtitleColor = colors.grey,
}: BannerCardProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: iconBackgroundColor,
          },
        ]}
      >
        <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text>
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: titleColor,
            },
          ]}
        >
          {title}
        </Text>

        {subtitle ? (
          <Text
            style={[
              styles.subtitle,
              {
                color: subtitleColor,
              },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: spacingSize.ss_16,
    padding: spacingSize.ss_15,
    marginBottom: spacingSize.ss_24,
    flexDirection: "row",
    alignItems: "center",
    gap: spacingSize.ss_10,
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 30,
    fontWeight: "700",
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: fontSizes.fs_18,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 4,
    fontSize: fontSizes.fs_14,
    fontWeight: "500",
  },
});
