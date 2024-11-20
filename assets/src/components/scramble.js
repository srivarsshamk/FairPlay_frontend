import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';

const App = ({ navigation }) => {
  const [scrambleData, setScrambleData] = useState([
    {
      "scrambled": "NPIOGD",
      "hint": "The use of illegal substances to enhance athletic performance.",
      "answer": "Doping",
      "detail": "Doping refers to the use of banned substances or methods to improve performance in sports, violating fair competition rules."
    },
    {
      "scrambled": "ODLRW TNAI PDGOIN CANYEG",
      "hint": "The global organization responsible for monitoring and enforcing anti-doping rules in sports.",
      "answer": "World Anti Doping Agency",
      "detail": "The World Anti Doping Agency (WADA) was established to coordinate the global effort to fight doping in sports, setting and enforcing the World Anti-Doping Code."
    },
    {
      "scrambled": "NAIT GDPION",
      "hint": "A term used to describe actions or policies aimed at preventing doping in sports.",
      "answer": "Anti doping",
      "detail": "Anti-doping refers to efforts, programs, and measures taken to prevent doping in sports, including education, testing, and sanctions for violations."
    },
    {
      "scrambled": "PREEMFNRAOC NEGHICNAN RDSUG",
      "hint": "Substances that improve athletic performance but are banned by most sports organizations.",
      "answer": "Performance enhancing drugs",
      "detail": "Performance-enhancing drugs (PEDs) include substances like steroids, hormones, and stimulants, used to improve endurance, strength, or other performance attributes in athletes."
    },
    {
      "scrambled": "DSOSIRTE",
      "hint": "Synthetic substances similar to male sex hormones, often abused by athletes to increase muscle mass and performance.",
      "answer": "Steroids",
      "detail": "Anabolic steroids are drugs that mimic testosterone, promoting muscle growth and improving performance, but they are banned due to their harmful health effects."
    },
    {
      "scrambled": "ODLBO GOIPDN",
      "hint": "A method used to improve athletic performance by increasing the number of red blood cells in the body.",
      "answer": "Blood doping",
      "detail": "Blood doping involves increasing red blood cells to enhance oxygen transport and endurance. Techniques like blood transfusions or EPO (erythropoietin) use are examples."
    },
    {
      "scrambled": "YPORNIIHETOERT",
      "hint": "A hormone used by athletes to increase red blood cell production, improving oxygen transport in the blood.",
      "answer": "Erythropoietin",
      "detail": "Erythropoietin (EPO) is naturally produced by the kidneys and stimulates red blood cell production. Athletes sometimes misuse synthetic EPO to enhance endurance."
    },
    {
      "scrambled": "EOSEETRTSNTO",
      "hint": "A hormone that plays a key role in muscle growth and is often abused by athletes.",
      "answer": "Testosterone",
      "detail": "Testosterone is a male hormone involved in muscle mass and strength. It is sometimes used inappropriately in sports to enhance performance."
    },
    {
      "scrambled": "UAMHN GOHWTR MHENOOR",
      "hint": "A hormone that stimulates growth, cell reproduction, and regeneration, sometimes misused by athletes.",
      "answer": "Human Growth Hormone",
      "detail": "Human Growth Hormone (HGH) is used to improve muscle strength and recovery. Misuse is common in certain sports to accelerate healing and build muscle."
    },
    {
      "scrambled": "BODLO STET",
      "hint": "A medical test to check for the presence of banned substances or methods in an athlete's blood.",
      "answer": "Blood test",
      "detail": "Blood tests are commonly used in anti-doping programs to detect substances like EPO or steroids and determine if an athlete has been using banned methods."
    },
    {
      "scrambled": "ENIUR TTES",
      "hint": "A common test to detect banned substances in an athlete's urine.",
      "answer": "Urine test",
      "detail": "Urine tests are widely used in anti-doping programs to check for substances like steroids, stimulants, or other performance enhancers."
    },
    {
      "scrambled": "ITEDOCTEN",
      "hint": "The process of discovering banned substances or methods in an athlete's body.",
      "answer": "Detection",
      "detail": "Detection refers to the scientific methods used to identify doping in athletes, using urine, blood, and other biological samples to detect banned substances."
    },
    {
      "scrambled": "DABNNE TCSEAUSNBS",
      "hint": "Drugs or methods prohibited in sports because they offer unfair advantages or harm an athlete's health.",
      "answer": "Banned substances",
      "detail": "Banned substances include various drugs like steroids, stimulants, and hormones that are prohibited by anti-doping authorities due to their performance-enhancing effects and health risks."
    },
    {
      "scrambled": "MLOCPNICAE",
      "hint": "Adherence to anti-doping regulations and rules.",
      "answer": "Compliance",
      "detail": "Compliance refers to following the rules and guidelines set by anti-doping agencies, including agreeing to drug testing and abiding by the regulations."
    },
    {
      "scrambled": "HETETLA",
      "hint": "A person who competes in sports or physical activities.",
      "answer": "Athlete",
      "detail": "An athlete is someone who engages in competitive sports, and they must follow fair play rules, including anti-doping regulations."
    }
  ]);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [answerStatus, setAnswerStatus] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [score, setScore] = useState(0);
  const [userName, setUserName] = useState('Player');
  const confettiRef = useRef(null);

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUserName(parsedData.first_name || 'Player');
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

  const submitScore = async (finalScore) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        console.error('No user data found');
        return;
      }
  
      const parsedData = JSON.parse(userData);
      const userId = parsedData.id;
  
      console.log('Submitting score:', {
        game_name: 'word_scramble',
        score: finalScore,
        user_id: userId
      });
  
      const response = await axios.post('http://127.0.0.1:8000/game-scores', {
        game_name: 'word_scramble',
        score: finalScore,
        user_id: userId
      });
  
      console.log('Score submission response:', response.data);
      Alert.alert('Score Submitted', `You scored ${finalScore} points!`);
    } catch (error) {
      console.error('Full error details:', error);
      console.error('Error response:', error.response?.data);
      Alert.alert(
        'Score Submission Failed', 
        error.response?.data?.detail || 'Please check your connection and try again.'
      );
    }
  };

  // Check the answer
  const checkAnswer = () => {
    const currentWord = scrambleData[currentWordIndex];
    if (input.trim().toUpperCase() === currentWord.answer.toUpperCase()) {
      const newScore = score + 10; // Award 10 points for correct answer
      setScore(newScore);
      setAnswerStatus({ type: 'correct', message: "Correct! You've got it right!" });
      setShowDetail(true);
      // Trigger confetti
      if (confettiRef.current) {
        confettiRef.current.start();
      }
    } else {
      setAnswerStatus({ type: 'incorrect', message: "Try Again. That's not the correct answer." });
    }
  };

  // Toggle hint visibility
  const toggleHint = () => {
    setShowHint(!showHint);
  };

  // Move to the next word
  const nextWord = () => {
    if (currentWordIndex < scrambleData.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setInput('');
      setShowHint(false);
      setAnswerStatus('');
      setShowDetail(false);
    } else {
      // Game completed - submit final score
      submitScore(score);
      setAnswerStatus({ type: 'completed', message: "Well Done! You've completed all the words!" });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Anti-Doping Word Scramble</Text>
      <Text style={styles.scoreText}>Score: {score}</Text>
      <Text style={styles.scrambledText}>{scrambleData[currentWordIndex].scrambled}</Text>

      {showHint && (
        <Text style={styles.hint}>Hint: {scrambleData[currentWordIndex].hint}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Your answer here"
        value={input}
        onChangeText={setInput}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleHint}>
          <Text style={styles.buttonText}>{showHint ? 'Hide Hint' : 'Show Hint'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={checkAnswer}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={nextWord}>
          <Text style={styles.buttonText}>Next Word</Text>
        </TouchableOpacity>
      </View>

      {answerStatus && (
        <Text style={[
          styles.answerStatus,
          answerStatus.type === 'correct' && styles.correctAnswer,
          answerStatus.type === 'completed' && styles.completed
        ]}>
          {answerStatus.message}
        </Text>
      )}

      {showDetail && (
        <View style={styles.detailContainer}>
          <Text style={styles.detailTitle}>Word Details:</Text>
          <Text style={styles.detailText}>{scrambleData[currentWordIndex].detail}</Text>
        </View>
      )}

      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        fadeOut={true}
        fallSpeed={3000}
        explosionSpeed={350}
        colors={['#ff0', '#ff5', '#0ff', '#5ff', '#f0f']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    marginTop: 40,
  },
  scrambledText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50',
  },
  hint: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    width: '80%',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: 100,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  answerStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  correctAnswer: {
    color: '#4CAF50',
  },
  completed: {
    color: '#4CAF50',
    fontSize: 20,
  },
  detailContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
});

export default App;