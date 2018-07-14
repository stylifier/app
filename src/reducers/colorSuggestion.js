const colorSuggestion = (state = {}, action) => {
  let newState = Object.assign({}, state)

  switch (action.type) {
    case 'COLOR_SUGGESTION_IMAGE_PICKED':
      newState = Object.assign({},{localImage: action.payload.image})
      break

    case 'COLOR_SUGGESTION_IMAGE_UPLOADED':
      newState = Object.assign({}, newState, {remoteImage: action.payload})
      break

    case 'UPDATE_COLOR_PALLET_SUGGESTION':
      newState = Object.assign({}, newState, {colorPalletRecommendation: action.payload})
      break
  }

  return newState
}

export default colorSuggestion
