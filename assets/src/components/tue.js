import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  StyleSheet, 
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; 


const MEDICAL_CONDITIONS = {
  asthma: { requiresTUE: true, description: 'Athletes with asthma may require a TUE for certain medications.' },
  diabetes: { requiresTUE: true, description: 'Insulin and some diabetes medications may need TUE approval.' },
  adhd: { requiresTUE: true, description: 'Stimulant medications for ADHD typically require a TUE.' },
  epilepsy: { requiresTUE: true, description: 'Some anti-seizure medications may require a TUE.' },
  hypertension: { requiresTUE: true, description: 'Certain blood pressure medications may require TUE approval.' },
  depression: { requiresTUE: true, description: 'Antidepressants generally require a TUE for athletes.' },
  anxiety: { requiresTUE: true, description: 'Anxiolytics or other related medications might require TUE approval.' },
  hypothyroidism: { requiresTUE: true, description: 'Thyroid hormone replacement often requires a TUE.' },
  chronic_pain: { requiresTUE: true, description: 'Opioids and certain analgesics may require TUE.' },
  arthritis: { requiresTUE: true, description: 'Some NSAIDs and corticosteroids may need TUE approval.' },
  anemia: { requiresTUE: true, description: 'Erythropoietin (EPO) treatment for anemia typically requires a TUE.' },
  migraines: { requiresTUE: true, description: 'Medications like triptans may require TUE for athletes.' },
  allergies: { requiresTUE: true, description: 'Some antihistamines or corticosteroids might require TUE.' },
  sleep_disorders: { requiresTUE: true, description: 'Medications for insomnia or narcolepsy often require TUE.' },
  obesity: { requiresTUE: true, description: 'Weight-loss medications may require TUE approval.' },
  chronic_fatigue: { requiresTUE: true, description: 'Certain stimulants for fatigue management might need TUE approval.' },
  osteoporosis: { requiresTUE: true, description: 'Medications like bisphosphonates may require TUE.' },
  inflammatory_bowel_disease: { requiresTUE: true, description: 'Certain immunosuppressants may require TUE.' },
  bipolar_disorder: { requiresTUE: true, description: 'Mood stabilizers and antipsychotics often require TUE approval.' },
  psoriasis: { requiresTUE: true, description: 'Some immune-modulating treatments may need TUE approval.' }
};

const MEDICATION_DATABASE = [
  { 
    name: 'Salbutamol', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['Asthma'],
    sports: ['All']
  },
  { 
    name: 'Methylphenidate', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['ADHD'],
    sports: ['All']
  },
  { 
    name: 'Insulin', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['Diabetes'],
    sports: ['All']
  },
  { 
    name: 'Clonazepam', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['Epilepsy'],
    sports: ['All']
  },
  { 
    name: 'Amlodipine', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['Hypertension'],
    sports: ['All']
  },
  { 
    name: 'Fluoxetine', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['Depression'],
    sports: ['All']
  },
  { 
    name: 'Lorazepam', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['Anxiety'],
    sports: ['All']
  },
  { 
    name: 'Levothyroxine', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['Hypothyroidism'],
    sports: ['All']
  },
  { 
    name: 'Morphine', 
    prohibited: true, 
    tueRequired: true, 
    conditions: ['Chronic Pain'],
    sports: ['All']
  },
  { 
    name: 'Prednisone', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['Arthritis', 'Asthma'],
    sports: ['All']
  },
  { 
    name: 'Erythropoietin', 
    prohibited: true, 
    tueRequired: true, 
    conditions: ['Anemia'],
    sports: ['All']
  },
  { 
    name: 'Sumatriptan', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['Migraines'],
    sports: ['All']
  },
  { 
    name: 'Diphenhydramine', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['Allergies'],
    sports: ['All']
  },
  { 
    name: 'Modafinil', 
    prohibited: true, 
    tueRequired: true, 
    conditions: ['Sleep Disorders'],
    sports: ['All']
  },
  { 
    name: 'Orlistat', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['Obesity'],
    sports: ['All']
  },
  { 
    name: 'Modafinil', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['Chronic Fatigue'],
    sports: ['All']
  },
  { 
    name: 'Alendronate', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['Osteoporosis'],
    sports: ['All']
  },
  { 
    name: 'Azathioprine', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['Inflammatory Bowel Disease'],
    sports: ['All']
  },
  { 
    name: 'Lithium', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['Bipolar Disorder'],
    sports: ['All']
  },
  { 
    name: 'Adalimumab', 
    prohibited: false, 
    tueRequired: true, 
    conditions: ['Psoriasis'],
    sports: ['All']
  }
];


