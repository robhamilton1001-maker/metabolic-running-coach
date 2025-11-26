import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/colors';

// Mock Data: The structure of a metabolic program
const PROGRAM_WEEKS = [
  { id: '1', title: 'Week 1: Aerobic Foundation', status: 'Complete', type: 'Base' },
  { id: '2', title: 'Week 2: Aerobic Foundation', status: 'Active', type: 'Base' },
  { id: '3', title: 'Week 3: Metabolic Efficiency', status: 'Locked', type: 'Build' },
  { id: '4', title: 'Week 4: Recovery & Adaptation', status: 'Locked', type: 'Recovery' },
];

export default function ProgramOverviewScreen({ navigation }) {
  
  const renderWeekItem = ({ item }) => {
    // Determine styling based on status
    const isLocked = item.status === 'Locked';
    const isActive = item.status === 'Active';
    const statusColor = isActive ? Colors.primary : (isLocked ? Colors.textDim : Colors.success);

    return (
      <TouchableOpacity 
        style={[styles.weekCard, isActive && styles.activeCard]}
        disabled={isLocked}
        onPress={() => navigation.navigate('WeekDetail', { weekTitle: item.title })}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.weekType, { color: statusColor }]}>{item.type.toUpperCase()}</Text>
          <Text style={[styles.statusBadge, { color: statusColor }]}>{item.status}</Text>
        </View>
        <Text style={[styles.weekTitle, isLocked && styles.lockedText]}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>MACROCYCLE</Text>
      <FlatList
        data={PROGRAM_WEEKS}
        renderItem={renderWeekItem}
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
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginLeft: 20,
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  weekCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceLight,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekType: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
  },
  weekTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  lockedText: {
    color: Colors.textDim,
  },
});