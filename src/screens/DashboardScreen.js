import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

// Helper to format JS dates into dictionary keys (YYYY-MM-DD)
const toDateKey = (dateObj) => dateObj.toISOString().split('T')[0];

export default function DashboardScreen({ navigation }) {
  const { mappedPlan, athleteMetadata } = useUser();
  
  // Keep track of what date the user tapped on the carousel (defaults to today)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedKey = toDateKey(selectedDate);
  const selectedWorkout = mappedPlan ? mappedPlan[selectedKey] : null;

  // Generate a 7-day strip centered around the selected date
  const generateDateStrip = () => {
    const strip = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + i);
      strip.push(d);
    }
    return strip;
  };

  const dateStrip = generateDateStrip();
  const todayKey = toDateKey(new Date());

  if (!mappedPlan) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {athleteMetadata?.athleteName?.split(' ')[0] || "Athlete"}</Text>
            <Text style={styles.subGreeting}>Here is your schedule.</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconButton}>
            <MaterialIcons name="settings" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Date Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselScroll}>
            {dateStrip.map((dateObj, index) => {
              const dKey = toDateKey(dateObj);
              const isSelected = dKey === selectedKey;
              const isToday = dKey === todayKey;
              const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNumber = dateObj.getDate();

              return (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.dateBox, isSelected && styles.dateBoxSelected]}
                  onPress={() => setSelectedDate(dateObj)}
                >
                  <Text style={[styles.dateBoxDay, isSelected && styles.dateBoxDaySelected]}>{dayOfWeek}</Text>
                  <Text style={[styles.dateBoxNum, isSelected && styles.dateBoxNumSelected]}>{dayNumber}</Text>
                  {isToday && <View style={styles.todayDot} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Workout Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedKey === todayKey ? "Today's Session" : selectedDate.toDateString()}
          </Text>
        </View>
        
        {selectedWorkout ? (
          <View style={styles.workoutCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.phaseBadge}>{String(selectedWorkout.phase).toUpperCase()}</Text>
              <Text style={styles.categoryBadge(selectedWorkout.category)}>
                {String(selectedWorkout.category).toUpperCase()}
              </Text>
            </View>
            
            <Text style={styles.sessionText}>
              {selectedWorkout.sessionText}
            </Text>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('SessionDetail', { dayData: selectedWorkout })}
            >
              <Text style={styles.actionButtonText}>View Full Session Details</Text>
              <MaterialIcons name="arrow-forward-ios" size={16} color="#000" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <MaterialIcons name="event-available" size={48} color={Colors.textSecondary} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyCardTitle}>No Session Scheduled</Text>
            <Text style={styles.emptyCardText}>
              This date falls outside of your loaded 16-week Peak Oxygen plan.
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 20, marginBottom: 24 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: Colors.textPrimary },
  subGreeting: { fontSize: 16, color: Colors.textSecondary, marginTop: 4 },
  iconButton: { padding: 4 },
  
  carouselContainer: { marginBottom: 32 },
  carouselScroll: { paddingHorizontal: 16 },
  dateBox: { width: 64, height: 80, justifyContent: 'center', alignItems: 'center', borderRadius: 16, backgroundColor: Colors.surface, marginHorizontal: 6, borderWidth: 1, borderColor: Colors.border },
  dateBoxSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dateBoxDay: { fontSize: 12, fontWeight: 'bold', color: Colors.textSecondary, marginBottom: 4, textTransform: 'uppercase' },
  dateBoxDaySelected: { color: '#000' },
  dateBoxNum: { fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary },
  dateBoxNumSelected: { color: '#000' },
  todayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary, position: 'absolute', bottom: 8 },
  
  sectionHeader: { paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: Colors.textPrimary },
  
  workoutCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 20, marginHorizontal: 20, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' },
  phaseBadge: { color: Colors.textSecondary, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  categoryBadge: (category) => ({ color: category === 'Rest' ? '#4CAF50' : Colors.primary, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 }),
  sessionText: { fontSize: 24, fontWeight: '500', color: Colors.textPrimary, lineHeight: 34, marginBottom: 24 },
  
  actionButton: { backgroundColor: Colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12, marginTop: 8 },
  actionButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16, marginRight: 8 },
  
  emptyCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 32, marginHorizontal: 20, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  emptyCardTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 8 },
  emptyCardText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 }
});