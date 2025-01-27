import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const CommunityPage = () => {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [otherCommunities, setOtherCommunities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme(); // Detect system theme (light or dark)

  // Fetch communities
  const fetchCommunities = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found!");
        router.replace("/login");
      } else {
        const response = await fetch(
          "https://smart-drill-backend.onrender.com/api/v1/communities",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        const { joinedCommunities, otherCommunities } = data.data;
        setJoinedCommunities(joinedCommunities);
        setOtherCommunities(otherCommunities);
      }
    } catch (error) {
      console.error("Failed to fetch communities:", error.message);
      setError("Failed to load communities.");
    } finally {
      setLoading(false);
    }
  };

  // Join a community
  const handleJoinCommunity = async (communityId) => {
    try {
      await fetch(
        `https://smart-drill-backend.onrender.com/api/v1/communities/${communityId}/join`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("You have successfully joined the community!");
      fetchCommunities();
    } catch (error) {
      console.error("Failed to join community:", error.message);
      alert("Failed to join the community. Please try again.");
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          colorScheme === "dark" && styles.loadingContainerDark,
        ]}
      >
        <Text
          style={[
            styles.loadingText,
            colorScheme === "dark" && styles.loadingTextDark,
          ]}
        >
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        colorScheme === "dark" && styles.containerDark,
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.headerText,
            colorScheme === "dark" && styles.headerTextDark,
          ]}
        >
          Communities
        </Text>
      </View>

      {/* Joined Communities */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            colorScheme === "dark" && styles.sectionTitleDark,
          ]}
        >
          Your Communities
        </Text>
        {joinedCommunities.length > 0 ? (
          <View style={styles.communityList}>
            {joinedCommunities.map((community) => (
              <Link
                href={`/community/${community._id}`}
                key={community._id}
                style={[
                  styles.communityCard,
                  colorScheme === "dark" && styles.communityCardDark,
                ]}
              >
                <View>
                  <Text
                    style={[
                      styles.communityName,
                      colorScheme === "dark" && styles.communityNameDark,
                    ]}
                  >
                    {community.name}
                  </Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.communityDescription,
                      colorScheme === "dark" && styles.communityDescriptionDark,
                    ]}
                  >
                    {community.description}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.communityMembers,
                    colorScheme === "dark" && styles.communityMembersDark,
                  ]}
                >
                  Members: {community.members.length}
                </Text>
              </Link>
            ))}
          </View>
        ) : (
          <Text
            style={[
              styles.noCommunitiesText,
              colorScheme === "dark" && styles.noCommunitiesTextDark,
            ]}
          >
            You have not joined any communities yet.
          </Text>
        )}
      </View>

      {/* Other Communities */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            colorScheme === "dark" && styles.sectionTitleDark,
          ]}
        >
          Other Communities
        </Text>
        {otherCommunities.length > 0 ? (
          <View style={styles.communityList}>
            {otherCommunities.map((community) => (
              <View
                key={community._id}
                style={[
                  styles.communityCard,
                  colorScheme === "dark" && styles.communityCardDark,
                ]}
              >
                <Text
                  style={[
                    styles.communityName,
                    colorScheme === "dark" && styles.communityNameDark,
                  ]}
                >
                  {community.name}
                </Text>
                <Text
                  style={[
                    styles.communityDescription,
                    colorScheme === "dark" && styles.communityDescriptionDark,
                  ]}
                >
                  {community.description}
                </Text>
                <Text
                  style={[
                    styles.communityMembers,
                    colorScheme === "dark" && styles.communityMembersDark,
                  ]}
                >
                  Members: {community.members.length}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.joinButton,
                    colorScheme === "dark" && styles.joinButtonDark,
                  ]}
                  onPress={() => handleJoinCommunity(community._id)}
                >
                  <Text
                    style={[
                      styles.joinButtonText,
                      colorScheme === "dark" && styles.joinButtonTextDark,
                    ]}
                  >
                    Join
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text
            style={[
              styles.noCommunitiesText,
              colorScheme === "dark" && styles.noCommunitiesTextDark,
            ]}
          >
            No other communities available to join.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    padding: 16,
  },
  containerDark: {
    backgroundColor: "#111827",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  loadingContainerDark: {
    backgroundColor: "#111827",
  },
  loadingText: {
    fontSize: 18,
    color: "#1e3a8a",
  },
  loadingTextDark: {
    color: "#90caf9",
  },
  header: {
    marginBottom: 24,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  headerTextDark: {
    color: "#90caf9",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1e3a8a",
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: "#90caf9",
  },
  communityList: {
    gap: 16,
  },
  communityCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  communityCardDark: {
    backgroundColor: "#1f2937",
    shadowColor: "#000",
  },
  communityName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 8,
  },
  communityNameDark: {
    color: "#90caf9",
  },
  communityDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  communityDescriptionDark: {
    color: "#ccc",
  },
  communityMembers: {
    fontSize: 12,
    color: "#999",
  },
  communityMembersDark: {
    color: "#bbb",
  },
  noCommunitiesText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  noCommunitiesTextDark: {
    color: "#ccc",
  },
  joinButton: {
    marginTop: 12,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  joinButtonDark: {
    backgroundColor: "#0056b3",
  },
  joinButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  joinButtonTextDark: {
    color: "#fff",
  },
});

export default CommunityPage;
