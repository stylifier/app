import { combineReducers } from 'redux'
import user from './user'
import appNav from './appNav'
import colorSuggestion from './colorSuggestion'
import bookmarks from './bookmarks'
import productSuggestion from './productSuggestion'
import productBookmarks from './productBookmarks'
import messages from './messages'
import metadata from './metadata'
import feeds from './feeds'
import followers from './followers'
import searchs from './searchs'
import outfits from './outfits'

const todoApp = combineReducers({
  colorSuggestion,
  bookmarks,
  user,
  productSuggestion,
  productBookmarks,
  metadata,
  messages,
  outfits,
  feeds,
  searchs,
  followers,
  appNav,
})

export default todoApp
