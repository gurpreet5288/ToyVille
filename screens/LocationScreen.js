import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TouchableHighlight, Image } from 'react-native'
import MapView from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import * as Permissions from "expo-permissions"
import Backend from './Backend'
import firebase from 'firebase'
import 'firebase/firestore'
import * as Location from 'expo-location';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

let customFonts = {
    'El_Messiri': require('../assets/fonts/ElMessiri-Bold.ttf'),
    'Open_Sans_Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
    'Open_Sans_SemiBold': require('../assets/fonts/OpenSans-SemiBold.ttf'),
    'Open_Sans_Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
};

export default class LocationScreen extends React.Component {

    dbCollection = null;

    constructor(props) {
        super(props);
        this.state = {
            latitude: null,
            longitude: null,
            item: [],
            users: [],
            fontsLoaded: false
        }
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    /************************* Retrieving data from firebase **************************************/
    async componentDidMount() {

        this._loadFontsAsync();

        const { status } = await Permissions.getAsync(Permissions.LOCATION)

        if (status !== 'granted') {
            const response = await Permissions.askAsync(Permissions.LOCATION)
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude });

        this.dbCollection = Backend.shared.firestore
            .collection("posts")
            .get().then
            (onSnapShot => {
                const firebaseData = [];
                onSnapShot.forEach((doc) => {
                    const { textTitle, coords, image1, image2, image3, textCategory, textLocation, textDescription, textPrice, uid, timestamp } = doc.data();
                    this.setState({
                        users: doc.data().coords
                    });
                    firebaseData.push({
                        key: doc.id,
                        textTitle,
                        image1,
                        image2,
                        image3,
                        coords,
                        uid,
                        textCategory,
                        textDescription,
                        textLocation,
                        textPrice,
                        timestamp
                    });
                });
                this.setState({
                    item: firebaseData
                });
            });
    }

    componentWillUnmount() {
        this.dbCollection = null;
    }

    renderMarkers = item => {
        const { navigate } = this.props.navigation;

        return (

            item.map(site =>
                <MapView.Marker
                    key={site.key}
                    title={site.textTitle}
                    description={site.textLocation}
                    coordinate={site.coords}>
                    <View>
                        <Image
                            source={{ uri: site.image1 }}
                            style={{ width: 50, height: 50, borderRadius: 10 }}
                        />
                    </View>
                    <MapView.Callout tooltip style={{ width: 100, height: 10 }}>
                        <TouchableHighlight>
                            <View style={{ flexDirection: "column", borderRadius: 10, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
                                <View style={{ width: 200 }}>
                                    <Text style={{ zIndex: 1, position: "absolute", color: "#fff", fontSize: 16, textAlign: "justify", padding: 5 }}>{site.textTitle}</Text>
                                    <Image
                                        source={{ uri: site.image1 }}
                                        style={{ width: 200, height: 150, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                                    />
                                </View>

                                <View style={{ flexDirection: "column", justifyContent: "space-between", backgroundColor: "#0191B4", padding: 5, width: 200, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={{ color: "#fff", textAlign: "justify", paddingRight: 2, paddingLeft: 2 }}>{site.textCategory}</Text>
                                        <Text style={{ color: "#fff", textAlign: "justify", paddingRight: 2, paddingLeft: 2 }}>{site.textPrice}</Text>
                                    </View>
                                    <Text style={{ color: "#fff", paddingRight: 2, paddingTop: 5, paddingLeft: 2, fontSize: 12, textAlign: "justify" }}>{site.textLocation}</Text>
                                </View>

                            </View>
                        </TouchableHighlight>
                    </MapView.Callout>
                </MapView.Marker>
            )

        )
    }

    renderDirections = item => {
        const { latitude, longitude } = this.state

        const origin = { latitude, longitude };
        const GOOGLE_MAPS_APIKEY = 'AIzaSyAfIwdeUpw-3kegw3vXOQijTjoZZrnbeSc';

        return (
            item.map(site => <MapViewDirections
                origin={origin}
                key={site.key}
                destination={site.coords}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={4}
                strokeColor="#0191B4"
            />
            )
        )
    }

    render() {

        const { item, latitude, longitude, fontsLoaded } = this.state

        if (fontsLoaded) {

            if (latitude) {
                return (
                    <SafeAreaView style={styles.container}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")}>
                                <Image source={require("../assets/newwhiteicons/back.png")} style={{ width: 15, height: 25, marginBottom: 11 }}></Image>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{ color: "#fff", fontSize: 30, fontWeight: 'bold', fontFamily: "El_Messiri", paddingBottom: -5 }}>LOCATION</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={require("../assets/newwhiteicons/notification.png")} style={{ width: 20, height: 25, marginBottom: 11 }}></Image>
                            </TouchableOpacity>
                        </View>

                        <MapView
                            showsMyLocationButton
                            showsUserLocation
                            style={styles.mapview}
                            initialRegion={{
                                latitude,
                                longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421
                            }}>

                            {this.renderMarkers(item)}

                            {this.renderDirections(item)}

                        </MapView>

                    </SafeAreaView>
                )
            } else {
                return <AppLoading />;
            }
        }

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>We need your permission!</Text>
            </View>
        )

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
        borderBottomRightRadius: 15,
        zIndex: 1
    },
    mapview: {
        flex: 1
    }
})

