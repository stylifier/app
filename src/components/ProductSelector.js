import React from 'react'
import PropTypes from 'prop-types'
import { View, Modal, ScrollView, TouchableOpacity } from 'react-native'
import { Header, Left, Text, Icon, Button as NBButton,
  Container, Body, Title, Right } from 'native-base'
import { Button } from 'react-native-elements'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import { connect } from 'react-redux'
import ProductItem from './ProductItem'
import Viewer from './Viewer'
import actions from '../actions'

function renderEmptyScreen() {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FontAwesome
        style={{
          fontSize: 70,
          color: '#3b4e68',
        }}
      >
        {Icons.road}
      </FontAwesome>
      <Text style={{ textAlign: 'center' }}>
        You have no bookmarks.
      </Text>
      <Text style={{ textAlign: 'center' }}>
        Try bookmarking items with
      </Text>
      <Text style={{ textAlign: 'center' }}>
        "+ Create Outfit" button.
      </Text>
    </View>)
}

class ProductSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
    }
  }

  onSelectItem(item) {
    const { onSelect } = this.props
    this.setState({ show: false })
    if (onSelect) onSelect(item)
  }

  render() {
    const { show } = this.state
    const { products, full, small } = this.props

    return (
      <View style={{ width: '100%', justifyContent: 'center' }}>
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
                  <Text> Back </Text>
                </NBButton>
              </Left>
              <Body>
                <Title>Items</Title>
              </Body>
              <Right />
            </Header>
            <ScrollView style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5', padding: 10 }}>
              <Viewer
                items={products}
                BaseItem={ProductItem}
                itemExtraProps={{
                  hideBookmarkBotton: true,
                  onClick: (item) => this.onSelectItem(item),
                }}
              />
              {(!products || products.length <= 0) && renderEmptyScreen()}
            </ScrollView>
          </Container>
        </Modal>
        {!small ? <Button
          onPress={() => this.setState({ show: true })}
          raised={!full}
          buttonStyle={{
            backgroundColor: '#f0f0f0',
            borderRadius: full ? 0 : 15,
            marginLeft: 0,
          }}
          containerViewStyle={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: full && '100%',
          }}
          color="#0079ff"
          large
          title="Add Bookmarked Items"
        /> :
        <TouchableOpacity
          onPress={() => this.setState({ show: true })}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 20,
            marginLeft: 10,
            backgroundColor: '#66bfc7',
          }}
        >
          <Icon name="ios-shirt" style={{ fontSize: 28, color: '#f5f5f5' }} />
        </TouchableOpacity>}
      </View>
    )
  }
}

ProductSelector.propTypes = {
  onSelect: PropTypes.func,
  products: PropTypes.array,
  full: PropTypes.bool,
  small: PropTypes.bool,
}

const mapStateToProps = state => ({
  products:
    [].concat(
      ...state.outfits
        .filter(t => t && t.id)
        .map(t => t.items.filter(p => p.product).map(p => p.product)),
      state.productBookmark ? state.productBookmark.map(t => t.product) : []).filter(t => t)
})

const mapDispatchToProps = (dispatch) => ({
  toBookmarks: () => dispatch(actions.moveToPage('Bookmarks')),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductSelector)
