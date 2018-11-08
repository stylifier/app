import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import { Button, Avatar, Text } from 'react-native-elements'
import actions from '../actions'
import FeedItem from './FeedItem'
import Viewer from './Viewer'


class ProfilePage extends Component {
  componentDidMount() {
    const { base,
      fetchUserMedia,
      fetchUserInfo,
      fetchUserFollowers,
    } = this.props

    fetchUserMedia(base.username)
    fetchUserInfo(base.username)
    fetchUserFollowers(base.username)
  }

  render() {
    const {
      attemptToCreateNewThread,
      base,
      searchs,
      user,
      followers,
      followUser,
      onDismissPressed,
      logoutUser,
    } = this.props
    const { usersMetadata } = searchs

    const metadata = usersMetadata[base.username] || {}
    const isMe = base.username === user.username
    const isFollowing =
      followers.followers ?
        followers.followers.map(t => t.username).indexOf(base.username) !== -1 : false

    return (
      <SafeAreaView>
        {onDismissPressed &&
          <View
            style={{
              width: '100%',
            }}
          >
            <TouchableOpacity
              style={{
                marginRight: 'auto',
                flexDirection: 'row',
                paddingTop: 10,
                position: 'absolute',
                right: 10,
              }}
              onPress={() => onDismissPressed()}
            >
              <Text
                style={{
                  color: 'black',
                  fontSize: 16,
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>}
        <ScrollView style={{ width: '100%', marginTop: onDismissPressed ? 40 : 0 }}>
          <View
            style={{
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <Avatar
              xlarge
              rounded
              source={{
                uri: (metadata.info && metadata.info.profile_picture) || base.profile_picture,
              }}
            />

            {!isMe && (
              <Button
                style={{ margin: 10, marginTop: 20 }}
                rounded
                raised
                onPress={() => followUser(base.username)}
                disabled={isFollowing}
                loading={followers.loading}
                backgroundColor="#ea5e85"
                title={isFollowing ? 'Following' : 'Follow'}
              />
            )}

            {!isMe && (
              <Button
                style={{ margin: 10, marginTop: 10 }}
                rounded
                raised
                onPress={() => {
                  attemptToCreateNewThread(base)
                  onDismissPressed()
                }}
                backgroundColor="#5b7495"
                title="Send a Message"
              />
            )}

            {isMe && (
              <Button
                style={{ margin: 10 }}
                rounded
                raised
                onPress={() => logoutUser()}
                loading={user.loggingIn}
                backgroundColor="#5b7495"
                title="Logout"
              />
            )}

            <Text h4>
              {base.username.replace('m_g_i_o_s_', '')}
            </Text>

            <Text style={{ marginTop: 15, marginBottom: 50 }}>
              {metadata.info && metadata.info.bio}
            </Text>
            <Viewer items={metadata.media || []} BaseItem={FeedItem} />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

ProfilePage.propTypes = {
  base: PropTypes.object,
  user: PropTypes.object,
  searchs: PropTypes.object,
  followers: PropTypes.object,
  onDismissPressed: PropTypes.func,
  fetchUserMedia: PropTypes.func,
  fetchUserInfo: PropTypes.func,
  fetchUserFollowers: PropTypes.func,
  followUser: PropTypes.func,
  logoutUser: PropTypes.func,
  attemptToCreateNewThread: PropTypes.func,
}

const mapStateToProps = state => ({
  searchs: state.searchs,
  user: state.user,
  followers: state.followers,
})

const mapDispatchToProps = dispatch => ({
  fetchUserMedia: (username) => dispatch(actions.fetchUserMedia(username)),
  fetchUserInfo: (username) => dispatch(actions.fetchUserInfo(username)),
  fetchUserFollowers: (username) => dispatch(actions.fetchUserFollowers(username)),
  followUser: (username) => dispatch(actions.followUser(username)),
  logoutUser: () => dispatch(actions.logoutUser()),
  attemptToCreateNewThread: (to) => dispatch(actions.attemptToCreateNewThread(to)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
