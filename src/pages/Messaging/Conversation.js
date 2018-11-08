import React, { Component } from 'react'
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  Alert,
  Linking,
  ScrollView,
  Modal,
} from 'react-native'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import { Header, Left, Icon as NBIcon, Button as NBButton,
  Container, Body, Title, Right } from 'native-base'
import { NavigationActions } from 'react-navigation'
import ImageCropPicker from 'react-native-image-crop-picker'
import PropTypes from 'prop-types'
import { Icon, Button } from 'react-native-elements'
import moment from 'moment'
import { connect } from 'react-redux'
import ProfilePage from '../Profile'
import actions from '../../actions'
import ProductItem from '../../components/ProductItem'
import Viewer from '../../components/Viewer'
import ImageItem from '../../components/ImageItem'


class Conversation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showProductPickerModal: false,
      showProfile: false,
      selectedProfile: '',
    }
  }

  onSend(items = []) {
    const { messages, createMessage } = this.props
    const { selectedThreadId } = messages

    items.forEach(m =>
      createMessage(selectedThreadId, m.text))
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
    return (
      <TouchableOpacity
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

  renderEmptyScreen() {
    const { toBookmarks } = this.props
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FontAwesome
          style={{
            fontSize: 70,
            color: '#3b4e68',
          }}
        >
          {Icons.road}
        </FontAwesome>
        <Text style={{ textAlign: 'center' }}>
          You have no bookmarks.
        </Text>
        <Text style={{ textAlign: 'center' }}>
          Try bookmarking items with
        </Text>
        <Text style={{ textAlign: 'center' }}>
          "+ Create Outfit" button.
        </Text>
        <Button
          rounded
          onPress={() => {
            toBookmarks()
          }}
          buttonStyle={{ backgroundColor: '#5b7495', padding: 5, marginTop: 20 }}
          title="To Bookmarks"
        />
      </View>)
  }

  renderProductPickModal() {
    const { productBookmarks, createMessage, messages } = this.props
    const { showProductPickerModal } = this.state

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={showProductPickerModal}
      >
        <Container>
          <Header>
            <Left>
              <NBButton
                transparent
                onPress={() => this.setState({ showProductPickerModal: false })}
              >
                <NBIcon name="arrow-back" />
              </NBButton>
            </Left>
            <Body>
              <Title>Items</Title>
            </Body>
            <Right />
          </Header>
          <ScrollView style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5' }}>
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
            {(!productBookmarks || productBookmarks.length <= 0) && this.renderEmptyScreen()}
          </ScrollView>
        </Container>
      </Modal>
    )
  }

  renderMessaging() {
    const { messages, user, fetchButtomMessages } = this.props
    const { selectedProfile, showProfile } = this.state
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
          visible={showProfile}
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
          onLoadEarlier={() => fetchButtomMessages(messages.selectedThreadId)}
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
              wrapperStyle={{
                right: {
                  backgroundColor: '#5b7495',
                },
              }}
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

Conversation.propTypes = {
  navigateToLogin: PropTypes.func,
  createMessage: PropTypes.func,
  fetchButtomMessages: PropTypes.func,
  sendImageMessage: PropTypes.func,
  toBookmarks: PropTypes.func,
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
  toBookmarks: () => dispatch(actions.moveToPage('Bookmarks')),
  createMessage: (threadId, text, media, products) => dispatch(
    actions.createMessage(threadId, text, media, products)
  ),
  fetchButtomMessages: (threadId) => dispatch(
    actions.fetchButtomMessages(threadId)
  ),
  sendImageMessage: (threadId, localPath) => dispatch(
    actions.sendImageMessage(threadId, localPath)
  ),
})

export default connect(mapStateToProps, mapDispatchToProps)(Conversation)
