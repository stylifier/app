
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Animated,
} from 'react-native'

class SlideView extends Component {
  constructor(props) {
    super(props)

    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
    this.tapped = this.tapped.bind(this)

    const animatedOpacity = new Animated.Value(props.visible ? 1 : 0)
    animatedOpacity.addListener(value => {
      if (value.value === 0) {
        this.setState({ renderComponent: false })
      }
    })

    this.state = {
      renderComponent: props.visible,
      visible: props.visible,
      opacity: animatedOpacity,
    }
  }

  show() {
    this.setState({ renderComponent: true })

    Animated.timing(this.state.opacity, {
      toValue: 1.0,
      friction: this.props.friction,
      duration: this.props.duration,
    }).start()
  }

  hide() {
    if (this.props.closing) {
      this.props.closing()
    }

    Animated.timing(this.state.opacity, {
      toValue: 0,
      friction: this.props.friction,
      duration: this.props.duration,
    }).start()
  }

  componentWillReceiveProps(newProps) {
    if (this.state.visible === false && newProps.visible) {
      this.show()
    }
    if (this.state.visible === true && !newProps.visible) {
      this.hide()
    }
    if (this.state.visible !== newProps.visible) {
      this.setState({ visible: newProps.visible })
    }
  }

  tapped() {
    if (this.props.closeOnTap) {
      this.hide()
    }
  }

  render() {
    const absolute = {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    }

    const sliderStyle = {
      backgroundColor: 'transparent',
      opacity: this.state.opacity,
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: null,
    }

    if (this.state.renderComponent) {
      return (
        <Animated.View style={[absolute, sliderStyle, this.props.style]}>
          {this.props.children}
        </Animated.View>
      )
    }
    return <View />
  }
}

SlideView.propTypes = {
  friction: PropTypes.number,
  duration: PropTypes.number,
  closeOnTap: PropTypes.bool,
  style: PropTypes.object,
  visible: PropTypes.bool,
  closing: PropTypes.func,
}

SlideView.defaultProps = {
  friction: 1,
  duration: 255,
}

export default SlideView
