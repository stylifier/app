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
    try {
      const { additionalData } = notification.payload
      const { messages, fetchTopMessages, addUnreadThread, refetchTopThreads } = this.props

      if (!additionalData.url) return

      const param =
        additionalData.url.replace(/(https|http):\/\/[a-z.1-9]*\//g, '').split('/')

      if (param[0] === 'messages') {
        if (messages.selectedThreadId && messages.selectedThreadId === param[1]) {
          fetchTopMessages(messages.selectedThreadId)
        }
        if (messages.selectedThreadId !== param[1]) {
          addUnreadThread(param[1])
          refetchTopThreads(messages.selectedThreadId)
        }

        if (messages.threads.filter(t => t.id === param[1]).length <= 0) {
          refetchTopThreads()
        }
      }
    } catch (e) {
      // ignore
    }
  }

  onOpened(openResult) {
    try {
      const { additionalData } = openResult.notification.payload

      if (!additionalData.url) return

      const param =
        additionalData.url.replace(/(https|http):\/\/[a-z.1-9]*\//g, '').split('/')

      if (param[0] === 'messages') {
        this.props.setSelectedThreadId(param[1], true)
        this.props.moveToPage('Messages')
      }
    } catch (e) {
      // ignore
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
  addUnreadThread: PropTypes.func,
  moveToPage: PropTypes.func,
  fetchTopMessages: PropTypes.func,
  refetchTopThreads: PropTypes.func,
  messages: PropTypes.object,
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
  addUnreadThread: (threadId) => dispatch(actions.addUnreadThread(threadId)),
  fetchTopMessages: (threadId) => dispatch(actions.fetchTopMessages(threadId)),
  moveToPage: (page) => dispatch(actions.moveToPage(page)),
  refetchTopThreads: () => dispatch(actions.refetchTopThreads()),
})

const mapStateToProps = state => ({
  messages: state.messages,
})

export default connect(mapStateToProps, mapDispatchToProps)(MainView)
