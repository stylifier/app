import { combineReducers } from 'redux'
import user from './user'
import nav from './nav'
import colorSuggestion from './colorSuggestion'
import bookmarks from './bookmarks'
import productSuggestion from './productSuggestion'

const todoApp = combineReducers({
  colorSuggestion,
  bookmarks,
  user,
  productSuggestion,
  nav,
})

export default todoApp
