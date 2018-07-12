import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {BaseNavigator} from './src/navigation';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <BaseNavigator/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
});
