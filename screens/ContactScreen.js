import React from 'react'
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Image } from 'react-native'
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

export default class ContactScreen extends React.Component {

    state = {
        firstName: "",
        lastName: "",
        emailAddress: "",
        message: "",
        fontsLoaded: false
    };

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }
    componentDidMount() {
        this._loadFontsAsync();
    }

    handleContact = () => {

        Alert.alert(
            'Your message has been successfully delivered',
            '',
        );

        this.setState({
            firstName: "", lastName: "", emailAddress: "", message: ""
        });
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
                        <Text style={{ color: "#fff", fontSize: 30, fontWeight: 'bold', fontFamily: "El_Messiri", paddingBottom: -5 }}>CONTACT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={require("../assets/newwhiteicons/notification.png")} style={{ width: 20, height: 25, marginBottom: 11 }}></Image>
                    </TouchableOpacity>
                </View>



                <View style={styles.textContainer}>
                    <View style={{ display: "flex", flexDirection: "column", marginTop: 10, marginHorizontal: 20 }}>
                        <View>
                            <Text style={{ color: "#D3DD18", fontWeight: "500", fontSize: 16, fontFamily: 'Open_Sans_Bold' }}>Ask About Toy Ville</Text>
                        </View>
                    </View>
                    <TextInput onChangeText={firstName => this.setState({ firstName })} value={this.state.firstName} numberOfLines={4} style={{ borderWidth: 1, borderStyle: "solid", borderRadius: 4, height: 40, borderColor: '#FE7A15', marginTop: 30, paddingHorizontal: 15, marginHorizontal: 20, marginVertical: 15, fontFamily: 'Open_Sans_Regular',
        fontSize: 16 }} placeholder="First Name"></TextInput>
                    <TextInput onChangeText={lastName => this.setState({ lastName })} value={this.state.lastName} numberOfLines={4} style={{ borderWidth: 1, borderStyle: "solid", borderRadius: 4, height: 40, borderColor: '#FE7A15', paddingHorizontal: 15, marginHorizontal: 20, marginVertical: 15, fontFamily: 'Open_Sans_Regular',
        fontSize: 16 }} placeholder="Last Name"></TextInput>
                    <TextInput onChangeText={emailAddress => this.setState({ emailAddress })} value={this.state.emailAddress} numberOfLines={4} style={{ borderWidth: 1, borderStyle: "solid", borderRadius: 4, height: 40, borderColor: '#FE7A15', paddingHorizontal: 15, marginHorizontal: 20, marginVertical: 15, fontFamily: 'Open_Sans_Regular',
        fontSize: 16 }} placeholder="Email Address"></TextInput>
                    <TextInput onChangeText={message => this.setState({ message })} value={this.state.message} multiline={true} numberOfLines={10} style={{ borderWidth: 1, borderStyle: "solid", borderRadius: 4, height: 120, borderColor: '#FE7A15', paddingHorizontal: 15, marginHorizontal: 20, marginVertical: 15, fontFamily: 'Open_Sans_Regular',
        fontSize: 16 }} placeholder="Message"></TextInput>
                </View>

                <TouchableOpacity style={styles.button} onPress={this.handleContact}>
                    <Text style={{ color: "#FFF", fontFamily: 'Open_Sans_Regular', fontSize: 24 }}>Send</Text>
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
        marginTop: 80,
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