import { NavigationActions } from 'react-navigation'
import actions from '.'

export default {
  toggleAddMenu: () => (dispatch) => {
    dispatch({
      type: 'TOGGLE_ADD_MENU',
    })
  },

  toggleSharingScreenInProcessImage: (t) => (dispatch) => {
    dispatch({
      type: 'TOGGLE_SHARING_SCREEN_IN_PROCESS_IMAGE',
      payload: t,
    })
  },

  moveToPage: (page, params) => (dispatch) => {
    dispatch(actions.setPageProps(page, params))
    dispatch(NavigationActions.navigate({ routeName: page, params }))
  },

  setPageProps: (page, params) => (dispatch) => {
    dispatch({ type: 'UPDATE_PAGE_PROPS', route: page, payload: params })
  },

  goBack: () => (dispatch) => {
    dispatch(NavigationActions.back())
  },
}
