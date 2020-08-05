import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput, Button } from 'react-native'
import Constants from "expo-constants"
import * as Permissions from "expo-permissions"
import Backend from './Backend'
import * as ImagePicker from 'expo-image-picker'
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

export default class EditProfileScreen extends React.Component {

    state = {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        location: "",
        status: "",
        description: "",
        image: 'https://unsplash.com/photos/KuCGlBXjH_o',
        fontsLoaded: false
    };

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {

        this._loadFontsAsync();

        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    updateProfile = () => {
        Backend.shared.addProfile({ firstName: this.state.firstName.trim(), lastName: this.state.lastName.trim(), phoneNumber: this.state.phoneNumber.trim(), location: this.state.location.trim(), status: this.state.status.trim(), description: this.state.description.trim(), localUri: this.state.image }).then(ref => {
            this.setState({ firstName: "", lastName: "", phoneNumber: "", location: "", status: "", description: "", image: 'https://unsplash.com/photos/KuCGlBXjH_o' });
            this.props.navigation.goBack();
        }).catch(error => {
            alert(error);
        })
    }

    updateCancel = () => {
        this.setState({
            firstName: "", lastName: "", phoneNumber: "", location: "", status: "", description: "", image: 'https://unsplash.com/photos/KuCGlBXjH_o'
        });
    }

    _pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };

    render() {
        const { navigate } = this.props;
        const { fontsLoaded } = this.state;

        if (fontsLoaded) {


            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
                            <Image source={require("../assets/newwhiteicons/back.png")} style={{ width: 15, height: 25, marginBottom: 11 }}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={{ color: "#fff", fontSize: 30, fontWeight: 'bold', fontFamily: "El_Messiri", paddingBottom: -5 }}>EDIT PROFILE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={require("../assets/newwhiteicons/notification.png")} style={{ width: 20, height: 25, marginBottom: 11 }}></Image>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }}>

                        <View style={styles.imageContainer}>
                            <View style={{ backgroundColor: "grey", width: 150, height: 150, alignSelf: "center", borderRadius: 150 / 2 }}>
                                <Image source={{ uri: this.state.image }} style={{ width: 150, height: 150, alignSelf: "center", borderRadius: 150 / 2 }}></Image>
                            </View>
                            <Text style={styles.profileName} onPress={this._pickImage}>Change Profile Picture</Text>
                        </View>

                        <View style={{ marginTop: 10, marginBottom: 60, marginHorizontal: 30 }}>

                            <View>
                                <TextInput style={styles.input} autoCapitalize="none" onChangeText={firstName => this.setState({ firstName })} value={this.state.firstName} placeholder="First Name"></TextInput>
                            </View>

                            <View style={{ marginTop: 15 }}>
                                <TextInput style={styles.input} autoCapitalize="none" onChangeText={lastName => this.setState({ lastName })} value={this.state.lastName} placeholder="Last Name"></TextInput>
                            </View>

                            <View style={{ marginTop: 15 }}>
                                <TextInput style={styles.input} secureTextEntry autoCapitalize="none" onChangeText={phoneNumber => this.setState({ phoneNumber })} value={this.state.phoneNumber} placeholder="Phone Number"></TextInput>
                            </View>

                            <View style={{ marginTop: 15 }}>
                                <TextInput style={styles.input} autoCapitalize="none" onChangeText={location => this.setState({ location })} value={this.state.location} placeholder="Location"></TextInput>
                            </View>

                            <View style={{ marginTop: 15 }}>
                                <TextInput style={styles.input} autoCapitalize="none" onChangeText={status => this.setState({ status })} value={this.state.status} placeholder="Status"></TextInput>
                            </View>

                            <View style={{ marginTop: 15 }}>
                                <TextInput style={styles.input} autoCapitalize="none" onChangeText={description => this.setState({ description })} value={this.state.description} placeholder="Description"></TextInput>
                            </View>

                        </View>

                        <View style={styles.button1}>
                            <TouchableOpacity onPress={this.updateProfile}>
                                <Text style={{ color: "#FFF", fontFamily: 'Open_Sans_Regular', fontSize: 24 }}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.button2}>
                            <TouchableOpacity onPress={this.updateCancel}>
                                <Text style={{ color: "#FFF", fontFamily: 'Open_Sans_Regular', fontSize: 24 }}>Cancel</Text>
                            </TouchableOpacity>
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
    input: {
        fontFamily: 'Open_Sans_Regular',
        borderBottomColor: "#0191B4",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 16,
        color: "#161F3D"
    },
    imageContainer: {
        marginTop: 70
    },
    button1: {
        position: 'absolute',
        marginHorizontal: 40,
        bottom: 160,
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
        bottom: 100,
        backgroundColor: "#0191B4",
        borderRadius: 5,
        height: 42,
        width: '80%',
        alignItems: "center",
        justifyContent: "center"
    },
    profileName: {
        fontFamily: 'Open_Sans_Bold',
        marginVertical: 4,
        alignSelf: 'center',
        fontSize: 16,
        color: "#D3DD18"
    },
    profileEmailText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    profileEmail: {
        fontSize: 16
    },
    profileLocationText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    profileLocation: {
        fontSize: 16
    },
    profileDescriptionText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    profileDescription: {
        fontSize: 16
    }
})