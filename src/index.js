import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import OneSignal from 'react-native-onesignal'
import { AppNavigator } from './navigation'
import actions from './actions'

class MainView extends React.Component {
  constructor(props) {
    super(props)
    this.props.initiateUser()

    this.onReceivedListener = this.onReceived.bind(this)
    this.onOpenedListener = this.onOpened.bind(this)
    this.onIdsListener = this.onIds.bind(this)
  }

  render() {
    return (
      <View style={styles.container}>
        <AppNavigator />
      </View>
    )
  }

  componentWillMount() {
    OneSignal.init('32e810a8-17ec-46ce-92c8-852abd3df96f')

    OneSignal.addEventListener('received', this.onReceivedListener)
    OneSignal.addEventListener('opened', this.onOpenedListener)
    OneSignal.addEventListener('ids', this.onIdsListener)

    OneSignal.inFocusDisplaying(0)
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceivedListener)
    OneSignal.removeEventListener('opened', this.onOpenedListener)
    OneSignal.removeEventListener('ids', this.onIdsListener)
  }

  onReceived(notification) {
    console.log('Notification received: ', notification)
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body)
    console.log('Data: ', openResult.notification.payload.additionalData)
    console.log('isActive: ', openResult.notification.isAppInFocus)
    console.log('openResult: ', openResult)
  }

  onIds(device) {
    this.props.addSubsctiption(device.userId)
  }
}

MainView.propTypes = {
  initiateUser: PropTypes.func,
  addSubsctiption: PropTypes.func,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
})

const mapDispatchToProps = dispatch => ({
  initiateUser: () => dispatch(actions.initiateUser()),
  addSubsctiption: (id) => dispatch(actions.addSubsctiption(id)),
})

export default connect(() => ({}), mapDispatchToProps)(MainView)
