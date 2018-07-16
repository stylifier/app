import React, { Component } from 'react'
import { Animated, View } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import PhotoUpload from '../common/PhotoUpload.js'
import actions from '../actions'

const SIZE = 80

class AddButton extends Component {
  render() {
    return (
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            backgroundColor: '#ea5e85',
          }}
        >
          <PhotoUpload
            buttonStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2,
            }}
            onResponse={() => this.props.imagePicked()}
            onPhotoSelect={img => img && this.props.imageResized(img)}
          >
            <FontAwesome
              style={{
                fontSize: 24,
                color: '#F5F5F5',
              }}
            >
              {Icons.plus}
            </FontAwesome>
          </PhotoUpload>
        </Animated.View>
      </View>
    )
  }
}

AddButton.propTypes = {
  imageResized: PropTypes.func,
  imagePicked: PropTypes.func,
  bookmarks: PropTypes.array,
}

const mapStateToProps = () => ({
})

const mapDispatchToProps = dispatch => ({
  imageResized: (img) =>
    dispatch(actions.colorSuggestionImageResized(img)),
  imagePicked: () =>
    dispatch(actions.colorSuggestionImagePicked()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddButton)
