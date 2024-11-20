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
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
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
        // Store user data in AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(responseData));
        navigation.navigate('Home', { 
          updateProfile: true 
        });
      } else {
        Alert.alert('Login Failed', responseData.detail || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    navigation.navigate('SignUp');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>

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
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Logging in...' : 'Log in'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToSignup} style={styles.signupLink}>
          <Text style={styles.signupText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e8f4f8' },
    formContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 30, textAlign: 'center' },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, marginBottom: 15, paddingHorizontal: 15, height: 50 },
    icon: { marginRight: 10 },
    input: { flex: 1, fontSize: 16, color: '#333' },
    loginButton: { backgroundColor: '#4a90e2', borderRadius: 15, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    loginButtonDisabled: { backgroundColor: '#a0c4e7' },
    loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    signupLink: { 
      marginTop: 15, 
      alignItems: 'center' 
    },
    signupText: { 
      color: '#4a90e2', 
      fontSize: 16 
    },
});

export default LoginScreen;