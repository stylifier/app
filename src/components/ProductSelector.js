import React from 'react'
import PropTypes from 'prop-types'
import { View, Modal, SafeAreaView, TouchableOpacity } from 'react-native'
import { Text } from 'native-base'
import { Button } from 'react-native-elements'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import { connect } from 'react-redux'
import ProductItem from './ProductItem.js'
import Viewer from './Viewer'
import actions from '../actions'

class ProductSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
    }
  }

  onSelectItem(item) {
    this.setState({ show: false })
    if (this.props.onSelect) this.props.onSelect(item)
  }

  searchBinding(item, search) {
    const checkIfFound = item
    return checkIfFound.toLowerCase().includes(search.toLowerCase())
  }

  renderEmptyScreen() {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FontAwesome
          style={{
            fontSize: 70,
            color: '#3b4e68',
            marginTop: -120,
          }}
        >
          {Icons.road}
        </FontAwesome>
        <Text style={{ textAlign: 'center' }} >
          You have no bookmarks.
        </Text>
        <Text style={{ textAlign: 'center' }} >
          Try bookmarking items with
        </Text>
        <Text style={{ textAlign: 'center' }} >
          "+ Create Outfit" button.
        </Text>
        <Button
          rounded
          onPress={() => {
            this.setState({ show: false })
            this.props.toBookmarks()
          }}
          buttonStyle={{ backgroundColor: '#5b7495', padding: 5, marginTop: 20 }}
          title="To Bookmarks"
        />
      </View>)
  }

  render() {
    const { show } = this.state
    const { productBookmarks, full } = this.props

    return (
      <View style={{ width: '100%', justifyContent: 'center' }} >
        <Modal
          animationType="slide"
          transparent={false}
          visible={show}
          onRequestClose={() => {}}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignSelf: 'flex-end',
                padding: 10,
              }}
            >
              <TouchableOpacity onPress={() => this.setState({ show: false })}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 16,
                  }}
                >Close</Text>
              </TouchableOpacity>
            </View>
            <Viewer
              items={productBookmarks.map(t => t.product)}
              BaseItem={ProductItem}
              itemExtraProps={{
                hideBookmarkBotton: true,
                onClick: (item) => this.onSelectItem(item),
              }}
            />
            {(!productBookmarks || productBookmarks.length <= 0) && this.renderEmptyScreen()}
          </SafeAreaView>
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
          containerViewStyle={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: full && '100%',
          }}
          color="#0079ff"
          large
          title="Add Bookmarked Items"
        />
      </View>
    )
  }
}

ProductSelector.propTypes = {
  onSelect: PropTypes.func,
  toBookmarks: PropTypes.func,
  productBookmarks: PropTypes.array,
  full: PropTypes.bool,
}

const mapStateToProps = state => ({
  productBookmarks: state.productBookmarks,
})

const mapDispatchToProps = (dispatch) => ({
  toBookmarks: () => dispatch(actions.moveToPage('Bookmarks')),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductSelector)
