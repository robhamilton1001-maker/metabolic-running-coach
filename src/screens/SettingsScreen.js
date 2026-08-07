import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
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
  // NEW: Added mappedPlan to the extraction
  const { clearPlan, mappedPlan } = useUser();
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

    let kph = 0;
    if (fromUnit === 'kph') kph = num;
    if (fromUnit === 'mph') kph = num * 1.60934;
    if (fromUnit === 'min/km') kph = 60 / num;
    if (fromUnit === 'min/mile') kph = 60 / (num / 1.60934);

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
        setNotificationsEnabled(true); 
      }
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setNotificationsEnabled(false);
    }
  };

  // --- NEW: THE COACH REPORT GENERATOR ---
  const generateCoachReport = async () => {
    if (!mappedPlan || Object.keys(mappedPlan).length === 0) {
      Alert.alert("No Data", "There is no training plan to export yet.");
      return;
    }

    try {
      // 1. Crunch the math
      const days = Object.values(mappedPlan).sort((a, b) => a.dayNumber - b.dayNumber);
      const activeDays = days.filter(d => d.category !== 'Rest');
      const completedDays = activeDays.filter(d => d.status === 'Complete');
      const adherence = activeDays.length > 0 ? Math.round((completedDays.length / activeDays.length) * 100) : 0;
      
      const startDate = days[0]?.dateStr || "Unknown";
      const totalWeeks = Math.ceil(days.length / 7);

      // 2. Build the HTML for the individual sessions
      let sessionsHtml = '';
      days.forEach(day => {
        if (day.category !== 'Rest') {
          const isComplete = day.status === 'Complete';
          const statusColor = isComplete ? '#2E7D32' : '#D32F2F'; // Darker for high contrast printing
          const statusBg = isComplete ? '#E8F5E9' : '#FFEBEE';
          const statusText = isComplete ? 'COMPLETED' : 'MISSED / PENDING';
          
          const notesHtml = day.sessionNote 
            ? `<div class="notes"><strong>Athlete Notes:</strong><br/>${day.sessionNote}</div>` 
            : '';

          sessionsHtml += `
            <div class="session-card">
              <div class="session-header">
                <span class="day-title">Day ${day.dayNumber} &nbsp;|&nbsp; ${day.dateStr}</span>
                <span class="badge" style="background-color: ${statusBg}; color: ${statusColor};">${statusText}</span>
              </div>
              <div class="session-details">
                <p><strong>Workout:</strong> ${day.category} - ${day.sessionText}</p>
                ${notesHtml}
              </div>
            </div>
          `;
        }
      });

      // 3. Wrap it in a professional styling template
      // 3. Wrap it in a professional styling template
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1a1a1a; padding: 30px; margin: 0; background-color: #fff; }
              .header { text-align: center; border-bottom: 3px solid #00E0FF; padding-bottom: 20px; margin-bottom: 30px; }
              .header h1 { margin: 0; font-size: 32px; letter-spacing: 2px; text-transform: uppercase; color: #050505; }
              .header p { margin: 5px 0 0; color: #666; font-size: 16px; font-weight: 500; }
              
              .summary-box { background-color: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 40px; display: flex; justify-content: space-around; border: 1px solid #eaeaea; }
              .stat { text-align: center; }
              .stat-value { font-size: 28px; font-weight: 800; color: #00E0FF; text-shadow: 1px 1px 0px rgba(0,0,0,0.1); }
              .stat-label { font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; font-weight: 600; }
              
              h2 { font-size: 20px; color: #333; border-bottom: 1px solid #eaeaea; padding-bottom: 10px; margin-bottom: 20px; }
              
              .session-card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin-bottom: 20px; page-break-inside: avoid; background-color: #fff; }
              .session-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px; margin-bottom: 12px; }
              .day-title { font-weight: 700; font-size: 16px; color: #111; }
              .badge { padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; }
              .session-details p { margin: 0; font-size: 15px; line-height: 1.5; color: #333; }
              .notes { background-color: #f9f9f9; padding: 12px; border-radius: 6px; font-size: 14px; color: #444; margin-top: 12px; border-left: 4px solid #00E0FF; font-style: italic; }

              /* --- NEW FOOTER CSS (Translated from Tailwind) --- */
              .footer { margin-top: 48px; padding-top: 24px; border-top: 2px solid #e5e7eb; page-break-inside: avoid; }
              .footer-container { display: flex; justify-content: space-between; align-items: center; width: 100%; }
              .footer-left { display: flex; align-items: center; gap: 16px; }
              .footer-logo-container { overflow: hidden; display: flex; align-items: center; }
              .footer-logo { height: 48px; width: auto; object-fit: cover; opacity: 0.9; transform: translateZ(0); image-rendering: -webkit-optimize-contrast; }
              .footer-text-left { text-align: left; line-height: 1.25; }
              .footer-title { font-weight: 700; color: #111827; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0; }
              .footer-subtitle { font-size: 12px; color: #6b7280; font-weight: 500; margin: 0; }
              .footer-right { text-align: right; display: flex; flex-direction: column; gap: 4px; font-size: 14px; font-weight: 600; }
              .footer-link { color: #374151; text-decoration: none; }
              .footer-copyright { text-align: center; margin-top: 24px; font-size: 10px; color: #9ca3af; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Peak Oxygen</h1>
              <p>Athlete Adherence & Training Report</p>
            </div>
            
            <div class="summary-box">
              <div class="stat">
                <div class="stat-value">${startDate}</div>
                <div class="stat-label">Start Date</div>
              </div>
              <div class="stat">
                <div class="stat-value">${totalWeeks}</div>
                <div class="stat-label">Weeks</div>
              </div>
              <div class="stat">
                <div class="stat-value">${completedDays.length} / ${activeDays.length}</div>
                <div class="stat-label">Active Sessions</div>
              </div>
              <div class="stat">
                <div class="stat-value">${adherence}%</div>
                <div class="stat-label">Adherence</div>
              </div>
            </div>

            <h2>Session Breakdown & Notes</h2>
            ${sessionsHtml}
            
            <div class="footer">
                <div class="footer-container">
                    
                    <div class="footer-left">
                        <div class="footer-text-left">
                            <h4 class="footer-title">Peak Oxygen Analytics</h4>
                            <p class="footer-subtitle">Advanced Physiological Testing & Performance</p>
                        </div>
                    </div>
                    
                    <div class="footer-right">
                        <a href="https://peakoxygen.co.uk/surrey" class="footer-link">www.peakoxygen.co.uk/surrey</a>
                        <a href="mailto:Surrey@peakoxygen.co.uk" class="footer-link">Surrey@peakoxygen.co.uk</a>
                    </div>
                </div>
                
                <div class="footer-copyright">
                    &copy; ${new Date().getFullYear()} Peak Oxygen Analytics. All Rights Reserved.
                </div>
            </div>
          </body>
        </html>
      `;

      // 4. Create the PDF and open the share menu
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });

    } catch (error) {
      Alert.alert("Export Error", "Something went wrong generating the report.");
      console.error(error);
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
          
          {/* NEW: Coach Report Export Button */}
          <TouchableOpacity style={[styles.row, { borderBottomWidth: 1, borderBottomColor: Colors.border }]} onPress={generateCoachReport}>
            <View style={styles.rowLeft}>
              <MaterialIcons name="picture-as-pdf" size={24} color={Colors.primary} />
              <Text style={[styles.rowText, { color: Colors.primary }]}>Export Coach Report</Text>
            </View>
            <MaterialIcons name="ios-share" size={20} color={Colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={() => Alert.alert("Delete Plan", "Are you sure? This wipes all data.", [{text: "Cancel", style: "cancel"}, {text: "Delete", style: "destructive", onPress: () => { clearPlan(); navigation.replace('Onboarding'); }}])}>
            <View style={styles.rowLeft}>
              <MaterialIcons name="delete-outline" size={24} color="#ff5252" />
              <Text style={[styles.rowText, { color: '#ff5252' }]}>Delete Plan & Data</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Peak Oxygen v1.0.1</Text>
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