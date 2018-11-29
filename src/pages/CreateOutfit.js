import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View, TouchableOpacity, Text, Picker, StatusBar,
  AsyncStorage, ScrollView } from 'react-native'
import { Button, Icon, Text as NBText } from 'native-base'
import { connect } from 'react-redux'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import actions from '../actions'
import Viewer from '../components/Viewer'
import ProductShowCase from '../components/ProductShowCase'

const countries = require('country-list')()

class CreateOutfit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      country: '',
    }

    AsyncStorage.getItem('guest_submitted')
      .then(t => t && this.setState({ isSubmited: true }))
  }

  createOutfit(i, g, noDelayUpdate) {
    const { createOutfit, base, pallet } = this.props
    const { items, gender } = base

    createOutfit({
      id: base.id,
      palletId: pallet.id,
      gender: g || gender,
      items: i || items.filter(t => t.product)
    }, noDelayUpdate)
  }

  renderUserIsGuest() {
    const { isSubmited, country } = this.state
    const { askForApproval, user, goBack } = this.props
    return (
      <View
        style={{
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: 20,
          backgroundColor: '#f5f5f5',
        }}
      >
        <StatusBar barStyle="light-content" />
        {isSubmited &&
          <View
            style={{
              width: '100%',
              marginTop: 40,
              height: '100%',
            }}
          >
            <Text>
              You have submitted for this feature. We will inform you once your account is ready.
            </Text>
          </View>}
        {!isSubmited &&
        <View
          style={{
            flex: 2,
            width: '100%',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Text>
            "Create Outfit" is not available in all locations.
          </Text>
          <Text style={{ marginTop: 10 }}>
            You can submit your country of residence and in
            case the feature become available we will notify you immediately.
          </Text>
        </View>}

        {!isSubmited &&
          <View style={{ flex: 8 }}>
            <Picker
              selectedValue={country}
              style={{ height: 50, width: '100%' }}
              onValueChange={(itemValue) => this.setState({ country: itemValue })}
            >
              <Picker.Item label="Select your country" value="" />
              {countries.getNames().map((t, i) => <Picker.Item key={i} label={t} value={t} />)}
            </Picker>
          </View>}

        <View
          style={{
            width: '80%',
            marginLeft: '10%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            position: 'absolute',
            bottom: 30,
          }}
        >
          {!isSubmited &&
            <Button
              disabled={country === ''}
              onPress={() => {
                askForApproval({ country, ...user })
                goBack()
              }}
              style={{
                backgroundColor: '#3b4e68',
                borderRadius: 15
              }}
            >
              <Text> Submit </Text>
            </Button>
          }
        </View>
      </View>
    )
  }

  renderGernderChoice() {
    const { pallet } = this.props
    return (
      <View
        style={{
          width: '100%',
          padding: 20,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {['ladies', 'men'].map((g, i) => (
          <TouchableOpacity
            style={{
              width: 120,
              height: 120,
              marginBottom: 20,
              marginTop: 20,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#3b4e68',
              borderRadius: 10,
            }}
            key={i}
            onPress={() => {
              this.createOutfit(
                pallet.colors.map((t, index) => ({ query: { color: t }, index })), g)
            }}
          >
            <FontAwesome
              style={{
                marginRight: 5,
                marginTop: 2,
                color: '#3b4e68',
                fontSize: 90,
              }}
            >
              {g === 'men' ? Icons.mars : Icons.venus}
            </FontAwesome>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  render() {
    const { user, fetchProducts, pallet, base } = this.props
    const { gender, items } = base

    if (user.is_guest === true) {
      return this.renderUserIsGuest()
    }

    return (
      <View
        style={{
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#f5f5f5',
        }}
      >
        <StatusBar barStyle="light-content" />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!gender && this.renderGernderChoice()}
          {gender &&
            <ScrollView
              style={{ width: '100%', height: '100%' }}
              ref={scrollView => { this.scrollView = scrollView }}
            >
              <Viewer
                items={items}
                BaseItem={ProductShowCase}
                itemExtraProps={{
                  gender,
                  onSelectedItemChaned: (b) => {
                    this.createOutfit(items.map(r => (r.index === b.index ? b : r)))
                  },
                  onQueryChanged: (b) => {
                    if (!b.query.color || !b.query.category) {
                      this.createOutfit(items.map(r => (r.index === b.index ? b : r)))
                      return
                    }
                    fetchProducts({ ...b.query })
                      .then((p) => this.createOutfit(
                        items.map(r =>
                          (r.index === b.index ? { ...b, product: p.data[0] } : r)),
                        undefined, true))
                  },
                  onRemovePressed: (b) =>
                    this.createOutfit(
                      items.map(r => (r.index === b.index ? undefined : r))
                        .filter(t => t)
                    ),
                  colors: pallet.colors
                }}
              />
              <View style={{ width: '100%' }}>
                <Button
                  onPress={() => {
                    this.createOutfit([
                      ...items,
                      { query: { color: null, category: null }, index: items.length }
                    ])
                    setTimeout(() => this.scrollView.scrollToEnd(), 200)
                  }}
                  style={{
                    backgroundColor: '#5b7495',
                    borderRadius: 15,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  <Icon style={{ fontSize: 30, color: '#f5f5f5' }} name="add" />
                  <NBText style={{ color: '#f5f5f5' }}>
                    Add Row
                  </NBText>
                </Button>
              </View>
            </ScrollView>}
        </View>
      </View>
    )
  }
}

CreateOutfit.propTypes = {
  goBack: PropTypes.func,
  askForApproval: PropTypes.func,
  createOutfit: PropTypes.func,
  user: PropTypes.object,
  pallet: PropTypes.object,
  fetchProducts: PropTypes.func,
  base: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => {
  const { metadata } = state
  const { pageProps } = metadata
  const { colorPalletId, outfitId } = pageProps[ownProps.route]
  const base = state.outfits.find(t => t.id === outfitId) || { items: [] }
  const pallet = state.bookmarks.find(t => t.id === colorPalletId) || { colors: [] }

  return {
    user: state.user,
    pallet,
    base: { ...base, items: base.items.map((t, index) => ({ ...t, index })) },
  }
}

const mapDispatchToProps = dispatch => ({
  goBack: () => dispatch(actions.goBack()),
  askForApproval: (metadata) => dispatch(actions.askForApproval(metadata)),
  fetchProducts: (q) => dispatch(actions.fetchProducts(q)),
  createOutfit: (q, ndu) => dispatch(actions.createOutfit(q, ndu)),
  reportCreateOutfitIssues: (payload) => dispatch(actions.reportCreateOutfitIssues(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateOutfit)
