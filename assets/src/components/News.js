import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Image,
  Linking,
  SafeAreaView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 16;

const HomeScreen = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async (pageNumber = 1, shouldAppend = false) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/news?page=${pageNumber}`);
      
      if (response.data.status === 'success') {
        const newArticles = response.data.data;
        setNews(prevNews => shouldAppend ? [...prevNews, ...newArticles] : newArticles);
        setHasMore(response.data.hasMore);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => {
        const nextPage = prev + 1;
        fetchNews(nextPage, true);
        return nextPage;
      });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchNews(1, false);
  };

  const handleArticlePress = (article) => {
    setSelectedArticle(article);
    setModalVisible(true);
  };

  const renderNewsItem = (item) => {
    if (!item) return null;
    
    return (
      <TouchableOpacity 
        key={item.url}
        style={[styles.newsItem, { width: COLUMN_WIDTH }]}
        onPress={() => handleArticlePress(item)}
      >
        <View style={styles.newsImageContainer}>
          {item.urlToImage ? (
            <Image
              source={{ uri: item.urlToImage }}
              style={styles.newsImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.newsImage, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
        </View>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderNewsItems = () => {
    const rows = [];
    for (let i = 0; i < news.length; i += 2) {
      const row = (
        <View key={i} style={styles.row}>
          {renderNewsItem(news[i])}
          {i + 1 < news.length && renderNewsItem(news[i + 1])}
        </View>
      );
      rows.push(row);
    }
    return rows;
  };

  const ArticleDetailModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <ScrollView style={styles.detailContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {selectedArticle?.urlToImage && (
            <Image
              source={{ uri: selectedArticle.urlToImage }}
              style={styles.detailImage}
              resizeMode="cover"
            />
          )}
          
          <View style={styles.detailContent}>
            <Text style={styles.detailTitle}>{selectedArticle?.title}</Text>
            
            <View style={styles.detailMeta}>
              <Text style={styles.detailSource}>
                {selectedArticle?.source?.name}
              </Text>
              <Text style={styles.detailDate}>
                {selectedArticle?.publishedAt && 
                  new Date(selectedArticle.publishedAt).toLocaleDateString()}
              </Text>
            </View>
            
            <Text style={styles.detailDescription}>
              {selectedArticle?.description}
            </Text>
            
            <Text style={styles.detailBody}>
              {selectedArticle?.content}
            </Text>
            
            {selectedArticle?.url && (
              <TouchableOpacity
                style={styles.readMoreButton}
                onPress={() => Linking.openURL(selectedArticle.url)}
              >
                <Text style={styles.readMoreButtonText}>
                  Read Full Article
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  if (error && news.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={handleRefresh}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Anti-Doping News</Text>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={true}
          scrollEventThrottle={16}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const paddingToBottom = 20;
            if (layoutMeasurement.height + contentOffset.y >=
                contentSize.height - paddingToBottom) {
              handleLoadMore();
            }
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#0066cc']}
            />
          }
        >
          <View style={styles.content}>
            {renderNewsItems()}
            {loading && !refreshing && (
              <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color="#0066cc" />
              </View>
            )}
          </View>
        </ScrollView>

        <ArticleDetailModal />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    padding: 8,
    paddingRight: 12,
  },
  header: {
    backgroundColor: 'rgba(0, 128, 0, 0.7)',
    padding: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  newsItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newsImageContainer: {
    width: '100%',
    height: 150,
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '600',
    padding: 12,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailContainer: {
    flex: 1,
  },
  detailImage: {
    width: '100%',
    height: 250,
  },
  detailContent: {
    padding: 16,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailSource: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '500',
  },
  detailDate: {
    fontSize: 14,
    color: '#666',
  },
  detailDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  detailBody: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  readMoreButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  readMoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;