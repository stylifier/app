import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import { NavigationActions } from 'react-navigation'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import actions from '../../actions'
import ThreadItem from '../../components/ThreadItem'

class Threads extends Component {
  renderThreads() {
    const { messages, user, setSelectedThreadId } = this.props

    if (!messages.threadLoading && (!messages.threads || messages.threads.length < 1)) {
      return this.renderEmptySearch()
    }

    return (
      <View>
        {messages.threads
          .filter(t => t.id !== 'new')
          .filter(t => t.to && t.from)
          .sort((a, b) => {
            const aDate = a.from.username === user.username ?
              moment(a.to_last_message_at || a.created_time) :
              moment(a.from_last_message_at || a.created_time)

            const bDate = b.from.username === user.username ?
              moment(b.to_last_message_at || b.created_time) :
              moment(b.from_last_message_at || b.created_time)

            return bDate - aDate
          })
          .map((t, i) =>
            <ThreadItem
              key={i}
              base={t}
              currentUser={user}
              isUnread={messages.unreadThreadIds.indexOf(t.id) !== -1}
              onPress={(trd) => {
                setSelectedThreadId(trd.id)
              }}
            />
          )}
      </View>
    )
  }

  renderEmptySearch() {
    return (
      <View
        style={{
          width: '100%',
          alignItems: 'center',
        }}
      >
        <FontAwesome
          style={{
            marginTop: '30%',
            marginBottom: 30,
            fontSize: 70,
            color: '#3b4e68',
          }}
        >
          {Icons.road}
        </FontAwesome>
        <Text style={{ textAlign: 'center' }}>
          You have no conversation!
        </Text>
      </View>)
  }

  renderUserIsGuest() {
    const { navigateToLogin } = this.props
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: 20,
          backgroundColor: '#f5f5f5',
        }}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginTop: 40,
            height: '100%',
          }}
        >
          <Text style={{ fontWeight: 'bold', marginBottom: 40 }}>
            You are not logged in
          </Text>
          <Text style={{ marginBottom: 40 }}>
            In order to use this feature you need to login or create an account.
          </Text>
          <TouchableOpacity onPress={() => navigateToLogin()}>
            <Text style={{ color: 'black', fontSize: 16 }}>
              Login / Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const { user, messages, refetchTopThreads } = this.props

    return (
      <SafeAreaView style={{ backgroundColor: '#f5f5f5' }}>
        <KeyboardAwareScrollView
          style={{ width: '100%', height: '100%', paddingTop: -10 }}
          refreshControl={
            user.isLoggedInUser ? <RefreshControl
              refreshing={messages.loadingTop}
              onRefresh={() => refetchTopThreads()}
            /> : undefined
          }
        >
          {user.isLoggedInUser ? this.renderThreads() : undefined}
          {(user.isLoggedInUser && messages.threadLoading) ?
            <ActivityIndicator style={{ marginTop: 50 }} size="small" color="#3b4e68" /> : undefined}
          {!user.isLoggedInUser ? this.renderUserIsGuest() : undefined}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    )
  }
}

Threads.propTypes = {
  navigateToLogin: PropTypes.func,
  setSelectedThreadId: PropTypes.func,
  refetchTopThreads: PropTypes.func,
  user: PropTypes.object,
  messages: PropTypes.object,
}

const mapStateToProps = state => ({
  user: state.user,
  messages: state.messages,
  productBookmarks: state.productBookmarks,
})

const mapDispatchToProps = dispatch => ({
  navigateToLogin: () => dispatch(
    NavigationActions.navigate({ routeName: 'Profile' })
  ),
  fetchMessages: (threadId) => dispatch(
    actions.fetchMessages(threadId)
  ),
  createMessage: (threadId, text, media, products) => dispatch(
    actions.createMessage(threadId, text, media, products)
  ),
  fetchTopMessages: (threadId) => dispatch(
    actions.fetchTopMessages(threadId)
  ),
  fetchButtomMessages: (threadId) => dispatch(
    actions.fetchButtomMessages(threadId)
  ),
  setSelectedThreadId: (threadId, refetchThreads) => dispatch(
    actions.setSelectedThreadId(threadId, refetchThreads)
  ),
  sendImageMessage: (threadId, localPath) => dispatch(
    actions.sendImageMessage(threadId, localPath)
  ),
  refetchTopThreads: () => dispatch(
    actions.refetchTopThreads()
  ),
})

export default connect(mapStateToProps, mapDispatchToProps)(Threads)
