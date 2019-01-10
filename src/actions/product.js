import actions from '.'

export default {
  deleteBookmarkedProduct: (productId, palletId) => (dispatch) => {
    actions.api.deleteBookmarkedProduct(productId, palletId)
      .then(() => dispatch(actions.refreshBookmarks()))
      .catch(() => {})
  },

  bookmarkProduct: (productId, palletId, title) => (dispatch) => {
    actions.api.bookmarkProduct(productId, palletId, title)
      .then(() => dispatch(actions.refreshBookmarks()))
      .catch(() => {})
  },

  fetchProducts: (q) => (dispatch) => {
    dispatch({ type: 'LOADING_PRODUCT_SUGGESTION', payload: { key: JSON.stringify(q) } })

    return actions.api.fetchProducts(q)
      .then(products => {
        dispatch({
          type: 'RENEW_PRODUCT_SUGGESTION',
          payload: {
            items: [...products.data],
            pagination: products.pagination,
            queries: { ...q },
            key: JSON.stringify(q),
          },
        })
        return products
      })
      .catch(() => {
        dispatch({ type: 'FAILED_PRODUCT_SUGGESTION', payload: { key: JSON.stringify(q) } })
        Promise.resolve()
      })
  },

  fetchMoreProducts: (q) => (dispatch, getState) => {
    const { productSuggestion } = getState()
    const key = JSON.stringify(q)

    if (!productSuggestion[key] ||
      productSuggestion[key].loading ||
      productSuggestion[key].finished) {
      return
    }

    dispatch({ type: 'LOADING_PRODUCT_SUGGESTION', payload: { key: JSON.stringify(q) } })

    actions.api.fetchProducts(q, productSuggestion[key].pagination)
      .then(products => {
        dispatch({
          type: 'ADD_TO_PRODUCT_SUGGESTION',
          payload: {
            items: [...products.data],
            pagination: products.pagination,
            key: JSON.stringify(q),
          },
        })
      })
      .catch(() => {})
  },
}
