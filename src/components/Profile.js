import React, {Component} from 'react';
import {Text, SafeAreaView} from 'react-native';

class Profile extends Component {
  render() {
    return (
      <SafeAreaView style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text>Profile</Text>
      </SafeAreaView>
    );
  }
}

export default Profile;
