/** @format */
import { Sentry } from 'react-native-sentry'
Sentry.config('https://fd55336f275541d38ce0d06c59ec9633@sentry.io/1340306').install()

import React from 'react'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { middleware } from './src/navigation'
import reducer from './src/reducers'
import MainView from './src/index'

const store = createStore(reducer, {}, applyMiddleware(middleware, ReduxThunk))

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        { <MainView /> }
      </Provider>
    )
  }
}
