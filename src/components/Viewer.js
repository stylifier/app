import React, { Component } from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'

class Viewer extends Component {
  render() {
    const { items, BaseItem, itemExtraProps, styleOverwrite } = this.props

    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%',
          marginBottom: 50,
          ...styleOverwrite
        }}
      >
        {items.map((t, i) => (
          <BaseItem
            base={t}
            key={t.id || i}
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
  styleOverwrite: PropTypes.object,
  itemExtraProps: PropTypes.object,
}

export default Viewer
