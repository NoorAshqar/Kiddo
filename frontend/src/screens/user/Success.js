// frontend/src/screens/user/Success.js
import React, { Component, useState } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { senduser } from "../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
const win = Dimensions.get("window");
// This appears after a user successfully signs in
class Success extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
    };
  }

  componentDidMount() {
    var myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");
    AsyncStorage.getItem("@user").then((user) => {
      fetch(`https://blackpearl2.ew.r.appspot.com/users/?username=${user}`, {
        headers: myHeaders,
        redirect: "follow",
      })
        .then((response) => response.json())
        .then((result) => {
          this.props.senduser(result[0]);
        })
        .catch(() => {});
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text
          style={[
            styles.text,
            { fontWeight: "200", fontSize: 30, color: "#2b31ae" },
          ]}
        >
          Thank You For Trusting Us
        </Text>
        <View style={{ alignSelf: "center" }}>
          <View style={styles.profileImage}>
            <Image
              source={{ uri: this.props.user?.thumbnail }}
              style={styles.image}
              resizeMode="center"
            ></Image>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={[styles.text1, { fontWeight: "200", fontSize: 36 }]}>
            {this.props.user?.username}
          </Text>
          <Text style={[styles.text1, { color: "#AEB5BC", fontSize: 14 }]}>
            {this.props.user?.phone}
          </Text>
          <Text style={[styles.text1, { color: "#AEB5BC", fontSize: 14 }]}>
            {this.props.user?.email}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("History");
          }}
        >
          <View style={styles.button}>
            <Text style={{ fontSize: 20, fontWeight: "200" }}>
              My Kid History
            </Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF",
    justifyContent: "center",
  },
  text: {
    marginTop: 70,
    textAlign: "center",
    color: "#2b31ae",
  },
  text1: {
    color: "#52575D",
  },
  image: {
    flex: 1,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 33,
    overflow: "hidden",
    marginTop: 15,
  },
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 16,
  },
  button: {
    backgroundColor: "white",
    height: 70,
    width: 350,
    marginHorizontal: 75,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    marginTop: 20,
  },
});

// Redux
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    senduser: (z) => {
      dispatch(senduser(z));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Success);
