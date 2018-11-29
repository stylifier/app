import { createStackNavigator } from 'react-navigation'
import React from 'react'
import Bookmarks from '../pages/Bookmarks'
import CreateOutfit from '../pages/CreateOutfit'

const BookmarksNavigation = createStackNavigator({
  Bookmarks: {
    screen: Bookmarks,
    path: 'bookmarks/index',
    navigationOptions: () => ({
      title: 'Bookmarks',
      header: null
    }),
  },
  CreateOutfit: {
    screen: () => <CreateOutfit route="CreateOutfit" />,
    path: 'bookmarks/CreateOutfit',
    navigationOptions: () => ({
      title: 'Create Outfit',
      headerStyle: {
        backgroundColor: '#3b4e68',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }),
  }
})

BookmarksNavigation.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0
})

export default BookmarksNavigation
