import React from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import Backend from './Backend'
import 'firebase/firestore';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

let customFonts = {
    'El_Messiri': require('../assets/fonts/ElMessiri-Bold.ttf'),
    'Open_Sans_Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
    'Open_Sans_SemiBold': require('../assets/fonts/OpenSans-SemiBold.ttf'),
    'Open_Sans_Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
};

export default class SignUpScreen extends React.Component {

    static navigationOptions = {
        headerShown: false
    };

    state = {
        fontsLoaded: false,
        user: {
            name: "",
            email: "",
            password: "",
            errorMessage: null
        }
    };

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
    }

    handleSignUp = () => {
        Backend.shared.createUser(this.state.user);
        return this.props.navigation.navigate("Login");
    };

    render() {
        const { fontsLoaded } = this.state;

        if (fontsLoaded) {
            return (
                <View style={styles.container}>
                    <View>
                        <Text style={styles.headerWelcome}>
                            {`WELCOME TO\nTOYVILLE`}
                        </Text>

                        <Text style={styles.header}>
                            Create Your Account
                </Text>

                    </View>

                    <View style={styles.message}>
                        {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                    </View>

                    <View style={styles.main}>

                        <View>
                            <TextInput style={styles.box} autoCapitalize="none" onChangeText={name => this.setState({ user: { ...this.state.user, name } })} value={this.state.user.name} placeholder="Username"></TextInput>
                        </View>

                        <View style={{ marginTop: 32 }}>
                            <TextInput style={styles.box} autoCapitalize="none" onChangeText={email => this.setState({ user: { ...this.state.user, email } })} value={this.state.user.email} placeholder="Email"></TextInput>
                        </View>

                        <View style={{ marginTop: 32 }}>
                            <TextInput style={styles.box} secureTextEntry autoCapitalize="none" onChangeText={password => this.setState({ user: { ...this.state.user, password } })} value={this.state.user.password} placeholder="Password"></TextInput>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
                        <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "500" }}>Sign up</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }} onPress={() => this.props.navigation.navigate("Login")}>
                        <Text style={{ color: "#000", fontSize: 14, fontWeight: "500" }}>
                            Already have an account? <Text style={{ fontSize: 16, fontWeight: "500", color: "#FE7A15" }}>Login</Text>
                        </Text>
                    </TouchableOpacity>

                </View>

            )
        } else {
            return <AppLoading />;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },

    headerWelcome: {
        fontFamily: 'Open_Sans_SemiBold',
        fontSize: 30,
        fontWeight: "600",
        textAlign: "center",
        color: "#FE7A15"
    },

    header: {
        fontFamily: 'Open_Sans_SemiBold',
        marginVertical: 5,
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        color: "#0191B4"
    },

    message: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30
    },

    error: {
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },

    main: {
        marginBottom: 48,
        marginHorizontal: 30
    },

    box: {
        borderBottomColor: "#FE7A15",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 16,
        color: "#161F3D",
        borderBottomWidth: 1
    },

    button: {
        marginHorizontal: 30,
        backgroundColor: "#0191B4",
        borderRadius: 4,
        height: 52,
        alignItems: "center",
        justifyContent: "center"
    }
})