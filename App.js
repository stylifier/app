import React from 'react';
import { StyleSheet, Text, View, AsyncStorage} from 'react-native';
import {BaseNavigator} from './src/navigation';
import API from './src/common/API.js'

const DeviceInfo = require('react-native-device-info')

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.api = new API()

    const deviceNameSafe = 'm_g_i_o_s_' + btoa(unescape(encodeURIComponent(DeviceInfo.getDeviceName()))).replace(/=/g,'').toLowerCase()

    this.api.login({
      username: deviceNameSafe,
      password: deviceNameSafe
    })
    .then(token => this.setTokenAndUserInfo(token))
    .catch(e => {
      if (e.message !== '401')
        return

      this.api.register({
        username: deviceNameSafe,
        password: deviceNameSafe,
        email: deviceNameSafe + '@guest.guest',
        full_name: deviceNameSafe,
        invite_code: deviceNameSafe
      })
      .then(token => this.setTokenAndUserInfo(token))
      .catch(e => console.log(e))
    })
  }

  setTokenAndUserInfo(token) {
    this.api.setToken(token)
    return this.api.fetchUserInfo()
    .then((info) => {
      AsyncStorage.setItem('user_info', JSON.stringify(info))
      .then(() => console.log('hooray', info))
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <BaseNavigator/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
});
