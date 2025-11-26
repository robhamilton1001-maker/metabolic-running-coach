import { IconSymbol } from '@/components/ui/icon-symbol';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/colors';

// Mock Data based on your screenshot
const WORKOUTS = [
  {
    id: '1',
    title: 'Lower (Volume)',
    exercises: 'Lying Leg Curl (Machine), Bulgarian Split Squat, Sissy Squat (Smith), Hip Adduction (Machine)...',
    duration: '60 min',
  },
  {
    id: '2',
    title: 'Push/Pull B',
    exercises: 'Overhead Press (Barbell), Bench Press (Dumbbell), Pull Up (Weighted), Chin Up (Weig...',
    duration: '75 min',
  },
  {
    id: '3',
    title: 'Pull A',
    exercises: 'Pull Up, Lat Pulldown - Close Grip (Cable), Proposal Pull Down, Seated Cable Row (Single ...',
    duration: '50 min',
  },
];

export default function WeekDetailScreen({ route, navigation }) {
  // We default to "Current Week" if no parameter is passed
  const { weekTitle } = route.params || { weekTitle: "Current Week" };

  const renderWorkoutItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.workoutTitle}>{item.title}</Text>
        <IconSymbol name="ellipsis" size={20} color={Colors.textSecondary} />
      </View>
      
      <Text style={styles.workoutDescription} numberOfLines={2}>
        {item.exercises}
      </Text>

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Start Routine</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <IconSymbol name="chevron.left" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{weekTitle}</Text>
        {/* Placeholder for a refresh or menu icon */}
        <IconSymbol name="arrow.clockwise" size={24} color={Colors.textPrimary} />
      </View>

      <FlatList
        data={WORKOUTS}
        renderItem={renderWorkoutItem}
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
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  workoutDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  startButtonText: {
    color: Colors.background, // Dark text on bright button for high contrast
    fontSize: 16,
    fontWeight: 'bold',
  },
});