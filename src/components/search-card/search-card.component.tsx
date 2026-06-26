import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SearchCardProps } from "../../types/SearchCardProps";

export const SearchCard = ({
  query,
  placeholder,
  loading,
  onChangeText,
  onSearch,
}: SearchCardProps) => {
  return (
    <View style={styles.card}>
      <TextInput
        value={query}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8B8B96"
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
    padding: 15,
    borderRadius: 16,
    backgroundColor: "#F7F7FB",
    marginBottom: 22,
  },
  input: {
    minHeight: 92,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    color: "#050505",
    fontSize: 16,
    marginBottom: 10,
  },
  primaryButton: {
    marginTop: 10,
    backgroundColor: "#050505",
    padding: 14,
    alignItems: "center",
    borderRadius: 24,
  },
  primaryButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  disabledButton: { opacity: 0.7 },
});
