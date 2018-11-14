import { createStackNavigator } from 'react-navigation'
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'
import Bookmarks from '../pages/Bookmarks'

const BookmarksNavigation = createStackNavigator({
  Bookmarks: {
    screen: Bookmarks,
    path: 'messaging/threads',
    navigationOptions: () => ({
      title: 'Bookmarks',
      header: null
    }),
  }
})

const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.bookmarksNav
)

BookmarksNavigation.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0
})

export { BookmarksNavigation, middleware }
