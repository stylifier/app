import { RootNavigator } from '../navigation'

const firstAction = RootNavigator.router.getActionForPathAndParams('Bookmarks')
const initialNavState = RootNavigator.router.getStateForAction(firstAction)

const nav = (state = initialNavState, action) => {
  let nextState

  switch (action.type) {
    case 'Bookmarks':
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Bookmarks' }),
        state
      )
      break
    case 'Profile':
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Profile' }),
        state
      )
      break
    case 'Adding':
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Adding' }),
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
