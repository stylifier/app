import React, { Component } from 'react'
import { View, TouchableOpacity, TextInput, Animated, Easing, Text, Clipboard } from 'react-native'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import actions from '../actions'

class ColorPallet extends Component {
  constructor(props) {
    super(props)

    this.animationDict = []
    this.state = {
      openedIndex: -1,
    }
  }

  renderTitle() {
    return (
      <TextInput
        style={{
          height: 40,
        }}
        placeholder="Your custom title message"
        value={this.props.base.title}
        returnKeyType="done"
        onChangeText={(text) => {
          clearTimeout(this.editTimer)
          this.editTimer = setTimeout(() =>
            this.props.bookmarkColorPallet(this.props.base.id, text)
          , 2000)
        }}
      />
    )
  }

  componentWillMount() {
    this.animationDict[0] = new Animated.Value(100)
    this.animationDict[1] = new Animated.Value(60)
    this.animationDict[2] = new Animated.Value(60)
    this.animationDict[3] = new Animated.Value(60)
  }

  expandOne(k) {
    this.animationDict.forEach((a, i) => {
      Animated.timing(this.animationDict[i], {
        toValue: i === k ? 200 : 60,
        duration: 300,
        easing: Easing.ease,
      }).start()
    })
    this.setState({ openedIndex: k })
  }

  collapsedAll() {
    this.animationDict.forEach((a, i) => {
      Animated.timing(this.animationDict[i], {
        toValue: i === 0 ? 100 : 60,
        duration: 300,
        easing: Easing.ease,
      }).start()
    })
    this.setState({ openedIndex: -1 })
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
            <Animated.View
              style={{
                width: '100%',
                height: this.animationDict[i],
              }}
              key={i}
            >
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: `#${c}`,
                }}
                underlayColor={`#${c}`}
                onPress={() => {
                  if (this.state.openedIndex === i) {
                    this.collapsedAll()
                    return
                  }
                  this.expandOne(i)
                }}
              >
                {(this.state.openedIndex === i) && (<View
                  style={{
                    position: 'absolute',
                    bottom: 7,
                    right: 7,
                    padding: 5,
                    backgroundColor: 'rgba(59, 78, 104, 0.5)',
                    borderRadius: 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {!this.state.showCopied ? <TouchableOpacity
                    style={{flexDirection: "row"}}
                    onPress={() => {
                      Clipboard.setString(`#${c}`)
                      this.setState({showCopied: true})
                      
                      setTimeout(() => {
                        this.setState({showCopied: false})
                      }, 1000)
                    }}
                  >
                    <FontAwesome
                      style={{
                        marginRight: 7,
                        color: '#F5F5F5'
                      }}
                    >
                      {Icons.copy}
                    </FontAwesome>
                    <Text 
                      style={{ 
                        color: '#f5f5f5' 
                      }}
                    >
                      #{c}
                    </Text>
                  </TouchableOpacity> :
                  <Text 
                    style={{ 
                      color: '#f5f5f5' 
                    }}
                  >
                    Copied!
                  </Text>
                }
                </View>)}
              </TouchableOpacity>
            </Animated.View>)
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
          <View
            style={{
              position: 'absolute',
              left: 7,
              top: 7,
              padding: 5,
              backgroundColor: 'rgba(59, 78, 104, 0.5)',
              borderRadius: 3,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#f5f5f5' }} >
              Popularity: {Math.round(this.props.base.popularity * 10) / 10} / 5
            </Text>
          </View>
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
