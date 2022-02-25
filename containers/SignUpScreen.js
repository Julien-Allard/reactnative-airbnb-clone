import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import { useState } from "react";

export default function SignUpScreen({ setToken, navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  //Gestion des messages d'erreur
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (
      email === "" ||
      username === "" ||
      description === "" ||
      password === "" ||
      confirmPass === ""
    ) {
      setError("Some fields are empty !");
    } else if (password !== confirmPass) {
      setError("Both passwords must be the same !");
    } else {
      try {
        const signupInfos = {
          email: email,
          username: username,
          description: description,
          password: password,
        };

        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/sign_up",
          signupInfos
        );

        const token = response.data.token;
        const id = response.data.id;
        setToken(token, id);
        setError("");

        // console.log(response.data);
      } catch (error) {
        console.log(error.response.data);
        console.log(error.response.status);

        if (
          error.response.data.error ===
            "This username already has an account." ||
          error.response.data.error === "This email already has an account."
        ) {
          setError(error.response.data.error);
        }
      }
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
        <Text style={styles.headerTxt}>Sign Up</Text>
      </View>
      <View style={{ width: "85%" }}>
        <TextInput
          style={styles.basicInputs}
          placeholder="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.basicInputs}
          placeholder="username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.descriptionInput}
          multiline={true}
          numberOfLines={4}
          placeholder="description"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
        <TextInput
          style={styles.basicInputs}
          placeholder="password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.basicInputs}
          placeholder="confirm-password"
          secureTextEntry={true}
          value={confirmPass}
          onChangeText={(text) => setConfirmPass(text)}
        />
        <View style={styles.submitZone}>
          <Text style={styles.alertMsg}>{error}</Text>
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() => {
              handleSubmit();
            }}
          >
            <Text style={styles.signupBtnText}>Sign up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          >
            <Text style={styles.signinBtn}>
              Already have an account ? Sign in
            </Text>
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
    height: 170,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
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
  basicInputs: {
    borderBottomColor: "#F4759B",
    borderBottomWidth: 2,
    marginBottom: 20,
    paddingVertical: 5,
  },

  //textarea pour description
  descriptionInput: {
    borderWidth: 2,
    borderColor: "#F4759B",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    textAlignVertical: "top",
  },

  //Bouton pour submit
  submitZone: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  signupBtn: {
    backgroundColor: "white",
    borderColor: "#E41D59",
    borderWidth: 2,
    borderRadius: 30,
    width: "60%",
    height: 55,
    color: "grey",
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
  signinBtn: {
    color: "grey",
  },
});
