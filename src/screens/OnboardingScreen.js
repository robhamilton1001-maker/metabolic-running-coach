import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function OnboardingScreen({ navigation }) {
  // We bring in isRestoringData and mappedPlan to check if a plan is already saved
  const { importPlan, isRestoringData, mappedPlan } = useUser();
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- NEW AUTO-BOOT LOGIC ---
  useEffect(() => {
    // If the hard drive finished loading and found a plan, skip straight to Dashboard!
    if (!isRestoringData && mappedPlan) {
      navigation.replace('Dashboard');
    }
  }, [isRestoringData, mappedPlan]);

  // Check if the currently selected date is a Monday (0 = Sunday, 1 = Monday)
  const isMonday = startDate.getDay() === 1;

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(Platform.OS === 'ios'); 
    setStartDate(currentDate);
  };

  const handleFileUpload = async () => {
    if (!isMonday) {
      Alert.alert("Invalid Day", "Peak Oxygen plans must start on a Monday.");
      return;
    }

    try {
      setIsProcessing(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', '*/*'], 
        copyToCacheDirectory: true,
      });

      if (result.canceled || result.type === 'cancel') {
        setIsProcessing(false);
        return;
      }

      let fileUri = null;
      if (result.assets && result.assets.length > 0) {
        fileUri = result.assets[0].uri;
      } else if (result.uri) {
        fileUri = result.uri;
      }

      if (!fileUri) {
          throw new Error("Could not extract the file path from the device.");
      }

      let jsonData;
      try {
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        jsonData = JSON.parse(fileContent);
      } catch (fsError) {
        try {
          const response = await fetch(fileUri);
          jsonData = await response.json();
        } catch (fetchError) {
          throw new Error(`File read error: ${fsError.message || 'Unknown FS Error'}`);
        }
      }

      const dateKeyStr = startDate.toISOString().split('T')[0];

      importPlan(jsonData, dateKeyStr);

      setIsProcessing(false);
      navigation.replace('Dashboard');

    } catch (error) {
      setIsProcessing(false);
      Alert.alert("Import Error", String(error.message || error));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Peak Oxygen Analytics</Text>
        <Text style={styles.subtitle}>Import your clinical training plan to begin.</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Start Date (Must be a Monday)</Text>
          
          <TouchableOpacity 
            style={[styles.dateButton, !isMonday && styles.dateButtonError]} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {startDate.toDateString()}
            </Text>
          </TouchableOpacity>
          
          {!isMonday && (
              <Text style={styles.errorText}>Please select a Monday to continue.</Text>
          )}

          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
            />
          )}
        </View>

        <TouchableOpacity 
          style={[styles.button, (isProcessing || !isMonday) && styles.buttonDisabled]} 
          onPress={handleFileUpload}
          disabled={isProcessing || !isMonday}
        >
          <Text style={styles.buttonText}>
            {isProcessing ? "Processing..." : "Import .json Plan"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginBottom: 48, textAlign: 'center' },
  inputContainer: { marginBottom: 32 },
  label: { color: Colors.textPrimary, marginBottom: 8, fontSize: 14, fontWeight: '600' },
  dateButton: { backgroundColor: Colors.surface, borderColor: Colors.border, borderWidth: 1, borderRadius: 8, padding: 16, alignItems: 'center' },
  dateButtonError: { borderColor: '#ff5252' },
  dateButtonText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '500' },
  errorText: { color: '#ff5252', fontSize: 12, marginTop: 8, textAlign: 'center' },
  button: { backgroundColor: Colors.primary, padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});