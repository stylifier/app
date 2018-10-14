import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Dimensions, TouchableOpacity } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'

class BrandItem extends Component {
  render() {
    const { base } = this.props

    return (
      <View
        style={{
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          paddingTop: 5,
          paddingBottom: 5,
        }}
      >
        <AutoHeightImage
          width={Dimensions.get('window').width - 20}
          style={{ borderRadius: 10 }}
          source={{ uri: base.images.standard_resolution.url }}
        />
      </View>
    )
  }
}

BrandItem.propTypes = {
  base: PropTypes.object,
}

export default BrandItem
