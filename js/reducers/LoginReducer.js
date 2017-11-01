import { LOGIN_TO_FACEBOOK, CURRENT_GAME, CHANGE_CURRENT_GIF, DISPLAY_ANSWERS } from '../constants'
const initialState = {
  currentGame: '',
  currentGifSelected: 1,
  displayAnswers: false
}

export default function miscReducer (state = initialState, action) {
  switch (action.type) {
    case LOGIN_TO_FACEBOOK:
      return {
        ...state,
        facebookAccessToken: action.facebookToken,
        firebaseToken: action.firebaseToken
      }
    case CURRENT_GAME:
      return {
        ...state,
        currentGame: action.currentGame
      }
    case CHANGE_CURRENT_GIF:
    return {
        ...state,
        currentGifSelected: action.currentGif
      }
    case DISPLAY_ANSWERS:
      return {
        ...state,
        displayAnswers: true
      }
    default:
      return state
  }
}
