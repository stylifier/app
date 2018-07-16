import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { AppNavigator } from './navigation'
import actions from './actions'

class MainView extends React.Component {
  constructor(props) {
    super(props)
    this.props.initiateUser()
  }

  render() {
    return (
      <View style={styles.container}>
        <AppNavigator />
      </View>
    )
  }
}

MainView.propTypes = {
  initiateUser: PropTypes.func,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
})

const mapDispatchToProps = dispatch => ({
  initiateUser: () => dispatch(actions.initiateUser()),
})

export default connect(() => ({}), mapDispatchToProps)(MainView)
