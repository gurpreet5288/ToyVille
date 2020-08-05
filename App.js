import React from 'react'
import { Image } from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import LoadingScreen from './screens/LoadingScreen'
import LoginScreen from './screens/LoginScreen'
import SignUpScreen from './screens/SignUpScreen'
import HomeScreen from './screens/HomeScreen'
import LocationScreen from './screens/LocationScreen'
import PostScreen from './screens/PostScreen'
import FavoriteScreen from './screens/FavoriteScreen'
import ProfileScreen from './screens/ProfileScreen'
import ClickedToyScreen from './screens/ClickedToyScreen'
import ChatScreen from './screens/ChatScreen'
import MessageProfileScreen from './screens/MessageProfileScreen'
import EditProfileScreen from './screens/EditProfileScreen'
import RatingScreen from './screens/RatingScreen'
import ViewRatingScreen from './screens/ViewRatingScreen'
import SkipScreen from './screens/SkipScreen'
import ContactScreen from './screens/ContactScreen'
import HelpScreen from './screens/HelpScreen'
import * as firebase from 'firebase'
import { SplashScreen } from 'expo';

SplashScreen.preventAutoHide();
setTimeout(SplashScreen.hide, 6000);

var firebaseConfig = {
  apiKey: "AIzaSyDm-2u44A6FVXfBSKXc1og8aBAgId1uKNg",
  authDomain: "demoproject-47293.firebaseapp.com",
  databaseURL: "https://demoproject-47293.firebaseio.com",
  projectId: "demoproject-47293",
  storageBucket: "demoproject-47293.appspot.com",
  messagingSenderId: "318707409081",
  appId: "1:318707409081:web:4c909e11ed64a191667b68"
};

firebase.initializeApp(firebaseConfig);

const ScreensStack = createStackNavigator(
  {
    default: createBottomTabNavigator(
      {
        Home: {
          screen: HomeScreen,
          navigationOptions: {
            tabBarIcon: <Image source={require("./assets/newwhiteicons/home.png")} style={{ width: 25, height: 25 }}></Image>
          }
        },
        Location: {
          screen: LocationScreen,
          navigationOptions: {
            tabBarIcon: <Image source={require("./assets/newwhiteicons/location.png")} style={{ width: 17, height: 25 }}></Image>
          }
        },
        Post: {
          screen: PostScreen,
          navigationOptions: {
            tabBarIcon: <Image source={require("./assets/newwhiteicons/add.png")} style={{ width: 30, height: 25 }}></Image>
          }
        },
        Favorite: {
          screen: FavoriteScreen,
          navigationOptions: {
            tabBarIcon: <Image source={require("./assets/newwhiteicons/favorite.png")} style={{ width: 27, height: 22 }}></Image>
          }
        },
        Profile: {
          screen: ProfileScreen,
          navigationOptions: {
            tabBarIcon: <Image source={require("./assets/newwhiteicons/profile.png")} style={{ width: 25, height: 25 }}></Image>
          }
        }
      },
      {

        tabBarOptions: {
          style: {
            backgroundColor: '#FE7A15',
          },
          showLabel: false
        }
      }
    ),
    ClickedToy: ClickedToyScreen,
    Chat: ChatScreen,
    MessageProfile: MessageProfileScreen,
    EditProfile: EditProfileScreen,
    ViewRating: ViewRatingScreen,
    Rating: RatingScreen,
    Help: HelpScreen,
    Contact: ContactScreen
  },
  {
    headerMode: 'none',
  }
);

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  SignUp: SignUpScreen
},
  {
    headerMode: 'none',
  });

export default createAppContainer(
  createSwitchNavigator(
    {
      Skip: SkipScreen,
      Loading: LoadingScreen,
      Screens: ScreensStack,
      Auth: AuthStack
    },
    {
      initialRouteName: 'Skip'
    }
  )
);