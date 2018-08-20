import React, { Component } from 'react'
import { Animated, Easing, View, TouchableOpacity, Alert, Linking } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import ImageCropPicker from 'react-native-image-crop-picker'
import actions from '../actions'

const SIZE = 80
const durationIn = 200
const durationOut = 110

class AddButton extends Component {
  constructor(props) {
    super(props)
    this.mode = new Animated.Value(0)
    this.icon1 = new Animated.Value(0)
    this.icon2 = new Animated.Value(0)
    this.icon3 = new Animated.Value(0)

    ImageCropPicker.clean()
    .then(() => {})
    .catch(() => {})
  }

  toggleView() {
    const { user } = this.props

    if (user.addMenuClosed) {
      Animated.parallel(
        [this.mode, this.icon1, this.icon2, this.icon3].map((item) => Animated.timing(item, {
          toValue: 0,
          duration: durationIn,
          easing: Easing.cubic,
        }))
      ).start()
    } else {
      Animated.parallel([
        Animated.timing(this.mode, {
          toValue: 1,
          duration: durationOut,
          easing: Easing.cubic,
        }),
        Animated.sequence([
          ...[this.icon1, this.icon2, this.icon3].map((item) => Animated.timing(item, {
            toValue: 1,
            duration: durationOut,
            easing: Easing.elastic(1),
          })),
        ]),
      ]).start()
    }
  }

  renderCameraPick() {
    const x = this.icon3.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 60],
    })
    const y = this.icon3.interpolate({
      inputRange: [0, 1],
      outputRange: [10, -50],
    })
    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: x,
          top: y,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            ImageCropPicker.openCamera({
              width: 500,
              height: 500,
              cropping: true,
            }).then(image => {
              this.props.toggleAddMenu()
              this.props.imagePicked()
              this.props.imageResized(image.path)
            })
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
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            width: SIZE / 1.8,
            height: SIZE / 1.8,
            borderRadius: SIZE / 2,
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
      </Animated.View>
    )
  }

  renderImagePick() {
    const x = this.icon1.interpolate({
      inputRange: [0, 1],
      outputRange: [20, -20],
    })
    const y = this.icon1.interpolate({
      inputRange: [0, 1],
      outputRange: [10, -50],
    })
    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: x,
          top: y,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            ImageCropPicker.openPicker({
              width: 500,
              height: 500,
              cropping: true,
            }).then(image => {
              this.props.toggleAddMenu()
              this.props.imagePicked()
              this.props.imageResized(image.path)
            })
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
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            width: SIZE / 1.8,
            height: SIZE / 1.8,
            borderRadius: SIZE / 2,
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
        </TouchableOpacity>
      </Animated.View>
    )
  }

  render() {
    this.toggleView()

    const rotation = this.mode.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    })
    return (
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
        }}
      >
        {this.renderImagePick()}
        {this.renderCameraPick()}
        <Animated.View
          style={{
            transform: [
              { rotate: rotation },
            ],
            alignItems: 'center',
            justifyContent: 'center',
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            backgroundColor: '#ea5e85',
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2,
            }}
          >
            <FontAwesome
              style={{
                fontSize: 32,
                color: '#F5F5F5',
              }}
            >
              {Icons.plus}
            </FontAwesome>
          </View>
        </Animated.View>
      </View>
    )
  }
}

AddButton.propTypes = {
  toggleAddMenu: PropTypes.func,
  imageResized: PropTypes.func,
  imagePicked: PropTypes.func,
  bookmarks: PropTypes.array,
  user: PropTypes.object,
}

const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  toggleAddMenu: () =>
    dispatch(actions.toggleAddMenu()),
  imageResized: (img) =>
    dispatch(actions.colorSuggestionImageResized(img)),
  imagePicked: () =>
    dispatch(actions.colorSuggestionImagePicked()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddButton)
