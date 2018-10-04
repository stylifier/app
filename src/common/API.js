import { AsyncStorage } from 'react-native'
import moment from 'moment'

class API {
  constructor() {
    this.baseAddress = 'https://cloud.stylifier.com'
    // this.baseAddress = 'http://192.168.178.20:3000'
    AsyncStorage.getItem('user_token')
    .then(t => { this.token = t })

    this.userInfo = {}

    AsyncStorage.getItem('user_info')
    .then(t => { this.userInfo = t ? JSON.parse(t) : {} })
  }

  setToken(token) {
    AsyncStorage.setItem('user_token', token)
    this.token = token
  }

  get(path, params, extraHeaders) {
    extraHeaders = extraHeaders || {}
    const paramsStr = params &&
      params.length > 0 ? `?${params.join('&')}` : ''

    const ret = fetch(this.baseAddress + path + paramsStr, {
        headers: Object.assign({
          accept: 'json',
          Authorization: 'Bearer '+ this.token,
          'x-consumer-username': this.userInfo.username
        }, extraHeaders),
        method: 'GET'
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300)
          return Promise.resolve(response)

        var error = new Error(response.statusText || response.status)
        error.response = response
        return Promise.reject(error)
      })
      .then((response) => response.json())

    return ret
  }

  delete(path, extraHeaders, params) {
    extraHeaders = extraHeaders || {}

    const paramsStr = params &&
      params.length > 0 ? `?${params.join('&')}` : ''

    const ret = fetch(this.baseAddress + path + paramsStr, {
        headers: Object.assign({
          accept: 'json',
          Authorization: 'Bearer '+ this.token,
          'x-consumer-username': this.userInfo.username
        }, extraHeaders),
        method: 'DELETE'
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300)
          return Promise.resolve(response)

        var error = new Error(response.statusText || response.status)
        error.response = response
        return Promise.reject(error)
      })
      .then((response) => response.json())

    return ret
  }

  post(path, body, params) {
    const paramsStr = params &&
      params.length > 0 ? `?${params.join('&')}` : ''

    const ret = fetch(this.baseAddress + path + paramsStr, {
        body: JSON.stringify(Object.assign({}, body)),
        headers: {
          'Content-Type': 'application/json',
          accept: 'json',
          Authorization: 'Bearer '+ this.token,
          'x-consumer-username': this.userInfo.username
        },
        method: 'POST'
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300)
          return Promise.resolve(response)

        var error = new Error(response.statusText || response.status)
        error.response = response
        return Promise.reject(error)
      })
      .then((response) => response.json())

    return ret
  }

  put(path, body) {
    const ret = fetch(this.baseAddress + path, {
        body: JSON.stringify(Object.assign({}, body)),
        headers: {
          'Content-Type': 'application/json',
          accept: 'json',
          Authorization: 'Bearer '+ this.token,
          'x-consumer-username': this.userInfo.username
        },
        method: 'PUT'
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300)
          return Promise.resolve(response)

        var error = new Error(response.statusText || response.status)
        error.response = response
        return Promise.reject(error)
      })
      .then((response) => response.json())

    return ret
  }

  uploadImage(img) {
    var formData  = new FormData();
    formData.append('qqfile', {uri: img, name: 'qqfile', type: 'image/jpg'});

    const ret = fetch(this.baseAddress + '/media', {
      method: 'POST',
      headers:  {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        Authorization: 'Bearer '+ this.token,
        'x-consumer-username': this.userInfo.username
      },
        body: formData
    })
    .then((response) => {
      if (response.status >= 200 && response.status < 300)
        return Promise.resolve(response)

      var error = new Error(response.statusText || response.status)
      error.response = response
      return Promise.reject(error)
    })
    .then((response) => response.json())

    return ret
  }

  login(info) {
    this.userInfo.username = info.username
    return this.post('/login', info)
    .then((res) => {
      if(!res.jwt)
        return Promise.reject(new Error('could not fetch token from api'))
      return res.jwt
    })
  }

  register(info) {
    this.userInfo.username = info.username
    return this.post('/register', info)
    .then((res) => {
      if(!res.jwt)
        return Promise.reject(new Error('could not fetch token from api'))
      return res.jwt
    })
  }

  fetchBrands(q, pagination) {
    return this.get('/brands', ['q=' + encodeURIComponent(q), ...(pagination ? ['pagination=' + pagination] : [])])
  }

  fetchUsers(q, pagination) {
    return this.get('/users', ['q=' + encodeURIComponent(q), ...(pagination ? ['pagination=' + pagination] : [])])
  }

  fetchFeeds(pagination) {
    return this.get('/feeds', pagination ? ['pagination=' + pagination] : [])
  }

  fetchUserInfo() {
    return this.get('/user/self')
  }

  fetchUser(username) {
    return this.get('/users/' + username)
  }

  closeThread(threadId, reviewObj) {
    return this.post(`/threads/${threadId}/close`, reviewObj)
  }

  followUser(username) {
    return this.post(`/users/${username}/follow`, {})
  }

  createThread(toUsername) {
    return this.post('/threads', {to: {username: toUsername}})
  }

  createMessage(threadId, text, media, products) {
    return this.put(`/threads/${threadId}/messages`, {text: text, media: media, products})
  }

  addMediaToThread(threadId, media) {
    return this.put(`/threads/${threadId}/media`, {media: media})
  }

  fetchUserFollowers(username, pagination, quary) {
    return this.get(`/users/${username}/followers`,
      [
        ...(quary ? ['q=' + quary] : []),
        ...(pagination ? ['pagination=' + pagination] : [])
      ])
  }

  fetchSelfCampaigns() {
    return this.get('/self_campaigns', [])
  }

  fetchCampaigns() {
    return this.get('/campaigns', [])
  }

  fetchUserMedia(username, pagination) {
    return this.get(`/users/${username}/media`, pagination ? ['pagination=' + pagination] : [])
  }

  fetchThreads(q, pagination) {
    return this.get('/threads', [ ...(q ? ['q=' + encodeURIComponent(q)] : []), ...(pagination ? ['pagination=' + pagination] : [])])
  }

  fetchMessages(threadId, pagination) {
    return this.get(`/threads/${threadId}/messages`, pagination ? ['pagination=' + pagination] : [])
  }

  addSubsctiption(id, name) {
    if(!id) return Promise.resolve()
    return this.post(`/subscriptions/${id}?name=${name}`, {})
  }

  shareMedia(id) {
    return this.post(`/media/${id}/share`, {})
  }

  addDescriptionToMedia(id, description) {
    return this.post(`/media/${id}/description`, {description})
  }

  removeSubsctiption(id) {
    return this.delete(`/subscriptions/${id}`, {})
  }

  fetchUserSponsoredBy(username, pagination, quary) {
    return this.get(`/users/${username}/sponsored_by`,
      [
        ...(quary ? ['q=' + quary] : []),
        ...(pagination ? ['pagination=' + pagination] : [])
      ])
  }

  fetchUserSponsors(username, pagination, quary) {
    return this.get(`/users/${username}/sponsors`,
      [
        ...(quary ? ['q=' + quary] : []),
        ...(pagination ? ['pagination=' + pagination] : [])
      ])
  }

  sponsorUser(username, accept) {
    return this.post(`/users/${username}/sponsor`, accept ? {accept: true} : {})
  }

  setStyle(mediaId, style) {
    if(!mediaId || !style) return Promise.resolve()
    return this.post(`/media/${mediaId}/style/${style}`, {})
  }

  bookmarkColorPallet(palletId, title) {
    return this.post(`/color_pallets/${palletId}${title ? '?title=' + title : ''}`, {})
  }

  deleteBookmarkedColorPallet(palletId) {
    return this.delete(`/color_pallets/${palletId}`, {})
  }

  getColorPalletBookmarks() {
    return this.get('/color_pallets_bookmarks', [])
    .then(res => ({
      ...res,
      data: res.data
      .sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)))
    }))
  }

  bookmarkProduct(productId, palletId, title) {
    title = title === 'undefined' ? undefined : title

    console.log('--->', title);
    return this.post(`/product/${productId}/bookmark`, {}, [
      ...(palletId ? ['pallet_id=' + palletId] : []),
      ...(title ? ['title=' + title] : [])
    ])
  }

  deleteBookmarkedProduct(productId, palletId) {
    return this.delete(`/product/${productId}/bookmark`, {}, [
      ...(palletId ? ['pallet_id=' + palletId] : [])
    ])
  }

  getProductBookmarks() {
    return this.get('/product_bookmarks', [])
    .then(res => ({
      ...res,
      data: res.data
      .sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)))
    }))
  }


  getStyles(q) {
    return this.get('/styles', [ ...(q ? ['q=' + encodeURIComponent(q)] : [])])
  }

  getUserStyles(user, q) {
    return this.get(`/users/${user}/styles`, [ ...(q ? ['q=' + encodeURIComponent(q)] : [])])
  }

  searchMedia(q, pagination) {
    return this.get('/media',
      [
        ...(q ? ['q=' + q] : []),
        ...(pagination ? ['pagination=' + pagination] : [])
      ])
  }

  createCampaign(media, shopAddress, description) {
    return this.post('/campaigns', {
      media, shopAddress, description
    })
  }

  createProduct(media, name, code, price, shopAddress) {
    return this.post('/products', {media, name, code, price, shopAddress})
  }

  fetchSelfProducts(q, pagination) {
    if(!q)
      q = {}

    return this.get('/products',
      [
        ...(q.name ? ['name=' + q.name] : []),
        ...(q.color ? ['color=' + q.color] : []),
        ...(q.subColor ? ['sub_color=' + q.subColor] : []),
        ...(q.category ? ['category=' + q.category] : []),
        ...(q.hex ? ['hex=' + q.hex] : []),
        ...(pagination ? ['pagination=' + pagination] : [])
      ]
    )
  }

  fetchUserProducts(username, q, pagination) {
    if(!q)
      q = {}

    return this.get(`/users/${username}/products`,
      [
        ...(q.name ? ['name=' + q.name] : []),
        ...(q.color ? ['color=' + q.color] : []),
        ...(q.subColor ? ['sub_color=' + q.subColor] : []),
        ...(q.category ? ['category=' + q.category] : []),
        ...(q.hex ? ['hex=' + q.hex] : []),
        ...(pagination ? ['pagination=' + pagination] : [])
      ]
    )
  }

  setProfilePicture(media) {
    Object.keys(media).forEach((key) => (media[key] == null) && delete media[key]);
    return this.post('/user/self/profile_picture', Object.assign({}, media))
  }

  getUserAddresses() {
    return this.get('/addresses', [])
    .then(t => t.reverse())
  }

  createAddress(address) {
    return this.post('/addresses', Object.assign({}, address))
  }

  deleteAddress(id) {
    return this.delete('/addresses/' + id, {})
  }

  addOrder(product) {
    delete product.media
    return this.put('/orders', Object.assign({}, product))
  }

  fetchOpenOrders() {
    return this.get('/orders', ['status=OPEN'])
    .then(t => t.reverse())
  }

  fetchColorPalletRecommendation(base) {
    return this.get('/color_pallets', ['color_code=%23' + base])
  }

  fetchOrders() {
    return this.get('/orders')
    .then(t => t.reverse())
  }

  deleteOrderItem(item) {
    return this.delete('/order-item/' + item.id, {})
  }

  closeOrders(orders, address, paymentToken) {
    const add = Object.assign({}, address)
    add.postalCode = parseInt(add.postalCode, 10)
    add.id = add.id.toString()
    return this.post('/orders/close', {orders, address: add, payment_token: paymentToken})
  }

  setOrderStatus(orderId, status) {
    return this.post(`/orders/${orderId}/status/${status}`, {})
  }

  askForApproval(metadata = {}) {
    return this.post('/user/self/request_approval', metadata)
  }

  report(metadata = {}) {
    return this.post('/report', metadata)
  }

  approveUser(username) {
    return this.post(`/users/${username}/approve`, {})
  }

  fetchColorCodes() {
    return this.get('/color_codes')
  }

  fetchCategories() {
    return this.get('/product_categories')
  }
}

export default API
