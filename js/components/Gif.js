import React, { Component } from 'react';
import { Image, StyleSheet, StatusBar, TouchableHighlight } from 'react-native';
import { Container, Header, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Right, Body, Icon } from 'native-base';
import Dimensions from 'Dimensions';

height = Dimensions.get('window').height
width = Dimensions.get('window').width

export default class Gif extends Component {
  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <Image
          style={styles.gif}
          source={{uri: this.props.gif}}
        />
      </TouchableHighlight>
    )
  }
}

//source={require('../../images/gif.gif')}
const styles = StyleSheet.create({
  gif: {
    flex: 1,
    width: width,
    alignSelf: 'flex-start'

  }
})
