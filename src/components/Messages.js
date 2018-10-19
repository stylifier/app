import React, { Component } from 'react'
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  Alert,
  Linking,
  Modal,
} from 'react-native'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import { NavigationActions } from 'react-navigation'
import ImageCropPicker from 'react-native-image-crop-picker'
import PropTypes from 'prop-types'
import { Icon } from 'react-native-elements'
import moment from 'moment'
import { connect } from 'react-redux'
import ProfilePage from './ProfilePage'
import actions from '../actions'
import ProductItem from './ProductItem.js'
import Viewer from './Viewer'
import ImageItem from './ImageItem.js'


class Messages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showProductPickerModal: false,
      showProfile: false,
      selectedProfile: '',
    }
  }
  onSend(items = []) {
    const { navigator, messages } = this.props
    const { selectedThreadId } = messages

    if (selectedThreadId === 'new') navigator.pop()

    items.forEach(m =>
      this.props.createMessage(selectedThreadId, m.text))
  }

  componentDidUpdate(prevProps) {
    const { messages } = this.props

    if (prevProps.messages.selectedThreadId !== messages.selectedThreadId &&
      !messages.selectedThreadId) {
      this.props.navigator.pop()
    }
  }

  renderProductPick() {
    return (
      <TouchableOpacity
        onPress={() => this.setState({ showProductPickerModal: true })}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: 20,
          marginLeft: 10,
          backgroundColor: '#66bfc7',
        }}
      >
        <Icon name="ios-shirt" type="ionicon" size={28} color="#f5f5f5" />
      </TouchableOpacity>
    )
  }

  renderCameraPick() {
    const { messages, sendImageMessage } = this.props
    return (
      <TouchableOpacity
        onPress={() => {
          ImageCropPicker.openCamera({
            width: 500,
            height: 500,
            cropping: true,
          }).then(image => sendImageMessage(messages.selectedThreadId, image.path))
            .catch((e) => {
              if (/cancelled/g.test(e.message)) {
                return
              }

              if (/Cannot access camera/g.test(e.message)) {
                Alert.alert(
                  'Cannot Access Camera',
                  e.message.replace('Cannot access camera.', ''),
                  [
                    { text: 'Open App Settings', onPress: () => Linking.openURL('app-settings:') },
                    { text: 'OK', onPress: () => {} },
                  ],
                  { cancelable: false }
                )
                return
              }

              Alert.alert(
                'Failed to Access Camera',
                e.message,
                [{ text: 'OK', onPress: () => {} }]
              )
            })
        }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: 20,
          marginLeft: 10,
          backgroundColor: '#66bfc7',
        }}
      >
        <FontAwesome
          style={{
            fontSize: 24,
            color: '#F5F5F5',
          }}
        >
          {Icons.camera}
        </FontAwesome>
      </TouchableOpacity>
    )
  }

  renderImagePick() {
    const { messages, sendImageMessage } = this.props
    return (<TouchableOpacity
      onPress={() => {
        ImageCropPicker.openPicker({
          width: 500,
          height: 500,
          cropping: true,
        })
          .then(image => sendImageMessage(messages.selectedThreadId, image.path))
          .catch((e) => {
            if (/cancelled/g.test(e.message)) {
              return
            }

            if (/Cannot access images/g.test(e.message)) {
              Alert.alert(
                'Cannot Access Images',
                e.message.replace('Cannot access images.', ''),
                [
                  { text: 'Open App Settings', onPress: () => Linking.openURL('app-settings:') },
                  { text: 'OK', onPress: () => {} },
                ],
                { cancelable: false }
              )
              return
            }

            Alert.alert(
              'Failed to Get Images',
              'Please try again',
              [{ text: 'OK', onPress: () => {} }]
            )
          })
      }}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#66bfc7',
      }}
    >
      <FontAwesome
        style={{
          fontSize: 24,
          color: '#F5F5F5',
        }}
      >
        {Icons.image}
      </FontAwesome>
    </TouchableOpacity>)
  }

  renderProductPickModal() {
    const { productBookmarks, createMessage, messages } = this.props

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.showProductPickerModal}
      >
        <SafeAreaView
          style={{
            justifyContent: 'center',
            padding: 20,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignSelf: 'flex-end',
              padding: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => this.setState({ showProductPickerModal: false })}
            >
              <Text
                style={{
                  color: 'black',
                  fontSize: 16,
                }}
              >Close</Text>
            </TouchableOpacity>
          </View>
          <Viewer
            items={productBookmarks.map(t => t.product)}
            BaseItem={ProductItem}
            itemExtraProps={{
              hideBookmarkBotton: true,
              onClick: (item) => {
                createMessage(messages.selectedThreadId, '', [], [item])
                this.setState({ showProductPickerModal: false })
              },
            }}
          />
        </SafeAreaView>
      </Modal>
    )
  }

  renderMessaging() {
    const { messages, user } = this.props
    const { selectedProfile } = this.state
    const selectedThread =
      messages.threads.filter(t => t.id === messages.selectedThreadId)[0]

    if (!selectedThread) {
      return (<View />)
    }

    const isFromMe = selectedThread.from.username === user.username

    return (
      <View style={{ width: '100%', height: '100%' }}>
        {this.renderProductPickModal()}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showProfile}
        >
          <ProfilePage
            onDismissPressed={() => this.setState({ showProfile: false })}
            key={selectedProfile}
            base={
              selectedThread.from.username === selectedProfile ?
                selectedThread.from : selectedThread.to
            }
          />
        </Modal>
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
          onLoadEarlier={() => this.props.fetchButtomMessages(this.props.messages.selectedThreadId)}
          loadEarlier
          onPressAvatar={u => this.setState({ showProfile: true, selectedProfile: u.name })}
          renderChatFooter={() => (
            <View style={{ flexDirection: 'row', padding: 10 }}>
              {this.renderImagePick()}
              {this.renderCameraPick()}
              {this.renderProductPick()}
            </View>
          )}
          renderBubble={(props) => (
            <Bubble
              {...props}
              renderCustomView={() => (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    padding: 0,
                  }}
                >
                  {props.currentMessage.products.length > 0 && (
                    <View style={{ padding: 3 }}>
                      {props.currentMessage.products
                        .map((t, ind) => (
                          <ProductItem
                            hideBookmarkBotton
                            darkBackground
                            rounded
                            key={ind}
                            base={t}
                          />
                        ))}
                    </View>)}
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
          messages={messages.messages.map(m => ({
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
          onSend={msgs => this.onSend(msgs)}
        />
      </View>
    )
  }

  render() {
    const { user } = this.props

    if (!user.isLoggedInUser) {
      return this.renderUserIsGuest()
    }

    return (
      <SafeAreaView style={{ width: '100%', height: '100%' }}>
        {this.renderMessaging()}
      </SafeAreaView>
    )
  }
}

Messages.propTypes = {
  navigateToLogin: PropTypes.func,
  createMessage: PropTypes.func,
  fetchButtomMessages: PropTypes.func,
  setSelectedThreadId: PropTypes.func,
  sendImageMessage: PropTypes.func,
  user: PropTypes.object,
  productBookmarks: PropTypes.array,
  messages: PropTypes.object,
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
  createMessage: (threadId, text, media, products) => dispatch(
    actions.createMessage(threadId, text, media, products)
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
})

export default connect(mapStateToProps, mapDispatchToProps)(Messages)
