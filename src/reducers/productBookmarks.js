const productBookmarks = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_PRODUCT_BOOKMARKS':
      return [...action.payload.map(t =>
        (!t.title ? { ...t, title: 'undefined' } : t))]

    default:
      break
  }

  return state
}

export default productBookmarks
