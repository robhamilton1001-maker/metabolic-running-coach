import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/UI/Card';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function DashboardScreen({ navigation }) {
  const { user, program } = useUser();
  const activeWeek = program.find(w => w.status === 'Active') || program[0];
  
  // For this demo, we simulate that "Today" is the 3rd day of the active week (Wednesday)
  // In a real app, you would compare new Date() with the dates in your data
  const todayIndex = 2; 
  const today = activeWeek.days[todayIndex];
  const tomorrow = activeWeek.days[todayIndex + 1]; 

  // State to track which day is selected in the calendar strip
  const [selectedDay, setSelectedDay] = useState(today); 

  // Calculate Plan Progress (e.g., Day 17 of 84)
  const totalDays = user.plan_duration_weeks * 7;
  const daysCompleted = ((activeWeek.weekId - 1) * 7) + todayIndex + 1;
  const progressPercent = daysCompleted / totalDays;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>HOME</Text>
      </View>

      {/* Weekly Calendar Strip */}
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

      {/* Plan Progress Bar */}
      <Card>
        <View style={styles.progressHeader}>
          <Text style={styles.cardLabel}>BLOCK PROGRESS</Text>
          <Text style={styles.progressPercent}>{Math.round(progressPercent * 100)}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progressPercent * 100}%` }]} />
        </View>
        <Text style={styles.cardSubtext}>
            Day {daysCompleted} of {totalDays} • {activeWeek.phase}
        </Text>
      </Card>

      {/* Active Session Card (Dynamic based on selection) */}
      <Card style={{ 
        borderLeftWidth: 4, 
        borderLeftColor: selectedDay.type === 'Rest' ? Colors.textDim : Colors.primary 
      }}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardLabel}>
            {selectedDay.id === today.id ? "TODAY'S SESSION" : `${selectedDay.day.toUpperCase()} ${selectedDay.date}`}
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

      {/* NEW: Tomorrow's Session Preview */}
      {tomorrow && (
        <>
          <Text style={styles.sectionTitle}>UP NEXT</Text>
          <Card style={{ opacity: 0.8 }}>
             <View style={styles.cardHeaderRow}>
                <Text style={styles.cardLabel}>TOMORROW ({tomorrow.day})</Text>
                <Text style={[styles.cardTag, { color: Colors.textSecondary }]}>{tomorrow.type.toUpperCase()}</Text>
             </View>
             <Text style={[styles.sessionTitle, { fontSize: 18 }]}>{tomorrow.title}</Text>
             <Text style={styles.sessionDetail}>{tomorrow.duration}</Text>
          </Card>
        </>
      )}
      
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
    paddingBottom: 100, // Extra padding to fix scrolling issue
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
    gap: 12, 
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
    color: Colors.background, 
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  // Progress Bar Styles
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressPercent: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  // Card Internals
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
    textTransform: 'uppercase',
  },
  cardTag: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardSubtext: {
    color: Colors.textDim,
    fontSize: 14,
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