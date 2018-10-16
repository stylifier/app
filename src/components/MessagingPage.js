import React, { Component } from 'react'
import {
  NavigatorIOS,
  SafeAreaView,
} from 'react-native'
import Threads from './Threads.js'


export default class MessagingPage extends Component {
  render() {
    return (
      <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5' }}>
        <NavigatorIOS
          initialRoute={{
            component: Threads,
            title: 'Conversations',
            passProps: { index: 1 },
          }}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    )
  }
}
