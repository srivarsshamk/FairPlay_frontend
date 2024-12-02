import React, { useState, useEffect } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { StyleSheet } from 'react-native';

const Figure = () => {
  const [countryAnimations, setCountryAnimations] = useState({});
  const [percentageAnimations, setPercentageAnimations] = useState({});

  const data = [
    { country: 'India', samples: 3865, violations: 3.2 },
    { country: 'South Africa', samples: 2033, violations: 2.9 },
    { country: 'Kazakhstan', samples: 2174, violations: 1.9 },
    { country: 'Mexico', samples: 2252, violations: 1.4 },
    { country: 'US', samples: 6782, violations: 1.2 },
    { country: 'Canada', samples: 3846, violations: 1.1 },
    { country: 'Russia', samples: 10186, violations: 0.8 },
    { country: 'Germany', samples: 13653, violations: 0.3 },
    { country: 'Japan', samples: 5706, violations: 0.2 },
    { country: 'China', samples: 19228, violations: 0.2 },
  ].sort((a, b) => b.violations - a.violations); // Sort by violations

  useEffect(() => {
    const animations = {};
    const percentAnimations = {};
    
    data.forEach((item, index) => {
      animations[item.country] = new Animated.Value(0);
      percentAnimations[item.country] = new Animated.Value(0);
    });

    setCountryAnimations(animations);
    setPercentageAnimations(percentAnimations);
  }, []);

  useEffect(() => {
    if (Object.keys(countryAnimations).length > 0) {
      const animations = data.map((item, index) => 
        Animated.parallel([
          Animated.timing(countryAnimations[item.country], {
            toValue: 1,
            duration: 1000 + index * 200,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: true,
          }),
          Animated.timing(percentageAnimations[item.country], {
            toValue: 1,
            duration: 1500 + index * 250,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false,
          })
        ])
      );

      Animated.stagger(100, animations).start();
    }
  }, [countryAnimations, percentageAnimations]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doping Violations Across Countries</Text>
      <View style={styles.table}>
        {data.map((item, index) => {
          const translateX = countryAnimations[item.country]?.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, 0],
          });

          const scalePercentage = percentageAnimations[item.country]?.interpolate({
            inputRange: [0, 1],
            outputRange: [0, item.violations],
          });

          return (
            <Animated.View 
              key={item.country} 
              style={[styles.row, { transform: [{ translateX: translateX || 0 }], opacity: countryAnimations[item.country] || 0 }]}
            >
              <Text style={styles.countryText}>{item.country}</Text>
              <Text style={styles.samplesText}>{item.samples.toLocaleString()} Samples</Text>
              <Animated.Text 
                style={[styles.violationsText, { color: getViolationColor(item.violations) }]}
              >
                {scalePercentage ? scalePercentage.interpolate({
                  inputRange: [0, item.violations],
                  outputRange: ['0%', `${item.violations}%`]
                }) : '0%'}
              </Animated.Text>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

// Helper function to get color based on violation percentage
const getViolationColor = (percentage) => {
  if (percentage > 2) return 'red';
  if (percentage > 1) return 'orange';
  return 'green';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b1b', // Dark background
    paddingTop: 50,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#00ff00', // Green text
  },
  table: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#333', // Dark row background
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  countryText: {
    flex: 2,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // White text for country names
  },
  samplesText: {
    flex: 2,
    fontSize: 14,
    color: '#b0b0b0', // Light gray text
    textAlign: 'center',
  },
  violationsText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default Figure;
