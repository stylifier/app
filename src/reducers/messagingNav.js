import { NavigationActions } from 'react-navigation'
import { RootNavigator } from '../navigations/MessagingNavigation'

const firstAction = RootNavigator.router.getActionForPathAndParams('messaging/threads')
const initialNavState = RootNavigator.router.getStateForAction(firstAction)

const nav = (state = { ...initialNavState }, action) => {
  let nextState

  switch (action.type) {
    case 'Threads':
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Threads' }),
        state
      )
      break
    case 'Conversation':
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Conversation' }),
        state
      )
      break
    default:
      nextState = RootNavigator.router.getStateForAction(action, state)
      break
  }

  return nextState || state
}

export default nav
