import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function SessionDetailScreen({ route, navigation }) {
  const { dayData } = route.params || {};
  const { mappedPlan, markSessionComplete, toggleSessionComplete } = useUser();

  if (!dayData) return null;

  // THE FIX: We search the live mappedPlan using the dayNumber. 
  // This guarantees we find the live status regardless of which screen you navigated from.
  const liveDayData = mappedPlan 
    ? Object.values(mappedPlan).find(day => day.dayNumber === dayData.dayNumber) 
    : null;

  const currentDayData = liveDayData || dayData;
  const isComplete = currentDayData.status === 'Complete';

  const sessionParts = String(currentDayData.sessionText).split(' | ');
  const targetZone = sessionParts.length > 1 ? sessionParts[0] : currentDayData.category;
  const instruction = sessionParts.length > 1 ? sessionParts.slice(1).join(' | ') : currentDayData.sessionText;

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

  return (
    <SafeAreaView style={styles.container}>
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

            {/* Optional Photo Proof - Only appears AFTER checking the box */}
            {isComplete && (
              <View style={styles.proofContainer}>
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
  zoneContainer: { backgroundColor: Colors.surface, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: Colors.border },
  zoneText: (category) => ({ fontSize: 18, fontWeight: 'bold', color: category === 'Rest' ? '#4CAF50' : Colors.primary }),
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary, marginBottom: 12 },
  instructionCard: { backgroundColor: Colors.surface, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 32 },
  instructionText: { fontSize: 22, color: Colors.textPrimary, lineHeight: 32, fontWeight: '500' },
  
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 20 },
  checkboxContainerActive: { borderColor: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.05)' },
  checkboxText: { color: Colors.textSecondary, fontSize: 18, fontWeight: '600', marginLeft: 12 },
  checkboxTextActive: { color: '#4CAF50' },
  
  proofContainer: { marginTop: 8 },
  logButton: { flexDirection: 'row', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.primary, borderStyle: 'dashed' },
  logButtonText: { color: Colors.primary, fontSize: 15, fontWeight: 'bold' },
  proofImage: { width: '100%', height: 220, borderRadius: 16, resizeMode: 'cover', borderWidth: 1, borderColor: Colors.border }
});