import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const ChatWithAI = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    // Append the user's message to the chat
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Clear input field
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        // If no token, redirect to login page
        console.log("No token found!");
        router.replace("/login");
      } else {
        const response = await fetch(
          "https://smart-drill-backend.onrender.com/api/v1/questions/solve",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              question: input.trim(),
            }),
          }
        );
        console.log("User question: " + input.trim());

        const data = await response.json();
        console.log("Response: "+ JSON.stringify(data, null, 2));

        // Append the AI's response to the chat
        const aiMessage = {
          role: "ai",
          content: data.solution.explanation,
          keyPoints: data.solution.keyPoints,
          relatedTopics: data.relatedTopics,
          references: data.solution.references,
        };

        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Failed to fetch AI response:", error.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Failed to fetch a solution. Please try again.",
        },
      ]);
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chat with AI</Text>
      </View>

      {/* Chat Window */}
      <ScrollView style={styles.chatWindow}>
        {messages.length === 0 && (
          <Text style={styles.placeholderText}>
            Ask a question to start the conversation.
          </Text>
        )}
        <View style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.role === "user" ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <Text style={styles.messageText}>{msg.content}</Text>

              {/* Key Points */}
              {msg.role === "ai" && msg.keyPoints && (
                <View style={styles.keyPointsContainer}>
                  {msg.keyPoints.map((point, i) => (
                    <Text key={i} style={styles.keyPointText}>
                      • {point}
                    </Text>
                  ))}
                </View>
              )}

              {/* Related Topics */}
              {msg.role === "ai" && msg.relatedTopics && (
                <Text style={styles.relatedTopicsText}>
                  <Text style={styles.boldText}>Related Topics:</Text>{" "}
                  {msg.relatedTopics.join(", ")}
                </Text>
              )}

              {/* References */}
              {msg.role === "ai" &&
                msg.references &&
                msg.references.length > 0 && (
                  <View style={styles.referencesContainer}>
                    <Text style={styles.boldText}>References:</Text>
                    {msg.references.map((ref, i) => (
                      <Text key={i} style={styles.referenceText}>
                        • {ref}
                      </Text>
                    ))}
                  </View>
                )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your question..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  header: {
    padding: 16,
    backgroundColor: "#1e3a8a",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  chatWindow: {
    flex: 1,
    padding: 16,
  },
  placeholderText: {
    textAlign: "center",
    color: "#666",
  },
  messagesContainer: {
    flex: 1,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#3b82f6",
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e2e8f0",
  },
  messageText: {
    color: "#000",
  },
  keyPointsContainer: {
    marginTop: 8,
  },
  keyPointText: {
    fontSize: 14,
    color: "#000",
  },
  relatedTopicsText: {
    marginTop: 8,
    fontSize: 14,
    color: "#000",
  },
  boldText: {
    fontWeight: "bold",
  },
  referencesContainer: {
    marginTop: 8,
  },
  referenceText: {
    fontSize: 14,
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginRight: 8,
    color: "#000",
  },
  sendButton: {
    padding: 12,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatWithAI;
