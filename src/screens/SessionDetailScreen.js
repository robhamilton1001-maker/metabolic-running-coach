// NEW: Added React and useState import
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
// NEW: Added TextInput, KeyboardAvoidingView, and Platform to imports
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function SessionDetailScreen({ route, navigation }) {
  const { dayData } = route.params || {};
  // NEW: Added saveSessionNote to your destructured Context
  const { mappedPlan, markSessionComplete, toggleSessionComplete, saveSessionNote } = useUser();

  if (!dayData) return null;

  // THE FIX: We search the live mappedPlan using the dayNumber. 
  // This guarantees we find the live status regardless of which screen you navigated from.
  const liveDayData = mappedPlan 
    ? Object.values(mappedPlan).find(day => day.dayNumber === dayData.dayNumber) 
    : null;

  const currentDayData = liveDayData || dayData;
  const isComplete = currentDayData.status === 'Complete';

  // NEW: Added local state to hold the text the athlete types
  const [sessionNote, setSessionNote] = useState(currentDayData.sessionNote || "");

  const targetZone = currentDayData.category;
  const instruction = currentDayData.sessionText;

  const handleLogActivity = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        markSessionComplete(currentDayData.dateStr, result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleToggle = () => {
    if (currentDayData.dateStr) {
      toggleSessionComplete(currentDayData.dateStr);
    }
  };

  // NEW: Added save handler for the note
  const handleSaveNote = () => {
    if (saveSessionNote && currentDayData.dateStr) {
      saveSessionNote(currentDayData.dateStr, sessionNote);
      alert("Note saved successfully!");
    } else {
      console.log("Please add a saveSessionNote function to your UserContext to permanently save this text.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* NEW: Wrapped in KeyboardAvoidingView so the keyboard doesn't cover the text box */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialIcons name="close" size={28} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Day {currentDayData.dayNumber}</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.phaseBadge}>{String(currentDayData.phase).toUpperCase()}</Text>
            <Text style={styles.dayOfWeek}>{currentDayData.dayOfWeek}</Text>
            <View style={styles.zoneContainer}>
              <Text style={styles.zoneText(currentDayData.category)}>{targetZone}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.instructionCard}>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>

          {currentDayData.category !== 'Rest' && (
            <>
              {/* The Interactive Checkbox */}
              <TouchableOpacity 
                style={[styles.checkboxContainer, isComplete && styles.checkboxContainerActive]} 
                onPress={handleToggle}
              >
                <MaterialIcons 
                  name={isComplete ? "check-box" : "check-box-outline-blank"} 
                  size={28} 
                  color={isComplete ? "#4CAF50" : Colors.textSecondary} 
                />
                <Text style={[styles.checkboxText, isComplete && styles.checkboxTextActive]}>
                  {isComplete ? "Session Completed" : "Mark as Complete"}
                </Text>
              </TouchableOpacity>

              {/* Optional Photo Proof & Notes - Only appears AFTER checking the box */}
              {isComplete && (
                <View style={styles.proofContainer}>
                  
                  {/* --- NEW: SESSION NOTES UI --- */}
                  <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Session Notes</Text>
                  <TextInput
                    style={styles.notesInput}
                    placeholder="e.g. HR drifted over 160bpm on the 4th interval. Felt heavy."
                    placeholderTextColor={Colors.textSecondary}
                    multiline={true}
                    numberOfLines={4}
                    value={sessionNote}
                    onChangeText={setSessionNote}
                  />
                  <TouchableOpacity style={styles.saveNoteButton} onPress={handleSaveNote}>
                    <Text style={styles.saveNoteButtonText}>Save Note</Text>
                  </TouchableOpacity>
                  {/* --- END NEW SESSION NOTES UI --- */}

                  {currentDayData.proofImage ? (
                    <Image source={{ uri: currentDayData.proofImage }} style={styles.proofImage} />
                  ) : (
                    <TouchableOpacity style={styles.logButton} onPress={handleLogActivity}>
                      <MaterialIcons name="add-a-photo" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
                      <Text style={styles.logButtonText}>Upload Garmin/Strava Screenshot</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, marginTop: 10 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textSecondary },
  heroCard: { alignItems: 'center', marginBottom: 40 },
  phaseBadge: { color: Colors.textSecondary, fontSize: 14, fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  dayOfWeek: { fontSize: 32, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 16 },
  zoneContainer: { backgroundColor: Colors.surface, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, maxWidth: '100%' },
  zoneText: (category) => ({ fontSize: 18, fontWeight: 'bold', color: category === 'Rest' ? '#4CAF50' : Colors.primary, textAlign: 'center', flexShrink: 1 }),
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary, marginBottom: 12 },
  instructionCard: { 
    backgroundColor: Colors.surface, 
    padding: 24, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: Colors.border, 
    marginBottom: 32,
    width: '100%', // <-- 1. Forces the card to never exceed the screen width
  },
  instructionText: { 
    fontSize: 22, 
    color: Colors.textPrimary, 
    lineHeight: 32, 
    fontWeight: '500',
    flexShrink: 1, // <-- 2. Forces the text to wrap downward instead of pushing sideways
  },
  
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 20 },
  checkboxContainerActive: { borderColor: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.05)' },
  checkboxText: { color: Colors.textSecondary, fontSize: 18, fontWeight: '600', marginLeft: 12 },
  checkboxTextActive: { color: '#4CAF50' },
  
  proofContainer: { marginTop: 8 },
  logButton: { flexDirection: 'row', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.primary, borderStyle: 'dashed' },
  logButtonText: { color: Colors.primary, fontSize: 15, fontWeight: 'bold' },
  proofImage: { width: '100%', height: 220, borderRadius: 16, resizeMode: 'cover', borderWidth: 1, borderColor: Colors.border },

  // NEW: Added styles for the notes section
  notesInput: { backgroundColor: Colors.surface, color: Colors.textPrimary, borderRadius: 12, padding: 16, minHeight: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: Colors.border, fontSize: 16, marginBottom: 12 },
  saveNoteButton: { backgroundColor: Colors.primary, padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 32 },
  saveNoteButtonText: { color: '#000', fontSize: 15, fontWeight: 'bold' }
});