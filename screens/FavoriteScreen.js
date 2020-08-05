import React from 'react'
import { View, Text, Alert, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image, RefreshControl } from 'react-native'
import Backend from './Backend'
import firebase from 'firebase'
import 'firebase/firestore';
import { Swipeable } from 'react-native-gesture-handler'
import { AntDesign } from '@expo/vector-icons'
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

let customFonts = {
    'El_Messiri': require('../assets/fonts/ElMessiri-Bold.ttf'),
    'Open_Sans_Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
    'Open_Sans_SemiBold': require('../assets/fonts/OpenSans-SemiBold.ttf'),
    'Open_Sans_Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
};

export default class HomeScreen extends React.Component {

    dbCollection = null;

    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            toyTitle: '',
            totalRating: 5,
            item: [],
            uid: '',
            isFetching: false
        }
    }

    onRefresh() {
        this.setState({ isFetching: true, }, () => { this.componentDidMount(); });
    }

    handleFavorite = (key) => {

        Alert.alert(
            'Are You Sure?',
            '',
            [
                {
                    text: 'YES', onPress: () => this.dbCollection = Backend.shared.firestore.collection("favorites").doc(key).delete().then(function () {
                        console.log("Document successfully deleted!");
                    }).catch(function (error) {
                        console.error("Error removing document: ", error);
                    })
                },
                { text: 'NO', onPress: () => console.log('NO Pressed'), style: 'cancel' },
            ]
        );

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

        this.dbCollection = Backend.shared.firestore
            .collection("favorites").where("uid", "==", uid)
            .get().then
            (onSnapShot => {
                const firebaseData = [];
                onSnapShot.forEach((doc) => {
                    const { favoriteTitle, favoritePrice, favoriteMaterial, favoriteCategory, favoriteDescription, favoriteImage1, favoriteImage2, favoriteImage3, favoriteImage4, userRating, timestamp } = doc.data();
                    firebaseData.push({
                        key: doc.id,
                        favoriteTitle,
                        favoritePrice,
                        favoriteMaterial,
                        favoriteCategory,
                        favoriteDescription,
                        favoriteImage1,
                        favoriteImage2,
                        favoriteImage3,
                        favoriteImage4,
                        userRating,
                        timestamp
                    });
                });
                this.setState({
                    item: firebaseData,
                    isFetching: false
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

            <View style={{ borderRadius: 10, borderColor: "#FE7A15", borderWidth: 0.5, height: 120, marginHorizontal: 30, marginVertical: 10, zIndex: 1 }}>
                <Swipeable renderRightActions={(_, dragX) => this.rightActions(dragX, item)}>
                    <TouchableOpacity onPress={() =>
                        this.props.navigation.navigate('ClickedToy', {
                            toyTitle: item.favoriteTitle,
                            otherParam: '101'
                        })
                    }>
                        <View style={{ display: 'flex', flexDirection: 'row', }}>
                            <View style={styles.one} >
                                <Image source={{ uri: item.favoriteImage1 }} style={styles.favoriteImage1} />
                            </View>
                            <View style={styles.two}>

                                <Text style={{ marginHorizontal: 5, marginVertical: 1 }}>
                                    <Text style={styles.favoriteTitleText}>Toy Name:</Text>
                                    <Text style={styles.favoriteTitle}>{item.favoriteTitle}</Text>
                                </Text>

                                <Text style={{ marginHorizontal: 5, marginVertical: 1 }}>
                                    <Text style={styles.favoriteDescriptionText}>Description:</Text>
                                    <Text style={styles.favoriteDescription}>{item.favoriteDescription}</Text>
                                </Text>

                                <View style={styles.ratingBarStyle}>{ratingBar}</View>

                                <Text style={styles.favoritePrice}>{item.favoritePrice}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Swipeable>
            </View>
        )
    };

    rightActions = (dragX, item) => {
        return (
            <TouchableOpacity onPress={() => this.handleFavorite(item.key)}>
                <View style={styles.swipe}>
                    <View>
                        <AntDesign name="delete" size={36} color="#fff" />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {

        const { item, fontsLoaded } = this.state;
        console.log(item);

        if (fontsLoaded) {

            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")}>
                            <Image source={require("../assets/newwhiteicons/back.png")} style={{ width: 15, height: 25, marginBottom: 11 }}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={{ color: "#fff", fontSize: 30, fontWeight: 'bold', fontFamily: "El_Messiri", paddingBottom: -5 }}>FAVORITES</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={require("../assets/newwhiteicons/notification.png")} style={{ width: 20, height: 25, marginBottom: 11 }}></Image>
                        </TouchableOpacity>
                    </View>


                    <View style={{ display: "flex", flexDirection: "column", marginTop: 60, marginHorizontal: 30 }}>
                        <View>
                            <Text style={{ color: "#D3DD18", fontWeight: "500", fontSize: 16, fontFamily: 'Open_Sans_Bold' }}>Your Favorites</Text>
                        </View>
                    </View>

                    <FlatList style={styles.main} data={this.state.item} renderItem={({ item }) => this.renderItem(item)} showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                onRefresh={() => this.onRefresh()}
                                refreshing={this.state.isFetching}
                            />
                        } />

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
    swipe: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderWidth: 0.5,
        borderColor: '#FE7A15',
        backgroundColor: '#FE7A15'
    },
    ratingBarStyle: {
        flexDirection: 'row',
        marginHorizontal: 5,
        marginVertical: 1
    },
    StarImage: {
        width: 15,
        height: 15,
    },
    main: {
        marginTop: 20
    },
    one: {
        flex: 1 / 3,
        justifyContent: 'center'
    },
    two: {
        flex: 1,
        justifyContent: 'center'
    },
    favoritePrice: {
        fontFamily: 'Open_Sans_SemiBold',
        color: "#0191B4",
        marginHorizontal: 5,
        marginVertical: 1
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
        fontFamily: 'Open_Sans_Regular',
        marginVertical: 2
    },
    favoriteDescriptionText: {
        fontFamily: 'Open_Sans_SemiBold',
        marginVertical: 2
    },
    favoriteDescription: {
        fontFamily: 'Open_Sans_Regular',
        marginVertical: 2
    },
    timestamp: {
        fontSize: 15,
        color: "#fff"
    }
})