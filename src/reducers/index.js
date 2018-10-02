import { combineReducers } from 'redux'
import user from './user'
import nav from './nav'
import colorSuggestion from './colorSuggestion'
import bookmarks from './bookmarks'
import productSuggestion from './productSuggestion'
import productBookmarks from './productBookmarks'
import messages from './messages'
import metadata from './metadata'

const todoApp = combineReducers({
  colorSuggestion,
  bookmarks,
  user,
  productSuggestion,
  productBookmarks,
  metadata,
  messages,
  nav,
})

export default todoApp
