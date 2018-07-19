const user = (state = {}, action) => {
  switch (action.type) {
    case 'USER_INITIATED':
      return {
        ...action.payload,
        loggingIn: false,
        loginError: undefined,
        registering: false,
        registeringError: undefined,
      }

    case 'LOGGING_IN':
      return { ...state, loggingIn: true, loginError: undefined }

    case 'LOGIN_FAILED':
      return { ...state, loggingIn: undefined, loginError: action.payload }

    case 'REGISTERING_USER':
      return { ...state, registering: true, registeringError: undefined }

    case 'USER_REGISTRATION_FAILED':
      return { ...state, registering: false, registeringError: action.payload }

    default:
      break
  }
  return state
}

export default user
