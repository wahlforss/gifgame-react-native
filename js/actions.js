import { LOGIN_TO_FACEBOOK, CURRENT_GAME, DISPLAY_ANSWERS } from './constants'
import FBSDK, { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
import firebase from 'firebase';
import {firebaseRef, firebaseDatabaseRef} from './services/Firebase.js'
import {store} from '../index.ios.js';

export function addAccessToken(facebookToken, firebaseToken) {
  return {
    type: LOGIN_TO_FACEBOOK,
    facebookToken,
    firebaseToken

  }
}

export function changeCurrentGame(gameIdOfCurrentGame) {
  return {
    type: CURRENT_GAME,
    currentGame: gameIdOfCurrentGame
  }
}

export function watchForAddedAnswers(dispatch) {
  //console.log('lolstore', store.getState().miscReducer);
  firebaseDatabaseRef.ref(`/game/${'-Kx9Gjz1VQy7p1DPyxpD'}/previousAnswers`).on('child_changed', (snap) => {    
    dispatch(dispatchDisplayAnswers())
  });
}

export function dispatchDisplayAnswers() {
  return {
    type: DISPLAY_ANSWERS
  }
}
