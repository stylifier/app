import React, {Component} from 'react';
import {Animated, TouchableOpacity, View, Alert} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import PhotoUpload from '../common/PhotoUpload.js'
import API from '../common/API.js'

const SIZE = 80;

class AddButton extends Component {
  constructor(props) {
    super(props)

    this.api = new API()
  }
  render() {
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
            onPhotoSelect={img => {
              if (img) {
                this.api.uploadImage(img)
                .then(c => console.log(c))
                .catch(c => console.log(c))
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
export {AddButton};
