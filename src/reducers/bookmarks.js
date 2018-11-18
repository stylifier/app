const colorSuggestion = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_COLOR_PALLET_BOOKMARKS':
      return [
        ...action.payload.filter(t => t).map(c => ({
          ...c,
          colors: c.code ?
            c.code.match(/.{1,6}/g).map(t => `#${t}`) : []
        }))
      ]

    default:
      break
  }

  return state
}

export default colorSuggestion
