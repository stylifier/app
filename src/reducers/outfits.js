const colorSuggestion = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_OUTFITS':
      return [
        ...action.payload.filter(t => t)
      ]

    case 'UPDATE_OUTFIT':
      return [
        ...state.map(t => (t.id === action.payload.id ? action.payload : t))
      ]

    default:
      break
  }

  return state
}

export default colorSuggestion
