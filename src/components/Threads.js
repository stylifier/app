import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native'
import { NavigationActions } from 'react-navigation'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import actions from '../actions'
import ThreadItem from './ThreadItem'
import Messages from './Messages'


class Threads extends Component {
  componentDidUpdate(prevProps) {
    const { messages } = this.props

    if (prevProps.messages.selectedThreadId !== messages.selectedThreadId &&
      messages.selectedThreadId) {
      this.openMessaging(messages.selectedThreadId)
    }
  }

  openMessaging(threadId) {
    const { messages, user } = this.props
    const thread = messages.threads.filter(t => t.id === threadId)[0]

    const nextIndex = ++this.props.index
    this.props.navigator.push({
      component: Messages,
      title: user.username === thread.from.username ? thread.to.full_name : thread.from.full_name,
      passProps: { index: nextIndex },
    })
  }

  renderThreads() {
    const { messages, refetchTopThreads, user } = this.props

    return (
      <ScrollView
        style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5' }}
        refreshControl={
          <RefreshControl
            refreshing={messages.loadingTop}
            onRefresh={() => refetchTopThreads()}
          />
        }
      >
        {messages.threads
          .filter(t => t.id !== 'new')
          .sort((a, b) => {
            const aDate = a.from.username === user.username ?
              moment(a.to_last_message_at || a.created_time).fromNow() :
              moment(a.from_last_message_at || a.created_time).fromNow()

            const bDate = b.from.username === user.username ?
              moment(b.to_last_message_at || b.created_time).fromNow() :
              moment(b.from_last_message_at || b.created_time).fromNow()

            return aDate - bDate
          })
          .map((t, i) =>
            <ThreadItem
              key={i}
              base={t}
              currentUser={this.props.user}
              isUnread={messages.unreadThreadIds.indexOf(t.id) !== -1}
              onPress={(trd) => {
                this.props.setSelectedThreadId(trd.id)
                this.props.fetchMessages(trd.id)
                this.openMessaging(trd.id)
              }}
            />
          )}
      </ScrollView>
    )
  }

  renderUserIsGuest() {
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
          <TouchableOpacity onPress={() => this.props.navigateToLogin()}>
            <Text style={{ color: 'black', fontSize: 16 }}>
              Login / Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const { user, messages } = this.props

    if (!user.isLoggedInUser) {
      return this.renderUserIsGuest()
    }

    return (
      <View>
        {this.renderThreads()}
        {messages.threadLoading &&
          <ActivityIndicator style={{ marginTop: 50 }} size="small" color="#3b4e68" />}
      </View>
    )
  }
}

Threads.propTypes = {
  navigateToLogin: PropTypes.func,
  fetchMessages: PropTypes.func,
  createMessage: PropTypes.func,
  fetchTopMessages: PropTypes.func,
  fetchButtomMessages: PropTypes.func,
  setSelectedThreadId: PropTypes.func,
  sendImageMessage: PropTypes.func,
  refetchTopThreads: PropTypes.func,
  user: PropTypes.object,
  productBookmarks: PropTypes.array,
  messages: PropTypes.object,
  index: PropTypes.number,
  navigator: PropTypes.object,
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
