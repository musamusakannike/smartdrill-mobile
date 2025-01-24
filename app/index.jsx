import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Home = () => {
  const [loading, setLoading] = useState(true); // To handle loading state while checking login
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        // Check if the token exists in AsyncStorage
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          // If no token, redirect to login page
          router.replace("/login");
        } else {
          // Token exists, user is logged in
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        router.replace("/login"); // Redirect to login page on error
      }
    };

    checkLogin();
  }, [router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to SmartDrill!</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // light background
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // light background
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});
