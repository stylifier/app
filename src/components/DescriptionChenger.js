import React from 'react'
import PropTypes from 'prop-types'
import { View, TextInput, TouchableOpacity } from 'react-native'
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
    const { show, text } = this.state
    const { onDone, full } = this.props

    return (
      <View style={{ width: '100%', justifyContent: 'center' }}>
        <Modal
          isVisible={show}
          avoidKeyboard
          swipeDirection="down"
          onSwipe={() => this.setState({ show: false })}
        >
          <TouchableOpacity
            style={{ justifyContent: 'flex-end', height: '100%', width: '100%' }}
            onPress={() => this.setState({ show: false })}
          >
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
                onChangeText={(t) => this.setState({ text: t })}
                value={text}
                style={{ width: '100%', height: '100%' }}
                placeholder="Image Description..."
              />
            </View>
            <View style={{ alignSelf: 'flex-end', width: '100%', marginBottom: 20 }}>
              <Divider />
              <Button
                onPress={() => {
                  onDone(text || '')
                  this.setState({ show: false })
                }}
                buttonStyle={{
                  backgroundColor: '#f0f0f0',
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
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
                  marginLeft: 0,
                }}
                containerViewStyle={{ width: '100%', marginLeft: 0 }}
                color="#0079ff"
                large
                title="Cancel"
              />
            </View>
          </TouchableOpacity>
        </Modal>
        <Button
          onPress={() => this.setState({ show: true })}
          raised={!full}
          buttonStyle={{
            backgroundColor: '#f0f0f0',
            borderRadius: full ? 0 : 15,
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
