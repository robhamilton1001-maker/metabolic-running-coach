import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/UI/Card';
import { IconSymbol } from '../components/UI/IconSymbol';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

const DISTANCES = ["5k", "10k", "15k", "Half", "Full"];

export default function StatisticsScreen({ navigation }) {
  const { user, updateUser } = useUser();
  const [selectedDist, setSelectedDist] = useState("5k");
  
  // Local state for the inputs (editing the specific distance)
  // We use the existing values from context or empty strings
  const [preTime, setPreTime] = useState(user.pb_times[selectedDist]?.pre || "");
  const [postTime, setPostTime] = useState(user.pb_times[selectedDist]?.post || "");

  // When switching tabs, save current input to temp state or just reset form?
  // For simplicity, we reset the form to show the saved values of the NEW tab
  const handleTabChange = (dist) => {
    setSelectedDist(dist);
    setPreTime(user.pb_times[dist]?.pre || "");
    setPostTime(user.pb_times[dist]?.post || "");
  };

  const handleSave = () => {
    // Deep update of the nested pb_times object
    const updatedPBs = {
      ...user.pb_times,
      [selectedDist]: {
        pre: preTime,
        post: postTime
      }
    };

    updateUser({ pb_times: updatedPBs });
    Alert.alert("Saved", `${selectedDist} benchmarks updated.`);
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
        <Text style={styles.headerTitle}>Benchmarks</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Distance Selector (Chips) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {DISTANCES.map((dist) => (
            <TouchableOpacity 
              key={dist} 
              style={[styles.chip, selectedDist === dist && styles.chipActive]}
              onPress={() => handleTabChange(dist)}
            >
              <Text style={[styles.chipText, selectedDist === dist && styles.chipTextActive]}>
                {dist}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input Card */}
        <Card style={styles.inputCard}>
          <Text style={styles.cardTitle}>{selectedDist.toUpperCase()} PERFORMANCE</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pre-Plan PB</Text>
              <TextInput 
                style={styles.input}
                value={preTime}
                onChangeText={setPreTime}
                placeholder="00:00:00"
                placeholderTextColor={Colors.textDim}
                keyboardType="numbers-and-punctuation"
              />
            </View>

            <View style={styles.arrowContainer}>
              <IconSymbol name="chevron.right" size={20} color={Colors.textDim} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current PB</Text>
              <TextInput 
                style={styles.input}
                value={postTime}
                onChangeText={setPostTime}
                placeholder="--:--:--"
                placeholderTextColor={Colors.textDim}
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>

          {/* Simple Delta Indicator */}
          {preTime && postTime && (
            <View style={styles.deltaContainer}>
              <Text style={styles.deltaText}>Tracking Improvement</Text>
            </View>
          )}
        </Card>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Update Benchmark</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 20,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
  },
  chipScroll: {
    marginBottom: 20,
    flexGrow: 0,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 10,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: Colors.background,
    fontWeight: 'bold',
  },
  inputCard: {
    padding: 24,
  },
  cardTitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 20,
    letterSpacing: 1,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputGroup: {
    flex: 1,
  },
  arrowContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  label: {
    color: Colors.textDim,
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: Colors.surfaceLight,
    color: Colors.textPrimary,
    padding: 16,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deltaContainer: {
    marginTop: 20,
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(0, 224, 255, 0.1)',
    borderRadius: 8,
  },
  deltaText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  }
});