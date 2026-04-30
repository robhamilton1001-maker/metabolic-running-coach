import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false }),
});

const UNITS = ['kph', 'mph', 'min/km', 'min/mile'];

export default function SettingsScreen({ navigation }) {
  const { clearPlan } = useUser();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  // Converter State
  const [convInput, setConvInput] = useState('');
  const [fromUnit, setFromUnit] = useState('min/km');
  const [toUnit, setToUnit] = useState('mph');
  const [convResult, setConvResult] = useState('--');

  useEffect(() => {
    const checkNotificationStatus = async () => {
      const settings = await Notifications.getPermissionsAsync();
      if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        setNotificationsEnabled(scheduled.length > 0);
      }
    };
    checkNotificationStatus();
  }, []);

  // Run conversion math whenever inputs change
  useEffect(() => {
    if (!convInput) {
      setConvResult('--');
      return;
    }

    const parseInput = (val) => {
      if (val.includes(':')) {
        const [min, sec] = val.split(':');
        return parseInt(min || 0) + parseInt(sec || 0) / 60;
      }
      return parseFloat(val);
    };

    const formatPace = (decimal) => {
      if (!isFinite(decimal) || decimal <= 0) return '--';
      const mins = Math.floor(decimal);
      const secs = Math.round((decimal - mins) * 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const num = parseInput(convInput.replace(',', '.'));
    if (!num || isNaN(num)) return;

    // Convert everything to a baseline of KPH
    let kph = 0;
    if (fromUnit === 'kph') kph = num;
    if (fromUnit === 'mph') kph = num * 1.60934;
    if (fromUnit === 'min/km') kph = 60 / num;
    if (fromUnit === 'min/mile') kph = 60 / (num / 1.60934);

    // Convert KPH to target unit
    let result = '';
    if (toUnit === 'kph') result = kph.toFixed(2) + ' kph';
    if (toUnit === 'mph') result = (kph / 1.60934).toFixed(2) + ' mph';
    if (toUnit === 'min/km') result = formatPace(60 / kph) + ' /km';
    if (toUnit === 'min/mile') result = formatPace((60 / kph) * 1.60934) + ' /mi';

    setConvResult(result);
  }, [convInput, fromUnit, toUnit]);

  const toggleNotifications = async (newValue) => {
    if (newValue) {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          Alert.alert('Permission Denied', 'Enable notifications in your phone settings.');
          return;
        }
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'Daily Reminders',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: Colors.primary,
          });
        }
        await Notifications.scheduleNotificationAsync({
          content: { title: "Peak Oxygen", body: "Good morning! Tap to view your scheduled training session for today.", sound: true },
          trigger: { hour: 7, minute: 0, repeats: true },
        });
        setNotificationsEnabled(true);
      } catch (error) {
        setNotificationsEnabled(true); // Fallback for Expo Go UI testing
      }
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setNotificationsEnabled(false);
    }
  };

  const UnitPill = ({ unit, active, onPress }) => (
    <TouchableOpacity 
      style={[styles.unitPill, active && styles.unitPillActive]} 
      onPress={onPress}
    >
      <Text style={[styles.unitPillText, active && styles.unitPillTextActive]}>{unit}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="close" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* CONVERTER SECTION */}
        <Text style={styles.sectionTitle}>Pace & Speed Converter</Text>
        <View style={[styles.card, { padding: 16 }]}>
          <Text style={styles.converterLabel}>From:</Text>
          <View style={styles.pillContainer}>
            {UNITS.map(u => (
              <UnitPill key={`from-${u}`} unit={u} active={fromUnit === u} onPress={() => setFromUnit(u)} />
            ))}
          </View>

          <Text style={styles.converterLabel}>To:</Text>
          <View style={styles.pillContainer}>
            {UNITS.map(u => (
              <UnitPill key={`to-${u}`} unit={u} active={toUnit === u} onPress={() => setToUnit(u)} />
            ))}
          </View>

          <View style={styles.converterInputRow}>
            <TextInput 
              style={styles.converterInput}
              placeholder="e.g. 5:30 or 12.5"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="numbers-and-punctuation"
              value={convInput}
              onChangeText={setConvInput}
            />
            <MaterialIcons name="arrow-forward" size={24} color={Colors.textSecondary} style={{ marginHorizontal: 12 }} />
            <View style={styles.converterResultBox}>
              <Text style={styles.converterResultText}>{convResult}</Text>
            </View>
          </View>
        </View>

        {/* ACCOUNT SECTION */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MaterialIcons name="notifications-none" size={24} color={Colors.textSecondary} />
              <Text style={styles.rowText}>Daily Reminders</Text>
            </View>
            <Switch 
              value={notificationsEnabled} 
              onValueChange={toggleNotifications}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={notificationsEnabled ? '#000' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* DATA MANAGEMENT SECTION */}
        <Text style={styles.sectionTitle}>Data Management</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={() => Alert.alert("Delete Plan", "Are you sure? This wipes all data.", [{text: "Cancel", style: "cancel"}, {text: "Delete", style: "destructive", onPress: () => { clearPlan(); navigation.replace('Onboarding'); }}])}>
            <View style={styles.rowLeft}>
              <MaterialIcons name="delete-outline" size={24} color="#ff5252" />
              <Text style={[styles.rowText, { color: '#ff5252' }]}>Delete Plan & Data</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Peak Oxygen v1.0.0</Text>
        <View style={{ height: 40 }} />
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
  versionText: { textAlign: 'center', color: Colors.textSecondary, fontSize: 12, marginTop: 10 },
  
  // Converter Styles
  converterLabel: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, gap: 8 },
  unitPill: { backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 },
  unitPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  unitPillText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  unitPillTextActive: { color: '#000', fontWeight: '700' },
  converterInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  converterInput: { flex: 1, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 12, color: Colors.textPrimary, fontSize: 16, fontWeight: '500' },
  converterResultBox: { flex: 1, backgroundColor: Colors.border, borderRadius: 12, padding: 12, alignItems: 'center', justifyContent: 'center' },
  converterResultText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700' }
});