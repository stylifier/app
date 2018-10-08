import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import actions from '../actions'

class MessagingButton extends Component {
  render() {
    return (
      <View>
        <FontAwesome
          style={{
            fontSize: 24,
            color: this.props.tintColor,
          }}
        >
          {Icons.comment}
        </FontAwesome>
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
          1
          </Text>
        </View>
      </View>
    )
  }
}

MessagingButton.propTypes = {
  nav: PropTypes.object,
  messages: PropTypes.object,
  tintColor: PropTypes.string,
}

const mapStateToProps = (state) => ({
  messages: state.messages,
  nav: state.nav,
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(MessagingButton)
