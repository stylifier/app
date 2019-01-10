const { btoa } = require('Base64')
const DeviceInfo = require('react-native-device-info')

const deviceNameSafe = `m_g_i_o_s_${
  btoa(unescape(encodeURIComponent(DeviceInfo.getUniqueID())))
    .replace(/=/g, '')
    .toLowerCase()}`

export default deviceNameSafe
