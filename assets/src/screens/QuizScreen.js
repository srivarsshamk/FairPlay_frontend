import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function QuizScreen() {
  const route = useRoute();
  const { chapter } = route.params;
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleSubmitQuiz = () => {
    // Dummy answer checking logic, can be replaced with actual quiz logic
    if (selectedAnswer === 'A') {
      Alert.alert('Correct', 'You answered correctly!');
    } else {
      Alert.alert('Incorrect', 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chapterTitle}>Quiz for: {chapter}</Text>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>What is the consequence of doping?</Text>

        <TouchableOpacity
          style={[styles.optionButton, selectedAnswer === 'A' && styles.selectedOption]}
          onPress={() => setSelectedAnswer('A')}
        >
          <Text style={styles.optionText}>A. Banned from competition</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, selectedAnswer === 'B' && styles.selectedOption]}
          onPress={() => setSelectedAnswer('B')}
        >
          <Text style={styles.optionText}>B. Increased performance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, selectedAnswer === 'C' && styles.selectedOption]}
          onPress={() => setSelectedAnswer('C')}
        >
          <Text style={styles.optionText}>C. No effect</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitQuiz}
        >
          <Text style={styles.submitButtonText}>Submit Quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    // backgroundColor: '#f7f7f7',
    backgroundColor:'#000000',
  },
  chapterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03615b',
    marginBottom: 20,
  },
  questionContainer: {
    width: '100%',
    // backgroundColor: '#ffffff',
    backgroundColor:'#D8D2C2',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    color: '#03615b',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#03615b',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
