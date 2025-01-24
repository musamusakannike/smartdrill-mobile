import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://smart-drill-backend.onrender.com/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token } = data.data;

        // Save token to AsyncStorage
        await AsyncStorage.setItem("token", token);

        Alert.alert("Success", "Login successful!");
        router.replace("/"); // Navigate to app/index.jsx
      } else {
        Alert.alert("Error", data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.containerDark : styles.containerLight,
      ]}
    >
      <Text
        style={[
          styles.title,
          isDarkMode ? styles.textDark : styles.textLight,
        ]}
      >
        Smart<Text style={styles.highlight}>Drill</Text>
      </Text>
      <Text
        style={[
          styles.subtitle,
          isDarkMode ? styles.textDark : styles.textLight,
        ]}
      >
        Login to your account
      </Text>

      <TextInput
        style={[
          styles.input,
          isDarkMode ? styles.inputDark : styles.inputLight,
        ]}
        placeholder="Email"
        placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[
          styles.input,
          isDarkMode ? styles.inputDark : styles.inputLight,
        ]}
        placeholder="Password"
        placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text
        style={[
          styles.footer,
          isDarkMode ? styles.textDark : styles.textLight,
        ]}
      >
        Don&apos;t have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => router.push("/signup")}
        >
          Sign up
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  containerLight: {
    backgroundColor: "#F9FAFB", // gray-50
  },
  containerDark: {
    backgroundColor: "#1F2937", // gray-900
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
  },
  textLight: {
    color: "#1F2937", // gray-800
  },
  textDark: {
    color: "#D1D5DB", // gray-200
  },
  highlight: {
    color: "#3B82F6", // blue-600
  },
  input: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  inputLight: {
    backgroundColor: "#F3F4F6", // gray-100
    color: "#1F2937", // gray-800
  },
  inputDark: {
    backgroundColor: "#374151", // gray-800
    color: "#D1D5DB", // gray-200
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#3B82F6", // blue-600
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    marginTop: 24,
  },
  link: {
    color: "#3B82F6", // blue-600
  },
});

export default Login;
