import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function DashboardScreen({ navigation }) {
  const { mappedPlan, athleteMetadata, markSessionComplete } = useUser();
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [todayDateStr, setTodayDateStr] = useState('');

  useEffect(() => {
    // If no plan is loaded, kick them back to Onboarding
    if (!mappedPlan) {
      navigation.replace('Onboarding');
      return;
    }

    // Get today's date in YYYY-MM-DD format based on the device's local time
    const today = new Date();
    // For testing purposes, you can hardcode a date here that you know is in your plan!
    // const todayStr = "2026-05-11"; 
    const todayStr = today.toISOString().split('T')[0];
    
    setTodayDateStr(todayStr);
    setTodayWorkout(mappedPlan[todayStr]);
  }, [mappedPlan]);

  if (!mappedPlan) return null; // Prevent flash before redirect

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {athleteMetadata?.athleteName?.split(' ')[0] || "Athlete"}</Text>
            <Text style={styles.dateText}>{new Date(todayDateStr).toDateString()}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <MaterialIcons name="settings" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Today's Workout Card */}
        <Text style={styles.sectionTitle}>Today's Session</Text>
        
        {todayWorkout ? (
          <View style={styles.workoutCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.phaseBadge}>{todayWorkout.phase.toUpperCase()}</Text>
              <Text style={styles.categoryBadge(todayWorkout.category)}>
                {todayWorkout.category.toUpperCase()}
              </Text>
            </View>
            
            <Text style={styles.sessionText}>
              {todayWorkout.sessionText}
            </Text>

            {/* Status & Action */}
            <View style={styles.actionContainer}>
              <Text style={styles.statusText(todayWorkout.status)}>
                Status: {todayWorkout.status}
              </Text>
              
              {todayWorkout.status === 'Pending' && todayWorkout.category !== 'Rest' && (
                <TouchableOpacity 
                  style={styles.completeButton}
                  onPress={() => markSessionComplete(todayDateStr, null)}
                >
                  <Text style={styles.completeButtonText}>Mark Complete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <MaterialIcons name="event-available" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyCardTitle}>No Session Scheduled</Text>
            <Text style={styles.emptyCardText}>
              Today's date ({todayDateStr}) falls outside of your loaded 16-week Peak Oxygen plan.
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  dateText: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  workoutCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  phaseBadge: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  categoryBadge: (category) => ({
    color: category === 'Rest' ? '#4CAF50' : Colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  }),
  sessionText: {
    fontSize: 24,
    fontWeight: '500',
    color: Colors.textPrimary,
    lineHeight: 34,
    marginBottom: 24,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  statusText: (status) => ({
    fontSize: 14,
    fontWeight: '600',
    color: status === 'Complete' ? '#4CAF50' : Colors.textSecondary,
  }),
  completeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completeButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCardText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  }
});