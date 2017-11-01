import React, { Component } from 'react';
import { Image, StyleSheet, StatusBar, TouchableHighlight } from 'react-native';
import { Container, Header, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Right, Body, Icon, Button } from 'native-base';
import Gif from './Gif.js'
import Dimensions from 'Dimensions';
import GifSwiper from './GifSwiper.js'
import {connect} from 'react-redux'
import jsonWithQuestions from '../../json_with_questions.json'
import {firebaseRef, firebaseDatabaseRef} from '../services/Firebase.js'
import {watchForAddedAnswers, dispatchDisplayAnswers} from '../actions.js'

height = Dimensions.get('window').height
width = Dimensions.get('window').width


class QuestionScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentGifSelected: 1,
      selectFriendGif: false,
      gifSelectedForMyself: 0,
      gifSelectForFriend: 0,
      waitingTurn: false,
      displayingAnswers: false

    }
  }

  componentDidMount() {
    this.checkDisplayAnswers()
    this.getCurrentQuestion()
  }

  checkDisplayAnswers() {
    firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
      if (currentGame.val().previousAnswers) {
        const numberOfAnswers = Object.keys(currentGame.val().previousAnswers).length
        if (numberOfAnswers === 2) {
          this.displayAnswers()
        }
      }
    })
  }

  getCurrentQuestion() {
    firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (questionSnapshot) => {
      let questionObject = questionSnapshot.val().currentQuestion
      this.setState({
        question: questionObject.question,
        gif1: questionObject.gif1,
        gif2: questionObject.gif2,
        gif3: questionObject.gif3
      })
    })
  }
  renderGifSwiper() {
    if (this.state.gif1 && this.state.gif2 && this.state.gif3) {
      return (
        <GifSwiper
          gifArray={[this.state.gif1,this.state.gif2,this.state.gif3]}
          indexChanged={this.indexChanged.bind(this)}
          gif1={this.state.gif1}
          gif2={this.state.gif2}
          gif3={this.state.gif3}
        />
      )
    }
  }

  indexChanged(index) {
    this.setState({
      currentGifSelected: index
    })
  }

  onSelectGifPress() {
    if (this.state.selectFriendGif) {
      this.setState({
        selectFriendGif: false,
        gifSelectForFriend: this.state.currentGifSelected
      }, () => {
        firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value',(currentGame) => {
          if (firebaseRef.auth().currentUser.uid === currentGame.val().joiner) {
            //User is joiner
            let previousAnswers = {
              previousAnswers: {
                joinerAnswers: {
                  guessFriendsGif: this.state.gifSelectForFriend,
                  myAnswer: this.state.gifSelectedForMyself
                }
              }
            }
            firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).update(previousAnswers)
            this.setState({
              waitingTurn: true
            })
          } else {
            //User is creator
            let previousAnswersCreator = {
              creatorAnswers: {
                guessFriendsGif: this.state.gifSelectForFriend,
                myAnswer: this.state.gifSelectedForMyself
              }
            }
            firebaseDatabaseRef.ref(`/games/${this.props.gameid}/previousAnswers`).update(previousAnswersCreator).then(() => {
              this.displayAnswers()
            })


          }
        })
      })
    } else {
      this.setState({
        selectFriendGif: true,
        gifSelectedForMyself: this.state.currentGifSelected
      })
    }
  }

  displayAnswers() {
    this.props.dispatchDisplayAnswers()
    firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
      const previousAnswers = currentGame.val().previousAnswers
      if (firebaseRef.auth().currentUser.uid === currentGame.val().creator.uid) {
        //Creator
        this.setState({
          displayingAnswersGuess: previousAnswers.creatorAnswers.guessFriendsGif,
          displayingAnswersFriend: previousAnswers.joinerAnswers.myAnswer,
        })
      } else {
        //joiner
        this.setState({
          displayingAnswersGuess: previousAnswers.joinerAnswers.guessFriendsGif,
          displayingAnswersFriend: previousAnswers.creatorAnswers.myAnswer
        })
      }
    })
  }

  renderView() {
    if (this.props.displayAnswers) {
      return (
        <Container style={styles.container}>
          <StatusBar
            backgroundColor="blue"
            barStyle="light-content"
          />
          <View style={styles.header}>
            <Text style={styles.question}>you guessed {this.state.displayingAnswersGuess}</Text>
            <Text style={styles.question}> your friend answered {this.state.displayingAnswersFriend}</Text>
          </View>
        </Container>
      )

    } else if (!this.state.waitingTurn) {
      return (
        <Container style={styles.container}>
          <StatusBar
            backgroundColor="blue"
            barStyle="light-content"
          />
          <View style={styles.header}>

            <Text style={styles.question}>
              {this.state.question}
            </Text>
            <Button
              style={styles.button}
              onPress={this.onSelectGifPress.bind(this)}
            >
              <Text style={styles.buttonText}>{this.state.selectFriendGif ? 'friend 100000%' : 'OMG this is me!'}</Text>
            </Button>
          </View>
          <View style={styles.gifView}>
            {this.renderGifSwiper()}
          </View>
        </Container>
          )
          } else {
            return (
              <Container style={styles.container}>
                <StatusBar
                  backgroundColor="blue"
                  barStyle="light-content"
                />
                <View style={styles.header}>
                  <Text style={styles.question}>Waiting for friend</Text>
                </View>
              </Container>
            )
          }
          }
          render() {
            return (
                this.renderView()
            )
  }


}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  header: {
    flex:1,
    backgroundColor: '#F74242',
    justifyContent: 'center',
    alignItems: 'center',
  },
  question: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center'
  },
  gifView: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: 50,

  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  gifArrow: {
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {
    height: 0,
    width: 0
    },
    backgroundColor: 'rgba(0,0,0,0)',
    position:'absolute',
    color: 'white',
    top: height/4-20,
    fontSize: 100,
  },
  leftArrow: {
    left: 10
  },
  rightArrow: {
    right: 10
  },
  gifImage: {
    flex: 1,
    width: width,
  }
})
function mapStateToProps (state) {
  return {
    gameid: state.miscReducer.currentGame,
    displayAnswers: state.miscReducer.displayAnswers

  }
}

function mapDispatchToProps (dispatch) {
  watchForAddedAnswers(dispatch)
  return (
    {
      dispatchDisplayAnswers: () => dispatch(dispatchDisplayAnswers())
    }
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionScreen)
