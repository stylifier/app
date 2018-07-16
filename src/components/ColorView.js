import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity } from 'react-native'

class ColorView extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          width: 50,
          height: 50,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        onPress={() => this.props.onPress && this.props.onPress(this.props.base)}
      >
        <View
          style={{
            width: 50,
            height: 50,
            backgroundColor: `#${this.props.base}`,
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
  base: PropTypes.object,
}

export default ColorView
