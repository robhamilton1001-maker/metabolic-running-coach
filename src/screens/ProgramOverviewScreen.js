import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/UI/Card';
import Colors from '../constants/colors';
import { PROGRAM_SCHEDULE } from '../data/dummyProgram';

export default function ProgramOverviewScreen({ navigation }) {
  
  const renderWeekItem = ({ item }) => {
    // 1. Define status checks clearly at the start
    const isLocked = item.status === 'Locked';
    const isActive = item.status === 'Active';
    
    // 2. Determine color based on status
    let statusColor = Colors.success; // Default to green (Complete)
    if (isActive) statusColor = Colors.primary; // Blue/Cyan for Active
    if (isLocked) statusColor = Colors.textDim; // Grey for Locked

    return (
      <TouchableOpacity 
        disabled={isLocked}
        onPress={() => navigation.navigate('WeekDetail', { weekId: item.weekId, title: item.title })}
      >
        {/* We use the variables we just defined above */}
        <Card style={isActive ? styles.activeCardBorder : {}}>
          <View style={styles.cardHeader}>
            <Text style={[styles.weekType, { color: statusColor }]}>{item.phase ? item.phase.toUpperCase() : 'TRAINING'}</Text>
            <Text style={[styles.statusBadge, { color: statusColor }]}>{item.status}</Text>
          </View>
          <Text style={[styles.weekTitle, isLocked && styles.lockedText]}>{item.title}</Text>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>MACROCYCLE</Text>
      <FlatList
        data={PROGRAM_SCHEDULE}
        renderItem={renderWeekItem}
        keyExtractor={item => item.weekId.toString()}
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
  activeCardBorder: {
    borderColor: Colors.primary,
    borderWidth: 1,
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