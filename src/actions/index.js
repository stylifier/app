import { NavigationActions } from 'react-navigation'
import { AsyncStorage, Alert } from 'react-native'
import API from '../common/API'
import userAction from './user'
import conversationAction from './conversation'
import outfitAction from './outfit'
import productAction from './product'
import threadAction from './thread'
import navigationAction from './navigation'
import feedAction from './feed'
import colorPalletAction from './colorPallet'

const actions = {
  ...userAction,
  ...conversationAction,
  ...outfitAction,
  ...productAction,
  ...threadAction,
  ...navigationAction,
  ...colorPalletAction,
  ...feedAction,

  api: new API(),

  updateStyles: (q) => (dispatch) => {
    actions.api.getStyles(q)
      .then((r) => {
        dispatch({ type: 'UPDATE_STYLES', payload: r })
      })
      .catch(() => {})
  },

  setProfilePicture: (media) => (dispatch) => {
    actions.api.setProfilePicture(media)
      .then(() => dispatch(actions.fetchUserInfo(media.userUsername)))
      .catch(() => {})
  },

  addProductToMedia: (product, mediaId) => () => {
    actions.api.addProductToMedia(product, mediaId)
      .then(() => {})
      .catch(() => {})
  },

  setDescription: (id, description) => () => {
    actions.api.addDescriptionToMedia(id, description)
      .then(() => {})
      .catch(() => {})
  },

  setStyle: (id, style) => () => {
    actions.api.setStyle(id, style)
      .then(() => {})
      .catch(() => {})
  },

  unshareMedia: (media) => (dispatch) => {
    actions.api.unshareMedia(media.id)
      .then(() => dispatch(actions.fetchUserMedia(media.userUsername)))
      .catch(() => {
        Alert.alert('Ops... Something went wrong, please try again later.')
      })
  },

  shareMedia: (media) => (dispatch) => {
    actions.api.shareMedia(media.id)
      .then(() => {
        dispatch(actions.moveToPage('Profile'))
        dispatch(actions.fetchUserMedia(media.userUsername))
      })
      .catch(() => {
        Alert.alert('Ops... Something went wrong, please try again later.')
      })
  },

  reportCreateOutfitIssues: (payload) => () => {
    actions.api.report(Object.assign(payload, { type: 'CreateOutfit' }))
      .then(() =>
        Alert.alert('Thanks for reporting the issue, we will resolve it as soon as possible.'))
      .catch(() => {
        Alert.alert('Ops... Something went wrong, please try again later.')
      })
  },

  fetchUserMedia: (username) => (dispatch) => {
    actions.api.fetchUserMedia(username, 0)
      .then((r) => dispatch({ type: 'ADD_USER_MEDIA', payload: { ...r, username } }))
      .catch(() => {})
  },

  colorSuggestionImagePicked: () => (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'Adding' }))
    dispatch(actions.toggleSharingScreenInProcessImage(false))
  },

  getColorPalletRecommendation: (base) => (dispatch) => {
    actions.api.fetchColorPalletRecommendation(base)
      .then(recoms => dispatch({
        type: 'UPDATE_COLOR_PALLET_SUGGESTION',
        payload: [...recoms],
      }))
      .catch(() => {})
  },

  refreshBookmarks: (addToRecoms) => (dispatch) => {
    AsyncStorage.getItem('color_bookmarks')
      .then((bms) => bms && dispatch({
        type: 'UPDATE_COLOR_PALLET_BOOKMARKS',
        payload: [...JSON.parse(bms)],
      }))
      .catch(() => {})

    actions.api.getColorPalletBookmarks()
      .then(pallets => {
        dispatch({
          type: 'UPDATE_COLOR_PALLET_BOOKMARKS',
          payload: [...pallets.data],
        })
        if (addToRecoms && pallets.data.length > 0) {
          dispatch({
            type: 'ADD_TOP_COLOR_PALLET_SUGGESTION',
            payload: pallets.data[0],
          })
        }
        if (pallets.data) {
          AsyncStorage.setItem('color_bookmarks', JSON.stringify(pallets.data))
        }
      })
      .catch(() => {})

    AsyncStorage.getItem('product_bookmarks')
      .then((bms) => bms && dispatch({
        type: 'UPDATE_PRODUCT_BOOKMARKS',
        payload: [...JSON.parse(bms)],
      }))
      .catch(() => {})

    actions.api.getProductBookmarks()
      .then(p => {
        dispatch({
          type: 'UPDATE_PRODUCT_BOOKMARKS',
          payload: [...p.data],
        })
        if (p.data) {
          AsyncStorage.setItem('product_bookmarks', JSON.stringify(p.data))
        }
      })
      .catch(() => {})
  },

  refreshColorCode: () => (dispatch) => {
    AsyncStorage.getItem('color_codes')
      .then((data) => data && dispatch({
        type: 'UPDATE_COLOR_CODE',
        payload: [...JSON.parse(data)],
      }))
      .catch(() => {})

    actions.api.fetchColorCodes()
      .then(data => {
        dispatch({
          type: 'UPDATE_COLOR_CODE',
          payload: [...data],
        })
        if (data) {
          AsyncStorage.setItem('color_code', JSON.stringify(data))
        }
      })
      .catch(() => {})
  },

  refreshCategories: () => (dispatch) => {
    AsyncStorage.getItem('categories')
      .then((data) => data && dispatch({
        type: 'UPDATE_CATEGORIES',
        payload: [...JSON.parse(data)],
      }))
      .catch(() => {})

    actions.api.fetchCategories()
      .then(data => {
        dispatch({
          type: 'UPDATE_CATEGORIES',
          payload: [...data],
        })
        if (data) {
          AsyncStorage.setItem('categories', JSON.stringify(data))
        }
      })
      .catch(() => {})
  },

  colorSuggestionImageResized: image => (dispatch) => {
    dispatch({
      type: 'COLOR_SUGGESTION_IMAGE_PICKED',
      payload: { image },
    })

    actions.api.uploadImage(image)
      .then(imageMetaDate =>
        dispatch({
          type: 'COLOR_SUGGESTION_IMAGE_UPLOADED',
          payload: imageMetaDate,
        })
      )
      .catch(() => {})
  },
}

export default actions
