import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/UI/Card';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext'; // <--- Import Context

export default function TrainingPlanScreen({ navigation }) {
  const { program } = useUser(); // <--- Get REAL program
  
  const renderWeekItem = ({ item }) => {
    // Logic: Nothing is locked anymore. All weeks are accessible.
    const isActive = item.status === 'Active';
    const isComplete = item.status === 'Complete';
    
    let statusColor = Colors.primary; 
    if (isComplete) statusColor = Colors.success;
    
    return (
      <TouchableOpacity 
        onPress={() => navigation.navigate('WeekDetail', { weekId: item.weekId, title: item.title })}
      >
        <Card style={isActive ? styles.activeCardBorder : {}}>
          <View style={styles.cardHeader}>
            <Text style={[styles.weekType, { color: statusColor }]}>
              {item.phase ? item.phase.toUpperCase() : 'TRAINING'}
            </Text>
            {/* Display "Open" instead of Locked */}
            <Text style={[styles.statusBadge, { color: statusColor }]}>
              {item.status === 'Locked' ? 'Open' : item.status}
            </Text>
          </View>
          <Text style={styles.weekTitle}>{item.title}</Text>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>YOUR PROGRAM</Text>
      <FlatList
        data={program} // <--- Use REAL Data
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
  activeCardBorder: { borderColor: Colors.primary, borderWidth: 1 },
});