import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

let customFonts = {
  'El_Messiri': require('../assets/fonts/ElMessiri-Bold.ttf'),
  'Open_Sans_Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
  'Open_Sans_SemiBold': require('../assets/fonts/OpenSans-SemiBold.ttf'),
  'Open_Sans_Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
};

const slides = [
  {
    key: 'a',
    title: 'Toy Trade',
    text: 'Making it more easy for you to buy, sell and exchange toys via Toy Ville. Sign up by today to get started and toys at reasonable prices or even free of cost.',
    image: require('../assets/trade.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 'b',
    title: 'Geo Location',
    text: 'Track the sellers location through Geo location and reach to the location without any inconvenience.',
    image: require('../assets/geolocation.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 'c',
    title: 'Chat',
    text: 'Contact directly to the seller by sending message with single click and get more details about the toy and negotiate for the price of toy.',
    image: require('../assets/chat.png'),
    backgroundColor: '#22bcb5',
  }
];

export default class SkipScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      showRealApp: false
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }


  _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  }
  _onDone = () => {
    this.setState({ showRealApp: true });
  }

  _renderNextButton = () => {
    return (
      <View style={{
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 170
      }}>
        <Text style={{ color: "#000", fontFamily: 'Open_Sans_Regular', fontSize: 20, textDecorationLine: "underline" }}>Skip</Text>
      </View>
    )
  }

  _renderDoneButton = () => {
    return (
      <View style={{
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 170
      }}>
        <Text style={{ color: "#000", fontSize: 20, textDecorationLine: "underline" }}>Skip</Text>
      </View>
    )
  }


  navigate = () => {
    const { navigation } = this.props
    setTimeout(() => {
      navigation.navigate('Loading')
    }, 100);
  }

  render() {
    const { fontsLoaded } = this.state;
    if (this.state.showRealApp) {
      return (
        <View>
          {this.navigate()}
        </View>
      );
    } else {
      if (fontsLoaded) {
        return <AppIntroSlider renderItem={this._renderItem} data={slides} onDone={this._onDone} renderDoneButton={this._renderDoneButton} renderNextButton={this._renderNextButton} dotStyle={styles.dotStyle} activeDotStyle={styles.activeDotStyle} />;
      } else {
        return <AppLoading />;
      }
    }
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontFamily: 'Open_Sans_SemiBold',
    fontSize: 24,
    color: '#000',
    fontWeight: '600',
    marginTop: 10
  },
  text: {
    fontFamily: 'Open_Sans_Regular',
    color: '#000',
    fontSize: 16,
    marginVertical: 10,
    marginHorizontal: 20,
    textAlign: 'center'
  },
  image: {
    width: 300,
    height: 220,
    resizeMode: 'contain'
  },
  dotStyle: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FE7A15",
    bottom: 170
  },
  activeDotStyle: {
    backgroundColor: "#FE7A15",
    borderWidth: 1,
    borderColor: "#FE7A15",
    bottom: 170
  }
});