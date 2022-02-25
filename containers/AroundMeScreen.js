import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

export default function AroundMeScreen() {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  //coordonnées de l'utilisateur
  const [coords, setCoords] = useState();
  //données des objets à proximité de l'utilisateur
  const [data, setData] = useState();

  useEffect(() => {
    const askPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      // console.log(status);
      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({});
        // console.log(location);
        const userPosition = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        // console.log(userPosition);
        setCoords(userPosition);

        try {
          const response = await axios.get(
            `https://express-airbnb-api.herokuapp.com/rooms/around?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
          );
          // console.log(response.data);
          setData(response.data);
          setIsLoading(false);
        } catch (error) {
          console.log(error.response);
          console.log(error.message);
        }
      } else {
        setError(true);
      }
    };

    askPermission();
  }, []);

  return isLoading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#E41D59" />
    </View>
  ) : error ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Permission refusée</Text>
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      {/* {console.log(data)} */}
      {/* {console.log(coords)} */}
      <Text>Find all the avaiable offers around you !</Text>
      <Text>Longitude : {coords.longitude}</Text>
      <Text>Latitude : {coords.latitude}</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.09,
        }}
        showsUserLocation={true}
      >
        {data.map((element) => {
          return (
            <MapView.Marker
              key={element._id}
              title={element.title}
              coordinate={{
                latitude: element.location[1],
                longitude: element.location[0],
              }}
              onPress={() => {
                navigation.navigate("Room", { roomId: element._id });
              }}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
