import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View, TouchableOpacity, Text, Picker, StatusBar,
  Animated, AsyncStorage, ScrollView } from 'react-native'
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
      gender: props.base ? props.base.gender : undefined,
      items: (props.base && props.base.items) ?
        props.base.items.map((t, index) => ({ ...t, index })) :
        props.pallet.colors.map(
          (t, index) =>
            ({ query: { color: t, category: null }, index, product: null }))
    }

    AsyncStorage.getItem('guest_submitted')
      .then(t => t && this.setState({ isSubmited: true }))
  }

  componentDidUpdate(prevProps, prevState) {
    const { createOutfit, base, colorPalletId } = this.props
    const { items, gender } = this.state

    if (
      items.map(t => t.product).filter(t => t).map(t => t.id).join('') !==
      prevState.items.map(t => t.product).filter(t => t).map(t => t.id).join('')) {
      createOutfit({
        id: base.id,
        palletId: colorPalletId,
        gender,
        items: items.filter(t => t.product)
      })
    }
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
            onPress={() => this.setState({ gender: g })}
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

  startLightingBackgroundColorAnimation() {
    this.Animation.setValue(0)

    Animated.timing(
      this.Animation,
      {
        toValue: 1,
        duration: 500,
      }
    ).start()
  }

  startDarkingBackgroundColorAnimation() {
    this.Animation.setValue(1)

    Animated.timing(
      this.Animation,
      {
        toValue: 0,
        duration: 500,
      }
    ).start()
  }

  render() {
    const { user, fetchProducts, pallet, createOutfit, colorPalletId, base } = this.props
    const { gender, items } = this.state

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
            <ScrollView style={{ width: '100%', height: '100%' }}>
              <Viewer
                items={items}
                BaseItem={ProductShowCase}
                itemExtraProps={{
                  gender,
                  onSelectedItemChaned: (b) => {
                    this.setState({
                      items: items.map(r => (r.index === b.index ? b : r))
                    })
                  },
                  onQueryChanged: (b) => {
                    this.setState({
                      items: items.map(r => (r.index === b.index ? b : r))
                    })
                    fetchProducts({ ...b.query })
                  },
                  onRemovePressed: (b) =>
                    this.setState({
                      items: items.map(r => (r.index === b.index ? undefined : r)).filter(t => t)
                    }),
                  colors: pallet.colors
                }}
              />
              <View style={{ width: '100%' }}>
                <Button
                  onPress={() => this.setState({
                    items: [
                      ...items,
                      { query: { color: null, category: null }, index: items.length }]
                  })}
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
  colorPalletId: PropTypes.string,
  pallet: PropTypes.object,
  fetchProducts: PropTypes.func,
  base: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  pallet: state.bookmarks.find(t => t.id === ownProps.colorPalletId),
  base: state.outfits.find(t => t.id === ownProps.outfitId)
})

const mapDispatchToProps = dispatch => ({
  goBack: () => dispatch(actions.goBack()),
  askForApproval: (metadata) => dispatch(actions.askForApproval(metadata)),
  fetchProducts: (q) => dispatch(actions.fetchProducts(q)),
  createOutfit: (q) => dispatch(actions.createOutfit(q)),
  reportCreateOutfitIssues: (payload) => dispatch(actions.reportCreateOutfitIssues(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateOutfit)
