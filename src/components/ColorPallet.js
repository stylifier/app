import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Text,
  Clipboard,
  Modal as RNModal,
  Alert,
  StatusBar,
} from 'react-native'
import { Button as RNEButton } from 'react-native-elements'
import Modal from 'react-native-modal'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import PropTypes from 'prop-types'
import { Text as NBText, Button, Separator, Icon } from 'native-base'
import { connect } from 'react-redux'
import actions from '../actions'
import ProductItem from './ProductItem'
import ProfilePage from './Profile'
import Viewer from './Viewer'

class ColorPallet extends Component {
  constructor(props) {
    super(props)

    this.animationDict = []
    this.state = {
      openedIndex: -1,
      showProfile: false,
      showMenuModal: false,
      title: props.base && props.base.title,
    }
  }

  renderOutfitMoreModal(oufitId) {
    const { showMenuModal } = this.state
    const { removeOutfit } = this.props
    return (
      <View>
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
            <View style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>
              <RNEButton
                onPress={() => {
                  this.setState({ showMenuModal: false })
                  this.createOutfitPressed(oufitId)
                }}
                buttonStyle={{
                  backgroundColor: '#f0f0f0',
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  marginLeft: 0,
                }}
                containerViewStyle={{ width: '100%', marginLeft: 0 }}
                color="#0079ff"
                title="Edit"
                large
              />
              <RNEButton
                onPress={() => {
                  this.setState({ showMenuModal: false })
                  removeOutfit(oufitId)
                }}
                buttonStyle={{
                  backgroundColor: '#d9534f',
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                  marginLeft: 0,
                }}
                containerViewStyle={{ width: '100%', marginLeft: 0 }}
                color="#f5f5f5"
                title="Remove"
                large
              />
            </View>
            <View style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>
              <RNEButton
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
        <Button
          style={{ borderRadius: 15, backgroundColor: '#3b4e68', marginRight: 5, marginBottom: 5 }}
          info
          onPress={() => this.setState({ showMenuModal: true })}
        >
          <Icon
            style={{ fontSize: 38, marginTop: -4 }}
            name="ios-more"
          />
        </Button>
      </View>
    )
  }

  createOutfitPressed(outfitId) {
    const { refereshUserInfo, refreshCategories, navigateToCreateOutfit,
      user, refreshColorCode, navigateToLogin, base } = this.props

    refereshUserInfo()
    refreshCategories()
    refreshColorCode()

    if (user.isLoggedInUser) return navigateToCreateOutfit(base.id, outfitId)

    return Alert.alert(
      'You are not logged in',
      'In order to use "Creating Outfit" feature you need to login or create a user.',
      [
        { text: 'Dismiss' },
        { text: 'Login', onPress: () => navigateToLogin() },
      ],
      { cancelable: false }
    )
  }

  renderTitle() {
    const { base, bookmarkColorPallet } = this.props
    const { title } = this.state

    return (
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <TextInput
          style={{
            height: 40,
            marginRight: 'auto',
            minWidth: '50%',
            maxWidth: '50%',
          }}
          placeholder="Your custom title message"
          value={title}
          returnKeyType="done"
          onChangeText={(text) => {
            this.setState({ title: text })
            clearTimeout(this.editTimer)
            this.editTimer = setTimeout(() =>
              bookmarkColorPallet(base.id, text), 2000)
          }}
        />
        <Button
          onPress={() => this.createOutfitPressed()}
          style={{
            backgroundColor: '#ea5e85',
            marginBottom: 5,
            borderRadius: 15
          }}
        >
          <Icon name="add" style={{ marginRight: -10, color: 'white' }} />
          <NBText> Create Outfit </NBText>
        </Button>
      </View>
    )
  }

  componentWillMount() {
    this.animationDict[0] = new Animated.Value(100)
    this.animationDict[1] = new Animated.Value(60)
    this.animationDict[2] = new Animated.Value(60)
    this.animationDict[3] = new Animated.Value(60)
  }

  expandOne(k) {
    this.animationDict.forEach((a, i) => {
      Animated.timing(this.animationDict[i], {
        toValue: i === k ? 200 : 60,
        duration: 300,
        easing: Easing.ease,
      }).start()
    })
    this.setState({ openedIndex: k })
  }

  collapsedAll() {
    this.animationDict.forEach((a, i) => {
      Animated.timing(this.animationDict[i], {
        toValue: i === 0 ? 100 : 60,
        duration: 300,
        easing: Easing.ease,
      }).start()
    })
    this.setState({ openedIndex: -1 })
  }

