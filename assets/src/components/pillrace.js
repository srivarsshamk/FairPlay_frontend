import React, { useState, useRef } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ConfettiCannon from 'react-native-confetti-cannon';
import { ArrowLeft } from 'lucide-react';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const navigation = useNavigation();
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answerStatus, setAnswerStatus] = useState("");
  const [hasAnsweredCorrectly, setHasAnsweredCorrectly] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const confettiRef = useRef(null);
  const [questions] = useState([
    {
        question: "If a substance is available over the counter, it's safe to use.",
        answer: false,
        explanation:
          "Just because a substance is sold over the counter doesn't mean it's safe for athletes. Some over-the-counter products, such as dietary supplements, may contain banned substances that are not listed on the label, posing a risk for accidental doping violations.",
      },
      {
        question: "Caffeine is not banned by anti-doping agencies.",
        answer: true,
        explanation:
          "While caffeine can enhance performance, it is not banned by anti-doping agencies. However, excessive amounts of caffeine (above certain thresholds) may be monitored in some sports, but normal consumption is generally allowed.",
      },
      {
        question: "Athletes are responsible for everything they ingest, even if they don't know a substance contains a banned substance.",
        answer: true,
        explanation:
          "Athletes are responsible for ensuring that everything they consume, including food, drinks, and supplements, complies with anti-doping regulations. The responsibility to avoid ingesting banned substances lies with the athlete, even if they are unaware of the contamination.",
      },
      {
        question: "Natural substances like herbs and supplements are always safe and never considered doping.",
        answer: false,
        explanation:
          "While many natural substances are harmless, some herbs and supplements may contain banned ingredients or be contaminated with banned substances. Athletes must be cautious and verify the contents of any supplement they use, as even natural products can sometimes be prohibited.",
      },
      {
        question: "I can use substances if I have a prescription from a doctor.",
        answer: false,
        explanation:
          "While a doctor's prescription may be necessary for some medications, certain substances are still banned by anti-doping regulations, even if prescribed. Athletes must apply for a Therapeutic Use Exemption (TUE) to use these substances legally in competition.",
      },
      {
        question: "Only professional athletes need to worry about anti-doping rules.",
        answer: false,
        explanation:
          "Anti-doping rules apply to athletes at all levels, not just professionals. This includes amateur athletes, youth athletes, and participants in school or college sports. The principle of fair play applies to all levels of competition.",
      },
      {
        question: "Natural performance enhancement techniques like proper diet and training are just as effective as doping.",
        answer: true,
        explanation:
          "While doping can provide a temporary advantage, training, proper nutrition, and recovery techniques are the most effective and sustainable ways to enhance performance. These methods ensure long-term health and comply with ethical standards in sports.",
      },
      {
        question: "Doping only harms the athlete who uses the substances.",
        answer: false,
        explanation:
          "While doping certainly puts the athlete at risk of health problems (such as cardiovascular issues, hormonal imbalances, and organ damage), it also affects the integrity of the sport. It undermines fair competition, creates an uneven playing field, and can have broader societal impacts, including encouraging younger athletes to dope.",
      },
      {
        question: "Blood doping is a form of cheating that involves increasing the amount of oxygen in the blood to enhance performance.",
        answer: true,
        explanation:
          "Blood doping is a banned practice where an athlete increases the number of red blood cells in the bloodstream to improve oxygen delivery to muscles. This enhances endurance and is considered a form of performance enhancement that is against the rules.",
      },
      {
        question: "The World Anti-Doping Agency (WADA) sets the global standard for anti-doping regulations.",
        answer: true,
        explanation:
          "The World Anti-Doping Agency (WADA) is responsible for establishing the global standards for anti-doping policies and practices. WADA works with national and international sports organizations to ensure consistent regulations worldwide.",
      },
      {
        question: "The anti-doping community only tests athletes during competitions.",
        answer: false,
        explanation:
          "Anti-doping agencies test athletes not just during competitions but also in out-of-competition periods. Athletes can be tested at any time, and anti-doping organizations use random testing and planned tests to ensure compliance throughout the year.",
      },
      {
        question: "Gene doping, which involves altering genes to enhance athletic performance, is illegal in sports.",
        answer: true,
        explanation:
          "Gene doping is a form of genetic manipulation aimed at improving performance and is banned by anti-doping agencies. This type of doping involves altering an athlete's genetic code to enhance physical capabilities, which is considered a serious violation of ethical standards in sports.",
      },
      {
        question: "Some medications may require a Therapeutic Use Exemption (TUE) if they contain banned substances.",
        answer: true,
        explanation:
          "Athletes who need to use medications that contain banned substances due to medical conditions can apply for a Therapeutic Use Exemption (TUE). If granted, they can use the medication legally in competition without facing a doping violation.",
      },
      {
        question: "Performance-enhancing drugs only affect strength, not endurance or recovery.",
        answer: false,
        explanation:
          "Performance-enhancing drugs (PEDs) can improve various aspects of an athlete's performance, including endurance, strength, recovery, and even mental focus. Different substances have different effects, and some improve multiple areas of performance, not just one.",
      },
      {
        question: "Taking a banned substance once doesn’t really matter; I won't get caught.",
        answer: false,
        explanation:
          "Even one instance of using a banned substance can result in serious consequences, such as suspensions, fines, or lifetime bans. Anti-doping organizations conduct rigorous testing, and athletes can be caught even if they use a banned substance just once.",
      },

  ]);

  const [avatarPosition, setAvatarPosition] = useState(-46);
  const MAX_POSITION = 35;
  const MIN_POSITION = -45;
  const MOVEMENT_INCREMENT = 5.2;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAnswer = (selectedAnswer) => {
    if (hasAnsweredCorrectly || isGameOver) return;

    const correctAnswer = questions[questionIndex].answer;

    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
      setAvatarPosition((prevPosition) => Math.min(prevPosition + MOVEMENT_INCREMENT, MAX_POSITION));
      setAnswerStatus("Yes, you are correct!");
      setShowExplanation(true);
      setHasAnsweredCorrectly(true);

      if (confettiRef.current) {
        confettiRef.current.start();
      }
    } else {
      setScore(score - 1);
      setAvatarPosition((prevPosition) => Math.max(prevPosition - MOVEMENT_INCREMENT, MIN_POSITION));
      setAnswerStatus("No, you are wrong!");
      setShowExplanation(false);
    }
  };

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setAnswerStatus("");
      setShowExplanation(false);
      setHasAnsweredCorrectly(false);
    } else {
      setIsGameOver(true);
    }
  };

  const replayGame = () => {
    setScore(0);
    setQuestionIndex(0);
    setAnswerStatus("");
    setShowExplanation(false);
    setHasAnsweredCorrectly(false);
    setIsGameOver(false);
    setAvatarPosition(-46);
  };

  const totalScore = questions.length;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Journey to the Podium</Text>
        <Text style={styles.score}>Score: {score}/{totalScore}</Text>
      </View>

      <Canvas style={{ flex: 1 }} camera={{ position: [0, 5, 30], fov: 75, near: 0.1, far: 1000 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} />
        <OrbitControls enableZoom={false} enableRotate={false} />

        {/* Podium (Goal) */}
        <mesh position={[35, 3, 0]}>
          <boxGeometry args={[10, 1, 10]} />
          <meshStandardMaterial color="gold" />
        </mesh>

        {/* Player (Avatar) - Ball */}
        <mesh position={[avatarPosition, 4, 0]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </Canvas>

      <View style={styles.questionContainer}>
        {!isGameOver ? (
          <>
            <Text style={styles.question}>{questions[questionIndex].question}</Text>

            <View style={styles.buttonGroup}>
              <View style={styles.button}>
                <Button title="True" onPress={() => handleAnswer(true)} disabled={hasAnsweredCorrectly} />
              </View>
              <View style={styles.button}>
                <Button title="False" onPress={() => handleAnswer(false)} disabled={hasAnsweredCorrectly} />
              </View>
              {showExplanation && (
                <View style={styles.button}>
                  <Button title="Next" onPress={nextQuestion} />
                </View>
              )}
            </View>

            {answerStatus && (
              <Text style={styles.answerStatus}>{answerStatus}</Text>
            )}

            {showExplanation && (
              <Text style={styles.explanation}>{questions[questionIndex].explanation}</Text>
            )}
          </>
        ) : (
          <View style={styles.gameOverContainer}>
            <Text style={styles.congratsText}>Awesome! You've successfully completed the game.</Text>
            <Text style={styles.finalScore}>Your final score is: {score}/{totalScore}</Text>
            {score === totalScore ? (
              <Text style={styles.finalMessage}>Bravo! You nailed it with a perfect score!</Text>
            ) : (
              <Text style={styles.finalMessage}>Almost there! Replay the game to score higher and move the ball to the podium.</Text>
            )}
            <Button title="Replay" onPress={replayGame} />
          </View>
        )}
      </View>

      <ConfettiCannon ref={confettiRef} count={100} origin={{ x: 0, y: 0 }} autoStart={false} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "#282c34",
    alignItems: "center",
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: '50%',
    transform: [{translateY: -12}],
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    color: "white",
  },
  score: {
    fontSize: 18,
    color: "white",
  },
  questionContainer: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
    borderRadius: 10,
  },
  question: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  explanation: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
    fontStyle: "italic",
  },
  answerStatus: {
    color: "yellow",
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
  },
  gameOverContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  congratsText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  finalScore: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  finalMessage: {
    fontSize: 15,
    color: "yellow",
    fontWeight: "bold",
    marginBottom: 20,
  },
});