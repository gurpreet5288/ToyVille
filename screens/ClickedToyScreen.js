import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
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

export default class ClickedToyScreen extends React.Component {

    dbCollection = null;

    constructor(props) {
        super(props);
        this.state = {
            initialRating: 4,
            totalRating: 5,
            passId: '',
            id: '',
            toyTitle: '',
            toyCategory: '',
            toyDescription: '',
            toyMaterial: '',
            toyImage1: 'https://unsplash.com/photos/3Om4DHcaAc0',
            toyImage2: 'https://unsplash.com/photos/3Om4DHcaAc0',
            toyLocation: '',
            toyImage3: 'https://unsplash.com/photos/3Om4DHcaAc0',
            toyImage4: 'https://unsplash.com/photos/3Om4DHcaAc0',
            image: 'https://unsplash.com/photos/3Om4DHcaAc0',
            toyPrice: '',
            favoriteTitle: '',
            favoritePrice: '',
            favoriteMaterial: '',
            favoriteCategory: '',
            favoriteDescription: '',
            favoriteImage1: 'https://unsplash.com/photos/3Om4DHcaAc0',
            favoriteImage2: 'https://unsplash.com/photos/3Om4DHcaAc0',
            favoriteImage3: 'https://unsplash.com/photos/3Om4DHcaAc0',
            favoriteImage4: 'https://unsplash.com/photos/3Om4DHcaAc0',
            userRating: '',
            name: '',
            fontsLoaded: false
        }
    }

    handleFavorite = () => {
        Backend.shared.addFavorite({ favoriteTitle: this.state.toyTitle.trim(), favoritePrice: this.state.toyPrice.trim(), favoriteMaterial: this.state.toyMaterial.trim(), favoriteCategory: this.state.toyCategory.trim(), favoriteDescription: this.state.toyDescription.trim(), favoriteImage1: this.state.toyImage1, favoriteImage2: this.state.toyImage2, favoriteImage3: this.state.toyImage3, favoriteImage4: this.state.toyImage4, userRating: this.state.userRating }).then(ref => {
            this.setState({ favoriteTitle: '', favoritePrice: '', favoriteMaterial: '', favoriteCategory: '', favoriteDescription: '', userRating: '', favoriteImage1: 'https://unsplash.com/photos/3Om4DHcaAc0', favoriteImage2: 'https://unsplash.com/photos/3Om4DHcaAc0', favoriteImage3: 'https://unsplash.com/photos/3Om4DHcaAc0', favoriteImage4: 'https://unsplash.com/photos/3Om4DHcaAc0' });
            this.props.navigation.goBack();
        }).catch(error => {
            alert(error);
        })
    }

