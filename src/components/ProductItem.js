import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image, View, Text, Dimensions, TouchableOpacity, Linking } from 'react-native'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import { connect } from 'react-redux'
import actions from '../actions'

class ProductItem extends Component {
  render() {
    const { base, colorPalletId, title, hideBookmarkBotton, deleteBookmarkedProduct,
      bookmarkProduct, onClick, rounded, bookmarks } = this.props
    const bookmarked =
      bookmarks.filter(p =>
        p.productId === base.id && p.palletId === colorPalletId).length > 0

    return (
      <View
        style={{
          width: (Dimensions.get('window').width / 2) - 30,
          height: (Dimensions.get('window').height / 2) - 50,
          alignItems: 'center',
          marginRight: 'auto',
          backgroundColor: '#f5f5f5',
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          style={{ width: '100%', height: '70%' }}
          onPress={() => {
            if (onClick) {
              onClick(base)
            }
          }}
        >
          <Image
            style={{ width: '100%', height: '100%', borderRadius: rounded ? 10 : 0 }}
            source={{ uri: base.media[0].standard_resolution.url }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ width: '90%', marginTop: 20 }}
          onPress={() => {
            if (onClick) {
              onClick(base)
            } else if (base.externalURL) {
              Linking.openURL(base.externalURL)
            }
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>
            {base.brand}
          </Text>
          <Text style={{ fontSize: 12 }}>
            {base.name.length > 20 ? `${base.name.slice(0, 20)}...` : base.name}
          </Text>
          <Text style={{ fontSize: 12, color: '#5babb3' }}>
            More info...
          </Text>
          <Text style={{ fontWeight: 'bold', textAlign: 'right', marginTop: 10 }}>
            {base.price.original}
          </Text>
        </TouchableOpacity>
        {!hideBookmarkBotton &&
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
            onPress={() => (bookmarked ?
              deleteBookmarkedProduct(base.id, colorPalletId) :
              bookmarkProduct(base.id, colorPalletId, title))
            }
          >
            <FontAwesome
              style={{
                fontSize: 24,
                color: bookmarked ? '#66bfc7' : '#f5f5f5',
              }}
            >
              {Icons.bookmark}
            </FontAwesome>
          </TouchableOpacity>}
      </View>
    )
  }
}

ProductItem.propTypes = {
  base: PropTypes.object,
  bookmarks: PropTypes.array,
  deleteBookmarkedProduct: PropTypes.func,
  bookmarkProduct: PropTypes.func,
  onClick: PropTypes.func,
  colorPalletId: PropTypes.string,
  hideBookmarkBotton: PropTypes.bool,
  rounded: PropTypes.bool,
  title: PropTypes.string,
}

const mapStateToProps = state => ({
  bookmarks: state.productBookmarks,
})

const mapDispatchToProps = dispatch => ({
  bookmarkProduct: (productId, palletId, title) =>
    dispatch(actions.bookmarkProduct(productId, palletId, title)),
  deleteBookmarkedProduct: (productId, palletId) =>
    dispatch(actions.deleteBookmarkedProduct(productId, palletId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductItem)
