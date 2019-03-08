import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Dimensions, Text, ActivityIndicator,
  TouchableOpacity, Modal as RNModal, Alert, Image } from 'react-native'
import { Badge, Divider, Button, Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import AutoHeightImage from 'react-native-auto-height-image'
import { getPixelRGBA } from 'react-native-get-pixel'
import { connect } from 'react-redux'
import RNFS from 'react-native-fs'
import StyleSelector from './StyleSelector'
import Draggable from './Draggable'
import actions from '../actions'
import ProfilePage from './Profile'
import ProductSelector from './ProductSelector'
import DescriptionChenger from './DescriptionChenger'
import ColorPalletCreator from './ColorPalletCreator'
import ProductItem from './ProductItem'
import Viewer from './Viewer'

function componentToHex(c) {
  const hex = c.toString(16)
  return (hex.length === 1 ? (`0${hex}`) : hex)
}

function rgbToHex(c) {
  return `#${componentToHex(c[0])}${componentToHex(c[1])}${componentToHex(c[2])}`
}


class FeedItem extends Component {
  constructor(props) {
    super(props)

    const u = props.base.images.standard_resolution.url
    const dp = RNFS.DocumentDirectoryPath

    this.state = {
      imageLoading: true,
      showProfile: false,
      base: props.base,
      showMenuModal: false,
      imageWidth: 0,
      imageHeight: 0,
      draggableColor: 'lightgray',
      imageName: `${dp}/${props.base.id}.${u.substr(u.lastIndexOf('.') + 1)}`
    }

    const { base } = this.props
    const imageName = `${dp}/${props.base.id}.${u.substr(u.lastIndexOf('.') + 1)}`

    const imageUrl = base.images.standard_resolution.url
    Image.getSize(imageUrl,
      (width, height) => this.setState({ imageWidth: width, imageHeight: height }))

    RNFS.exists(imageName)
      .then((exists) => {
        if (exists) return true
        return RNFS.downloadFile({ fromUrl: imageUrl, toFile: imageName }).promise
      })
      .then(() => this.setState({ imageLoading: false }))
      .catch(() => {})
  }

  renderBottomMenu() {
    const { setFeedsSearchPhrase, user, searchs, hideTopMenu, isStyleClickEnabled } = this.props
    const { base, showProfile } = this.state
    const { usersMetadata } = searchs

    const isMe = base.userUsername === user.username
    let isProfilePicture = false

    if (isMe && usersMetadata[user.username].info) {
      isProfilePicture =
        usersMetadata[user.username].info.profile_picture === base.images.standard_resolution.url
    }

    return (
      <View>
        <View
          style={{
            width: Dimensions.get('window').width - 22,
            padding: 5,
            flexDirection: 'row',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <TouchableOpacity
            style={{ marginRight: 'auto', marginTop: 2 }}
            onPress={() => this.setState({ showProfile: true })}
          >
            <Text>{isMe || !base.userUsername ? '' : base.userUsername.replace('m_g_i_o_s_', '')}</Text>
            <RNModal
              animationType="slide"
              transparent={false}
              visible={showProfile}
            >
              <ProfilePage
                onDismissPressed={() => this.setState({ showProfile: false })}
                base={base.user}
              />
            </RNModal>
          </TouchableOpacity>
          {base.style &&
            <Badge
              containerStyle={{ backgroundColor: '#5b7495' }}
              onPress={() => isStyleClickEnabled && setFeedsSearchPhrase(base.style)}
            >
              <Text style={{ color: '#f5f5f5' }}>{base.style}</Text>
            </Badge>
          }
        </View>

        {hideTopMenu && isMe && !isProfilePicture && this.renderSetProfilePictureButton()}
        {hideTopMenu && isMe && this.renderStyleSelectorButtton()}
        {base.description &&
          <Text style={{ width: Dimensions.get('window').width, padding: 20 }}>
            {base.description}
          </Text>}

        {hideTopMenu && isMe && this.renderDescriptionChangeButton()}
        {base.products && base.products.length > 0 && (
          <View style={{ padding: 3, width: Dimensions.get('window').width }}>
            <Viewer
              items={base.products}
              BaseItem={ProductItem}
              itemExtraProps={{
                hideBookmarkBotton: true,
                darkBackground: true,
                rounded: true,
              }}
            />
          </View>)}
        {hideTopMenu && isMe && this.renderProductSelectButton()}
      </View>)
  }

  renderSetProfilePictureButton(full) {
    const { base } = this.state
    const { setProfilePicture, hideTopMenu } = this.props

    return (
      <View
        style={{
          width: full ? '100%' : Dimensions.get('window').width,
          marginBottom: hideTopMenu ? 20 : 0,
        }}
      >
        <Button
          onPress={() => {
            setProfilePicture(base)
            this.setState({ showMenuModal: false })
          }}
          raised={!full}
          buttonStyle={{
            backgroundColor: '#f0f0f0',
            borderRadius: full ? 0 : 15,
            paddingTop: 10,
            paddingBottom: 10,
            marginLeft: 0,
          }}
          containerViewStyle={{ marginLeft: 'auto', marginRight: 'auto', width: full && '100%' }}
          color="#0079ff"
          large
          title="Set as Profile Picture"
        />
      </View>
    )
  }

  renderStyleSelectorButtton(full) {
    const { base } = this.state
    const { setStyle, hideTopMenu } = this.props

    return (
      <View
        style={{
          width: full ? '100%' : Dimensions.get('window').width,
          marginBottom: hideTopMenu ? 20 : 0,
        }}
      >
        <StyleSelector
          onPress={() => this.setState({ showMenuModal: false })}
          full={full}
          onSelect={(st) => {
            this.setState({ base: { ...base, style: st } })
            setStyle(base.id, st)
          }}
          base={base}
        />
      </View>)
  }

  renderDescriptionChangeButton(full) {
    const { base } = this.state
    const { setDescription, hideTopMenu } = this.props

    return (
      <View
        style={{
          width: full ? '100%' : Dimensions.get('window').width,
          marginBottom: hideTopMenu ? 20 : 0,
        }}
      >
        <DescriptionChenger
          onPress={() => this.setState({ showMenuModal: false })}
          full={full}
          defaultValue={base.description}
          onDone={(d) => {
            setDescription(base.id, d)
            this.setState({
              base: { ...base, description: d },
            })
          }}
        />
      </View>)
  }

  renderColorPalletCreator(full) {
    const { base } = this.state
    const { hideTopMenu } = this.props

    return (
      <View
        style={{
          width: full ? '100%' : Dimensions.get('window').width,
          marginBottom: hideTopMenu ? 20 : 0,
        }}
      >
        <ColorPalletCreator
          base={base}
          full={full}
          onDone={() => {}}
        />
      </View>)
  }

  renderProductSelectButton(full) {
    const { base } = this.state
    const { addProductToMedia, hideTopMenu } = this.props

    return (
      <View
        style={{
          width: full ? '100%' : Dimensions.get('window').width,
          marginBottom: hideTopMenu ? 20 : 0,
        }}
      >
        <ProductSelector
          full={full}
          onPress={() => this.setState({ showMenuModal: false })}
          onSelect={(product) => {
            addProductToMedia(product, base.id)
            this.setState({
              base: {
                ...base,
                products: [
                  ...(base.products ? base.products.filter(t => t.id !== product.id) : []),
                  product,
                ],
              },
            })
          }}
        />
      </View>
    )
  }

  renderRemoveButton(full) {
    const { unshareMedia } = this.props
    const { base } = this.state

    return (
      <Button
        onPress={() => {
          Alert.alert(
            'Remove Media',
            'Your media will be permanently removed, are you sure you want to continue?',
            [
              { text: 'Cancel' },
              {
                text: 'Remove',
                onPress: () => {
                  unshareMedia(base)
                  this.setState({ showMenuModal: false })
                },
              },
            ],
            { cancelable: false }
          )
        }}
        raised={!full}
        buttonStyle={{
          backgroundColor: '#d9534f',
          borderRadius: full ? 0 : 15,
          marginLeft: 0,
        }}
        containerViewStyle={{ marginLeft: 'auto', marginRight: 'auto', width: full && '100%' }}
        color="#f5f5f5"
        large
        title="Remove"
      />
    )
  }

  renderMenuModal() {
    const { user, searchs } = this.props
    const { base, showMenuModal } = this.state
    const { usersMetadata } = searchs

    const isMe = base.userUsername === user.username
    let isProfilePicture = false

    if (isMe && usersMetadata[user.username].info) {
      isProfilePicture =
        usersMetadata[user.username].info.profile_picture === base.images.standard_resolution.url
    }

    return (
      <Modal
        isVisible={showMenuModal}
        avoidKeyboard
        swipeDirection="down"
        onSwipe={() => this.setState({ showMenuModal: false })}
      >
        <TouchableOpacity
          style={{ justifyContent: 'flex-end', height: '100%' }}
          onPress={() => this.setState({ showMenuModal: false })}
        >
          <View style={{ borderRadius: 15, width: '100%', overflow: 'hidden' }}>
            <View style={{ alignSelf: 'flex-end', width: '100%' }}>
              <Divider />
              {!isProfilePicture && this.renderSetProfilePictureButton(true)}
            </View>
            <View style={{ alignSelf: 'flex-end', width: '100%' }}>
              <Divider />
              {this.renderStyleSelectorButtton(true)}
            </View>
            <View style={{ alignSelf: 'flex-end', width: '100%' }}>
              <Divider />
              {this.renderColorPalletCreator(true)}
            </View>
            <View style={{ alignSelf: 'flex-end', width: '100%' }}>
              <Divider />
              {this.renderDescriptionChangeButton(true)}
            </View>
            <View style={{ alignSelf: 'flex-end', width: '100%' }}>
              <Divider />
              {this.renderProductSelectButton(true)}
            </View>
            <View style={{ alignSelf: 'flex-end', width: '100%' }}>
              <Divider />
              {this.renderRemoveButton(true)}
            </View>
          </View>

          <View style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>
            <Button
              onPress={() => this.setState({ showMenuModal: false })}
              buttonStyle={{
                backgroundColor: '#f0f0f0',
                borderRadius: 15,
                marginLeft: 0,
              }}
              containerViewStyle={{ width: '100%', marginLeft: 0 }}
              color="#0079ff"
              large
              title="Cancel"
            />
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }

  renderDraggable(colorKey) {
    const { onStartDrag, onFinishDrag, onPickedColor } = this.props
    const { imageWidth, imageHeight, imageName } = this.state
    return (
      <Draggable
        reverse={false}
        renderColor={this.state[colorKey]}
        renderText=""
        pressInDrag={() => onStartDrag && onStartDrag()}
        pressOutDrag={() => {
          if (onFinishDrag) onFinishDrag()
        }}
        pressDragRelease={() => {
          if (onPickedColor) onPickedColor(this.state[colorKey], colorKey)
        }}
        onMove={((x, y) => {
          this.autoHeightImageView.measure((fx, fy, w, h, px, py) => {
            const ix = ((x - px) / w) * imageWidth
            const iy = ((y - py) / h) * imageHeight
            getPixelRGBA(imageName, ix, iy)
              .then(c => this.setState({ [colorKey]: rgbToHex(c) }))
              .catch(() => {})
          })
        })}
      />
    )
  }

  render() {
    const { hideBottomMenu, hideTopMenu, user, showColordeaggablePicker } = this.props
    const { base, imageLoading, imageName } = this.state

    const isMe = base.userUsername === user.username

    if (!base || !base.userUsername) {
      return (<View />)
    }

    return (
      <View>
        { imageLoading &&
          <ActivityIndicator
            style={{ width: Dimensions.get('window').width }}
            size="large"
          /> }
        <View
          style={{
            width: Dimensions.get('window').width - 20,
            marginLeft: 'auto',
            marginRight: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
            borderColor: '#abbbcf',
          }}
        >
          <View ref={t => { this.autoHeightImageView = t }}>
            <AutoHeightImage
              z={2}
              width={Dimensions.get('window').width - 22}
              style={{ borderRadius: 9 }}
              onLoadEnd={() => this.setState({ imageLoading: false })}
              source={{ uri: `file://${imageName}` }}
            />
          </View>
          {showColordeaggablePicker && (
            <View style={{ width: '100%', padding: 10, marginLeft: 'auto', marginRight: 'auto' }}>
              <Text style={{ marginBottom: 10 }}>
                Drag the box below to the color you want to find the palette for
              </Text>
              {this.renderDraggable('draggableColor')}
            </View>
          )}
          {isMe && !hideTopMenu &&
            <View
              style={{ flexDirection: 'row', padding: 5, position: 'absolute', right: 0, top: 0 }}
            >
              <Icon
                raised
                color="#f5f5f5"
                containerStyle={{ backgroundColor: '#a0a0a0' }}
                onPress={() => this.setState({ showMenuModal: true })}
                name="ellipsis-h"
                type="font-awesome"
              />
              {this.renderMenuModal()}
            </View>
          }

          {!hideBottomMenu && this.renderBottomMenu()}

          {!showColordeaggablePicker &&
            <Divider style={{ width: '200%' }} />}
        </View>
      </View>
    )
  }
}

FeedItem.propTypes = {
  base: PropTypes.object,
  user: PropTypes.object,
  searchs: PropTypes.object,
  setFeedsSearchPhrase: PropTypes.func,
  setStyle: PropTypes.func,
  setDescription: PropTypes.func,
  isStyleClickEnabled: PropTypes.bool,
  setProfilePicture: PropTypes.func,
  addProductToMedia: PropTypes.func,
  unshareMedia: PropTypes.func,
  onPickedColor: PropTypes.func,
  onStartDrag: PropTypes.func,
  onFinishDrag: PropTypes.func,
  showColordeaggablePicker: PropTypes.bool,
  hideBottomMenu: PropTypes.bool,
  hideTopMenu: PropTypes.bool,
}

const mapStateToProps = state => ({
  user: state.user,
  searchs: state.searchs,
})

const mapDispatchToProps = dispatch => ({
  setFeedsSearchPhrase: (p) => dispatch(actions.setFeedsSearchPhrase(p)),
  setStyle: (id, style) => dispatch(actions.setStyle(id, style && style.toLowerCase())),
  setDescription: (id, description) => dispatch(actions.setDescription(id, description)),
  setProfilePicture: (media) => dispatch(actions.setProfilePicture(media)),
  unshareMedia: (media) => dispatch(actions.unshareMedia(media)),
  addProductToMedia: (product, mediaId) => dispatch(actions.addProductToMedia(product, mediaId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FeedItem)
