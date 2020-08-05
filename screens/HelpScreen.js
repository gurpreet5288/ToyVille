import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import Backend from './Backend'
import HelpDropdown from './HelpDropdown'
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

export default class HelpScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            menu: [
                {
                    key: 'a',
                    question: '1. How do I create a post?',
                    answer: 'To create a post, tap the "Add Post" icon on the bottom tab bar that will open a new screen. Then user can fill the details related to toys, select images from gallery and post it.',
                },
                {
                    key: 'b',
                    question: '2. How do I upload photos from the phone?',
                    answer: 'First, make sure you have given us access to your gallery. Once the gallery is open, select from your saved photos and tap the "Upload" button.'
                },
                {
                    key: 'c',
                    question: '3. How do I view archieved or sold items?',
                    answer: 'Currenly this option is not available for the users.'
                },
                {
                    key: 'd',
                    question: '4. How do I update my Bio?',
                    answer: 'In the Profile screen tap "Edit Profile" button and a new screen will be opened where user can update their bio by providing details.'
                },
                {
                    key: 'e',
                    question: '5. How do I track the location?',
                    answer: 'Go to the Home screen , click the "Geo Location" option that will open the location screen. Now user can see their own location as well as another users locations who have uploaded their toys on ToyVille.'
                },
                {
                    key: 'f',
                    question: '6. How do I add a toy to favorites?',
                    answer: 'When a user will click on an individual toy then a new screen will be opened which shows all the details about the toy and a button to add the toy to favorites list. Then from the bottom tab user can click on "Favorites" icon that will open the favorites screen for the user.'
                },
                {
                    key: 'g',
                    question: '7. How do I chat with another user?',
                    answer: 'User can click on the "Contact" button on individual toy screen and then click on the "Message" button to chat with the user who uploaded that toy'
                },
            ]
        }
    }

    renderAnswers = () => {
        const items = [];
        for (item of this.state.menu) {
            items.push(
                <HelpDropdown
                    key={item.key}
                    question={item.question}
                    answer={item.answer}
                />
            );
        }
        return items;
    }


    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
    }


    render() {

        const { fontsLoaded } = this.state;

        if (fontsLoaded) {

            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image source={require("../assets/newwhiteicons/back.png")} style={{ width: 15, height: 25, marginBottom: 11 }}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={{ color: "#fff", fontSize: 30, fontWeight: 'bold', fontFamily: "El_Messiri", paddingBottom: -5 }}>HELP</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={require("../assets/newwhiteicons/notification.png")} style={{ width: 20, height: 25, marginBottom: 11 }}></Image>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.textContainer}>
                        <View style={{ display: "flex", flexDirection: "column", marginTop: 10, marginBottom: 10, marginHorizontal: 20 }}>
                            <View>
                                <Text style={{ color: "#D3DD18", fontWeight: "500", fontSize: 16, fontFamily: 'Open_Sans_Bold' }}>Need Help?</Text>
                            </View>
                        </View>

                        {this.renderAnswers()}

                    </View>

                    <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate("Contact")}>
                        <Text style={{ color: "#FFF", fontFamily: 'Open_Sans_Regular', fontSize: 24 }}>Contact Us</Text>
                    </TouchableOpacity>

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
            )
        } else {
            return <AppLoading />;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
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
    },
    imageContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 32,
        marginVertical: 15,
        marginTop: 10
    },
    textContainer: {
        flex: 1,
        padding: 10,
        marginTop: 60,
        flexDirection: "column",
    },
    uploadedPhotos: {
        justifyContent: "space-evenly",
        flexDirection: "row",
        height: 100
    },
    addIcon: {
        justifyContent: "center",
        alignItems: 'center',
        flexDirection: "row",
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#FE7A15',
        borderRadius: 10,
        height: 80,
        width: 70,
        backgroundColor: "#fff"
    },
    button: {
        marginHorizontal: 50,
        bottom: 80,
        backgroundColor: "#0191B4",
        borderRadius: 5,
        height: 52,
        alignItems: "center",
        justifyContent: "center"
    },
    containerStyle: {
        marginHorizontal: 20,
        marginVertical: 15,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#FE7A15',
        borderRadius: 4
    }
})