import React, { Component } from 'react'
import {
  View,
  PanResponder,
  Animated,
  Text,
  TouchableWithoutFeedback,
} from 'react-native'
import PropTypes from 'prop-types'
import { Badge } from 'react-native-elements'

class Draggable extends Component {
  constructor(props, defaultProps) {
    super(props, defaultProps)
    const { pressDragRelease, onMove } = props
    this.state = {
      pan: new Animated.ValueXY(),
      _value: { x: 0, y: 0 },
      px: 0,
      py: 0,
      hasMoved: false,
    }

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        this.state.pan.setOffset({ x: this.state._value.x, y: this.state._value.y })
        this.state.pan.setValue({ x: 0, y: 0 })
      },
      onPanResponderMove: Animated.event([null, {
        dx: this.state.pan.x,
        dy: this.state.pan.y,
      }], { listener: () => {
        this.draggable.measure((a, b, d, f, px, py) => {
          if (onMove) onMove(px + this.state._value.x + this.props.renderSize, py + this.state._value.y + this.props.renderSize)
        })
      } }),
      onPanResponderRelease: (e, gestureState) => {
        if (pressDragRelease) {
          pressDragRelease(e, gestureState)
        }
        this.state.pan.flattenOffset()
      },
    })
  }

  componentWillMount() {
    this.state.pan.addListener((c) => { this.state._value = c })
  }

  componentWillUnmount() {
    this.state.pan.removeAllListeners()
    clearInterval(this.measureInterval)
  }

  _positionCss() {
    return {
      zIndex: 999,
      position: this.state.hasMoved ? 'absolute' : 'relative',
      top: this.state.py,
      left: this.state.px - (this.state.hasMoved ? this.props.renderSize : 0),
    }
  }

  _dragItemCss() {
    const { renderSize, renderColor } = this.props
    return {
      backgroundColor: renderColor,
      alignItems: 'center',
      justifyContent: 'center',
      width: renderSize * 2,
      height: renderSize * 2,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: 'lightblue',
    }
  }

  render() {
    const { pressInDrag, pressOutDrag, renderText } = this.props

    return (
      <View>
        <View style={this._positionCss()} ref={view => { this.draggable = view }}>
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[this.state.pan.getLayout()]}
          >
            <TouchableWithoutFeedback
              onPress={() => this.setState({ hasMoved: true }) && pressInDrag && pressInDrag()}
              onPressIn={pressInDrag}
              onPressOut={pressOutDrag}
            >
              <View style={this._dragItemCss()} >
                {renderText &&
                  <Badge
                    containerStyle={{ backgroundColor: '#5b7495' }}
                  >
                    <Text style={{ color: '#f5f5f5' }}>{renderText}</Text>
                  </Badge>}
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
        <View
          style={{
            marginTop: !this.state.hasMoved ? 0 : 72,
          }}
        />
      </View>
    )
  }
}

Draggable.propTypes = {
  renderSize: PropTypes.number,
  renderColor: PropTypes.string,
  pressDrag: PropTypes.func,
  onMove: PropTypes.func,
  renderText: PropTypes.string,
  pressDragRelease: PropTypes.func,
  pressInDrag: PropTypes.func,
  pressOutDrag: PropTypes.func,
  z: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
}

Draggable.defaultProps = {
  renderColor: 'yellowgreen',
  renderSize: 36,
}

export default Draggable
