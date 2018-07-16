const colorSuggestion = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_COLOR_PALLET_BOOKMARKS':
      return [...action.payload]

    default:
      break
  }

  return state
}

export default colorSuggestion
