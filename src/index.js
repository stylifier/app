import React from 'react'
import { StyleSheet, View} from 'react-native'
import { AppNavigator } from './navigation'
import { connect } from 'react-redux'
import actions from './actions'

class MainView extends React.Component {
  constructor (props) {
    super(props)
    this.props.initiateUser()
  }

  render() {
    return (
      <View style={styles.container}>
        <AppNavigator/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
})

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
  initiateUser: () => dispatch(actions.initiateUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(MainView)
