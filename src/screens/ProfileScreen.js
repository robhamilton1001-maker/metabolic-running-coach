import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function ProfileScreen({ navigation }) {
  const { athleteMetadata, clearPlan } = useUser();

  const handleClearPlan = () => {
    clearPlan();
    navigation.replace('Onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Athlete Profile</Text>
        
        {athleteMetadata ? (
          <View style={styles.card}>
            <Text style={styles.label}>Athlete Name</Text>
            <Text style={styles.value}>{athleteMetadata.athleteName}</Text>
            
            <Text style={styles.label}>Plan Level</Text>
            <Text style={styles.value}>{athleteMetadata.planLevel.toUpperCase()}</Text>

            <Text style={styles.label}>Total Cycle Length</Text>
            <Text style={styles.value}>{athleteMetadata.totalDays} Days</Text>
          </View>
        ) : (
          <Text style={styles.text}>No athlete data loaded.</Text>
        )}
        
        <TouchableOpacity style={styles.button} onPress={handleClearPlan}>
          <Text style={styles.buttonText}>Clear Plan & Import New</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 24, flex: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 32, textAlign: 'center' },
  card: { backgroundColor: Colors.surface, padding: 24, borderRadius: 16, marginBottom: 40, borderWidth: 1, borderColor: Colors.border },
  label: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  value: { fontSize: 20, color: Colors.textPrimary, marginBottom: 24, fontWeight: '600' },
  text: { color: Colors.textPrimary, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#ff5252', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});