import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {StyleSheet} from "react-native"

const AppLayout = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Slot />
    </SafeAreaView>
  );
};

export default AppLayout;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
    },
});