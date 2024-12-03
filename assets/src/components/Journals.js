import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { ChevronLeft, Users, BookOpen, CalendarDays, Link, ArrowDown } from 'lucide-react';

const Journals = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchJournals = async (currentPage) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/journals?page=${currentPage}&limit=5`);
      const newJournals = response.data.data || [];

      setJournals(prev => 
        currentPage === 1 ? newJournals : [...prev, ...newJournals]
      );
      setHasMore(newJournals.length === 3);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals(1);
  }, []);

  const loadMoreJournals = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchJournals(nextPage);
    }
  };

  const JournalCard = ({ journal }) => (
    <TouchableOpacity style={styles.journalCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.journalTitle} numberOfLines={2}>
          {journal?.title || 'No Title Available'}
        </Text>
      </View>

      <View style={styles.journalDetailContent}>
        <View style={styles.detailInfoContainer}>
          <View style={styles.detailRow}>
            <Users style={styles.detailInfoIcon} />
            <Text style={styles.detailInfoText} numberOfLines={2}>
              Authors: {journal?.authors?.join(', ') || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <BookOpen style={styles.detailInfoIcon} />
            <Text style={styles.detailInfoText}>
              Journal: {journal?.journal || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <CalendarDays style={styles.detailInfoIcon} />
            <Text style={styles.detailInfoText}>
              Published: {journal?.published_date || 'N/A'}
            </Text>
          </View>
          {journal?.url && (
            <TouchableOpacity 
              onPress={() => window.open(journal.url, '_blank')}
              style={styles.sourceLinkContainer}
            >
              <Link style={styles.sourceLinkIcon} />
              <Text style={styles.sourceLinkText}>View Source</Text>
            </TouchableOpacity>
          )}
        </View>

        <View>
          <Text style={styles.doiTitle}>DOI</Text>
          <Text style={styles.doiText}>{journal?.doi || 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Refer to latest scientific journals</Text>
      
      <FlatList
        data={journals}
        renderItem={({ item }) => <JournalCard journal={item} />}
        keyExtractor={(journal, index) => journal?.doi || `journal-${index}`}
        ListFooterComponent={() => (
          hasMore && (
            <TouchableOpacity 
              style={styles.loadMoreButton} 
              onPress={loadMoreJournals}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#1DB954" />
              ) : (
                <>
                  <ArrowDown style={styles.loadMoreIcon} />
                  <Text style={styles.loadMoreText}>Load More</Text>
                </>
              )}
            </TouchableOpacity>
          )
        )}
        horizontal={true}  // Enable horizontal scroll
        showsHorizontalScrollIndicator={false}  // Hide scroll indicator
        contentContainerStyle={styles.horizontalContainer}  // Add padding if needed
      />
      
      {loading && journals.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  journalCard: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: 225,  // Adjust width to fit horizontally
    borderWidth: 1,
    marginRight: 15, 
    borderColor: '#1DB954',
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 12,
  },
  journalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  journalDetailContent: {
    gap: 16,
    marginTop: 16,
  },
  detailInfoContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailInfoIcon: {
    color: '#1DB954',
    width: 18,
    height: 18,
  },
  detailInfoText: {
    color: '#FFFFFF',
    fontSize: 14,
    flexShrink: 1,
    flexWrap: 'wrap',  // Allow the text to wrap for longer author names
  },
  sourceLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  sourceLinkIcon: {
    color: '#1DB954',
    width: 16,
    height: 16,
  },
  sourceLinkText: {
    color: '#1DB954',
    marginLeft: 8,
    fontSize: 14,
  },
  doiTitle: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  doiText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  loadMoreButton: {
    backgroundColor: '#1DB954',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  loadMoreIcon: {
    color: '#121212',
    width: 20,
    height: 20,
  },
  loadMoreText: {
    color: '#121212',
    marginTop: 4,
  },
  horizontalContainer: {
    paddingVertical: 8,  // Optional padding for better layout
  },
});

export default Journals;
