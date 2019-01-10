import { AsyncStorage, Alert } from 'react-native'
import { NavigationActions } from 'react-navigation'
import actions from '.'

export default {
  loadCachedConversation: () => (dispatch) => {
    AsyncStorage.getItem('conversations')
      .then((cached) => {
        const conversations = JSON.parse(cached)
        dispatch({ type: 'ADD_CONVERSATIONS', payload: conversations })
      })
  },

  saveCachedConversations: () => (dispatch, getState) => {
    const { conversation } = getState()

    AsyncStorage.setItem('conversations', JSON.stringify(conversation))
  },

  sendImageMessage: (threadId, image) => (dispatch) => {
    dispatch({ type: 'MESSAGING_UPLOADING_IMAGE' })
    actions.api.uploadImage(image)
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
      actions.api.createThread(thread.to.username)
        .then(tr => actions.api.createMessage(tr.id, text, media, products).then(() => tr))
        .then(tr => dispatch(actions.setSelectedThreadId(tr.id, true)))
        .catch(() => Alert.alert('Ops... Something went wrong, please try again later.'))
      return
    }

    actions.api.createMessage(threadId, text, media, products)
      .then(() => dispatch(actions.fetchTopMessages(threadId)))
      .catch(() => {})
  },

  fetchButtomMessages: (threadId) => (dispatch, getState) => {
    const { conversation } = getState()

    dispatch(actions.loadCachedConversation())
    dispatch({ type: 'LOADING_CONVERSATION_FETCH', threadId })
    actions.api.fetchMessages(threadId, conversation[threadId].pagination)
      .then((msgs) => {
        dispatch({ type: 'ADD_BOTTOM_CONVERSATION', payload: msgs, threadId })
        dispatch({ type: 'FINISHED_CONVERSATION_FETCH', threadId })
        setTimeout(() => dispatch(actions.saveCachedConversations()), 2000)
      })
      .catch(() => dispatch({ type: 'FINISHED_CONVERSATION_FETCH', threadId }))
  },

  fetchTopMessages: (threadId) => (dispatch) => {
    dispatch(actions.loadCachedConversation())
    dispatch({ type: 'LOADING_CONVERSATION_FETCH', threadId })
    actions.api.fetchMessages(threadId)
      .then((msgs) => {
        dispatch({ type: 'ADD_TOP_CONVERSATION', payload: msgs, threadId })
        dispatch({ type: 'FINISHED_CONVERSATION_FETCH', threadId })
        dispatch(actions.removeUnreadThread(threadId))
        setTimeout(() => dispatch(actions.saveCachedConversations()), 2000)
      })
      .catch(() => dispatch({ type: 'FINISHED_CONVERSATION_FETCH', threadId }))
  },

  fetchMessages: (threadId) => (dispatch) => {
    dispatch(actions.loadCachedConversation())
    dispatch({ type: 'LOADING_CONVERSATION_FETCH', threadId })
    actions.api.fetchMessages(threadId)
      .then((msgs) => {
        dispatch({ type: 'REFERESH_CONVERSATION', payload: msgs, threadId })
        dispatch({ type: 'FINISHED_CONVERSATION_FETCH', threadId })
        dispatch(actions.removeUnreadThread(threadId))
        setTimeout(() => dispatch(actions.saveCachedConversations()), 2000)
      })
      .catch(() => dispatch({ type: 'FINISHED_CONVERSATION_FETCH', threadId }))
  },

  openConversation: (threadId) => (dispatch, getState) => {
    const { messages, user } = getState()

    const selectedThread = messages.threads.filter(t => t.id === threadId)[0]
    const isFromMe = selectedThread.from.username === user.username

    const title = isFromMe ? selectedThread.to.full_name : selectedThread.from.full_name

    dispatch({ type: 'SET_SELECTED_THREAD_ID', payload: threadId })
    dispatch(NavigationActions.navigate({ routeName: 'Conversation', params: { title } }))
  },
}
