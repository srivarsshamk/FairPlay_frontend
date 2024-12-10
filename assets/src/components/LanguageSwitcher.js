// components/LanguageSwitcher.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'ta', label: 'தமிழ்' },
  ];

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang)
      .then(() => console.log(`Language changed to ${lang}`))
      .catch(err => console.error('Error changing language:', err));
    setDropdownVisible(false);
  };

  return (
    <View style={styles.languageSwitcherContainer}>
      <TouchableOpacity 
        onPress={() => setDropdownVisible(!dropdownVisible)} 
        style={styles.languageButton}
      >
        <Text style={styles.languageButtonText}>{i18n.language.toUpperCase()}</Text>
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          {languages.map((lang) => (
            <TouchableOpacity 
              key={lang.code} 
              onPress={() => switchLanguage(lang.code)} 
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownText}>{lang.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  languageSwitcherContainer: {
    position: 'absolute',
    top: 50,
    right: 10,
    zIndex: 10
  },
  languageButton: {
    padding: 10,
    backgroundColor: '#00A86B',
    borderRadius: 5,
  },
  languageButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default LanguageSwitcher;
