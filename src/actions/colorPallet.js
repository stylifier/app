import { Alert } from 'react-native'
import actions from '.'

export default {
  deleteBookmarkedColorPallet: (palletId) => (dispatch) => {
    actions.api.deleteBookmarkedColorPallet(palletId)
      .then(() => dispatch(actions.refreshBookmarks()))
      .catch(() => {})
  },

  bookmarkColorPallet: (palletId, title) => (dispatch) => {
    actions.api.bookmarkColorPallet(palletId, title)
      .then(() => dispatch(actions.refreshBookmarks()))
      .catch(() => {})
  },

  createColorPallet: (mediaId, code) => (dispatch) => {
    actions.api.createColorPallet(code)
      .then((r) => actions.api.bookmarkColorPallet(r.id))
      .then(() => actions.api.setColorCode(code))
      .then(() => dispatch(actions.refreshBookmarks(true)))
      .then(() => setTimeout(() => Alert.alert(
        'Color Palette Created',
        'And added to your bookmarks',
        [
          { text: 'Dismiss', onPress: () => {} },
        ],
        { cancelable: false }
      ), 1000))
      .catch(() => {
        Alert.alert('Ops... Something went wrong, please try again later.')
      })
  },
}
