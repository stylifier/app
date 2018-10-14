import React, { Component } from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import { Col, Row, Grid } from 'react-native-easy-grid'

class Viewer extends Component {
  render() {
    const { items, BaseItem, itemExtraProps } = this.props

    // const itemsByCol = items
    //   .map((e, i) => (i % colNum === 0 ? items.slice(i, i + colNum) : null))
    //   .filter((e) => e)
    //
    // console.log(itemsByCol)

    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%',
          marginBottom: 50,
        }}
      >
        {items.map((t, i) => (
          <BaseItem
            base={t}
            key={i}
            {...itemExtraProps}
          />))}
      </View>
    )
  }
}

Viewer.propTypes = {
  items: PropTypes.array,
  BaseItem: PropTypes.func,
  colNum: PropTypes.number,
  itemExtraProps: PropTypes.object,
}

export default Viewer
