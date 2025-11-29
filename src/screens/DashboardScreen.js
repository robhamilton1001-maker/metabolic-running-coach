import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/UI/Card';
import { IconSymbol } from '../components/UI/IconSymbol';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';
import { getCurrentWeek } from '../data/dummyProgram'; // Import our new data source

export default function DashboardScreen({ navigation }) {
  // 1. Get User Data (Fix for the error)
  const { user } = useUser(); 

  // 2. Get the Active Week Data
  const activeWeek = getCurrentWeek();
  
  // 3. State to track which day is selected
  const [selectedDay, setSelectedDay] = useState(activeWeek.days[2]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>HOME</Text>
        <IconSymbol name="bell" size={24} color={Colors.textPrimary} />
      </View>

      {/* Weekly Calendar Strip (Keep as is) */}
      <View style={styles.calendarContainer}>
        <Text style={styles.sectionTitle}>WEEK {activeWeek.weekId} • {activeWeek.phase.toUpperCase()}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
          {activeWeek.days.map((day) => {
            const isSelected = selectedDay.id === day.id;
            const isComplete = day.status === 'Complete';
            
            return (
              <TouchableOpacity 
                key={day.id} 
                style={[
                  styles.dayCard, 
                  isSelected && styles.dayCardSelected,
                  isComplete && !isSelected && styles.dayCardComplete
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[styles.dayName, isSelected && styles.textSelected]}>{day.day}</Text>
                <Text style={[styles.dateNumber, isSelected && styles.textSelected]}>{day.date}</Text>
                
                <View style={[
                  styles.statusDot, 
                  { backgroundColor: isComplete ? Colors.success : (isSelected ? Colors.background : 'transparent') }
                ]} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Plan Progress Card -> Now using Premium Card */}
      <Card>
        <View style={styles.progressHeader}>
          <Text style={styles.cardLabel}>CURRENT BLOCK PROGRESS</Text>
          <Text style={styles.progressPercent}>35%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: '35%' }]} />
        </View>
        <Text style={styles.cardSubtext}>Week {activeWeek.weekId} of {user.plan_duration_weeks} • {activeWeek.phase}</Text>
      </Card>

      {/* Session Card -> Now using Premium Card with border accent */}
      <Card style={{ 
        borderLeftWidth: 4, 
        borderLeftColor: selectedDay.type === 'Rest' ? Colors.textDim : Colors.primary 
      }}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardLabel}>
            {selectedDay.date === 27 ? "TODAY'S SESSION" : `${selectedDay.day.toUpperCase()} ${selectedDay.date}`}
          </Text>
          <Text style={[styles.cardTag, { color: selectedDay.type === 'Rest' ? Colors.textDim : Colors.primary }]}>
            {selectedDay.type.toUpperCase()}
          </Text>
        </View>
        
        <Text style={styles.sessionTitle}>{selectedDay.title}</Text>
        <Text style={styles.sessionDetail}>Duration: {selectedDay.duration}</Text>
        <Text style={styles.sessionDetail}>Status: {selectedDay.status}</Text>

        {selectedDay.type === 'Run' && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('SessionDetail', {
              workoutTitle: selectedDay.title,
              targetDuration: selectedDay.duration
            })}
          >
            <Text style={styles.actionButtonText}>Start Run</Text>
          </TouchableOpacity>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  // Calendar Styles
  calendarContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  calendarScroll: {
    gap: 12, // Space between days
  },
  dayCard: {
    width: 60,
    height: 80,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayCardComplete: {
    borderColor: Colors.success,
    borderWidth: 1,
  },
  dayName: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  dateNumber: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textSelected: {
    color: Colors.background, // Dark text on the selected (bright) card
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  cardTag: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  sessionTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sessionDetail: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginBottom: 4,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  actionButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});