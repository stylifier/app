
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Alert,
  Modal,
} from 'react-native'
import { Header, Left, Icon, Text, Button,
  Container, Body, Right } from 'native-base'
import qs from 'qs'
import { WebView } from 'react-native-webview'

const patchPostMessageJsCode = `(${String(function () {
  var originalPostMessage = window.postMessage
  var patchedPostMessage = function (message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer)
  }
  patchedPostMessage.toString = function () {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
  }
  window.postMessage = patchedPostMessage
})})();`

export default class Instagram extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      key: 1
    }
  }

  show() {
    this.setState({ modalVisible: true })
  }

  hide() {
    this.setState({ modalVisible: false })
  }

  _onNavigationStateChange(webViewState) {
    const { url } = webViewState
    const { key } = this.state
    const { redirectUrl, onLoginSuccess, onLoginFailure } = this.props
    if (webViewState.title === 'Instagram' && webViewState.url === 'https://www.instagram.com/') {
      this.setState({ key: key + 1 })
    }
    if (url && url.startsWith(redirectUrl)) {
      const match = url.match(/(#|\?)(.*)/)
      const results = qs.parse(match[2])
      this.hide()
      if (results.code) {
        onLoginSuccess(results.code)
      } else {
        onLoginFailure(results)
      }
    }
  }

  _onMessage(reactMessage) {
    const { onLoginFailure } = this.props
    try {
      const json = JSON.parse(reactMessage.nativeEvent.data)
      if (json && json.error_type) {
        this.hide()
        onLoginFailure(json)
      }
    } catch (err) { onLoginFailure(err) }
  }

  renderWebview() {
    const { clientId, redirectUrl } = this.props
    const { key } = this.state
    return (
      <WebView
        {...this.props}
        key={key}
        source={{ uri: `https://api.instagram.com/oauth/authorize/?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=basic` }}
        // scalesPageToFit
        startInLoadingState
        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
        onError={this._onNavigationStateChange.bind(this)}
        // onLoadEnd={this._onLoadEnd.bind(this)}
        onMessage={this._onMessage.bind(this)}
        ref={(webView) => { this.webView = webView }}
        injectedJavaScript={patchPostMessageJsCode}
      />
    )
  }

  render() {
    const { modalVisible } = this.state
    return (

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {}}
      >
        <Container>
          <Header>
            <Left>
              <Button
                transparent
                onPress={() => this.setState({ modalVisible: false })}
              >
                <Icon name="arrow-back" />
                <Text>Back</Text>
              </Button>
            </Left>
            <Body />
            <Right />
          </Header>
          {this.renderWebview()}
        </Container>
      </Modal>
    )
  }
}
const propTypes = {
  clientId: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string,
  scopes: PropTypes.array,
  onLoginSuccess: PropTypes.func,
  modalVisible: PropTypes.bool,
  onLoginFailure: PropTypes.func,
  responseType: PropTypes.string,
  containerStyle: PropTypes.object,
  wrapperStyle: PropTypes.object,
  closeStyle: PropTypes.object,
}

const defaultProps = {
  redirectUrl: 'https://google.com',
  styles: {},
  scopes: ['public_content'],
  onLoginSuccess: (token) => {
    Alert.alert(
      'Alert Title',
      'Token: ' + token,
      [
        { text: 'OK' }
      ],
      { cancelable: false }
    )
  },
  onLoginFailure: (failureJson) => {
    console.debug(failureJson)
  },
  responseType: 'token',
}

Instagram.propTypes = propTypes
Instagram.defaultProps = defaultProps

const styles = StyleSheet.create({
  webView: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 40,
    paddingHorizontal: 10,
  },
  wrapper: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 5,
    borderColor: 'rgba(0, 0, 0, 0.6)',
  },
  close: {
    position: 'absolute',
    top: 35,
    right: 5,
    backgroundColor: '#000',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgClose: {
    width: 30,
    height: 30,
  }
})
