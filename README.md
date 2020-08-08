# ToyVille

### Google Sign In Flow 

Screens that have code for google sign in are:
LoginScreen.js
Backend.js

First of all, we setup an app on Google Developer Console, and created iOS OAuth client
Id, android OAuth client id, Web client id. We replaced our firebase’s web client ID and web
client secret with this mew web client id and secret. Then we installed Expo-Google-App-
Auth that provides Google Sign in for expo react native apps. After that we used the
following steps:

On LoginScreen.js
1. signInWithGoogleAsync function- In this function, we added the both iOS as well as
Android client ids along with scopes profile and email. This function return access
and id token along with additional user information such as name, email, profile
picture etc. Reference to another function (onSignIn) is given in this function and
result is passed as an argument in the (this.onSignIn(result)) function.
2. onSignIn function- This function handles firebase connectivity of our OAuth. Here,
we use google’s id token and check whether the google user is already signed in
firebase. Here we also set our user details name, email and image as google user’s
details and put reference to handleSignUp function.
3. handleSignUp function- In this function we made a call to createGoogleUser function
that is defined in Backend.js file and we passed our user’s details in this function .
The user details were set in the previous function.

On Backend.js
1. createGoogleUser function- This function adds our google user on firestore.




Mobile App References

https://www.npmjs.com/package/firebase (Firebase package)

https://docs.expo.io/guides/using-firebase/#user-authentication (Firebase with Expo)

https://firebase.google.com/docs/auth/web/manage-users (Managing users in Firebase)

https://docs.expo.io/versions/latest/sdk/google/ (Expo-Google-App-Auth API)

https://firebase.google.com/docs/auth/web/google-signin#advanced:-handle-the-sign-in-flow-manually (Handling Google Firebase Sign-In flow manually)

https://docs.expo.io/versions/latest/sdk/imagepicker/ (Expo Image-Picker API)

https://github.com/FaridSafi/react-native-gifted-chat (React Native Gifted Chat)

https://reactnativeexample.com/a-picker-dropdown-component-for-react-native/ (Picker “Dropdown” component for React Native)

https://icons.expo.fyi/AntDesign/delete (AntDesign Delete Icon)

https://icons.expo.fyi/MaterialIcons/favorite (MaterialIcons Favorite Icon)

https://icons.expo.fyi/FontAwesome/caret-up (FontAwesome caret-up Icon)

https://icons.expo.fyi/FontAwesome/caret-down (FontAwesome caret-down  Icon)

https://www.npmjs.com/package/react-native-app-intro-slider (React-native App-Intro-Slider package)

https://docs.expo.io/versions/latest/sdk/location/ (Expo-location API)

https://medium.com/enappd/geolocation-and-reverse-geocoding-in-react-native-7339b70496eb (GeoLocation,  geocoding and reverse geocoding in Expo and React Native)

https://docs.expo.io/guides/using-custom-fonts/?redirected (Using custom fonts in Expo and react native)

https://reactnavigation.org/docs/getting-started (React navigation)

https://reactnavigation.org/docs/bottom-tab-navigator/ (React native bottom tab navigator)
