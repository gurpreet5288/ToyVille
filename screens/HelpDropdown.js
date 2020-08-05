import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

export default class HelpDropdown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            answer: props.answer,
            toggle: false,
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    render() {

        return (
            <View style={styles.mainContainer}>
                <TouchableOpacity ref={this.helpDropdown} style={styles.container} onPress={() => this.toggleExpand()}>
                    <Text style={styles.question}>{this.props.question}</Text>

                    <FontAwesome name={this.state.toggle ? 'caret-up' : 'caret-down'} size={30} color="#0191B4" />

                </TouchableOpacity>
                <View />
                {
                    this.state.toggle &&
                    <View style={styles.answer}>
                        <Text style={styles.answerText}>{this.props.answer}</Text>
                    </View>
                }

            </View>
        )
    }

    toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ toggle: !this.state.toggle })
    }
}

const styles = StyleSheet.create({
    question: {
        fontFamily: 'Open_Sans_Regular',
        fontSize: 16,
        color: "grey",
    },
    mainContainer: {
        flexDirection: 'column',
        paddingLeft: 20,
        paddingRight: 10,
        marginHorizontal: 20,
        marginVertical: 15,
        backgroundColor: "#fff",
        borderColor: "#FE7A15",
        borderWidth: 1,
        borderRadius: 5
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#fff",
    },
    answer: {
        backgroundColor: "#fff",
        marginVertical: 10
    },
    answerText: {
        fontFamily: 'Open_Sans_Regular',
        fontSize: 16,
        backgroundColor: "#fff",
        textAlign: "justify",
        fontSize: 16,
        color: "grey"
    }

});