import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DiscoverScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.gemCount}>1770 💎</Text>
        </View>

        {/* Claimed Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>✅ All done! Come back tomorrow!</Text>
        </View>

        {/* Extra Rewards */}
        <Text style={styles.sectionHeader}>Extra Rewards</Text>
        <View style={styles.rewardsRow}>
          <View style={[styles.card, { backgroundColor: "#FFD700" }]}>
            <Text>Daily Streak</Text>
            <TouchableOpacity style={styles.button}><Text>Continue</Text></TouchableOpacity>
          </View>
          <View style={[styles.card, { backgroundColor: "#90EE90" }]}>
            <Text>2x Boost</Text>
            <TouchableOpacity style={styles.button}><Text>Activate!</Text></TouchableOpacity>
          </View>
        </View>

        {/* Keep Playing */}
        <Text style={styles.sectionHeader}>Keep Playing</Text>
        <View style={styles.gameCard}>
          <Text>Tasty Travels: Merge Game</Text>
          <Text>322 💎</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  gemCount: { fontSize: 18, fontWeight: "bold" },
  banner: { backgroundColor: "#FFD700", padding: 15, borderRadius: 10, marginBottom: 20 },
  bannerText: { fontWeight: '600' },
  sectionHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  rewardsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  card: { width: "48%", padding: 15, borderRadius: 10 },
  button: { marginTop: 10, backgroundColor: "#fff", padding: 5, alignItems: "center", borderRadius: 5 },
  gameCard: { backgroundColor: "#f0f0f0", padding: 15, borderRadius: 10 }
});

export default DiscoverScreen;