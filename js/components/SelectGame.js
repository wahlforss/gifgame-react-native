import React, { Component } from 'react';
import { Image, StyleSheet, StatusBar, TouchableHighlight, ScrollView } from 'react-native';
import { Container, Header, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Right, Body, Icon, Button } from 'native-base';
import {firebaseRef, firebaseDatabaseRef} from '../services/Firebase.js'
import { connect } from 'react-redux'
import jsonWithQuestions from '../../json_with_questions.json'

//import { changeCurrentGame } from '../actions.js'
import { changeCurrentGame } from '../actions.js'

class SelectGame extends Component {
  constructor(props) {
    super(props)
    this.state = {
      games: [{uid: '', email: ''}],
    }
  }
  componentDidMount() {
    this.renderCurrentGames()
  }

  pushQuestionsToFirebase() {
    jsonWithQuestions.map((questionObject, index) => {
      firebaseDatabaseRef.ref(`/questions/${index}`).set(questionObject)
    })

  }

  createGame(otherUser) {
    let user = firebaseRef.auth().currentUser
    console.log(user.email);
    let game = {
      creator: {uid: user.uid, email: user.email},
      state: 0
    }
    firebaseDatabaseRef.ref('/games').push().set(game)
  }
  renderCurrentGames() {
    let arrayOfGameIds = []
    firebaseDatabaseRef.ref('/games').on('value', (snapshot) => {
      let games = snapshot.val()
      let gameKeys = Object.keys(games)

      gameKeys.map((key) => {
        arrayOfGameIds.push({email:games[key].creator.email, uid: key})
      })
      this.setState({
        games: arrayOfGameIds
      })
    })

  }

  joinGame(gameUid) {

    firebaseDatabaseRef.ref(`/games/${gameUid}`).once('value', (snapshot) => {
      console.log(snapshot.val());
      if (!snapshot.val().previousAnswers) {
        if (firebaseRef.auth().currentUser.uid === 'NxeulyOrZcdwugc59UzPRrhCW953') {
          //USER IS JOINER
          let questionObject = {}
          firebaseDatabaseRef.ref('/questions/-Kx9RuO47Ckp8Spb7bWi').once('value', (questionSnapshot) => {
            questionObject = questionSnapshot.val()
            console.log(questionObject, 'questionObject');
          }).then(() => {
            const updateToGameWhenJoined = {
              joiner: firebaseRef.auth().currentUser.uid,              
              currentQuestion: questionObject,
              previousAnswers: {}
            }
            firebaseDatabaseRef.ref(`/games/${gameUid}`).update(updateToGameWhenJoined)
          })
        }
      }
    })
      this.props.changeCurrentGame(gameUid)
      this.props.navigation.navigate('QuestionScreen')

  }

  render() {
    console.log(this.state, 'statein comp');
    return (
      <View style={{justifyContent: 'center', alignItems:'center', flex: 1}}>
        <ScrollView>
          <Text>Hello</Text>
          {this.state.games.map(game => {
            return (
              <Button key={Math.random()} onPress={this.joinGame.bind(this, game.uid)}>
                <Text>{game.email}</Text>
              </Button>
            )
          })}
        </ScrollView>
        <Text>logged in as {firebaseRef.auth().currentUser.email}</Text>

      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    loginReducer: state.loginReducer
  }
}

function mapDispatchToProps(dispatch) {
  return (
    {
      changeCurrentGame: (gameid) => dispatch(changeCurrentGame(gameid))
    }
  )
}

// function mapDispatchToProps (dispatch) {
//   return (
//     {
//       addAccessToken: (accessToken,asdsa) => dispatch(changeCurrentGame(accessToken))
//     }
//   )
// }

export default connect(mapStateToProps, mapDispatchToProps)(SelectGame)
