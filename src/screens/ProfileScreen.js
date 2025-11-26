import { IconSymbol } from '@/components/ui/icon-symbol'; // Assuming you have this from your initial upload
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/colors';

export default function ProfileScreen() {
  // Mock Data for Adherence (1 = completed, 0 = missed/rest)
  const weeklyAdherence = [1, 1, 0, 1, 1, 0, 1]; 
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <ScrollView style={styles.container}>
      {/* Header / Profile Info */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>RH</Text>
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.username}>roberthamilton</Text>
          <Text style={styles.userTitle}>Elite Athlete</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>54</Text>
              <Text style={styles.statLabel}>VO2 Max</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8h</Text>
              <Text style={styles.statLabel}>Zone 2</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Adherence Tracker */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Weekly Adherence</Text>
          <Text style={styles.sectionSubtitle}>5/7 Sessions</Text>
        </View>
        <View style={styles.adherenceRow}>
          {weeklyAdherence.map((status, index) => (
            <View key={index} style={styles.dayContainer}>
              <View style={[
                styles.adherenceBubble, 
                status === 1 ? styles.adherenceComplete : styles.adherenceMissed
              ]} />
              <Text style={styles.dayText}>{days[index]}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Grid */}
      <Text style={styles.sectionTitle}>Menu</Text>
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.gridButton}>
          <IconSymbol name="chart.bar.fill" size={24} color={Colors.primary} />
          <Text style={styles.gridButtonText}>Statistics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridButton}>
          <IconSymbol name="trophy.fill" size={24} color={Colors.primary} />
          <Text style={styles.gridButtonText}>Benchmarks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridButton}>
          <IconSymbol name="figure.run" size={24} color={Colors.primary} />
          <Text style={styles.gridButtonText}>Body Measures</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridButton}>
          <IconSymbol name="gear" size={24} color={Colors.textSecondary} />
          <Text style={styles.gridButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarText: {
    color: Colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsContainer: {
    flex: 1,
    marginLeft: 20,
  },
  username: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  userTitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: Colors.textDim,
    fontSize: 12,
  },
  sectionContainer: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  adherenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayContainer: {
    alignItems: 'center',
    gap: 8,
  },
  adherenceBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  adherenceComplete: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  adherenceMissed: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.textDim,
  },
  dayText: {
    color: Colors.textDim,
    fontSize: 12,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridButton: {
    width: '48%',
    backgroundColor: Colors.surface,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'flex-start', // Left align like the screenshot
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  gridButtonText: {
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
});