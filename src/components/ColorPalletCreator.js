import React from 'react'
import PropTypes from 'prop-types'
import { View, Image, Text } from 'react-native'
import Modal from 'react-native-modal'
import { Button, Divider } from 'react-native-elements'
import { getPixelRGBA } from 'react-native-get-pixel'
import AutoHeightImage from 'react-native-auto-height-image'
import { connect } from 'react-redux'
import RNFS from 'react-native-fs'
import actions from '../actions'
import Draggable from './Draggable'

function componentToHex(c) {
  const hex = c.toString(16)
  return (hex.length === 1 ? (`0${hex}`) : hex)
}

function rgbToHex(c) {
  return `#${componentToHex(c[0])}${componentToHex(c[1])}${componentToHex(c[2])}`
}

class ColorPalletCreator extends React.Component {
  constructor(props) {
    super(props)

    const u = props.base.images.standard_resolution.url
    const dp = RNFS.DocumentDirectoryPath

    this.state = {
      show: false,
      imageName: `${dp}/${props.base.id}.${u.substr(u.lastIndexOf('.') + 1)}`,
      imageWidth: 0,
      imageHeight: 0,
      containerWidth: 0,
      containerHeight: 0,
      color1: 'lightgray',
      color2: 'lightgray',
      color3: 'lightgray',
      color4: 'lightgray',
    }
  }

  componentDidMount() {
    const { base } = this.props
    const { imageName } = this.state
    const imageUrl = base.images.standard_resolution.url
    Image.getSize(imageUrl,
      (width, height) => this.setState({ imageWidth: width, imageHeight: height }))
    RNFS.downloadFile({ fromUrl: imageUrl, toFile: imageName })
      .promise.then(() => {}).catch(() => {})

    setTimeout(() =>
      this.containerRef.measure((fx, fy, w, h) =>
        this.setState({ containerWidth: w, containerHeight: h })), 300)
  }

  renderDraggable(colorKey) {
    const { imageWidth, imageHeight, imageName } = this.state
    return (
      <Draggable
        style={{ padding: 5 }}
        reverse={false}
        renderColor={this.state[colorKey]}
        renderText={colorKey.slice(colorKey.length - 1)}
        pressInDrag={() => {}}
        pressOutDrag={() => {}}
        pressDragRelease={() => {}}
        onMove={((x, y) => {
          this.autoHeightImageView.measure((fx, fy, w, h, px, py) => {
            clearTimeout(this.getPixelTimeout)
            this.getPixelTimeout = setTimeout(() => {
              const ix = ((x - px) / w) * imageWidth
              const iy = ((y - py) / h) * imageHeight
              getPixelRGBA(imageName, ix, iy)
                .then(c => this.setState({ [colorKey]: rgbToHex(c) }))
                .catch(() => {})
            }, 10)
          })
        })}
      />
    )
  }

  render() {
    const { show, color1, color2, color3, color4, containerWidth, text } = this.state
    const { onDone, full, base, createColorPallet } = this.props

    return (
      <View
        style={{ width: '100%', justifyContent: 'center' }}
        ref={t => { this.containerRef = t }}
      >
        <Modal
          isVisible={show}
          avoidKeyboard
          swipeDirection="down"
          onSwipe={() => this.setState({ show: false })}
        >
          <View style={{ justifyContent: 'flex-end', height: '100%', width: '100%' }}>
            <View
              style={{
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                width: '100%',
                backgroundColor: '#f0f0f0',
                padding: 10,
                alignSelf: 'flex-end',
              }}
            >
              <View ref={t => { this.autoHeightImageView = t }}>
                <AutoHeightImage
                  z={2}
                  width={containerWidth - 20}
                  style={{ borderRadius: 9, marginLeft: 'auto', marginRight: 'auto' }}
                  onLoadStart={() => this.setState({ imageLoading: true })}
                  onLoadEnd={() => this.setState({ imageLoading: false })}
                  source={{ uri: base.images.standard_resolution.url }}
                />
              </View>
              <Text>
                Create color pallet by dragging boxes below on your image
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                {this.renderDraggable('color1')}
                {this.renderDraggable('color2')}
                {this.renderDraggable('color3')}
                {this.renderDraggable('color4')}
              </View>
            </View>
            <View style={{ alignSelf: 'flex-end', width: '100%', marginBottom: 20 }}>
              <Divider />
              <Button
                disabled={
                  color1 === 'lightgray' ||
                  color2 === 'lightgray' ||
                  color3 === 'lightgray' ||
                  color4 === 'lightgray'
                }
                onPress={() => {
                  createColorPallet(
                    base.id,
                    color1.replace('#', '') +
                    color2.replace('#', '') +
                    color3.replace('#', '') +
                    color4.replace('#', '')
                  )
                  onDone(text || '')
                  this.setState({ show: false })
                }}
                buttonStyle={{
                  backgroundColor: '#f0f0f0',
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                  paddingTop: 10,
                  paddingBottom: 10,
                  marginLeft: 0,
                }}
                containerViewStyle={{ width: '100%', marginLeft: 0 }}
                color="#0079ff"
                large
                title="Create"
              />
            </View>
            <View style={{ width: '100%', justifyContent: 'center' }}>
              <Button
                onPress={() => this.setState({ show: false })}
                buttonStyle={{
                  backgroundColor: '#f0f0f0',
                  borderRadius: 15,
                  paddingTop: 10,
                  paddingBottom: 10,
                  marginLeft: 0,
                }}
                containerViewStyle={{ width: '100%', marginLeft: 0 }}
                color="#0079ff"
                large
                title="Cancel"
              />
            </View>
          </View>
        </Modal>
        <Button
          onPress={() => this.setState({ show: true })}
          raised={!full}
          buttonStyle={{
            backgroundColor: '#f0f0f0',
            borderRadius: full ? 0 : 15,
            marginLeft: 0,
          }}
          containerViewStyle={{ marginLeft: 'auto', marginRight: 'auto', width: full && '100%' }}
          color="#0079ff"
          large
          title="Create a New Color Pallet"
        />
      </View>
    )
  }
}

ColorPalletCreator.propTypes = {
  onDone: PropTypes.func,
  createColorPallet: PropTypes.func,
  full: PropTypes.bool,
  base: PropTypes.object,
}

const mapStateToProps = () => ({
})

const mapDispatchToProps = (dispatch) => ({
  createColorPallet: (id, c) => dispatch(actions.createColorPallet(id, c))
})

export default connect(mapStateToProps, mapDispatchToProps)(ColorPalletCreator)
