/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types'
import React from 'react'
import { Image, StyleSheet, View, ViewPropTypes } from 'react-native'
import Lightbox from 'react-native-lightbox'

export default function MessageImage({
  containerStyle,
  lightboxProps,
  imageProps,
  imageStyle,
  uri,
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Lightbox
        activeProps={{
          style: styles.imageActive,
        }}
        {...lightboxProps}
      >
        <Image
          {...imageProps}
          style={[styles.image, imageStyle]}
          source={{ uri }}
        />
      </Lightbox>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 240,
    height: 240,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
})

MessageImage.defaultProps = {
  containerStyle: {},
  imageStyle: {},
  imageProps: {},
  lightboxProps: {},
}

MessageImage.propTypes = {
  uri: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: PropTypes.object,
  lightboxProps: PropTypes.object,
}
