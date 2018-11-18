import React, { Component } from 'react'
import { View, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import Carousel from 'react-native-snap-carousel'
import { connect } from 'react-redux'
import actions from '../actions'
import ProductItem from './ProductItem'
import CategorySelector from './CategorySelector'
import ColorSelector from './ColorSelector'

class ProductShowCase extends Component {
  componentDidMount() {
    const { fetchProducts, base } = this.props
    if (!base.color || !base.category) return

    fetchProducts({
      hex: base.color,
      category: base.category,
    })
  }

  renderItem({ item }) {
    return (
      <ProductItem
        key={`ProductItem${item.id}`}
        base={item}
        hideBookmarkBotton
      />
    )
  }

  render() {
    const { base, products, gender, onQueryChanged, colors } = this.props
    const { color, category } = base
    return (
      <View style={{ width: '100%', flexDirection: 'row' }}>
        <ColorSelector
          defaultValue={color}
          colors={colors}
          onDone={c => onQueryChanged && onQueryChanged({ ...base, color: c })}
        />
        {category ?
          <Carousel
            data={products}
            renderItem={this.renderItem}
            layout="default"
            inactiveSlideScale={0.8}
            inactiveSlideOpacity={0.4}
            sliderWidth={Dimensions.get('window').width - 40}
            itemWidth={130}
          /> :
          <View
            style={{
              width: Dimensions.get('window').width - 40,
              height: 160,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CategorySelector
              gender={gender}
              onSelect={c => onQueryChanged && onQueryChanged({ ...base, category: c })}
            />
          </View>
        }
      </View>
    )
  }
}

ProductShowCase.propTypes = {
  base: PropTypes.object,
  fetchProducts: PropTypes.func,
  onQueryChanged: PropTypes.func,
  gender: PropTypes.string,
  colors: PropTypes.array,
  products: PropTypes.array,
}

const mapStateToProps = (state, ownProps) => {
  const { color: hex, category } = ownProps.base
  const key = JSON.stringify({ hex, category })
  return {
    products: state.productSuggestion[key] && state.productSuggestion[key].items ?
      state.productSuggestion[key].items : []
  }
}

const mapDispatchToProps = dispatch => ({
  fetchProducts: (q) => dispatch(actions.fetchProducts(q)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductShowCase)
