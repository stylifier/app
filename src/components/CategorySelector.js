import React from 'react'
import PropTypes from 'prop-types'
import { View, Modal, ScrollView } from 'react-native'
import { Header, Left, Icon, Text, Button as NBButton,
  Container, Body, Title, Right } from 'native-base'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import actions from '../actions'

class CategorySelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      categories: props.categories.sort((a, b) => a.address.localeCompare(b.address)),
      renderSections: {}
    }
  }

  _toggle(item) {
    const { renderSections } = this.state
    const { categories } = this.props
    const lastAddress = !renderSections[item.address] ? item.address : item.address.split('>').slice(0, item.address.split('>').length - 1).join('>')
    const sortedCategories = categories.sort((a, b) => a.address.localeCompare(b.address))
    const newAddresses = sortedCategories
      .filter(t => t.address.startsWith(lastAddress))
      .map(t => t.address)
    const addresses = categories.map(t => t.address)
    const newRenderSections = { ...renderSections }
    Object
      .keys(renderSections)
      .forEach(k => {
        if (k.includes(item.address)) newRenderSections[k] = false
      })

    this.setState({
      categories: sortedCategories
        .slice(0, addresses.lastIndexOf(newAddresses[newAddresses.length - 1])),
      renderSections: {
        ...newRenderSections,
        [item.address]: !renderSections[item.address]
      }
    })
  }

  _head(item) {
    const { categories, renderSections } = this.state
    const { onSelect } = this.props
    const c = categories.filter(t => t.address.startsWith(item.address))

    return (
      c.length > 1 ?
        <View key={item.address}>
          <NBButton transparent dark onPress={() => this._toggle(item)} style={{ width: '100%' }}>
            <Text style={{ marginLeft: 20 * item.address.split('>').length - 40 }}>{item.lable}</Text>
            <Icon name={!renderSections[item.address] ? 'arrow-forward' : 'arrow-down'} />
          </NBButton>
          {renderSections[item.address] && this._body(item)}
        </View> :
        <NBButton
          transparent
          dark
          key={item.address}
          onPress={() => {
            this.setState({ show: false })
            if (onSelect) onSelect(item.address)
          }}
          style={{ width: '100%' }}
        >
          <Text style={{ marginLeft: 20 * item.address.split('>').length - 40 }}>{item.lable}</Text>
        </NBButton>
    )
  }

  _body(item) {
    const { categories } = this.state
    const c = categories.filter(t => t.address.startsWith(item.address))
    const items = categories
      .filter(t =>
        t.address.startsWith(item.address) &&
        t.address.split('>').length === item.address.split('>').length + 1)

    return (
      c.length > 1 ?
        items.map(i => this._head(i)) :
        <NBButton transparent dark disabled style={{ width: '100%' }}>
          <Text style={{ marginLeft: 20 * item.address.split('>').length - 40 }}>{item.lable}</Text>
        </NBButton>
    )
  }

  render() {
    const { show, categories } = this.state
    const { gender } = this.props
    const items = categories.filter(t => t.address.startsWith(gender) && t.address.split('>').length === 2)
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
            <ScrollView style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5' }}>
              {items.map(i => this._head(i))}
            </ScrollView>
          </Container>
        </Modal>
        <Button
          onPress={() => this.setState({ show: true })}
          raised
          buttonStyle={{
            backgroundColor: '#f0f0f0',
            borderRadius: 15,
            marginLeft: 0,
          }}
          containerViewStyle={{
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          color="#0079ff"
          large
          title="Set a Category"
        />
      </View>
    )
  }
}

CategorySelector.propTypes = {
  onSelect: PropTypes.func,
  gender: PropTypes.string,
  categories: PropTypes.array,
}

const mapStateToProps = state => ({
  productBookmarks: state.productBookmarks,
  categories: state.metadata.categories,
})

const mapDispatchToProps = (dispatch) => ({
  toBookmarks: () => dispatch(actions.moveToPage('Bookmarks')),
})

export default connect(mapStateToProps, mapDispatchToProps)(CategorySelector)
