import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import moment from 'moment'
import ProfileImage from './ProfileImage'

class ThreadItem extends Component {
  render() {
    const { base, currentUser, onPress, isUnread } = this.props

    const isFromMe = base.from.username === currentUser.username
    const recipient = isFromMe ? base.to : base.from
    const textColor = isUnread ? '#f5f5f5' : 'black'

    return (
      <TouchableOpacity
        style={{
          width: '100%',
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#5b7495',
          flexDirection: 'row',
          backgroundColor: isUnread ? '#5b7495' : '#f5f5f5',
        }}
        onPress={() => onPress && onPress(base)}
      >
        <ProfileImage source={recipient.profile_picture} />
        <View style={{ marginLeft: 40, flex: 7 }}>
          <Text style={{ fontWeight: 'bold', color: textColor }}>
            {recipient.full_name}
          </Text>
          <Text style={{ color: textColor }}>
            @
            {recipient.username.replace('m_g_i_o_s_', '')}
          </Text>
          <Text style={{ position: 'absolute', right: 0, bottom: 0, color: textColor }}>
            {isFromMe ?
              moment(base.to_last_message_at || base.created_time).fromNow() :
              moment(base.from_last_message_at || base.created_time).fromNow()}
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
  isUnread: PropTypes.bool,
}

export default ThreadItem
