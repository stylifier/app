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


class ProccessAddingImage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isSharingView: false,
      isSharing: false,
      query: '',
    }
  }

  renderColorPick() {
    const { remoteImage } = this.props

    return (
      <View>
        <Text style={{ marginTop: 10, marginLeft: 10 }}>
          Tap on the color you want to find the pallet for:
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
                onPress={(t) => this.props.getColorPalletRecommendation(t)}
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

    return (<View>
      { remoteImage && remoteImage.colorCode && this.renderColorPick() }
      {!remoteImage && <ActivityIndicator size="small" color="#3b4e68" />}
      {colorPalletRecommendation && colorPalletRecommendation.map((cp, i) => (
        <ColorPallet
          key={i}
          base={cp}
        />)
      )}
    </View>)
  }

  render() {
    const { shareMedia, remoteImage } = this.props

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
            (this.state.isSharing ?
              <ActivityIndicator size="small" color="#3b4e68" style={{ marginRight: 30 }} /> :
              <Button
                color="black"
                backgroundColor="#f5f5f5"
                title={this.state.isSharingView ? 'Share' : 'To Share'}
                buttonStyle={{ padding: 0, margin: 0 }}
                onPress={() => {
                  if (!this.props.user.isLoggedInUser) {
                    Alert.alert(
                      'You are not logged in',
                      'In order share a media you need to login or create a user.',
                      [
                        { text: 'Dismiss' },
                        { text: 'Login', onPress: () => this.props.navigateToLogin() },
                      ],
                      { cancelable: false }
                    )
                    return
                  }

                  if (this.state.isSharingView) {
                    shareMedia(remoteImage)
                    this.setState({ isSharing: true })
                    return
                  }
                  this.setState({ isSharingView: true })
                }}
                rightIcon={{
                  color: 'black',
                  name: this.state.isSharingView ? 'share' : 'chevron-right',
                  type: 'font-awesome',
                }}
              />)
          }
          leftComponent={
            this.state.isSharingView ? <Button
              color={'black'}
              backgroundColor="#f5f5f5"
              title={'Back'}
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
        >
          {
            remoteImage &&
            <FeedItem
              hideTopMenu
              hideBottomMenu={!this.state.isSharingView}
              base={remoteImage}
            />
          }
          {!this.state.isSharingView && this.renderColorPalletSection()}

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
