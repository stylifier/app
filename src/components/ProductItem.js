import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image, View, Text, Dimensions, TouchableOpacity, Linking } from 'react-native'
import FontAwesome, { Icons } from 'react-native-fontawesome'

class ProductItem extends Component {
  render() {
    const { base } = this.props

    return (
      <View
        style={{
          width: (Dimensions.get('window').width / 2) - 40,
          height: (Dimensions.get('window').height / 2) - 50,
          paddingTop: 10,
          marginBottom: 20,
          alignItems: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Image
          style={{ width: '100%', height: '70%' }}
          source={{ uri: base.media[0].standard_resolution.url }}
        />
        <TouchableOpacity
          style={{ width: '90%', marginTop: 20 }}
          onPress={() => {
            if (base.externalURL) {
              Linking.openURL(base.externalURL)
            }
          }}
        >
          <Text style={{ fontWeight: 'bold' }} >
            {base.brand}
          </Text>
          <Text>
            {base.name.length > 20 ? `${base.name.slice(0, 20)}...` : base.name}
          </Text>
          <Text style={{ fontWeight: 'bold', textAlign: 'right', marginTop: 10 }}>
            {base.price.original}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 35,
            height: 35,
            backgroundColor: 'rgba(59, 78, 104, 0.5)',
            borderRadius: 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {}}
        >
          <FontAwesome
            style={{
              fontSize: 24,
              color: false ? '#66bfc7' : '#f5f5f5',
            }}
          >
            {Icons.bookmark}
          </FontAwesome>
        </TouchableOpacity>
      </View>
    )
  }
}

ProductItem.propTypes = {
  base: PropTypes.object,
}

export default ProductItem
