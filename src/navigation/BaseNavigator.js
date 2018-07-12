import React from 'react';
import {createBottomTabNavigator} from 'react-navigation';
import Bookmarks from '../components/Bookmarks';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Profile from '../components/Profile';
import {AddButton} from '../components/AddButton';
import ProccessAddingImage from '../components/ProccessAddingImage';
import {Alert} from 'react-native';

const BaseNavigator = createBottomTabNavigator({
  Bookmarks: {
    screen: Bookmarks,
    navigationOptions: () => ({
      tabBarIcon: ({tintColor}) => (
        <FontAwesome style={{fontSize: 24, color: '#F5F5F5'}}>{Icons.bookmark}</FontAwesome>
      )
    })
  },
  Adding: {
    mode: 'modal',
    headerMode: 'none',
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
        <FontAwesome style={{fontSize: 24, color: '#F5F5F5'}}>{Icons.user}</FontAwesome>
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

export {BaseNavigator};
