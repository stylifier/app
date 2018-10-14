import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image, View, Text, TouchableOpacity } from 'react-native'

class BrandItem extends Component {
  render() {
    const { base } = this.props

    return (
      <View
        style={{
          width: 150,
          marginLeft: 'auto',
          marginRight: 'auto',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}
      >
        <Image
          style={{ width: 100, height: 100, borderRadius: 50 }}
          source={{ uri: base.profile_picture }}
        />
        <Text style={{ marginTop: 15 }}>
          {base.username.replace('m_g_i_o_s_', '')}
        </Text>
      </View>
    )
  }
}

BrandItem.propTypes = {
  base: PropTypes.object,
}

export default BrandItem
