import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Mail, Lock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import SpaceBackground from '../components/SpaceBackground';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next'; 
import LanguageSwitcher from '../components/LanguageSwitcher'; // Import the LanguageSwitcher component

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();

  // Handle login function
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('error'), t('signin.error_empty_fields'));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userData', JSON.stringify(responseData));
        navigation.navigate('Home', { 
          updateProfile: true 
        });
      } else {
        Alert.alert(t('signin.login_failed'), responseData.detail || t('signin.invalid_credentials'));
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(t('error'), t('signin.network_error'));
    } finally {
      setLoading(false);
    }
  };

  // Navigate to Signup screen
  const navigateToSignup = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.mainContainer}>
      <SpaceBackground />
      
      <LanguageSwitcher /> {/* Add the LanguageSwitcher component */}

      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.formContainer}
          >
            <Text style={styles.title}>{t('signin.sign_in')}</Text>

            <View style={styles.inputWrapper}>
              <Mail width={20} height={20} color="#00A86B" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder={t('signin.email_placeholder')}
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Lock width={20} height={20} color="#00A86B" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder={t('signin.password_placeholder')}
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? t('signin.logging_in') : t('signin.sign_in')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToSignup} style={styles.signupLink}>
              <Text style={styles.signupText}>
                {t('signin.signup_text')} <Text style={styles.signupTextHighlight}>{t('signin.signup_link')}</Text>
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    width: '20%',
    height: '60%',
    backdropFilter: 'blur(10px)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formContainer: {
    width: '100%',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    marginTop: 40,
    marginVertical:60
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26,26,26,0.8)',
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 48,
    width: '100%',
    backgroundColor: 'transparent',
  },
  icon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF'
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 47,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom:10,
  },
  loginButtonDisabled: {
    backgroundColor: '#666666'
  },
  loginButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold'
  },
  signupLink: {
    marginTop: 16,
    alignItems: 'center'
  },
  signupText: {
    color: '#FFFFFF',
    fontSize: 16
  },
  signupTextt: {
    color: '#00A86B',
    fontSize: 16
  }
});

export default LoginScreen;