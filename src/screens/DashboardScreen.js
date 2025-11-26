import { IconSymbol } from '@/components/ui/icon-symbol';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/colors';

export default function DashboardScreen({ navigation }) {
  // Mock Data for Progress
  const progress = 0.35; // 35% through the block

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>HOME</Text>
        <IconSymbol name="bell" size={24} color={Colors.textPrimary} />
      </View>

      {/* Plan Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.cardLabel}>CURRENT BLOCK PROGRESS</Text>
          <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.cardSubtext}>Week 4 of 12 • Base Building</Text>
      </View>

      {/* Next Session Card (Running Focus) */}
      <View style={[styles.card, { borderLeftColor: Colors.primary }]}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardLabel}>TODAY'S RUN</Text>
          <Text style={styles.cardTag}>AEROBIC BASE</Text>
        </View>
        
        <Text style={styles.sessionTitle}>5k Zone 2 Run</Text>
        <Text style={styles.sessionDetail}>Target HR: 135-145 bpm</Text>
        <Text style={styles.sessionDetail}>Steady pace, focus on breathing.</Text>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('WorkoutDetail')}>
          <Text style={styles.actionButtonText}>Start Run</Text>
        </TouchableOpacity>
      </View>
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
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  // Progress Card Styles
  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
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
  // Standard Card Styles
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderLeftWidth: 4,
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
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  cardTag: {
    color: Colors.primary,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sessionDetail: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  actionButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});