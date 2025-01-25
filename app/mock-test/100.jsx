import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, useColorScheme } from "react-native";
import { useRouter } from "expo-router";

const courses = {
  "1st Semester Courses": [
    "PHY101",
    "PHY103",
    "PHY107",
    "CHM107",
    "CHM101",
    "MTH101",
    "MTH103",
    "GET101",
    "GST111",
    "MEE101",
    "STA121",
    "COS101",
  ],
  "2nd Semester Courses": [
    "CHM102",
    "CHM108",
    "MTH102",
    "MAT114",
    "PHY142",
    "PHY102",
    "PHY104",
    "PHY108",
    "GST112",
    "STA112",
  ],
};

const MockTest100 = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === "dark";

  // Filter courses based on the search term
  const filterCourses = (semesterCourses) =>
    semesterCourses.filter((course) =>
      course.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const renderCourse = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.courseCard,
        {
          backgroundColor: isDarkMode ? "#1F2937" : "#fff",
          shadowColor: isDarkMode ? "#000" : "#ccc",
        },
      ]}
      onPress={() => router.push(`/mock-test/${item}`)}
    >
      <Text style={[styles.courseName, { color: isDarkMode ? "#fff" : "#1e3a8a" }]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#111827" : "#f0f4f8" }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDarkMode ? "#bee3f8" : "#1e3a8a" }]}>
          100 Level Courses
        </Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={[
          styles.searchBar,
          {
            backgroundColor: isDarkMode ? "#2d3748" : "#fff",
            borderColor: isDarkMode ? "#4a5568" : "#ccc",
            color: isDarkMode ? "#fff" : "#000",
          },
        ]}
        placeholder="Search for courses..."
        placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Course Lists */}
      <FlatList
        data={Object.entries(courses)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => {
          const [semester, semesterCourses] = item;
          const filteredCourses = filterCourses(semesterCourses);

          return (
            <View style={styles.semesterSection}>
              <Text style={[styles.semesterTitle, { color: isDarkMode ? "#fff" : "#1e3a8a" }]}>
                {semester}
              </Text>
              {filteredCourses.length > 0 ? (
                <FlatList
                  data={filteredCourses}
                  keyExtractor={(course) => course}
                  renderItem={renderCourse}
                  numColumns={2}
                  columnWrapperStyle={styles.courseListRow}
                />
              ) : (
                <Text style={[styles.noCoursesText, { color: isDarkMode ? "#aaa" : "#888" }]}>
                  No courses match your search.
                </Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchBar: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  semesterSection: {
    marginBottom: 24,
  },
  semesterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  courseListRow: {
    justifyContent: "space-between",
  },
  courseCard: {
    flex: 1,
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noCoursesText: {
    fontSize: 14,
  },
});

export default MockTest100;
