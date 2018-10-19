const feeds = (state = {
  items: [],
  pagination: 0,
  loadingBottom: false,
  loadingTop: false,
  noMore: false,
}, action) => {
  switch (action.type) {
    case 'LOADING_TOP_FEEDS_FETCH':
      return {
        ...state,
        loadingTop: true,
      }

    case 'LOADING_BOTTOM_FEEDS_FETCH':
      return {
        ...state,
        loadingBottom: true,
      }

    case 'FINISH_BOTTOM_FEEDS_FETCH':
      return {
        ...state,
        loadingBottom: false,
      }

    case 'FINISH_TOP_FEEDS_FETCH':
      return {
        ...state,
        loadingTop: false,
      }

    case 'SET_FEEDS':
      return {
        ...state,
        items: [
          ...action.payload.data.filter(m =>
            state.items.filter(t => t.id === m.id).length === 0),
          ...state.items,
        ],
        pagination: action.payload.pagination,
        loadingTop: false,
        noMore: action.payload.data.length === 0,
      }

    case 'ADD_MORE_FEEDS':
      return {
        ...state,
        items: [
          ...state.items,
          ...action.payload.data.filter(m =>
            state.items.filter(t => t.id === m.id).length === 0),
        ],
        pagination: action.payload.pagination,
        loadingBottom: false,
        noMore: action.payload.data.length === 0,
      }

    case 'CLEAR_FEEDS':
      return {
        ...state,
        items: [],
        pagination: 0,
        loadingBottom: false,
        loadingTop: false,
        noMore: false,
      }

    default:
      break
  }

  return state
}

export default feeds
