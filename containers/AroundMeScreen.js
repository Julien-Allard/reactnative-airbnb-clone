import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  Image,
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
    <View style={{ flex: 1, alignItems: "center" }}>
      {/* {console.log(data)} */}
      {/* {console.log(coords)} */}
      <View style={styles.header}>
        <Image
          source={require("../assets/logoairbnb.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.txtContainer}>
        <Text style={styles.introTxt}>
          Find all the avaiable offers around you !
        </Text>
      </View>

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
  txtContainer: {
    width: "90%",
    justifyContent: "center",
    marginBottom: 10,
  },
  introTxt: {
    fontSize: 18,
    textAlign: "center",
  },
  //header
  header: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "lightgrey",
    width: "100%",
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
});
