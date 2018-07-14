import React from 'react'
import { middleware} from './src/navigation'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducer from './src/reducers'
import ReduxThunk from 'redux-thunk'
import MainView from './src/index.js'

const store = createStore(reducer, {}, applyMiddleware(middleware, ReduxThunk))

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        {<MainView/>}
      </Provider>
    )
  }
}
