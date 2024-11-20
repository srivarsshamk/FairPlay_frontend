import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { ArrowLeft } from 'lucide-react';

// Quiz questions database
const questions = [
  {
    id: 1,
    question: "Which of these substances is NOT banned in competitive sports?",
    options: [
      "Acetaminophen (Tylenol)",
      "Anabolic steroids",
      "EPO (Erythropoietin)",
      "Amphetamines"
    ],
    correct: 0
  },
  {
    id: 2,
    question: "What is a major health risk of anabolic steroid use?",
    options: [
      "Increased flexibility",
      "Liver damage",
      "Improved vision",
      "Better sleep"
    ],
    correct: 1
  },
  {
    id: 3,
    question: "How long before competition should athletes stop using medications to ensure they're clean?",
    options: [
      "24 hours",
      "1 week",
      "Depends on the substance",
      "12 hours"
    ],
    correct: 2
  },
  {
    id: 4,
    question: "What is 'strict liability' in anti-doping?",
    options: [
      "Athletes are not responsible for what they consume",
      "Only coaches are responsible",
      "Athletes are fully responsible for any substance in their body",
      "Responsibility lies with medical staff"
    ],
    correct: 2
  },
  {
    id: 5,
    question: "Which organization maintains the prohibited substances list?",
    options: [
      "FIFA",
      "WADA",
      "IOC",
      "UEFA"
    ],
    correct: 1
  },
  {
    id: 6,
    question: "What is the main purpose of the biological passport?",
    options: [
      "Track travel history",
      "Monitor athlete identity",
      "Track biological markers over time",
      "Record competition results"
    ],
    correct: 2
  },
  {
    id: 7,
    question: "When can doping controls be conducted?",
    options: [
      "Only during competition",
      "Only during training",
      "Only during off-season",
      "Any time, any place"
    ],
    correct: 3
  },
  {
    id: 8,
    question: "What is NOT a consequence of doping?",
    options: [
      "Ban from competition",
      "Improved long-term health",
      "Loss of medals",
      "Damage to reputation"
    ],
    correct: 1
  },
  {
    id: 9,
    question: "Which is a sign of potential doping?",
    options: [
      "Regular training",
      "Sudden performance improvements",
      "Good nutrition",
      "Proper rest"
    ],
    correct: 1
  },
  {
    id: 10,
    question: "What should athletes check before taking supplements?",
    options: [
      "Only the price",
      "Only the brand",
      "Third-party testing certification",
      "Only the flavor"
    ],
    correct: 2
  },
  {
    id: 11,
    question: "What is a TUE in sports?",
    options: [
      "Training Under Evaluation",
      "Therapeutic Use Exemption",
      "Team Unity Exercise",
      "Technical Understanding Exam"
    ],
    correct: 1
  },
  {
    id: 12,
    question: "How long are most doping bans?",
    options: [
      "6 months",
      "1 year",
      "2-4 years",
      "Lifetime"
    ],
    correct: 2
  },
  {
    id: 13,
    question: "What is NOT a valid reason for missing a drug test?",
    options: [
      "Hospitalization",
      "Being tired",
      "Family emergency",
      "Natural disaster"
    ],
    correct: 1
  },
  {
    id: 14,
    question: "Who can request a B sample analysis?",
    options: [
      "Only coaches",
      "Only medical staff",
      "The athlete",
      "Only WADA"
    ],
    correct: 2
  },
  {
    id: 15,
    question: "What is 'whereabouts' information?",
    options: [
      "Competition schedule",
      "Training location",
      "Daily location for testing purposes",
      "Travel history"
    ],
    correct: 2
  },
  {
    id: 16,
    question: "Which is NOT a type of anti-doping rule violation?",
    options: [
      "Refusing a test",
      "Missing three tests",
      "Taking approved medication",
      "Tampering with samples"
    ],
    correct: 2
  },
  {
    id: 17,
    question: "What should athletes do if prescribed medication?",
    options: [
      "Take it without checking",
      "Check if it's prohibited",
      "Refuse all medication",
      "Only take half dose"
    ],
    correct: 1
  },
  {
    id: 18,
    question: "What is the 'prohibited list'?",
    options: [
      "Banned athletes list",
      "Banned substances and methods",
      "Banned competitions",
      "Banned countries"
    ],
    correct: 1
  },
  {
    id: 19,
    question: "When does a substance get banned?",
    options: [
      "When it enhances performance",
      "When it's expensive",
      "Meets specific criteria including health risks",
      "When one country bans it"
    ],
    correct: 2
  },
  {
    id: 20,
    question: "What is NOT required for a doping control?",
    options: [
      "Identification",
      "Credit card",
      "Signing forms",
      "Providing sample"
    ],
    correct: 1
  }
];

