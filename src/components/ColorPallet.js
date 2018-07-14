import React, {Component} from 'react';
import {Text, View, Image, TouchableOpacity, Overlay} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { connect } from 'react-redux'
import actions from '../actions'

class ColorPallet extends Component {
  render() {
    const bookmarked =
      this.props.bookmarks.filter(p => p.code === this.props.base.code).length > 0
    return (
      <View style={{
        width: '100%',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        overflow: 'hidden',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 10,
        marginTop: 10,
        width: '95%',
        borderWidth: 2,
        borderColor: '#3b4e68',
      }}>
        {this.props.base.code.match(/.{1,6}/g).map((c, i) => {
          return (<View
            style={{
              width: '100%',
              height: i === 0 ? 100 : 60,
              backgroundColor: '#' + c
            }}
            key={i}>
          </View>)
        })}
        <TouchableOpacity
          style={{position: 'absolute', top: 7, right: 7, width: 35, height: 35, backgroundColor:  'rgba(59, 78, 104, 0.5)', borderRadius: 3,alignItems:'center',
          justifyContent:'center'}}
          onPress = {() => bookmarked ? this.props.deleteBookmarkedColorPallet(this.props.base.id):
          this.props.bookmarkColorPallet(this.props.base.id)}
          >
          <FontAwesome style={{fontSize: 24, color: bookmarked ? '#66bfc7' : '#f5f5f5' }}>{Icons.bookmark}</FontAwesome>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return { bookmarks: state.bookmarks }
}

const mapDispatchToProps = dispatch => ({
  bookmarkColorPallet: (palletId) =>
    dispatch(actions.bookmarkColorPallet(palletId)),
  deleteBookmarkedColorPallet: (palletId) =>
    dispatch(actions.deleteBookmarkedColorPallet(palletId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ColorPallet);
