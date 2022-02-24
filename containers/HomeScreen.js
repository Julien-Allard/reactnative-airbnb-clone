import { useNavigation } from "@react-navigation/core";
import {
  Button,
  Text,
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms"
        );
        setData(response.data);
        setIsLoading(false);
        // console.log(response.data);
      } catch (error) {
        console.log(error.response.status);
        console.log(error.response.data);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#E41D59" />
    </View>
  ) : (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Image
          source={require("../assets/logoairbnb.png")}
          style={styles.logo}
        />
      </View>

      {/* Itération sur les éléments de data */}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={data}
        keyExtractor={(item) => String(item._id)}
        renderItem={({ item }) => (
          // Pour chaque élément, création d'un bouton/carte
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Room", { roomId: item._id });
            }}
          >
            <ImageBackground
              source={{ uri: item.photos[0].url }}
              style={styles.cardImg}
              resizeMode="cover"
            >
              <View style={styles.priceView}>
                <Text style={styles.priceMain}>{item.price} €</Text>
              </View>
            </ImageBackground>

            {/* Détails de chaque élément */}
            <View style={styles.cardDetails}>
              <View style={styles.cardTxt}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>

                {/* Score de chaque élément */}
                <View style={styles.cardScore}>
                  <View style={{ flexDirection: "row" }}>
                    <Entypo
                      name="star"
                      size={20}
                      color={item.ratingValue >= 1 ? "orange" : "lightgrey"}
                      style={{ marginRight: 3 }}
                    />
                    <Entypo
                      name="star"
                      size={20}
                      color={item.ratingValue >= 2 ? "orange" : "lightgrey"}
                      style={{ marginRight: 3 }}
                    />
                    <Entypo
                      name="star"
                      size={20}
                      color={item.ratingValue >= 3 ? "orange" : "lightgrey"}
                      style={{ marginRight: 3 }}
                    />
                    <Entypo
                      name="star"
                      size={20}
                      color={item.ratingValue >= 4 ? "orange" : "lightgrey"}
                      style={{ marginRight: 3 }}
                    />
                    <Entypo
                      name="star"
                      size={20}
                      color={item.ratingValue === 5 ? "orange" : "lightgrey"}
                      style={{ marginRight: 3 }}
                    />
                  </View>
                  <Text style={styles.reviewTxt}>{item.reviews} reviews</Text>
                </View>
              </View>

              {/* Avatar */}
              <Image
                source={{ uri: item.user.account.photo.url }}
                style={styles.avatar}
              />
            </View>
          </TouchableOpacity>
        )}
      />
      <Button
        title="Go to Profile"
        onPress={() => {
          navigation.navigate("Profile", { userId: 123 });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  //page
  mainContainer: {
    alignItems: "center",
    paddingBottom: 50,
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

  //liste
  listContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardImg: {
    width: 360,
    height: 180,
    justifyContent: "flex-end",
  },
  priceView: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  priceMain: {
    color: "white",
    fontSize: 16,
  },
  cardDetails: {
    flexDirection: "row",
    alignItems: "center",
    width: 360,
    height: 100,
    paddingBottom: 10,
    marginBottom: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
  cardTxt: {
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
});
