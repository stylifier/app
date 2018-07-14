import { NavigationActions } from 'react-navigation'
import { AsyncStorage } from 'react-native'
import API from '../common/API.js'
const btoa = require('Base64').btoa
const DeviceInfo = require('react-native-device-info')

const api = new API()

const setTokenAndUserInfo = (token) => {
  api.setToken(token)
  return api.fetchUserInfo()
  .then((info) =>
    AsyncStorage.setItem('user_info', JSON.stringify(info))
    .then(() => info))
}

const deviceNameSafe = 'm_g_i_o_s_' +
  btoa(
    unescape(
      encodeURIComponent(DeviceInfo.getUniqueID())))
  .replace(/=/g,'')
  .toLowerCase()

const actions = {
  colorSuggestionImagePicked: () => (dispatch, getState) => {
    dispatch(
      NavigationActions.navigate({ routeName: 'Adding' })
    )
  },

  getColorPalletRecommendation: (base) => (dispatch, getState) => {
    api.fetchColorPalletRecommendation(base)
    .then(recoms => dispatch({
      type: 'UPDATE_COLOR_PALLET_SUGGESTION',
      payload: [...recoms]
    }))
  },

  refreshBookmarks: () => (dispatch, getState) => {
    api.getColorPalletBookmarks()
    .then(pallets => dispatch({
      type: 'UPDATE_COLOR_PALLET_BOOKMARKS',
      payload: [...pallets.data]
    }))
  },

  deleteBookmarkedColorPallet: (palletId) => (dispatch, getState) => {
    api.deleteBookmarkedColorPallet(palletId)
    .then(() => dispatch(actions.refreshBookmarks()))
  },

  bookmarkColorPallet: (palletId, title) => (dispatch, getState) => {
    api.bookmarkColorPallet(palletId, title)
    .then(() => dispatch(actions.refreshBookmarks()))
  },

  colorSuggestionImageResized: image => (dispatch, getState) => {
    dispatch({
      type: 'COLOR_SUGGESTION_IMAGE_PICKED',
      payload: {image}
    })

    api.uploadImage(image)
    .then(imageMetaDate => {
      console.log('imageMetaDate', imageMetaDate);
      dispatch({type: 'COLOR_SUGGESTION_IMAGE_UPLOADED', payload: imageMetaDate})
    })
    .catch(e => console.log(e))
  },

  userInitiated: (info) => (dispatch) => {
    dispatch({type: 'USER_INITIATED', payload: info})
    dispatch(actions.refreshBookmarks())
  },

  loginUser: (username, password) => (dispatch) => {
    dispatch({type: 'LOGGING_IN'})

    api.login({
      username: 'm_g_i_o_s_' + username,
      password: password
    })
    .then(token =>
      setTokenAndUserInfo(token)
      .then(info => dispatch(actions.userInitiated(info))))
    .catch(e => {
      dispatch({type: 'LOGIN_FAILED', payload: e})
    })
  },

  registerUser: (username, password, email, fullname) => (dispatch) => {
    dispatch({type: 'REGISTERING_USER'})

    api.register({
      username: 'm_g_i_o_s_' + username,
      password: password,
      email: email,
      full_name: fullname,
      invite_code: deviceNameSafe
    })
    .then(token => setTokenAndUserInfo(token))
    .then(info => dispatch(actions.userInitiated(info)))
    .catch(e => dispatch({type: 'USER_REGISTRATION_FAILED', payload: e}))
  },

  logoutUser: () => (dispatch) => {
    AsyncStorage.removeItem('user_info')
    .then(() => dispatch(actions.initiateUser()))
  },

  initiateUser: () => (dispatch) => {
    AsyncStorage.getItem('user_info')
    .then((info) => info ?
      dispatch(actions.userInitiated(JSON.parse(info))) :
      api.login({
        username: deviceNameSafe,
        password: deviceNameSafe
      })
      .then(token =>
        setTokenAndUserInfo(token)
        .then(info => dispatch(actions.userInitiated(info))))
      .catch(e => {
        if (e.message !== '401')
          return

        api.register({
          username: deviceNameSafe,
          password: deviceNameSafe,
          email: deviceNameSafe + '@guest.guest',
          full_name: deviceNameSafe,
          invite_code: deviceNameSafe
        })
        .then(token => setTokenAndUserInfo(token))
        .then(info => dispatch(actions.userInitiated(info)))
        .catch(e => dispatch({type: 'USER_INITIATION_FAILED', payload: e}))
      })
    )
  }
}

export default actions
