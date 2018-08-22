import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View, TouchableOpacity, Text, Picker, StatusBar,
  Animated, ScrollView, ActivityIndicator, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import FadeView from 'react-native-fade-view'
// import Accordion from 'react-native-collapsible/Accordion'
import SlideView from './slideView.js'
import ProductItem from './ProductItem.js'
import actions from '../actions'

const countries = require('country-list')()
const chroma = require('chroma-js')

class CreateOutfit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      country: '',
      // color: '#000000',
      // gender: 'men',
      // category: 'men>clothing>t-shirts',
    }

    AsyncStorage.getItem('guest_submitted')
    .then(t => t && this.setState({ isSubmited: true }))

    // this.Animation = new Animated.Value(1)
    this.Animation = new Animated.Value(0)
  }

  componentDidUpdate(prevProps, prevState) {
    const isShowProductActive =
      typeof this.state.gender !== 'undefined' &&
      typeof this.state.color !== 'undefined' &&
      typeof this.state.category !== 'undefined' &&
      !this.state.category.endsWith('...')

    const prevIsShowProductActive =
      typeof prevState.gender !== 'undefined' &&
      typeof prevState.color !== 'undefined' &&
      typeof prevState.category !== 'undefined' &&
      !prevState.category.endsWith('...')

    const { color } = this.state

    if (isShowProductActive !== prevIsShowProductActive) {
      if (isShowProductActive) {
        this.startLightingBackgroundColorAnimation()

        this.props.fetchProducts({
          subColor: this.props.colorCodes.sort((a, b) =>
            chroma.deltaE(color, a.code) - chroma.deltaE(color, b.code))[0].name,
          hex: color,
          category: this.state.category,
        })
      } else {
        this.startDarkingBackgroundColorAnimation()
      }
    }
  }

  renderUserIsGuest() {
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
        {this.state.isSubmited && <View
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
        {!this.state.isSubmited &&
        <View
          style={{
            flex: 2,
            width: '100%',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Text>
            "Create Outfit" is still a beta feature and not available in all locations.
          </Text>
          <Text style={{ marginTop: 10 }} >
            You can submit your country of residence and in
            case the feature become available we will notify you immediately.
          </Text>
        </View>}

        {!this.state.isSubmited && <View style={{ flex: 8 }}>
          <Picker
            selectedValue={this.state.country}
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
          <TouchableOpacity
            style={{
              marginRight: 'auto',
            }}
            onPress={() => {
              this.props.onDismissPressed()
            }}
          >
            <Text>Dismiss</Text>
          </TouchableOpacity>
          {!this.state.isSubmited && <TouchableOpacity
            disabled={this.state.country === ''}
            onPress={() => {
              this.props.askForApproval({ country: this.state.country, ...this.props.user })
              this.props.onDismissPressed()
            }}
          >
            <Text
              style={{
                color: this.state.country === '' ? 'lightgray' : 'black',
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>}
        </View>
      </View>
    )
  }

  renderGernderChoice() {
    return (
      <FadeView active={typeof this.state.gender === 'string'}>
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
                borderColor: '#F5F5F5',
                borderRadius: 10,
              }}
              key={i}
              onPress={() => this.setState({ gender: g })}
            >
              <FontAwesome
                style={{
                  marginRight: 5,
                  marginTop: 2,
                  color: '#F5F5F5',
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

  renderColorChoice() {
    return (
      <FadeView
        active={
          typeof this.state.gender === 'undefined' ||
          typeof this.state.color !== 'undefined'
        }
      >
        <View
          style={{
            width: '100%',
            padding: 20,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {
            this.props.colorPallet.match(/.{1,6}/g).map((c, i) => (
              <TouchableOpacity
                style={{
                  width: 180,
                  height: 90,
                  marginBottom: 10,
                  marginTop: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: '#F5F5F5',
                  backgroundColor: `#${c}`,
                  borderRadius: 10,
                }}
                key={i}
                onPress={() => this.setState({ color: `#${c}` })}
              />
            ))
          }
        </View>
      </FadeView>
    )
  }

  renderCategoryChoice() {
    const active =
      typeof this.state.gender === 'undefined' ||
      typeof this.state.color === 'undefined' ||
      (typeof this.state.category !== 'undefined' && !this.state.category.endsWith('...'))

    const perCat = this.state.category ?
      `${this.state.category.replace('...', '')}>` :
      `${this.state.gender}>`

    const { category } = this.state
    const { categories } = this.props

    return (
      <SlideView
        style={{
          width: '100%',
          height: '100%',
          paddingTop: 15,
          padding: 20,
        }}
        visible={!active}
        key={category}
      >
        <Text style={{ color: 'white', fontSize: 20, marginBottom: 10 }}>
          {perCat && perCat.length > 3 &&
            categories.filter(r => r.address === perCat.slice(0, perCat.length - 1))[0] &&
            `${categories.filter(r => r.address === perCat.slice(0, perCat.length - 1))[0].lable}:`}
        </Text>
        <ScrollView
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          {categories
            .map(t => t.address)
            .filter(t => t.startsWith(perCat))
            .map(m => m.replace(perCat, ''))
            .map(m => (m.indexOf('>') > 0 ? m.slice(0, m.indexOf('>')) : m))
            .filter((value, index, self) => self.indexOf(value) === index)
            .map((t, i) => (
              <TouchableOpacity
                onPress={() => {
                  const cc = categories
                    .map(tt => tt.address)
                    .filter(tt => tt.startsWith(`${perCat}${t}`))

                  this.setState({
                    category: cc.length > 1 ? `${perCat}${t}...` : `${perCat}${t}`,
                  })
                }}
                style={{ marginBottom: 10, flexDirection: 'row' }}
                key={i}
              >
                <FontAwesome
                  style={{
                    marginRight: 7,
                    marginTop: 10,
                    color: '#F5F5F5',
                  }}
                >
                  {Icons.chevronRight}
                </FontAwesome>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 24,
                  }}
                >
                  {categories.filter(r => r.address === `${perCat}${t}`)[0].lable}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </SlideView>
    )
  }

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 70
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
  }

  renderCategoryGuide() {
    const { category, gender } = this.state
    const { categories } = this.props

    const iconStyle = {
      marginRight: 5,
      marginTop: 5,
    }

    return (
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <TouchableOpacity
          style={{
            height: 20,
            marginRight: 5,
          }}
          onPress={() => this.setState({ gender: undefined, category: undefined })}
        >
          <Text style={{ fontSize: 18 }}>
            {gender && gender.slice(0, 1).toUpperCase() + gender.slice(1)}
          </Text>
        </TouchableOpacity>
        <FontAwesome style={iconStyle} >
          {Icons.chevronRight}
        </FontAwesome>
        <FontAwesome style={iconStyle} >
          {Icons.ellipsisH}
        </FontAwesome>
        <FontAwesome style={iconStyle} >
          {Icons.chevronRight}
        </FontAwesome>
        {category && (<TouchableOpacity
          style={{
            height: 20,
          }}
          onPress={() =>
            this.setState({
              category: `${category.slice(0, category.lastIndexOf('>'))}...`,
            })}
        >
          <Text style={{ fontSize: 18 }}>
            {category && category.length > 3 &&
              categories.filter(r => r.address === category)[0] &&
              categories.filter(r => r.address === category)[0].lable}
          </Text>
        </TouchableOpacity>)}
      </View>
    )
  }

  renderProductChoice() {
    const { color, gender, category } = this.state
    const { products, colorPalletId, isFetching, colorCodes, reportCreateOutfitIssues } = this.props
    const active =
      typeof gender !== 'undefined' &&
      typeof color !== 'undefined' &&
      typeof category !== 'undefined' && !category.endsWith('...')

    return (
      <SlideView
        style={{
          width: '100%',
          height: '100%',
          marginTop: -10,
        }}
        visible={active}
      >
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View>
            {this.renderCategoryGuide()}
          </View>
          <TouchableOpacity
            style={{
              padding: 10,
              width: 40,
              height: 40,
              alignSelf: 'flex-end',
              borderWidth: 2,
              borderColor: 'black',
              marginLeft: 'auto',
              backgroundColor: color,
              borderRadius: 10,
            }}
            onPress={() => this.setState({ color: undefined })}
          />
        </View>
        <ScrollView
          style={{
            width: '100%',
            height: '100%',
          }}
          onScroll={({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent)) {
              this.props.fetchMoreProducts()
            }
          }}
          scrollEventThrottle={400}
        >
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {products.map((t, i) =>
              (<ProductItem key={`ProductItem${i}`} base={{ ...t, colorPalletId }} />))}
          </View>
          {isFetching && <ActivityIndicator size="small" color="#3b4e68" />}
        </ScrollView>
        <TouchableOpacity
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            marginBottom: -5,
          }}
          onPress={() => reportCreateOutfitIssues({
            subColor: colorCodes.sort((a, b) =>
              chroma.deltaE(color, a.code) - chroma.deltaE(color, b.code))[0].name,
            hex: color,
            category,
            products,
          })}
        >
          <Text style={{ color: '#3b4e68', fontSize: 12 }}>
            Result(s) does not match? Report to improve this feature.
          </Text>
        </TouchableOpacity>
      </SlideView>
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
    const { user } = this.props

    if (user.is_guest === true) {
      return this.renderUserIsGuest()
    }

    const isShowProductActive =
      typeof this.state.gender !== 'undefined' &&
      typeof this.state.color !== 'undefined' &&
      typeof this.state.category !== 'undefined' &&
      !this.state.category.endsWith('...')

    const BackgroundColorConfig = this.Animation.interpolate({
      inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      outputRange: ['#3b4e68', '#4e5f77', '#627186', '#758395',
        '#8994a4', '#9da6b3', '#b0b8c2', '#c4c9d1', '#d7dbe0', '#ebedef', '#f6f6f6'],
    })

    return (
      <Animated.View
        style={{
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: BackgroundColorConfig,
        }}
      >
        <StatusBar barStyle={isShowProductActive ? 'dark-content' : 'light-content'} />
        <View
          style={{
            flex: 0.5,
            width: '100%',
            justifyContent: 'center',
            height: '100%',
            marginTop: 20,
          }}
        >
          {this.state.gender && (<TouchableOpacity
            style={{
              marginRight: 'auto',
              flexDirection: 'row',
              paddingTop: 10,
              marginLeft: 10,
            }}
            onPress={() => {
              const { category } = this.state

              if (category &&
                category.replace('...', '').replace('>', '') !== `${this.state.gender}`) {
                this.setState({
                  category: `${category.slice(0, category.lastIndexOf('>'))}...`,
                })
                return
              }

              if (this.state.color) {
                this.setState({ color: undefined })
                return
              }

              if (this.state.gender) {
                this.setState({ gender: undefined, category: undefined })
                return
              }

              this.props.onDismissPressed()
            }}
          >
            <FontAwesome
              style={{
                marginRight: 5,
                marginTop: 3,
                color: isShowProductActive ? 'black' : '#F5F5F5',
              }}
            >
              {Icons.chevronLeft}
            </FontAwesome>
            <Text
              style={{
                color: isShowProductActive ? 'black' : '#F5F5F5',
                fontSize: 16,
              }}
            >Back</Text>
          </TouchableOpacity>)}

          <TouchableOpacity
            style={{
              marginRight: 'auto',
              flexDirection: 'row',
              paddingTop: 10,
              position: 'absolute',
              right: 10,
            }}
            onPress={() => this.props.onDismissPressed()}
          >
            <Text
              style={{
                color: isShowProductActive ? 'black' : '#F5F5F5',
                fontSize: 16,
              }}
            >Close</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 9.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {this.renderGernderChoice()}
          {this.renderColorChoice()}
          {this.renderCategoryChoice()}
          {this.renderProductChoice()}
        </View>
      </Animated.View>
    )
  }
}

CreateOutfit.propTypes = {
  onDismissPressed: PropTypes.func,
  askForApproval: PropTypes.func,
  fetchProducts: PropTypes.func,
  fetchMoreProducts: PropTypes.func,
  reportCreateOutfitIssues: PropTypes.func,
  user: PropTypes.object,
  isFetching: PropTypes.bool,
  colorPallet: PropTypes.string,
  colorPalletId: PropTypes.string,
  products: PropTypes.array,
  colorCodes: PropTypes.array,
  categories: PropTypes.array,
}

const mapStateToProps = state => ({
  user: state.user,
  colorCodes: state.metadata.colorCodes,
  categories: state.metadata.categories,
  products: state.productSuggestion.items,
  isFetching: state.productSuggestion.loading,
})

const mapDispatchToProps = dispatch => ({
  askForApproval: (metadata) => dispatch(actions.askForApproval(metadata)),
  fetchProducts: (q) => dispatch(actions.fetchProducts(q)),
  fetchMoreProducts: () => dispatch(actions.fetchMoreProducts()),
  reportCreateOutfitIssues: (payload) => dispatch(actions.reportCreateOutfitIssues(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateOutfit)
