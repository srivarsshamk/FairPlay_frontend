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
  ScrollView,
} from 'react-native';
import { Mail, Lock, User, Phone } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import SpaceBackground from '../components/SpaceBackground';
import LanguageSwitcher from '../components/LanguageSwitcher'; // Import the LanguageSwitcher component

const SignupScreen = () => {
  const { t } = useTranslation(); // Initialize useTranslation hook
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      Alert.alert(t('signup.error'), t('signup.errorFillAllFields')); // Localized error message
      return;
    }

    setLoading(true);
    try {
      const requestBody = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone_number: phoneNumber,
        age: null,
        bio: null
      };

      const response = await fetch('http://127.0.0.1:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert(t('signup.registrationSuccess'), t('signup.registrationSuccessMessage'), [
          {
            text: t('signup.loginLinkText'),
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      } else {
        const errorMessage = responseData.detail
          ? Array.isArray(responseData.detail)
            ? responseData.detail.map((error) => `${error.loc.join('.')}: ${error.msg}`).join('\n')
            : responseData.detail
          : t('signup.error');

        Alert.alert(t('signup.registrationErrorTitle'), errorMessage);
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert(t('signup.error'), t('signup.networkErrorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.mainContainer}>
      <SpaceBackground />
      
      {/* Language Switcher at the top-right */}
      <LanguageSwitcher />

      <View style={styles.container}>
        <View style={styles.signupContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.formContainer}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.title}>{t('signup.title')}</Text>

              <View style={styles.inputWrapper}>
                <User width={20} height={20} color="#00A86B" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('signup.firstNamePlaceholder')}
                  value={firstName}
                  onChangeText={setFirstName}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputWrapper}>
                <User width={20} height={20} color="#00A86B" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('signup.lastNamePlaceholder')}
                  value={lastName}
                  onChangeText={setLastName}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Mail width={20} height={20} color="#00A86B" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('signup.emailPlaceholder')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Phone width={20} height={20} color="#00A86B" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('signup.phoneNumberPlaceholder')}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Lock width={20} height={20} color="#00A86B" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('signup.passwordPlaceholder')}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[styles.signupButton, loading && styles.signupButtonDisabled]}
                onPress={handleSignup}
                disabled={loading}
              >
                <Text style={styles.signupButtonText}>
                  {loading ? t('signup.signupButtonLoading') : t('signup.signupButton')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={navigateToLogin} style={styles.loginLink}>
                <Text style={styles.loginText}>
                  {t('signup.alreadyHaveAccount')} <Text style={styles.signupText}>{t('signup.loginLinkText')}</Text>
                </Text>
              </TouchableOpacity>
            </ScrollView>
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
  signupContainer: {
    width: '20%',
    height: '80%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom:30,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    marginTop: 40,
    textAlign: 'center',
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
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  signupButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupButtonDisabled: {
    backgroundColor: '#666666',
  },
  signupButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  signupText: {
    color: '#00A86B',
    fontSize: 16,
  },
});

export default SignupScreen;