    Load_New_Image = (uri) => {
        this.setState({
            image: uri
        })
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
                        name: doc.data().name
                    });
                });
            });

        const { navigation } = this.props;
        const toy_title = navigation.getParam('toyTitle', 'NO-Toy');
        const other_param = navigation.getParam('otherParam', 'some default value');

        const vj = toy_title;
        console.log(`${vj}`);

        this.dbCollection = Backend.shared.firestore
            .collection("posts").where("textTitle", "==", vj)
            .get().then
            (onSnapShot => {
                const firebaseData = [];
                onSnapShot.forEach((doc) => {
                    const { textTitle, image1, image2, image3, image4, textDescription, textLocation, textCategory, textPrice, timestamp } = doc.data();
                    this.setState({
                        id: doc.data().uid,
                        toyTitle: doc.data().textTitle,
                        toyCategory: doc.data().textCategory,
                        toyDescription: doc.data().textDescription,
                        toyImage1: doc.data().image1,
                        toyImage2: doc.data().image2,
                        toyImage3: doc.data().image3,
                        toyImage4: doc.data().image4,
                        image: doc.data().image1,
                        toyPrice: doc.data().textPrice,
                        toyMaterial: doc.data().textMaterial,
                        toyLocation: doc.data().textLocation
                    });
                });
            });

        this.dbCollection = Backend.shared.firestore
            .collection("reviews").where("title", "==", vj)
            .get().then
            (onSnapShot => {
                const firebaseData = [];
                onSnapShot.forEach((doc) => {
                    const { userRating } = doc.data();
                    this.setState({
                        userRating: doc.data().userRating
                    });
                });
            });
    }

    componentWillUnmount() {
        this.dbCollection = null;
    }


    render() {

        const { navigation } = this.props;
        const toy_title = navigation.getParam('toyTitle', 'NO-Toy');
        const other_param = navigation.getParam('otherParam', 'some default value');

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

        const { toyPrice, toyTitle, toyCategory, id, toyDescription, toyMaterial, toyLocation, toyImage1, toyImage2, toyImage3, toyImage4, image, name, fontsLoaded } = this.state;
        console.log(name)

        if (fontsLoaded) {

            return (

                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image source={require("../assets/newwhiteicons/back.png")} style={{ width: 15, height: 25, marginBottom: 11 }}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={{ color: "#fff", fontSize: 30, fontWeight: 'bold', fontFamily: "El_Messiri", paddingBottom: -5, textTransform: 'uppercase' }}>{toyCategory}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={require("../assets/newwhiteicons/notification.png")} style={{ width: 20, height: 25, marginBottom: 11 }}></Image>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.singlePage}>
                        <View style={styles.one}>
                            <View style={{ position: 'relative' }}>
                                <Image source={{ uri: image }} style={{ width: "100%", height: "110%", zIndex: -1 }}></Image>
                            </View>
                        </View>
                        <View style={styles.two}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "column" }}>
                                    <TouchableOpacity onPress={() =>
                                        this.props.navigation.navigate('ViewRating', {
                                            passId: toyTitle,
                                            otherParam: '101'
                                        })
                                    }>
                                        <Text style={styles.toyTitle}>{toyTitle}</Text>
                                    </TouchableOpacity>

                                    <View style={styles.ratingBarStyle}>{ratingBar}</View>
                                </View>

                                <View style={{ justifyContent: "center", alignItems: "center", marginHorizontal: 40, marginVertical: 10, width: 50, height: 50, backgroundColor: "#FE7A15", borderWidth: 1, borderColor: "#FE7A15", borderRadius: 30 }}>
                                    <TouchableOpacity onPress={this.handleFavorite}>
                                        <MaterialIcons name="favorite" size={30} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.imageContainer}>
                                <View style={styles.photos}>
                                    <TouchableOpacity onPress={() => this.Load_New_Image(toyImage1)} style={{ width: "24%", height: "80%", borderRadius: 10 }}><Image source={{ uri: toyImage1 }} style={{ width: "100%", height: "100%", borderRadius: 10 }}></Image></TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.Load_New_Image(toyImage2)} style={{ width: "24%", height: "80%", borderRadius: 10 }}><Image source={{ uri: toyImage2 }} style={{ width: "100%", height: "100%", borderRadius: 10 }}></Image></TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.Load_New_Image(toyImage3)} style={{ width: "24%", height: "80%", borderRadius: 10 }}><Image source={{ uri: toyImage3 }} style={{ width: "100%", height: "100%", borderRadius: 10 }}></Image></TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.Load_New_Image(toyImage4)} style={{ width: "24%", height: "80%", borderRadius: 10 }}><Image source={{ uri: toyImage4 }} style={{ width: "100%", height: "100%", borderRadius: 10 }}></Image></TouchableOpacity>
                                </View>
                            </View>

                            <Text style={{ marginHorizontal: 40, marginVertical: 5 }}>
                                <Text style={styles.toyPriceText}>Price: </Text>
                                <Text style={styles.toyPrice}>{toyPrice}</Text>
                            </Text>

                            <Text style={{ marginHorizontal: 40, marginVertical: 5 }}>
                                <Text style={styles.toyMaterialText}>Material: </Text>
                                <Text style={styles.toyMaterial}>{toyMaterial}</Text>
                            </Text>

                            <Text style={{ marginHorizontal: 40, marginVertical: 5 }}>
                                <Text style={styles.toyLocationText}>Location: </Text>
                                <Text style={styles.toyLocation}>{toyLocation}</Text>
                            </Text>

                            <Text style={{ marginHorizontal: 40, marginVertical: 5 }}>
                                <Text style={styles.toyDescriptionText}>Description: </Text>
                                <Text style={styles.toyDescription}>{toyDescription}</Text>
                            </Text>

                            <View style={styles.button}>
                                <TouchableOpacity onPress={() =>
                                    this.props.navigation.navigate("MessageProfile", {
                                        passId: id,
                                        otherParam: '101'
                                    })
                                }  >
                                    <Text style={{ color: "#FFF", fontFamily: 'Open_Sans_Regular', fontSize: 24 }}>Contact</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
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
        zIndex: 1,
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
        bottom: 80,
        backgroundColor: "#0191B4",
        borderRadius: 5,
        height: 42,
        width: '80%',
        alignItems: "center",
        justifyContent: "center"
    },
    singlePage: {
        position: 'relative',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 20
    },
    one: {
        flex: 1 / 2,
        marginTop: 22,
        backgroundColor: "#FE7A15"
    },
    two: {
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: "#fff"
    },
    imageContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 40,
        marginVertical: 15,
        marginTop: 10
    },
    photos: {
        justifyContent: "space-between",
        flexDirection: "row",
        height: 100
    },
    ratingBarStyle: {
        flexDirection: 'row',
        marginHorizontal: 40
    },
    StarImage: {
        width: 15,
        height: 15,
        marginHorizontal: 2,
        marginBottom: 20
    },
    toyTitle: {
        fontFamily: 'Open_Sans_Bold',
        marginHorizontal: 40,
        marginTop: 20,
        fontWeight: 'bold',
        fontSize: 28
    },
    toyPriceText: {
        fontFamily: 'Open_Sans_SemiBold',
        fontSize: 16
    },
    toyPrice: {
        fontFamily: 'Open_Sans_Regular',
        fontSize: 15
    },
    toyMaterialText: {
        fontFamily: 'Open_Sans_SemiBold',
        fontSize: 16
    },
    toyMaterial: {
        fontFamily: 'Open_Sans_Regular',
        fontSize: 15
    },
    toyLocationText: {
        fontFamily: 'Open_Sans_SemiBold',
        fontSize: 16
    },
    toyLocation: {
        fontFamily: 'Open_Sans_Regular',
        fontSize: 15
    },
    toyDescriptionText: {
        fontFamily: 'Open_Sans_SemiBold',
        fontSize: 16
    },
    toyDescription: {
        fontFamily: 'Open_Sans_Regular',
        fontSize: 15
    }
})