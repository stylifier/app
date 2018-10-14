const followers = (state = { followers: [], loading: false }, action) => {
  switch (action.type) {
    case 'LOADING_FOLLOWERS_FETCH':
      return { ...state, loading: true }

    case 'FINISHED_FOLLOWERS_FETCH':
      return { ...state, loading: false }

    case 'SET_FOLLOWERS':
      return { ...state, followers: action.payload.data, loading: false }

    default:
      break
  }

  return state
}

export default followers
