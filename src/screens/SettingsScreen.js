import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function SettingsScreen({ navigation }) {
  const { clearPlan } = useUser();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const checkNotificationStatus = async () => {
      const settings = await Notifications.getPermissionsAsync();
      const isGranted = settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
      
      if (isGranted) {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        setNotificationsEnabled(scheduled.length > 0);
      }
    };
    checkNotificationStatus();
  }, []);

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
          Alert.alert('Permission Denied', 'You need to enable notifications in your phone settings.');
          return;
        }

        // REQUIRED FOR ANDROID: Create a Notification Channel
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'Daily Reminders',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: Colors.primary,
          });
        }

        // Schedule the daily 7:00 AM reminder
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Peak Oxygen",
            body: "Good morning! Tap to view your scheduled training session for today.",
            sound: true,
          },
          trigger: {
            hour: 7,
            minute: 0,
            repeats: true,
          },
        });
        
        setNotificationsEnabled(true);
        Alert.alert('Notifications Enabled', 'You will now receive a daily reminder at 7:00 AM.');

      } catch (error) {
        console.warn("Expo Go Notification Limitation:", error);
        // Optimistically set it to true for UI testing purposes if Expo Go blocks the actual schedule
        setNotificationsEnabled(true);
        Alert.alert('Test Mode', 'Notifications are enabled in the UI, but may require a full app build to trigger on this device.');
      }

    } else {
      try {
        await Notifications.cancelAllScheduledNotificationsAsync();
      } catch (error) {
        console.warn("Failed to cancel notifications", error);
      }
      setNotificationsEnabled(false);
    }
  };

  const handleClearPlan = () => {
    Alert.alert(
      "Delete Plan",
      "Are you sure? This will wipe your 16-week macrocycle and all completed sessions.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            clearPlan();
            navigation.replace('Onboarding');
          } 
        }
      ]
    );
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