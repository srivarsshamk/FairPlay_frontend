import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function VideoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { chapter } = route.params;
  
  const [paused, setPaused] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const videoRef = useRef(null);

  // Video endpoint URL (adjust base URL as needed)
  const videoUrl = `https://127.0.0.1:8000/images/5c8a31b6-f327-423d-b443-3248063667c3.mp4`;

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <View style={styles.container}>
      {/* Chapter Title */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.chapterTitle} numberOfLines={1}>
          {chapter}
        </Text>
      </View>

      {/* Video Player */}
      <View style={fullscreen ? styles.fullscreenVideo : styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          controls={false}
          paused={paused}
          resizeMode="contain"
          onError={(error) => console.log('Video Error:', error)}
        />

        {/* Custom Video Controls */}
        <View style={styles.controlsOverlay}>
          <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
            <Icon 
              name={paused ? "play-arrow" : "pause"} 
              size={50} 
              color="#ffffff" 
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleFullscreen} style={styles.fullscreenButton}>
            <Icon 
              name={fullscreen ? "fullscreen-exit" : "fullscreen"} 
              size={30} 
              color="#ffffff" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Additional Chapter Information */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>About this Chapter</Text>
        <Text style={styles.descriptionText}>
          Learn about the comprehensive impacts of doping on an athlete's physical and psychological well-being.
        </Text>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#03615b',
  },
  backButton: {
    marginRight: 15,
  },
  chapterTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  videoContainer: {
    height: width * 0.6,
    backgroundColor: '#000000',
    position: 'relative',
  },
  fullscreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#000000',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playPauseButton: {
    position: 'absolute',
    alignSelf: 'center',
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  descriptionContainer: {
    padding: 15,
    backgroundColor: '#D8D2C2',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#03615b',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
  },
});