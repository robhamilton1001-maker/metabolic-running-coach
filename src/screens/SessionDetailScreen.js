import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/colors';

export default function SessionDetailScreen({ route, navigation }) {
  const { dayData } = route.params || {};

  if (!dayData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="close" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>Error: No session data found.</Text>
      </SafeAreaView>
    );
  }

  const sessionParts = dayData.sessionText.split(' | ');
  const targetZone = sessionParts.length > 1 ? sessionParts[0] : dayData.category;
  const instruction = sessionParts.length > 1 ? sessionParts.slice(1).join(' | ') : dayData.sessionText;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="close" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Day {dayData.dayNumber}</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.phaseBadge}>{String(dayData.phase).toUpperCase()}</Text>
          <Text style={styles.dayOfWeek}>{dayData.dayOfWeek} Session</Text>
          
          <View style={styles.zoneContainer}>
            <Text style={styles.zoneText(dayData.category)}>{targetZone}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Workout Instructions</Text>
        <View style={styles.instructionCard}>
          <Text style={styles.instructionText}>{instruction}</Text>
        </View>

        {dayData.category !== 'Rest' ? (
          <TouchableOpacity style={styles.logButton}>
            <MaterialIcons name="add-a-photo" size={20} color="#000" style={{ marginRight: 8 }} />
            <Text style={styles.logButtonText}>Log Activity Proof</Text>
          </TouchableOpacity>
        ) : null}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, marginTop: 10 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textSecondary },
  heroCard: { alignItems: 'center', marginBottom: 40 },
  phaseBadge: { color: Colors.textSecondary, fontSize: 14, fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  dayOfWeek: { fontSize: 32, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 16 },
  zoneContainer: { backgroundColor: Colors.surface, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: Colors.border },
  zoneText: (category) => ({
    fontSize: 18,
    fontWeight: 'bold',
    color: category === 'Rest' ? '#4CAF50' : Colors.primary,
  }),
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary, marginBottom: 12 },
  instructionCard: { backgroundColor: Colors.surface, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 32 },
  instructionText: { fontSize: 22, color: Colors.textPrimary, lineHeight: 32, fontWeight: '500' },
  logButton: { backgroundColor: Colors.primary, flexDirection: 'row', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  logButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' }
});