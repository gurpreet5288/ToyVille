import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
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

export default class RatingScreen extends React.Component {

    dbCollection = null;
    constructor() {
        super();
        this.state = {
            fontsLoaded: false,
            initialRating: 0,
            totalRating: 5,
            title: "",
            reviewTitle: "",
            review: "",
            userRating: "",
            name: "",
            image: 'https://unsplash.com/photos/KuCGlBXjH_o'
        };

    }

    userRating(key) {
        this.setState({ initialRating: key });
        //Keeping the Rating Selected in state
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
                    this.setState({
                        name: doc.data().name,
                        image: doc.data().image
                    });
                });
            });

        const { navigation } = this.props;
        const pass_id = navigation.getParam('passToyId', 'NO-Id');
        const other_param = navigation.getParam('otherParam', 'some default value');

        const vj = pass_id;
        console.log(`${pass_id}`)

        this.setState({
            title: vj
        });

        console.log(`${this.state.title}`)
    }

    handlePost = () => {
        Backend.shared.addReview({ name: this.state.name.trim(), userRating: this.state.initialRating, title: this.state.title, reviewTitle: this.state.reviewTitle.trim(), review: this.state.review.trim(), image: this.state.image }).then(ref => {
            this.setState({ name: "", userRating: "", reviewTitle: "", review: "", title: "", image: 'https://unsplash.com/photos/KuCGlBXjH_o' });
            this.props.navigation.goBack();
        }).catch(error => {
            alert(error);
        })
    }

    componentWillUnmount() {
        this.dbCollection = null;
    }

    render() {
        let ratingBar = [];
        for (var i = 1; i <= this.state.totalRating; i++) {
            ratingBar.push(
                <TouchableOpacity
                    activeOpacity={0.7}
                    key={i}
                    onPress={this.userRating.bind(this, i)}>
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

        const { fontsLoaded } = this.state;

        if (fontsLoaded) {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image source={require("../assets/newwhiteicons/back.png")} style={{ width: 15, height: 25, marginBottom: 11 }}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={{ color: "#fff", fontSize: 30, fontWeight: 'bold', fontFamily: "El_Messiri", paddingBottom: -5 }}>POST REVIEW</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={require("../assets/newwhiteicons/notification.png")} style={{ width: 20, height: 25, marginBottom: 11 }}></Image>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }}>
                        <View style={{ display: "flex", flexDirection: "column", marginTop: 80, marginHorizontal: 30 }}>
                            <View>
                                <Text style={{ color: "#D3DD18", fontWeight: "500", fontSize: 16, fontFamily: 'Open_Sans_Bold' }}>Write Your Review</Text>
                            </View>
                        </View>

                        <View style={styles.ratingBarStyle}>{ratingBar}</View>

                        <TextInput onChangeText={reviewTitle => this.setState({ reviewTitle })} value={this.state.reviewTitle} numberOfLines={4} style={{ borderWidth: 1, borderStyle: "solid", borderRadius: 4, height: 40, borderColor: '#FE7A15', paddingHorizontal: 15, marginHorizontal: 30, marginVertical: 15, fontFamily: 'Open_Sans_Regular' }} placeholder="Review Title"></TextInput>
                        <TextInput onChangeText={review => this.setState({ review })} value={this.state.review} multiline={true} numberOfLines={10} style={{ borderWidth: 1, borderStyle: "solid", borderRadius: 4, height: 120, borderColor: '#FE7A15', paddingHorizontal: 15, marginHorizontal: 30, marginVertical: 15, fontFamily: 'Open_Sans_Regular' }} placeholder="Review"></TextInput>

                        <TouchableOpacity style={styles.button} onPress={this.handlePost}>
                            <Text style={{ color: "#FFF", fontFamily: 'Open_Sans_Regular', fontSize: 24 }}>Post</Text>
                        </TouchableOpacity>

                    </View>

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
    ratingBarStyle: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 50,
    },
    button: {
        marginHorizontal: 40,
        marginTop: 40,
        backgroundColor: "#0191B4",
        borderRadius: 5,
        height: 52,
        alignItems: "center",
        justifyContent: "center"
    },
    StarImage: {
        width: 40,
        height: 40,
        marginHorizontal: 5
    },
    textStyle: {
        textAlign: 'center',
        fontSize: 23,
        color: '#000',
        marginTop: 15,
    },
    textStyleSmall: {
        textAlign: 'center',
        fontSize: 16,
        color: '#000',
        marginTop: 15,
    },
});