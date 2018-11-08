import React from 'react'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { middleware as appNavMid } from './src/navigations/AppNavigation'
// import { middleware as msgNavMid } from './src/navigations/MessagingNavigation'
import reducer from './src/reducers'
import MainView from './src/index'

const store = createStore(reducer, {}, applyMiddleware(appNavMid, ReduxThunk))

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        { <MainView /> }
      </Provider>
    )
  }
}
