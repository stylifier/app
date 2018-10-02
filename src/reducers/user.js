const btoa = require('Base64').btoa
const DeviceInfo = require('react-native-device-info')

const deviceNameSafe = `m_g_i_o_s_${btoa(
  unescape(
    encodeURIComponent(DeviceInfo.getUniqueID())))
  .replace(/=/g, '')
  .toLowerCase()}`

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
        isLoggedInUser: deviceNameSafe === action.payload.username,
      }

    case 'LOGGING_IN':
      return {
        ...state,
        loggingIn: true,
        loginError: undefined,
        isLoggedInUser: false,
      }

    case 'LOGIN_FAILED':
      return {
        ...state,
        loggingIn: undefined,
        loginError: action.payload,
        isLoggedInUser: false,
      }

    case 'REGISTERING_USER':
      return { ...state, registering: true, registeringError: undefined, isLoggedInUser: false }

    case 'TOGGLE_ADD_MENU':
      return { ...state, addMenuClosed: !state.addMenuClosed }

    case 'USER_REGISTRATION_FAILED':
      return {
        ...state,
        registering: false,
        registeringError: action.payload,
        isLoggedInUser: false,
      }

    case 'REFERESH_USER_INFO':
      return {
        ...state,
        ...action.payload,
        isLoggedInUser: deviceNameSafe === action.payload.username,
      }

    default:
      break
  }
  return state
}

export default user
