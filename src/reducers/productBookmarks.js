const productBookmarks = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_PRODUCT_BOOKMARKS':
      return [...action.payload]

    default:
      break
  }

  return state
}

export default productBookmarks
