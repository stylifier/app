import React, {Component} from 'react';
import {Animated, TouchableOpacity, View, Alert} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
// import PhotoUpload from 'react-native-photo-upload'

const SIZE = 80;

class AddButton extends Component {
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
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2
            }}
            activeOpacity={1}
            onPress={()=> {
              Alert.alert('hey', 'hey')
            }
          }>
            <FontAwesome style={{fontSize: 24, color: '#F5F5F5'}}>{Icons.plus}</FontAwesome>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}
export {AddButton};
