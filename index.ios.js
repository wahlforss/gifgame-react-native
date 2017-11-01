import React from 'react';
import { StyleSheet, Text, View, AppRegistry } from 'react-native';
import { Button } from 'native-base';
import * as firebase  from 'firebase';
import FBSDK, { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
import {GifGameStack} from './js/config/Router.js'
import { Provider } from 'react-redux'
import configureStore from './js/configureStore'

const store = configureStore()


const ReduxApp = () => (
  <Provider store={store}>
    <GifGameStack />
  </Provider>
)

export default class favdir extends React.Component {
  render() {
  return (
      <GifGameStack />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

AppRegistry.registerComponent('favdir', () => ReduxApp);

//AppRegistry.registerComponent('favdir', () => favdir);


















// getUserFromFb(accessToken) {
//   let graphRequestFromToken = new GraphRequest('/me', {
//   httpMethod: 'GET',
//   version: 'v2.5',
//   accessToken: accessToken,
//   parameters: {
//       'fields': {
//           'string' : 'email,name,friends, first_name, age_range, gender, picture, link, cover'
//       }
//   }
// }, (error, resultFromGraphRequest) => {
//     console.log(error, 'Error from Graph Request');
//     console.log(resultFromGraphRequest, 'This is graphRequestResultBaby');
//   });
//   new GraphRequestManager().addRequest(graphRequestFromToken).start();
// }
//
// fbAuth() {
//   LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends']).then((result) => {
//     if (result.isCancelled) {
//       console.log('cancelled');
//     } else {
//       console.log('SUCCESS', result);
//       this.getUserFromFb()
//       AccessToken.getCurrentAccessToken().then((accessTokenData) => {
//         const credential = firebase.auth.FacebookAuthProvider.credential(accessTokenData.accessToken)
//         this.getUserFromFb(accessTokenData.accessToken)
//         firebase.auth().signInWithCredential(credential).then((result) => {
//           //promise if success
//           console.log('firebase success');
//         }, (error) => {
//           //promise if failed
//           console.log(error);
//         })
//       }, (error) => {
//         console.log(error);
//       })
//     }
//
//   }, (error) => {
//     console.log(error);
//   })
// }
