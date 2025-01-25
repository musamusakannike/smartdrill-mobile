import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const MockTestPage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === "dark";

  const levels = [
    { name: "100 Level", available: true, href: "/mock-test/100" },
    { name: "200 Level", available: false },
    { name: "300 Level", available: false },
    { name: "400 Level", available: false },
    { name: "500 Level", available: false },
  ];

  const renderLevel = ({ item }) => (
    <TouchableOpacity
      key={item.name}
      style={[
        styles.levelCard,
        {
          backgroundColor: item.available
            ? isDarkMode
              ? "#1f2937"
              : "#fff"
            : isDarkMode
            ? "#374151"
            : "#ddd",
          shadowColor: isDarkMode ? "#000" : "#ccc",
        },
      ]}
      onPress={() => item.available && router.push(item.href)}
      disabled={!item.available}
    >
      <View style={styles.iconWrapper}>
        {item.available ? (
          <Ionicons name="book-outline" size={48} color="#2563eb" />
        ) : (
          <Ionicons
            name="lock-closed-outline"
            size={48}
            color={isDarkMode ? "#555" : "#888"}
          />
        )}
      </View>
      <Text
        style={[
          styles.levelTitle,
          {
            color: item.available
              ? isDarkMode
                ? "#fff"
                : "#1e3a8a"
              : isDarkMode
              ? "#888"
              : "#555",
          },
        ]}
      >
        {item.name}
      </Text>
      {!item.available && (
        <Text
          style={[
            styles.levelSubtitle,
            { color: isDarkMode ? "#aaa" : "#888" },
          ]}
        >
          Locked
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#111827" : "#f0f4f8" },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { color: isDarkMode ? "#bee3f8" : "#1e3a8a" },
          ]}
        >
          Mock Test
        </Text>
      </View>
      <FlatList
        data={levels}
        renderItem={renderLevel}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.levelList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  levelList: {
    padding: 16,
  },
  levelCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  iconWrapper: {
    marginBottom: 8,
    alignItems: "center",
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  levelSubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default MockTestPage;
