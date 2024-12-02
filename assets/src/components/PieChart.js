import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import Reanimated, { useAnimatedProps, useSharedValue, withSpring, withDelay } from 'react-native-reanimated';

const AnimatedPath = Reanimated.createAnimatedComponent(Path);

const RADIUS = 100;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PieChart = () => {
  const data = [
    { country: 'India', value: 3.2, color: '#FF6B6B' },
    { country: 'South Africa', value: 2.9, color: '#4ECDC4' },
    { country: 'Kazakhstan', value: 1.9, color: '#45B7D1' },
    { country: 'Mexico', value: 1.4, color: '#96CEB4' },
    { country: 'US', value: 1.2, color: '#FFEEAD' },
    { country: 'Canada', value: 1.1, color: '#D4A5A5' },
    { country: 'Russia', value: 0.8, color: '#9B6B6B' },
    { country: 'Germany', value: 0.3, color: '#FCE694' },
    { country: 'Japan', value: 0.2, color: '#87CEEB' },
    { country: 'China', value: 0.2, color: '#FF9999' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const animatedValues = data.map(() => useSharedValue(0));

  const highest = data.reduce((a, b) => (a.value > b.value ? a : b), data[0]);
  const lowest = data.reduce((a, b) => (a.value < b.value ? a : b), data[0]);

  useEffect(() => {
    data.forEach((_, index) => {
      animatedValues[index].value = withDelay(index * 200, withSpring(1, { damping: 12, stiffness: 100 }));
    });
  }, []);

  const getCoordinates = (angle) => {
    const x = RADIUS * Math.cos(angle - Math.PI / 2);
    const y = RADIUS * Math.sin(angle - Math.PI / 2);
    return { x, y };
  };

  const createPieSlice = (startAngle, endAngle, color, index) => {
    const animatedProps = useAnimatedProps(() => {
      const scale = animatedValues[index].value;
      const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

      const start = getCoordinates(startAngle);
      const end = getCoordinates(endAngle);

      return {
        d: `
          M 150 150
          L ${150 + start.x * scale} ${150 + start.y * scale}
          A ${RADIUS * scale} ${RADIUS * scale} 0 ${largeArcFlag} 1 
          ${150 + end.x * scale} ${150 + end.y * scale}
          Z
        `,
      };
    });

    return (
      <AnimatedPath
        key={index}
        animatedProps={animatedProps}
        fill={color}
        stroke="white"
        strokeWidth={2}
      />
    );
  };

  const renderChart = () => {
    let currentAngle = 0;
    const slices = [];

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * (2 * Math.PI);
      const endAngle = currentAngle + sliceAngle;

      slices.push(createPieSlice(currentAngle, endAngle, item.color, index));
      currentAngle = endAngle;
    });

    return slices;
  };

  const renderLegend = () => {
    return data.map((item, index) => (
      <View
        key={index}
        style={styles.legendItem}
      >
        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
        <Text
          style={[
            styles.legendText,
            item.country === highest.country || item.country === lowest.country
              ? { color: 'yellow' }
              : null,
          ]}
        >
          {item.country} ({item.value}%)
        </Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Svg height="300" width="300">
        <G>{renderChart()}</G>
      </Svg>
      <View style={styles.results}>
        <Text style={styles.title}>Results</Text>
        <View style={styles.legend}>{renderLegend()}</View>
        <Text style={styles.highlight}>
          Highest: {highest.country} ({highest.value}%)
        </Text>
        <Text style={styles.highlight}>
          Lowest: {lowest.country} ({lowest.value}%)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  results: {
    marginLeft: 20,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  legend: {
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: 'white',
  },
  highlight: {
    color: 'yellow',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PieChart;
