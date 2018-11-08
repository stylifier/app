import { createStackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers'
import Threads from '../pages/Messaging/Threads'
import Conversation from '../pages/Messaging/Conversation'

const RootNavigator = createStackNavigator({
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
    navigationOptions: ({ navigation }) =>
      ({ title: navigation.state.params && navigation.state.params.title }),
  }
})

const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.messagingNav
)

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root')

const mapStateToProps = state => ({
  state: state.messagingNav,
})

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState)

export { AppNavigator, RootNavigator, middleware }
