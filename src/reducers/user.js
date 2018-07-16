const user = (state = {}, action) => {
  switch (action.type) {
    case 'USER_INITIATED':
      return { ...action.payload }

    default:
      break
  }
  return state
}

export default user
