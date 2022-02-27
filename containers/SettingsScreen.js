import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useEffect, useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

export default function SettingsScreen({ setToken, userId, userToken }) {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  //Inputs
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [description, setDescription] = useState();

  const [photo, setPhoto] = useState();
  const [selectedPicture, setSelectedPicture] = useState();

  //Gestion de la récupération des données utilisateur
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
        // console.log(response.data);
        setData(response.data);
        setEmail(response.data.email);
        setUsername(response.data.username);
        setDescription(response.data.description);
        setPhoto(response.data.photo);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  //Gestion de la mise à jour du profil
  const handleUpdate = async () => {
    try {
      const obj = {};
      obj.email = email;
      obj.username = username;
      obj.description = description;

      const response = await axios.put(
        "https://express-airbnb-api.herokuapp.com/user/update",
        obj,
        {
          headers: {
            authorization: "Bearer " + userToken,
          },
        }
      );
      // console.log(response.data);
      if (response.data) {
        uploadPicture();
        alert("Your profile has been updated !");
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  //Gestion de la modification de la photo de profil via librairie
  const handleLibrary = async () => {
    const cameraLibraryPerm =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraLibraryPerm.status === "granted") {
      const pickPhoto = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (pickPhoto.cancelled === true) {
        alert("Changes cancelled");
      } else {
        // console.log(pickPhoto.uri);
        setSelectedPicture(pickPhoto.uri);
      }
    } else {
      alert("Permission denied");
    }
  };

  //Gestion de la modification de la photo de profil via appareil photo
  const handlePictureTake = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    if (cameraPermission.status === "granted") {
      const takePhoto = await ImagePicker.launchCameraAsync();
      console.log("photo uri ==> ", takePhoto.uri);
      setSelectedPicture(takePhoto.uri);
    } else {
      alert("Permission denied");
    }
  };

  //Gestion de l'upload de la nouvelle photo vers Cloudinary !!! TRAVAILLER SUR LA FONCTION !!! Mettre tout dnas la fonction update ?
  const uploadPicture = async () => {
    const tab = selectedPicture.split(".");
    try {
      const uri = selectedPicture;
      const formData = new FormData();
      formData.append("photo", {
        uri,
        name: `my-pic.${tab[tab.length - 1]}`,
        type: `image/${tab[tab.length - 1]}`,
      });
      console.log("formdata ==>", formData);

      const response = await axios.put(
        "https://express-airbnb-api.herokuapp.com/user/upload_picture",
        formData,
        {
          headers: {
            authorization: "Bearer " + userToken,
          },
        }
      );
      if (response.data) {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return isLoading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#E41D59" />
    </View>
  ) : (
    <KeyboardAwareScrollView style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/logoairbnb.png")}
          style={styles.logo}
        />
      </View>

      {/* Avatar/galerie */}
      <View style={styles.avatarAndIcons}>
        <View style={styles.avatarContainer}>
          {photo !== null ? (
            <Image />
          ) : (
            <FontAwesome5 name="user-alt" size={95} color="#eaeaea" />
          )}
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={handleLibrary}>
            <MaterialIcons name="photo-library" size={30} color="#989898" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePictureTake}>
            <MaterialIcons name="photo-camera" size={30} color="#989898" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Inputs */}
      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.inputs}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.inputs}
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.inputDescription}
          numberOfLines={4}
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
      </View>

      {/* Update/logout buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
          <Text style={styles.buttonsTxt}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logOutBtn}
          onPress={() => {
            setToken(null, null);
          }}
        >
          <Text style={styles.buttonsTxt}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
    height: "100%",
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

  //Avatar + icons
  avatarAndIcons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "25%",
    marginBottom: 30,
  },
  avatarContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F4759B",
    borderRadius: 100,
    marginRight: 15,
  },
  iconsContainer: {
    justifyContent: "space-evenly",
    height: "100%",
  },

  //Inputs
  inputsContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputs: {
    width: "85%",
    height: 40,
    borderBottomWidth: 2,
    marginBottom: 10,
    borderColor: "#F4759B",
  },
  inputDescription: {
    width: "85%",
    borderWidth: 2,
    textAlignVertical: "top",
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: "#F4759B",
  },

  //Update + Logout buttons
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  updateBtn: {
    backgroundColor: "white",
    borderColor: "#F4759B",
    borderWidth: 3,
    borderRadius: 30,
    width: "55%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  logOutBtn: {
    backgroundColor: "#eaeaea",
    borderColor: "#F4759B",
    borderWidth: 3,
    borderRadius: 30,
    width: "55%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  buttonsTxt: {
    fontSize: 18,
  },
});
