const feeds = (state = {
  searchPhrase: '',
  userSearchPagination: 0,
  userResult: [],
  userSearchLoading: false,
  brandSearchPagination: 0,
  brandResult: [],
  brandSearchLoading: false,
  styleSearchPagination: 0,
  styleResult: [],
  styleSearchLoading: false,
  usersMetadata: {},
}, action) => {
  switch (action.type) {
    case 'SET_SEARCH_PHRASE':
      return {
        ...state,
        searchPhrase: action.payload,
        userSearchPagination: 0,
        userResult: [],
        userSearchLoading: true,
        brandSearchPagination: 0,
        brandResult: [],
        brandSearchLoading: true,
        styleSearchPagination: 0,
        styleResult: [],
        styleSearchLoading: true,
      }

    case 'CLEAR_SEARCH_PHRASE':
      return {
        ...state,
        searchPhrase: '',
        userSearchPagination: 0,
        userResult: [],
        userSearchLoading: false,
        brandSearchPagination: 0,
        brandResult: [],
        brandSearchLoading: false,
        styleSearchPagination: 0,
        styleResult: [],
        styleSearchLoading: false,
      }

    case 'SET_USER_SEARCH_RESULT':
      return {
        ...state,
        userResult: action.payload.data,
        userSearchPagination: action.payload.pagination,
        userSearchLoading: false,
      }

    case 'ADD_MORE_USER_SEARCH_RESULT':
      return {
        ...state,
        userResult: [
          ...state.userResult,
          ...action.payload.data.filter(m =>
            state.userResult.filter(t => t.id === m.id).length === 0),
        ],
        userSearchPagination: action.payload.pagination,
        userSearchLoading: false,
      }

    case 'SET_BRAND_SEARCH_RESULT':
      return {
        ...state,
        brandResult: action.payload.data,
        brandSearchPagination: action.payload.pagination,
        brandSearchLoading: false,
      }

    case 'ADD_MORE_BRAND_SEARCH_RESULT':
      return {
        ...state,
        brandResult: [
          ...state.brandResult,
          ...action.payload.data.filter(m =>
            state.brandResult.filter(t => t.id === m.id).length === 0),
        ],
        brandSearchPagination: action.payload.pagination,
        brandSearchLoading: false,
      }

    case 'SET_STYLE_SEARCH_RESULT':
      return {
        ...state,
        styleResult: action.payload.data,
        styleSearchPagination: action.payload.pagination,
        styleSearchLoading: false,
      }

    case 'ADD_MORE_STYLE_SEARCH_RESULT':
      return {
        ...state,
        styleResult: [
          ...state.styleResult,
          ...action.payload.data.filter(m =>
            state.styleResult.filter(t => t.id === m.id).length === 0),
        ],
        styleSearchPagination: action.payload.pagination,
        styleSearchLoading: false,
      }

    case 'ADD_USER_MEDIA':
      return {
        ...state,
        usersMetadata: {
          ...state.usersMetadata,
          ...{
            [action.payload.username]: {
              ...state.usersMetadata[action.payload.username],
              ...{
                media: [...action.payload.data],
                pagination: action.payload.pagination,
              },
            },
          },
        },
      }

    case 'ADD_USER_INFO':
      return {
        ...state,
        usersMetadata: {
          ...state.usersMetadata,
          ...{
            [action.payload.username]: {
              ...state.usersMetadata[action.payload.username],
              ...{ info: { ...action.payload } },
            },
          },
        },
      }

    case 'ADD_USER_FOLLOWERS':
      return {
        ...state,
        usersMetadata: {
          ...state.usersMetadata,
          ...{
            [action.payload.username]: {
              ...state.usersMetadata[action.payload.username],
              ...{ followers: [...action.payload.data.map(t => t.username)] },
            },
          },
        },
      }

    default:
      break
  }

  return state
}

export default feeds
