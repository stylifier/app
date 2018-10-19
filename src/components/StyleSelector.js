import React from 'react'
import PropTypes from 'prop-types'
import { View, Modal, SafeAreaView, ScrollView } from 'react-native'
import { Header, Item, Input, Icon, Text, Button as BaseButton } from 'native-base'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import actions from '../actions'

class StyleSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      phrase: '',
    }
  }

  onSelectItem(item, displayText) {
    this.setState({ show: false, displayText })
    this.props.onSelect(item)
  }

  renderItem(item, index) {
    const displayText = item
    return (
      <Text
        key={index}
        style={{
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: 'gray',
          borderColor: 'gray',
        }}
        onPress={() => this.onSelectItem(item, displayText)}
      >
        {displayText}
      </Text>
    )
  }

  searchBinding(item, search) {
    const checkIfFound = item
    return checkIfFound.toLowerCase().includes(search.toLowerCase())
  }

  render() {
    const { show, phrase } = this.state
    const { styles, base, full } = this.props

    return (
      <View style={{ width: '100%', justifyContent: 'center' }} >
        <Modal
          animationType="slide"
          transparent={false}
          visible={show}
          onRequestClose={() => {}}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View>
              <Header searchBar rounded>
                <Item>
                  <Icon name="ios-search" />
                  <Input
                    autoCorrect={false}
                    placeholder={'Search for Style...'}
                    onChangeText={t => {
                      this.setState({ phrase: t })
                      this.props.updateStyles(t)
                    }}
                  />
                </Item>
                <BaseButton transparent onPress={() => this.setState({ show: false })}>
                  <Text>Cancel</Text>
                </BaseButton>
              </Header>
              <ScrollView>
                {[
                  phrase,
                  ...styles.filter(r => (!phrase || phrase.toLowerCase().indexOf(r) === -1)),
                ]
                  .filter(t => t && t.trim()).map((item, index) => this.renderItem(item, index))}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
        <Button
          onPress={() => {
            this.setState({ show: true, phrase: base.style })
            this.props.updateStyles()
          }}
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
          title="Set Style"
        />
      </View>
    )
  }
}

StyleSelector.propTypes = {
  base: PropTypes.object,
  onSelect: PropTypes.func,
  updateStyles: PropTypes.func,
  styles: PropTypes.array,
  full: PropTypes.bool,
}

StyleSelector.defaultProps = {
  base: { style: '' },
}

const mapStateToProps = state => ({
  styles: state.metadata.styles,
})

const mapDispatchToProps = (dispatch) => ({
  updateStyles: (q) => dispatch(actions.updateStyles(q && q.toLowerCase())),
})

export default connect(mapStateToProps, mapDispatchToProps)(StyleSelector)
