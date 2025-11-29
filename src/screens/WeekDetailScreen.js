import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/UI/Card';
import { IconSymbol } from '../components/UI/IconSymbol';
import Colors from '../constants/colors';
import { PROGRAM_SCHEDULE } from '../data/dummyProgram';

export default function WeekDetailScreen({ route, navigation }) {
  // 1. Get the weekId passed from the previous screen
  const { weekId, title } = route.params || { weekId: 1, title: "Week 1" };

  // 2. Find the week data
  const weekData = PROGRAM_SCHEDULE.find(w => w.weekId === weekId);
  const days = weekData ? weekData.days : [];

  const renderDayItem = ({ item }) => {
    const isRest = item.type === 'Rest';
    
    return (
      <Card style={[
        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        isRest && { opacity: 0.6 }
      ]}>
        <View style={styles.cardHeader}>
          <View style={styles.dayBadge}>
            <Text style={styles.dayText}>{item.day}</Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          <View>
             <Text style={styles.workoutTitle}>{item.title}</Text>
             <Text style={[styles.workoutType, { color: isRest ? Colors.textDim : Colors.primary }]}>
                {item.type.toUpperCase()} • {item.duration}
             </Text>
          </View>
        </View>

        {!isRest && (
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => navigation.navigate('SessionDetail', { 
              workoutTitle: item.title, 
              targetDuration: item.duration 
            })}
          >
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <IconSymbol name="chevron.left" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={days}
        renderItem={renderDayItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  // --- New Card Styles for Daily Schedule ---
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardRest: {
    opacity: 0.7, // Dim rest days slightly
    borderColor: 'transparent',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  dayBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  dayText: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  dateText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workoutType: {
    fontSize: 12,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20, // Pill shape
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  startButtonText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
});