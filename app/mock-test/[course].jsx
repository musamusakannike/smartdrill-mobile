import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import MockTestClient from "../../components/MockTestPage/MockTestClient";
import Toast from "react-native-toast-message";

const toastConfig = {
  success: (props) => (
    <View
      style={{
        padding: 15,
        backgroundColor: "green",
        borderRadius: 10,
        marginHorizontal: 20,
      }}
    >
      <Text style={{ color: "white", fontSize: 16 }}>{props.text1}</Text>
    </View>
  ),
  error: (props) => (
    <View
      style={{
        padding: 15,
        backgroundColor: "red",
        borderRadius: 10,
        marginHorizontal: 20,
      }}
    >
      <Text style={{ color: "white", fontSize: 16 }}>{props.text1}</Text>
    </View>
  ),
  info: (props) => (
    <View
      style={{
        padding: 15,
        backgroundColor: "blue",
        borderRadius: 10,
        marginHorizontal: 20,
      }}
    >
      <Text style={{ color: "white", fontSize: 16 }}>{props.text1}</Text>
    </View>
  ),
};

export default function Page() {
  const { course } = useLocalSearchParams(); // Use useLocalSearchParams to get the course parameter

  return (
    <View style={{ flex: 1 }}>
      <MockTestClient course={course} />
      <Toast config={toastConfig} />
    </View>
  );
}
