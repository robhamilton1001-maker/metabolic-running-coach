import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/UI/Card';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

// Helper to match the generator's date format (e.g., "30 Nov")
const getFormattedDate = (date) => {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
};

export default function DashboardScreen({ navigation }) {
  const { user, program } = useUser();
  
  // 1. Find the Active Week (or default to Week 1)
  const activeWeek = program.find(w => w.status === 'Active') || program[0];
  
  // 2. Find "Today" dynamically
  const todayString = getFormattedDate(new Date());
  const todayIndex = activeWeek.days.findIndex(d => d.date === todayString);
  
  // If today isn't in this week (e.g., next week), default to first day
  const safeIndex = todayIndex !== -1 ? todayIndex : 0;
  
  const todaySession = activeWeek.days[safeIndex];
  const tomorrowSession = activeWeek.days[safeIndex + 1];

  // 3. State: Default selection to "Today"
  // We use useEffect to update selection if the week changes
  const [selectedDay, setSelectedDay] = useState(todaySession);

  useEffect(() => {
    setSelectedDay(todaySession);
  }, [activeWeek]);

  // 4. Calculate Real Progress
  const totalDays = user.plan_duration_weeks * 7;
  // (Past weeks * 7) + (Days passed this week)
  const daysCompleted = ((activeWeek.weekId - 1) * 7) + (safeIndex + 1);
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
            const realTodayString = getFormattedDate(new Date());
            const isToday = day.date === realTodayString;
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
                <Text style={[styles.dayName, isSelected && styles.textSelected]}>
                  {isToday ? 'TODAY' : day.day}
                </Text>
                <Text style={[styles.dateNumber, isSelected && styles.textSelected]}>{day.date.split(' ')[0]}</Text>
                
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

      {/* Active Session Card */}
      <Card style={{ 
        borderLeftWidth: 4, 
        borderLeftColor: selectedDay.type === 'Rest' ? Colors.textDim : Colors.primary 
      }}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardLabel}>
            {selectedDay.id === todaySession.id ? "TODAY'S SESSION" : `${selectedDay.day.toUpperCase()} ${selectedDay.date}`}
          </Text>
          <Text style={[styles.cardTag, { color: selectedDay.type === 'Rest' ? Colors.textDim : Colors.primary }]}>
            {selectedDay.type.toUpperCase()}
          </Text>
        </View>
        
        <Text style={styles.sessionTitle}>{selectedDay.title}</Text>
        <Text style={styles.sessionDetail}>Duration: {selectedDay.duration}</Text>
        
        {/* Status Indicator */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 }}>
           <View style={{ 
             width: 8, height: 8, borderRadius: 4, 
             backgroundColor: selectedDay.status === 'Complete' ? Colors.success : Colors.textDim 
           }} />
           <Text style={styles.sessionDetail}>{selectedDay.status}</Text>
        </View>

        {/* Start Button - Only if Run & Not Complete */}
        {selectedDay.type === 'Run' && (
          <TouchableOpacity 
            style={[
              styles.actionButton,
              selectedDay.status === 'Complete' && styles.actionButtonComplete
            ]} 
            onPress={() => navigation.navigate('SessionDetail', {
              workoutTitle: selectedDay.title,
              targetDuration: selectedDay.duration,
              weekId: activeWeek.weekId,  // Correctly passing ID
              dayId: selectedDay.id       // Correctly passing ID
            })}
          >
            <Text style={styles.actionButtonText}>
              {selectedDay.status === 'Complete' ? "View Results" : "Start Run"}
            </Text>
          </TouchableOpacity>
        )}
      </Card>

      {/* Tomorrow's Session Preview */}
      {tomorrowSession && (
        <>
          <Text style={styles.sectionTitle}>UP NEXT</Text>
          <Card style={{ opacity: 0.8 }}>
             <View style={styles.cardHeaderRow}>
                <Text style={styles.cardLabel}>TOMORROW</Text>
                <Text style={[styles.cardTag, { color: Colors.textSecondary }]}>{tomorrowSession.type.toUpperCase()}</Text>
             </View>
             <Text style={[styles.sessionTitle, { fontSize: 18 }]}>{tomorrowSession.title}</Text>
             <Text style={styles.sessionDetail}>{tomorrowSession.duration}</Text>
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
    paddingBottom: 100, 
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
    fontSize: 10, // Slightly smaller to fit "TODAY"
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
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
  actionButtonComplete: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  actionButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});