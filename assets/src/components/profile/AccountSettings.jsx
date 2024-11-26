import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const colors = {
  background: '#1a1a1a',
  cardBackground: '#2d2d2d',
  primary: '#00A86B',
  text: '#ffffff',
  secondaryText: '#b0b0b0',
  border: '#404040',
  promoBackground: '#363636',
  headerBackground: '#424242',
};

const ActivityPost = ({ post }) => {
  return (
    <View style={styles.postContainer}>
      <Image source={{ uri: post.userImage }} style={styles.userImage} />
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.postTime}>{post.time}</Text>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.textContent}>
            <Text style={styles.postText}>{post.text}</Text>
            <View style={styles.reactions}>
              <Text style={styles.reactionCount}>{post.reactions} reactions</Text>
              {post.reposts && (
                <Text style={styles.repostCount}>{post.reposts} reposts</Text>
              )}
            </View>
          </View>
          {post.contentImage && (
            <View style={styles.sideImageContainer}>
              <Image 
                source={{ uri: post.contentImage }} 
                style={styles.contentImage}
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const Activity = () => {
  const samplePosts = [
    {
      id: 1,
      userName: "Sri Varssha M K",
      userImage: "https://via.placeholder.com/40",
      time: "5mo",
      text: "Great news! Harini R A J and I won 1st place in the Anglophile Lounge Club's Logo Contest at Thiagarajar College of Engineering! Our design is now the official logo for the club! 🎨 ✨ We're incredibly grateful for all the support.",
      contentImage: "https://via.placeholder.com/150",
      reactions: 55,
    },
    {
      id: 2,
      userName: "Sri Varssha M K",
      userImage: "https://via.placeholder.com/40",
      time: "7mo",
      text: "Proud to share my achievements from the 2023-2024 events organized by the Department of Computer Science and Engineering at Thiagarajar College of Engineering: 🏆 1st Place - Tech Show (Presentation)",
      contentImage: "https://via.placeholder.com/150",
      reactions: 88,
    },
    {
      id: 3,
      userName: "Sri Varssha M K",
      userImage: "https://via.placeholder.com/40",
      time: "7mo",
      text: "We're excited to share that our team TechSavvy, including Pranitha S from EEE and Anushankari Sivaponnappan from CSE, won 1st place in the Algothon by CSBS at Thiagarajar College of Engineering!",
      contentImage: "https://via.placeholder.com/150",
      reactions: 54,
      reposts: 2
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Activity</Text>
          <Text style={styles.followerCount}>276 followers</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.createPost}>
            <Text style={styles.createPostText}>Create a post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton}>
            <Feather name="edit-2" size={20} color={colors.secondaryText} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Comments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Images</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.postsContainer}>
        {samplePosts.map(post => (
          <ActivityPost key={post.id} post={post} />
        ))}
        <TouchableOpacity style={styles.showMoreButton}>
          <Text style={styles.showMoreText}>Show all posts →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  followerCount: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createPost: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  createPostText: {
    color: colors.text,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    marginRight: 24,
    paddingBottom: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.secondaryText,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  postsContainer: {
    maxHeight: 500,
  },
  postContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postContent: {
    flex: 1,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontWeight: '600',
    color: colors.text,
  },
  postTime: {
    color: colors.secondaryText,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  textContent: {
    flex: 1,
  },
  postText: {
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  sideImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  contentImage: {
    width: '100%',
    height: '100%',
  },
  reactions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  reactionCount: {
    color: colors.secondaryText,
    marginRight: 16,
  },
  repostCount: {
    color: colors.secondaryText,
  },
  showMoreButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  showMoreText: {
    color: colors.secondaryText,
    fontWeight: '600',
  },
});

export default Activity;