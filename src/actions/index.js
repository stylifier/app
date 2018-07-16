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

const deviceNameSafe = `m_g_i_o_s_${btoa(
    unescape(
      encodeURIComponent(DeviceInfo.getUniqueID())))
  .replace(/=/g, '')
  .toLowerCase()}`

const actions = {
  colorSuggestionImagePicked: () => (dispatch) => {
    dispatch(
      NavigationActions.navigate({ routeName: 'Adding' })
    )
  },

  getColorPalletRecommendation: (base) => (dispatch) => {
    api.fetchColorPalletRecommendation(base)
    .then(recoms => dispatch({
      type: 'UPDATE_COLOR_PALLET_SUGGESTION',
      payload: [...recoms],
    }))
  },

  refreshBookmarks: () => (dispatch) => {
    AsyncStorage.getItem('color_bookmarks')
    .then((bms) => bms && dispatch({
      type: 'UPDATE_COLOR_PALLET_BOOKMARKS',
      payload: [...JSON.parse(bms)],
    }))

    api.getColorPalletBookmarks()
    .then(pallets => {
      dispatch({
        type: 'UPDATE_COLOR_PALLET_BOOKMARKS',
        payload: [...pallets.data],
      })
      AsyncStorage.setItem('color_bookmarks', JSON.stringify(pallets.data))
    })
  },

  deleteBookmarkedColorPallet: (palletId) => (dispatch) => {
    api.deleteBookmarkedColorPallet(palletId)
    .then(() => dispatch(actions.refreshBookmarks()))
  },

  bookmarkColorPallet: (palletId, title) => (dispatch) => {
    api.bookmarkColorPallet(palletId, title)
    .then(() => dispatch(actions.refreshBookmarks()))
  },

  colorSuggestionImageResized: image => (dispatch) => {
    dispatch({
      type: 'COLOR_SUGGESTION_IMAGE_PICKED',
      payload: { image },
    })

    api.uploadImage(image)
    .then(imageMetaDate =>
      dispatch({
        type: 'COLOR_SUGGESTION_IMAGE_UPLOADED',
        payload: imageMetaDate,
      })
    )
  },

  userInitiated: (info) => (dispatch) => {
    dispatch({
      type: 'USER_INITIATED',
      payload: info,
    })
    dispatch(actions.refreshBookmarks())
  },

  loginUser: (username, password) => (dispatch) => {
    dispatch({ type: 'LOGGING_IN' })

    api.login({ username: `m_g_i_o_s_${username}`, password })
    .then(token =>
      setTokenAndUserInfo(token)
      .then(info => dispatch(actions.userInitiated(info))))
    .catch(e => {
      dispatch({ type: 'LOGIN_FAILED', payload: e })
    })
  },

  registerUser: (username, password, email, fullname) => (dispatch) => {
    dispatch({ type: 'REGISTERING_USER' })

    api.register({
      username: `m_g_i_o_s_${username}`,
      password,
      email,
      full_name: fullname,
      invite_code: deviceNameSafe,
    })
    .then(token => setTokenAndUserInfo(token))
    .then(info => dispatch(actions.userInitiated(info)))
    .catch(e => dispatch({ type: 'USER_REGISTRATION_FAILED', payload: e }))
  },

  logoutUser: () => (dispatch) => {
    AsyncStorage.removeItem('user_info')
    .then(() => dispatch(actions.initiateUser()))
  },

  initiateUser: () => (dispatch) => {
    AsyncStorage.getItem('user_info')
    .then(info => {
      if (info) {
        return dispatch(actions.userInitiated(JSON.parse(info)))
      }

      return api.login({
        username: deviceNameSafe,
        password: deviceNameSafe,
      })
      .then(token =>
        setTokenAndUserInfo(token)
        .then(i => dispatch(actions.userInitiated(i))))
      .catch(e => {
        if (e.message !== '401') {
          return
        }

        api.register({
          username: deviceNameSafe,
          password: deviceNameSafe,
          email: `${deviceNameSafe}@guest.guest`,
          full_name: deviceNameSafe,
          invite_code: deviceNameSafe,
        })
        .then(token => setTokenAndUserInfo(token))
        .then(i => dispatch(actions.userInitiated(i)))
        .catch(err => dispatch({ type: 'USER_INITIATION_FAILED', payload: err }))
      })
    })
  },
}

export default actions
