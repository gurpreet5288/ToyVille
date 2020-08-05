import React from 'react';
import { GiftedChat, InputToolbar, Bubble, Send, Icon } from 'react-native-gifted-chat';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import Backend from './Backend';
import firebase from 'firebase'
import 'firebase/firestore';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

let customFonts = {
  'El_Messiri': require('../assets/fonts/ElMessiri-Bold.ttf'),
  'Open_Sans_Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
  'Open_Sans_SemiBold': require('../assets/fonts/OpenSans-SemiBold.ttf'),
  'Open_Sans_Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
};

export default class ChatScreen extends React.Component {

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {

    this._loadFontsAsync();

    Backend.shared.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message)
      }))
    );
    console.log(Backend.shared.uid);
  }

  componentWillUnmount() {
    Backend.shared.off();
  }

  state = {
    messages: [],
    fontsLoaded: false
  };

  get user() {
    return {
      name: this.props.navigation.state.params.name,
      _id: Backend.shared.uid
    };
  }

  render() {

    const { fontsLoaded } = this.state;

    const customInputToolbar = props => {
      return (
        <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: "white",
            borderColor: "#FE7A15",
            borderWidth: 1,
            borderRadius: 10,
            bottom: 50,
            marginHorizontal: 10,
            marginVertical: 10
          }}
        />
      );
    };

    const customRenderSend = props => {
      return (
        <Send
          {...props}
          containerStyle={{
            backgroundColor: "#FE7A15",
            borderColor: "#FE7A15",
            borderWidth: 1,
            borderRadius: 50,
            marginHorizontal: 10,
            marginVertical: 10,
            height: 30,
            width: 30
          }}>
          <Entypo name="arrow-up" size={27} color="#fff" />
        </Send>
      );
    }

    const customRenderBubble = props => {
      return (
        <Bubble
          {...props}
          textStyle={{
            left: {
              color: "#fff"
            },
            right: {
              color: "#fff"
            }
          }}
          wrapperStyle={{
            left: {
              borderStyle: "solid",
              borderRadius: 6,
              backgroundColor: '#0191B4',
              bottom: 60
            },
            right: {
              borderStyle: "solid",
              borderRadius: 6,
              backgroundColor: '#FE7A15',
              bottom: 60
            }
          }}
        />
      );
    }

    if (fontsLoaded) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image source={require("../assets/newwhiteicons/back.png")} style={{ width: 15, height: 25, marginBottom: 11 }}></Image>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={{ color: "#fff", fontSize: 30, fontWeight: 'bold', fontFamily: "El_Messiri", paddingBottom: -5 }}>MESSAGES</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require("../assets/newwhiteicons/notification.png")} style={{ width: 20, height: 25, marginBottom: 11 }}></Image>
            </TouchableOpacity>
          </View>
          <GiftedChat
            messages={this.state.messages}
            onSend={Backend.shared.send}
            user={this.user}
            renderAvatar={() => null}
            renderInputToolbar={props => customInputToolbar(props)}
            renderBubble={props => customRenderBubble(props)}
            renderSend={props => customRenderSend(props)}
          />

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")}>
              <Image source={require("../assets/newwhiteicons/home.png")} style={{ width: 25, height: 25 }}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Location")}>
              <Image source={require("../assets/newwhiteicons/location.png")} style={{ width: 17, height: 25 }}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Post")}>
              <Image source={require("../assets/newwhiteicons/add.png")} style={{ width: 30, height: 25 }}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Favorite")}>
              <Image source={require("../assets/newwhiteicons/favorite.png")} style={{ width: 27, height: 22 }}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Profile")}>
              <Image source={require("../assets/newwhiteicons/profile.png")} style={{ width: 25, height: 25 }}></Image>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      );
    } else {
      return <AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    width: '100%',
    height: '12%',
    flexDirection: "row",
    backgroundColor: '#FE7A15',
    justifyContent: "space-between",
    alignItems: 'flex-end',
    paddingTop: 45,
    paddingHorizontal: 32,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#FE7A15',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  footer: {
    position: 'absolute',
    width: '100%',
    height: '10%',
    flexDirection: "row",
    backgroundColor: '#FE7A15',
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#FE7A15',
    bottom: 0
  }
})