import { View, Text, StyleSheet } from "react-native";
import { fontSizes, spacingSize } from "../../../theme/spacing";
import { colors } from "../../../theme/colors";

export const Header = ({ title }: { title: string }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.gemCount}>1770 💎</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacingSize.ss_20,
    alignItems: "center",
  },
  title: { fontSize: fontSizes.fs_24, fontWeight: "bold", color: colors.blackShadeOne },
  gemCount: { fontSize: fontSizes.fs_22, fontWeight: "bold", color: colors.blackShadeOne },
});
