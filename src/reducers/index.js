import { combineReducers } from 'redux'
import user from './user'
import nav from './nav'
import colorSuggestion from './colorSuggestion'
import bookmarks from './bookmarks'

const todoApp = combineReducers({
  colorSuggestion,
  bookmarks,
  user,
  nav,
})

export default todoApp
