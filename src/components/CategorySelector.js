import React from 'react'
import PropTypes from 'prop-types'
import { View, Modal, ScrollView } from 'react-native'
import { Header, Left, Icon, Text, Button,
  Container, Body, Title, Right } from 'native-base'
import { connect } from 'react-redux'
import actions from '../actions'

class CategorySelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      categories: props.categories.sort((a, b) => a.address.localeCompare(b.address)),
      renderSections: {
      }
    }
  }

  componentDidMount() {
    const { defaultValue } = this.props
    if (!defaultValue) return
    const pieces = defaultValue.split('>')

    this._toggle({ address: pieces.slice(0, pieces.length - 2).join('>') })
    let newRenderSections = {}

    pieces.forEach((c, i) => {
      if (i <= 1) return
      newRenderSections = {
        ...newRenderSections,
        [pieces.slice(0, i).join('>')]: true
      }
    })
    this.setState({ renderSections: newRenderSections })
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
        .slice(0, addresses.lastIndexOf(newAddresses[newAddresses.length - 1]) + 1),
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
          <Button transparent dark onPress={() => this._toggle(item)} style={{ width: '100%' }}>
            <Text style={{ marginLeft: 20 * item.address.split('>').length - 40 }}>{item.lable}</Text>
            <Icon name={!renderSections[item.address] ? 'arrow-forward' : 'arrow-down'} />
          </Button>
          {renderSections[item.address] && this._body(item)}
        </View> :
        <Button
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
        </Button>
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
        <Button transparent dark disabled style={{ width: '100%' }}>
          <Text style={{ marginLeft: 20 * item.address.split('>').length - 40 }}>{item.lable}</Text>
        </Button>
    )
  }

  render() {
    const { show, categories } = this.state
    const { gender, defaultValue, categories: allCategories } = this.props
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
                <Button
                  transparent
                  onPress={() => this.setState({ show: false })}
                >
                  <Icon name="arrow-back" />
                  <Text>Back</Text>
                </Button>
              </Left>
              <Body>
                <Title>Categories</Title>
              </Body>
              <Right />
            </Header>
            <ScrollView
              style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5' }}
              ref={ref => { this.scrollView = ref }}
              onContentSizeChange={() => {
                this.scrollView.scrollToEnd({ animated: true })
              }}
            >
              {items.map(i => this._head(i))}
            </ScrollView>
          </Container>
        </Modal>
        <Button
          onPress={() => this.setState({ show: true })}
          style={{
            backgroundColor: !defaultValue ? '#5b7495' : '#f5f5f5',
            borderRadius: !defaultValue ? 15 : 0,
          }}
        >
          <Icon style={{ fontSize: 30, color: !defaultValue ? '#f5f5f5' : '#3b4e68', marginRight: 0 }} name={!defaultValue ? 'add' : 'swap'} />
          <Text style={{ color: !defaultValue ? '#f5f5f5' : '#3b4e68', marginLeft: 0 }}>
            {
              !defaultValue ?
                'Set a Category' :
                `${allCategories.find(t => t.address === defaultValue).lable}`
            }
          </Text>
        </Button>
      </View>
    )
  }
}

CategorySelector.propTypes = {
  onSelect: PropTypes.func,
  gender: PropTypes.string,
  defaultValue: PropTypes.string,
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
