import DateTimePicker from '@react-native-community/datetimepicker'; // NEW IMPORT
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function OnboardingScreen({ navigation }) {
  const { user, updateUser } = useUser();

  // Local state
  const [username, setUsername] = useState(user.username || '');
  const [units, setUnits] = useState(user.preferred_unit);
  const [vo2, setVo2] = useState(user.vo2_max.toString());
  const [hrMax, setHrMax] = useState(user.hr_max.toString());
  const [lt1, setLt1] = useState(user.lt1_hr.toString());
  const [lt2, setLt2] = useState(user.lt2_hr.toString());
  const [days, setDays] = useState(user.availability_days);
  const [duration, setDuration] = useState(user.plan_duration_weeks);
  
  // Date State
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleComplete = () => {
    updateUser({
      username,
      preferred_unit: units,
      vo2_max: parseFloat(vo2) || 0,
      hr_max: parseFloat(hrMax) || 0,
      lt1_hr: parseFloat(lt1) || 0,
      lt2_hr: parseFloat(lt2) || 0,
      availability_days: days,
      plan_duration_weeks: duration,
      start_date: date.toISOString(), // Save date string
    });

    navigation.replace('Dashboard');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Phase 1: Setup</Text>
        <Text style={styles.subtitle}>Let's calibrate your metabolic profile.</Text>

        {/* Profile & Start Date */}
        <View style={styles.section}>
          <Text style={styles.label}>Profile</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="RunnerName"
              placeholderTextColor={Colors.textDim}
              autoCapitalize="none"
            />
          </View>

          <Text style={[styles.inputLabel, { marginTop: 12 }]}>Plan Start Date</Text>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>{date.toDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>

        {/* Physiology Inputs */}
        <View style={styles.section}>
          <Text style={styles.label}>Physiology</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>VO2 Max</Text>
              <TextInput
                style={styles.input}
                value={vo2}
                onChangeText={setVo2}
                keyboardType="numeric"
                placeholder="54"
                placeholderTextColor={Colors.textDim}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>HR Max</Text>
              <TextInput
                style={styles.input}
                value={hrMax}
                onChangeText={setHrMax}
                keyboardType="numeric"
                placeholder="190"
                placeholderTextColor={Colors.textDim}
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Aerobic (LT1)</Text>
              <TextInput
                style={styles.input}
                value={lt1}
                onChangeText={setLt1}
                keyboardType="numeric"
                placeholder="145"
                placeholderTextColor={Colors.textDim}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Threshold (LT2)</Text>
              <TextInput
                style={styles.input}
                value={lt2}
                onChangeText={setLt2}
                keyboardType="numeric"
                placeholder="170"
                placeholderTextColor={Colors.textDim}
              />
            </View>
          </View>
        </View>

        {/* Training Availability */}
        <View style={styles.section}>
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
        </View>

        {/* Plan Duration */}
        <View style={styles.section}>
          <Text style={styles.label}>Macrocycle Duration</Text>
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

        {/* Unit Toggle */}
        <View style={styles.section}>
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

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleComplete}>
          <Text style={styles.submitButtonText}>Complete Setup</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
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
  textActive: {
    color: Colors.primary,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 16,
    fontWeight: 'bold',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 50,
    height: 50,
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
    color: Colors.textSecondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // New Date Button Styles
  dateButton: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  dateButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});