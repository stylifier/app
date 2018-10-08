const messages = (
  state = {
    messages: [],
    threads: [],
    threadLoading: false,
    selectedThreadId: undefined,
    messagesLoading: false,
    pagination: 0 },
  action) => {
  if (action.type.startsWith('Navigation')) {
    return { ...state, selectedThreadId: false }
  }

  switch (action.type) {
    case 'GET_MORE_THREADS':
      return { ...state, threads: action.payload.data, pagination: action.payload.pagination }

    case 'LOADING_THREAD_FETCH':
      return { ...state, threadLoading: true }

    case 'FINISHED_THREAD_FETCH':
      return { ...state, threadLoading: false }

    case 'LOADING_MESSAGES_FETCH':
      return { ...state, messagesLoading: false }

    case 'FINISHED_MESSAGES_FETCH':
      return { ...state, messagesLoading: false }

    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] }

    case 'REFERESH_MESSAGES':
      return {
        ...state,
        messages: action.payload.data,
        messagesPagination: action.payload.pagination,
      }

    case 'ADD_TOP_MESSAGES':
      return {
        ...state,
        messages: [
          ...action.payload.data.filter(m =>
            state.messages.filter(t => t.id === m.id).length === 0),
          ...state.messages,
        ],
      }

    case 'ADD_BOTTOM_MESSAGES':
      return {
        ...state,
        messages: [
          ...state.messages,
          ...action.payload.data.filter(m =>
            state.messages.filter(t => t.id === m.id).length === 0),
        ],
        messagesPagination: action.payload.pagination,
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
