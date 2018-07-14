const user = (state = {}, action) => {
  console.log('==>>', action);
  switch (action.type) {
    case 'USER_INITIATED':
      return Object.assign({}, action.payload)
      break
  }
  return state
}

export default user
