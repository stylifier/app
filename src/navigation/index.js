import React from 'react'
import { createBottomTabNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers'
import AddButton from '../components/AddButton'
import MessagingButton from '../components/MessagingButton'
import Bookmarks from '../pages/Bookmarks'
import { MessagingNavigation } from './MessagingNavigation'
import { BookmarksNavigation } from './BookmarksNavigation'
import Profile from '../pages/Profile'
import Feeds from '../pages/Feeds'
import ProccessAddingImage from '../pages/ProccessAddingImage'
import actions from '../actions'


const RootNavigator = createBottomTabNavigator({
  ...{
    Feeds: {
      screen: Feeds,
      navigationOptions: () => ({
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome
            style={{
              fontSize: 24,
              color: tintColor,
            }}
          >
            {Icons.newspaperO}
          </FontAwesome>
        ),
      }),
    },
  },
  ...{
    Bookmarks: {
      screen: BookmarksNavigation,
      navigationOptions: () => ({
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome
            style={{
              fontSize: 24,
              color: tintColor,
            }}
          >
            {Icons.bookmark}
          </FontAwesome>
        ),
      }),
    },
  },
  ...{
    Adding: {
      screen: ProccessAddingImage,
      navigationOptions: () => ({
        tabBarIcon: <AddButton ref={t => { this.addRef = t }} />,
        tabBarOnPress: () => this.addRef.store.dispatch(actions.toggleAddMenu()),
      }),
    },
    ...{
      Messages: {
        screen: MessagingNavigation,
        navigationOptions: () => ({
          tabBarIcon: ({ tintColor }) => (
            <MessagingButton tintColor={tintColor} />
          )
        }),
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: () => ({
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome
            style={{
              fontSize: 24,
              color: tintColor,
            }}
          >
            {Icons.user}
          </FontAwesome>
        ),
      }),
    },
  },
},
{
  tabBarOptions: {
    showLabel: false,
    activeTintColor: '#66bfc7',
    inactiveTintColor: '#5b7495',
    style: {
      backgroundColor: '#3b4e68',
    },
    tabStyle: {},
  },
})

const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.appNav
)

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root')

const mapStateToProps = state => ({
  state: state.appNav,
})

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState)

export { AppNavigator, RootNavigator, middleware }
