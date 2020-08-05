import React from 'react'
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import Constants from "expo-constants"
import * as Permissions from "expo-permissions"
import Backend from './Backend'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location';
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

export default class PostScreen extends React.Component {

    state = {
        coords: {
            latitude: null,
            longitude: null,
        },
        textTitle: "",
        textPrice: "",
        textMaterial: "",
        textLocation: "",
        textCategory: "",
        textDescription: "",
        image1: 'https://unsplash.com/photos/KuCGlBXjH_o',
        image2: 'https://unsplash.com/photos/KuCGlBXjH_o',
        image3: 'https://unsplash.com/photos/KuCGlBXjH_o',
        image4: 'https://unsplash.com/photos/KuCGlBXjH_o',
        fontsLoaded: false
    };

    category(item) {
        this.setState({
            textCategory: item.value
        });
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    async componentDidMount() {

        this._loadFontsAsync();

        this.getPermissionAsync();

        const { status } = await Permissions.getAsync(Permissions.LOCATION)

        if (status !== 'granted') {
            const response = await Permissions.askAsync(Permissions.LOCATION)
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ coords: { latitude: location.coords.latitude, longitude: location.coords.longitude } });

        let result = await Location.reverseGeocodeAsync(
            this.state.coords
        );

        this.setState({ textLocation: result[0].name + ', ' + result[0].city + ', ' + result[0].region + ', ' + result[0].postalCode + ', ' + result[0].country });

        console.log(result)

        console.log(this.state);
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    handlePost = () => {
        Backend.shared.addPost({ coords: { latitude: this.state.coords.latitude, longitude: this.state.coords.longitude }, textTitle: this.state.textTitle.trim(), textPrice: this.state.textPrice.trim(), textMaterial: this.state.textMaterial.trim(), textLocation: this.state.textLocation, textCategory: this.state.textCategory, textDescription: this.state.textDescription.trim(), localUri1: this.state.image1, localUri2: this.state.image2, localUri3: this.state.image3, localUri4: this.state.image4 }).then(ref => {
            this.setState({ coords: { latitude: null, longitude: null }, textTitle: "", textPrice: "", textLocation: "", textMaterial: "", textCategory: "", textDescription: "", image1: 'https://unsplash.com/photos/KuCGlBXjH_o', image2: 'https://unsplash.com/photos/KuCGlBXjH_o', image3: 'https://unsplash.com/photos/KuCGlBXjH_o', image4: 'https://unsplash.com/photos/KuCGlBXjH_o' });
            this.props.navigation.goBack();
        }).catch(error => {
            alert(error);
        })
    }

    _pickImage = async () => {

        let result1 = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });

