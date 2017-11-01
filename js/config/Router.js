import React from 'react'
import { TabNavigator, StackNavigator } from 'react-navigation'

import QuestionScreen from '../components/QuestionScreen.js'
import LoginScreen from '../components/LoginScreen.js'
import SelectGame from '../components/SelectGame.js'


export const GifGameStack = StackNavigator({
  LoginScreen: {
    screen: LoginScreen
  },
  QuestionScreen: {
    screen: QuestionScreen
  },
  SelectGame: {
    screen: SelectGame
  }

}, {
  headerMode: 'none',
  initialRouteName: 'LoginScreen'
})
