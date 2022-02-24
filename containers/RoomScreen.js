import {
  ScrollView,
  Text,
  ActivityIndicator,
  View,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { useRoute } from "@react-navigation/core";
import { useEffect, useState } from "react";
import MapView from "react-native-maps";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";

export default function RoomScreen() {
  const { params } = useRoute();
  // console.log(useRoute());
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  //Gestion du "show more / show less"
  const [descriptionLines, setDescriptionLines] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://express-airbnb-api.herokuapp.com/rooms/${params.roomId}`
      );
      // console.log(response.data);
      setData(response.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return isLoading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#E41D59" />
    </View>
  ) : (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/logoairbnb.png")}
          style={styles.logo}
        />
      </View>

      <Image
        source={{ uri: data.photos[0].url }}
        style={styles.mainImg}
        resizeMode="cover"
      />

      {/* Details */}
      <View style={styles.details}>
        {/* Titre et score */}
        <View style={styles.detailsTxt}>
          {/* Titre */}
          <Text style={styles.title} numberOfLines={1}>
            {data.title}
          </Text>

          {/* Score de chaque élément */}
          <View style={styles.cardScore}>
            <View style={{ flexDirection: "row" }}>
              <Entypo
                name="star"
                size={20}
                color={data.ratingValue >= 1 ? "orange" : "lightgrey"}
                style={{ marginRight: 3 }}
              />
              <Entypo
                name="star"
                size={20}
                color={data.ratingValue >= 2 ? "orange" : "lightgrey"}
                style={{ marginRight: 3 }}
              />
              <Entypo
                name="star"
                size={20}
                color={data.ratingValue >= 3 ? "orange" : "lightgrey"}
                style={{ marginRight: 3 }}
              />
              <Entypo
                name="star"
                size={20}
                color={data.ratingValue >= 4 ? "orange" : "lightgrey"}
                style={{ marginRight: 3 }}
              />
              <Entypo
                name="star"
                size={20}
                color={data.ratingValue === 5 ? "orange" : "lightgrey"}
                style={{ marginRight: 3 }}
              />
            </View>
            <Text style={styles.reviewTxt}>{data.reviews} reviews</Text>
          </View>
        </View>

        {/* Avatar */}
        <Image
          source={{ uri: data.user.account.photo.url }}
          style={styles.avatar}
        />
      </View>

      {/* Description et show more/less */}
      <View style={styles.description}>
        <Text numberOfLines={descriptionLines} style={styles.descriptionTxt}>
          {data.description}
        </Text>
        <TouchableHighlight
          onPress={() => {
            if (descriptionLines === 3) {
              setDescriptionLines(0);
            } else {
              setDescriptionLines(3);
            }
          }}
        >
          {descriptionLines === 3 ? (
            <Text style={styles.show}>Show more +</Text>
          ) : (
            <Text style={styles.show}>Show less -</Text>
          )}
        </TouchableHighlight>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: data.location[1],
          longitude: data.location[0],
          latitudeDelta: 0.09,
          longitudeDelta: 0.09,
        }}
      >
        <MapView.Marker
          coordinate={{
            latitude: data.location[1],
            longitude: data.location[0],
          }}
          title={data.title}
        />
      </MapView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  mainImg: {
    width: 395,
    height: 300,
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    width: 360,
    height: 100,
    marginBottom: 10,
    marginTop: 10,
  },
  detailsTxt: {
    flex: 3,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  cardScore: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewTxt: {
    color: "#CBC4B6",
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 50,
    marginLeft: 10,
    flex: 1,
  },

  //description
  description: {
    width: 360,
    marginBottom: 30,
  },
  descriptionTxt: {
    lineHeight: 20,
    marginBottom: 10,
  },
  show: {
    color: "grey",
  },

  //map
  map: {
    width: 395,
    height: 300,
  },
});
