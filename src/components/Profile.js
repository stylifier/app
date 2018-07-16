import React, {Component} from 'react'
import {Text, SafeAreaView, Image, View, Button} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import tcomb from 'tcomb-form-native'
import actions from '../actions'
import { connect } from 'react-redux'
const btoa = require('Base64').btoa
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
      <SafeAreaView style={{
        justifyContent: 'center',
        marginTop: 50,
        padding: 20,
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <KeyboardAwareScrollView style={{
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
                Username: {
                  error: 'Your username must contain only lowercase letters, numbers and underscores'
                },
                Password: {
                  password: true,
                  secureTextEntry: true,
                  error: 'Your password should atleast contain 8 letters'
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
              'Email Address': tcomb.subtype(tcomb.String, (t) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(t)),
              Password: tcomb.subtype(tcomb.String, (t) => /^.{8,400}$/.test(t))
            })}
            options={{
              auto: 'placeholders',
              fields: {
                Fullname: {
                  error: 'Please enter your name'
                },
                Username: {
                  error: 'Your username must contain only lowercase letters, numbers and underscores'
                },
                'Email Address': {
                  error: 'Please enter valid Email'
                },
                Password: {
                  password: true,
                  secureTextEntry: true,
                  error: 'Your password should atleast contain 8 letters'
                }
              }
            }}/>
          <Button
            title="Register"
            onPress={() => this.onRegister()}
          />
          <View
            style={{height: 50}}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
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
        <Text style={{marginBottom: 50}}>
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
