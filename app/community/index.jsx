import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const CommunityPage = () => {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [otherCommunities, setOtherCommunities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch communities
  const fetchCommunities = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        // If no token, redirect to login page
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
      alert("You have successfully joined the community!"); // Replace with a toast if needed
      fetchCommunities(); // Refresh the list
    } catch (error) {
      console.error("Failed to join community:", error.message);
      alert("Failed to join the community. Please try again."); // Replace with a toast if needed
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Communities</Text>
      </View>

      {/* Joined Communities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Communities</Text>
        {joinedCommunities.length > 0 ? (
          <View style={styles.communityList}>
            {joinedCommunities.map((community) => (
              <Link
                href={`/community/${community._id}`}
                key={community._id}
                style={styles.communityCard}
              >
                <View>
                  <Text style={styles.communityName}>{community.name}</Text>
                </View>
                <View>
                  <Text style={styles.communityDescription}>
                    {community.description}
                  </Text>
                </View>
                <Text style={styles.communityMembers}>
                  Members: {community.members.length}
                </Text>
              </Link>
            ))}
          </View>
        ) : (
          <Text style={styles.noCommunitiesText}>
            You have not joined any communities yet.
          </Text>
        )}
      </View>

      {/* Other Communities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other Communities</Text>
        {otherCommunities.length > 0 ? (
          <View style={styles.communityList}>
            {otherCommunities.map((community) => (
              <View key={community._id} style={styles.communityCard}>
                <Text style={styles.communityName}>{community.name}</Text>
                <Text style={styles.communityDescription}>
                  {community.description}
                </Text>
                <Text style={styles.communityMembers}>
                  Members: {community.members.length}
                </Text>
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => handleJoinCommunity(community._id)}
                >
                  <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noCommunitiesText}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  loadingText: {
    fontSize: 18,
    color: "#1e3a8a",
  },
  header: {
    marginBottom: 24,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e3a8a",
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
  communityName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 8,
  },
  communityDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  communityMembers: {
    fontSize: 12,
    color: "#999",
  },
  noCommunitiesText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  joinButton: {
    marginTop: 12,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  joinButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});

export default CommunityPage;
