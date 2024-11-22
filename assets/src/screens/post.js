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

export default function PostsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);

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

  const pickImage = async () => {
    try {
      if (Platform.OS === 'web') {
        fileInputRef.current?.click();
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Sorry, we need camera roll permissions.");
          return;
        }
  
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
  
        if (!result.canceled) {
          await uploadImage(result.assets[0]);
        }
      }
    } catch (err) {
      console.error("Image pick error: " + err.message);
      Alert.alert('Error', 'Could not pick image');
    }
  };
  
  const handleWebImagePick = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        // For web, create a preview URL before uploading
        const previewUrl = URL.createObjectURL(file);
        setImage(previewUrl);
        await uploadImage(file);
      }
    } catch (err) {
      console.error("Web image pick error: " + err.message);
      Alert.alert('Error', 'Could not process image');
    }
  };
  
  const uploadImage = async (imageFile) => {
    try {
      const formData = new FormData();
      
      // For web
      if (imageFile instanceof File) {
        formData.append('file', imageFile);
      } 
      // For mobile
      else {
        const fileExtension = imageFile.uri.split('.').pop();
        formData.append('file', {
          uri: imageFile.uri,
          type: `image/${fileExtension}`,
          name: `image.${fileExtension}`
        });
      }
  
      const response = await axios.post('http://127.0.0.1:8000/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      // Update image URL from server response
      setImage(response.data.image_url);
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert('Error', 'Could not upload image');
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

  const renderPostItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Image 
        source={{ 
          uri: `http://127.0.0.1:8000/images/${item.image_url.split('/').pop()}` 
        }} 
        style={styles.postImage} 
        onError={(e) => console.error('Image load error:', e.nativeEvent.error)}
      />
      <View style={styles.postDetails}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDescription}>{item.description}</Text>
        {item.hashtag && <Text style={styles.postHashtags}>{item.hashtag}</Text>}
      </View>
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

  const renderImagePicker = (isEditMode) => (
    <TouchableOpacity 
      style={styles.imagePicker} 
      onPress={pickImage}
    >
      {Platform.OS === 'web' && (
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleWebImagePick}
          style={{ display: 'none' }}
        />
      )}
      {image ? (
        <View style={styles.imagePreviewContainer}>
          <Image 
            source={{ 
              uri: image.startsWith('http') 
                ? `http://127.0.0.1:8000/images/${image.split('/').pop()}` 
                : image 
            }} 
            style={styles.imagePreview} 
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.removeImageButton} 
            onPress={removeImage}
          >
            <Feather name="x" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.imagePickerPlaceholder}>
          <Feather name="image" size={24} color="#00A86B" />
          <Text style={styles.imagePickerText}>
            {isEditMode ? 'Update Image' : 'Select Image'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
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

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No posts yet. Create one!</Text>
        }
      />

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

            {renderImagePicker(false)}

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

            {renderImagePicker(true)}

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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    margin: 10,
    borderRadius: 10,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
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
  postTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postDescription: {
    color: 'gray',
  },
  postHashtags: {
    color: '#00A86B',
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
  postActions: {
    flexDirection: 'row',
    gap: 10,
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
});