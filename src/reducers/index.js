import { combineReducers } from 'redux'
import user from './user'
import appNav from './appNav'
import colorSuggestion from './colorSuggestion'
import bookmarks from './bookmarks'
import messagingNav from './messagingNav'
import productSuggestion from './productSuggestion'
import productBookmarks from './productBookmarks'
import messages from './messages'
import metadata from './metadata'
import feeds from './feeds'
import followers from './followers'
import searchs from './searchs'

const todoApp = combineReducers({
  colorSuggestion,
  bookmarks,
  user,
  productSuggestion,
  productBookmarks,
  metadata,
  messages,
  messagingNav,
  feeds,
  searchs,
  followers,
  appNav,
})

export default todoApp
