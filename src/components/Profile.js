import React, {Component} from 'react'
import {Text, SafeAreaView, Image, View, ScrollView, Button} from 'react-native'
import tcomb from 'tcomb-form-native'
import actions from '../actions'
import { connect } from 'react-redux'
const DeviceInfo = require('react-native-device-info')

const deviceNameSafe = 'm_g_i_o_s_' +
  btoa(
    unescape(
      encodeURIComponent(DeviceInfo.getUniqueID())))
  .replace(/=/g,'')
  .toLowerCase()

const Form = tcomb.form.Form

class Profile extends Component {
  onLogin() {
    var value = this.loginForm.getValue()
    if (value) {
      this.props.loginUser(value.Username, value.Password)
    }
  }

  onRegister() {
    var value = this.registerForm.getValue()
    if (value) {
      this.props.registerUser(value.Username, value.Password, value['Email Address'], value.Fullname)
    }
  }

  renderLoginRegisterView () {
    return (
      <ScrollView style={{
        height: '100%',
        width: '100%'
      }}>
        <Text style={{marginTop: 20, marginBottom: 20}}> Login to share your bookmarks between your devices: </Text>
        <Form
          style={{width: '90%'}}
          ref={c => this.loginForm = c}
          type={tcomb.struct({
            Username: tcomb.subtype(tcomb.String, (t) => /^[a-z0-9_]{3,25}$/.test(t)),
            Password: tcomb.subtype(tcomb.String, (t) => /^.{8,400}$/.test(t))
          })}
          options={{
            auto: 'placeholders',
            fields: {
              Password: {
                password: true,
                secureTextEntry: true
              }
            }
          }}/>
        <Button
          title="Login"
          onPress={() => this.onLogin()}
        />
        <Text style={{marginTop: 20, marginBottom: 20}}> Don't have an account yet: </Text>

        <Form
          style={{width: '90%'}}
          ref={c => this.registerForm = c}
          type={tcomb.struct({
            Fullname: tcomb.String,
            Username: tcomb.subtype(tcomb.String, (t) => /^[a-z0-9_]{3,25}$/.test(t)),
            'Email Address': tcomb.String,
            Password: tcomb.subtype(tcomb.String, (t) => /^.{8,400}$/.test(t))
          })}
          options={{
            auto: 'placeholders',
            fields: {
              Password: {
                password: true,
                secureTextEntry: true
              }
            }
          }}/>
        <Button
          title="Register"
          onPress={() => this.onRegister()}
        />
      </ScrollView>
    )
  }

  render() {
    const {user} = this.props

    if(user.username === deviceNameSafe)
      return this.renderLoginRegisterView()

    return (
      <SafeAreaView style={{
        justifyContent: 'center',
        marginTop: 50,
        padding: 20,
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <Text>
          You are logged in as '{user.username.replace('m_g_i_o_s_', '')}'
        </Text>
        <Button
          title="Logout"
          onPress={() => this.props.logoutUser()}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({user: state.user})

const mapDispatchToProps = dispatch => ({
  loginUser: (username, password) => dispatch(actions.loginUser(username, password)),
  registerUser: (username, password, email, fullname) =>
    dispatch(actions.registerUser(username, password, email, fullname)),
  logoutUser: () => dispatch(actions.logoutUser())
})


export default connect(mapStateToProps, mapDispatchToProps)(Profile)
