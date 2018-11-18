import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View, TouchableOpacity, Text, Picker, StatusBar,
  Animated, AsyncStorage, ScrollView } from 'react-native'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import FadeView from 'react-native-fade-view'
import actions from '../actions'
import Viewer from '../components/Viewer'
import ProductShowCase from '../components/ProductShowCase'

const countries = require('country-list')()

class CreateOutfit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      country: '',
      gender: undefined,
      rows:
        props.pallet.colors.map((t, index) => ({ color: t, category: null, index }))
    }

    AsyncStorage.getItem('guest_submitted')
      .then(t => t && this.setState({ isSubmited: true }))
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
              buttonStyle={{
                backgroundColor: '#3b4e68',
                borderRadius: 15
              }}
              title="Submit"
              raised
            />}
        </View>
      </View>
    )
  }

  renderGernderChoice() {
    const { gender } = this.state
    return (
      <FadeView active={typeof gender === 'string'}>
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
      </FadeView>
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
    const { user, fetchProducts, pallet } = this.props
    const { gender, rows } = this.state

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
          {this.renderGernderChoice()}
          {gender &&
            <ScrollView style={{ width: '100%', height: '100%' }}>
              <Viewer
                items={rows}
                BaseItem={ProductShowCase}
                itemExtraProps={{
                  gender,
                  onQueryChanged: (b) => {
                    this.setState({
                      rows: rows.map(r => (r.index === b.index ? b : r))
                    })
                    fetchProducts({
                      hex: b.color,
                      category: b.category,
                    })
                  },
                  colors: pallet.colors
                }}
              />
            </ScrollView>}
        </View>
      </View>
    )
  }
}

CreateOutfit.propTypes = {
  goBack: PropTypes.func,
  askForApproval: PropTypes.func,
  user: PropTypes.object,
  pallet: PropTypes.object,
  fetchProducts: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  pallet: state.bookmarks.find(t => t.id === ownProps.colorPalletId)
})

const mapDispatchToProps = dispatch => ({
  goBack: () => dispatch(actions.goBack()),
  askForApproval: (metadata) => dispatch(actions.askForApproval(metadata)),
  fetchProducts: (q) => dispatch(actions.fetchProducts(q)),
  reportCreateOutfitIssues: (payload) => dispatch(actions.reportCreateOutfitIssues(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateOutfit)
