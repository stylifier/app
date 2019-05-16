import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  SafeAreaView
} from 'react-native'
import { Header, Item, Input, Icon, Button as BaseButton, Container } from 'native-base'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import actions from '../actions'
import Viewer from '../components/Viewer'
import UserItem from '../components/UserItem'
import FeedItem from '../components/FeedItem'

function renderEmptyFeeds() {
  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
      }}
    >
      <FontAwesome
        style={{
          marginTop: '40%',
          marginBottom: 10,
          fontSize: 70,
          color: '#3b4e68',
        }}
      >
        {Icons.road}
      </FontAwesome>
      <Text style={{ textAlign: 'center' }}>
        It's lonely here!
      </Text>
      <Text style={{ textAlign: 'center' }}>
        You can search and follow
      </Text>
      <Text style={{ textAlign: 'center' }}>
        your favorite users...
      </Text>
    </View>)
}

class Feeds extends Component {
  renderUserIsGuest() {
    const { navigateToLogin } = this.props
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: 20,
          backgroundColor: '#f5f5f5',
        }}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginTop: 40,
            height: '100%',
          }}
        >
          <Text style={{ fontWeight: 'bold', marginBottom: 40 }}>
            You are not logged in
          </Text>
          <Text style={{ marginBottom: 40 }}>
            In order to use this feature you need to login or create an account.
          </Text>
          <TouchableOpacity onPress={() => navigateToLogin()}>
            <Text style={{ color: 'black', fontSize: 16 }}>
              Login / Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderEmptySearch() {
    const {
      searchs,
    } = this.props
    const { searchPhrase } = searchs

    return (
      <View
        style={{
          width: '100%',
          alignItems: 'center',
        }}
      >
        <FontAwesome
          style={{
            marginTop: '30%',
            marginBottom: 30,
            fontSize: 70,
            color: '#3b4e68',
          }}
        >
          {Icons.search}
        </FontAwesome>
        <Text style={{ textAlign: 'center' }}>
          No result with phrase "
          {searchPhrase}
          "
        </Text>
        <Text style={{ textAlign: 'center' }}>
          was found.
        </Text>
      </View>)
  }

  renderSearch() {
    const { searchs } = this.props
    const { userResult, brandResult, styleResult, searchPhrase } = searchs
    const tst = { marginLeft: 'auto', marginRight: 'auto' }

    return (
      <View style={{ width: '100%' }}>
        {userResult.length <= 0 &&
          brandResult.length <= 0 &&
          styleResult.length <= 0 &&
          this.renderEmptySearch()}
        <ScrollView style={{ width: '100%' }}>
          {userResult.length > 0 && (
            <View>
              <Text style={tst}>
              Users with phrase "
                {searchPhrase}
              "
              </Text>
              <Viewer items={userResult} BaseItem={UserItem} />
            </View>)}
          {brandResult.length > 0 && (
            <View>
              <Text style={tst}>
                Brands with phrase "
                {searchPhrase}
                "
              </Text>
              <Viewer items={brandResult} BaseItem={UserItem} />
            </View>)}
          {styleResult.length > 0 && (
            <View>
              <Text style={tst}>
              Images with phrase "
                {searchPhrase}
              "
              </Text>
              <Viewer
                items={styleResult}
                BaseItem={FeedItem}
                itemExtraProps={{ isStyleClickEnabled: true }}
              />
            </View>)}
        </ScrollView>
      </View>
    )
  }

  renderFeeds() {
    const { feeds, fetchFeeds, fetchMoreFeeds } = this.props

    if (!feeds.items || feeds.items < 1) {
      return renderEmptyFeeds()
    }

    return (
      <ScrollView
        style={{
          width: '100%',
        }}
        onScroll={(e) => {
          let paddingToBottom = 10
          paddingToBottom += e.nativeEvent.layoutMeasurement.height
          if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
            fetchMoreFeeds()
          }
        }}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl
            refreshing={feeds.loadingTop}
            onRefresh={() => fetchFeeds()}
          />
        }
      >
        <Viewer
          items={feeds.items}
          BaseItem={FeedItem}
          itemExtraProps={{ isStyleClickEnabled: true }}
        />
        {feeds.loadingBottom && <ActivityIndicator size="small" color="#3b4e68" />}
      </ScrollView>)
  }

  render() {
    const {
      user,
      searchs,
      setFeedsSearchPhrase,
      clearFeedsSearchPhrase,
    } = this.props
    const { searchPhrase } = searchs

    if (!user.isLoggedInUser) {
      return this.renderUserIsGuest()
    }

    return (
      <SafeAreaView>
        <Header searchBar rounded style={{ marginTop: -25 }}>
          <Item>
            <Icon name="ios-search" />
            <Input
              value={searchPhrase}
              autoCorrect={false}
              placeholder="Search for Style, Brand or People"
              onChangeText={(t) => {
                clearTimeout(this.searchPhraseChangeTimeout)
                this.searchPhraseChangeTimeout =
                  setTimeout(() => setFeedsSearchPhrase(t), 600)
              }}
            />
          </Item>
          {searchPhrase.trim().length > 0 &&
            <BaseButton transparent onPress={() => clearFeedsSearchPhrase()}>
              <Text>Cancel</Text>
            </BaseButton>}
        </Header>
        {searchPhrase.trim().length > 0 ? this.renderSearch() : this.renderFeeds()}
      </SafeAreaView>
    )
  }
}

Feeds.propTypes = {
  navigateToLogin: PropTypes.func,
  setFeedsSearchPhrase: PropTypes.func,
  clearFeedsSearchPhrase: PropTypes.func,
  fetchMoreFeeds: PropTypes.func,
  fetchFeeds: PropTypes.func,
  user: PropTypes.object,
  feeds: PropTypes.object,
  searchs: PropTypes.object,
}

const mapStateToProps = state => ({
  user: state.user,
  feeds: state.feeds,
  searchs: state.searchs,
})

const mapDispatchToProps = dispatch => ({
  navigateToLogin: () => dispatch(actions.moveToPage('Profile')),
  setFeedsSearchPhrase: (p) => dispatch(actions.setFeedsSearchPhrase(p)),
  clearFeedsSearchPhrase: () => dispatch(actions.clearFeedsSearchPhrase()),
  fetchFeeds: () => dispatch(actions.fetchFeeds()),
  fetchMoreFeeds: () => dispatch(actions.fetchMoreFeeds()),
})


export default connect(mapStateToProps, mapDispatchToProps)(Feeds)
