import { View, Text, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

export default function AroundMeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [coords, setCoords] = useState();

  useEffect(() => {
    const askPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(status);
    };
    askPermission();
  }, []);

  return isLoading ? (
    <ActivityIndicator style={{ flex: 1 }} />
  ) : (
    <View style={{ flex: 1 }}>
      <Text>AroundMeScreen</Text>
    </View>
  );
}
