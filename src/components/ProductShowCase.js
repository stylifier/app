import React, { Component } from 'react'
import { View, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import Carousel from 'react-native-snap-carousel'
import { connect } from 'react-redux'
import { Icon, Spinner } from 'native-base'
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

  renderColorSelector() {
    const { base, onQueryChanged, colors } = this.props
    const { color } = base

    return (<ColorSelector
      defaultValue={color}
      colors={colors}
      onDone={c => onQueryChanged && onQueryChanged({ ...base, color: c })}
    />)
  }

  renderCategorySelector() {
    const { base, gender, onQueryChanged } = this.props
    const { category } = base

    return (<CategorySelector
      gender={gender}
      defaultValue={category}
      onSelect={c => onQueryChanged && onQueryChanged({ ...base, category: c })}
    />)
  }

  renderSlideShow() {
    const { products, loading, fetchMoreProducts, base } = this.props
    const { color, category } = base

    if (products.length < 1 && loading) {
      return (<Spinner color="#5b7495" style={{ width: '90%', marginTop: 50 }} />)
    }

    return (
      <Carousel
        data={products}
        renderItem={this.renderItem}
        layout="default"
        inactiveSlideScale={0.8}
        lockScrollTimeoutDuration={100}
        onSnapToItem={(i) =>
          (i > products.length - 8) && fetchMoreProducts({ hex: color, category })}
        inactiveSlideOpacity={0.4}
        sliderWidth={Dimensions.get('window').width - 40}
        itemWidth={130}
      />
    )
  }

  render() {
    const { base, onRemovePressed } = this.props
    const { color, category } = base
    return (
      <View>
        <View style={{ width: '100%', height: 40, flexDirection: 'row' }}>
          <Icon
            style={{
              fontSize: 30,
              color: 'darkred',
              position: 'absolute',
              right: 0,
              top: 0,
              margin: 5,
            }}
            name="ios-remove-circle"
            onPress={() => onRemovePressed(base)}
          />
          {category && this.renderCategorySelector()}
        </View>
        <View style={{ width: '100%', flexDirection: 'row' }}>
          {color && this.renderColorSelector()}
          {category ?
            this.renderSlideShow() :
            <View
              style={{
                width: Dimensions.get('window').width - (color ? 40 : 0),
                backgroundColor: !color ? 'lightgray' : undefined,
                height: 160,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {!color && this.renderColorSelector()}
              {color && this.renderCategorySelector()}
            </View>
          }
        </View>
      </View>
    )
  }
}

ProductShowCase.propTypes = {
  base: PropTypes.object,
  fetchProducts: PropTypes.func,
  onQueryChanged: PropTypes.func,
  onRemovePressed: PropTypes.func,
  fetchMoreProducts: PropTypes.func,
  gender: PropTypes.string,
  colors: PropTypes.array,
  products: PropTypes.array,
  loading: PropTypes.bool,
}

const mapStateToProps = (state, ownProps) => {
  const { color: hex, category } = ownProps.base
  const key = JSON.stringify({ hex, category })
  return {
    products: state.productSuggestion[key] && state.productSuggestion[key].items ?
      state.productSuggestion[key].items : [],
    loading: state.productSuggestion[key] ?
      state.productSuggestion[key].loading : false
  }
}

const mapDispatchToProps = dispatch => ({
  fetchProducts: (q) => dispatch(actions.fetchProducts(q)),
  fetchMoreProducts: (q) => dispatch(actions.fetchMoreProducts(q)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductShowCase)
