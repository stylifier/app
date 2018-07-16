import React, {Component} from 'react';
import {Text, SafeAreaView, Image, View, ActivityIndicator} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import actions from '../actions'
import ColorView from './ColorView'
import ColorPallet from './ColorPallet'
import { connect } from 'react-redux'

class ProccessAddingImage extends Component {
  render() {
    const {localImage, remoteImage, colorPalletRecommendation} = this.props
    return (
      <SafeAreaView style={{
        flex: 1,
        alignItems: 'center'
      }}>
        <KeyboardAwareScrollView style={{
          height: '100%',
          width: '100%'
        }}>
          {localImage && <Image style={{marginLeft: 'auto', marginRight: 'auto', marginTop: '1%', width: '95%', height: 300, borderRadius: 10}} source={{uri: localImage}} />}
          <View style={{flexDirection: 'row', marginTop: '3%', width: '100%',}}>
            {remoteImage && remoteImage.colorCode && remoteImage.colorCode.match(/.{1,6}/g).map((c, i) => {
              return (
                <ColorView
                  onPress={(c) => this.props.getColorPalletRecommendation(c)}
                  key={i}
                  base={c}
                />
              )})}
          </View>
          {!remoteImage && <ActivityIndicator size="small" color="#3b4e68" />}
          {colorPalletRecommendation && colorPalletRecommendation.map((cp, i) => {
            return (<ColorPallet
              key={i}
              base={cp}
            />)
          })}

        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => state.colorSuggestion

const mapDispatchToProps = dispatch => ({
  getColorPalletRecommendation: (base) =>
    dispatch(actions.getColorPalletRecommendation(base)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProccessAddingImage)
