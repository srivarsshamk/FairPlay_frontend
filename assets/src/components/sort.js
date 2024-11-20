import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const substances = [
  { id: 1, name: 'Anabolic Steroids', category: 'Banned' },
  { id: 2, name: 'Caffeine', category: 'Permitted' },
  { id: 3, name: 'Erythropoietin (EPO)', category: 'Banned' },
  { id: 4, name: 'Creatine', category: 'Permitted' },
  { id: 5, name: 'Testosterone', category: 'Banned' },
  { id: 6, name: 'Hydrocortisone', category: 'Requires Medical Exception' },
  { id: 7, name: 'Hydration Tablets', category: 'Permitted' },
  { id: 8, name: 'Human Growth Hormone', category: 'Banned' },
  { id: 9, name: 'Adrenaline', category: 'Permitted' },
  { id: 10, name: 'Cannabis', category: 'Requires Medical Exception' }
];

const ItemTypes = {
  SUBSTANCE: 'substance',
};

const SubstanceDragPreview = ({ substance }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SUBSTANCE,
    item: { id: substance.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <View
      ref={drag}
      style={[
        styles.draggableItem,
        { opacity: isDragging ? 0.5 : 1, backgroundColor: isDragging ? 'lightgray' : 'orange' },
      ]}
    >
      <Text>{substance.name}</Text>
    </View>
  );
};

const SubstanceDropTarget = ({ category, items, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.SUBSTANCE,
    drop: (item) => onDrop(item.id, category),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <View
      ref={drop}
      style={[
        styles.droppableArea,
        { borderColor: isOver ? 'green' : '#ccc', borderWidth: isOver ? 3 : 2 },
      ]}
    >
      <Text style={styles.categoryTitle}>{category}</Text>
      <View style={styles.droppedItems}>
        {items.map((item) => (
          <View key={item.id} style={styles.droppedItem}>
            <Text>{item.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const SubstanceSortGame = () => {
  const navigation = useNavigation();
  const [bannedItems, setBannedItems] = useState([]);
  const [permittedItems, setPermittedItems] = useState([]);
  const [requiresMedicalExceptionItems, setRequiresMedicalExceptionItems] = useState([]);
  const [score, setScore] = useState(0);
  const [availableSubstances, setAvailableSubstances] = useState([...substances]);
  const [userName, setUserName] = useState('Player');

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
        game_name: 'substance_sort',
        score: finalScore,
        user_id: userId
      });

      const response = await axios.post('http://127.0.0.1:8000/game-scores', {
        game_name: 'substance_sort',
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

  const handleDrop = (id, category) => {
    const droppedSubstance = availableSubstances.find((substance) => substance.id === id);

    if (!droppedSubstance) return;

    setAvailableSubstances((prevAvailableSubstances) =>
      prevAvailableSubstances.filter((substance) => substance.id !== id)
    );

    if (category === 'Banned') {
      setBannedItems((prevItems) => [...prevItems, droppedSubstance]);
      setScore((prevScore) => prevScore + (droppedSubstance.category === 'Banned' ? 1 : -1));
    } else if (category === 'Permitted') {
      setPermittedItems((prevItems) => [...prevItems, droppedSubstance]);
      setScore((prevScore) => prevScore + (droppedSubstance.category === 'Permitted' ? 1 : -1));
    } else if (category === 'Requires Medical Exception') {
      setRequiresMedicalExceptionItems((prevItems) => [...prevItems, droppedSubstance]);
      setScore((prevScore) => prevScore + (droppedSubstance.category === 'Requires Medical Exception' ? 1 : -1));
    }

    if (availableSubstances.length === 0) {
      Alert.alert('Game Completed', 'You have successfully sorted all the substances!');
      submitScore(score);
    } {
      Alert.alert('Game Completed', 'You have successfully sorted all the substances!');
      submitScore(score); // Add score submission when game is completed
    }
  };

  const resetGame = () => {
    setBannedItems([]);
    setPermittedItems([]);
    setRequiresMedicalExceptionItems([]);
    setScore(0);
    setAvailableSubstances([...substances]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <View style={styles.container}>
        <View style={[styles.category, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <Text style={[styles.categoryTitle, styles.scoreBox]}>Score: {score}</Text>
          <Text style={[styles.categoryTitle, styles.scoreBox]}>
            {Math.round(
              ((bannedItems.length + permittedItems.length + requiresMedicalExceptionItems.length) /
                substances.length) *
                100
            )}
            % Complete
          </Text>
        </View>
        <Text style={styles.subtitle}>Drag and drop substances into the correct categories:</Text>

        <View style={styles.substanceBox}>
          <Text style={styles.substanceBoxTitle}>Substances to Sort:</Text>
          <View style={styles.substanceList}>
            {availableSubstances.map((substance) => (
              <SubstanceDragPreview key={substance.id} substance={substance} />
            ))}
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          <SubstanceDropTarget category="Banned" items={bannedItems} onDrop={handleDrop} />
          <SubstanceDropTarget category="Permitted" items={permittedItems} onDrop={handleDrop} />
          <SubstanceDropTarget category="Requires Medical Exception" items={requiresMedicalExceptionItems} onDrop={handleDrop} />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={resetGame}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DndProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  substanceBox: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginTop: 10,
  },
  substanceBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  substanceList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  draggableItem: {
    marginHorizontal: 10,
    marginVertical: 10,
    width: 150,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  category: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  scoreBox: {
    fontSize: 16,
    marginBottom: 0,
  },
  droppableArea: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  droppedItems: {
    marginTop: 10,
  },
  droppedItem: {
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  button: {
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SubstanceSortGame;