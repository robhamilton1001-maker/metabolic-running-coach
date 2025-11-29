import * as ImagePicker from 'expo-image-picker';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/UI/Card';
import { IconSymbol } from '../components/UI/IconSymbol';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function ProfileScreen({ navigation }) {
  const { user, updateUser, program } = useUser();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      updateUser({ profile_image_url: result.assets[0].uri });
    }
  };

  // 1. CALCULATE REAL STATS
  // Total Completed Runs (All time)
  const completedRuns = program
    .flatMap(week => week.days)
    .filter(day => day.type === 'Run' && day.status === 'Complete')
    .length;

  // 2. CALCULATE WEEKLY ADHERENCE (For the Active Week)
  const activeWeek = program.find(w => w.status === 'Active') || program[0];
  
  // Map the 7 days of the active week to status (1 = Green/Filled, 0 = Empty)
  const weeklyAdherence = activeWeek.days.map(day => {
    // Logic: Rest days count as "adherence" (easy win), Runs only count if Complete
    if (day.type === 'Rest') return 1;
    if (day.status === 'Complete') return 1;
    return 0;
  });

  // Get Day labels (M, T, W...) from the data
  const dayLabels = activeWeek.days.map(day => day.day.charAt(0));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header / Profile Info */}
      <View style={styles.header}>
        
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          {user.profile_image_url ? (
            <Image source={{ uri: user.profile_image_url }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
              </Text>
            </View>
          )}
          <View style={styles.editIconBadge}>
            <IconSymbol name="gear" size={12} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.userTitle}>Metabolic Athlete</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedRuns}</Text>
              <Text style={styles.statLabel}>Runs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.plan_duration_weeks}</Text>
              <Text style={styles.statLabel}>Wk Plan</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.availability_days}</Text>
              <Text style={styles.statLabel}>Days/Wk</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Adherence Tracker - NOW DYNAMIC */}
      <Card>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Weekly Adherence</Text>
          <Text style={styles.sectionSubtitle}>
             Week {activeWeek.weekId}
          </Text>
        </View>
        <View style={styles.adherenceRow}>
          {weeklyAdherence.map((status, index) => (
            <View key={index} style={styles.dayContainer}>
              <View style={[
                styles.adherenceBubble, 
                status === 1 ? styles.adherenceComplete : styles.adherenceMissed
              ]} />
              <Text style={styles.dayText}>{dayLabels[index]}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Physiology Grid */}
      <Text style={styles.sectionHeaderLabel}>METABOLIC PROFILE</Text>
      <View style={styles.gridContainer}>
        <Card style={styles.gridCard}>
          <Text style={styles.gridLabel}>VO2 Max</Text>
          <Text style={styles.gridValue}>{user.vo2_max}</Text>
          <Text style={styles.gridUnit}>ml/kg/min</Text>
        </Card>

        <Card style={styles.gridCard}>
          <Text style={styles.gridLabel}>HR Max</Text>
          <Text style={styles.gridValue}>{user.hr_max}</Text>
          <Text style={styles.gridUnit}>bpm</Text>
        </Card>

        <Card style={styles.gridCard}>
          <Text style={styles.gridLabel}>Aerobic (LT1)</Text>
          <Text style={styles.gridValue}>{user.lt1_hr}</Text>
          <Text style={styles.gridUnit}>bpm</Text>
        </Card>

        <Card style={styles.gridCard}>
          <Text style={styles.gridLabel}>Threshold (LT2)</Text>
          <Text style={styles.gridValue}>{user.lt2_hr}</Text>
          <Text style={styles.gridUnit}>bpm</Text>
        </Card>
      </View>

      {/* Menu Buttons */}
      <Text style={styles.sectionHeaderLabel}>MENU</Text>
      <View style={styles.gridContainer}>
        
        {/* 1. Lab Reports (Formerly Statistics) -> Goes to PDF Screen */}
        <TouchableOpacity 
          style={styles.gridButton}
          onPress={() => navigation.navigate('PdfViewer')}
        >
          {/* Ensure 'doc.text.fill' is in your IconSymbol map, or use 'chart.bar.fill' if you prefer */}
          <IconSymbol name="doc.text.fill" size={24} color={Colors.primary} />
          <Text style={styles.gridButtonText}>Lab Reports</Text>
        </TouchableOpacity>

        {/* 2. Benchmarks -> Goes to Statistics/PB Screen */}
        <TouchableOpacity 
          style={styles.gridButton}
          onPress={() => navigation.navigate('Statistics')}
        >
          <IconSymbol name="trophy.fill" size={24} color={Colors.primary} />
          <Text style={styles.gridButtonText}>Benchmarks</Text>
        </TouchableOpacity>

        {/* 3. Settings */}
        <TouchableOpacity 
          style={styles.gridButton}
          onPress={() => navigation.navigate('Settings')}
        >
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
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 120, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.primary,
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
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  avatarText: {
    color: Colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsContainer: {
    flex: 1,
    marginLeft: 10,
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
  sectionHeaderLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  gridCard: {
    width: '48%', 
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 0, 
  },
  gridLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  gridValue: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  gridUnit: {
    color: Colors.textDim,
    fontSize: 12,
    marginTop: 4,
  },
  gridButton: {
    width: '48%',
    backgroundColor: Colors.surface,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
    marginBottom: 0,
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