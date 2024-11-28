import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  Modal,
  FlatList,
  Alert,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { Video } from 'expo-av';

export default function PostsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'

  // Post Creation State
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadUserData();
    fetchPosts();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUserId(parsedData.id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/posts');
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Could not fetch posts');
    }
  };

  const pickMedia = async (type) => {
    try {
      if (Platform.OS === 'web') {
        fileInputRef.current?.click();
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Sorry, we need media library permissions.");
          return;
        }
  
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: type === 'video' ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [16, 9],
          quality: 1,
        });
  
        if (!result.canceled) {
          setMediaType(type);
          await uploadMedia(result.assets[0]);
        }
      }
    } catch (err) {
      console.error("Media pick error: " + err.message);
      Alert.alert('Error', 'Could not pick media');
    }
  };
  
  const handleWebMediaPick = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        setMediaType(type);
        const previewUrl = URL.createObjectURL(file);
        setImage(previewUrl);
        await uploadMedia(file);
      }
    } catch (err) {
      console.error("Web media pick error: " + err.message);
      Alert.alert('Error', 'Could not process media');
    }
  };
  
  const uploadMedia = async (mediaFile) => {
    try {
      const formData = new FormData();
      
      // For web
      if (mediaFile instanceof File) {
        formData.append('file', mediaFile);
      } 
      // For mobile
      else {
        const fileExtension = mediaFile.uri.split('.').pop();
        const type = mediaType === 'video' ? `video/${fileExtension}` : `image/${fileExtension}`;
        formData.append('file', {
          uri: mediaFile.uri,
          type: type,
          name: `media.${fileExtension}`
        });
      }
  
      const response = await axios.post('http://127.0.0.1:8000/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      setImage(response.data.image_url);
    } catch (error) {
      console.error('Media upload error:', error);
      Alert.alert('Error', 'Could not upload media');
    }
  };

  const removeImage = () => {
    setImage(null);
    // If it's a web preview URL, revoke it to free up memory
    if (image && image.startsWith('blob:')) {
      URL.revokeObjectURL(image);
    }
  };

  const createPost = async () => {
    if (!title || !description) {
      Alert.alert('Validation Error', 'Title and description are required');
      return;
    }
  
    try {
      const postData = {
        title,
        description,
        hashtag: hashtags || '',
        user_id: userId,
        image_url: image || null
      };
  
      await axios.post('http://127.0.0.1:8000/posts', postData);
      
      resetPostForm();
      setCreateModalVisible(false);
      fetchPosts();
    } catch (error) {
      console.error('Post creation error:', error.response?.data || error.message);
      Alert.alert(
        'Error', 
        error.response?.data?.detail || 
        'Could not create post. Please check your input and try again.'
      );
    }
  };

  const updatePost = async () => {
    if (!title || !description) {
      Alert.alert('Validation Error', 'Title and description are required');
      return;
    }
  
    try {
      const postData = {
        title,
        description,
        hashtag: hashtags,
        image_url: image || null
      };
  
      await axios.patch(`http://127.0.0.1:8000/posts/${selectedPost.id}`, postData);
      
      resetPostForm();
      setEditModalVisible(false);
      fetchPosts();
    } catch (error) {
      console.error('Post update error:', error.response?.data || error.message);
      Alert.alert(
        'Error', 
        error.response?.data?.detail || 
        'Could not update post. Please check your input and try again.'
      );
    }
  };

  const resetPostForm = () => {
    setTitle('');
    setDescription('');
    setHashtags('');
    setImage(null);
    setSelectedPost(null);
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/posts/${postId}`);
      fetchPosts();
    } catch (error) {
      console.error('Delete post error:', error);
      Alert.alert('Error', 'Could not delete post');
    }
  };

  const prepareEditPost = (post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setDescription(post.description);
    setHashtags(post.hashtag || '');
    setImage(post.image_url);
    setEditModalVisible(true);
  };

  const renderPostItem = ({ item }) => {
    const mediaUrl = `http://127.0.0.1:8000/images/${item.image_url.split('/').pop()}`;
    const isVideo = item.image_url.match(/\.(mp4|mov|avi|wmv)$/i);

    return (
      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>{item.title}</Text>
        
        <View style={styles.mediaContainer}>
          {isVideo ? (
            <Video
              source={{ uri: mediaUrl }}
              style={styles.media}
              useNativeControls
              resizeMode="contain"
              isLooping
            />
          ) : (
            <Image 
              source={{ uri: mediaUrl }} 
              style={styles.media}
              resizeMode="contain"
            />
          )}
        </View>

        <Text style={styles.postDescription}>{item.description}</Text>
        {item.hashtag && <Text style={styles.postHashtags}>{item.hashtag}</Text>}
        
        <View style={styles.postActions}>
          <TouchableOpacity onPress={() => prepareEditPost(item)}>
            <Feather name="edit" size={24} color="#00A86B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deletePost(item.id)}>
            <Feather name="trash-2" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMediaPicker = (isEditMode) => (
    <View style={styles.mediaPickerContainer}>
      {Platform.OS === 'web' && (
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          onChange={handleWebMediaPick}
          style={{ display: 'none' }}
        />
      )}
      
      {image ? (
        <View style={styles.imagePreviewContainer}>
          {mediaType === 'video' ? (
            <Video
              source={{ uri: image }}
              style={styles.imagePreview}
              useNativeControls
              resizeMode="contain"
              isLooping
            />
          ) : (
            <Image 
              source={{ 
                uri: image.startsWith('http') 
                  ? `http://127.0.0.1:8000/images/${image.split('/').pop()}` 
                  : image 
              }} 
              style={styles.imagePreview} 
              resizeMode="cover"
            />
          )}
          <TouchableOpacity 
            style={styles.removeImageButton} 
            onPress={removeImage}
          >
            <Feather name="x" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.mediaButtons}>
          <TouchableOpacity 
            style={styles.mediaButton} 
            onPress={() => pickMedia('image')}
          >
            <Feather name="image" size={24} color="#00A86B" />
            <Text style={styles.mediaButtonText}>Select Image</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.mediaButton} 
            onPress={() => pickMedia('video')}
          >
            <Feather name="video" size={24} color="#00A86B" />
            <Text style={styles.mediaButtonText}>Select Video</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <ImageBackground 
      source={require('../../images/post_bg.png')} 
      style={styles.backgroundImage}
    >
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>About Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Discussion Forum</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Game')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Play</Text>
        </TouchableOpacity>
      </View>

       {/* Posts Container with ScrollView */}
       <ScrollView 
  style={styles.scrollContainer}
  contentContainerStyle={styles.contentContainer}
  showsVerticalScrollIndicator={true}
  persistentScrollbar={true}
  nestedScrollEnabled={true} // Add this for Android
  scrollEnabled={true} // Explicitly enable scrolling
>
  {posts.length === 0 ? (
    <Text style={styles.emptyListText}>No posts yet. Create one!</Text>
  ) : (
    posts.map((item) => {
      const mediaUrl = `http://127.0.0.1:8000/images/${item.image_url.split('/').pop()}`;
      const isVideo = item.image_url.match(/\.(mp4|mov|avi|wmv)$/i);


            return (
              <View key={item.id} style={styles.postContainer}>
                <Text style={styles.postTitle}>{item.title}</Text>
                
                <View style={styles.mediaContainer}>
                  {isVideo ? (
                    <Video
                      source={{ uri: mediaUrl }}
                      style={styles.media}
                      useNativeControls
                      resizeMode="contain"
                      isLooping
                    />
                  ) : (
                    <Image 
                      source={{ uri: mediaUrl }} 
                      style={styles.media}
                      resizeMode="contain"
                    />
                  )}
                </View>

                <Text style={styles.postDescription}>{item.description}</Text>
                {item.hashtag && <Text style={styles.postHashtags}>{item.hashtag}</Text>}
                
                <View style={styles.postActions}>
                  <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => prepareEditPost(item)}
                  >
                    <Feather name="edit-2" size={20} color="#00A86B" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => deletePost(item.id)}
                  >
                    <Feather name="trash-2" size={20} color="#FF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.createPostButton}
        onPress={() => setCreateModalVisible(true)}
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Create Post Modal */}
      <Modal 
        visible={isCreateModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.verticalContainer]}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setCreateModalVisible(false)}
            >
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Create New Post</Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Hashtags"
              value={hashtags}
              onChangeText={setHashtags}
            />

            {renderMediaPicker(false)}

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={createPost}
            >
              <Text style={styles.submitButtonText}>Create Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Post Modal */}
      <Modal 
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.verticalContainer]}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Edit Post</Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Hashtags"
              value={hashtags}
              onChangeText={setHashtags}
            />

            {renderMediaPicker(true)}

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={updatePost}
            >
              <Text style={styles.submitButtonText}>Update Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  mediaContainer: {
    width: '100%',
    height: 250, // Increased height for better visibility
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Changed to 'contain' to fit entire image/video
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
  mediaButton: {
    alignItems: 'center',
    padding: 10,
  },
  mediaButtonText: {
    color: '#00A86B',
    marginTop: 5,
  },
  mediaPickerContainer: {
    width: '100%',
    marginVertical: 10,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 100, // Space for navigation bar
    marginBottom: 20,
    paddingHorizontal: 16,
    ...(Platform.OS === 'web' ? {
      height: 'calc(100vh - 200px)', // Explicit height for web
      overflowY: 'auto', // Changed from 'scroll' to 'auto'
    } : {}),
  },
  contentContainer: {
    paddingBottom: 80, // Space for create post button
    flexGrow: 1, // Ensure content can grow
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  navBar: {
    position: "absolute",
    top: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "80%",
    left: "10%",
    padding: 10,
    backgroundColor: "#03615b",
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1000,
  },
  navButton: {
    padding: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  navButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingTop: 100, // Space for navigation bar
    paddingBottom: 80, // Space for create post button
  },
  postContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  postDetails: {
    flex: 1,
  },
  postDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  postHashtags: {
    fontSize: 14,
    color: '#00A86B',
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  imagePickerPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  imagePickerText: {
    marginLeft: 10,
    color: '#00A86B',
    fontWeight: '500',
  },
  createPostButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#00A86B',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#00A86B',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  multilineInput: {
    height: 100,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#00A86B',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  verticalContainer: {
    flexDirection: 'column',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#00A86B',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  ...(Platform.OS === 'web' && {
    '@global': {
      '::-webkit-scrollbar': {
        width: '10px',
      },
      '::-webkit-scrollbar-track': {
        background: '#F0F0F0',
        borderRadius: '10px',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#00A86B',
        borderRadius: '10px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#03615b',
      }
    }
  })
});