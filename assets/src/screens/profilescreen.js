import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ActivitySection from "../components/profile/AccountSettings";
import EditProfile from "../components/profile/EditProfile";



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

const suggestedProfiles = [
  {
    id: 1,
    name: 'Dr. Alex Johnson',
    title: 'Senior Doping Control Officer at USADA',
    image: 'https://via.placeholder.com/50',
    connections: '500+',
  },
  {
    id: 2,
    name: 'Dr. Sarah Chen',
    title: 'Laboratory Director at WADA',
    image: 'https://via.placeholder.com/50',
    connections: '432',
  },
  {
    id: 3,
    name: 'Michael Park',
    title: 'Anti-Doping Education Coordinator',
    image: 'https://via.placeholder.com/50',
    connections: '892',
  },
];

const SuggestedProfile = ({ profile, mini = false }) => {
  if (mini) {
    return (
      <View style={styles.connectionPreview}>
        <Image source={{ uri: profile.image }} style={styles.connectionPreviewImage} />
        <Text style={styles.connectionPreviewName}>{profile.name}</Text>
        <TouchableOpacity style={styles.miniConnectButton}>
          <Text style={styles.miniConnectButtonText}>Connect</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.suggestedProfile}>
      <Image source={{ uri: profile.image }} style={styles.suggestedProfileImage} />
      <View style={styles.suggestedProfileInfo}>
        <Text style={styles.suggestedProfileName}>{profile.name}</Text>
        <Text style={styles.suggestedProfileTitle}>{profile.title}</Text>
        <Text style={styles.suggestedProfileConnections}>
          {profile.connections} connections
        </Text>
      </View>
      <TouchableOpacity style={styles.connectButton}>
        <Text style={styles.connectButtonText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );
};

const LinkedInProfile = () => {
  const navigation = useNavigation();

  const handleEditPress = () => {
    try {
      navigation.navigate('EditProfile');
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  const handleEditLanguages = () => {
    try {
      navigation.navigate('EditProfile', { section: 'languages' });
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  const handleEditWadaProfile = () => {
    try {
      navigation.navigate('EditProfile', { section: 'wada-profile' });
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Image
            source={{ uri: 'https://via.placeholder.com/800x200' }}
            style={styles.coverImage}
          />
          
          <View style={styles.profileSection}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditPress}
              activeOpacity={0.7}
            >
              <Feather name="edit-2" size={20} color={colors.secondaryText} />
            </TouchableOpacity>
            
            <View style={styles.profileInfo}>
              <View style={styles.nameSection}>
                <Text style={styles.name}>Dr. Emma Wilson</Text>
                <Feather name="check-circle" size={16} color={colors.primary} />
              </View>
              <Text style={styles.education}>
                PhD in Analytical Chemistry | WADA Accredited Laboratory
              </Text>
              <Text style={styles.location}>
                Montreal, Quebec, Canada
              </Text>
              <TouchableOpacity style={styles.contactInfo}>
                <Text style={styles.contactInfoText}>Contact info</Text>
              </TouchableOpacity>
              <Text style={styles.connections}>273 anti-doping professionals</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Available</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Add certification</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Update credentials</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreButton}>
                <Text style={styles.moreButtonText}>More</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.promoCards}>
              <View style={styles.promoCard}>
                <Feather name="briefcase" size={20} color={colors.secondaryText} />
                <Text style={styles.promoText}>
                  Share your expertise in anti-doping control and join our global network of professionals.
                </Text>
                <TouchableOpacity>
                  <Text style={styles.getStartedText}>Get started</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.activitySection}>
              <ActivitySection />
            </View>
          </View>
        </ScrollView>

        <View style={styles.sidebar}>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.sidebarCard}>
              <Text style={styles.sidebarTitle}>Anti-Doping Professionals You May Know</Text>
              {suggestedProfiles.map((profile) => (
                <SuggestedProfile key={profile.id} profile={profile} />
              ))}
            </View>

            <View style={styles.sidebarCard}>
              <Text style={styles.sidebarTitle}>Recommended Professionals</Text>
              <View style={styles.connectionsWidget}>
                {suggestedProfiles.slice(0, 2).map((profile) => (
                  <SuggestedProfile key={profile.id} profile={profile} mini={true} />
                ))}
              </View>
            </View>

            <View style={styles.sidebarCard}>
              <View style={styles.sidebarHeader}>
                <Text style={styles.sidebarTitle}>Working Languages</Text>
                <TouchableOpacity 
                  onPress={handleEditLanguages}
                  activeOpacity={0.7}
                >
                  <Feather name="edit-2" size={16} color={colors.secondaryText} />
                </TouchableOpacity>
              </View>
              <Text style={styles.sidebarText}>English, French</Text>
            </View>

            <View style={styles.sidebarCard}>
              <View style={styles.sidebarHeader}>
                <Text style={styles.sidebarTitle}>WADA Profile & URL</Text>
                <TouchableOpacity 
                  onPress={handleEditWadaProfile}
                  activeOpacity={0.7}
                >
                  <Feather name="edit-2" size={16} color={colors.secondaryText} />
                </TouchableOpacity>
              </View>
              <Text style={styles.sidebarLink}>
                www.wada-ama.org/profile/emma-wilson
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    minHeight: "180%",
    padding: 10,
  },
  sidebar: {
    flex: 0.3,
    padding: 30,
    backgroundColor: colors.background,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    minHeight: "140%",
  },
  // ... (rest of the styles remain the same)
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  profileSection: {
    marginTop: -60,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.cardBackground,
  },
  editButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 8,
  },
  profileInfo: {
    marginTop: 16,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  education: {
    fontSize: 16,
    color: colors.secondaryText,
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 4,
  },
  contactInfo: {
    marginTop: 8,
  },
  contactInfoText: {
    color: colors.primary,
    fontWeight: '600',
  },
  connections: {
    marginTop: 8,
    color: colors.secondaryText,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  activitySection: {
    marginTop: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  moreButton: {
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.secondaryText,
  },
  moreButtonText: {
    color: colors.secondaryText,
    fontWeight: '600',
  },

  promoCards: {
    marginTop: 16,
    gap: 16,
    marginBottom: 16,
  },
  promoCard: {
    padding: 16,
    backgroundColor: colors.promoBackground,
    borderRadius: 8,
    gap: 8,
  },
  promoText: {
    color: colors.secondaryText,
    fontSize: 14,
  },
  getStartedText: {
    color: colors.primary,
    fontWeight: '600',
  },
  sidebar: {
    flex: 0.3,
    padding: 16,
    backgroundColor: colors.background,
  },
  sidebarCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sidebarTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: colors.text,
  },
  sidebarText: {
    color: colors.secondaryText,
  },
  sidebarLink: {
    color: colors.primary,
    fontSize: 14,
  },
  suggestedProfilesSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  suggestedProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestedProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  suggestedProfileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  suggestedProfileName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  suggestedProfileTitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 2,
  },
  suggestedProfileConnections: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  connectButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  connectButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  connectionsWidget: {
    marginTop: 12,
  },
  connectionPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  connectionPreviewImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  connectionPreviewName: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  miniConnectButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  miniConnectButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default LinkedInProfile;
