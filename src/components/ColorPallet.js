import React, { Component } from 'react'
import { View, TouchableOpacity, TextInput } from 'react-native'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import actions from '../actions'

class ColorPallet extends Component {
  renderTitle() {
    return (
      <TextInput
        style={{
          height: 40,
        }}
        placeholder="Your custom title message"
        value={this.props.base.title}
        onChangeText={(text) => {
          clearTimeout(this.editTimer)
          this.editTimer = setTimeout(() =>
            this.props.bookmarkColorPallet(this.props.base.id, text)
          , 2000)
        }}
      />
    )
  }

  render() {
    const bookmarked =
      this.props.bookmarks.filter(p => p.code === this.props.base.code).length > 0
    return (
      <View
        style={{
          flex: 1,
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 10,
          marginTop: 10,
          width: '95%',
        }}
      >
        {this.props.showTitle && this.renderTitle()}
        <View
          style={{
            width: '100%',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#3b4e68',
          }}
        >
          {this.props.base.code.match(/.{1,6}/g).map((c, i) => (
            <View
              style={{
                width: '100%',
                height: i === 0 ? 100 : 60,
                backgroundColor: `#${c}`,
              }}
              key={i}
            />)
          )}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 7,
              right: 7,
              width: 35,
              height: 35,
              backgroundColor: 'rgba(59, 78, 104, 0.5)',
              borderRadius: 3,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              if (bookmarked) {
                return this.props.deleteBookmarkedColorPallet(this.props.base.id)
              }
              return this.props.bookmarkColorPallet(this.props.base.id)
            }}
          >
            <FontAwesome
              style={{
                fontSize: 24,
                color: bookmarked ? '#66bfc7' : '#f5f5f5',
              }}
            >
              {Icons.bookmark}
            </FontAwesome>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

ColorPallet.propTypes = {
  bookmarkColorPallet: PropTypes.func,
  deleteBookmarkedColorPallet: PropTypes.func,
  base: PropTypes.object,
  bookmarks: PropTypes.array,
  showTitle: PropTypes.bool,
}

const mapStateToProps = state => ({ bookmarks: state.bookmarks })

const mapDispatchToProps = dispatch => ({
  bookmarkColorPallet: (palletId, title) =>
    dispatch(actions.bookmarkColorPallet(palletId, title)),
  deleteBookmarkedColorPallet: (palletId) =>
    dispatch(actions.deleteBookmarkedColorPallet(palletId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ColorPallet)
