import { AsyncStorage } from 'react-native'
import moment from 'moment'
import actions from '.'

export default {
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
    dispatch(actions.moveToPage('Messages'))
    dispatch(actions.setSelectedThreadId('new'))
  },

  addUnreadThread: (threadId) => (dispatch) => {
    dispatch({ type: 'ADD_UNREAD_THREAD', payload: threadId })
  },

  removeUnreadThread: (threadId) => (dispatch) => {
    dispatch({ type: 'REMOVE_UNREAD_THREAD', payload: threadId })
  },

  clearSelectedThreadId: () => (dispatch) => {
    dispatch({ type: 'SET_SELECTED_THREAD_ID', payload: false })
  },

  setSelectedThreadId: (threadId, isRefetchThreadsFirst) => (dispatch) => {
    dispatch(actions.clearSelectedThreadId())

    if (!isRefetchThreadsFirst) dispatch(actions.openConversation(threadId))
    dispatch({ type: 'LOADING_THREAD_FETCH' })
    dispatch(actions.loadCachedThreads())
    dispatch(actions.loadCachedConversation())
    return actions.api.fetchThreads(undefined, 0)
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

  loadCachedThreads: () => (dispatch) => {
    AsyncStorage.getItem('threads')
      .then((cached) => {
        if (!cached) return
        dispatch({ type: 'GET_MORE_THREADS', payload: JSON.parse(cached) })
        dispatch(actions.updateUnreadThreads(JSON.parse(cached).data))
      })
  },

  saveCachedThreads: () => (dispatch, getState) => {
    const { messages: m } = getState()

    AsyncStorage.setItem('threads', JSON.stringify({
      data: m.threads,
      pagination: m.pagination
    }))
  },

  getMoreThreads: () => (dispatch, getState) => {
    const { messages } = getState()

    if (messages.threadLoading) { return }

    dispatch(actions.loadCachedThreads())
    dispatch({ type: 'LOADING_THREAD_FETCH' })

    actions.api.fetchThreads(undefined, messages.pagination)
      .then((tds) => {
        dispatch({ type: 'GET_MORE_THREADS', payload: tds })
        dispatch({ type: 'FINISHED_THREAD_FETCH' })
        dispatch(actions.updateUnreadThreads(tds.data))
        setTimeout(() => dispatch(actions.saveCachedThreads()), 2000)
      })
      .catch(() => dispatch({ type: 'FINISHED_THREAD_FETCH' }))
  },

  refetchTopThreads: () => (dispatch) => {
    dispatch({ type: 'LOADING_REFETCH_TOP_THREADS' })
    actions.api.fetchThreads(undefined, 0)
      .then((tds) => {
        dispatch({ type: 'REFETCH_TOP_THREADS', payload: tds })
        dispatch(actions.updateUnreadThreads(tds.data))
        setTimeout(() => dispatch(actions.saveCachedThreads()), 2000)
      })
      .catch(() => dispatch({ type: 'FINISH_LOADING_REFETCH_TOP_THREADS' }))
  },
}
