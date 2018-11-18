import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Modal } from 'react-native'
import { Header, Left, Icon, Text, Button as NBButton,
  Container, Body, Title, Right } from 'native-base'

class ColorSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
    }
  }

  render() {
    const { show } = this.state
    const { colors, onDone, defaultValue } = this.props

    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={show}
          onRequestClose={() => {}}
        >
          <Container>
            <Header>
              <Left>
                <NBButton
                  transparent
                  onPress={() => this.setState({ show: false })}
                >
                  <Icon name="arrow-back" />
                  <Text>Back</Text>
                </NBButton>
              </Left>
              <Body>
                <Title>Categories</Title>
              </Body>
              <Right />
            </Header>
            <View
              style={{
                width: '100%',
                height: '90%',
                backgroundColor: '#f5f5f5',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {colors.map((c, i) =>
                <TouchableOpacity
                  style={{
                    width: 180,
                    height: 90,
                    marginBottom: 10,
                    marginTop: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    backgroundColor: `${c}`,
                    borderRadius: 10,
                  }}
                  key={i}
                  onPress={() => {
                    if (onDone) onDone(c)
                    this.setState({ show: false })
                  }}
                />)}
            </View>
          </Container>
        </Modal>
        <TouchableOpacity
          onPress={() => this.setState({ show: true })}
          style={{
            backgroundColor: defaultValue,
            width: 30,
            height: 250,
            margin: 5,
            borderRadius: 10,
            borderWidth: 1,
          }}
        />
      </View>
    )
  }
}

ColorSelector.propTypes = {
  onDone: PropTypes.func,
  colors: PropTypes.array,
  defaultValue: PropTypes.string,
}

export default ColorSelector
