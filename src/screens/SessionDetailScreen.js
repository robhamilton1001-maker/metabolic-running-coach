import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/UI/Card';
import { IconSymbol } from '../components/UI/IconSymbol';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function SessionDetailScreen({ navigation, route }) {
  // 1. Get Identifiers passed from previous screens
  const { workoutTitle = "Run", targetDuration = "Open", weekId, dayId } = route.params || {};
  const { program, markSessionComplete } = useUser();

  // 2. LOOK UP the specific session in Global State
  // This ensures we see the current status/image immediately upon loading
  const weekData = program.find(w => w.weekId === weekId);
  const sessionData = weekData?.days.find(d => d.id === dayId);

  // 3. Derive State from Global Data
  const isComplete = sessionData?.status === 'Complete';
  const savedImage = sessionData?.proofImage;

  // Local state for NEW image selection (before saving)
  const [selectedImage, setSelectedImage] = useState(null);

  // The image to display: New selection OR Saved image
  const displayImage = selectedImage || savedImage;

  const handleComplete = () => {
    if (!weekId || !dayId) {
      Alert.alert("Preview Mode", "This is a preview. Start the plan to track progress.");
      return;
    }

    // Save to Context (Progress + Image)
    markSessionComplete(weekId, dayId, displayImage);
    
    Alert.alert("Session Complete", "Great work! Progress saved.", [
      { text: "OK", onPress: () => navigation.goBack() }
    ]);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Visual State for Button
  const buttonStyle = isComplete ? styles.disabledButton : styles.completeButton;
  const buttonText = isComplete ? "COMPLETED" : "MARK AS COMPLETE";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <IconSymbol name="chevron.down" size={28} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SESSION BRIEF</Text>
        <View style={{width: 28}}/> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <View style={styles.cardRow}>
            <View>
               <Text style={styles.label}>WORKOUT</Text>
               <Text style={styles.title}>{workoutTitle}</Text>
            </View>
            {/* Visual Checkmark if Complete */}
            {isComplete && <IconSymbol name="checkmark.circle.fill" size={32} color={Colors.success} />}
          </View>
          
          <View style={styles.row}>
            <IconSymbol name="stopwatch" size={20} color={Colors.textSecondary} />
            <Text style={styles.detail}>{targetDuration}</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.label}>COACH'S NOTES</Text>
          <Text style={styles.notes}>
            Focus on keeping your heart rate steady. This session is about building aerobic capacity, not speed.
            {"\n\n"}
            If you exceed Zone 2, walk until you recover.
          </Text>
        </Card>

        {/* Upload Section */}
        <TouchableOpacity style={styles.uploadRow} onPress={pickImage}>
           <IconSymbol name="arrow.clockwise" size={20} color={Colors.primary} />
           <Text style={styles.uploadText}>
             {displayImage ? "Change Photo" : "Upload Workout Photo (Optional)"}
           </Text>
        </TouchableOpacity>

        {displayImage && (
           <Image source={{ uri: displayImage }} style={styles.previewImage} />
        )}

        {/* Action Button - Changes color if complete */}
        <TouchableOpacity 
          style={buttonStyle} 
          onPress={handleComplete}
          disabled={isComplete && !selectedImage} // Disable if complete (unless updating photo)
        >
          <Text style={styles.completeButtonText}>{buttonText}</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { color: Colors.textPrimary, fontWeight: 'bold', letterSpacing: 1 },
  content: { padding: 20, paddingBottom: 60 },
  
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  label: { color: Colors.primary, fontSize: 12, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  title: { color: Colors.textPrimary, fontSize: 32, fontWeight: '800', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detail: { color: Colors.textSecondary, fontSize: 18 },
  notes: { color: Colors.textSecondary, fontSize: 16, lineHeight: 24 },
  
  uploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  uploadText: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
  previewImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 20 },
  
  // Button Variations
  completeButton: {
    backgroundColor: Colors.primary, // Default Cyan
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  disabledButton: {
    backgroundColor: Colors.surfaceLight, // Greyed out
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: Colors.success, // Green Border
  },
  completeButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
});