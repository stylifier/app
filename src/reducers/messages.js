const messages = (
  state = {
    messages: [],
    threads: [],
    threadLoading: false,
    selectedThreadId: undefined,
    messagesLoading: false,
    loadingTop: false,
    unreadThreadIds: [],
    pagination: 0 },
  action) => {
  switch (action.type) {
    case 'LOADING_REFETCH_TOP_THREADS':
      return {
        ...state,
        loadingTop: true,
      }

    case 'FINISH_LOADING_REFETCH_TOP_THREADS':
      return {
        ...state,
        loadingTop: false,
      }

    case 'GET_MORE_THREADS':
      return {
        ...state,
        threads: [
          ...state.threads.map(t => (action.payload.data.filter(i => i.id === t.id).length > 0 ?
            action.payload.data.filter(i => i.id === t.id)[0] : t)),
          ...action.payload.data.filter(m =>
            state.threads.filter(t => t.id === m.id).length === 0),
        ],
        pagination: action.payload.pagination,
      }

    case 'REFETCH_TOP_THREADS':
      return {
        ...state,
        threads: [
          ...action.payload.data.filter(m =>
            state.threads.filter(t => t.id === m.id).length === 0),
          ...state.threads.map(t => (
            action.payload.data.filter(i => i.id === t.id).length > 0 ?
              action.payload.data.filter(i => i.id === t.id)[0] : t)
          ),
        ],
        pagination: action.payload.pagination,
        loadingTop: false,
      }

    case 'CLEAR_THREADS':
      return {
        ...state,
        threads: [],
        pagination: 0,
        loadingTop: false,
      }

    case 'LOADING_THREAD_FETCH':
      return { ...state, threadLoading: true }

    case 'FINISHED_THREAD_FETCH':
      return { ...state, threadLoading: false }

    case 'ADD_UNREAD_THREAD':
      return { ...state, unreadThreadIds: [...new Set([...state.unreadThreadIds, action.payload])] }

    case 'REMOVE_UNREAD_THREAD':
      return {
        ...state,
        unreadThreadIds: [
          ...state.unreadThreadIds.slice(0, state.unreadThreadIds.indexOf(action.payload)),
          ...state.unreadThreadIds.slice(state.unreadThreadIds.indexOf(action.payload) + 1),
        ],
      }

    case 'SET_SELECTED_THREAD_ID':
      return {
        ...state,
        selectedThreadId: action.payload,
      }

    default:
      break
  }

  return state
}

export default messages
