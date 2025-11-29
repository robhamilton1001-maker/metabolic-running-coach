import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../components/UI/IconSymbol';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function SettingsScreen({ navigation }) {
  const { user, updateUser } = useUser();
  
  // Local state initialized with global user data
  const [username, setUsername] = useState(user.username);
  const [vo2, setVo2] = useState(user.vo2_max.toString());
  const [hrMax, setHrMax] = useState(user.hr_max.toString());
  const [lt1, setLt1] = useState(user.lt1_hr.toString());
  const [lt2, setLt2] = useState(user.lt2_hr.toString());
  const [days, setDays] = useState(user.availability_days);
  const [duration, setDuration] = useState(user.plan_duration_weeks);
  const [units, setUnits] = useState(user.preferred_unit);

  const handleSave = () => {
    updateUser({
      username,
      vo2_max: parseFloat(vo2) || 0,
      hr_max: parseFloat(hrMax) || 0,
      lt1_hr: parseFloat(lt1) || 0,
      lt2_hr: parseFloat(lt2) || 0,
      availability_days: days,
      plan_duration_weeks: duration,
      preferred_unit: units,
    });
    Alert.alert("Success", "Profile updated successfully.");
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput 
              style={styles.input} 
              value={username} 
              onChangeText={setUsername} 
              placeholderTextColor={Colors.textDim}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Physiology Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physiology</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>VO2 Max</Text>
              <TextInput 
                style={styles.input} 
                value={vo2} 
                onChangeText={setVo2} 
                keyboardType="numeric" 
                placeholderTextColor={Colors.textDim}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>HR Max</Text>
              <TextInput 
                style={styles.input} 
                value={hrMax} 
                onChangeText={setHrMax} 
                keyboardType="numeric" 
                placeholderTextColor={Colors.textDim}
              />
            </View>
          </View>

          <View style={styles.row}>
             <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Aerobic (LT1)</Text>
              <TextInput 
                style={styles.input} 
                value={lt1} 
                onChangeText={setLt1} 
                keyboardType="numeric" 
                placeholderTextColor={Colors.textDim}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Threshold (LT2)</Text>
              <TextInput 
                style={styles.input} 
                value={lt2} 
                onChangeText={setLt2} 
                keyboardType="numeric" 
                placeholderTextColor={Colors.textDim}
              />
            </View>
          </View>
        </View>

        {/* Plan Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plan Configuration</Text>
          
          <Text style={styles.label}>Training Days / Week</Text>
          <View style={styles.daysContainer}>
            {[3, 4, 5, 6, 7].map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.dayButton, days === d && styles.dayButtonActive]}
                onPress={() => setDays(d)}
              >
                <Text style={[styles.dayText, days === d && styles.textActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>Macrocycle Duration</Text>
          <View style={styles.toggleContainer}>
            {[6, 12].map((w) => (
              <TouchableOpacity
                key={w}
                style={[styles.toggleButton, duration === w && styles.toggleActive]}
                onPress={() => setDuration(w)}
              >
                <Text style={[styles.toggleText, duration === w && styles.textActive]}>
                  {w} Weeks
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preferences (New Segmented Button) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Text style={styles.label}>Preferred Units</Text>
          <View style={styles.toggleContainer}>
            {['metric', 'imperial'].map((u) => (
              <TouchableOpacity
                key={u}
                style={[styles.toggleButton, units === u && styles.toggleActive]}
                onPress={() => setUnits(u)}
              >
                <Text style={[styles.toggleText, units === u && styles.textActive]}>
                  {u === 'metric' ? 'Kilometers (km)' : 'Miles (mi)'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60, // FIXED: Increased top padding for notch
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100, // Ensure bottom content scrolls into view
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceLight,
  },
  dayText: {
    color: Colors.textDim,
    fontWeight: 'bold',
  },
  textActive: {
    color: Colors.primary,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleActive: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  toggleText: {
    color: Colors.textDim,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});