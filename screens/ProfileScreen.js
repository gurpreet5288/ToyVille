import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Button, RefreshControl } from 'react-native'
import Backend from './Backend'
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

export default class ProfileScreen extends React.Component {

    dbCollection = null;

    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            toyTitle: '',
            id: '',
            passId: '',
            initialRating: 4,
            totalRating: 5,
            firstName: "",
            lastName: "",
            phoneNumber: "",
            name: "",
            location: "",
            status: "",
            description: "",
            email: "",
            image: 'https://unsplash.com/photos/KuCGlBXjH_o'
        }

    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    /************************* Retrieving data from firebase **************************************/
    componentDidMount() {

        this._loadFontsAsync();

        const { uid } = firebase.auth().currentUser;
        this.setState({ uid });
        console.log(uid);

        this.dbCollection = Backend.shared.firestore
            .collection("users").where("uid", "==", uid)
            .get().then
            (onSnapShot => {
                onSnapShot.forEach((doc) => {
                    const { name } = doc.data();
                    this.setState({
                        id: doc.data().uid,
                        firstName: doc.data().firstName,
                        lastName: doc.data().lastName,
                        phoneNumber: doc.data().phoneNumber,
                        name: doc.data().name,
                        location: doc.data().location,
                        status: doc.data().status,
                        description: doc.data().description,
                        email: doc.data().email,
                        image: doc.data().image
                    });
                });
            });

        this.dbCollection = Backend.shared.firestore
            .collection("posts").where("uid", "==", uid)
            .get().then
            (onSnapShot => {
                onSnapShot.forEach((doc) => {
                    const { name } = doc.data();
                    this.setState({
                        toyTitle: doc.data().textTitle
                    });
                });
            });

    }

    componentWillUnmount() {
        this.dbCollection = null;
    }

    render() {

        const { navigate } = this.props.navigation;

        const { firstName, lastName, email, name, description, toyTitle, status, location, phoneNumber, image, fontsLoaded } = this.state;
        console.log(firstName);

        let ratingBar = [];
        for (var i = 1; i <= this.state.totalRating; i++) {
            ratingBar.push(
                <TouchableOpacity
                    activeOpacity={0.7}
                    key={i}
                    onPress={() =>
                        this.props.navigation.navigate('ViewRating', {
                            passId: toyTitle,
                            otherParam: '101'
                        })
                    }>
                    <Image
                        style={styles.StarImage}
                        source={
                            i <= this.state.initialRating
                                ? require("../assets/star_filled.png")
                                : require("../assets/star.png")
                        }
                    />
                </TouchableOpacity>
            );
        }

        if (fontsLoaded) {

            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")}>
                            <Image source={require("../assets/newwhiteicons/back.png")} style={{ width: 15, height: 25, marginBottom: 11 }}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={{ color: "#fff", fontSize: 30, fontWeight: 'bold', fontFamily: "El_Messiri", paddingBottom: -5 }}>PROFILE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={require("../assets/newwhiteicons/notification.png")} style={{ width: 20, height: 25, marginBottom: 11 }}></Image>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }}>

                        <View style={styles.imageContainer}>
                            <Image source={{ uri: image }} style={{ width: 150, height: 150, alignSelf: "center", borderRadius: 150 / 2 }}></Image>
                            <Text style={styles.profileName}>{name}</Text>
                        </View>

                        <View style={styles.ratingBarStyle}>{ratingBar}</View>

                        <View style={{ marginTop: 80, marginHorizontal: 30, alignSelf: "center" }}>
                            <Text style={{ marginVertical: 5 }}>
                                <Text style={styles.profileEmailText}>Email Address: </Text>
                                <Text style={styles.profileEmail}>{email}</Text>
                            </Text>

                            <Text style={{ marginVertical: 5 }}>
                                <Text style={styles.profileLocationText}>Location: </Text>
                                <Text style={styles.profileLocation}>{location}</Text>
                            </Text>

                            <Text style={{ marginVertical: 5 }}>
                                <Text style={styles.profileDescriptionText}>Description: </Text>
                                <Text style={styles.profileDescription}>{description}</Text>
                            </Text>
                        </View>

                        <View style={styles.button}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("EditProfile", {

                            })}>
                                <Text style={{ color: "#FFF", fontFamily: 'Open_Sans_Regular', fontSize: 24 }}>Edit Profile</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.button2}>
                            <TouchableOpacity onPress={() => { Backend.shared.signOut() }}>
                                <Text style={{ color: "#FFF", fontFamily: 'Open_Sans_Regular', fontSize: 24 }}>Sign Out</Text>
                            </TouchableOpacity>
                        </View>

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
    imageContainer: {
        marginTop: 90
    },
    ratingBarStyle: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginHorizontal: 40
    },
    StarImage: {
        width: 25,
        height: 25,
        marginHorizontal: 2,
        marginBottom: 20
    },
    button: {
        position: 'absolute',
        marginHorizontal: 40,
        bottom: 120,
        backgroundColor: "#0191B4",
        borderRadius: 5,
        height: 42,
        width: '80%',
        alignItems: "center",
        justifyContent: "center"
    },
    button2: {
        position: 'absolute',
        marginHorizontal: 40,
        bottom: 60,
        backgroundColor: "#0191B4",
        borderRadius: 5,
        height: 42,
        width: '80%',
        alignItems: "center",
        justifyContent: "center"
    },
    profileName: {
        fontFamily: 'Open_Sans_SemiBold',
        marginVertical: 8,
        alignSelf: 'center',
        fontSize: 24
    },
    profileEmailText: {
        fontFamily: 'Open_Sans_SemiBold',
        fontSize: 16
    },
    profileEmail: {
        fontFamily: 'Open_Sans_Regular',
        fontSize: 15
    },
    profileLocationText: {
        fontFamily: 'Open_Sans_SemiBold',
        fontSize: 16
    },
    profileLocation: {
        fontFamily: 'Open_Sans_Regular',
        fontSize: 15
    },
    profileDescriptionText: {
        fontFamily: 'Open_Sans_SemiBold',
        fontSize: 16
    },
    profileDescription: {
        fontFamily: 'Open_Sans_Regular',
        fontSize: 15
    }
})