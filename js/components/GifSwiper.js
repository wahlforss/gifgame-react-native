import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import { Container, Header, DeckSwiper, Card, CardItem, Thumbnail, Left, Right, Body, Icon, Button } from 'native-base';


import Swiper from 'react-native-swiper';
let styles = StyleSheet.create({
  wrapper: {

  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  pagination: {
  },
  gifArrow: {
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {
    height: 0,
    width: 0
    },
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
    fontSize: 50,
  },
})
const leftArrow = (
  <Icon
    ios='ios-arrow-back'
    android="ios-arrow-back"
    style={styles.gifArrow}
  />
)

const rightArrow = (
  <Icon
    ios='ios-arrow-forward'
    android="ios-arrow-forward"
    style={styles.gifArrow}
  />
)


export default class GifSwiper extends Component {
  //onIndexChanged={(index) => this.props.indexChanged(index)}

  logIndex() {
    if(this.swiper) {
      const currentGifSelected = this.swiper.state.index + 1
      this.props.indexChanged(currentGifSelected)
    }
  }
  render() {
    return (
      <Swiper
        style={styles.wrapper}
        showsButtons={true}
        dotColor={'#CACACA'}
        activeDotColor={'white'}
        paginationStyle={styles.pagination}
        nextButton={rightArrow}
        prevButton={leftArrow}
        onMomentumScrollEnd={(state) => this.logIndex()}
        ref={component => this.swiper = component}

      >

        <Image
          key={this.props.gif1}
          style={styles.slide1}
          source={{uri: this.props.gif1}}
        />
        <Image
          key={this.props.gif2}
          style={styles.slide1}
          source={{uri: this.props.gif2}}
        />
        <Image
          key={this.props.gif3}
          style={styles.slide1}
          source={{uri: this.props.gif3}}
          />

      </Swiper>
    )
  }
}
