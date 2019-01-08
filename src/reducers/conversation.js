const conversation = (state = {}, action) => {
  switch (action.type) {
    case 'LOADING_CONVERSATION_FETCH':
      return {
        ...state,
        [action.threadId]: {
          ...state[action.threadId],
          loading: true
        }
      }

    case 'FINISHED_CONVERSATION_FETCH':
      return {
        ...state,
        [action.threadId]: {
          ...state[action.threadId],
          loading: false
        }
      }

    case 'CLEAR_CONVERSATION':
      return {
        ...state,
        [action.threadId]: {
          ...state[action.threadId],
          data: []
        }
      }

    case 'REFERESH_CONVERSATION':
      return {
        ...state,
        [action.threadId]: {
          ...state[action.threadId],
          data: action.payload.data,
          pagination: action.payload.pagination,
        }
      }

    case 'ADD_TOP_CONVERSATION':
      return {
        ...state,
        [action.threadId]: {
          ...state[action.threadId],
          data: [
            ...action.payload.data.filter(m =>
              ((state[action.threadId] || {}).data || [])
                .filter(t => t.id === m.id).length === 0),
            ...((state[action.threadId] || {}).data || []),
          ],
        }
      }

    case 'ADD_BOTTOM_CONVERSATION':
      return {
        ...state,
        [action.threadId]: {
          ...state[action.threadId],
          data: [
            ...((state[action.threadId] || {}).data || []),
            ...action.payload.data.filter(m =>
              ((state[action.threadId] || {}).data || [])
                .filter(t => t.id === m.id).length === 0),
          ],
          pagination: action.payload.pagination,
        }
      }

    case 'ADD_CONVERSATIONS':
      return {
        ...state,
        ...action.payload,
      }

    default:
      break
  }

  return state
}

export default conversation
