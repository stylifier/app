const colorSuggestion = (state = { colorCodes: [], categories: [] }, action) => {
  switch (action.type) {
    case 'UPDATE_COLOR_CODE':
      return { ...state, colorCodes: action.payload }

    case 'UPDATE_CATEGORIES':
      return { ...state, categories: action.payload }

    default:
      break
  }

  return state
}

export default colorSuggestion
