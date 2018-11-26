import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Text,
  Clipboard,
  Modal,
  Alert,
  StatusBar,
} from 'react-native'
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
    }
  }

  renderCreateOutfitButton(outfitId) {
    const { refereshUserInfo, refreshCategories, navigateToCreateOutfit,
      user, refreshColorCode, navigateToLogin, base } = this.props

    return (
      <Button
        onPress={() => {
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
        }}
        style={{
          backgroundColor: outfitId ? '#3b4e68' : '#ea5e85',
          marginBottom: 5,
          borderRadius: 15
        }}
      >
        <Icon name={outfitId ? 'swap' : 'add'} style={{ marginRight: -5 }} />
        <NBText>
          {outfitId ? 'Edit Outfit' : 'Create Outfit'}
        </NBText>
      </Button>)
  }


  renderTitle() {
    const { base, bookmarkColorPallet } = this.props

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
          value={base.title}
          returnKeyType="done"
          onChangeText={(text) => {
            clearTimeout(this.editTimer)
            this.editTimer = setTimeout(() =>
              bookmarkColorPallet(base.id, text), 2000)
          }}
        />
        {this.renderCreateOutfitButton()}

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
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          <View style={{ width: '100%' }}>
            <Separator bordered style={{ height: 54 }}>
              <View style={{ width: 'auto', marginLeft: 'auto', marginRight: 5, marginTop: 2 }}>
                {this.renderCreateOutfitButton(outfit.id)}
              </View>
            </Separator>
          </View>
          <Viewer
            styleOverwrite={{ padding: 10 }}
            items={outfit.items.map(t => t.product)}
            BaseItem={ProductItem}
            itemExtraProps={{ colorPalletId: base.id }}
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
            flex: 1,
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
                      'Remove Bookmarked Colorpallet',
                      'Removeing bookmarked Colorpallet woule cause your created outfit ' +
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
          {base.creator_username &&
            <NBText
              style={{ marginLeft: 'auto' }}
              onPress={() => this.setState({ showProfile: true })}
            >
              Created By: @
              {base.creator_username.replace('m_g_i_o_s_', '')}
            </NBText>}
          {base.creator_username &&
            <Modal
              animationType="slide"
              transparent={false}
              visible={showProfile}
            >
              <ProfilePage
                onDismissPressed={() => this.setState({ showProfile: false })}
                base={{ username: base.creator_username }}
              />
            </Modal>}
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
  bookmarkColorPallet: (palletId, title) =>
    dispatch(actions.bookmarkColorPallet(palletId, title)),
  deleteBookmarkedColorPallet: (palletId) =>
    dispatch(actions.deleteBookmarkedColorPallet(palletId)),
  refereshUserInfo: () =>
    dispatch(actions.refereshUserInfo()),
  refreshCategories: () =>
    dispatch(actions.refreshCategories()),
  refreshColorCode: () =>
    dispatch(actions.refreshColorCode()),
  navigateToLogin: () => dispatch(
    actions.moveToPage('Profile')
  ),
  navigateToCreateOutfit: (colorPalletId, outfitId) => dispatch(
    actions.moveToPage('CreateOutfit', { colorPalletId, outfitId })
  ),
})

export default connect(mapStateToProps, mapDispatchToProps)(ColorPallet)
