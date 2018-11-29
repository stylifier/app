import { createStackNavigator } from 'react-navigation'
import React from 'react'
import ProccessAddingImage from '../pages/ProccessAddingImage'
import CreateOutfit from '../pages/CreateOutfit'

const BookmarksNavigation = createStackNavigator({
  Bookmarks: {
    screen: ProccessAddingImage,
    path: 'Image/index',
    navigationOptions: () => ({
      title: 'Image',
      header: null
    }),
  },
  CreateOutfit: {
    screen: () => <CreateOutfit route="CreateOutfit" />,
    path: 'Image/CreateOutfit',
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
