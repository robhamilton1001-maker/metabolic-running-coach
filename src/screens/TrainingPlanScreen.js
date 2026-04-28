import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function TrainingPlanScreen() {
  const { rawSchedule } = useUser();

  if (!rawSchedule) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No plan loaded.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Group the flat 112 days into 16 distinct weeks for the UI
  const weeks = [];
  for (let i = 1; i <= 16; i++) {
    const weekDays = rawSchedule.filter(day => day.weekNumber === i);
    if (weekDays.length > 0) {
      weeks.push({
        weekNumber: i,
        phase: weekDays[0].phase,
        days: weekDays
      });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>16-Week Macrocycle</Text>
        
        {weeks.map((week) => (
          <View key={week.weekNumber} style={styles.weekCard}>
            <View style={styles.weekHeader}>
              <Text style={styles.weekTitle}>Week {week.weekNumber}</Text>
              <Text style={styles.phaseBadge}>{week.phase.toUpperCase()}</Text>
            </View>
            
            {week.days.map((day) => (
              <View key={day.dayNumber} style={styles.dayRow}>
                <Text style={styles.dayLabel}>{day.dayOfWeek}</Text>
                <View style={styles.dayContent}>
                  <Text style={styles.categoryLabel(day.category)}>
                    {day.category.toUpperCase()}
                  </Text>
                  <Text style={styles.sessionText}>
                    {day.sessionText}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: Colors.textSecondary, fontSize: 16 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 20, marginTop: 10 },
  weekCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 12,
  },
  weekTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  phaseBadge: { fontSize: 12, fontWeight: 'bold', color: Colors.primary, letterSpacing: 1 },
  dayRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  dayLabel: {
    width: 45,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dayContent: { flex: 1 },
  categoryLabel: (category) => ({
    fontSize: 11,
    fontWeight: 'bold',
    color: category === 'Rest' ? '#4CAF50' : Colors.textSecondary,
    marginBottom: 4,
    letterSpacing: 0.5,
  }),
  sessionText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
  }
});