import { NavigationActions } from 'react-navigation'
import { AsyncStorage, Alert } from 'react-native'
import moment from 'moment'
import API from '../common/API'

const { btoa } = require('Base64')
const DeviceInfo = require('react-native-device-info')

const api = new API()

const setTokenAndUserInfo = (token) => {
  api.setToken(token)
  return api.fetchUserInfo()
    .then((info) =>
      AsyncStorage.setItem('user_info', JSON.stringify(info))
        .then(() => info))
}

const deviceNameSafe = `m_g_i_o_s_${
  btoa(unescape(encodeURIComponent(DeviceInfo.getUniqueID())))
    .replace(/=/g, '')
    .toLowerCase()}`

const actions = {
  updateStyles: (q) => (dispatch) => {
    api.getStyles(q)
      .then((r) => {
        dispatch({ type: 'UPDATE_STYLES', payload: r })
      })
      .catch(() => {})
  },

  setProfilePicture: (media) => (dispatch) => {
    api.setProfilePicture(media)
      .then(() => dispatch(actions.fetchUserInfo(media.userUsername)))
      .catch(() => {})
  },

  addProductToMedia: (product, mediaId) => () => {
    api.addProductToMedia(product, mediaId)
      .then(() => {})
      .catch(() => {})
  },

  setDescription: (id, description) => () => {
    api.addDescriptionToMedia(id, description)
      .then(() => {})
      .catch(() => {})
  },

  setStyle: (id, style) => () => {
    api.setStyle(id, style)
      .then(() => {})
      .catch(() => {})
  },

  unshareMedia: (media) => (dispatch) => {
    api.unshareMedia(media.id)
      .then(() => dispatch(actions.fetchUserMedia(media.userUsername)))
      .catch(() => {
        Alert.alert('Ops... Something went wrong, please try again later.')
      })
  },

  shareMedia: (media) => (dispatch) => {
    api.shareMedia(media.id)
      .then(() => {
        dispatch(actions.moveToPage('Profile'))
        dispatch(actions.fetchUserMedia(media.userUsername))
      })
      .catch(() => {
        Alert.alert('Ops... Something went wrong, please try again later.')
      })
  },

  attemptToCreateNewThread: (to) => (dispatch, getState) => {
    const { user, messages } = getState()

    dispatch({
      type: 'GET_MORE_THREADS',
      payload: {
        data: [{
          id: 'new',
          to,
          from: user,
        }],
        pagination: messages.pagination,
      },
    })
    dispatch({ type: 'CLEAR_MESSAGES' })
    dispatch(actions.moveToPage('Messages'))
    dispatch(actions.setSelectedThreadId('new'))
  },

  reportCreateOutfitIssues: (payload) => () => {
    api.report(Object.assign(payload, { type: 'CreateOutfit' }))
      .then(() =>
        Alert.alert('Thanks for reporting the issue, we will resolve it as soon as possible.'))
      .catch(() => {
        Alert.alert('Ops... Something went wrong, please try again later.')
      })
  },

  fetchUserFollowers: (username) => (dispatch, getState) => {
    const { user } = getState()
    dispatch({ type: 'LOADING_FOLLOWERS_FETCH' })

    api.fetchUserFollowers(username)
      .then((r) => {
        if (user.username === username) {
          dispatch({ type: 'SET_FOLLOWERS', payload: { ...r } })
        } else {
          dispatch({ type: 'ADD_USER_FOLLOWERS', payload: { ...r, username } })
        }

        dispatch({ type: 'FINISHED_FOLLOWERS_FETCH' })
      })
      .catch(() => dispatch({ type: 'FINISHED_FOLLOWERS_FETCH' }))
  },

  followUser: (username) => (dispatch, getState) => {
    const { user } = getState()
    dispatch({ type: 'LOADING_FOLLOWERS_FETCH' })

    api.followUser(username)
      .then(() => {
        dispatch(actions.fetchUserFollowers(username))
        dispatch(actions.fetchUserFollowers(user.username))
      })
      .catch(() => dispatch({ type: 'FINISHED_FOLLOWERS_FETCH' }))
  },

  fetchFeeds: () => (dispatch, getState) => {
    const { feeds } = getState()
    if (feeds.loading) {
      return
    }

    dispatch({ type: 'LOADING_TOP_FEEDS_FETCH' })

    api.fetchFeeds(0)
      .then((r) => dispatch({ type: 'SET_FEEDS', payload: r }))
      .catch(() => dispatch({ type: 'FINISH_TOP_FEEDS_FETCH' }))
  },

  fetchMoreFeeds: () => (dispatch, getState) => {
    const { feeds } = getState()

    if (feeds.noMore || feeds.loading) {
      return
    }

    dispatch({ type: 'LOADING_BOTTOM_FEEDS_FETCH' })

    api.fetchFeeds(feeds.pagination)
      .then((r) => dispatch({ type: 'ADD_MORE_FEEDS', payload: r }))
      .catch(() => dispatch({ type: 'FINISH_BOTTOM_FEEDS_FETCH' }))
  },

  fetchUserInfo: (username) => (dispatch) => {
    api.fetchUser(username)
      .then((r) => dispatch({ type: 'ADD_USER_INFO', payload: r }))
      .catch(() => {})
  },

  fetchUserMedia: (username) => (dispatch) => {
    api.fetchUserMedia(username, 0)
      .then((r) => dispatch({ type: 'ADD_USER_MEDIA', payload: { ...r, username } }))
      .catch(() => {})
  },

  setFeedsSearchPhrase: (phrase) => (dispatch) => {
    dispatch({ type: 'SET_SEARCH_PHRASE', payload: phrase })

    api.searchMedia(phrase, 0)
      .then((r) => dispatch({ type: 'SET_STYLE_SEARCH_RESULT', payload: r }))
      .catch(() => dispatch({
        type: 'SET_STYLE_SEARCH_RESULT',
        payload: { data: [], pagination: 0 },
      }))

    api.fetchBrands(phrase, 0)
      .then((r) => dispatch({ type: 'SET_BRAND_SEARCH_RESULT', payload: r }))
      .catch(() => dispatch({
        type: 'SET_BRAND_SEARCH_RESULT',
        payload: { data: [], pagination: 0 },
      }))

    api.fetchUsers(phrase, 0)
      .then((r) => dispatch({ type: 'SET_USER_SEARCH_RESULT', payload: r }))
      .catch(() => dispatch({
        type: 'SET_USER_SEARCH_RESULT',
        payload: { data: [], pagination: 0 },
      }))
  },

  clearFeedsSearchPhrase: () => (dispatch) => {
    dispatch({ type: 'CLEAR_SEARCH_PHRASE' })
  },

  addUnreadThread: (threadId) => (dispatch) => {
    dispatch({ type: 'ADD_UNREAD_THREAD', payload: threadId })
  },

  removeUnreadThread: (threadId) => (dispatch) => {
    dispatch({ type: 'REMOVE_UNREAD_THREAD', payload: threadId })
  },

  addSubsctiption: (id) => () => {
    AsyncStorage.setItem('subscription_id', id)
      .then(() => api.addSubsctiption(id, 'IOS_NOTIFICATION'))
      .then(() => {})
      .catch(() => {})
  },

  refereshUserInfo: () => (dispatch) => {
    api.fetchUserInfo()
      .then((info) =>
        AsyncStorage.setItem('user_info', JSON.stringify(info))
          .then(() => dispatch({
            type: 'REFERESH_USER_INFO',
            payload: { ...info },
          }))
          .catch(() => {}))
      .catch(() => {})
  },

  sendImageMessage: (threadId, image) => (dispatch) => {
    dispatch({ type: 'MESSAGING_UPLOADING_IMAGE' })
    api.uploadImage(image)
      .then(imageMetaDate => {
        dispatch(actions.createMessage(threadId, '', [imageMetaDate]))
        dispatch({ type: 'MESSAGING_FINISHED_UPLOADING_IMAGE' })
      })
      .catch(() => {})
  },

  createMessage: (threadId, text, media, products) => (dispatch, getState) => {
    if (threadId === 'new') {
      const { messages } = getState()
      const thread = messages.threads.filter(t => t.id === threadId)[0]
      api.createThread(thread.to.username)
        .then(tr => api.createMessage(tr.id, text, media, products).then(() => tr))
        .then(tr => dispatch(actions.setSelectedThreadId(tr.id, true)))
        .catch(() => Alert.alert('Ops... Something went wrong, please try again later.'))
      return
    }

    api.createMessage(threadId, text, media, products)
      .then(() => dispatch(actions.fetchTopMessages(threadId)))
      .catch(() => {})
  },

  fetchButtomMessages: (threadId) => (dispatch, getState) => {
    const { messages } = getState()

    dispatch({ type: 'LOADING_MESSAGES_FETCH' })
    api.fetchMessages(threadId, messages.messagesPagination)
      .then((msgs) => {
        dispatch({ type: 'ADD_BOTTOM_MESSAGES', payload: msgs })
        dispatch({ type: 'FINISHED_MESSAGES_FETCH' })
      })
      .catch(() => dispatch({ type: 'FINISHED_MESSAGES_FETCH' }))
  },

  fetchTopMessages: (threadId) => (dispatch) => {
    dispatch({ type: 'LOADING_MESSAGES_FETCH' })
    api.fetchMessages(threadId)
      .then((msgs) => {
        dispatch({ type: 'ADD_TOP_MESSAGES', payload: msgs })
        dispatch({ type: 'FINISHED_MESSAGES_FETCH' })
        dispatch(actions.removeUnreadThread(threadId))
      })
      .catch(() => dispatch({ type: 'FINISHED_MESSAGES_FETCH' }))
  },

  fetchMessages: (threadId) => (dispatch) => {
    dispatch({ type: 'LOADING_MESSAGES_FETCH' })
    dispatch({ type: 'CLEAR_MESSAGES' })
    api.fetchMessages(threadId)
      .then((msgs) => {
        dispatch({ type: 'REFERESH_MESSAGES', payload: msgs })
        dispatch({ type: 'FINISHED_MESSAGES_FETCH' })
        dispatch(actions.removeUnreadThread(threadId))
      })
      .catch(() => dispatch({ type: 'FINISHED_MESSAGES_FETCH' }))
  },

  clearSelectedThreadId: () => (dispatch) => {
    dispatch({ type: 'CLEAR_MESSAGES' })
    dispatch({ type: 'SET_SELECTED_THREAD_ID', payload: false })
  },

  openConversation: (threadId) => (dispatch, getState) => {
    const { messages, user } = getState()

    const selectedThread = messages.threads.filter(t => t.id === threadId)[0]
    const isFromMe = selectedThread.from.username === user.username

    const title = isFromMe ? selectedThread.to.full_name : selectedThread.from.full_name

    dispatch({ type: 'SET_SELECTED_THREAD_ID', payload: threadId })
    dispatch(NavigationActions.navigate({ routeName: 'Conversation', params: { title } }))
  },

  setSelectedThreadId: (threadId, isRefetchThreadsFirst) => (dispatch) => {
    dispatch(actions.clearSelectedThreadId())

    if (!isRefetchThreadsFirst) dispatch(actions.openConversation(threadId))
    dispatch({ type: 'LOADING_THREAD_FETCH' })
    return api.fetchThreads(undefined, 0)
      .then((tds) => {
        dispatch(actions.fetchTopMessages(threadId))
        dispatch({ type: 'GET_MORE_THREADS', payload: tds })
        dispatch({ type: 'FINISHED_THREAD_FETCH' })
        dispatch(actions.updateUnreadThreads(tds.data))
        if (isRefetchThreadsFirst) dispatch(actions.openConversation(threadId))
      })
      .catch(() => dispatch({ type: 'FINISHED_THREAD_FETCH' }))
  },

  updateUnreadThreads: (threads) => (dispatch, getState) => {
    const { user } = getState()

    threads.forEach(thread => {
      const isFromMe = thread.from.username === user.username

      if (isFromMe &&
        moment(thread.to_last_message_at) > moment(thread.from_last_message_read_at)) {
        dispatch(actions.addUnreadThread(thread.id))
      }

      if (!isFromMe &&
        moment(thread.from_last_message_at) > moment(thread.to_last_message_read_at)) {
        dispatch(actions.addUnreadThread(thread.id))
      }
    })
  },

  getMoreThreads: () => (dispatch, getState) => {
    const { messages } = getState()

    if (messages.threadLoading) { return }

    dispatch({ type: 'LOADING_THREAD_FETCH' })
    api.fetchThreads(undefined, messages.pagination)
      .then((tds) => {
        dispatch({ type: 'GET_MORE_THREADS', payload: tds })
        dispatch({ type: 'FINISHED_THREAD_FETCH' })
        dispatch(actions.updateUnreadThreads(tds.data))
      })
      .catch(() => dispatch({ type: 'FINISHED_THREAD_FETCH' }))
  },

  refetchTopThreads: () => (dispatch) => {
    dispatch({ type: 'LOADING_REFETCH_TOP_THREADS' })
    api.fetchThreads(undefined, 0)
      .then((tds) => {
        dispatch({ type: 'REFETCH_TOP_THREADS', payload: tds })
        dispatch(actions.updateUnreadThreads(tds.data))
      })
      .catch(() => dispatch({ type: 'FINISH_LOADING_REFETCH_TOP_THREADS' }))
  },

  moveToPage: (page, params) => (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: page, params: { ...params } }))
  },

  goBack: () => (dispatch) => {
    dispatch(NavigationActions.back())
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
      .catch(() => {})
  },

  refreshBookmarks: (addToRecoms) => (dispatch) => {
    AsyncStorage.getItem('color_bookmarks')
      .then((bms) => bms && dispatch({
        type: 'UPDATE_COLOR_PALLET_BOOKMARKS',
        payload: [...JSON.parse(bms)],
      }))
      .catch(() => {})

    api.getColorPalletBookmarks()
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
        AsyncStorage.setItem('color_bookmarks', JSON.stringify(pallets.data))
      })
      .catch(() => {})

    AsyncStorage.getItem('product_bookmarks')
      .then((bms) => bms && dispatch({
        type: 'UPDATE_PRODUCT_BOOKMARKS',
        payload: [...JSON.parse(bms)],
      }))
      .catch(() => {})

    api.getProductBookmarks()
      .then(p => {
        dispatch({
          type: 'UPDATE_PRODUCT_BOOKMARKS',
          payload: [...p.data],
        })
        AsyncStorage.setItem('product_bookmarks', JSON.stringify(p.data))
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

    api.fetchColorCodes()
      .then(data => {
        dispatch({
          type: 'UPDATE_COLOR_CODE',
          payload: [...data],
        })
        AsyncStorage.setItem('color_code', JSON.stringify(data))
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

    api.fetchCategories()
      .then(data => {
        dispatch({
          type: 'UPDATE_CATEGORIES',
          payload: [...data],
        })
        AsyncStorage.setItem('categories', JSON.stringify(data))
      })
      .catch(() => {})
  },

  deleteBookmarkedColorPallet: (palletId) => (dispatch) => {
    api.deleteBookmarkedColorPallet(palletId)
      .then(() => dispatch(actions.refreshBookmarks()))
      .catch(() => {})
  },

  bookmarkColorPallet: (palletId, title) => (dispatch) => {
    api.bookmarkColorPallet(palletId, title)
      .then(() => dispatch(actions.refreshBookmarks()))
      .catch(() => {})
  },

  createColorPallet: (mediaId, code) => (dispatch) => {
    api.createColorPallet(code)
      .then((r) => api.bookmarkColorPallet(r.id))
      .then(() => api.setColorCode(code))
      .then(() => dispatch(actions.refreshBookmarks(true)))
      .then(() => setTimeout(() => Alert.alert(
        'Color Pallet Created',
        'And added to your bookmarks',
        [
          { text: 'Dismiss', onPress: () => {} },
        ],
        { cancelable: false }
      ), 1000))
      .catch(() => {
        Alert.alert('Ops... Something went wrong, please try again later.')
      })
  },

  deleteBookmarkedProduct: (productId, palletId) => (dispatch) => {
    api.deleteBookmarkedProduct(productId, palletId)
      .then(() => dispatch(actions.refreshBookmarks()))
      .catch(() => {})
  },

  bookmarkProduct: (productId, palletId, title) => (dispatch) => {
    api.bookmarkProduct(productId, palletId, title)
      .then(() => dispatch(actions.refreshBookmarks()))
      .catch(() => {})
  },

  fetchProducts: (q) => (dispatch) => {
    dispatch({ type: 'LOADING_PRODUCT_SUGGESTION', payload: { key: JSON.stringify(q) } })

    api.fetchProducts(q)
      .then(products => {
        dispatch({
          type: 'RENEW_PRODUCT_SUGGESTION',
          payload: {
            items: [...products.data],
            pagination: products.pagination,
            queries: { ...q },
            key: JSON.stringify(q),
          },
        })
      })
      .catch(() => {})
  },

  fetchMoreProducts: (q) => (dispatch, getState) => {
    const { productSuggestion } = getState()
    const key = JSON.stringify(q)

    console.log(productSuggestion)

    if (!productSuggestion[key] ||
      productSuggestion[key].loading ||
      productSuggestion[key].finished) {
      return
    }

    console.log('===??', productSuggestion)

    dispatch({ type: 'LOADING_PRODUCT_SUGGESTION', payload: { key: JSON.stringify(q) } })

    api.fetchProducts(q, productSuggestion[key].pagination)
      .then(products => {
        dispatch({
          type: 'ADD_TO_PRODUCT_SUGGESTION',
          payload: {
            items: [...products.data],
            pagination: products.pagination,
            key: JSON.stringify(q),
          },
        })
      })
      .catch(() => {})
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
      .catch(() => {})
  },

  userInitiated: (info) => (dispatch) => {
    dispatch({ type: 'USER_INITIATED', payload: info })
    dispatch({ type: 'ADD_USER_INFO', payload: info })
    dispatch({ type: 'CLEAR_FEEDS' })
    dispatch({ type: 'CLEAR_SEARCH_PHRASE' })
    dispatch({ type: 'CLEAR_THREADS' })
    dispatch(actions.refreshBookmarks())
    dispatch(actions.refreshCategories())
    dispatch(actions.refreshColorCode())
    dispatch(actions.getMoreThreads())
    dispatch(actions.fetchUserFollowers(info.username))
    dispatch(actions.fetchFeeds())

    AsyncStorage.getItem('subscription_id')
      .then((sid) => sid && dispatch(actions.addSubsctiption(sid)))
      .catch(() => {})
  },

  loginUser: (username, password) => (dispatch) => {
    dispatch({ type: 'LOGGING_IN' })

    api.login({ username, password })
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
      username,
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
      .catch(() => {})
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
              username: deviceNameSafe.replace('m_g_i_o_s_', ''),
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
      .catch(() => {})
  },
}

export default actions
