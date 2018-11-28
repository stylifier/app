import React, { Component } from 'react'
import { Text, SafeAreaView, View, Button, ActivityIndicator, Linking, Switch } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import tcomb from 'tcomb-form-native'
import actions from '../actions'
import ProfilePage from '../components/Profile'

const { Form } = tcomb.form

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
    const { loginUser } = this.props
    const value = this.loginForm.getValue()
    if (value) {
      loginUser(value.Username.toLowerCase(), value.Password)
    }
  }

  onRegister() {
    const { termAgreed } = this.state
    const { registerUser } = this.props
    const value = this.registerForm.getValue()
    if (value) {
      if (!termAgreed) {
        this.setState({ termErrorShow: true })
        return
      }
      this.setState({ termErrorShow: false })

      registerUser(
        value.Username,
        value.Password,
        value['Email Address'],
        value.Fullname
      )
    }
  }

  renderLoginRegisterView() {
    const { user } = this.props
    const { registerFormValue, loginFormValue, termAgreed, termErrorShow } = this.state

    return (
      <View
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
            value={loginFormValue}
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
                  error: 'Your username must contain only ' +
                  'lowercase letters, numbers and underscores',
                  autoCapitalize: 'none',
                },
                Password: {
                  password: true,
                  secureTextEntry: true,
                  error: 'Your password should atleast contain 8 letters',
                  autoCapitalize: 'none',
                },
              },
            }}
          />
          {user.loginError && user.loginError.message === '401' &&
            <Text style={{ color: 'red' }}>
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
            value={registerFormValue}
            onChange={(value) => this.setState({ registerFormValue: value })}
            style={{
              width: '90%',
            }}
            ref={c => { this.registerForm = c }}
            type={tcomb.struct({
              Fullname: tcomb.String,
              Username: tcomb.subtype(tcomb.String, (t) => /^[a-z0-9_]{3,25}$/.test(t)),
              'Email Address':
                tcomb.subtype(tcomb.String, (t) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(t)),
              Password: tcomb.subtype(tcomb.String, (t) => /^.{8,400}$/.test(t)),
            })}
            options={{
              auto: 'placeholders',
              fields: {
                Fullname: {
                  error: 'Please enter your name',
                  autoCapitalize: 'words',
                },
                Username: {
                  error: 'Your username must contain only ' +
                  'lowercase letters, numbers and underscores',
                  autoCapitalize: 'none',
                },
                'Email Address': {
                  error: 'Please enter valid Email',
                  autoCapitalize: 'none',
                },
                Password: {
                  password: true,
                  secureTextEntry: true,
                  error: 'Your password should atleast contain 8 letters',
                  autoCapitalize: 'none',
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
              value={termAgreed}
              onChange={() => this.setState({
                termAgreed: !termAgreed,
                termErrorShow: termAgreed,
              })}
            />
          </View>
          {user.registeringError && user.registeringError.message === '403' &&
            <Text style={{ color: 'red' }}>
              Your username is taken, please try another username.
            </Text>}
          {termErrorShow &&
            <Text style={{ color: 'red' }}>
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
      </View>
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

    if (!user.isLoggedInUser) {
      return this.renderLoginRegisterView()
    }

    return (
      <ProfilePage base={user} style={{ width: '100%' }} />
    )
  }
}

Profile.propTypes = {
  loginUser: PropTypes.func,
  registerUser: PropTypes.func,
  user: PropTypes.object,
}

const mapStateToProps = state => ({ user: state.user })

const mapDispatchToProps = dispatch => ({
  loginUser: (username, password) => dispatch(actions.loginUser(username, password)),
  registerUser: (username, password, email, fullname) =>
    dispatch(actions.registerUser(username, password, email, fullname)),
})


export default connect(mapStateToProps, mapDispatchToProps)(Profile)
