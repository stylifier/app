import { createStackNavigator } from 'react-navigation'
import Threads from '../pages/Messaging/Threads'
import Conversation from '../pages/Messaging/Conversation'

const MessagingNavigation = createStackNavigator({
  Threads: {
    screen: Threads,
    path: 'messaging/threads',
    navigationOptions: () => ({
      title: 'Conversations',
      header: null
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

MessagingNavigation.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0
})

export default MessagingNavigation
