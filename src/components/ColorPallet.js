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
import { NavigationActions } from 'react-navigation'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import PropTypes from 'prop-types'
import { Text as NBText } from 'native-base'
import { connect } from 'react-redux'
import actions from '../actions'
import CreateOutfit from './CreateOutfit'
import ProductItem from './ProductItem.js'
import ProfilePage from './ProfilePage'


const makeid = () => {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}


class ColorPallet extends Component {
  constructor(props) {
    super(props)

    this.animationDict = []
    this.state = {
      modalVisible: false,
      openedIndex: -1,
      showProfile: false,
    }
  }

  renderCreateOutfitButton(outfitId) {
    return (<TouchableOpacity
      style={{
        flexDirection: 'row',
        backgroundColor: '#ea5e85',
        borderRadius: 10,
        marginLeft: 7,
        marginTop: 7,
        marginBottom: 7,
        padding: 4,
        paddingRight: 7,
        paddingLeft: 7,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={() => {
        this.props.refereshUserInfo()
        this.props.refreshCategories()
        this.props.refreshColorCode()

        if (!this.props.user.isLoggedInUser) {
          Alert.alert(
            'You are not logged in',
            'In order to use "Creating Outfit" feature you need to login or create a user.',
            [
              { text: 'Dismiss' },
              { text: 'Login', onPress: () => this.props.navigateToLogin() },
            ],
            { cancelable: false }
          )
          return
        }
        this.setState({ outfitTitle: outfitId || makeid() })
        this.setModalVisible(!this.state.modalVisible)
      }}
    >
      <FontAwesome
        style={{
          marginRight: 7,
          color: '#F5F5F5',
        }}
      >
        {Icons.plus}
      </FontAwesome>
      <Text
        style={{
          color: '#f5f5f5',
        }}
      >
        {outfitId ? 'Add More Item' : 'Create Outfit'}
      </Text>
    </TouchableOpacity>)
  }

  renderTitle() {
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
          value={this.props.base.title}
          returnKeyType="done"
          onChangeText={(text) => {
            clearTimeout(this.editTimer)
            this.editTimer = setTimeout(() =>
              this.props.bookmarkColorPallet(this.props.base.id, text)
            , 2000)
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

  renderCreateOutfitModal() {
    return (<CreateOutfit
      onDismissPressed={() => this.setModalVisible(false)}
      colorPallet={this.props.base.code}
      colorPalletId={this.props.base.id}
      title={this.state.outfitTitle}
    />)
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

  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }

  renderOutfits() {
    const productBookmarks =
      this.props.productBookmarks.filter(p =>
        p.palletId === this.props.base.id) || []

    const titles = productBookmarks
      .map(tt => tt.title)
      .filter((item, ii, ar) => ar.indexOf(item) === ii)

    return titles.map((title, i) => (
      <View
        key={i}
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%',
          padding: 10,
        }}
      >
        {productBookmarks
          .filter(pt => pt.title === title)
          .map((t, ind) => (
            <ProductItem
              key={ind}
              base={t.product}
              colorPalletId={this.props.base.id}
            />
          ))}
        <View style={{ width: '100%' }}>
          <View style={{ width: 'auto', marginLeft: 'auto' }}>
            {this.renderCreateOutfitButton(title)}
          </View>
        </View>
      </View>))
  }

  render() {
    const { base } = this.props

    const bookmarked =
      this.props.bookmarks.filter(p => p.code === base.code).length > 0

    const productBookmarks =
      this.props.productBookmarks.filter(p =>
        p.palletId === base.id) || []

    return (
      <View
        style={{
          flex: 1,
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 10,
          marginTop: 10,
          width: '95%',
        }}
      >
        <StatusBar barStyle="dark-content" />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
        >
          {this.renderCreateOutfitModal()}
        </Modal>


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
                    if (this.state.openedIndex === i) {
                      this.collapsedAll()
                      return
                    }
                    this.expandOne(i)
                  }}
                >
                  {(this.state.openedIndex === i) && (<View
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
                    {!this.state.showCopied ?
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
                          #{c}
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
                          this.props.deleteBookmarkedColorPallet(base.id)
                        },
                      },
                    ],
                    { cancelable: false }
                  )
                  return
                }
                this.props.bookmarkColorPallet(base.id)
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
              <Text style={{ color: '#f5f5f5' }} >
                Popularity: {Math.round(base.popularity * 10) / 10} / 5
              </Text>
            </View>
          </View>

          {productBookmarks.length > 0 &&
            <View
              style={{
                width: '100%',
                marginTop: -20,
                paddingTop: 30,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderWidth: 2,
                borderColor: '#3b4e68',
                borderTopWidth: 0,
              }}
            >
              {this.renderOutfits()}
            </View>
          }
        </View>
        {base.creator_username && <NBText
          style={{ marginLeft: 'auto' }}
          onPress={() => this.setState({ showProfile: true })}
        >
          Created By: @{base.creator_username.replace('m_g_i_o_s_', '')}
        </NBText>}
        {base.creator_username && <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showProfile}
        >
          <ProfilePage
            onDismissPressed={() => this.setState({ showProfile: false })}
            base={{ username: base.creator_username }}
          />
        </Modal>}
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
  base: PropTypes.object,
  bookmarks: PropTypes.array,
  productBookmarks: PropTypes.array,
  showTitle: PropTypes.bool,
  user: PropTypes.object,
  navigateToLogin: PropTypes.func,
}

const mapStateToProps = state => ({
  user: state.user,
  bookmarks: state.bookmarks,
  productBookmarks: state.productBookmarks,
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
    NavigationActions.navigate({ routeName: 'Profile' })
  ),
})

export default connect(mapStateToProps, mapDispatchToProps)(ColorPallet)
