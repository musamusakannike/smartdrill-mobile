import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import React from "react";

const AppLayout = () => {
  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="auto" />
      <Slot />
    </SafeAreaView>
  );
};

export default AppLayout;