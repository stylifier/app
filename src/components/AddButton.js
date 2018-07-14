import React, {Component} from 'react'
import {Animated, TouchableOpacity, View, Alert} from 'react-native'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import PhotoUpload from '../common/PhotoUpload.js'
import actions from '../actions'
import { connect } from 'react-redux'

const SIZE = 80;

class AddButton extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { navigation } = this.props

    console.log(navigation);

    return (
      <View style={{
        position: 'absolute',
        alignItems: 'center'
      }}>

        <Animated.View style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          backgroundColor: '#ea5e85'
        }}>
          <PhotoUpload
            buttonStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2
            }}
            onError={e => Aler.alert(e)}
            onResponse={() => {
              this.props.imagePicked()
            }}
            onPhotoSelect={img => {
              if (img) {
                this.props.ImageResized(img)
              }
            }}
           >
            <FontAwesome style={{fontSize: 24, color: '#F5F5F5'}}>{Icons.plus}</FontAwesome>
           </PhotoUpload>
        </Animated.View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
  ImageResized: (img) =>
    dispatch(actions.colorSuggestionImageResized(img)),
  imagePicked: () =>
    dispatch(actions.colorSuggestionImagePicked()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddButton)
