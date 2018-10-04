import React, { Component } from 'react'
import { Text, SafeAreaView, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NavigationActions } from 'react-navigation'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'react-redux'
import actions from '../actions'
import ThreadItem from './ThreadItem'
import ProductItem from './ProductItem.js'
import ImageItem from './ImageItem.js'


class Messages extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedThread: undefined,
    }
  }

  onSend(messages = []) {
    messages.forEach(m =>
      this.props.createMessage(this.state.selectedThread.id, m.text))
  }

  componentDidMount() {
    this.fetchNewMessageInterval = setInterval(() => {
      if (!this.state.selectedThread) return

      this.props.fetchTopMessages(this.state.selectedThread.id)
    }, 2000)
  }

  componentWillUnmount() {
    clearInterval(this.fetchNewMessageInterval)
  }

  renderMessaging() {
    const { selectedThread } = this.state
    const isFromMe = selectedThread.from.username === this.props.user.username

    return (
      <View style={{ width: '100%', height: '100%' }}>
        <View>
          <TouchableOpacity
            style={{
              marginRight: 'auto',
              flexDirection: 'row',
              paddingTop: 10,
              marginLeft: 10,
            }}
            onPress={() => this.setState({ selectedThread: undefined })}
          >
            <FontAwesome
              style={{
                marginRight: 5,
                marginTop: 3,
                color: 'black',
              }}
            >
              {Icons.chevronLeft}
            </FontAwesome>
            <Text
              style={{ color: 'black', fontSize: 16 }}
            >Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginRight: 'auto',
              flexDirection: 'row',
              paddingTop: 10,
              position: 'absolute',
              right: 10,
            }}
            onPress={() => this.setState({ selectedThread: undefined })}
          >
            <Text
              style={{ color: 'black', fontSize: 16 }}
            >Finish</Text>
          </TouchableOpacity>
        </View>
        <GiftedChat
          bottomOffset={50}
          user={isFromMe ?
            ({
              avatar: selectedThread.from.profile_picture,
              name: selectedThread.from.username,
              _id: selectedThread.from.id,
            }) :
            ({
              avatar: selectedThread.to.profile_picture,
              name: selectedThread.to.username,
              _id: selectedThread.to.id,
            })
          }
          onLoadEarlier={() => this.props.fetchButtomMessages(selectedThread.id)}
          loadEarlier
          renderBubble={(props) => (
            <Bubble
              {...props}
              renderCustomView={() => (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    padding: 10,
                  }}
                >
                  {props.currentMessage.products
                    .map((t, ind) => (
                      <ProductItem
                        hideBookmarkBotton
                        key={ind}
                        base={t}
                      />
                    ))}
                  {props.currentMessage.media
                    .map((t, i) => (
                      <ImageItem
                        key={i}
                        uri={t.images.standard_resolution.url}
                      />
                    ))}
                </View>
              )}
            />
          )}
          messages={this.props.messages.messages.map(m => ({
            _id: m.id,
            text: m.text,
            products: m.products,
            media: m.media,
            createdAt: moment(m.created_time).toDate(),
            user: m.senderUsername === selectedThread.from.username ?
              ({
                avatar: selectedThread.from.profile_picture,
                name: selectedThread.from.username,
                _id: selectedThread.from.id,
              }) :
              ({
                avatar: selectedThread.to.profile_picture,
                name: selectedThread.to.username,
                _id: selectedThread.to.id,
              }),
          }))}
          onSend={messages => this.onSend(messages)}
        />
      </View>
    )
  }

  renderThreads() {
    const { messages } = this.props

    if (messages.threadLoading) {
      return <ActivityIndicator style={{ marginTop: 50 }} size="small" color="#3b4e68" />
    }

    return (
      <KeyboardAwareScrollView>
        {this.props.messages.threads.map((t, i) =>
          <ThreadItem
            key={i}
            base={t}
            currentUser={this.props.user}
            onPress={(trd) => {
              this.setState({ selectedThread: trd })
              this.props.fetchMessages(trd.id)
            }}
          />
        )}
      </KeyboardAwareScrollView>
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
    const { user } = this.props

    if (user.is_guest === true) {
      return this.renderUserIsGuest()
    }

    return (
      <SafeAreaView style={{ width: '100%', height: '100%' }}>
        {this.state.selectedThread && this.renderMessaging()}
        {!this.state.selectedThread && this.renderThreads()}
      </SafeAreaView>
    )
  }
}

Messages.propTypes = {
  navigateToLogin: PropTypes.func,
  fetchMessages: PropTypes.func,
  createMessage: PropTypes.func,
  fetchTopMessages: PropTypes.func,
  fetchButtomMessages: PropTypes.func,
  user: PropTypes.object,
  messages: PropTypes.object,
}

const mapStateToProps = state => ({
  user: state.user,
  messages: state.messages,
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
})

export default connect(mapStateToProps, mapDispatchToProps)(Messages)
