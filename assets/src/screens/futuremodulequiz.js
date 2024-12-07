import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function futuremodulequiz() {
  const route = useRoute();
  const navigation = useNavigation();
  const { module, moduleId } = route.params;
  const [previousQuizScore, setPreviousQuizScore] = useState(0);

  const quizQuestions = [
    {
      question: "What is a major advantage of using advanced technology in doping detection?",
      options: [
        { id: 'A', text: "It makes testing faster and more accurate", isCorrect: true },
        { id: 'B', text: "It reduces testing costs significantly", isCorrect: false },
        { id: 'C', text: "It eliminates the need for random testing", isCorrect: false },
        { id: 'D', text: "It discourages athletes from competing", isCorrect: false },
      ],
      correctAnswer: 'A',
    },
    {
      question: "How does AI enhance anti-doping research?",
      options: [
        { id: 'A', text: "By automating testing procedures", isCorrect: false },
        { id: 'B', text: "By predicting trends in doping practices", isCorrect: true },
        { id: 'C', text: "By replacing human inspectors", isCorrect: false },
        { id: 'D', text: "By developing new performance-enhancing drugs", isCorrect: false },
      ],
      correctAnswer: 'B',
    },
    {
      question: "What is a key emerging trend in doping practices?",
      options: [
        { id: 'A', text: "Using only traditional anabolic steroids", isCorrect: false },
        { id: 'B', text: "Gene and cell doping", isCorrect: true },
        { id: 'C', text: "Increased transparency in drug use", isCorrect: false },
        { id: 'D', text: "Avoiding prohibited lists altogether", isCorrect: false },
      ],
      correctAnswer: 'B',
    },
    {
      question: "Which factor is essential for global collaboration in anti-doping efforts?",
      options: [
        { id: 'A', text: "Developing consistent regulations across countries", isCorrect: true },
        { id: 'B', text: "Allowing each nation to set its own rules", isCorrect: false },
        { id: 'C', text: "Ignoring smaller nations' perspectives", isCorrect: false },
        { id: 'D', text: "Focusing only on elite athletes", isCorrect: false },
      ],
      correctAnswer: 'A',
    },
    {
      question: "What role can athletes play in promoting a drug-free sporting culture?",
      options: [
        { id: 'A', text: "By advocating for ethical sports practices", isCorrect: true },
        { id: 'B', text: "By avoiding random testing", isCorrect: false },
        { id: 'C', text: "By minimizing public engagement", isCorrect: false },
        { id: 'D', text: "By endorsing performance-enhancing substances", isCorrect: false },
      ],
      correctAnswer: 'A',
    },
    {
      question: "Which technology has been effective in detecting micro-dosing practices?",
      options: [
        { id: 'A', text: "Isotope Ratio Mass Spectrometry (IRMS)", isCorrect: true },
        { id: 'B', text: "Traditional urine analysis", isCorrect: false },
        { id: 'C', text: "Thermal scanning", isCorrect: false },
        { id: 'D', text: "Digital X-rays", isCorrect: false },
      ],
      correctAnswer: 'A',
    },
    {
      question: "How does big data contribute to anti-doping research?",
      options: [
        { id: 'A', text: "By replacing physical drug tests", isCorrect: false },
        { id: 'B', text: "By analyzing patterns to identify risks", isCorrect: true },
        { id: 'C', text: "By reducing the need for human intervention", isCorrect: false },
        { id: 'D', text: "By providing anonymity to athletes", isCorrect: false },
      ],
      correctAnswer: 'B',
    },
    {
      question: "What is the biggest challenge in regulating doping globally?",
      options: [
        { id: 'A', text: "Diverse legal frameworks in different nations", isCorrect: true },
        { id: 'B', text: "Lack of scientific research", isCorrect: false },
        { id: 'C', text: "Shortage of testing facilities", isCorrect: false },
        { id: 'D', text: "Resistance from athletes", isCorrect: false },
      ],
      correctAnswer: 'A',
    },
    {
      question: "What is the primary goal of anti-doping education programs?",
      options: [
        { id: 'A', text: "To punish athletes", isCorrect: false },
        { id: 'B', text: "To create awareness and prevent violations", isCorrect: true },
        { id: 'C', text: "To reduce competition", isCorrect: false },
        { id: 'D', text: "To delay drug tests", isCorrect: false },
      ],
      correctAnswer: 'B',
    },
    {
      question: "Why are international competitions critical for anti-doping research?",
      options: [
        { id: 'A', text: "They provide a large dataset for analysis", isCorrect: true },
        { id: 'B', text: "They discourage athletes from cheating", isCorrect: false },
        { id: 'C', text: "They reduce the need for national regulations", isCorrect: false },
        { id: 'D', text: "They allow for unlimited drug testing", isCorrect: false },
      ],
      correctAnswer: 'A',
    },
    {
      question: "What is the role of the Athlete Biological Passport (ABP)?",
      options: [
        { id: 'A', text: "To store athletes' training data", isCorrect: false },
        { id: 'B', text: "To track changes in biomarkers over time", isCorrect: true },
        { id: 'C', text: "To register for competitions", isCorrect: false },
        { id: 'D', text: "To monitor athletes' diets", isCorrect: false },
      ],
      correctAnswer: 'B',
    },
    {
      question: "What is a major reason for increasing transparency in anti-doping efforts?",
      options: [
        { id: 'A', text: "To boost public trust in clean sports", isCorrect: true },
        { id: 'B', text: "To encourage more doping violations", isCorrect: false },
        { id: 'C', text: "To reduce athlete participation", isCorrect: false },
        { id: 'D', text: "To make testing optional", isCorrect: false },
      ],
      correctAnswer: 'A',
    },
    {
      question: "What is the focus of collaboration among nations in anti-doping?",
      options: [
        { id: 'A', text: "Sharing testing protocols and research data", isCorrect: true },
        { id: 'B', text: "Eliminating smaller sports competitions", isCorrect: false },
        { id: 'C', text: "Reducing athlete mobility", isCorrect: false },
        { id: 'D', text: "Increasing individual penalties", isCorrect: false },
      ],
      correctAnswer: 'A',
    },
    {
      question: "How does education help athletes avoid unintentional doping violations?",
      options: [
        { id: 'A', text: "By simplifying competition rules", isCorrect: false },
        { id: 'B', text: "By informing them about prohibited substances", isCorrect: true },
        { id: 'C', text: "By discouraging competition", isCorrect: false },
        { id: 'D', text: "By reducing test frequency", isCorrect: false },
      ],
      correctAnswer: 'B',
    },
    {
      question: "What is one goal of emerging doping detection methods?",
      options: [
        { id: 'A', text: "To completely eliminate testing costs", isCorrect: false },
        { id: 'B', text: "To detect doping substances at lower concentrations", isCorrect: true },
        { id: 'C', text: "To make testing voluntary", isCorrect: false },
        { id: 'D', text: "To reduce transparency", isCorrect: false },
      ],
      correctAnswer: 'B',
    },
    {
      question: "What is one responsibility athletes have in ensuring fair play?",
      options: [
        { id: 'A', text: "To comply with anti-doping regulations", isCorrect: true },
        { id: 'B', text: "To ignore random testing procedures", isCorrect: false },
        { id: 'C', text: "To refuse medical checks", isCorrect: false },
        { id: 'D', text: "To endorse prohibited substances", isCorrect: false },
      ],
      correctAnswer: 'A',
    },
    {
      question: "What is one major challenge of using AI in anti-doping research?",
      options: [
        { id: 'A', text: "The lack of accurate data for training models", isCorrect: true },
        { id: 'B', text: "AI systems being too fast for implementation", isCorrect: false },
        { id: 'C', text: "AI requiring manual testing support", isCorrect: false },
        { id: 'D', text: "AI completely replacing human intervention", isCorrect: false },
      ],
      correctAnswer: 'A',
    },
    {
      question: "What is the primary focus of genetic testing in anti-doping efforts?",
      options: [
        { id: 'A', text: "To identify inherited athletic abilities", isCorrect: false },
        { id: 'B', text: "To detect genetic doping modifications", isCorrect: true },
        { id: 'C', text: "To determine eligibility for competitions", isCorrect: false },
        { id: 'D', text: "To develop tailored training programs", isCorrect: false },
      ],
      correctAnswer: 'B',
    },
    {
      question: "How does international cooperation improve doping control measures?",
      options: [
        { id: 'A', text: "By sharing best practices and pooling resources", isCorrect: true },
        { id: 'B', text: "By eliminating the need for local testing", isCorrect: false },
        { id: 'C', text: "By limiting testing to larger nations", isCorrect: false },
        { id: 'D', text: "By reducing the number of tests globally", isCorrect: false },
      ],
      correctAnswer: 'A',
    },
    {
      question: "What is one benefit of athletes advocating against doping?",
      options: [
        { id: 'A', text: "It helps foster a culture of clean sportsmanship", isCorrect: true },
        { id: 'B', text: "It reduces the need for anti-doping organizations", isCorrect: false },
        { id: 'C', text: "It allows athletes to avoid random testing", isCorrect: false },
        { id: 'D', text: "It discourages participation in international events", isCorrect: false },
      ],
      correctAnswer: 'A',
    }    
];


  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchPreviousQuizScore();
  }, [moduleId]);

  const fetchPreviousQuizScore = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/module-quizzes/${moduleId}`);
      setPreviousQuizScore(response.data.m_quizscore);
    } catch (error) {
      console.error('Error fetching previous quiz score:', error);
    }
  };

  const calculateScore = () => {
    const newScore = selectedAnswers.reduce((total, answer, index) => {
      return answer !== null && quizQuestions[index].options[answer].isCorrect 
        ? total + 1 
        : total;
    }, 0);
    setScore(newScore);
    setShowResults(true);
    postQuizScore(newScore);
  };

  const postQuizScore = async (finalScore) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/module-quizzes/${moduleId}/score`, {
        score: finalScore
      });
    } catch (error) {
      console.error('Error posting quiz score:', error);
    }
  };

  const handleAnswerSelection = (optionIndex) => {
    if (showResults) return;

    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const moveToNextQuestion = () => {
    // Check if an answer is selected
    if (selectedAnswers[currentQuestion] === null) {
      Alert.alert('Please select an answer');
      return;
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };


  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quizQuestions.length).fill(null));
    setShowResults(false);
    setScore(0);
  };

  const getOptionStyle = (optionIndex) => {
    // If results are not shown, use standard selection logic
    if (!showResults) {
      return selectedAnswers[currentQuestion] === optionIndex 
        ? styles.selectedOption 
        : styles.optionButton;
    }
    
    // When showing results
    const currentQuestionData = quizQuestions[currentQuestion];
    const correctOptionIndex = currentQuestionData.options.findIndex(option => option.isCorrect);
    
    // Always highlight the correct answer in green
    if (correctOptionIndex === optionIndex) {
      return styles.correctOption;
    }
    
    // If a wrong answer was selected, highlight it in red
    if (selectedAnswers[currentQuestion] === optionIndex && 
        !currentQuestionData.options[optionIndex].isCorrect) {
      return styles.incorrectOption;
    }
    
    // Default style for other options
    return styles.optionButton;
  };

  const getOptionTextStyle = (optionIndex) => {
    if (!showResults) {
      return styles.optionText;
    }

    const currentQuestionData = quizQuestions[currentQuestion];
    const correctOptionIndex = currentQuestionData.options.findIndex(option => option.isCorrect);
    
    // Green text for correct answer
    if (correctOptionIndex === optionIndex) {
      return [styles.optionText, { color: 'white' }];
    }
    
    // Red text for incorrect selected answer
    if (selectedAnswers[currentQuestion] === optionIndex && 
        !currentQuestionData.options[optionIndex].isCorrect) {
      return [styles.optionText, { color: 'white' }];
    }

    return styles.optionText;
  };

  if (showResults) {
    return (
      <View style={styles.container}>
        <Text style={styles.moduleTitle}>Quiz Results</Text>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Your Score: {score} out of {quizQuestions.length}
          </Text>
          <Text style={styles.previousScoreText}>
            Previous Best Score: {previousQuizScore}
          </Text>
          <TouchableOpacity 
            style={styles.restartButton}
            onPress={() => {
              setCurrentQuestion(0);
              setSelectedAnswers(new Array(quizQuestions.length).fill(null));
              setShowResults(false);
              setScore(0);
            }}
          >
            <Text style={styles.submitButtonText}>Restart Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.submitButtonText}>Back to Module</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.moduleTitle}>
        {module?.title || 'Doping Awareness Quiz'}
      </Text>
      
      <View style={styles.questionContainer}>
        <Text style={styles.questionCounter}>
          Question {currentQuestion + 1} of {quizQuestions.length}
        </Text>
        
        <Text style={styles.question}>
          {quizQuestions[currentQuestion].question}
        </Text>

        {quizQuestions[currentQuestion].options.map((option, optionIndex) => (
          <TouchableOpacity
            key={optionIndex}
            style={[
              getOptionStyle(optionIndex),
              showResults && {
                borderWidth: 2,
                borderColor: 
                  optionIndex === quizQuestions[currentQuestion].options.findIndex(opt => opt.isCorrect)
                    ? 'green' 
                    : selectedAnswers[currentQuestion] === optionIndex 
                    ? 'red' 
                    : 'transparent'
              }
            ]}
            onPress={() => handleAnswerSelection(optionIndex)}
          >
            <Text style={getOptionTextStyle(optionIndex)}>{option.text}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[
            styles.submitButton, 
            selectedAnswers[currentQuestion] === null ? styles.disabledSubmitButton : {}
          ]}
          onPress={moveToNextQuestion}
          disabled={selectedAnswers[currentQuestion] === null}
        >
          <Text style={styles.submitButtonText}>
            {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000000',
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
  questionCounter: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'right',
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
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  correctOption: {
    backgroundColor: '#4CAF50', // Green for correct answer
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  incorrectOption: {
    backgroundColor: '#FF5252', // Red for incorrect answer
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  optionText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  disabledSubmitButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#03615b',
  },
  restartButton: {
    backgroundColor: '#03615b',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  backButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '100%',
  },
});