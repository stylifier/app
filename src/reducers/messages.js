const messages = (
  state = {
    messages: [],
    threads: [],
    threadLoading: false,
    messagesLoading: false,
    pagination: 0 },
  action) => {
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

    default:
      break
  }

  return state
}

export default messages
