const colorSuggestion = (state = {}, action) => {
  let newState = { ...state }

  switch (action.type) {
    case 'COLOR_SUGGESTION_IMAGE_PICKED':
      newState = { ...{ localImage: action.payload.image } }
      break

    case 'COLOR_SUGGESTION_IMAGE_UPLOADED':
      newState = {
        ...newState,
        ...{ remoteImage: action.payload },
      }
      break

    case 'UPDATE_COLOR_PALLET_SUGGESTION':
      newState = {
        ...newState,
        ...{ colorPalletRecommendation: action.payload },
      }
      break

    case 'ADD_TOP_COLOR_PALLET_SUGGESTION':
      newState = {
        ...newState,
        ...{
          colorPalletRecommendation: [
            action.payload,
            ...state.colorPalletRecommendation,
          ],
        },
      }
      break

    case 'TOGGLE_SHARING_SCREEN_IN_PROCESS_IMAGE':
      newState = {
        ...newState,
        ...{ isSharingView: action.payload }
      }
      break

    default:
      break
  }

  return newState
}

export default colorSuggestion
