import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function SettingsScreen({ navigation }) {
  const { clearPlan } = useUser();

  const handleClearPlan = () => {
    clearPlan();
    navigation.replace('Onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="close" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row}>
            <View style={styles.rowLeft}>
              <MaterialIcons name="notifications-none" size={24} color={Colors.textSecondary} />
              <Text style={styles.rowText}>Push Notifications</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Data Management</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={handleClearPlan}>
            <View style={styles.rowLeft}>
              <MaterialIcons name="delete-outline" size={24} color="#ff5252" />
              <Text style={[styles.rowText, { color: '#ff5252' }]}>Delete Plan & Data</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Peak Oxygen v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 24 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  scrollContent: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 12 },
  card: { backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 32, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowText: { fontSize: 16, color: Colors.textPrimary, marginLeft: 16, fontWeight: '500' },
  versionText: { textAlign: 'center', color: Colors.textSecondary, fontSize: 12, marginTop: 20 }
});