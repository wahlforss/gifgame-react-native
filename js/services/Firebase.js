import * as firebase from 'firebase'

let firebaseConfig = {
  apiKey: 'AIzaSyCZlG7qJ6qV9-6J7klkSSXvjL0lHWP77XA',
  authDomain: 'gif-game-546f3.firebaseapp.com/',
  databaseURL: 'https://gif-game-546f3.firebaseio.com/',
  storageBucket: 'gs://gif-game-546f3.appspot.com'
}

export const firebaseRef = firebase.initializeApp(firebaseConfig)

export const firebaseDatabaseRef = firebaseRef.database()
