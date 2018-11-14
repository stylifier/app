import { NavigationActions } from 'react-navigation'
import { MessagingNavigation } from '../navigations/MessagingNavigation'

const firstAction = MessagingNavigation.router.getActionForPathAndParams('messaging/threads')
const initialNavState = MessagingNavigation.router.getStateForAction(firstAction)

const nav = (state = { ...initialNavState }, action) => {
  let nextState

  switch (action.type) {
    case 'Threads':
      nextState = MessagingNavigation.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Threads' }),
        state
      )
      break
    case 'Conversation':
      nextState = MessagingNavigation.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Conversation' }),
        state
      )
      break
    default:
      nextState = MessagingNavigation.router.getStateForAction(action, state)
      break
  }

  return nextState || state
}

export default nav
