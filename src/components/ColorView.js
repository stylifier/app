import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity } from 'react-native'

class ColorView extends Component {
  render() {
    const { onPress, base } = this.props
    return (
      <TouchableOpacity
        style={{
          width: 50,
          height: 50,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        onPress={() => onPress && onPress(base)}
      >
        <View
          style={{
            width: 50,
            height: 50,
            backgroundColor: `#${base}`,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
          }}
        />
      </TouchableOpacity>
    )
  }
}

ColorView.propTypes = {
  onPress: PropTypes.func,
  base: PropTypes.string,
}

export default ColorView