  renderOutfits() {
    const { outfits, base } = this.props

    return outfits.map((outfit, i) => (
      <View key={i}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ width: '100%' }}>
            <Separator bordered style={{ height: 54 }}>
              <View style={{ width: 'auto', marginLeft: 'auto', marginRight: 5, marginTop: 2 }}>
                {this.renderOutfitMoreModal(outfit.id)}
              </View>
            </Separator>
          </View>
          <Viewer
            items={outfit.items.map(t => t.product)}
            BaseItem={ProductItem}
            itemExtraProps={{ colorPalletId: base.id }}
            itemStyleOverwrite={{ margin: 10, marginLeft: 'auto', marginRight: 'auto' }}
          />
        </View>
      </View>))
  }

  render() {
    const { base, bookmarks, deleteBookmarkedColorPallet,
      bookmarkColorPallet, outfits, hideOutfits } = this.props
    const { openedIndex, showCopied, showProfile } = this.state

    const bookmarked =
      bookmarks.filter(p => p.code === base.code).length > 0

    return (
      <View>
        <View
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: 10,
            marginTop: 10,
            marginBottom: 5,
            width: '95%',
          }}
        >
          <StatusBar barStyle="dark-content" />
          {bookmarked && this.renderTitle()}
          <View
            style={{
              borderRadius: 10,
              borderColor: '#66bfc7',
              borderWidth: -2,
            }}
          >
            <View
              style={{
                width: '100%',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: 10,
                borderWidth: 2,
                borderColor: '#3b4e68',
              }}
            >
              {base.code.match(/.{1,6}/g).map((c, i) => (
                <Animated.View
                  style={{
                    width: '100%',
                    height: this.animationDict[i],
                  }}
                  key={i}
                >
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: `#${c}`,
                    }}
                    underlayColor={`#${c}`}
                    onPress={() => {
                      if (openedIndex === i) {
                        this.collapsedAll()
                        return
                      }
                      this.expandOne(i)
                    }}
                  >
                    {(openedIndex === i) && (
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 7,
                          right: 7,
                          padding: 5,
                          backgroundColor: 'rgba(59, 78, 104, 0.5)',
                          borderRadius: 3,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {!showCopied ?
                          <TouchableOpacity
                            style={{ flexDirection: 'row' }}
                            onPress={() => {
                              Clipboard.setString(`#${c}`)
                              this.setState({ showCopied: true })

                              setTimeout(() => {
                                this.setState({ showCopied: false })
                              }, 1000)
                            }}
                          >
                            <FontAwesome
                              style={{
                                marginRight: 7,
                                color: '#F5F5F5',
                              }}
                            >
                              {Icons.copy}
                            </FontAwesome>
                            <Text
                              style={{
                                color: '#f5f5f5',
                              }}
                            >
                              #
                              {c}
                            </Text>
                          </TouchableOpacity> :
                          <Text
                            style={{
                              color: '#f5f5f5',
                            }}
                          >
                              Copied!
                          </Text>
                        }
                      </View>)}
                  </TouchableOpacity>
                </Animated.View>)
              )}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 7,
                  right: 7,
                  width: 35,
                  height: 35,
                  backgroundColor: 'rgba(59, 78, 104, 0.5)',
                  borderRadius: 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  if (bookmarked) {
                    Alert.alert(
                      'Remove Bookmarked Color Palette',
                      'Removeing bookmarked Color Palette woule cause your created outfit ' +
                        'to be removed as well. Are you sure you want to continue?',
                      [
                        { text: 'Cancel' },
                        {
                          text: 'Remove',
                          onPress: () => {
                            deleteBookmarkedColorPallet(base.id)
                          },
                        },
                      ],
                      { cancelable: false }
                    )
                    return
                  }
                  bookmarkColorPallet(base.id)
                }}
              >
                <FontAwesome
                  style={{
                    fontSize: 24,
                    color: bookmarked ? '#66bfc7' : '#f5f5f5',
                  }}
                >
                  {Icons.bookmark}
                </FontAwesome>
              </TouchableOpacity>
              <View
                style={{
                  position: 'absolute',
                  left: 7,
                  top: 7,
                  padding: 5,
                  backgroundColor: 'rgba(59, 78, 104, 0.5)',
                  borderRadius: 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#f5f5f5' }}>
                  Popularity:
                  {Math.round(base.popularity * 10) / 10}
                  / 5
                </Text>
              </View>
            </View>
          </View>
          {base.creator_username ? base.creator_username.length < 30 &&
            <NBText
              style={{ marginLeft: 'auto' }}
              onPress={() => this.setState({ showProfile: true })}
            >
              Created By: @
              {base.creator_username.replace('m_g_i_o_s_', '')}
            </NBText> : undefined}
          {base.creator_username ?
            <RNModal
              animationType="slide"
              transparent={false}
              visible={showProfile}
            >
              <ProfilePage
                onDismissPressed={() => this.setState({ showProfile: false })}
                base={{ username: base.creator_username }}
              />
            </RNModal> : undefined}
        </View>
        {outfits.length > 0 && !hideOutfits && this.renderOutfits()}
      </View>
    )
  }
}

ColorPallet.propTypes = {
  bookmarkColorPallet: PropTypes.func,
  deleteBookmarkedColorPallet: PropTypes.func,
  refereshUserInfo: PropTypes.func,
  refreshCategories: PropTypes.func,
  refreshColorCode: PropTypes.func,
  navigateToCreateOutfit: PropTypes.func,
  base: PropTypes.object,
  bookmarks: PropTypes.array,
  outfits: PropTypes.array,
  user: PropTypes.object,
  hideOutfits: PropTypes.bool,
  navigateToLogin: PropTypes.func,
  removeOutfit: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  bookmarks: state.bookmarks,
  outfits: state.outfits
    .filter(t => !!t && t.id)
    .filter(t => t.palletId === ownProps.base.id)
    .filter(t => t.items.length > 0)
    .map(o => ({ ...o, items: o.items.filter(p => !!p.product) }))
})

const mapDispatchToProps = dispatch => ({
  refereshUserInfo: () => dispatch(actions.refereshUserInfo()),
  refreshCategories: () => dispatch(actions.refreshCategories()),
  refreshColorCode: () => dispatch(actions.refreshColorCode()),
  navigateToLogin: () => dispatch(actions.moveToPage('Profile')),
  bookmarkColorPallet: (palletId, title) =>
    dispatch(actions.bookmarkColorPallet(palletId, title)),
  deleteBookmarkedColorPallet: (palletId) =>
    dispatch(actions.deleteBookmarkedColorPallet(palletId)),
  navigateToCreateOutfit: (colorPalletId, outfitId) => {
    dispatch(actions.moveToPage('CreateOutfit', { colorPalletId, outfitId }))
    if (outfitId) return
    dispatch(actions.createOutfit({ items: [] }))
  },
  removeOutfit: (outfitId) => {
    dispatch(actions.createOutfit({ id: outfitId, items: [] }))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ColorPallet)
