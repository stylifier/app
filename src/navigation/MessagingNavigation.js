import { createStackNavigator } from 'react-navigation'
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'
import Threads from '../pages/Messaging/Threads'
import Conversation from '../pages/Messaging/Conversation'

const MessagingNavigation = createStackNavigator({
  Threads: {
    screen: Threads,
    path: 'messaging/threads',
    navigationOptions: () => ({
      title: 'Conversations'
    }),
  },
  Conversation: {
    screen: Conversation,
    path: 'messaging/conversation',
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params && navigation.state.params.title
    }),
  }
})

const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.messagingNav
)

MessagingNavigation.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0
})

export { MessagingNavigation, middleware }
