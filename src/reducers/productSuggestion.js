const productSuggestion = (
  state = { pagination: 0, items: [], queries: {}, loading: false, finished: false }, action) => {
  switch (action.type) {
    case 'CLEAR_PRODUCT_SUGGESTION':
      return {
        pagination: 0,
        items: [],
        queries: {},
        loading: false,
      }

    case 'RENEW_PRODUCT_SUGGESTION':
      return {
        ...state,
        items: [...action.payload.items],
        pagination: action.payload.pagination,
        queries: action.payload.queries,
        loading: false,
        finished: action.payload.items.length <= 0,
      }

    case 'ADD_TO_PRODUCT_SUGGESTION':
      return {
        ...state,
        items: [...state.items, ...action.payload.items],
        pagination: action.payload.pagination,
        finished: action.payload.items.length <= 0,
        loading: false,
      }

    case 'LOADING_PRODUCT_SUGGESTION':
      return {
        ...state,
        loading: true,
      }

    default:
      break
  }

  return state
}

export default productSuggestion
