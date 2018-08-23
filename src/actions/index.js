import { NavigationActions } from 'react-navigation'
import { AsyncStorage, Alert } from 'react-native'
import API from '../common/API.js'

const btoa = require('Base64').btoa
const DeviceInfo = require('react-native-device-info')

const api = new API()

const setTokenAndUserInfo = (token) => {
  api.setToken(token)
  return api.fetchUserInfo()
    .then((info) =>
      AsyncStorage.setItem('user_info', JSON.stringify(info))
        .then(() => info)
    )
}

const deviceNameSafe = `m_g_i_o_s_${btoa(
  unescape(
    encodeURIComponent(DeviceInfo.getUniqueID())))
  .replace(/=/g, '')
  .toLowerCase()}`

const actions = {
  reportCreateOutfitIssues: (payload) => () => {
    api.report(Object.assign(payload, { type: 'CreateOutfit' }))
    .then(() =>
      Alert.alert('Thanks for reporting the issue, we will resolve it as soon as possible.'))
    .catch(() =>
      Alert.alert('Ops... Something went wrong, please try again later.'))
  },

  refereshUserInfo: () => (dispatch) => {
    api.fetchUserInfo()
      .then((info) =>
        AsyncStorage.setItem('user_info', JSON.stringify(info))
          .then(() => dispatch({
            type: 'REFERESH_USER_INFO',
            payload: { ...info },
          }))
      )
  },

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

    AsyncStorage.getItem('product_bookmarks')
      .then((bms) => bms && dispatch({
        type: 'UPDATE_PRODUCT_BOOKMARKS',
        payload: [...JSON.parse(bms)],
      }))

    api.getProductBookmarks()
      .then(p => {
        dispatch({
          type: 'UPDATE_PRODUCT_BOOKMARKS',
          payload: [...p.data],
        })
        AsyncStorage.setItem('product_bookmarks', JSON.stringify(p.data))
      })
  },

  refreshColorCode: () => (dispatch) => {
    AsyncStorage.getItem('color_codes')
      .then((data) => data && dispatch({
        type: 'UPDATE_COLOR_CODE',
        payload: [...JSON.parse(data)],
      }))

    api.fetchColorCodes()
      .then(data => {
        dispatch({
          type: 'UPDATE_COLOR_CODE',
          payload: [...data],
        })
        AsyncStorage.setItem('color_code', JSON.stringify(data))
      })
  },

  refreshCategories: () => (dispatch) => {
    AsyncStorage.getItem('categories')
      .then((data) => data && dispatch({
        type: 'UPDATE_CATEGORIES',
        payload: [...JSON.parse(data)],
      }))

    api.fetchCategories()
      .then(data => {
        dispatch({
          type: 'UPDATE_CATEGORIES',
          payload: [...data],
        })
        AsyncStorage.setItem('categories', JSON.stringify(data))
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

  deleteBookmarkedProduct: (productId, palletId) => (dispatch) => {
    api.deleteBookmarkedProduct(productId, palletId)
      .then(() => dispatch(actions.refreshBookmarks()))
  },

  bookmarkProduct: (productId, palletId, title) => (dispatch) => {
    api.bookmarkProduct(productId, palletId, title)
      .then(() => dispatch(actions.refreshBookmarks()))
  },

  fetchProducts: (q) => (dispatch) => {
    dispatch({ type: 'CLEAR_PRODUCT_SUGGESTION' })
    dispatch({ type: 'LOADING_PRODUCT_SUGGESTION' })

    api.fetchUserProducts('zzz', q)
      .then(products => {
        dispatch({
          type: 'RENEW_PRODUCT_SUGGESTION',
          payload: {
            items: [...products.data],
            pagination: products.pagination,
            queries: { ...q },
          },
        })
      })
  },

  fetchMoreProducts: () => (dispatch, getState) => {
    const { productSuggestion } = getState()

    if (productSuggestion.loading || productSuggestion.finished) {
      return
    }

    dispatch({ type: 'LOADING_PRODUCT_SUGGESTION' })

    api.fetchUserProducts('zzz', productSuggestion.queries, productSuggestion.pagination)
      .then(products => {
        dispatch({
          type: 'ADD_TO_PRODUCT_SUGGESTION',
          payload: {
            items: [...products.data],
            pagination: products.pagination,
          },
        })
      })
  },

  askForApproval: (metadata) => () => {
    api.askForApproval(metadata)
    .then(() =>
      AsyncStorage.setItem('guest_submitted', 'true'))
    .then(() =>
      Alert.alert('Thanks for your submission. We will inform you when your account is ready.'))
    .catch(() =>
      Alert.alert('Ops... Something went wrong, please try again later.'))
  },

  toggleAddMenu: () => (dispatch) => {
    dispatch({
      type: 'TOGGLE_ADD_MENU',
    })
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
    dispatch(actions.refreshCategories())
    dispatch(actions.refreshColorCode())
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

  registerUser: (username, password, email, fullname) => (dispatch, getState) => {
    dispatch({ type: 'REGISTERING_USER' })

    api.register({
      username: `m_g_i_o_s_${username}`,
      password,
      email,
      full_name: fullname,
      invite_code: deviceNameSafe,
    })
      .then(token => setTokenAndUserInfo(token))
      .then(info =>
        Promise.all(getState()
          .bookmarks.reverse()
          .map(cp => api.bookmarkColorPallet(cp.id, cp.title)))
          .then(() => info)
          .catch(() => info))
      .then(info => dispatch(actions.userInitiated(info)))
      .catch(e => dispatch({ type: 'USER_REGISTRATION_FAILED', payload: e }))
  },

  logoutUser: () => (dispatch) => {
    AsyncStorage.removeItem('user_info')
    .then(() =>
      AsyncStorage.removeItem('guest_submitted'))
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
