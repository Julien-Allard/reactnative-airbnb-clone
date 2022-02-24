import { useNavigation } from "@react-navigation/core";
import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import { useState } from "react";

export default function SignInScreen({ setToken }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      if (email === "" || password === "") {
        alert("Please fill all fields !");
      } else {
        const signinInfos = {
          email: email,
          password: password,
        };

        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/log_in",
          signinInfos
        );

        // console.log(response.data);

        const token = response.data.token;
        setToken(token);
        alert("Connexion réussie !");
      }
    } catch (error) {
      console.log(error.response.data);
      console.log(error.response.status);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      {/* header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/logoairbnb.png")}
          resizeMode="contain"
          style={styles.logo}
        />
        <Text style={styles.headerTxt}>Sign In</Text>
      </View>

      {/* zone input */}
      <View style={styles.inputZone}>
        <TextInput
          style={styles.basicInputs}
          placeholder="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.basicInputs}
          placeholder="password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        {/* zone bouton submit */}
        <View style={styles.submitZone}>
          {(password === "" || email === "") && (
            <Text style={styles.alertMsg}>Please fill all fields</Text>
          )}

          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() => {
              handleSubmit();
            }}
          >
            <Text style={styles.signupBtnText}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <Text style={styles.registerBtn}>No account ? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  //logo et header
  header: {
    width: "85%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 220,
    height: 150,
  },
  headerTxt: {
    fontSize: 22,
    fontWeight: "bold",
    color: "grey",
  },

  // Input pour formulaire
  inputZone: {
    width: "85%",
  },
  basicInputs: {
    borderBottomColor: "#E41D59",
    borderBottomWidth: 2,
    marginBottom: 20,
    paddingVertical: 5,
  },

  //textarea pour description
  descriptionInput: {
    borderWidth: 2,
    borderColor: "#E41D59",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    textAlignVertical: "top",
  },

  //Bouton pour submit
  submitZone: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 60,
  },
  signupBtn: {
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
  signupBtnText: {
    fontSize: 17,
    fontWeight: "700",
    color: "grey",
  },
  alertMsg: {
    color: "red",
  },
  registerBtn: {
    color: "grey",
  },
});
