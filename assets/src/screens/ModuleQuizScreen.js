import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function ModuleQuizScreen() {
  const route = useRoute();
  const { module } = route.params;
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleSubmitQuiz = () => {
    if (selectedAnswer === 'A') {
      Alert.alert('Correct', 'You answered correctly!');
    } else if (!selectedAnswer) {
      Alert.alert('Error', 'Please select an answer before submitting.');
    } else {
      Alert.alert('Incorrect', 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.moduleTitle}>Module Quiz: {module?.title || 'General'}</Text>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>What is the main purpose of anti-doping efforts?</Text>

        <TouchableOpacity
          style={[styles.optionButton, selectedAnswer === 'A' && styles.selectedOption]}
          onPress={() => setSelectedAnswer('A')}
        >
          <Text style={styles.optionText}>A. To make competitions fair</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, selectedAnswer === 'B' && styles.selectedOption]}
          onPress={() => setSelectedAnswer('B')}
        >
          <Text style={styles.optionText}>B. To enhance athletic performance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, selectedAnswer === 'C' && styles.selectedOption]}
          onPress={() => setSelectedAnswer('C')}
        >
          <Text style={styles.optionText}>C. To reduce injuries</Text>
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
      // backgroundColor: '#f7f7f7',
      backgroundColor:'#000000',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    moduleTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#03615b',
      marginBottom: 20,
      textAlign: 'center',
    },
    questionContainer: {
      width: '100%',
      backgroundColor: '#ffffff',
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
      backgroundColor: '#03615b',
      padding: 12,
      marginBottom: 10,
      borderRadius: 5,
    },
    selectedOption: {
      backgroundColor: '#4CAF50',
    },
    optionText: {
      color: '#ffffff',
      fontSize: 16,
    },
    submitButton: {
      backgroundColor: '#FF5722',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 5,
      marginTop: 20,
    },
    submitButtonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    quizButton: {
      backgroundColor: '#e8f5e9', 
      padding: 12,
      borderRadius: 5,
      marginBottom: 10,
    },
    quizButtonText: {
      color: '#03615b',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    moduleQuizButton: {
      backgroundColor: '#03615b',
      padding: 15,
      borderRadius: 10,
      marginTop: 20,
      width: '100%',
      alignItems: 'center',
    },
    moduleQuizButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  