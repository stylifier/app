import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Dimensions, Text, ActivityIndicator, TouchableOpacity, Modal } from 'react-native'
import { Badge } from 'react-native-elements'
import AutoHeightImage from 'react-native-auto-height-image'
import { connect } from 'react-redux'
import actions from '../actions'
import ProfilePage from './ProfilePage'


class FeedItem extends Component {
  constructor(props) {
    super(props)

    this.state = { imageLoading: false, showProfile: false }
  }
  render() {
    const { base, setFeedsSearchPhrase } = this.props
    return (
      <View
        style={{
          width: Dimensions.get('window').width - 20,
          marginLeft: 'auto',
          marginRight: 'auto',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          borderWidth: 1,
          marginBottom: 10,
          borderColor: '#abbbcf',
        }}
      >
        {this.state.imageLoading &&
          <ActivityIndicator
            style={{ marginBottom: '-50%', marginTop: '30%' }}
            size="large"
          />}}
        <AutoHeightImage
          width={Dimensions.get('window').width - 22}
          style={{ borderRadius: 9 }}
          onLoadStart={() => this.setState({ imageLoading: true })}
          onLoadEnd={() => this.setState({ imageLoading: false })}
          source={{ uri: base.images.standard_resolution.url }}
        />

        <View
          style={{ width: Dimensions.get('window').width - 22, padding: 5, flexDirection: 'row' }}
        >
          <TouchableOpacity
            style={{ marginRight: 'auto', marginLeft: 5, marginTop: 2 }}
            onPress={() => this.setState({ showProfile: true })}
          >
            <Text>{base.userUsername}</Text>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.showProfile}
            >
              <ProfilePage
                onDismissPressed={() => this.setState({ showProfile: false })}
                base={base.user}
              />
            </Modal>
          </TouchableOpacity>
          {base.style &&
            <Badge
              containerStyle={{ backgroundColor: '#5b7495' }}
              onPress={() => setFeedsSearchPhrase(base.style)}
            >
              <Text style={{ color: '#f5f5f5' }}>{base.style}</Text>
            </Badge>
          }
        </View>

        {base.description && <Text style={{ padding: 5 }}> {base.description} </Text>}
      </View>
    )
  }
}

FeedItem.propTypes = {
  base: PropTypes.object,
  setFeedsSearchPhrase: PropTypes.func,
}

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  setFeedsSearchPhrase: (p) => dispatch(actions.setFeedsSearchPhrase(p)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FeedItem)
