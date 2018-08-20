const user = (state = {}, action) => {
  if (action.type.startsWith('Navigation')) {
    return { ...state, addMenuClosed: true }
  }

  switch (action.type) {
    case 'USER_INITIATED':
      return {
        ...action.payload,
        loggingIn: false,
        loginError: undefined,
        registering: false,
        registeringError: undefined,
        addMenuClosed: true,
      }

    case 'LOGGING_IN':
      return { ...state, loggingIn: true, loginError: undefined }

    case 'LOGIN_FAILED':
      return { ...state, loggingIn: undefined, loginError: action.payload }

    case 'REGISTERING_USER':
      return { ...state, registering: true, registeringError: undefined }

    case 'TOGGLE_ADD_MENU':
      return { ...state, addMenuClosed: !state.addMenuClosed }

    case 'USER_REGISTRATION_FAILED':
      return { ...state, registering: false, registeringError: action.payload }

    case 'REFERESH_USER_INFO':
      return { ...state, ...action.payload }

    default:
      break
  }
  return state
}

export default user
