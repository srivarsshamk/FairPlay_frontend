import React, { useState, useEffect, useCallback } from 'react';
import { Pill } from 'lucide-react';

function App() {
  const [score, setScore] = useState(0);
  const [choices, setChoices] = useState([]);
  const [currentChoice, setCurrentChoice] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [choicesMade, setChoicesMade] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  // Sample substances - you can expand this list
  const substances = {
    allowed: [
      "Vitamin C",
      "Protein Powder",
      "Electrolytes",
      "Creatine",
      "BCAAs",
      "Caffeine",
      "Zinc",
      "Magnesium"
    ],
    banned: [
      "Steroids",
      "EPO",
      "Growth Hormone",
      "Stimulants",
      "Beta-2 Agonists",
      "Diuretics",
      "Narcotics",
      "Cannabis"
    ]
  };

  const generateChoices = useCallback(() => {
    const isLeftAllowed = Math.random() > 0.5;
    const allowedSubstance = substances.allowed[Math.floor(Math.random() * substances.allowed.length)];
    const bannedSubstance = substances.banned[Math.floor(Math.random() * substances.banned.length)];
    
    return {
      left: isLeftAllowed ? allowedSubstance : bannedSubstance,
      right: isLeftAllowed ? bannedSubstance : allowedSubstance,
      correctSide: isLeftAllowed ? 'left' : 'right'
    };
  }, []);

  useEffect(() => {
    if (choicesMade < 20 && !gameOver) {
      setCurrentChoice(generateChoices());
    } else if (choicesMade >= 20) {
      setGameOver(true);
    }
  }, [choicesMade, gameOver, generateChoices]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const selected = e.key === 'ArrowLeft' ? 'left' : 'right';
        setSelectedOption(selected);
        
        if (selected === currentChoice.correctSide) {
          setScore(prev => prev + 1);
        } else {
          setScore(prev => Math.max(0, prev - 1));
        }
        
        setTimeout(() => {
          setSelectedOption(null);
          setChoicesMade(prev => prev + 1);
        }, 1000);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentChoice, gameOver]);

  const getOptionColor = (side) => {
    if (selectedOption === side) {
      return side === currentChoice?.correctSide 
        ? 'rgb(34, 197, 94)' // green
        : 'rgb(239, 68, 68)'; // red
    }
    return 'rgb(219, 234, 254)'; // light blue
  };

  const styles = {
    container: {
      width: '100%',
      maxWidth: '800px',
      margin: '20px auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    gameArea: {
      position: 'relative',
      height: '300px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#fff',
      overflow: 'hidden',
    },
    scoreBoard: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    choicesContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '100%',
      padding: '0 40px',
    },
    option: {
      width: '150px',
      padding: '15px',
      borderRadius: '8px',
      textAlign: 'center',
      transition: 'background-color 0.3s ease',
      fontWeight: 'bold',
    },
    pill: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
    instructions: {
      textAlign: 'center',
      marginTop: '20px',
      color: '#666',
    },
    gameOver: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      zIndex: 1000,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
          Anti-Doping Awareness Game
        </h1>
        <div style={styles.scoreBoard}>Score: {score}</div>
        <div>Choices made: {choicesMade}/20</div>
      </div>

      <div style={styles.gameArea}>
        <div style={styles.choicesContainer}>
          <div 
            style={{
              ...styles.option,
              backgroundColor: getOptionColor('left'),
            }}
          >
            {currentChoice?.left}
          </div>

          <div style={styles.pill}>
            <Pill size={48} color="#3b82f6" />
          </div>

          <div 
            style={{
              ...styles.option,
              backgroundColor: getOptionColor('right'),
            }}
          >
            {currentChoice?.right}
          </div>
        </div>
      </div>

      <div style={styles.instructions}>
        Use ← and → arrow keys to make choices
      </div>

      {gameOver && (
        <div style={styles.gameOver}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Game Over!</h2>
          <p style={{ fontSize: '20px', marginBottom: '10px' }}>Final Score: {score}</p>
          <p>Great job learning about anti-doping!</p>
        </div>
      )}
    </div>
  );
}

export default App;