import React, { Component } from 'react'
import { Header, Left, Text, Icon, Button as NBButton,
  Container, Right } from 'native-base'
import { View, ActivityIndicator, Alert } from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PropTypes from 'prop-types'
import actions from '../actions'
import ColorView from '../components/ColorView'
import ColorPallet from '../components/ColorPallet'
import FeedItem from '../components/FeedItem'
import ColorPalletCreator from '../components/ColorPalletCreator'


class ProccessAddingImage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      desableScroll: false,
    }
  }

  renderColorPick() {
    const { remoteImage, getColorPalletRecommendation } = this.props

    return (
      <View style={{ padding: 5 }}>
        <Text style={{ marginLeft: 10 }}>
          Or tap on one of color boxes
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: '3%',
            width: '100%',
          }}
        >
          {
            remoteImage.colorCode.match(/.{1,6}/g).map((c, i) => (
              <ColorView
                onPress={(t) => {
                  getColorPalletRecommendation(t)
                  this.scrollView.scrollToPosition(0, 350)
                }}
                key={i}
                base={c}
              />
            ))
          }
        </View>
      </View>
    )
  }

  renderColorPalletSection() {
    const { remoteImage, colorPalletRecommendation } = this.props

    return (
      <View>
        { remoteImage ? remoteImage.colorCode && this.renderColorPick() : undefined}
        {!remoteImage ? <ActivityIndicator size="small" color="#3b4e68" /> : undefined}
        {remoteImage ?
          <View style={{ padding: 20, margin: 'auto' }}>
            <ColorPalletCreator
              base={remoteImage}
              onDone={() => {}}
            />
          </View> : undefined}
        {colorPalletRecommendation ? colorPalletRecommendation.map((cp, i) => (
          <ColorPallet
            key={i}
            base={cp}
            hideOutfits
          />)
        ) : undefined}
      </View>)
  }

  render() {
    const { shareMedia, remoteImage, user, goBack, isSharingView, toggleSharingScreenInProcessImage,
      getColorPalletRecommendation, navigateToLogin, localImage } = this.props
    const { desableScroll } = this.state

    return (
      <Container key={localImage}>
        <Header>
          <Left>
            <NBButton
              transparent
              onPress={() => {
                if (isSharingView) {
                  return toggleSharingScreenInProcessImage(false)
                }
                return goBack()
              }}
            >
              <Icon name="arrow-back" />
              <Text> Back </Text>
            </NBButton>
          </Left>
          <Right>
            <NBButton
              transparent
              onPress={() => {
                if (!user.isLoggedInUser) {
                  Alert.alert(
                    'You are not logged in',
                    'In order share a media you need to login or create a user.',
                    [
                      { text: 'Dismiss' },
                      { text: 'Login', onPress: () => navigateToLogin() },
                    ],
                    { cancelable: false }
                  )
                  return
                }

                if (isSharingView) {
                  shareMedia(remoteImage)
                  return
                }
                toggleSharingScreenInProcessImage(true)
              }}
            >
              <Text>
                {isSharingView ? 'Share' : 'To Share'}
              </Text>
              <Icon name={isSharingView ? 'share' : 'arrow-forward'} />
            </NBButton>
          </Right>
        </Header>
        <KeyboardAwareScrollView
          style={{
            height: '100%',
            width: '100%',
            paddingTop: 30,
          }}
          scrollEnabled={!desableScroll}
          ref={scrollView => { this.scrollView = scrollView }}
        >
          {
            remoteImage ?
              <FeedItem
                hideTopMenu
                hideBottomMenu={!isSharingView}
                base={remoteImage}
                showColordeaggablePicker={!isSharingView}
                onPickedColor={(t) => {
                  getColorPalletRecommendation(t.replace('#', ''))
                  this.scrollView.scrollToPosition(0, 350)
                }}
                onStartDrag={() => this.setState({ desableScroll: true })}
                onFinishDrag={() => this.setState({ desableScroll: false })}
              />
              : undefined}
          {!isSharingView ? this.renderColorPalletSection() : undefined}

        </KeyboardAwareScrollView>
      </Container>
    )
  }
}

ProccessAddingImage.propTypes = {
  getColorPalletRecommendation: PropTypes.func,
  isSharingView: PropTypes.bool,
  remoteImage: PropTypes.object,
  user: PropTypes.object,
  colorPalletRecommendation: PropTypes.array,
  shareMedia: PropTypes.func,
  goBack: PropTypes.func,
  localImage: PropTypes.string,
  navigateToLogin: PropTypes.func,
  toggleSharingScreenInProcessImage: PropTypes.func
}

const mapStateToProps = state => ({
  localImage: state.colorSuggestion.localImage,
  isSharingView: state.colorSuggestion.isSharingView,
  colorPalletRecommendation: state.colorSuggestion.colorPalletRecommendation,
  remoteImage: state.colorSuggestion.remoteImage,
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  getColorPalletRecommendation: (base) =>
    dispatch(actions.getColorPalletRecommendation(base)),
  goBack: () => dispatch(actions.goBack()),
  shareMedia: (media) => dispatch(actions.shareMedia(media)),
  navigateToLogin: () => dispatch(actions.moveToPage('Profile')),
  toggleSharingScreenInProcessImage: (i) => dispatch(actions.toggleSharingScreenInProcessImage(i)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProccessAddingImage)
