import React, { Component } from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'

class Viewer extends Component {
  render() {
    const { items, BaseItem, itemExtraProps, styleOverwrite, itemStyleOverwrite } = this.props

    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginBottom: 50,
          ...styleOverwrite
        }}
      >
        {items.map((t, i) => (
          <View style={{ marginLeft: 'auto', marginRight: 'auto', ...itemStyleOverwrite }} key={t.id || i}>
            <BaseItem
              base={t}
              {...itemExtraProps}
            />
          </View>))}
      </View>
    )
  }
}

Viewer.propTypes = {
  items: PropTypes.array,
  BaseItem: PropTypes.func,
  colNum: PropTypes.number,
  styleOverwrite: PropTypes.object,
  itemExtraProps: PropTypes.object,
  itemStyleOverwrite: PropTypes.object,
}

export default Viewer
