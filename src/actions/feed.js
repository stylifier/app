import { AsyncStorage } from 'react-native'
import actions from '.'

export default {
  loadCachedFeeds: () => (dispatch) => {
    AsyncStorage.getItem('feeds')
      .then((cached) => {
        if (!cached) return
        const feeds = JSON.parse(cached)
        dispatch({ type: 'SET_FEEDS', payload: { data: [...feeds], pagination: 0 } })
      })
  },

  saveCachedFeeds: () => (dispatch, getState) => {
    const { feeds } = getState()
    if (!feeds) return
    AsyncStorage.setItem('feeds', JSON.stringify(feeds.items))
  },

  fetchFeeds: () => (dispatch, getState) => {
    const { feeds } = getState()
    if (feeds.loading) {
      return
    }

    dispatch(actions.loadCachedFeeds())
    dispatch({ type: 'LOADING_TOP_FEEDS_FETCH' })

    actions.api.fetchFeeds(0)
      .then((r) => {
        dispatch({ type: 'SET_FEEDS', payload: r })
        setTimeout(() => dispatch(actions.saveCachedFeeds()), 2000)
      })
      .catch(() => dispatch({ type: 'FINISH_TOP_FEEDS_FETCH' }))
  },

  fetchMoreFeeds: () => (dispatch, getState) => {
    const { feeds } = getState()

    if (feeds.noMore || feeds.loading) {
      return
    }

    dispatch(actions.loadCachedFeeds())
    dispatch({ type: 'LOADING_BOTTOM_FEEDS_FETCH' })

    actions.api.fetchFeeds(feeds.pagination)
      .then((r) => {
        dispatch({ type: 'ADD_MORE_FEEDS', payload: r })
        setTimeout(() => dispatch(actions.saveCachedFeeds()), 2000)
      })
      .catch(() => dispatch({ type: 'FINISH_BOTTOM_FEEDS_FETCH' }))
  },

  setFeedsSearchPhrase: (phrase) => (dispatch) => {
    dispatch({ type: 'SET_SEARCH_PHRASE', payload: phrase })

    actions.api.searchMedia(phrase, 0)
      .then((r) => dispatch({ type: 'SET_STYLE_SEARCH_RESULT', payload: r }))
      .catch(() => dispatch({
        type: 'SET_STYLE_SEARCH_RESULT',
        payload: { data: [], pagination: 0 },
      }))

    actions.api.fetchBrands(phrase, 0)
      .then((r) => dispatch({ type: 'SET_BRAND_SEARCH_RESULT', payload: r }))
      .catch(() => dispatch({
        type: 'SET_BRAND_SEARCH_RESULT',
        payload: { data: [], pagination: 0 },
      }))

    actions.api.fetchUsers(phrase, 0)
      .then((r) => dispatch({ type: 'SET_USER_SEARCH_RESULT', payload: r }))
      .catch(() => dispatch({
        type: 'SET_USER_SEARCH_RESULT',
        payload: { data: [], pagination: 0 },
      }))
  },

  clearFeedsSearchPhrase: () => (dispatch) => {
    dispatch({ type: 'CLEAR_SEARCH_PHRASE' })
  },
}
