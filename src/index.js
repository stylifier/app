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
    const { additionalData } = notification.payload

    if (!additionalData.url) return

    const param =
      additionalData.url.replace(/(https|http):\/\/[a-z.1-9]*\//g, '').split('/')

    console.log('-->>>', param)
  }

  onOpened(openResult) {
    const { additionalData } = openResult.notification.payload

    if (!additionalData.url) return

    const param =
      additionalData.url.replace(/(https|http):\/\/[a-z.1-9]*\//g, '').split('/')

    if (param[0] === 'messages') {
      this.props.setSelectedThreadId(param[1], true)
    }
  }

  onIds(device) {
    this.props.addSubsctiption(device.userId)
  }
}

MainView.propTypes = {
  initiateUser: PropTypes.func,
  addSubsctiption: PropTypes.func,
  setSelectedThreadId: PropTypes.func,
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
  setSelectedThreadId: (threadId, refetchThreads) => dispatch(
    actions.setSelectedThreadId(threadId, refetchThreads)
  ),
})

export default connect(() => ({}), mapDispatchToProps)(MainView)
