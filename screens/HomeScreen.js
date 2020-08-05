import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, TextInput, FlatList, Image, Button, RefreshControl } from 'react-native'
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

export default class HomeScreen extends React.Component {

    dbCollection = null;

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            image: 'https://unsplash.com/photos/KuCGlBXjH_o',
            toyTitle: '',
            item: [],
            dropdownSearch: false,
            menu: false,
            isFetching: false,
            fontsLoaded: false
        }

        this.menu = this.menu.bind(this);

        this.dropdownSearch = this.dropdownSearch.bind(this);
        this.exitDropdownMenu = this.exitDropdownMenu.bind(this);
    }

    onRefresh() {
        this.setState({ isFetching: true, }, () => { this.componentDidMount(); });
    }

    dropdownSearch(event) {
        event.preventDefault();

        this.setState({ dropdownSearch: true });
    }

    exitDropdownMenu() {
        this.setState({ dropdownSearch: false });

        this.setState({ menu: false });
    }

    menu(event) {
        event.preventDefault();

        this.setState({ menu: true });
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
            .collection("users").where("uid", "==", uid)
            .get().then
            (onSnapShot => {
                onSnapShot.forEach((doc) => {
                    const { name, image } = doc.data();
                    this.setState({
                        name: doc.data().name,
                        image: doc.data().image
                    });
                });
            });

        this.dbCollection = Backend.shared.firestore
            .collection("posts")
            .get().then
            (onSnapShot => {
                const firebaseData = [];
                onSnapShot.forEach((doc) => {
                    const { textTitle, image1, image2, image3, textCategory, textPrice, timestamp } = doc.data();
                    firebaseData.push({
                        key: doc.id,
                        textTitle,
                        image1,
                        image2,
                        image3,
                        textCategory,
                        textPrice,
                        timestamp
                    });
                });
                this.setState({
                    item: firebaseData,
                    afterSearchItem: firebaseData,
                    isFetching: false
                });
            });
    }

    componentWillUnmount() {
        this.dbCollection = null;
    }

    renderItem = item => {
        const { navigate } = this.props.navigation;
        const categoryStyle = item.textCategory == "Exchange" ? styles.exchange : (item.textCategory == "Donate" ? styles.donate : styles.sale)
        const { fontsLoaded } = this.state;

        if (fontsLoaded) {
            return (

                <TouchableOpacity onPress={() =>
                    this.props.navigation.navigate('ClickedToy', {
                        toyTitle: item.textTitle,
                        otherParam: '101'
                    })
                }  >
                    <View style={styles.uploadedItem}>

                        <View>
                            <Text style={styles.textTitle}>{item.textTitle}</Text>
                            <Image source={{ uri: item.image1 }} style={styles.postImage} resizeMode="cover" />
                        </View>



                        <View style={categoryStyle}>
                            <View>
                                <Text style={styles.textCategory}>{item.textCategory}</Text>
                            </View>

                            <View>
                                <Text style={styles.textPrice}>{item.textPrice}</Text>
                            </View>
                        </View>

                    </View>
                </TouchableOpacity>
            )
        } else {
            return <AppLoading />;
        }
    }

    /************************* Search Toys Function **************************************/
    searchToys = (value) => {
        const searchedToys = this.state.afterSearchItem.filter(mytoy => {
            let mytoyLowercase = (mytoy.textTitle);

            let searchMyToyLowercase = value;

            if (searchMyToyLowercase != undefined) {
                return mytoyLowercase.indexOf(searchMyToyLowercase) > -1;
            }
        }
        );
        this.setState({ item: searchedToys });
    };

    /************************* Dropdown Buttons ( Sell, Donate and Exchange ) Click Function **************************************/
    onPress = (title) => {

        const searchedToys = this.state.afterSearchItem.filter(mytoy => {
            let mytoyLowercase = (mytoy.textCategory);

            let searchMyToyLowercase = title;

            if (searchMyToyLowercase != undefined) {
                return mytoyLowercase.indexOf(searchMyToyLowercase) > -1;
            }
        }
        );
        this.setState({ item: searchedToys });
    }


    render() {

        const numColumns = 2;

        const { item, fontsLoaded, name, image } = this.state;

        if (fontsLoaded) {
            return (
                <TouchableWithoutFeedback onPress={this.exitDropdownMenu} >
                    <SafeAreaView style={styles.container}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={this.menu}>
                                <Image source={require("../assets/newwhiteicons/hamburger.png")} style={{ width: 27, height: 20, marginBottom: 11 }}></Image>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{ color: "#fff", fontSize: 30, fontWeight: 'bold', fontFamily: "El_Messiri", paddingBottom: -5 }}>TOY VILLE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={require("../assets/newwhiteicons/notification.png")} style={{ width: 20, height: 25, marginBottom: 11 }}></Image>
                            </TouchableOpacity>
                        </View>

                        {
                            this.state.menu
                                ? (
                                    <View style={{ zIndex: 10, position: "absolute", alignItems: 'flex-start', alignSelf: "flex-start", top: 0, right: 90, bottom: 0, left: 0, padding: 10, borderStyle: "solid", borderColor: "#fff", borderWidth: 1, marginTop: 0, backgroundColor: "#fff" }}>

                                        <View style={{ marginHorizontal: 5, marginVertical: 15, top: 50, alignItems: "center", flexDirection: 'row', padding: 0 }} >
                                            <View style={{ backgroundColor: "grey", width: 60, height: 60, borderRadius: 60 / 2 }}>
                                                <Image source={{ uri: image }} style={{ width: 60, height: 60, borderRadius: 60 / 2 }}></Image>
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 18, fontFamily: 'El_Messiri', color: "#FE7A15", fontWeight: "500", paddingLeft: 10 }}>Hello,</Text>
                                                <Text style={{ fontSize: 18, fontFamily: 'El_Messiri', color: "#FE7A15", fontWeight: "500", paddingLeft: 10 }}>{name}</Text>
                                            </View>
                                        </View>
                                        <View style={{ top: 80 }}>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")}>
                                                <View style={{ marginHorizontal: 10, marginVertical: 10, alignItems: "center", flexDirection: 'row', padding: 0 }} >
                                                    <Image source={require("../assets/icons/home.png")} style={{ width: 30, height: 30 }}></Image>
                                                    <Text style={{ fontFamily: 'Open_Sans_SemiBold', fontSize: 18, color: "#FE7A15", fontWeight: "500", paddingLeft: 10 }}>Home</Text>
                                                </View></TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Help")}>
                                                <View style={{ marginHorizontal: 10, marginVertical: 10, alignItems: "center", flexDirection: 'row', padding: 0 }} >
                                                    <Image source={require("../assets/icons/help.png")} style={{ width: 30, height: 30 }}></Image>
                                                    <Text style={{ fontFamily: 'Open_Sans_SemiBold', fontSize: 18, color: "#FE7A15", fontWeight: "500", paddingLeft: 10 }}>Help</Text>
                                                </View></TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Contact")}>
                                                <View style={{ marginHorizontal: 10, marginVertical: 10, alignItems: "center", flexDirection: 'row', padding: 0 }} >
                                                    <Image source={require("../assets/icons/contact.png")} style={{ width: 30, height: 30 }}></Image>
                                                    <Text style={{ fontFamily: 'Open_Sans_SemiBold', fontSize: 18, color: "#FE7A15", fontWeight: "500", paddingLeft: 10 }}>Contact Us</Text>
                                                </View></TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Profile")}>
                                                <View style={{ marginHorizontal: 10, marginVertical: 10, alignItems: "center", flexDirection: 'row', padding: 0 }} >
                                                    <Image source={require("../assets/icons/profile.png")} style={{ width: 30, height: 30 }}></Image>
                                                    <Text style={{ fontFamily: 'Open_Sans_SemiBold', fontSize: 18, color: "#FE7A15", fontWeight: "500", paddingLeft: 10 }}>Profile</Text>
                                                </View></TouchableOpacity>
                                        </View>

                                        <View style={{ marginHorizontal: 10, marginVertical: 15, bottom: -450, alignItems: "center", flexDirection: 'row' }} >
                                            <Image source={require("../assets/icons/logout.png")} style={{ width: 30, height: 30 }}></Image>
                                            <TouchableOpacity onPress={() => { Backend.shared.signOut() }}>
                                                <Text style={{ fontFamily: 'Open_Sans_SemiBold', fontSize: 18, color: "#FE7A15", fontWeight: "500", paddingLeft: 10 }}>Logout</Text></TouchableOpacity>
                                        </View>

                                    </View>
                                ) : (
                                    null
                                )
                        }

                        <View style={{ display: "flex", flexDirection: "column", marginTop: 80, marginHorizontal: 30 }}>
                            <View><Text style={{ color: "#D3DD18", fontWeight: "500", fontSize: 16, fontFamily: 'Open_Sans_Bold' }}>Search best toy for your child</Text></View>
                            <View style={{ flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-between" }}>
                                <TextInput onChangeText={(value) => this.searchToys(value)} numberOfLines={4} style={{ borderWidth: 1, borderStyle: "solid", width: '90%', borderRadius: 10, height: 40, borderColor: '#FE7A15', paddingHorizontal: 15, marginVertical: 15, fontFamily: 'Open_Sans_Regular' }} placeholder="Search here"></TextInput>

                                <TouchableOpacity style={{ marginVertical: 15 }} onPress={this.dropdownSearch}>
                                    <Image source={require("../assets/icons/homemenu.png")} style={{ width: 30, height: 40, borderRadius: 5 }}></Image>
                                </TouchableOpacity>

                            </View>

                            {
                                this.state.dropdownSearch
                                    ? (
                                        <View style={{ position: "absolute", alignItems: "center", alignSelf: "flex-end", width: 150, height: 150, padding: 10, borderStyle: "solid", borderColor: "#000000", borderRadius: 5, borderWidth: 1, marginTop: 80, backgroundColor: "#ffffff" }}>

                                            <View style={{ borderStyle: "solid", borderBottomWidth: 1, borderBottomColor: "#0191B4", padding: 0 }} >
                                                <Button title="Sale" color="#000000" onPress={() => this.onPress("Sale")} />
                                            </View>
                                            <View style={{ borderStyle: "solid", borderBottomWidth: 1, borderBottomColor: "#0191B4", padding: 0 }} >
                                                <Button title="Donate" color="#000000" onPress={() => this.onPress("Donate")} />
                                            </View>
                                            <View style={{ borderStyle: "solid", borderBottomWidth: 1, borderBottomColor: "#0191B4", padding: 0 }} >
                                                <Button title="Exchange" color="#000000" onPress={() => this.onPress("Exchange")} />
                                            </View>

                                        </View>
                                    ) : (
                                        null
                                    )
                            }

                        </View>

                        <FlatList style={styles.main} data={this.state.item} renderItem={({ item }) => this.renderItem(item)} showsVerticalScrollIndicator={false} numColumns={numColumns}
                            refreshControl={
                                <RefreshControl
                                    onRefresh={() => this.onRefresh()}
                                    refreshing={this.state.isFetching}
                                />
                            } />

                    </SafeAreaView>
                </TouchableWithoutFeedback>
            )
        } else {
            return <AppLoading />
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
    button: {
        marginTop: 10,
        width: '30%',
        backgroundColor: "#0191B4",
        borderRadius: 4,
        height: 35,
        justifyContent: "center"
    },
    uploadedItem: {
        width: 162,
        marginVertical: 10,
        marginHorizontal: 10,
        display: "flex",
        justifyContent: "center"
    },
    main: {
        zIndex: -1,
        marginTop: 10,
        marginHorizontal: 24
    },
    textTitle: {
        position: 'absolute',
        padding: 8,
        fontFamily: 'Open_Sans_SemiBold',
        fontSize: 14,
        color: "#fff",
        zIndex: 1
    },
    sale: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#D3DD18",
        color: "#fff",
        borderStyle: "solid",
        borderColor: "#D3DD18",
        padding: 8,
        borderWidth: 1,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    exchange: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#FE7A15",
        color: "#fff",
        borderStyle: "solid",
        borderColor: "#FE7A15",
        padding: 8,
        borderWidth: 1,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    donate: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#0191B4",
        color: "#fff",
        borderStyle: "solid",
        borderColor: "#0191B4",
        padding: 8,
        borderWidth: 1,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    textCategory: {
        fontFamily: 'Open_Sans_SemiBold',
        fontSize: 14,
        color: "#fff"
    },
    textPrice: {
        fontFamily: 'Open_Sans_SemiBold',
        fontSize: 14,
        color: "#fff"
    },
    postImage: {
        width: 162,
        height: 200,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        zIndex: -1
    }
})