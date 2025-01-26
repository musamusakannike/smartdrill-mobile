import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Appearance,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const MockTestClient = ({ course }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [countdown, setCountdown] = useState(1200); // 20 minutes in seconds
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showCorrections, setShowCorrections] = useState(false);
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const router = useRouter();

  // Listen for system color scheme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `https://smart-drill-backend.onrender.com/api/v1/mock-test?course=${course}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setQuestions(data.data.questions);
      setSessionId(data.data.sessionId);
      setAnswers(new Array(data.data.questions.length).fill(null));
    } catch (error) {
      console.error("Failed to fetch questions:", error.message);
      setError("No questions found for this course.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [course]);

  useEffect(() => {
    if (countdown <= 0) {
      handleSubmit(); // Auto-submit when time runs out
    }
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleAnswerChange = (index, option) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = option;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        "https://smart-drill-backend.onrender.com/api/v1/mock-test/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sessionId,
            answers,
          }),
        }
      );
      Toast.show({
        type: "success",
        text1: "Test submitted successfully!",
      });
      const data = await response.json();
      setResult(data.data); // Save the result
      setShowResult(true); // Show the result modal
    } catch (error) {
      console.error("Failed to submit test:", error.message);
      Toast.show({
        type: "error",
        text1: "Failed to submit test. Please try again.",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (error) {
    return (
      <View style={styles(colorScheme).container}>
        <Text style={styles(colorScheme).errorText}>{error}</Text>
        <TouchableOpacity
          onPress={fetchQuestions}
          style={styles(colorScheme).retryButton}
        >
          <Text style={styles(colorScheme).retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles(colorScheme).container}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles(colorScheme).loadingText}>Loading test...</Text>
      </View>
    );
  }

  return (
    <View style={styles(colorScheme).container}>
      <View style={styles(colorScheme).floatingTimerContainer}>
        <Text style={styles(colorScheme).timer}>
          Time Left: {Math.floor(countdown / 60)}:
          {String(countdown % 60).padStart(2, "0")}
        </Text>
      </View>
      <ScrollView style={styles(colorScheme).scrollContainer}>
        <Text style={styles(colorScheme).heading}>Mock Test: {course}</Text>
        {questions.map((q, index) => (
          <View key={q._id} style={styles(colorScheme).questionContainer}>
            <Text style={styles(colorScheme).questionHeading}>
              Question {index + 1}
            </Text>
            <Text style={styles(colorScheme).questionText}>{q.question}</Text>
            <View style={styles(colorScheme).optionsContainer}>
              {q.options.map((option, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleAnswerChange(index, i + 1)}
                  style={[
                    styles(colorScheme).optionButton,
                    answers[index] === i + 1 &&
                      styles(colorScheme).selectedOption,
                  ]}
                >
                  <Text
                    style={[
                      styles(colorScheme).optionText,
                      answers[index] === i + 1 &&
                        styles(colorScheme).selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles(colorScheme).submitButton}
          disabled={submitLoading}
        >
          <Text style={styles(colorScheme).submitButtonText}>
            {submitLoading ? "Loading..." : "Submit Test"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showResult} transparent={true} animationType="fade">
        <View style={styles(colorScheme).modalOverlay}>
          <View style={styles(colorScheme).modalContent}>
            {!showCorrections ? (
              <>
                <Text style={styles(colorScheme).modalHeading}>
                  {result?.percentage >= 80
                    ? "Congratulations!"
                    : result?.percentage >= 50
                    ? "Well Done!"
                    : "Better Luck Next Time!"}
                </Text>
                <Text style={styles(colorScheme).resultText}>
                  You scored {result?.score}/{result?.total} (
                  {result?.percentage}
                  %)
                </Text>
                <TouchableOpacity
                  onPress={() => setShowCorrections(true)}
                  style={styles(colorScheme).correctionsButton}
                >
                  <Text style={styles(colorScheme).buttonText}>
                    View Corrections
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/")}
                  style={styles(colorScheme).returnButton}
                >
                  <Text style={styles(colorScheme).buttonText}>
                    Return to Dashboard
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <ScrollView>
                <Text style={styles(colorScheme).modalHeading}>
                  Corrections
                </Text>
                {result.corrections.map((correction, index) => (
                  <View
                    key={index}
                    style={[
                      styles(colorScheme).correctionContainer,
                      correction.isCorrect
                        ? styles(colorScheme).correctAnswer
                        : styles(colorScheme).wrongAnswer,
                    ]}
                  >
                    <Text style={styles(colorScheme).correctionQuestion}>
                      Question {index + 1}: {correction.question}
                    </Text>
                    <View style={styles(colorScheme).correctionOptions}>
                      {correction.options.map((option, i) => (
                        <Text
                          key={i}
                          style={[
                            styles(colorScheme).correctionOption,
                            i + 1 === correction.correctOption &&
                              styles(colorScheme).correctOption,
                            i + 1 === correction.userAnswer &&
                              styles(colorScheme).wrongOption,
                          ]}
                        >
                          {option}
                        </Text>
                      ))}
                    </View>
                    <Text style={styles(colorScheme).explanation}>
                      <Text style={styles(colorScheme).boldText}>
                        Explanation:
                      </Text>{" "}
                      {correction.explanation}
                    </Text>
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => setShowCorrections(false)}
                  style={styles(colorScheme).correctionsButton}
                >
                  <Text style={styles(colorScheme).buttonText}>
                    Back to Result Summary
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = (colorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === "dark" ? "#111827" : "#e0f2fe",
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      color: colorScheme === "dark" ? "#93c5fd" : "#1e3a8a",
      marginBottom: 16,
    },
    floatingTimerContainer: {
      position: "absolute", // Fix the timer to a specific position
      top: 20, // Distance from the top of the screen
      right: 6, // Distance from the right of the screen
      backgroundColor: colorScheme === "dark" ? "#1f2937" : "#ffffff", // Match the background color
      paddingHorizontal: 12, // Horizontal padding
      paddingVertical: 8, // Vertical padding
      borderRadius: 20, // Rounded corners for a floating effect
      zIndex: 1, // Ensure the timer stays above other content
      shadowColor: "#000", // Add a shadow for a floating effect
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4, // For Android shadow
    },
    timer: {
      fontSize: 18,
      color: colorScheme === "dark" ? "#d1d5db" : "#4b5563",
    },
    questionContainer: {
      backgroundColor: colorScheme === "dark" ? "#1f2937" : "#ffffff",
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    questionHeading: {
      fontSize: 18,
      fontWeight: "bold",
      color: colorScheme === "dark" ? "#ffffff" : "#1e3a8a",
      marginBottom: 8,
    },
    questionText: {
      fontSize: 16,
      color: colorScheme === "dark" ? "#d1d5db" : "#4b5563",
      marginBottom: 16,
    },
    optionsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    optionButton: {
      flex: 1,
      minWidth: "48%",
      padding: 12,
      borderRadius: 8,
      backgroundColor: colorScheme === "dark" ? "#374151" : "#f3f4f6",
      alignItems: "center",
    },
    selectedOption: {
      backgroundColor: colorScheme === "dark" ? "#2563eb" : "#3b82f6",
    },
    optionText: {
      fontSize: 16,
      color: colorScheme === "dark" ? "#d1d5db" : "#1f2937",
    },
    selectedOptionText: {
      color: "#ffffff",
    },
    submitButton: {
      backgroundColor: colorScheme === "dark" ? "#16a34a" : "#22c55e",
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 24,
    },
    submitButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#ffffff",
    },
    errorText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "#f87171" : "#dc2626",
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: colorScheme === "dark" ? "#2563eb" : "#3b82f6",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    retryButtonText: {
      fontSize: 16,
      color: "#ffffff",
    },
    loadingText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "#d1d5db" : "#4b5563",
      marginTop: 16,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: colorScheme === "dark" ? "#1f2937" : "#ffffff",
      borderRadius: 8,
      padding: 24,
      width: "90%",
      maxWidth: 500,
    },
    modalHeading: {
      fontSize: 20,
      fontWeight: "bold",
      color: colorScheme === "dark" ? "#ffffff" : "#1e3a8a",
      marginBottom: 16,
    },
    resultText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "#d1d5db" : "#4b5563",
      marginBottom: 24,
    },
    correctionsButton: {
      backgroundColor: colorScheme === "dark" ? "#2563eb" : "#3b82f6",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 8,
    },
    returnButton: {
      backgroundColor: colorScheme === "dark" ? "#4b5563" : "#6b7280",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonText: {
      fontSize: 16,
      color: "#ffffff",
    },
    correctionContainer: {
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
    },
    correctAnswer: {
      backgroundColor: colorScheme === "dark" ? "#064e3b" : "#d1fae5",
    },
    wrongAnswer: {
      backgroundColor: colorScheme === "dark" ? "#7f1d1d" : "#fee2e2",
    },
    correctionQuestion: {
      fontSize: 16,
      fontWeight: "bold",
      color: colorScheme === "dark" ? "#ffffff" : "#1e3a8a",
      marginBottom: 8,
    },
    correctionOptions: {
      marginBottom: 8,
    },
    correctionOption: {
      fontSize: 14,
      color: colorScheme === "dark" ? "#d1d5db" : "#4b5563",
      marginBottom: 4,
    },
    correctOption: {
      color: colorScheme === "dark" ? "#34d399" : "#10b981",
      fontWeight: "bold",
    },
    wrongOption: {
      color: colorScheme === "dark" ? "#f87171" : "#ef4444",
      fontWeight: "bold",
    },
    explanation: {
      fontSize: 14,
      color: colorScheme === "dark" ? "#d1d5db" : "#4b5563",
    },
    boldText: {
      fontWeight: "bold",
    },
  });

export default MockTestClient;
