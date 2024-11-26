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

const SignupScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all fields');
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
        bio: null, // Always send bio as null
        age: null, // Always send age as null
      };

      const response = await fetch('http://127.0.0.1:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      console.log('Response Data:', responseData); // Log the response data for debugging

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully', [
          {
            text: 'Login',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      } else {
        const errorMessage = responseData.detail
          ? Array.isArray(responseData.detail)
            ? responseData.detail.map(error => `${error.loc.join('.')}: ${error.msg}`).join('\n')
            : responseData.detail
          : 'Registration failed. Please try again.';

        Alert.alert('Registration Error', errorMessage);
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Welcome');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>

          <View style={styles.inputWrapper}>
            <User width={20} height={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              editable={!loading}
            />
          </View>

          <View style={styles.inputWrapper}>
            <User width={20} height={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              editable={!loading}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Mail width={20} height={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Phone width={20} height={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={!loading}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock width={20} height={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToLogin} style={styles.loginLink}>
            <Text style={styles.loginText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8f4f8' },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  signupButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupButtonDisabled: {
    backgroundColor: '#a0c4e7',
  },

  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  loginText: {
    color: '#4a90e2',
    fontSize: 16,
  },
});

export default SignupScreen;
