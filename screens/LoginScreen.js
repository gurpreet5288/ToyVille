import React from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native'
import Backend from './Backend'
import firebase from 'firebase'
import 'firebase/firestore';
import * as Google from 'expo-google-app-auth';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

let customFonts = {
  'El_Messiri': require('../assets/fonts/ElMessiri-Bold.ttf'),
  'Open_Sans_Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
  'Open_Sans_SemiBold': require('../assets/fonts/OpenSans-SemiBold.ttf'),
  'Open_Sans_Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
};

export default class LoginScreen extends React.Component {

  static navigationOptions = {
    headerShown: false
  };

  state = {
    user: {
      name: "",
      email: "",
      image: "https://unsplash.com/photos/KuCGlBXjH_o"
    },
    email: "",
    password: "",
    errorMessage: null,
    fontsLoaded: false
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  handleSignUp = () => {
    Backend.shared.createGoogleUser(this.state.user);
    console.log(this.state.user);
  };

  onSignIn = (googleUser) => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );
        // Sign in with credential from the Google user.

        firebase.auth().signInWithCredential(credential).then(result => {
          this.setState({
            user: {
              name: result.user.displayName,
              email: result.user.email,
              image: result.user.photoURL
            }
          }); this.handleSignUp()
        }).catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          console.log(errorCode)
          var errorMessage = error.message;
          console.log(errorMessage)
          // The email of the user's account used.
          var email = error.email;
          console.log(email)
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          console.log(credential)
          // ...
        });
      } else {
        console.log('User already signed-in Firebase.');
      }
    }.bind(this));
  }

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: '980938045941-tl5pcj2jiclfkgjohgcmshi8t64ltooo.apps.googleusercontent.com',
        iosClientId: '980938045941-2r2s57bombpikqs5aavg01eo7a34qqtp.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  handleLogin = () => {
    const { email, password } = this.state
    firebase.auth().signInWithEmailAndPassword(email, password).catch(error => this.setState({ errorMessage: error.message }));
  };

  render() {
    const { fontsLoaded } = this.state;

    if (fontsLoaded) {

      return (
        <View style={styles.container}>
          <View>
            <Image source={require("../assets/logo.png")} style={{ marginTop: -60, width: 300, height: 200, alignSelf: "center" }}></Image>
          </View>

          <View style={styles.message}>
            {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
          </View>

          <View style={styles.main}>
            <View>
              <TextInput style={styles.box} autoCapitalize="none" onChangeText={email => this.setState({ email })} value={this.state.email} placeholder="Email"></TextInput>
            </View>

            <View style={{ marginTop: 32 }}>
              <TextInput style={styles.box} secureTextEntry autoCapitalize="none" onChangeText={password => this.setState({ password })} value={this.state.password} placeholder="Password"></TextInput>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
            <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600" }}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }} onPress={() => this.props.navigation.navigate("SignUp")}>
            <Text style={{ color: "#000", fontSize: 14, fontWeight: "500" }}>
              New to ToyVille? <Text style={{ fontSize: 16, fontWeight: "500", color: "#FE7A15" }}>Sign up</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleButton} onPress={this.signInWithGoogleAsync}>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", }}>
              <Image source={require("../assets/google.png")} style={{ width: 30, height: 30, alignSelf: "center" }}></Image>
              <Text style={{ color: "#000", fontSize: 16, fontWeight: "600" }}>LOGIN WITH GOOGLE</Text>
            </View>
          </TouchableOpacity>

        </View>

      )
    } else {
      return <AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },

  message: {
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30
  },

  error: {
    color: "#E9446A",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center"
  },

  main: {
    marginBottom: 48,
    marginHorizontal: 30
  },

  box: {
    borderBottomColor: "#FE7A15",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 16,
    color: "#161F3D",
    borderBottomWidth: 1,
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#0191B4",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center"
  },
  googleButton: {
    marginHorizontal: 30,
    bottom: -80,
    borderRadius: 4,
    borderWidth: 0.2,
    height: 52,
    alignItems: "center",
    justifyContent: "center"
  }
})