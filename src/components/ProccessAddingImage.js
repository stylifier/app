import React, { Component } from 'react'
import { SafeAreaView, Image, View, ActivityIndicator, Text } from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PropTypes from 'prop-types'
import actions from '../actions'
import ColorView from './ColorView'
import ColorPallet from './ColorPallet'


class ProccessAddingImage extends Component {
  renderColorPick() {
    const { remoteImage } = this.props

    return (
      <View>
        <Text style={{ marginTop: 10, marginLeft: 10 }}>
          Tap on the color you want to find the pallet for:
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: '3%',
            width: '100%',
          }}
        >
          {
            remoteImage.colorCode.match(/.{1,6}/g).map((c, i) => (
              <ColorView
                onPress={(t) => this.props.getColorPalletRecommendation(t)}
                key={i}
                base={c}
              />
            ))
          }
        </View>
      </View>
    )
  }
  render() {
    const { localImage, remoteImage, colorPalletRecommendation } = this.props

    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
        }}
      >
        <KeyboardAwareScrollView
          style={{
            height: '100%',
            width: '100%',
          }}
        >
          {
            localImage &&
            <Image
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '1%',
                width: '95%',
                height: 300,
                borderRadius: 10,
              }}
              source={{ uri: localImage }}
            />
          }
          { remoteImage && remoteImage.colorCode && this.renderColorPick() }
          {!remoteImage && <ActivityIndicator size="small" color="#3b4e68" />}
          {colorPalletRecommendation && colorPalletRecommendation.map((cp, i) => (
            <ColorPallet
              key={i}
              base={cp}
            />)
          )}

        </KeyboardAwareScrollView>
      </SafeAreaView>
    )
  }
}

ProccessAddingImage.propTypes = {
  getColorPalletRecommendation: PropTypes.func,
  localImage: PropTypes.string,
  remoteImage: PropTypes.object,
  colorPalletRecommendation: PropTypes.array,
}

const mapStateToProps = state => state.colorSuggestion

const mapDispatchToProps = dispatch => ({
  getColorPalletRecommendation: (base) =>
    dispatch(actions.getColorPalletRecommendation(base)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProccessAddingImage)
