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
  Alert,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Video } from 'expo-av';

export default function PostsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [postComments, setPostComments] = useState({});

  // Post Creation State
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [commentText, setCommentText] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadUserData();
    fetchPosts();
  }, []);

  const fetchUserFirstName = async (userId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/users/${userId}`);
      return response.data.first_name;
    } catch (error) {
      console.error(`Error fetching user for ID ${userId}:`, error);
      return 'Anonymous User';
    }
  };


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
      const postsData = response.data.data;
      setPosts(postsData);

      // Fetch usernames for all posts concurrently
      const usernamePromises = postsData.map(async (post) => {
        const firstName = await fetchUserFirstName(post.user_id);
        return { [post.user_id]: firstName };
      });

      const usernameResults = await Promise.all(usernamePromises);
      const usernamesMap = usernameResults.reduce((acc, curr) => ({...acc, ...curr}), {});
      setUsernames(usernamesMap);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Could not fetch posts');
    }
  };

  const fetchPostComments = async (postId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/comments/post/${postId}`);
      setPostComments(prev => ({
        ...prev,
        [postId]: response.data.data
      }));
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
    }
  };

  const addComment = async (postId) => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'Comment cannot be empty');
      return;
    }
  
    try {
      const commentData = {
        like_count: 0,
        comment: commentText,
        user_id: userId,
        post_id: postId
      };
  
      await axios.post('http://127.0.0.1:8000/comments', commentData);
      
      // Refresh comments for this post
      await fetchPostComments(postId);
      
      setCommentText('');
    } catch (error) {
      console.error('Comment addition error:', error);
      Alert.alert('Error', 'Could not add comment');
    }
  };

  const toggleLike = async (postId, isLiked) => {
    try {
      const likeEndpoint = isLiked 
        ? `http://127.0.0.1:8000/posts/${postId}/unlike`
        : `http://127.0.0.1:8000/posts/${postId}/like`;
  
      // Send the like/unlike request and get the updated post data
      const response = await axios.post(likeEndpoint, {
        user_id: userId,  // Include user ID in the request
        post_id: postId
      });
  
      const updatedPost = response.data; // Assuming the response contains the updated post object
  
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                is_liked: !isLiked, // Toggle the like status
                likes_count: updatedPost.like_count // Update like_count from the response
              }
            : post
        )
      );
    } catch (error) {
      console.error('Like/Unlike error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.detail || 'Could not update like status'
      );
    }
  }; 

  const handleConnect = async (postUserId) => {
    try {
      // Retrieve the logged-in user's data
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        Alert.alert('Error', 'Please log in first');
        return;
      }
  
      const currentUser = JSON.parse(userData);
      const currentUserId = currentUser.id;
  
      // Fetch the username of the user you're connecting with
      const receiverUsername = usernames[postUserId] || 'Anonymous User';
  
      // Store sender (current user) and receiver (post user) IDs in AsyncStorage
      await AsyncStorage.setItem('messageSenderId', currentUserId);
      await AsyncStorage.setItem('messageReceiverId', postUserId);
      await AsyncStorage.setItem('receiverUsername', receiverUsername);
  
      // Navigate to Message screen
      navigation.navigate("Message", { 
        senderId: currentUserId,
        receiverId: postUserId, 
        receiverName: receiverUsername
      });
    } catch (error) {
      console.error('Connect error:', error);
      Alert.alert('Error', 'Could not establish connection');
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

  const resetPostForm = () => {
    setTitle('');
    setDescription('');
    setHashtags('');
    setImage(null);
  };


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
        nestedScrollEnabled={true}
        scrollEnabled={true}
      >
        {posts.length === 0 ? (
          <Text style={styles.emptyListText}>No posts yet. Create one!</Text>
        ) : (
          posts.map((item) => {
            const mediaUrl = `http://127.0.0.1:8000/images/${item.image_url.split('/').pop()}`;
            const isVideo = item.image_url.match(/\.(mp4|mov|avi|wmv)$/i);
            const username = usernames[item.user_id] || 'Anonymous User';
            const postCommentsList = postComments[item.id] || [];

            return (
              <View key={item.id} style={styles.postContainer}>
                {/* User Profile Header */}
                <View style={styles.postHeader}>
                  <View style={styles.userProfileContainer}>
                    <Image 
                      source={{ uri: 'https://via.placeholder.com/50' }} 
                      style={styles.userProfileImage} 
                    />
                    <View style={styles.userInfoContainer}>
                      <Text style={styles.userName}>{username}</Text>
                      <Text style={styles.userLocation}>San Francisco, CA</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.connectButton} onPress={() => handleConnect((item.user_id))}>
                    <FontAwesome5 name="user-plus" size={20} color="#00A86B" />
                    <Text style={styles.connectButtonText}>Connect</Text>
                  </TouchableOpacity>
                </View>

                {/* Post Content */}
                <View style={styles.postContentContainer}>
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

                  <View style={styles.postTextContainer}>
                    <Text style={styles.postHashtags}>{item.hashtag || ''}</Text>
                    <Text style={styles.postDescription}>{item.description}</Text>
                  </View>
                </View>

                {/* Post Interactions */}
                <View style={styles.postInteractions}>
                  <TouchableOpacity 
                    style={styles.likeButton}
                    onPress={() => toggleLike(item.id, item.is_liked)}
                  >
                    <FontAwesome5 
                      name="heart" 
                      size={20} 
                      color={item.is_liked ? "#FF6B6B" : "#CCCCCC"} 
                    />
                    <Text style={styles.likeButtonText}>
                      {item.likes_count || 0} Likes
                    </Text>
                  </TouchableOpacity>
                  
                  {/* Comments Section */}
                  <View style={styles.commentsSection}>
                    {postCommentsList.length > 0 && (
                      <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        style={styles.commentsScrollView}
                      >
                        {postCommentsList.map(comment => (
                          <View key={comment.id} style={styles.commentBubble}>
                            <Text style={styles.commentText}>{comment.comment}</Text>
                          </View>
                        ))}
                      </ScrollView>
                    )}
                  </View>

                  <View style={styles.commentInputContainer}>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Add a comment..."
                      value={commentText}
                      onChangeText={setCommentText}
                    />
                    <TouchableOpacity 
                      style={styles.sendCommentButton}
                      onPress={() => {
                        addComment(item.id);
                        fetchPostComments(item.id);
                      }}
                    >
                      <Feather name="send" size={20} color="#00A86B" />
                    </TouchableOpacity>
                  </View>
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

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={createPost}
            >
              <Text style={styles.submitButtonText}>Create Post</Text>
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
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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
    marginTop: 100,
    marginBottom: 20,
    paddingHorizontal: 16,
    ...(Platform.OS === 'web' ? {
      height: 'calc(100vh - 200px)',
      overflowY: 'auto',
    } : {}),
  },
  contentContainer: {
    paddingBottom: 80,
    flexGrow: 1,
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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
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