import React, { Component } from 'react'
import { Text, View, SafeAreaView } from 'react-native'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import actions from '../actions'
import ColorPallet from '../components/ColorPallet'

class Bookmarks extends Component {
  render() {
    const { bookmarks } = this.props
    return (
      <SafeAreaView
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        {(!bookmarks || bookmarks.length <= 0) ?
          <View
            style={{
              width: '50%',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FontAwesome
              style={{
                fontSize: 70,
                color: '#3b4e68',
              }}
            >
              {Icons.road}
            </FontAwesome>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 5,
              }}
            >
              It's lonely here!
            </Text>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 10,
              }}
            >
              Start adding color schemes by clicking on + button
            </Text>
          </View> : undefined}


        {(bookmarks && bookmarks.length > 0) ?
          <KeyboardAwareScrollView
            style={{
              height: '100%',
              width: '100%'
            }}
          >
            {bookmarks.map((cp, i) => (<ColorPallet
              showTitle
              key={i}
              base={cp}
            />)
            )}
          </KeyboardAwareScrollView> : undefined
        }
      </SafeAreaView>
    )
  }
}

Bookmarks.propTypes = {
  bookmarks: PropTypes.array,
}

const mapStateToProps = state => ({ bookmarks: state.bookmarks })

const mapDispatchToProps = dispatch => ({
  bookmarkColorPallet: (palletId) =>
    dispatch(actions.bookmarkColorPallet(palletId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Bookmarks)
