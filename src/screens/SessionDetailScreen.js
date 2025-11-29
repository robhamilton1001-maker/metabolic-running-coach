import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/UI/Card';
import { IconSymbol } from '../components/UI/IconSymbol';
import Colors from '../constants/colors';

export default function SessionDetailScreen({ navigation, route }) {
  const { workoutTitle = "Run", targetDuration = "Open" } = route.params || {};

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <IconSymbol name="chevron.down" size={28} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SESSION BRIEF</Text>
        <View style={{width: 28}}/> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* The Plan Card */}
        <Card>
          <Text style={styles.label}>WORKOUT</Text>
          <Text style={styles.title}>{workoutTitle}</Text>
          <View style={styles.row}>
          {/* CHANGED: Dumbbell -> Stopwatch */}
          <IconSymbol name="stopwatch" size={20} color={Colors.textSecondary} />
          <Text style={styles.detail}>{targetDuration}</Text>
          </View>
        </Card>

        {/* Instructions */}
        <Card>
          <Text style={styles.label}>COACH'S NOTES</Text>
          <Text style={styles.notes}>
            Focus on keeping your heart rate steady. This session is about building aerobic capacity, not speed.
            {"\n\n"}
            If you exceed Zone 2, walk until you recover.
          </Text>
        </Card>

        {/* Upload Section */}
        <TouchableOpacity style={styles.uploadButton}>
          <IconSymbol name="arrow.clockwise" size={24} color={Colors.background} />
          <Text style={styles.uploadText}>UPLOAD WORKOUT DATA</Text>
        </TouchableOpacity>
        <Text style={styles.subText}>Sync from Strava or Upload Screenshot</Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { color: Colors.textPrimary, fontWeight: 'bold', letterSpacing: 1 },
  content: { padding: 20 },
  label: { color: Colors.primary, fontSize: 12, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  title: { color: Colors.textPrimary, fontSize: 32, fontWeight: '800', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detail: { color: Colors.textSecondary, fontSize: 18 },
  notes: { color: Colors.textSecondary, fontSize: 16, lineHeight: 24 },
  uploadButton: {
    backgroundColor: Colors.primary, borderRadius: 12, padding: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20
  },
  uploadText: { color: Colors.background, fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  subText: { color: Colors.textDim, textAlign: 'center', marginTop: 12, fontSize: 12 }
});