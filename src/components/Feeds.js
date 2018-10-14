import React, { Component } from 'react'
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { SearchBar } from 'react-native-elements'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import actions from '../actions'
import Viewer from './Viewer'
import UserItem from './UserItem'
import BrandItem from './BrandItem'
import FeedItem from './FeedItem'


class Feeds extends Component {
  renderUserIsGuest() {
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
          <TouchableOpacity onPress={() => this.props.navigateToLogin()}>
            <Text style={{ color: 'black', fontSize: 16 }}>
              Login / Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderSearch() {
    const { userResult, brandResult, styleResult, searchPhrase } = this.props.searchs
    const tst = { marginLeft: 'auto', marginRight: 'auto' }

    return (
      <ScrollView style={{ width: '100%' }}>
        {userResult.length > 0 && <Text style={tst}> Users with phrase "{searchPhrase}" </Text>}
        <Viewer items={userResult} BaseItem={UserItem} />
        {brandResult.length > 0 && <Text style={tst}> Brands with phrase "{searchPhrase}" </Text>}
        <Viewer items={brandResult} BaseItem={UserItem} />
        {styleResult.length > 0 && <Text style={tst}> Images with phrase "{searchPhrase}" </Text>}
        <Viewer items={styleResult} BaseItem={FeedItem} />
      </ScrollView>
    )
  }

  renderFeeds() {
    const { feeds, fetchFeeds, fetchMoreFeeds } = this.props

    return (<ScrollView
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
      <Viewer items={feeds.items} BaseItem={FeedItem} />
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
      <SafeAreaView
        style={{
          justifyContent: 'center',
          padding: 20,
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <SearchBar
          lightTheme
          onChangeText={(t) => {
            clearTimeout(this.searchPhraseChangeTimeout)
            this.searchPhraseChangeTimeout =
              setTimeout(() => setFeedsSearchPhrase(t), 600)
          }}
          round
          onClear={() => clearFeedsSearchPhrase()}
          value={searchPhrase}
          inputStyle={{ backgroundColor: '#b9c5d4' }}
          clearIcon={{ color: 'black' }}
          containerStyle={{
            backgroundColor: '#f5f5f5',
            borderWidth: 0,
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent',
          }}
          placeholder="Search for Style, Brand or People"
        />
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
