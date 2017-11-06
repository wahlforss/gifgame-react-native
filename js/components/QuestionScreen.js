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
      displayingAnswers: false,
      displayingQuestions: false,
      displayingWaiting: true

    }
  }

  fetchGameState() {
    console.log('FETCHING GAME STATE');
    //fetches game state and activates react on game state
    firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {

      this.setState({
        gameState: currentGame.val().state
      }, () => {

        this.reactOnGameState()
      })
    })
  }

  setGameState(gameState) {
    firebaseDatabaseRef.ref(`/games/${this.props.gameid}/state`).set(gameState)
  }

  fetchNewQuestion() {
    //fetches a random question that is not already played in the game
      let randomQuestionId = Math.floor(Math.random()*76)
      //IMPLEMENT SOME SHIT TO GET RANDOM THAT HAS NOT BEEN TAKEN TOO LAZY NOW
      let promises = []
      promises.push(firebaseDatabaseRef.ref(`/questions/${randomQuestionId}`).once('value', (currentQuestion) => {
        const questionToBePushed = {[randomQuestionId]:currentQuestion.val()}
        promises.push(firebaseDatabaseRef.ref(`/games/${this.props.gameid}/questionsInGame/`).push().set(questionToBePushed))
      }))

      return Promise.all(promises)

  }

  fetchQuestion(whichQuestion) {
    //Adds the latest question to state and then displays that question TODO: CHANGE STATE RECALL TO PROMISE
    return (firebaseDatabaseRef.ref(`/games/${this.props.gameid}/questionsInGame`).orderByKey().limitToLast(whichQuestion).once('value', (snap) => {
      const questionObject = Object.values(Object.values(snap.val())[0])[0]
      const questionId = Object.keys(snap.val())[0]
      this.setState({
        question: questionObject.question,
        gif1: questionObject.gif1,
        gif2: questionObject.gif2,
        gif3: questionObject.gif3,
        questionId: questionId
      }, () => {
        this.displayQuestion()
      })
    }))
  }

  fetchQuestionForAnswer(whichQuestion) {
    return (firebaseDatabaseRef.ref(`/games/${this.props.gameid}/questionsInGame`).orderByKey().limitToLast(whichQuestion).once('value', (snap) => {
      const questionObject = Object.values(Object.values(snap.val())[0])[0]
      const questionId = Object.keys(snap.val())[0]
      this.setState({
        question: questionObject.question,
        gif1: questionObject.gif1,
        gif2: questionObject.gif2,
        gif3: questionObject.gif3,
        questionId: questionId
      }, () => {
        this.displayAnswers()
      })
    }))
  }

  fetchAnswer(whichAnswer) {
    //fetches latest answer and displays answers
    firebaseDatabaseRef.ref(`/games/${this.props.gameid}/previousAnswers`).orderByKey().limitToLast(whichAnswer).once('value', (previousAnswers) => {
      const { creatorAnswers, joinerAnswers } = Object.values(previousAnswers.val())[0]
      this.setState({
        creatorAnswers,
        joinerAnswers
      }, () => {
        this.fetchQuestionForAnswer(whichAnswer)
      })
    })

  }


  displayQuestion() {



    this.setState({
      displayingQuestions: true,
      displayingAnswers: false,
      displayingWaiting: false
    }, () => {
      if (this.state.currentGifSelected === 3) {
          this.gifSwiperAnswer.scrollByIndex(1)
      } else if (this.state.currentGifSelected === 2) {
        this.gifSwiperAnswer.scrollByIndex(2)
      }
    })
  }

  displayWaiting() {
    this.setState({
      displayingWaiting: true,
      displayingAnswers: false,
      displayingQuestions: false
    })
  }

  displayAnswers() {
    this.changeDisplayingAnswersGifs()



  }



  reactOnGameState() {
    switch (this.state.gameState) {
      case 0:
        //Game starts
        this.fetchNewQuestion().then(() => {
        //   console.log('RUMPAN ÄR REN');
        this.fetchQuestion(1)
        this.setState({
          gameState: 1
        })
        this.setGameState(1)
        })
        break;
      case 1:
        //Joiner first answer
        this.fetchQuestion(1)
        break;

      case 2:
        //Creator first answer
        firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
          if (firebaseRef.auth().currentUser.uid === currentGame.val().joiner) {
            //user is joiner
            this.displayWaiting()
          } else {
            //user is creator
            this.fetchQuestion(1)
          }
        })
        break;
      case 3:
        //Creator first disp
        firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
          if (firebaseRef.auth().currentUser.uid === currentGame.val().joiner) {
            //user is joiner
            this.displayWaiting()
          } else {
            //user is creator
            this.fetchAnswer(1)
          }
        })

        break;

      case 4:
        //Creator SECOND ANS
        firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
          if (firebaseRef.auth().currentUser.uid === currentGame.val().joiner) {
            //user is joiner
            this.displayWaiting()
          } else {
            //user is creator
            this.fetchNewQuestion().then(() => {
            this.fetchQuestion(1)
            this.setState({
              gameState: 5
            })
            this.setGameState(5)
            })
          }
        })
        break
      case 5:
        //Creator SECOND ANS
        firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
          if (firebaseRef.auth().currentUser.uid === currentGame.val().joiner) {
            //user is joiner
            this.displayWaiting()
          } else {
            //user is creator
            this.fetchQuestion(1)
          }
        })
        break
      case 6:
        //Joiner first disp
        firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
          if (firebaseRef.auth().currentUser.uid === currentGame.val().joiner) {
            //user is joiner
            this.fetchAnswer(2)
          } else {
            //user is creator
            this.displayWaiting()
          }
        })
        break
      case 7:
        //Joiner SECOND Answer
        firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
          if (firebaseRef.auth().currentUser.uid === currentGame.val().joiner) {
            //user is joiner
            this.fetchQuestion(1)
          } else {
            //user is creator
            this.displayWaiting()
          }
        })
        break
      case 8:
        //Joiner Second Disp
        firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
          if (firebaseRef.auth().currentUser.uid === currentGame.val().joiner) {
            //user is joiner
            this.fetchAnswer(1)
          } else {
            //user is creator
            this.displayWaiting()
          }
        })
        break
      case 9:
        //JOINER Third Fetch Ans
        firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
          if (firebaseRef.auth().currentUser.uid === currentGame.val().joiner) {
            //user is joiner
            this.fetchNewQuestion().then(() => {
            this.fetchQuestion(1)
            this.setState({
              gameState: 10
            })
            this.setGameState(10)
            })
          } else {
            //user is creator
            this.displayWaiting()
          }
        })
        break

      case 10:
        //JOINER THIRD ANS
        firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
          if (firebaseRef.auth().currentUser.uid === currentGame.val().joiner) {
            //user is joiner
            this.fetchQuestion(1)
          } else {
            //user is creator
            this.displayWaiting()
          }
        })
        break
      case 11:
        //Creator Second DISP
        firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
          if (firebaseRef.auth().currentUser.uid === currentGame.val().joiner) {
            //user is joiner
            this.displayWaiting()
          } else {
            //user is creator
            this.fetchAnswer(2)
          }
        })
        break
      case 12:
       //Creator third ANS
       firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
         if (firebaseRef.auth().currentUser.uid === currentGame.val().joiner) {
           //user is joiner
           this.displayWaiting()
         } else {
           //user is creator
           this.fetchQuestion(1)
         }
       })
       break
      case 13:
        //creator Third DISP
        firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
          if (firebaseRef.auth().currentUser.uid === currentGame.val().joiner) {
            //user is joiner
            this.displayWaiting()
          } else {
            //user is creator
            this.fetchAnswer(1)
          }
        })
        break
      case 14:
        //Creator fetch new Question
        firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
          if (firebaseRef.auth().currentUser.uid === currentGame.val().joiner) {
            //user is joiner
            this.displayWaiting()
          } else {
            //user is creator
            this.fetchNewQuestion().then(() => {
            this.fetchQuestion(1)
            this.setState({
              gameState: 15
            })
            this.setGameState(15)
            })
          }
        })
        break
      case 15:
        firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
          if (firebaseRef.auth().currentUser.uid === currentGame.val().joiner) {
            //user is joiner
            this.displayWaiting()
          } else {
            //user is creator
            this.fetchQuestion(1)
          }
        })
        break
      case 16:
        this.setState({
          gameState: 6
        }, () => {
          this.reactOnGameState()
        })
        this.setGameState(6)
        break;
      default:

    }

  }




  componentDidMount() {
    this.fetchGameState()
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

  renderGifSwiper() {
    if (this.state.gif1 && this.state.gif2 && this.state.gif3) {
      return (
        <GifSwiper
          gifArray={[this.state.gif1,this.state.gif2,this.state.gif3]}
          indexChanged={this.indexChanged.bind(this)}
          gif1={this.state.gif1}
          gif2={this.state.gif2}
          gif3={this.state.gif3}
          displayAnswers={false}
          ref={ref => (this.gifSwiperAnswer = ref)}
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
                joinerAnswers: {
                  guessFriendsGif: this.state.gifSelectForFriend,
                  myAnswer: this.state.gifSelectedForMyself
                }
            }
            this.setGameState(this.state.gameState + 1)
            this.setState({
              gameState: this.state.gameState + 1
            }, () => {
              this.reactOnGameState()
            })

            firebaseDatabaseRef.ref(`/games/${this.props.gameid}/previousAnswers/${this.state.questionId}`).update(previousAnswers)
          } else {
            //User is creator
            let previousAnswersCreator = {
              creatorAnswers: {
                guessFriendsGif: this.state.gifSelectForFriend,
                myAnswer: this.state.gifSelectedForMyself
              }
            }
            this.setGameState(this.state.gameState + 1)
            this.setState({
              gameState: this.state.gameState + 1
            }, () => {
              this.reactOnGameState()
            })
            firebaseDatabaseRef.ref(`/games/${this.props.gameid}/previousAnswers/${this.state.questionId}`).update(previousAnswersCreator)
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


  changeDisplayingAnswersGifs() {
    //changes the gifs to be displayed KORREKT
    let currentDisplayingGif1 =  ''
    let currentDisplayingGif2 =  ''
    let currentDisplayingGif3 =  ''
    firebaseDatabaseRef.ref(`/games/${this.props.gameid}`).once('value', (currentGame) => {
      if (firebaseRef.auth().currentUser.uid === currentGame.val().joiner) {
        //user is joiner
        currentDisplayingGif1 =  'gif' + this.state.joinerAnswers.guessFriendsGif
        currentDisplayingGif2 =  'gif' + this.state.creatorAnswers.myAnswer
        currentDisplayingGif3 =  'gif' + this.state.creatorAnswers.guessFriendsGif
      } else {
        //user is creator
        currentDisplayingGif1 =  'gif' + this.state.creatorAnswers.guessFriendsGif
        currentDisplayingGif2 =  'gif' + this.state.joinerAnswers.myAnswer
        currentDisplayingGif3 =  'gif' + this.state.joinerAnswers.guessFriendsGif
      }
    }).then(() => {
      //PROBLEM  -> STARTS AT PAST INDEX

      const displayAnswersSubtitles = [
            'Your guess',
            "Friend's actual answer",
            'Your friend guessed you picked'
        ]
      this.setState({
        currentDisplayingGif1: this.state[currentDisplayingGif1],
        currentDisplayingGif2: this.state[currentDisplayingGif2],
        currentDisplayingGif3: this.state[currentDisplayingGif3],
        displayingAnswers: true,
        displayingWaiting: false,
        displayingQuestions: false,
        currentDisplayingAnswerGif: 1,
        displayAnswersSubtitles
      }, () => {
        if (this.state.currentGifSelected === 3) {
            this.gifSwiperAnswer.scrollByIndex(1)
        } else if (this.state.currentGifSelected === 2) {
          this.gifSwiperAnswer.scrollByIndex(2)
        }
      })
    })

  }

  renderGifSwiperAnswers() {
    if(this.state.currentDisplayingGif1) {
    return (

        <GifSwiper
          gifArray={[this.state.gif1,this.state.gif2,this.state.gif3]}
          indexChanged={this.indexChanged.bind(this)}
          gif1={this.state.currentDisplayingGif1}
          gif2={this.state.currentDisplayingGif2}
          gif3={this.state.currentDisplayingGif3}
          displayAnswers={true}
          ref={ref => (this.gifSwiperAnswer = ref)}
        />
      )
    }

  }
  changeDisplayingAnswerGif() {
    if (this.state.currentDisplayingAnswerGif === 3 ) {
      this.gifSwiperAnswer.scrollByIndex(1)
      this.setGameState(this.state.gameState + 1)
      this.setState({
        gameState: this.state.gameState + 1
      }, () => {
        this.reactOnGameState()
      })

    } else {
      this.setState({
        currentDisplayingAnswerGif: this.state.currentDisplayingAnswerGif + 1
      }, () => {
        console.log(this.state.gif2, 'displaying gif!');
        this.gifSwiperAnswer.scrollByIndex(1)
      })
    }
  }
  renderView() {
    if (this.state.displayingAnswers) {
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
              onPress={this.changeDisplayingAnswerGif.bind(this)}
            >
              <Text style={styles.buttonText}>Next answer</Text>
            </Button>
            <Text style={styles.question}>{this.state.displayAnswersSubtitles[this.state.currentDisplayingAnswerGif - 1]}</Text>
          </View>
          <View style={styles.gifView}>
            {this.renderGifSwiperAnswers()}
          </View>
        </Container>
      )

    } else if (this.state.displayingQuestions) {
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
              <Text style={styles.buttonText}>{this.state.selectFriendGif ? 'This is my friend 100000%' : 'OMG this is me!'}</Text>
            </Button>
          </View>
          <View style={styles.gifView}>
            {this.renderGifSwiper()}
          </View>
        </Container>
          )
        } else if (this.state.displayingWaiting) {
            return (
              <Container style={styles.container}>
                <StatusBar
                  backgroundColor="blue"
                  barStyle="light-content"
                />
                <View style={styles.header}>
                  <Text style={styles.question}>Waiting</Text>
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
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center'
  },
  answerTime: {
    marginTop: 30,
    marginBottom: 10,
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  },
  gifView: {
    flex: 1,
    alignItems: 'center'
  },
  displayingGifAnswers: {
    height: 50,
    width: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
