import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import BackButton from './BackButton';
import SpaceBackground from '../components/SpaceBackground';
import LanguageSwitcher from './LanguageSwitcher';
const PodcastComp = () => {
  const { t } = useTranslation();

  const openSpotifyLink = () => {
    Linking.openURL('https://open.spotify.com/show/4tBispbp2qYjTR3Loan3t5');
  };

  const openApplePodcastLink = () => {
    Linking.openURL('https://podcasts.apple.com/us/podcast/the-anti-doping-podcast/id1456373484');
  };

  return (
    <View style={{ flex: 1 }}>
      <SpaceBackground style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <ScrollView vertical={true} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{
          backgroundColor: '#0A0A0A',
          borderRadius: 20,
          padding: 25,
          flexDirection: 'column',
          shadowColor: '#1DB954',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 12,
          maxWidth: 450,
          alignSelf: 'center',
          zIndex: 1,
        }}>
          <BackButton />
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 30,
            borderBottomWidth: 2,
            borderBottomColor: '#1DB954',
            paddingBottom: 20
          }}>
            <Image
              source={{ uri: 'https://www.dropbox.com/scl/fi/8se9cydiysfa737hqf2yo/podcast.png?rlkey=wz12xu98mejj3r3cjrsmwg7ki&st=72tpm2h0&raw=1' }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 18,
                marginRight: 25,
                borderWidth: 2,
                borderColor: '#1DB954'
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{
                color: '#1DB954',
                fontSize: 28,
                fontWeight: '700',
                marginBottom: 8
              }}>
                {t('podcastTitle')}
              </Text>
              <Text style={{
                color: '#9CA3AF',
                fontSize: 16,
                fontStyle: 'italic'
              }}>
                {t('podcastSubtitle')}
              </Text>
            </View>
          </View>

          <View style={{
            backgroundColor: '#111111',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20
          }}>
            <Text style={{
              color: '#1DB954',
              fontSize: 20,
              fontWeight: '600',
              marginBottom: 15
            }}>
              {t('aboutPodcastTitle')}
            </Text>
            <Text style={{
              color: '#D1D5DB',
              fontSize: 16,
              lineHeight: 24
            }}>
              {t('aboutPodcastDescription')}
            </Text>
          </View>

          <View style={{
            backgroundColor: '#111111',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20
          }}>
            <Text style={{
              color: '#1DB954',
              fontSize: 20,
              fontWeight: '600',
              marginBottom: 15
            }}>
              {t('missionTitle')}
            </Text>
            <LanguageSwitcher />
            <View>
              {t('missionItems', { returnObjects: true }).map((item, index) => (
                <View key={index} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8
                }}>
                  <Text style={{
                    color: '#1DB954',
                    marginRight: 15
                  }}>
                    ●
                  </Text>
                  <Text style={{
                    color: '#D1D5DB',
                    fontSize: 16,
                    flex: 1
                  }}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{
            backgroundColor: '#111111',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20
          }}>
            <Text style={{
              color: '#1DB954',
              fontSize: 20,
              fontWeight: '600',
              marginBottom: 15
            }}>
              {t('creditsTitle')}
            </Text>
            <Text style={{
              color: '#D1D5DB',
              fontSize: 16,
              marginBottom: 8
            }}>
              {t('host')}
            </Text>
            <Text style={{
              color: '#9CA3AF',
              fontSize: 14,
              fontStyle: 'italic'
            }}>
              {t('presentedBy')}
            </Text>
          </View>

          <TouchableOpacity
            onPress={openSpotifyLink}
            style={{
              backgroundColor: '#1DB954',
              borderRadius: 35,
              padding: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#1DB954',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.5,
              shadowRadius: 8,
              elevation: 10
            }}
          >
            <Image
              source={{ uri: 'https://www.dropbox.com/scl/fi/n9i6c1c6b8l4pm9bh72al/spotify.jpg?rlkey=5xd4qjz6iiwk7q3od6f1ooz9u&st=k49gsggu&raw=1' }}
              style={{ width: 30, height: 30, marginRight: 15 }}
            />
            <Text style={{
              color: '#000000',
              fontWeight: '700',
              fontSize: 18,
              letterSpacing: 0.6
            }}>
              {t('spotifyButton')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openApplePodcastLink}
            style={{
              backgroundColor: '#000000',
              borderRadius: 35,
              padding: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.5,
              shadowRadius: 8,
              elevation: 10,
              marginTop: 20
            }}
          >
            <Image
              source={{ uri: 'https://www.dropbox.com/scl/fi/nxph234rv955663sdk000/apple.png?rlkey=shtfahd8mhx04wa1r7xeptfl5&st=uzx8w3rn&raw=1' }}
              style={{ width: 30, height: 30, marginRight: 15 }}
            />
            <Text style={{
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: 18,
              letterSpacing: 0.6
            }}>
              {t('appleButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PodcastComp;
