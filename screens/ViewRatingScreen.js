import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image, RefreshControl } from 'react-native'
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

export default class ViewRatingScreen extends React.Component {

    dbCollection = null;

    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            passToyId: '',
            toyId: '',
            passId: '',
            totalRating: 5,
            item: [],
            uid: '',
            isFetching: false
        }
    }

    onRefresh() {
        this.setState({ isFetching: true, }, () => { this.componentDidMount(); });
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    /************************* Retrieving data from firebase **************************************/
    componentDidMount() {

        this._loadFontsAsync();

        const { navigation } = this.props;
        const pass_id = navigation.getParam('passId', 'NO-Id');
        const other_param = navigation.getParam('otherParam', 'some default value');

        const vj = pass_id;
        console.log(`"pass_id is" + " " ${vj}`);

        this.dbCollection = Backend.shared.firestore
            .collection("reviews").where("title", "==", vj)
            .get().then
            (onSnapShot => {
                const firebaseData = [];
                onSnapShot.forEach((doc) => {
                    const { reviewTitle, review, userRating, name, title, image } = doc.data();
                    firebaseData.push({
                        key: doc.id,
                        reviewTitle,
                        review,
                        userRating,
                        name,
                        title,
                        image
                    });
                });
                this.setState({
                    item: firebaseData,
                    isFetching: false
                });
            });

        this.dbCollection = Backend.shared.firestore
            .collection("posts").where("textTitle", "==", vj)
            .get().then
            (onSnapShot => {
                onSnapShot.forEach((doc) => {
                    const { textTitle, image1, image2, image3, textDescription, textLocation, textCategory, textPrice, timestamp, uid } = doc.data();
                    this.setState({
                        toyId: doc.data().textTitle
                    });
                });
            });

    }

    componentWillUnmount() {
        this.dbCollection = null;
    }

    renderItem = (item) => {
        const { navigate } = this.props.navigation;

        let ratingBar = [];

        for (var i = 1; i <= this.state.totalRating; i++) {
            ratingBar.push(
                <TouchableOpacity key={i} onPress={() => this.props.navigation.goBack()}>
                    <Image
                        style={styles.StarImage}
                        source={
                            i <= item.userRating
                                ? require("../assets/star_filled.png")
                                : require("../assets/star.png")
                        }
                    />
                </TouchableOpacity>
            );
        }

        return (

            <View style={{ borderRadius: 10, borderColor: "#FE7A15", borderWidth: 0.5, height: 120, marginVertical: 10, zIndex: 1 }}>

                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={styles.one} >
                            <Image source={{ uri: item.image }} style={styles.favoriteImage1} />
                        </View>
                        <View style={styles.two}>

                            <Text style={{ marginHorizontal: 5, marginVertical: 1 }}>
                                <Text style={styles.favoriteTitleText}>{item.name}</Text>
                            </Text>

                            <Text style={{ marginHorizontal: 5, marginVertical: 1 }}>
                                <Text style={styles.favoriteDescription}>{item.review}</Text>
                            </Text>

                            <View style={styles.ratingBarStyle}>{ratingBar}</View>

                        </View>
                    </View>
                </TouchableOpacity>

            </View>
        )
    };

    render() {

        const { item, toyId, fontsLoaded } = this.state;
        console.log("Toy id is " + toyId);

        const { navigate } = this.props.navigation;

        if (fontsLoaded) {

            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image source={require("../assets/newwhiteicons/back.png")} style={{ width: 15, height: 25, marginBottom: 11 }}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={{ color: "#fff", fontSize: 30, fontWeight: 'bold', fontFamily: "El_Messiri", paddingBottom: -5 }}>RATE & REVIEW</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={require("../assets/newwhiteicons/notification.png")} style={{ width: 20, height: 25, marginBottom: 11 }}></Image>
                        </TouchableOpacity>
                    </View>

                    <View style={{ display: "flex", flexDirection: "column", marginTop: 80, marginHorizontal: 30 }}>
                        <View>
                            <Text style={{ color: "#D3DD18", fontWeight: "500", fontSize: 16, fontFamily: 'Open_Sans_Bold' }}>Rate and Reviews</Text>
                        </View>
                    </View>

                    <FlatList style={styles.main} data={this.state.item} renderItem={({ item }) => this.renderItem(item)} showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                onRefresh={() => this.onRefresh()}
                                refreshing={this.state.isFetching}
                            />
                        } />

                    <TouchableOpacity onPress={() =>
                        this.props.navigation.navigate('Rating', {
                            passToyId: toyId,
                            otherParam: '101'
                        })
                    }  >
                        <View style={styles.button}>
                            <Text style={{ color: "#FFF", fontFamily: 'Open_Sans_Regular', fontSize: 24 }}>Add a Review</Text>
                        </View>
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
    ratingBarStyle: {
        flexDirection: 'row',
        marginHorizontal: 5,
        marginVertical: 1
    },
    StarImage: {
        width: 12,
        height: 12,
        marginVertical: 2,
        marginBottom: 20
    },
    toyTitle: {
        marginHorizontal: 40,
        marginTop: 20,
        fontWeight: 'bold',
        fontSize: 30
    },
    main: {
        marginTop: 20,
        marginHorizontal: 25
    },
    one: {
        flex: 1 / 3,
        justifyContent: 'center'
    },
    two: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    favoriteImage1: {
        width: 80,
        height: 119,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    favoriteTitleText: {
        fontFamily: 'Open_Sans_SemiBold',
        marginVertical: 2
    },
    favoriteTitle: {
        marginVertical: 2
    },
    favoriteDescriptionText: {
        marginVertical: 2,
        fontWeight: 'bold'
    },
    favoriteDescription: {
        fontFamily: 'Open_Sans_Regular',
        marginVertical: 2
    },
    timestamp: {
        fontSize: 15,
        fontWeight: "500",
        color: "#fff"
    }
})