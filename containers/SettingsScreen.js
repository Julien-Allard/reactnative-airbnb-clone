import { Button, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SettingsScreen({ setToken, userId, userToken }) {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/user/${userId}`,
          {
            headers: {
              authorization: "Bearer " + userToken,
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.log(error.response);
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <View>
      <Text>Hello Settings</Text>
      <Text>user id : {userId}</Text>

      <TouchableOpacity
        style={styles.logOutBtn}
        onPress={() => {
          setToken(null, null);
        }}
      >
        <Text>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logOutBtn: {
    backgroundColor: "white",
    borderColor: "#E41D59",
    borderWidth: 2,
    borderRadius: 30,
    width: "60%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
});
