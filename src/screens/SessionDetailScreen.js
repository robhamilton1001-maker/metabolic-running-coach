import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/UI/Card';
import { IconSymbol } from '../components/UI/IconSymbol';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function SessionDetailScreen({ navigation, route }) {
  const { workoutTitle = "Run", targetDuration = "Open", weekId, dayId } = route.params || {};
  const { markSessionComplete } = useUser();
  const [image, setImage] = useState(null);

  // New Function: Handles completion logic separately from upload
  const handleComplete = () => {
    if (weekId && dayId) {
      // Mark complete (passing image if one was selected, otherwise null)
      markSessionComplete(weekId, dayId, image);
      
      Alert.alert("Session Complete", "Great work! Your progress has been saved.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert("Preview Mode", "Session marked complete.");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

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
            {/* Visual Checkmark if image is uploaded */}
            {image && <IconSymbol name="checkmark.circle.fill" size={32} color={Colors.success} />}
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

        {/* Optional Upload Section */}
        <TouchableOpacity style={styles.uploadRow} onPress={pickImage}>
           <IconSymbol name="arrow.clockwise" size={20} color={Colors.primary} />
           <Text style={styles.uploadText}>
             {image ? "Change Uploaded Photo" : "Upload Workout Photo (Optional)"}
           </Text>
        </TouchableOpacity>

        {image && (
           <Image source={{ uri: image }} style={styles.previewImage} />
        )}

        {/* Primary Action: Complete Button */}
        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>MARK AS COMPLETE</Text>
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
  
  // Upload Styles (Secondary)
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
  uploadText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  // Complete Button (Primary)
  completeButton: {
    backgroundColor: Colors.success, // Green for completion
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  completeButtonText: {
    color: '#000000', // Black text on green button
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
});