// Educational facts for each question
const facts = [
  "Over 300 substances are currently banned by WADA. The list is updated annually to include new performance-enhancing drugs.",
  "Anabolic steroids can cause severe liver damage, cardiovascular problems, and psychological issues including depression and aggression.",
  "Different substances have different clearance times. Some banned substances can be detected months after use.",
  "The 'strict liability' principle means athletes are responsible even if they accidentally consume banned substances.",
  "WADA (World Anti-Doping Agency) updates the prohibited list at least annually after extensive scientific review.",
  "The biological passport tracks changes in blood variables over time to detect doping without direct detection of substances.",
  "Athletes must provide their whereabouts for one hour each day for potential testing, even during vacations.",
  "Long-term health effects of doping can persist even after an athlete stops using banned substances.",
  "Some athletes have shown up to 40% performance improvements in short periods, raising doping suspicions.",
  "About 40-50% of athletic supplements may contain substances not listed on the label.",
  "TUEs require extensive medical documentation and must be approved before using prohibited medications.",
  "The standard 4-year ban was implemented to ensure athletes miss at least one Olympic cycle.",
  "Three missed tests within 12 months counts as an anti-doping violation.",
  "B samples are stored in secure conditions and can be tested years after collection.",
  "Athletes must update their whereabouts if plans change, using WADA's ADAMS system.",
  "Athletes can be banned for association with banned coaches or training partners.",
  "Many common medications contain banned substances. Always check with a sports physician.",
  "The prohibited list is divided into substances banned at all times and those banned in-competition only.",
  "A substance must meet 2 of 3 criteria to be banned: performance enhancement, health risk, or spirit of sport violation.",
  "Sample collection officers must directly observe the sample provision to prevent tampering."
];

const TIME_PER_QUESTION = 30; // 30 seconds per question

const Quiz = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [showFact, setShowFact] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !selectedAnswer) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !selectedAnswer) {
      handleTimeout();
    }
    return () => clearInterval(timer);
  }, [timeLeft, selectedAnswer]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTimeout = () => {
    setSelectedAnswer(-1); // -1 indicates timeout
    setShowNext(true);
    setShowFact(true);
  };

  const handleAnswer = (selectedIndex) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(selectedIndex);
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setShowNext(true);
    setShowFact(true);
  };

  const handleNext = () => {
    setShowFact(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowNext(false);
      setTimeLeft(TIME_PER_QUESTION);
    } else {
      setIsGameOver(true);
    }
  };

  const getOptionStyle = (index) => {
    if (selectedAnswer === null) return styles.option;
    
    if (index === questions[currentQuestion].correct) {
      return [styles.option, styles.correctAnswer];
    }
    
    if (index === selectedAnswer && selectedAnswer !== questions[currentQuestion].correct) {
      return [styles.option, styles.wrongAnswer];
    }
    
    return styles.option;
  };

  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (isGameOver) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>Quiz Complete!</Text>
          <Text style={styles.gameOverScore}>Final Score: {score}/{questions.length}</Text>
          <TouchableOpacity 
            style={styles.restartButton}
            onPress={() => {
              setCurrentQuestion(0);
              setScore(0);
              setSelectedAnswer(null);
              setShowNext(false);
              setTimeLeft(TIME_PER_QUESTION);
              setShowFact(false);
              setIsGameOver(false);
            }}
          >
            <Text style={styles.restartButtonText}>Restart Quiz</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBack}
      >
        <ArrowLeft size={24} color="#ffffff" />
      </TouchableOpacity>

      <View style={[styles.header, { marginTop: 20 }]}>
        <Text style={styles.scoreText}>Score: {score}/{questions.length}</Text>
        <Text style={[
          styles.timer,
          timeLeft <= 10 && styles.timerWarning
        ]}>
          {formatTime(timeLeft)}
        </Text>
        <Text style={styles.questionNumber}>Q{currentQuestion + 1}/{questions.length}</Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>{questions[currentQuestion].question}</Text>

        <View style={styles.optionsContainer}>
          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getOptionStyle(index)}
              onPress={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          visible={showFact}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.factModalContainer}>
            <View style={styles.factModal}>
              <Text style={styles.factTitle}>Did you know?</Text>
              <Text style={styles.factText}>{facts[currentQuestion]}</Text>
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                  {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginLeft: 50, // Add margin to prevent overlap with back button
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timer: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerWarning: {
    color: '#ff4444',
  },
  questionNumber: {
    color: '#ffffff',
    fontSize: 16,
  },
  questionContainer: {
    flex: 1,
  },
  question: {
    color: '#ffffff',
    fontSize: 22,
    marginBottom: 30,
    lineHeight: 30,
  },
  optionsContainer: {
    gap: 15,
  },
  option: {
    backgroundColor: '#2c2c2c',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3c3c3c',
  },
  correctAnswer: {
    backgroundColor: '#1b5e20',
    borderColor: '#2e7d32',
  },
  wrongAnswer: {
    backgroundColor: '#b71c1c',
    borderColor: '#c62828',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 16,
  },
  factModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  factModal: {
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  factTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  factText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
    padding: 8,
  },
  nextButton: {
    backgroundColor: '#1976d2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gameOverScore: {
    color: '#ffffff',
    fontSize: 24,
    marginBottom: 30,
  },
  restartButton: {
    backgroundColor: '#1976d2',
    padding: 15,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  restartButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Quiz;