import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import { CheckCircle, Award, Star, Medal, Trophy, Flag, Shield } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
const AntiDopingTimeline = () => {
  const {t}=useTranslation();
  const timelineEvents = [
    {
      year: t('timelineEvents1.year'),
      title:  t('timelineEvents1.title'),
      description: t('timelineEvents1.description'),
      achievements: [t('timelineEvents1.achievements1'), t('timelineEvents1.achievements2')],
      icon: Flag

    },
    {
      year: t('timelineEvents2.year'),
      title:  t('timelineEvents2.title'),
      description: t('timelineEvents2.description'),
      achievements: [t('timelineEvents2.achievements1'), t('timelineEvents2.achievements2')],
      icon: Award,
    },
    {
      year: t('timelineEvents3.year'),
      title:  t('timelineEvents3.title'),
      description: t('timelineEvents3.description'),
      achievements: [t('timelineEvents3.achievements1'), t('timelineEvents3.achievements2'), t('timelineEvents3.achievements3')],
      icon: CheckCircle,
    },
    {
      year: t('timelineEvents4.year'),
      title:  t('timelineEvents4.title'),
      description: t('timelineEvents4.description'),
      achievements: [t('timelineEvents4.achievements1'), t('timelineEvents4.achievements2'), t('timelineEvents4.achievements3')],
      icon: Shield,
    },
    {
      year: t('timelineEvents5.year'),
      title:  t('timelineEvents5.title'),
      description: t('timelineEvents5.description'),
      achievements: [t('timelineEvents5.achievements1'), t('timelineEvents5.achievements2')],
      icon: Star,
    },
    {
      year: t('timelineEvents6.year'),
      title:  t('timelineEvents6.title'),
      description: t('timelineEvents6.description'),
      achievements: [t('timelineEvents6.achievements1'), t('timelineEvents6.achievements2'), t('timelineEvents6.achievements3')],
      icon: Trophy,
    },
    {
      year: t('timelineEvents7.year'),
      title:  t('timelineEvents7.title'),
      description: t('timelineEvents7.description'),
      achievements: [t('timelineEvents7.achievements1'), t('timelineEvents7.achievements2'), t('timelineEvents7.achievements3')],
      icon: Medal,
    }
  ];

  const fadeAnims = useRef(timelineEvents.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Sequence the animations with a delay between each event
    const animateSequence = fadeAnims.map((anim, index) => {
      return Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 200, // Stagger the animations
        useNativeDriver: true,
      });
    });

    // Start the animation sequence only on mount (not on re-renders)
    Animated.sequence(animateSequence).start();
  }, []); // Empty dependency array to run only on mount

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>{t('timelineEvents.title')}</Text>
        
        <View style={styles.timeline}>
          {timelineEvents.map((event, index) => {
            const IconComponent = event.icon;
            return (
              <Animated.View 
                key={index} 
                style={[ 
                  styles.eventContainer, 
                  { opacity: fadeAnims[index] }, 
                  { transform: [{ 
                    translateY: fadeAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0]
                    })
                  }] }
                ]}>
                {/* Vertical line */}
                <View style={styles.verticalLine} />
                
                {/* Timeline dot with icon */}
                <View style={styles.timelineDot}>
                  <IconComponent 
                    width={24} 
                    height={24} 
                    color="#1B4D3E"
                    style={styles.icon}
                  />
                </View>
                
                {/* Event content */}
                <View style={[ 
                  styles.eventContent, 
                  index % 2 === 0 ? styles.eventLeft : styles.eventRight
                ]}>
                  <Text style={styles.year}>{event.year}</Text>
                  <Text style={styles.title}>{event.title}</Text>
                  <Text style={styles.description}>{event.description}</Text>
                  <View style={styles.achievementsList}>
                    {event.achievements.map((achievement, achIndex) => (
                      <View key={achIndex} style={styles.achievementItem}>
                        <View style={styles.achievementDot} />
                        <Text style={styles.achievementText}>{achievement}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'black',
    borderRadius: 10,
    minHeight: '100%',
  },
  mainTitle: {
    fontSize: 36,
    fontFamily: 'System',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 40,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 45, 4, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  timeline: {
    position: 'relative',
    paddingTop: 20,
  },
  verticalLine: {
    position: 'absolute',
    left: '50%',
    width: 2,
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  eventContainer: {
    marginBottom: 40,
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -16 }],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#26732C',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    elevation: 5,
  },
  icon: {
    backgroundColor: 'transparent',
  },
  eventContent: {
    width: '45%',
    backgroundColor: 'black',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#26732C',
    shadowColor: '#26732C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  eventLeft: {
    marginRight: 'auto',
  },
  eventRight: {
    marginLeft: 'auto',
  },
  year: {
    fontSize: 24,
    fontFamily: 'System',
    fontWeight: '800',
    color: '#26732C',
    marginBottom: 8,
    letterSpacing: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'System',
    fontWeight: '700',
    marginBottom: 8,
    color: '#fff',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    fontFamily: 'System',
    color: '#e0e0e0',
    marginBottom: 12,
    lineHeight: 24,
  },
  achievementsList: {
    marginTop: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#26732C',
    marginRight: 10,
  },
  achievementText: {
    fontSize: 14,
    fontFamily: 'System',
    color: '#fff',
    lineHeight: 20,
  },
});

export default AntiDopingTimeline;
