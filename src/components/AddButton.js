import React, { Component } from 'react'
import { Animated, Easing, View, TouchableOpacity, Alert, Linking } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import ImageCropPicker from 'react-native-image-crop-picker'
import actions from '../actions'

const durationIn = 200
const durationOut = 110

class AddButton extends Component {
  constructor(props) {
    super(props)
    this.mode = new Animated.Value(0)
    this.icon1 = new Animated.Value(0)
    this.icon2 = new Animated.Value(0)
    this.icon3 = new Animated.Value(0)

    this.state = {
      addButtonSize: 80,
      secondaryButtonsSize: 40,
    }

    ImageCropPicker.clean()
      .then(() => {})
      .catch(() => {})

    this.addButtonSizeAnimation = new Animated.Value(0)
  }

  componentWillUpdate(nextProps) {
    if (nextProps.nav.index !== this.props.nav.index) {
      Animated.timing(
        this.addButtonSizeAnimation,
        {
          toValue: nextProps.nav.index === 3 ? 1 : 0,
          duration: 500,
          easing: Easing.bounce
        }
      ).start()

      if (nextProps.nav.index === 3) {
        this.setState({ addButtonSize: 50 })
      } else {
        setTimeout(() => this.setState({ addButtonSize: 80 }), 200)
      }
    }
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
    const { addButtonSize, secondaryButtonsSize } = this.state
    const x = this.icon3.interpolate({
      inputRange: [0, 1],
      outputRange: [
        (addButtonSize / 2) - (secondaryButtonsSize / 2),
        ((addButtonSize / 2) - (secondaryButtonsSize / 2)) + 40,
      ],
    })
    const y = this.icon3.interpolate({
      inputRange: [0, 1],
      outputRange: [
        (addButtonSize / 2) - (secondaryButtonsSize / 2),
        -60,
      ],
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
            width: secondaryButtonsSize,
            height: secondaryButtonsSize,
            borderRadius: secondaryButtonsSize,
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
    const { addButtonSize, secondaryButtonsSize } = this.state
    const x = this.icon1.interpolate({
      inputRange: [0, 1],
      outputRange: [
        (addButtonSize / 2) - (secondaryButtonsSize / 2),
        ((addButtonSize / 2) - (secondaryButtonsSize / 2)) - 40,
      ],
    })
    const y = this.icon1.interpolate({
      inputRange: [0, 1],
      outputRange: [(addButtonSize / 2) - (secondaryButtonsSize / 2), -60],
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
            width: secondaryButtonsSize,
            height: secondaryButtonsSize,
            borderRadius: secondaryButtonsSize,
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

    const addButtonSizeInterpolate = this.addButtonSizeAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 50],
    })

    const { addButtonSize } = this.state
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
            width: addButtonSizeInterpolate,
            height: addButtonSizeInterpolate,
            borderRadius: 100,
            backgroundColor: '#ea5e85',
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: addButtonSize,
              height: addButtonSize,
              borderRadius: addButtonSize / 2,
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
  nav: PropTypes.object,
}

const mapStateToProps = (state) => ({
  user: state.user,
  nav: state.nav,
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
