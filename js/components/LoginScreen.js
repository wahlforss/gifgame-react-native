import React, { Component } from 'react';
import { Image, StyleSheet, StatusBar, TouchableHighlight } from 'react-native';
import { Container, Header, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Right, Body, Icon, Button } from 'native-base';
import FBSDK, { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
import firebase from 'firebase';
import {firebaseRef, firebaseDatabaseRef} from '../services/Firebase.js'
import { connect } from 'react-redux'
import {addAccessToken} from '../actions.js'


class LoginScreen extends Component {
    navigateToSelectGame() {
      this.props.navigation.navigate('SelectGame')
    }
    getUserFromFb(accessToken) {
      let graphRequestFromToken = new GraphRequest('/me', {
      httpMethod: 'GET',
      version: 'v2.5',
      accessToken: accessToken,
      parameters: {
          'fields': {
              'string' : 'email,name,friends, first_name, age_range, gender, picture, link, cover'
          }
      }
    }, (error, resultFromGraphRequest) => {
        console.log(error, 'Error from Graph Request');
        console.log(resultFromGraphRequest, 'This is graphRequestResultBaby');
      });
      new GraphRequestManager().addRequest(graphRequestFromToken).start();
    }

    fbAuth() {
      LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends']).then((result) => {
        if (result.isCancelled) {
          console.log('cancelled');
        } else {
          console.log('SUCCESS', result);
          this.getUserFromFb()

          AccessToken.getCurrentAccessToken().then((accessTokenData) => {


            const credential = firebase.auth.FacebookAuthProvider.credential(accessTokenData.accessToken)
            this.getUserFromFb(accessTokenData.accessToken)
            firebase.auth().signInWithCredential(credential).then((result) => {
              this.props.addAccessToken(accessTokenData, firebase.auth().currentUser.uid)
              //promise if success
              console.log('firebase success');
              this.navigateToSelectGame()
            }, (error) => {
              //promise if failed
              console.log(error);
            })
          }, (error) => {
            console.log(error);
          })

        }

      }, (error) => {
        console.log(error);
      })
    }


  render() {
    console.log(this.props, 'THIS IS STATE');
    return (
      <View style={{justifyContent: 'center', 'alignItems': 'center', 'flex': 1}}>
        <Button onPress={this.fbAuth.bind(this)}>
          <Text>Log in with FB</Text>
        </Button>
      </View>
    )
  }
}

function mapStateToProps (state) {
  return {
    loginReducer: state.loginReducer
  }
}

function mapDispatchToProps (dispatch) {
  return (
    {
      addAccessToken: (accessToken, firebaseToken) => dispatch(addAccessToken(accessToken, firebaseToken))
    }
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen)
