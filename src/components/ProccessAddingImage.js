import React, { Component } from 'react'
import { SafeAreaView, View, ActivityIndicator, Text, Alert } from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Header, Button } from 'react-native-elements'
import PropTypes from 'prop-types'
import actions from '../actions'
import ColorView from './ColorView'
import ColorPallet from './ColorPallet'
import FeedItem from './FeedItem'
import ColorPalletCreator from './ColorPalletCreator'


class ProccessAddingImage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isSharingView: false,
      isSharing: false,
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

  componentWillUpdate(prevProps) {
    const { localImage } = this.props

    if (prevProps.localImage !== localImage) {
      this.setState({ isSharingView: false, isSharing: false })
    }
  }

  renderColorPalletSection() {
    const { remoteImage, colorPalletRecommendation } = this.props

    return (
      <View>
        { remoteImage && remoteImage.colorCode && this.renderColorPick() }
        {!remoteImage && <ActivityIndicator size="small" color="#3b4e68" />}
        {remoteImage &&
          <View style={{ padding: 20, margin: 'auto' }}>
            <ColorPalletCreator
              base={remoteImage}
              onDone={() => {}}
            />
          </View>}
        {colorPalletRecommendation && colorPalletRecommendation.map((cp, i) => (
          <ColorPallet
            key={i}
            base={cp}
          />)
        )}
      </View>)
  }

  render() {
    const { shareMedia, remoteImage, user,
      getColorPalletRecommendation, navigateToLogin } = this.props
    const { isSharing, isSharingView, desableScroll } = this.state

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Header
          outerContainerStyles={{ width: '100%', padding: 0, margin: 0, marginTop: -35 }}
          backgroundColor="#f5f5f5"
          rightComponent={
            (isSharing ?
              <ActivityIndicator size="small" color="#3b4e68" style={{ marginRight: 30 }} /> :
              <Button
                color="black"
                backgroundColor="#f5f5f5"
                title={isSharingView ? 'Share' : 'To Share'}
                buttonStyle={{ padding: 0, margin: 0 }}
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
                    this.setState({ isSharing: true })
                    return
                  }
                  this.setState({ isSharingView: true })
                }}
                rightIcon={{
                  color: 'black',
                  name: isSharingView ? 'share' : 'chevron-right',
                  type: 'font-awesome',
                }}
              />)
          }
          leftComponent={
            isSharingView ? <Button
              color="black"
              backgroundColor="#f5f5f5"
              title="Back"
              buttonStyle={{ padding: 0, margin: 0 }}
              onPress={() => this.setState({ isSharingView: false, isSharing: false })}
              leftIcon={{
                color: 'black',
                name: 'chevron-left',
                type: 'font-awesome',
              }}
            /> : {}
          }
        />
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
            remoteImage &&
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
          }
          {!isSharingView && this.renderColorPalletSection()}

        </KeyboardAwareScrollView>
      </SafeAreaView>
    )
  }
}

ProccessAddingImage.propTypes = {
  getColorPalletRecommendation: PropTypes.func,
  localImage: PropTypes.string,
  remoteImage: PropTypes.object,
  user: PropTypes.object,
  colorPalletRecommendation: PropTypes.array,
  shareMedia: PropTypes.func,
  navigateToLogin: PropTypes.func,
}

const mapStateToProps = state => ({
  localImage: state.colorSuggestion.localImage,
  colorPalletRecommendation: state.colorSuggestion.colorPalletRecommendation,
  remoteImage: state.colorSuggestion.remoteImage,
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  getColorPalletRecommendation: (base) =>
    dispatch(actions.getColorPalletRecommendation(base)),
  shareMedia: (media) => dispatch(actions.shareMedia(media)),
  navigateToLogin: () => dispatch(actions.moveToPage('Profile')),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProccessAddingImage)
