import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-native'
import RNFS from 'react-native-fs'

class ProfileImage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.downloadImage(props.source)
  }

  downloadImage(source) {
    const dp = RNFS.DocumentDirectoryPath
    const fileExtention = /png|jpg|jpeg/.exec(source)
    const fileName = /\/([a-z]|[0-9])\w+(\/|\.(png|jpg|jpeg))/.exec(source)

    if (!fileName || !fileExtention) {
      return
    }

    this.state = {
      imageName:
        `${dp}/PROFILE_${fileName[0].replace(RegExp('/', 'g'), '').replace(/\.png|jpg|jpeg/g, '')}.${fileExtention[0]}`,
      imageLoading: true,
      source
    }

    const { imageName } = this.state

    RNFS.exists(source)
      .then((exists) => {
        if (exists) return true
        return RNFS.downloadFile({ fromUrl: source, toFile: imageName }).promise
      })
      .then(() => this.setState({ imageLoading: false }))
      .catch(() => {})
  }

  componentDidUpdate(prev) {
    const { source } = this.props

    if (source !== prev.source) {
      this.downloadFile(source)
    }
  }

  render() {
    const { imageName } = this.state

    return (
      <Image
        style={{ width: 100, height: 100, borderRadius: 50 }}
        source={{ uri: `file://${imageName}` }}
      />
    )
  }
}

ProfileImage.propTypes = {
  source: PropTypes.string,
}

export default ProfileImage
