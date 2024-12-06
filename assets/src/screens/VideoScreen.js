import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Video from 'react-native-video';
import axios from 'axios';

const videoContent = {
  'Physical and Psychological Effects of Doping': {
    filename: 'doping.mp4',
    description: 'Doping can have profound impacts on both physical and mental health. It alters body chemistry, potentially causing long-term damage to organs, hormonal balance, and psychological well-being. Athletes may experience increased aggression, mood swings, and dependency issues.'
  },
  'Types of Performance-Enhancing Drugs and Their Uses': {
    filename: 'drugtypes.mp4',
    description: 'Performance-enhancing drugs include anabolic steroids, stimulants, hormones, and blood doping agents. Each type targets different physiological systems to improve athletic performance, but they come with significant health risks and ethical concerns.'
  },
  'Techniques of Blood Doping and Gene Doping': {
    filename: 'blooddoping.mp4',
    description: 'Blood doping involves increasing oxygen-carrying capacity through artificial means, such as blood transfusions or EPO injections. Gene doping represents a cutting-edge and highly unethical method of genetic manipulation to enhance athletic performance.'
  },
  'Short-Term and Long-Term Health Risks of Doping': {
    filename: 'health.pdf',
    description: 'Doping can lead to immediate health complications like cardiovascular stress, liver damage, and psychological disorders. Long-term risks include chronic diseases, reproductive issues, and potential life-threatening conditions.',
    pdfUrl: 'http://127.0.0.1:8000/images/health.pdf' // Add a direct PDF URL
  },
  'The Social and Psychological Pressure to Use Doping': {
    filename: 'pressuredope.mp4',
    description: 'Athletes face immense pressure from competition, expectations, and the desire for success. This psychological strain can lead to considering doping as a solution, highlighting the importance of mental support and ethical education.'
  },
  //Education and Prevention
    'Education and Prevention Strategies in Anti-Doping': {
    filename: 'Edumodule1.mp4',
    description: 'Education is the cornerstone of anti-doping efforts. Strategies include raising awareness, providing resources, and fostering ethical decision-making to discourage doping and promote clean sports practices.'
  },
  'Educating Athletes, Coaches, and all Stakeholders': {
  filename: 'Edumodule2.mp4',
  description: (
    <Text>
      A collaborative approach is key in anti-doping education. Athletes, coaches, and stakeholders must be educated about banned substances, testing procedures, and the importance of maintaining integrity in sports. For more details, refer to the{' '}
      <Text
        style={{ color: 'blue' }}
        onPress={() => Linking.openURL('https://www.wada-ama.org/sites/default/files/2023-09/2024list_en_final_22_september_2023.pdf')}
      >
        2024 WADA Prohibited List
      </Text>.
    </Text>
  ),
},
  'The Role of Schools and Universities': {
    filename: 'Edumodule3.pdf',
    description: 'Schools and universities play a vital role in anti-doping education by integrating ethical lessons into curriculums, conducting workshops, and shaping young athletes with the values of fairness and integrity.'
  },
  'Comprehensive Guide for Athlete Preparation': {
    filename: 'Edumodule4.pdf',
    description: 'This guide provides athletes with a holistic approach to preparation, emphasizing proper training, nutrition, mental health, and adherence to anti-doping regulations to achieve peak performance ethically.'
  }

};

export default function VideoScreen({ route }) {
  const { chapterTitle, lessonId, moduleId } = route.params;
  const { chapter } = route.params;
  const [paused, setPaused] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  // Fetch video URL when component mounts
  React.useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const content = videoContent[chapter];
        
        // Skip URL fetching for PDFs
        if (content.filename.endsWith('.pdf')) {
          return;
        }

        // Construct the URL for the video
        const response = await axios.get(`http://127.0.0.1:8000/images/${content.filename}`);
        
        // If the response includes an image_url or direct video URL
        const videoSource = response.data.image_url || 
                            `http://127.0.0.1:8000/images/${content.filename}`;
        
        setVideoUrl(videoSource);
      } catch (error) {
        console.error('Video fetch error:', error);
        Alert.alert('Error', 'Could not load video');
      }
    };

    fetchVideoUrl();
  }, [chapter]);

  // Handler to open PDF
  const openPDF = () => {
    const content = videoContent[chapter];
    
    // Prefer pdfUrl if provided, else construct from filename
    const pdfUrl = content.pdfUrl || `http://127.0.0.1:8000/images/${content.filename}`;
    
    Linking.canOpenURL(pdfUrl).then(supported => {
      if (supported) {
        Linking.openURL(pdfUrl);
      } else {
        Alert.alert('Error', 'Unable to open PDF');
      }
    }).catch(err => {
      console.error('Error opening PDF:', err);
      Alert.alert('Error', 'Could not open PDF');
    });
  };

  // Get the description for the current chapter
  const description = videoContent[chapter]?.description || 'No description available.';

  return (
    <ScrollView 
      style={styles.scrollViewContainer}
      contentContainerStyle={styles.scrollViewContent}
    >
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          {/* Check if it's a PDF or video */}
          {videoContent[chapter]?.filename.endsWith('.pdf') ? (
            <TouchableOpacity 
              style={styles.pdfContainer} 
              onPress={openPDF}
            >
              <Text style={styles.pdfNotice}>📄 Open PDF Document</Text>
              <Text style={styles.pdfSubtitle}>Tap to view in default PDF viewer</Text>
            </TouchableOpacity>
          ) : videoUrl ? (
            <Video
              source={{ uri: videoUrl }}
              style={styles.video}
              resizeMode="contain"
              paused={paused}
              onError={(error) => {
                console.log('Video Error:', error);
                Alert.alert('Error', 'Could not play video');
              }}
              controls={true}
            />
          ) : (
            <Text style={styles.loadingText}>Loading video...</Text>
          )}
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.chapterTitle}>{chapter}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#000000',
    paddingVertical: 20,
    minHeight: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    width: '100%',
    height: Dimensions.get('window').width * 0.6, // 16:9 aspect ratio
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  pdfContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pdfNotice: {
    color: '#ffffff',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pdfSubtitle: {
    color: '#cccccc',
    fontSize: 16,
    marginTop: 10,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
  },
  descriptionContainer: {
    padding: 20,
    backgroundColor: '#D8D2C2',
  },
  chapterTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#03615b',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});