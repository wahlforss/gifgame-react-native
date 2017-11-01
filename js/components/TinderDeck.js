import React, { Component } from 'react';
import { Image, StyleSheet, StatusBar } from 'react-native';
import TinderImage from './TinderImage.js'
import { Container, Header, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Right, Body, Icon } from 'native-base';
import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');

const cards = [
  {
    title: 'Toni Erdmann',
    chosenDirector: 'Jonathan Demme',
    chosenDirectorMovie: 'Silence Of The Lambs',
    image: require('../../images/toni.jpg'),
  },
  {
    title: 'Seventh Zeal',
    chosenDirector: 'Martin Scorsese',
    chosenDirectorMovie: 'Taxi Driver',
    image: require('../../images/seventh.jpg'),
  },
  {
    title: 'Stalker',
    chosenDirector: 'Stanley Kubrick',
    chosenDirectorMovie: 'The Shining',
    image: require('../../images/stalker.jpg'),
  },

];

export default class TinderDeck extends Component {
  onClickCard(film) {
    this.props.navigation.navigate('FilmDetail', film)
  }



  render() {
    return (
      <Container style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Director's Pick
          </Text>
        </View>
        <StatusBar
          backgroundColor="blue"
          barStyle="light-content"
          hidden={true}
        />
        <View>
          <View>
            <DeckSwiper
              dataSource={cards}
              renderItem={item =>
                <Card
                  style={styles.card}>
                  <CardItem cardBody>
                    <TinderImage
                      onPress={this.onClickCard.bind(this, item)}
                      image={item.image}
                      title={item.title}
                      chosenDirector={item.chosenDirector}
                      chosenDirectorMovie={item.chosenDirectorMovie}
                    />
                  </CardItem>
                </Card>
              }
            />
          </View>
          </View>

      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  header: {
    height: 30,
    marginTop: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 30,

    justifyContent: 'center',
    textAlign: 'center',
    color: '#7B53F9',
    fontWeight: '700'
  },
  card: {
    backgroundColor: 'green',
    width: width - 10,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 10
  },
  textRow: {
    flex: 1,
    height:70

  },
  textBlockStyle: {
    fontSize: 12
  },
  leftText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightText: {
    flex: 1,
    alignItems: 'flex-end',
  }
})
