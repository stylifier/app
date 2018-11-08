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
    const p = new Animated.ValueXY()
    this.state = {
      pan: p,
      _value: { x: 0, y: 0 },
      px: 0,
      py: 0,
      hasMoved: false,
    }

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        const { pan, _value } = this.state
        pan.setOffset({ x: _value.x, y: _value.y })
        pan.setValue({ x: 0, y: 0 })
      },
      onPanResponderMove: Animated.event([null, { dx: p.x, dy: p.y, }], { listener: () => {
        this.draggable.measure((a, b, d, f, px, py) => {
          const { _value } = this.state
          const { renderSize } = this.props
          if (onMove) {
            onMove(
              px + _value.x + renderSize,
              py + _value.y + renderSize
            )
          }
        })
      } }),
      onPanResponderRelease: (e, gestureState) => {
        const { pan } = this.state
        if (pressDragRelease) {
          pressDragRelease(e, gestureState)
        }
        pan.flattenOffset()
      },
    })
  }

  componentWillMount() {
    const { pan } = this.state
    pan.addListener((c) => { this.state._value = c })
  }

  componentWillUnmount() {
    const { pan } = this.state
    pan.removeAllListeners()
    clearInterval(this.measureInterval)
  }

  render() {
    const { pressInDrag, pressOutDrag, renderText, renderSize, renderColor } = this.props
    const { hasMoved, py, px, pan } = this.state

    return (
      <View>
        <View
          style={{
            zIndex: 999,
            position: hasMoved ? 'absolute' : 'relative',
            top: py,
            left: px - (hasMoved ? renderSize : 0),
          }}
          ref={view => { this.draggable = view }}
        >
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[pan.getLayout()]}
          >
            <TouchableWithoutFeedback
              onPress={() => this.setState({ hasMoved: true }) && pressInDrag && pressInDrag()}
              onPressIn={pressInDrag}
              onPressOut={pressOutDrag}
            >
              <View
                style={{
                  backgroundColor: renderColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: renderSize * 2,
                  height: renderSize * 2,
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: 'lightblue',
                }}
              >
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
            marginTop: !hasMoved ? 0 : 72,
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
}

Draggable.defaultProps = {
  renderColor: 'yellowgreen',
  renderSize: 36,
}

export default Draggable