        let result2 = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });

        let result3 = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });

        let result4 = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });

        if (!result1.cancelled) {
            this.setState({ image1: result1.uri });
        }

        if (!result2.cancelled) {
            this.setState({ image2: result2.uri });
        }

        if (!result3.cancelled) {
            this.setState({ image3: result3.uri });
        }

        if (!result4.cancelled) {
            this.setState({ image4: result4.uri });
        }
    };

    render() {

        const { fontsLoaded } = this.state;

        if (fontsLoaded) {

            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")}>
                            <Image source={require("../assets/newwhiteicons/back.png")} style={{ width: 15, height: 25, marginBottom: 11 }}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={{ color: "#fff", fontSize: 30, fontWeight: 'bold', fontFamily: "El_Messiri", paddingBottom: -5 }}>FOR SALE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={require("../assets/newwhiteicons/notification.png")} style={{ width: 20, height: 25, marginBottom: 11 }}></Image>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.textContainer}>
                        <TextInput onChangeText={textTitle => this.setState({ textTitle })} value={this.state.textTitle} numberOfLines={4} style={{ borderWidth: 1, borderStyle: "solid", borderRadius: 4, height: 40, borderColor: '#FE7A15', paddingHorizontal: 15, marginHorizontal: 20, marginVertical: 15, fontFamily: 'Open_Sans_Regular', fontSize: 16 }} placeholder="Title"></TextInput>
                        <TextInput onChangeText={textPrice => this.setState({ textPrice })} value={this.state.textPrice} numberOfLines={4} style={{ borderWidth: 1, borderStyle: "solid", borderRadius: 4, height: 40, borderColor: '#FE7A15', paddingHorizontal: 15, marginHorizontal: 20, marginVertical: 15, fontFamily: 'Open_Sans_Regular', fontSize: 16 }} placeholder="Price"></TextInput>
                        <DropDownPicker
                            items={[
                                { label: 'Sale', value: 'Sale' },
                                { label: 'Exchange', value: 'Exchange' },
                                { label: 'Donate', value: 'Donate' }
                            ]}
                            defaultNull
                            placeholder="Category"
                            style={{ backgroundColor: "#fff" }}
                            placeholderStyle={{ color: "grey", fontFamily: 'Open_Sans_Regular', fontSize: 16 }}
                            containerStyle={{ height: 40, borderWidth: 1, fontFamily: 'Open_Sans_Regular', fontSize: 16, borderStyle: "solid", borderRadius: 4, borderColor: '#FE7A15', marginHorizontal: 20, marginVertical: 15 }}
                            onChangeItem={item => this.category(item)}
                            value={this.state.textCategory}
                        />
                        <TextInput onChangeText={textMaterial => this.setState({ textMaterial })} value={this.state.textMaterial} numberOfLines={4} style={{ borderWidth: 1, borderStyle: "solid", borderRadius: 4, height: 40, borderColor: '#FE7A15', paddingHorizontal: 15, marginHorizontal: 20, marginVertical: 15, fontFamily: 'Open_Sans_Regular', fontSize: 16 }} placeholder="Material"></TextInput>
                        <TextInput onChangeText={textLocation => this.setState({ textLocation })} value={this.state.textLocation} numberOfLines={4} style={{ borderWidth: 1, borderStyle: "solid", borderRadius: 4, height: 40, borderColor: '#FE7A15', paddingHorizontal: 15, marginHorizontal: 20, marginVertical: 15, fontFamily: 'Open_Sans_Regular', fontSize: 16 }} placeholder="Location"></TextInput>
                        <TextInput onChangeText={textDescription => this.setState({ textDescription })} value={this.state.textDescription} multiline={true} numberOfLines={10} style={{ borderWidth: 1, borderStyle: "solid", borderRadius: 4, height: 120, borderColor: '#FE7A15', paddingHorizontal: 15, marginHorizontal: 20, marginVertical: 15, fontFamily: 'Open_Sans_Regular', fontSize: 16 }} placeholder="Description"></TextInput>
                    </View>

                    <View style={styles.imageContainer}>

                        <View style={styles.uploadedPhotos}>
                            <Image source={{ uri: this.state.image1 }} style={{ width: "27%", height: "80%", borderRadius: 10 }}></Image>
                            <Image source={{ uri: this.state.image2 }} style={{ width: "27%", height: "80%", borderRadius: 10 }}></Image>
                            <Image source={{ uri: this.state.image3 }} style={{ width: "27%", height: "80%", borderRadius: 10 }}></Image>
                        </View>

                        <TouchableOpacity onPress={this._pickImage}>
                            <View style={styles.addIcon}>
                                <Image source={require("../assets/icons/Add.png")} style={{ width: 30, height: 30 }}></Image>
                            </View>
                        </TouchableOpacity>

                    </View>

                    <TouchableOpacity style={styles.button} onPress={this.handlePost}>
                        <Text style={{ color: "#FFF", fontFamily: 'Open_Sans_Regular', fontSize: 24 }}>Upload</Text>
                    </TouchableOpacity>

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
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 32,
        marginVertical: 15,
        marginTop: 5
    },
    textContainer: {
        justifyContent: "space-between",
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
        bottom: 10,
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