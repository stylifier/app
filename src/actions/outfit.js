import * as StoreReview from 'react-native-store-review'
import { AsyncStorage } from 'react-native'
import actions from '.'

export default {
  createOutfit: (o, noDelayUpdate) => (dispatch, getState) => {
    const { outfits } = getState()
    const outfit = outfits.find(t => t.id === o.id)

    const pids1 = o.items && o.items.filter(t => t.product).map(t => t.product.id)

    const pids2 = outfit && outfit.items &&
      outfit.items.filter(t => t.product).map(t => t.product.id)

    if ((!o.id && (!pids1 || !pids2)) || pids1.join('') === pids2.join('')) {
      dispatch({ type: 'UPDATE_OUTFIT', payload: o })
      return
    }

    clearTimeout(this.createOutfitTimeout)

    this.createOutfitTimeout = setTimeout(() =>
      actions.api.addOutfit({ ...o, items: o.items.filter(p => p.product) })
        .then(co => {
          dispatch({ type: 'UPDATE_OUTFIT', payload: { ...o, id: co.id } })
          dispatch(actions.setPageProps('CreateOutfit', {
            colorPalletId: o.palletId, outfitId: co.id
          }))
          setTimeout(() => {
            try {
              console.log(StoreReview.isAvailable);
              AsyncStorage.getItem('asked_for_review_date')
                .then((hasAsked) => {
                  if (!StoreReview.isAvailable || hasAsked) return

                  StoreReview.requestReview()
                  AsyncStorage.setItem('asked_for_review_date', new Date())
                })
                .catch(() => {})
            } catch (e) { /* ignore */ }
          }, 30000)
        })
        .catch(() => {}), (pids1.length !== pids2.length || noDelayUpdate) ? 0 : 2000)
  },

  getOutfits: () => (dispatch) => {
    actions.api.fetchOutfits()
      .then(co => dispatch({ type: 'UPDATE_OUTFITS', payload: co }))
      .catch(() => {})
  },
}
