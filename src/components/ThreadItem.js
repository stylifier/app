import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import PropTypes from 'prop-types'
import moment from 'moment'

class ThreadItem extends Component {
  render() {
    const { base, currentUser, onPress } = this.props

    const isFromMe = base.from.username === currentUser.username
    const recipient = isFromMe ? base.to : base.from

    return (
      <TouchableOpacity
        style={{
          width: '100%',
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#5b7495',
          flexDirection: 'row',
        }}
        onPress={() => onPress && onPress(base)}
      >
        <Image
          style={{ width: 100, height: 100, borderRadius: 50 }}
          source={{ uri: recipient.profile_picture }}
        />
        <View style={{ marginLeft: 40, flex: 7 }}>
          <Text style={{ fontWeight: 'bold' }}>
            {recipient.full_name}
          </Text>
          <Text>
            @{recipient.username}
          </Text>
          <Text style={{ position: 'absolute', right: 0, bottom: 0 }}>
            {moment(base.created_time).fromNow()}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

ThreadItem.propTypes = {
  base: PropTypes.object,
  onPress: PropTypes.func,
  currentUser: PropTypes.object,
}

export default ThreadItem
