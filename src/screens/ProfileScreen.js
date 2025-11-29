import * as ImagePicker from 'expo-image-picker'; // Import the Image Picker
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/UI/Card';
import { IconSymbol } from '../components/UI/IconSymbol';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function ProfileScreen({ navigation }) {
  const { user, updateUser } = useUser();

  // Function to pick an image from the device library
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Updated to array syntax for newer versions
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // Save the new image URI to the global context
      updateUser({ profile_image_url: result.assets[0].uri });
    }
  };

  // Mock Data for Adherence
  const weeklyAdherence = [1, 1, 0, 1, 1, 0, 1]; 
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <ScrollView style={styles.container}>
      {/* Header / Profile Info */}
      <View style={styles.header}>
        
        {/* Clickable Avatar Container */}
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
          {/* Edit Icon Overlay */}
          <View style={styles.editIconBadge}>
            <IconSymbol name="gear" size={12} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.userTitle}>Metabolic Athlete</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
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

      {/* Adherence Tracker */}
      <Card>
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
        
        {/* Statistics Button */}
        <TouchableOpacity 
          style={styles.gridButton}
          onPress={() => navigation.navigate('Statistics')}
        >
          <IconSymbol name="chart.bar.fill" size={24} color={Colors.primary} />
          <Text style={styles.gridButtonText}>Statistics</Text>
        </TouchableOpacity>

        {/* Benchmarks Button */}
        <TouchableOpacity 
          style={styles.gridButton}
          onPress={() => navigation.navigate('Statistics')}
        >
          <IconSymbol name="trophy.fill" size={24} color={Colors.primary} />
          <Text style={styles.gridButtonText}>Benchmarks</Text>
        </TouchableOpacity>

        {/* Settings Button */}
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
    padding: 20,
    paddingTop: 60,
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