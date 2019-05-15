import { AsyncStorage, Alert } from 'react-native'
import deviceNameSafe from '../common/deviceNameSafe'
import actions from '.'

export default {
  addSubsctiption: (id) => () => {
    AsyncStorage.setItem('subscription_id', id)
      .then(() => actions.api.addSubsctiption(id, 'IOS_NOTIFICATION'))
      .then(() => {})
      .catch(() => {})
  },

  setTokenAndUserInfo: (token) => {
    actions.api.setToken(token)
    return actions.api.fetchUserInfo()
      .then((info) =>
        AsyncStorage.setItem('user_info', JSON.stringify(info))
          .then(() => info))
  },

  fetchUserInfo: (username) => (dispatch) => {
    actions.api.fetchUser(username)
      .then((r) => dispatch({ type: 'ADD_USER_INFO', payload: r }))
      .catch(() => {})
  },

  followUser: (username) => (dispatch, getState) => {
    const { user } = getState()
    dispatch({ type: 'LOADING_FOLLOWERS_FETCH' })

    actions.api.followUser(username)
      .then(() => {
        dispatch(actions.fetchUserFollowers(username))
        dispatch(actions.fetchUserFollowers(user.username))
      })
      .catch(() => dispatch({ type: 'FINISHED_FOLLOWERS_FETCH' }))
  },

  fetchUserFollowers: (username) => (dispatch, getState) => {
    const { user } = getState()
    dispatch({ type: 'LOADING_FOLLOWERS_FETCH' })

    actions.api.fetchUserFollowers(username)
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

  refereshUserInfo: () => (dispatch) => {
    actions.api.fetchUserInfo()
      .then((info) =>
        AsyncStorage.setItem('user_info', JSON.stringify(info))
          .then(() => dispatch({
            type: 'REFERESH_USER_INFO',
            payload: { ...info },
          }))
          .catch(() => {}))
      .catch(() => {})
  },

  registerInstagramUser: (instagram_code) => (dispatch, getState) => {
    dispatch({ type: 'REGISTERING_USER' })

    actions.api.register({ instagram_code })
      .then(token => actions.setTokenAndUserInfo(token))
      .then(info =>
        Promise.all(getState()
          .bookmarks.reverse()
          .map(cp => actions.api.bookmarkColorPallet(cp.id, cp.title)))
          .then(() => info)
          .catch(() => info))
      .then(info => dispatch(actions.userInitiated(info)))
      .catch(e => dispatch({ type: 'USER_REGISTRATION_FAILED', payload: e }))
  },

  registerUser: (username, password, email, fullname) => (dispatch, getState) => {
    dispatch({ type: 'REGISTERING_USER' })

    actions.api.register({
      username,
      password,
      email,
      full_name: fullname,
      invite_code: deviceNameSafe,
    })
      .then(token => actions.setTokenAndUserInfo(token))
      .then(info =>
        Promise.all(getState()
          .bookmarks.reverse()
          .map(cp => actions.api.bookmarkColorPallet(cp.id, cp.title)))
          .then(() => info)
          .catch(() => info))
      .then(info => dispatch(actions.userInitiated(info)))
      .catch(e => dispatch({ type: 'USER_REGISTRATION_FAILED', payload: e }))
  },

  loginUser: (username, password) => (dispatch) => {
    dispatch({ type: 'LOGGING_IN' })

    actions.api.login({ username, password })
      .then(token =>
        actions.setTokenAndUserInfo(token)
          .then(info => dispatch(actions.userInitiated(info))))
      .catch(e => {
        dispatch({ type: 'LOGIN_FAILED', payload: e })
      })
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
    dispatch(actions.getOutfits())

    AsyncStorage.getItem('subscription_id')
      .then((sid) => sid && dispatch(actions.addSubsctiption(sid)))
      .catch(() => {})
  },

  askForApproval: (metadata) => () => {
    actions.api.askForApproval(metadata)
      .then(() =>
        AsyncStorage.setItem('guest_submitted', 'true'))
      .then(() =>
        Alert.alert('Thanks for your submission. We will inform you when your account is ready.'))
      .catch(() =>
        Alert.alert('Ops... Something went wrong, please try again later.'))
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

        return actions.api.login({
          username: deviceNameSafe,
          password: deviceNameSafe,
        })
          .then(token =>
            actions.setTokenAndUserInfo(token)
              .then(i => dispatch(actions.userInitiated(i))))
          .catch(e => {
            if (e.message !== '401') {
              return
            }

            actions.api.register({
              username: deviceNameSafe.replace('m_g_i_o_s_', ''),
              password: deviceNameSafe,
              email: `${deviceNameSafe}@guest.guest`,
              full_name: deviceNameSafe,
              invite_code: deviceNameSafe,
            })
              .then(token => actions.setTokenAndUserInfo(token))
              .then(i => dispatch(actions.userInitiated(i)))
              .catch(err => dispatch({ type: 'USER_INITIATION_FAILED', payload: err }))
          })
      })
      .catch(() => {})
  },
}