const TUEAssistant = () => {
    const navigation = useNavigation(); // Add navigation hook
    const [activeTab, setActiveTab] = useState('guidance');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCondition, setSelectedCondition] = useState(null);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);


  // Guidance Section
  const renderGuidanceSection = () => (
    <ScrollView 
      style={[styles.sectionContainer, styles.scrollViewContainer]}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>What is a Therapeutic Use Exemption (TUE)?</Text>
        <Text style={styles.sectionText}>
          A Therapeutic Use Exemption (TUE) is an official document that allows an athlete with a medical condition to use an otherwise prohibited substance or method in sport.
        </Text>
      </View>
    
      
      <View style={styles.card}>
      <Text style={styles.sectionTitle}>TUE Criteria</Text>
      <View style={styles.bulletPointContainer}>
        <Text style={styles.bulletPoint}>• Medical Necessity: The substance must be essential for treating a diagnosed medical condition</Text>
        <Text style={styles.bulletPoint}>• No Performance Enhancement: Using the medication must not create a competitive advantage</Text>
        <Text style={styles.bulletPoint}>• No Alternative Treatment: There must be no reasonable alternative treatment available</Text>
        <Text style={styles.bulletPoint}>• Significant Impairment: The athlete would experience significant health impairment without the medication</Text>
      </View>
    </View>
  
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>TUE Application Process</Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>1. Obtain Complete Medical Documentation</Text>
          <Text style={styles.subBulletPoint}>- Comprehensive medical history</Text>
          <Text style={styles.subBulletPoint}>- Detailed diagnosis</Text>
          <Text style={styles.subBulletPoint}>- Laboratory test results</Text>
          
          <Text style={styles.bulletPoint}>2. Complete Official TUE Application Form</Text>
          <Text style={styles.subBulletPoint}>- Provide all required medical information</Text>
          <Text style={styles.subBulletPoint}>- Include physician's professional assessment</Text>
          
          <Text style={styles.bulletPoint}>3. Submit to Sporting Organization</Text>
          <Text style={styles.subBulletPoint}>- Submit well in advance of competition</Text>
          <Text style={styles.subBulletPoint}>- Keep copies of all documentation</Text>
        </View>
      </View>
  
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Common Conditions Requiring TUE</Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>• Asthma and Respiratory Conditions</Text>
          <Text style={styles.bulletPoint}>• ADHD and Attention Disorders</Text>
          <Text style={styles.bulletPoint}>• Diabetes</Text>
          <Text style={styles.bulletPoint}>• Hormonal Treatments</Text>
          <Text style={styles.bulletPoint}>• Cardiovascular Medications</Text>
        </View>
      </View>
  
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Important Reminders</Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.warningBulletPoint}>⚠️ Never compete with a prohibited substance without a valid TUE</Text>
          <Text style={styles.warningBulletPoint}>⚠️ TUEs are time-limited and require periodic renewal</Text>
          <Text style={styles.warningBulletPoint}>⚠️ Different sporting bodies may have slightly different TUE requirements</Text>
        </View>
      </View>
    </ScrollView>
  );

  // Tabs Component
  const TabBar = () => (
    <View style={styles.tabContainer}>
      {[
        { label: 'Guidance', value: 'guidance' },
        { label: 'Conditions', value: 'conditions' },
        { label: 'Medications', value: 'medications' },
        { label: 'Apply', value: 'apply' },
        { label: 'Alerts', value: 'alerts' }
      ].map((tab) => (
        <TouchableOpacity 
          key={tab.value}
          style={[
            styles.tabItem, 
            activeTab === tab.value && styles.activeTabItem
          ]}
          onPress={() => setActiveTab(tab.value)}
        >
          <Text style={[
            styles.tabText, 
            activeTab === tab.value && styles.activeTabText
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Medical Condition Checker
  const renderConditionChecker = () => (
    <View style={styles.sectionContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search medical conditions"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      {Object.entries(MEDICAL_CONDITIONS)
        .filter(([name]) => 
          name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(([name, details]) => (
          <TouchableOpacity 
            key={name}
            onPress={() => setSelectedCondition({name, ...details})}
            style={styles.listItem}
          >
            <Text style={styles.listItemText}>{name}</Text>
            <Text style={styles.chevron}></Text>
          </TouchableOpacity>
        ))}
      
      <Modal 
        visible={!!selectedCondition}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedCondition(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedCondition?.name}</Text>
            <Text style={styles.modalText}>{selectedCondition?.description}</Text>
            <Text style={styles.modalText}>
              TUE Required: {selectedCondition?.requiresTUE ? 'Yes' : 'No'}
            </Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setSelectedCondition(null)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  // Medication Database
  const renderMedicationDatabase = () => (
    <View style={styles.sectionContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search medications"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      {MEDICATION_DATABASE
        .filter(med => 
          med.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(medication => (
          <TouchableOpacity 
            key={medication.name}
            onPress={() => setSelectedMedication(medication)}
            style={styles.listItem}
          >
            <Text style={styles.listItemText}>{medication.name}</Text>
            <Text style={styles.chevron}></Text>
          </TouchableOpacity>
        ))}
      
      <Modal 
        visible={!!selectedMedication}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedMedication(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedMedication?.name}</Text>
            <Text style={styles.modalText}>
              Prohibited: {selectedMedication?.prohibited ? 'Yes' : 'No'}
            </Text>
            <Text style={styles.modalText}>
              TUE Required: {selectedMedication?.tueRequired ? 'Yes' : 'No'}
            </Text>
            <Text style={styles.modalText}>
              Applicable Conditions: {selectedMedication?.conditions.join(', ')}
            </Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setSelectedMedication(null)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  // Notification System
  const renderNotifications = () => (
    <View style={styles.sectionContainer}>
      <TouchableOpacity 
        style={styles.notificationButton}
        onPress={() => setIsNotificationModalVisible(true)}
      >
        <Text style={styles.notificationButtonText}>Set Up TUE Notifications</Text>
      </TouchableOpacity>
      
      <Modal
        visible={isNotificationModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsNotificationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Notification Setup</Text>
            <Text style={styles.modalText}>Configure alerts for:</Text>
            <View>
              <TouchableOpacity style={styles.modalListItem}>
                <Text>TUE Application Deadlines</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalListItem}>
                <Text>Prohibited Substance Updates</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalListItem}>
                <Text>TUE Renewal Reminders</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setIsNotificationModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  // Application Assistant
  const renderApplicationAssistant = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>TUE Application Guide</Text>
        <Text style={styles.sectionText}>Step 1: Gather Medical Documentation</Text>
        <Text style={styles.sectionText}>Step 2: Complete TUE Application Form</Text>
        <Text style={styles.sectionText}>Step 3: Submit to Sporting Organization</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* New Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={styles.backButtonIcon.color} />
          <Text style={styles.backButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
      
      <TabBar />
      {activeTab === 'guidance' && renderGuidanceSection()}
      {activeTab === 'conditions' && renderConditionChecker()}
      {activeTab === 'medications' && renderMedicationDatabase()}
      {activeTab === 'apply' && renderApplicationAssistant()}
      {activeTab === 'alerts' && renderNotifications()}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212', // Dark background
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    headerContainer: {
      backgroundColor: '#1E1E1E', // Slightly lighter dark color for header
      paddingVertical: 10,
      paddingHorizontal: 15
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 100
    },
    scrollViewContainer: {
        paddingVertical: 20, // Extra vertical space
        minHeight: '120%' // Force scrolling
      },
      scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 100 // Extra padding at bottom for scrolling
      },
    backButtonText: {
      color: '#2ECC71', // Bright green color
      marginLeft: 10,
      fontWeight: 'bold'
    },
    backButtonIcon: {
      color: '#2ECC71' // Match back button icon color
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#1E1E1E', // Dark background
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#2ECC71' // Green accent
    },
    tabItem: {
      paddingVertical: 8,
      paddingHorizontal: 12
    },
    activeTabItem: {
      borderBottomWidth: 2,
      borderBottomColor: '#2ECC71' // Green accent
    },
    tabText: {
      color: '#BDBDBD' // Light grey for inactive tabs
    },
    activeTabText: {
      color: '#2ECC71', // Bright green for active tab
      fontWeight: 'bold'
    },
    sectionContainer: {
      padding: 16
    },
    sectionContainer: {
        flex: 1, // Ensure the container can expand
        backgroundColor: '#121212' // Dark background
      },
      card: {
        backgroundColor: '#1E1E1E', // Dark card background
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        marginHorizontal: 16, // Add horizontal margin
        shadowColor: '#2ECC71', // Green shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#2ECC71' // Green border
      },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#2ECC71' // Green title color
    },
    sectionText: {
      fontSize: 14,
      color: '#BDBDBD', // Light grey text
      marginBottom: 4
    },
    searchInput: {
      borderWidth: 1,
      borderColor: '#2ECC71', // Green border
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      backgroundColor: '#1E1E1E', // Dark input background
      color: '#BDBDBD' // Light grey text
    },
    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#1E1E1E', // Dark list item background
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#2ECC71' // Green bottom border
    },
    listItemText: {
      fontSize: 16,
      color: '#BDBDBD' // Light grey text
    },
    chevron: {
      color: '#2ECC71', // Green chevron
      fontSize: 16
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.7)' // Darker overlay
    },
    modalContainer: {
      width: '80%',
      backgroundColor: '#1E1E1E', // Dark modal background
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#2ECC71' // Green border
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      color: '#2ECC71' // Green title
    },
    modalText: {
      marginBottom: 10,
      textAlign: 'center',
      color: '#BDBDBD' // Light grey text
    },
    modalListItem: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#2ECC71', // Green bottom border
      width: '100%',
      alignItems: 'center'
    },
    modalListItemText: {
      color: '#BDBDBD' // Light grey text
    },
    modalCloseButton: {
      marginTop: 15,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#2ECC71', // Green button
      borderRadius: 5
    },
    modalCloseText: {
      color: '#121212', // Dark text on green button
      fontWeight: 'bold'
    },
    notificationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      backgroundColor: '#2ECC71', // Green button
      borderRadius: 10
    },
    notificationButtonText: {
      color: '#121212', // Dark text on green button
      fontWeight: 'bold'
    },
    bulletPointContainer: {
        paddingLeft: 10,
      },
      bulletPoint: {
        color: '#BDBDBD',
        marginBottom: 8,
        fontSize: 14,
        fontWeight: 'bold'
      },
      subBulletPoint: {
        color: '#BDBDBD',
        marginBottom: 4,
        fontSize: 12,
        paddingLeft: 15
      },
      warningBulletPoint: {
        color: '#FFC107', // Amber warning color
        marginBottom: 8,
        fontSize: 14,
        fontWeight: 'bold'
      }
  });

export default TUEAssistant;