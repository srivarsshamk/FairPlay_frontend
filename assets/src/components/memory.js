import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, SafeAreaView, Dimensions } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useNavigation } from '@react-navigation/native';

// Get device dimensions
const { width, height } = Dimensions.get('window');

// Images (Use the images from your local assets folder)
const images = [
  require('../../images/image1.png'),
  require('../../images/image2.png'),
  require('../../images/image3.png'),
  require('../../images/image4.png'),
  require('../../images/image5.png'),
  require('../../images/image6.png'),
  require('../../images/image7.png'),
  require('../../images/image8.png'),
];

const shuffleArray = (array) => {
  let shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const App = () => {
  const navigation = useNavigation();
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');

  const quotes = [
    "True champions compete on their own merits, not on substances.",
    "The greatest victory is achieved with honesty, not chemicals.",
    "Doping might make you faster today, but it destroys the true legacy of sport tomorrow.",
    "Real strength comes from within, not from a needle or a pill.",
    "Fair play is the only way to truly measure greatness.",
    "Drugs don't build champions; dedication, discipline, and determination do.",
    "Victory earned through doping is not a victory at all – it's a defeat of the soul.",
    "Integrity is the true test of an athlete's character.",
    "Winning clean is the only way to win with pride.",
    "Your legacy is built on your actions, not on substances.",
  ];

  useEffect(() => {
    const shuffledCards = shuffleArray([...images, ...images].map((img, index) => ({ id: index, image: img, flipped: false, matched: false })));
    setCards(shuffledCards);
  }, []);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const updatedCards = [...cards];
      if (updatedCards[firstIndex].image === updatedCards[secondIndex].image) {
        updatedCards[firstIndex].matched = true;
        updatedCards[secondIndex].matched = true;
        setMatchedPairs((prev) => prev + 1);
        showNextQuote();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1000);
      } else {
        setTimeout(() => {
          updatedCards[firstIndex].flipped = false;
          updatedCards[secondIndex].flipped = false;
          setCards(updatedCards);
        }, 1000);
      }
      setCards(updatedCards);
      setFlippedIndices([]);
    }
  }, [flippedIndices]);

  const handleCardPress = (index) => {
    if (cards[index].flipped || cards[index].matched) return;

    const updatedCards = [...cards];
    updatedCards[index].flipped = true;
    setCards(updatedCards);

    setFlippedIndices((prev) => [...prev, index]);
  };

  const showNextQuote = () => {
    const remainingQuotes = quotes.filter((_, index) => index >= matchedPairs);
    if (remainingQuotes.length > 0) {
      setCurrentQuote(remainingQuotes[0]);
    }
  };

  const restartGame = () => {
    const shuffledCards = shuffleArray([...images, ...images].map((img, index) => ({ id: index, image: img, flipped: false, matched: false })));
    setCards(shuffledCards);
    setMatchedPairs(0);
    setShowConfetti(false);
    setCurrentQuote('');
  };

  useEffect(() => {
    if (matchedPairs === images.length) {
      setTimeout(() => {
        Alert.alert('Congratulations!', 'You have matched all the pairs!');
      }, 1000);
    }
  }, [matchedPairs]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.title}>Anti Doping Memory Match</Text>
      </View>
      <View style={styles.content}>
        {showConfetti && <ConfettiCannon count={150} origin={{ x: width / 2, y: height / 3 }} />}
        {currentQuote && (
          <Text style={styles.quote}>
            {`Do you know?\n${currentQuote}`}
          </Text>
        )}
        <View style={styles.grid}>
          {cards.map((card, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(index)} style={styles.card}>
              <View style={[styles.cardInner, card.flipped || card.matched ? styles.flipped : null]}>
                <Image source={card.flipped || card.matched ? card.image : require('../../images/hidden.png')} style={styles.cardImage} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <Button mode="contained" onPress={restartGame} style={styles.button}>
          Restart Game
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#90EE90', // Light green background color
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  title: {
    flex: 1,
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quote: {
    fontSize: 18,
    color: '#006400',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 360,
    justifyContent: 'center',
    marginBottom: 20,
  },
  card: {
    width: 80,
    height: 80,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    elevation: 5,
  },
  cardInner: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
  },
  flipped: {
    backgroundColor: '#fff',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#6200EE',
    width: 200,
  },
});

export default App;