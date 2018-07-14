import React, { Component } from 'react';
import {createBottomTabNavigator} from 'react-navigation';
import { connect } from 'react-redux'
import Bookmarks from '../components/Bookmarks';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Profile from '../components/Profile';
import AddButton from '../components/AddButton';
import ProccessAddingImage from '../components/ProccessAddingImage';
import {Alert} from 'react-native';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

const RootNavigator = createBottomTabNavigator({
  Bookmarks: {
    screen: Bookmarks,
    navigationOptions: () => ({
      tabBarIcon: ({tintColor}) => (
        <FontAwesome style={{fontSize: 24, color: tintColor}}>{Icons.bookmark}</FontAwesome>
      )
    })
  },
  Adding: {
    screen: ProccessAddingImage,
    navigationOptions: () => {
      return {
        tabBarIcon: <AddButton/>
      }
    }
  },
  Profile: {
    screen: Profile,
    navigationOptions: () => ({
      tabBarIcon: ({tintColor}) => (
        <FontAwesome style={{fontSize: 24, color: tintColor}}>{Icons.user}</FontAwesome>
      )
    })
  }
}, {
  tabBarOptions: {
    showLabel: false,
    activeTintColor: '#66bfc7',
    inactiveTintColor: '#5b7495',
    style: {
      backgroundColor: '#3b4e68'
    },
    tabStyle: {}
  }
});

const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
)

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

const mapStateToProps = state => ({
  state: state.nav,
});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

export {AppNavigator, RootNavigator, middleware};
