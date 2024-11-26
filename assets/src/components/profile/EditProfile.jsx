import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const colors = {
  background: '#1a1a1a',
  cardBackground: '#2d2d2d',
  primary: '#00A86B',
  text: '#ffffff',
  secondaryText: '#b0b0b0',
  border: '#404040',
  error: '#ff6b6b',
};

const EditProfile = () => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    bio: '',
    country: '',
    state: '',
    phoneNum: '',
  });

  const [errors, setErrors] = React.useState({});

  const validateForm = () => {
    let newErrors = {};
    
    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Age validation
    const ageNum = parseInt(formData.age);
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
      newErrors.age = 'Age must be between 13 and 120';
    }

    // Bio validation
    if (formData.bio.length > 250) {
      newErrors.bio = 'Bio must be less than 250 characters';
    }

    // Country validation
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    // State validation
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!formData.phoneNum.trim()) {
      newErrors.phoneNum = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNum)) {
      newErrors.phoneNum = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Handle form submission here
    }
  };

  const renderInput = (label, key, placeholder, keyboardType = 'default', multiline = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          errors[key] && styles.inputError,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
        value={formData[key]}
        onChangeText={(text) => setFormData(prev => ({ ...prev, [key]: text }))}
        keyboardType={keyboardType}
        multiline={multiline}
      />
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
          <Feather name="check" size={20} color={colors.text} style={styles.saveIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.row}>
          {renderInput('First Name', 'firstName', 'Enter first name')}
          {renderInput('Last Name', 'lastName', 'Enter last name')}
        </View>
        
        {renderInput('Email', 'email', 'Enter email address', 'email-address')}
        {renderInput('Age', 'age', 'Enter age', 'numeric')}
        {renderInput('Bio', 'bio', 'Write something about yourself', 'default', true)}
        
        <View style={styles.row}>
          {renderInput('Country', 'country', 'Enter country')}
          {renderInput('State', 'state', 'Enter state')}
        </View>

        {renderInput('Phone Number', 'phoneNum', 'Enter phone number', 'phone-pad')}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: colors.text,
    fontWeight: '600',
    marginRight: 8,
  },
  saveIcon: {
    marginLeft: 4,
  },
  form: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    color: colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default EditProfile;