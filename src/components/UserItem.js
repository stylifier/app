import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image, Text, TouchableOpacity, Modal } from 'react-native'
import ProfilePage from './ProfilePage'

class UserItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showProfile: false,
    }
  }

  render() {
    const { base } = this.props

    return (
      <TouchableOpacity
        style={{
          width: 150,
          marginLeft: 'auto',
          marginRight: 'auto',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
        onPress={() => this.setState({ showProfile: true })}
      >
        <Image
          style={{ width: 100, height: 100, borderRadius: 50 }}
          source={{ uri: base.profile_picture }}
        />
        <Text style={{ marginTop: 15 }}>
          {base.username.replace('m_g_i_o_s_', '')}
        </Text>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showProfile}
        >
          <ProfilePage
            onDismissPressed={() => this.setState({ showProfile: false })}
            base={base}
          />
        </Modal>
      </TouchableOpacity>
    )
  }
}

UserItem.propTypes = {
  base: PropTypes.object,
}

export default UserItem
