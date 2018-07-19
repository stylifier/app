import React, { Component } from 'react'
import { Text, SafeAreaView, View, Button, ActivityIndicator, Linking, Switch } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import tcomb from 'tcomb-form-native'
import actions from '../actions'

const btoa = require('Base64').btoa
const DeviceInfo = require('react-native-device-info')

const deviceNameSafe = `m_g_i_o_s_${btoa(
    unescape(
      encodeURIComponent(DeviceInfo.getUniqueID())))
  .replace(/=/g, '')
  .toLowerCase()}`

const Form = tcomb.form.Form

class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loginFormValue: null,
      termAgreed: false,
      termErrorShow: false,
      registerFormValue: null,
    }
  }
  onLogin() {
    const value = this.loginForm.getValue()
    if (value) {
      this.props.loginUser(value.Username.toLowerCase(), value.Password)
    }
  }

  onRegister() {
    const value = this.registerForm.getValue()
    if (value) {
      if (!this.state.termAgreed) {
        this.setState({ termErrorShow: true })
        return
      }
      this.setState({ termErrorShow: false })

      this.props.registerUser(
        value.Username,
        value.Password,
        value['Email Address'],
        value.Fullname
      )
    }
  }

  renderLoginRegisterView() {
    const { user } = this.props

    return (
      <SafeAreaView
        style={{
          justifyContent: 'center',
          marginTop: 50,
          padding: 20,
          width: '90%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <KeyboardAwareScrollView
          style={{
            height: '100%',
            width: '100%',
          }}
        >
          <Text
            style={{
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            Login to share your bookmarks between your devices:
          </Text>
          <Form
            value={this.state.loginFormValue}
            onChange={(value) => this.setState({ loginFormValue: value })}
            style={{
              width: '90%',
            }}
            ref={c => { this.loginForm = c }}
            type={tcomb.struct({
              Username: tcomb.subtype(tcomb.String, (t) => /^.{3,25}$/.test(t)),
              Password: tcomb.subtype(tcomb.String, (t) => /^.{8,400}$/.test(t)),
            })}
            options={{
              auto: 'placeholders',
              fields: {
                Username: {
                  error: 'Your username must contain only lowercase letters, numbers and underscores',
                },
                Password: {
                  password: true,
                  secureTextEntry: true,
                  error: 'Your password should atleast contain 8 letters',
                },
              },
            }}
          />
          {user.loginError && user.loginError.message === '401' &&
            <Text style={{ color: 'red' }} >
              Please check your username and password and try again.
            </Text>}
          <Button
            title="Login"
            onPress={() => this.onLogin()}
          />
          <Text
            style={{
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            Don't have an account yet:
          </Text>

          <Form
            value={this.state.registerFormValue}
            onChange={(value) => this.setState({ registerFormValue: value })}
            style={{
              width: '90%',
            }}
            ref={c => { this.registerForm = c }}
            type={tcomb.struct({
              Fullname: tcomb.String,
              Username: tcomb.subtype(tcomb.String, (t) => /^[a-z0-9_]{3,25}$/.test(t)),
              'Email Address':
                tcomb.subtype(tcomb.String, (t) => /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(t)),
              Password: tcomb.subtype(tcomb.String, (t) => /^.{8,400}$/.test(t)),
            })}
            options={{
              auto: 'placeholders',
              fields: {
                Fullname: {
                  error: 'Please enter your name',
                },
                Username: {
                  error: 'Your username must contain only lowercase letters, numbers and underscores',
                },
                'Email Address': {
                  error: 'Please enter valid Email',
                },
                Password: {
                  password: true,
                  secureTextEntry: true,
                  error: 'Your password should atleast contain 8 letters',
                },
              },
            }}
          />
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ marginTop: 5 }}> I agree to </Text>
            <Text
              style={{ marginTop: 5, color: 'blue' }}
              onPress={() => Linking.openURL('https://www.stylifier.com/policy')}
            >
              Terms and Conditions
            </Text>
            <Switch
              style={{ marginLeft: 'auto' }}
              value={this.state.termAgreed}
              onChange={() => this.setState({
                termAgreed: !this.state.termAgreed,
                termErrorShow: this.state.termAgreed,
              })}
            />
          </View>
          {user.registeringError && user.registeringError.message === '403' &&
            <Text style={{ color: 'red' }} >
              Your username is taken, please try another username.
            </Text>}
          {this.state.termErrorShow &&
            <Text style={{ color: 'red' }} >
              Please agree to terms and condictions in order to register
            </Text>}
          <View
            style={{ height: 20 }}
          />
          <Button
            title="Register"
            onPress={() => this.onRegister()}
          />
          <View
            style={{ height: 50 }}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    )
  }

  render() {
    const { user } = this.props

    if (user.loggingIn || user.registering) {
      return (
        <SafeAreaView
          style={{
            justifyContent: 'center',
            marginTop: 50,
            padding: 20,
            width: '90%',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <ActivityIndicator size="small" color="#3b4e68" />
        </SafeAreaView>)
    }

    if (user.username === deviceNameSafe) {
      return this.renderLoginRegisterView()
    }

    return (
      <SafeAreaView
        style={{
          justifyContent: 'center',
          marginTop: 50,
          padding: 20,
          width: '90%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Text style={{ marginBottom: 50 }}>
          You are logged in as '{user.username.replace('m_g_i_o_s_', '')}'
        </Text>
        <Button
          title="Logout"
          onPress={() => {
            this.setState({
              loginFormValue: null,
              termAgreed: false,
              registerFormValue: null,
              termErrorShow: false,
            })
            this.props.logoutUser()
          }}
        />
      </SafeAreaView>
    )
  }
}

Profile.propTypes = {
  logoutUser: PropTypes.func,
  loginUser: PropTypes.func,
  registerUser: PropTypes.func,
  user: PropTypes.object,
}

const mapStateToProps = state => ({ user: state.user })

const mapDispatchToProps = dispatch => ({
  loginUser: (username, password) => dispatch(actions.loginUser(username, password)),
  registerUser: (username, password, email, fullname) =>
    dispatch(actions.registerUser(username, password, email, fullname)),
  logoutUser: () => dispatch(actions.logoutUser()),
})


export default connect(mapStateToProps, mapDispatchToProps)(Profile)
