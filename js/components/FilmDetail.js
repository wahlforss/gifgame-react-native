import React, { Component } from 'react';
import { Image, StyleSheet,ScrollView } from 'react-native';
import { Container, Header, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Right, Body, Icon } from 'native-base';
import Jonathan from '../../images/jonathan.jpeg'
import Stalker from '../../images/stalker2.jpg'

export default class HomeScreen extends React.Component {
  goBack() {
    this.props.navigation.goBack()
  }
  render() {
    console.log(this.props.navigation);
    const { params } = this.props.navigation.state
    return (
      <View>

        <ScrollView
          style={styles.container}
        >

          <View style={styles.movieContainer}>
            <Image
              source={Stalker}
              style={styles.image}
            />
            <Text
              style={styles.title}
            >
              {params.title}
            </Text>
            <Text
              style={styles.normalText}
            >
              A guide leads two men through an area known as the Zone to find a room that grants wishes.
            </Text>
            <Text style={styles.normalText}>
              2h 42m
            </Text>
            <Text style={styles.normalText}>
              on Netflix
            </Text>
            <Text style={styles.normalText}>
              Director: Andrei Tarkovsky
            </Text>
          </View>
          <View style={styles.directorContainer}>
            <Text
              style={styles.directorTitle}
            >
              Picked By
            </Text>
            <Image
              source={Jonathan}
              style={styles.image}
            />
            <Text style={styles.directorTitle}>{params.chosenDirector}</Text>
            <Text
              style={styles.filmsTitle}
            >
              Director of films

            </Text>
            <Text
              style={styles.films}
            >
              Silence of the Lambs
            </Text>
            <Text
              style={styles.films}
            >
              Philadelphia
            </Text>
            <Text
              style={styles.films}
            >
              The Manchurian Candidate
            </Text>
            <Text
              style={styles.films}
            >
              Rachel Getting Married
            </Text>
          </View>
        </ScrollView>
        <Icon
          ios='ios-arrow-dropleft'
          android="ios-arrow-dropleft"
          style={styles.icon}
          onPress={this.goBack.bind(this)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  movieContainer: {

    backgroundColor: '#7B53F9',
    paddingBottom: 20

  },
  icon: {
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {
    height: 0,
    width: 0
    },
    backgroundColor: 'rgba(0,0,0,0)',
    position:'absolute',
    color: 'white',
    top: 5,
    left: 10,
    fontSize: 50,
  },
  image: {
    resizeMode: 'cover',
    flexGrow: 1,
    height: 200,
    width:null,
    alignItems: 'center',
    justifyContent:'flex-end',
    marginBottom: 20
  },
  directorContainer: {
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: {
    height: 0,
    width: 0
    },
    backgroundColor: '#4726AE',
    paddingTop: 20,
    paddingBottom: 20
  },
  normalText: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 20,
    color: 'white'
  },

  title: {
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
    height: 0,
    width: 0
    },
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 10,
    color: 'white'
  },

  directorTitle: {
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
    height: 0,
    width: 0
    },
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white'
  },
  filmsTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
    color: 'white'
  },
  films: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 5,
    color: 'white'
  }

})
