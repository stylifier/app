import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FontAwesome, { Icons } from 'react-native-fontawesome'

class MessagingButton extends Component {
  render() {
    const { messages, tintColor } = this.props
    return (
      <View>
        <FontAwesome
          style={{
            fontSize: 24,
            color: tintColor,
          }}
        >
          {Icons.comment}
        </FontAwesome>
        {messages.unreadThreadIds.length > 0 &&
          <View
            style={{
              backgroundColor: '#ea5e85',
              position: 'absolute',
              width: 18,
              height: 18,
              borderRadius: 9,
              top: -5,
              right: -5,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: 'white',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 'auto',
                marginBottom: 'auto',
              }}
            >
              {messages.unreadThreadIds.length}
            </Text>
          </View>}
      </View>
    )
  }
}

MessagingButton.propTypes = {
  messages: PropTypes.object,
  tintColor: PropTypes.string,
}

const mapStateToProps = (state) => ({
  messages: state.messages,
})

const mapDispatchToProps = () => ({})

export default connect(mapStateToProps, mapDispatchToProps)(MessagingButton)
