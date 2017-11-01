import React, { Component } from 'react';
import { Image, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'native-base';
import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');

export default class TinderImage extends Component {


  render() {
    return (
      <TouchableWithoutFeedback
        onPress={this.props.onPress}
        style={styles.container}>
        <Image
          style={styles.image}
          source={this.props.image}
        >
          <Icon ios='md-information-circle' android="md-information-circle" style={styles.icon}/>
          <View style={styles.textBlock}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.lovedByDirector}>Picked by director </Text>
            <Text style={styles.text}>{this.props.chosenDirector} ({this.props.chosenDirectorMovie})</Text>

          </View>

        </Image>

      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'cover',
    flexGrow:1,
    height: height - 60,
    width: null,
    alignItems: 'center',
    justifyContent:'flex-end',
  },
  textBlock: {
    width: width-50,


  },
  icon: {
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {
    height: 0,
    width: 0
    },
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
    position: 'absolute',
    top: 10,
    right: 0,
    fontSize: 40,
    marginRight: 10,
  },
  title: {
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {
    height: 0,
    width: 0
    },
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 50,
    marginBottom: 5,
  },
  lovedByDirector: {
    fontWeight: 'normal',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 35,
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {
    height: 0,
    width: 0
    },
    marginBottom: 5,
  },
  text: {
    fontWeight: 'normal',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0)',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {
    height: 0,
    width: 0
    },
    fontSize: 20,
    marginBottom: 40,
  }
})
