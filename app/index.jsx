import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const [loading, setLoading] = useState(true); // To handle loading state while checking login
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === "dark";
  useEffect(() => {
    const checkLogin = async () => {
      try {
        // Check if the token exists in AsyncStorage
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          // If no token, redirect to login page
          router.replace("/login");
        } else {
          // Token exists, fetch user data and update loading state
          await fetchUser(token);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        router.replace("/login"); // Redirect to login page on error
      }
    };

    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(
          "https://smart-drill-backend.onrender.com/api/v1/user/me",
          {
            method: "GET", // Specify the method explicitly
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Fix header syntax
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData.data);
        if (userData?.data?.user?.role === "admin") {
          setShowAdminModal(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.replace("/login"); // Redirect to login page on fetch error
      }
    };

    checkLogin();
    fetchUser();
  }, [router]);

  const handleNavigateToAdmin = () => {
    router.push("/admin/dashboard");
  };

  const features = [
    {
      title: "Past Questions",
      description:
        "Access a large collection of past questions to prepare effectively for your exams.",
      icon: "book-outline",
      route: "/past-questions",
    },
    {
      title: "Mock Tests",
      description:
        "Take mock tests to practice and track your progress for exams.",
      icon: "create-outline",
      route: "/mock-test",
    },
    {
      title: "Brainstorm with AI",
      description:
        "Use AI to brainstorm and understand complex topics with ease.",
      icon: "help-circle-outline",
      route: "/chat",
    },
  ];

  const moreFeatures = [
    {
      title: "Leaderboard",
      description: "Get study materials tailored to your specific needs.",
    },
    {
      title: "Search Questions",
      description:
        "Search for specific questions and answers using efficient filters.",
      route: "/search",
    },
    {
      title: "Communities",
      description: "Engage with fellow students and share knowledge.",
      route: "/community",
    },
  ];

  const renderFeatureCard = (item) => (
    <TouchableOpacity
      key={item.title}
      style={[
        styles.featureCard,
        {
          backgroundColor: isDarkMode ? "#1f2937" : "#fff",
          shadowColor: isDarkMode ? "#000" : "#ccc",
        },
      ]}
      onPress={() => item.route && router.push(item.route)}
    >
      {item.icon && (
        <Ionicons
          name={item.icon}
          size={32}
          color={isDarkMode ? "#4f83cc" : "#2563eb"}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.featureTitle,
          { color: isDarkMode ? "#fff" : "#1e3a8a" },
        ]}
      >
        {item.title}
      </Text>
      <Text
        style={[
          styles.featureDescription,
          { color: isDarkMode ? "#ccc" : "#4b5563" },
        ]}
      >
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#111827" : "#f0f4f8" },
      ]}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: isDarkMode ? "#1f2937" : "#fff" },
        ]}
      >
        <Text
          style={[
            styles.greeting,
            { color: isDarkMode ? "#bee3f8" : "#1e3a8a" },
          ]}
        >
          {`Hello, ${user?.data?.user?.fullname || "Student"}!`}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {features.map(renderFeatureCard)}
        {moreFeatures.map(renderFeatureCard)}
      </ScrollView>

      <Modal visible={showAdminModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDarkMode ? "#2d3748" : "#fff" },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: isDarkMode ? "#fff" : "#1e3a8a" },
              ]}
            >
              Admin Dashboard
            </Text>
            <Text
              style={[
                styles.modalDescription,
                { color: isDarkMode ? "#ccc" : "#4b5563" },
              ]}
            >
              You have admin privileges. Would you like to go to the admin
              dashboard?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowAdminModal(false)}
                style={[
                  styles.button,
                  { backgroundColor: isDarkMode ? "#4a5568" : "#e2e8f0" },
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: isDarkMode ? "#fff" : "#1a202c" },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/admin/dashboard")}
                style={[styles.button, { backgroundColor: "#2563eb" }]}
              >
                <Text style={[styles.buttonText, { color: "#fff" }]}>
                  Go to Admin
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    shadowColor: "#ccc",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  featureList: {
    padding: 16,
  },
  featureCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    marginBottom: 8,
    alignSelf: "center",
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 14,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 16,
  },
  scrollViewContent: {
    padding: 16
  }
});

export default Home;
