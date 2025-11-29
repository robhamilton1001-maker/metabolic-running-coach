import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/UI/Card';
import Colors from '../constants/colors';
import { PROGRAM_SCHEDULE } from '../data/dummyProgram';

export default function TrainingPlanScreen({ navigation }) {
  
  const renderWeekItem = ({ item }) => {
    // 1. Define status variables
    // We still track 'Active' for styling, but we ignore 'Locked' for interaction
    const isActive = item.status === 'Active';
    const isComplete = item.status === 'Complete';
    
    // 2. Determine color based on status
    let statusColor = Colors.primary; // Default to Blue
    if (isComplete) statusColor = Colors.success; // Green if done
    
    return (
      <TouchableOpacity 
        // REMOVED: disabled={isLocked} -> Now everyone can click!
        onPress={() => navigation.navigate('WeekDetail', { weekId: item.weekId, title: item.title })}
      >
        <Card style={isActive ? styles.activeCardBorder : {}}>
          <View style={styles.cardHeader}>
            <Text style={[styles.weekType, { color: statusColor }]}>
              {item.phase ? item.phase.toUpperCase() : 'TRAINING'}
            </Text>
            {/* Show status text, even for future weeks */}
            <Text style={[styles.statusBadge, { color: statusColor }]}>{item.status}</Text>
          </View>
          {/* REMOVED: lockedText style -> Title is always bright */}
          <Text style={styles.weekTitle}>{item.title}</Text>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>YOUR PROGRAM</Text>
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
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 60 },
  headerTitle: {
    color: Colors.textPrimary, fontSize: 24, fontWeight: '800',
    letterSpacing: 1.5, marginLeft: 20, marginBottom: 20,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  weekType: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  statusBadge: { fontSize: 12, fontWeight: '600' },
  weekTitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: 'bold' },
  lockedText: { color: Colors.textDim },
  activeBorder: { borderColor: Colors.primary, borderWidth: 1 },
});