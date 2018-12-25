const productSuggestion = (state = {}, action) => {
  if (!action.payload || !action.payload.key) return state

  switch (action.type) {
    case 'RENEW_PRODUCT_SUGGESTION':
      return {
        ...state,
        [action.payload.key]: {
          items: [...action.payload.items],
          pagination: action.payload.pagination,
          queries: action.payload.queries,
          loading: false,
          finished: action.payload.items.length <= 0,
        }
      }

    case 'ADD_TO_PRODUCT_SUGGESTION':
      return {
        ...state,
        [action.payload.key]: {
          items: [...state[action.payload.key].items, ...action.payload.items],
          pagination: action.payload.pagination,
          finished: action.payload.items.length <= 0,
          loading: false,
        }
      }

    case 'LOADING_PRODUCT_SUGGESTION':
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          loading: true,
          failed: false,
        }
      }

    case 'FAILED_PRODUCT_SUGGESTION':
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          loading: false,
          failed: true,
        }
      }

    default:
      break
  }

  return state
}

export default productSuggestion
