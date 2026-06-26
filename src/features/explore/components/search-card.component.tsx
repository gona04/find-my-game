import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SearchCardProps } from "../../../types/SearchCardProps";
import { colors } from "../../../theme/colors";
import { spacingSize, fontSizes } from "../../../theme/spacing";

export const SearchCard = ({
  query,
  placeholder,
  loading,
  onQueryChange,
  onSearch,
}: SearchCardProps) => {
  return (
    <View style={styles.card}>
      <TextInput
        value={query}
        onChangeText={onQueryChange}
        placeholder={placeholder}
        placeholderTextColor={colors.grey}
        multiline
        style={styles.input}
        textAlignVertical="top"
      />

      <TouchableOpacity
        disabled={loading}
        onPress={onSearch}
        style={[styles.primaryButton, loading && styles.disabledButton]}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? "Finding games..." : "Find Games"}
        </Text>
      </TouchableOpacity>
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
  input: {
    minHeight: 92,
    backgroundColor: colors.surface,
    borderRadius: spacingSize.ss_12,
    padding: spacingSize.ss_12,
    color: colors.blackShadeOne,
    fontSize: fontSizes.fs_16,
    marginBottom: spacingSize.ss_10,
  },
  primaryButton: {
    marginTop: spacingSize.ss_10,
    backgroundColor: colors.blackShadeOne,
    paddingVertical: spacingSize.ss_14,
    alignItems: "center",
    borderRadius: spacingSize.ss_24 ?? 24,
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: "bold",
    fontSize: fontSizes.fs_16,
  },
  disabledButton: { opacity: 0.7 },
});
