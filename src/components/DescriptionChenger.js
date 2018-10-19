import React from 'react'
import PropTypes from 'prop-types'
import { View, TextInput } from 'react-native'
import Modal from 'react-native-modal'
import { Button, Divider } from 'react-native-elements'
import { connect } from 'react-redux'

class DescriptionChenger extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      text: props.defaultValue || '',
    }
  }

  render() {
    const { show } = this.state
    const { onDone, full } = this.props

    return (
      <View style={{ width: '100%', justifyContent: 'center' }} >
        <Modal
          isVisible={show}
          avoidKeyboard
          swipeDirection="down"
          onSwipe={() => this.setState({ show: false })}
        >
          <View style={{ justifyContent: 'flex-end', height: '100%', width: '100%' }} >
            <View
              style={{
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                height: '40%',
                width: '100%',
                backgroundColor: '#f0f0f0',
                padding: 10,
                alignSelf: 'flex-end',
              }}
            >
              <TextInput
                multiline
                onChangeText={(text) => this.setState({ text })}
                value={this.state.text}
                style={{ width: '100%', height: '100%' }}
                placeholder="Image Description..."
              />
            </View>
            <View style={{ alignSelf: 'flex-end', width: '100%', marginBottom: 20 }}>
              <Divider />
              <Button
                onPress={() => {
                  onDone(this.state.text || '')
                  this.setState({ show: false })
                }}
                buttonStyle={{
                  backgroundColor: '#f0f0f0',
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                  paddingTop: 10,
                  paddingBottom: 10,
                  marginLeft: 0,
                }}
                containerViewStyle={{ width: '100%', marginLeft: 0 }}
                color="#0079ff"
                large
                title="Done"
              />
            </View>
            <View style={{ width: '100%', justifyContent: 'center' }}>
              <Button
                onPress={() => this.setState({ show: false })}
                buttonStyle={{
                  backgroundColor: '#f0f0f0',
                  borderRadius: 15,
                  paddingTop: 10,
                  paddingBottom: 10,
                  marginLeft: 0,
                }}
                containerViewStyle={{ width: '100%', marginLeft: 0 }}
                color="#0079ff"
                large
                title="Cancel"
              />
            </View>
          </View>
        </Modal>
        <Button
          onPress={() => this.setState({ show: true })}
          raised={!full}
          buttonStyle={{
            backgroundColor: '#f0f0f0',
            borderRadius: full ? 0 : 15,
            paddingTop: 10,
            paddingBottom: 10,
            marginLeft: 0,
          }}
          containerViewStyle={{ marginLeft: 'auto', marginRight: 'auto', width: full && '100%' }}
          color="#0079ff"
          large
          title="Change Description"
        />
      </View>
    )
  }
}

DescriptionChenger.propTypes = {
  onDone: PropTypes.func,
  defaultValue: PropTypes.string,
  full: PropTypes.bool,
}

const mapStateToProps = () => ({
})

const mapDispatchToProps = () => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(DescriptionChenger)
