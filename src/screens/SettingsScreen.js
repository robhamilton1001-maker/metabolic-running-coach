import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../components/UI/IconSymbol';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function SettingsScreen({ navigation }) {
  const { user, updateUser } = useUser();
  
  // Local state initialized with global user data
  const [vo2, setVo2] = useState(user.vo2_max.toString());
  const [hrMax, setHrMax] = useState(user.hr_max.toString());
  const [units, setUnits] = useState(user.preferred_unit);

  const handleSave = () => {
    updateUser({
      vo2_max: parseFloat(vo2) || 0,
      hr_max: parseFloat(hrMax) || 0,
      preferred_unit: units,
    });
    Alert.alert("Success", "Profile updated successfully.");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Unit Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Use Metric (km)</Text>
            <Switch 
              value={units === 'metric'} 
              onValueChange={(val) => setUnits(val ? 'metric' : 'imperial')}
              trackColor={{ false: Colors.surfaceLight, true: Colors.primary }}
              thumbColor={'#fff'}
            />
          </View>
        </View>

        {/* Physiology Inputs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physiology</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>VO2 Max</Text>
            <TextInput 
              style={styles.input} 
              value={vo2} 
              onChangeText={setVo2} 
              keyboardType="numeric" 
              placeholderTextColor={Colors.textDim}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Max Heart Rate</Text>
            <TextInput 
              style={styles.input} 
              value={hrMax} 
              onChangeText={setHrMax} 
              keyboardType="numeric" 
              placeholderTextColor={Colors.textDim}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surfaceLight,
    color: Colors.textPrimary,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});