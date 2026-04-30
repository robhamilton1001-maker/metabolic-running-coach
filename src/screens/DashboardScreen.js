import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext';

const toDateKey = (dateObj) => dateObj.toISOString().split('T')[0];

export default function DashboardScreen({ navigation }) {
  const { mappedPlan, athleteMetadata, rawSchedule } = useUser();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  if (!mappedPlan) return null;

  const todayKey = toDateKey(new Date());
  const selectedKey = toDateKey(selectedDate);
  const selectedWorkout = mappedPlan[selectedKey];

  // Calculate Tomorrow's data based on the selected date
  const tomorrowDate = new Date(selectedDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowKey = toDateKey(tomorrowDate);
  const tomorrowWorkout = mappedPlan[tomorrowKey];

  const generateDateStrip = () => {
    const strip = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + i);
      strip.push(d);
    }
    return strip;
  };

  const dateStrip = generateDateStrip();

  // Find out what week we are currently in to show a premium progress header
  const currentWeekNumber = selectedWorkout ? selectedWorkout.weekNumber : null;
  const currentPhase = selectedWorkout ? selectedWorkout.phase : "Out of Season";
  // Calculate Live Progress
  const totalSessions = Object.keys(mappedPlan).length;
  const completedSessions = Object.values(mappedPlan).filter(day => day.status === 'Complete').length;
  const progressPercent = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning,';
    if (currentHour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Premium Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.athleteName}>{athleteMetadata?.athleteName || "Athlete"}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.avatarButton}>
            {/* CHANGED ICON HERE */}
            <MaterialIcons name="settings" size={26} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Live Progress Tracker */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressLabel}>Macrocycle Completion</Text>
            <Text style={styles.progressValue}>{Math.round(progressPercent)}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* Macrocycle Context Pill */}
        {currentWeekNumber ? (
          <View style={styles.contextPill}>
             <MaterialIcons name="analytics" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
             <Text style={styles.contextPillText}>
               Phase: {currentPhase.toUpperCase()}  •  Week {currentWeekNumber} of 16
             </Text>
          </View>
        ) : null}

        {/* Elevated Bubble Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselScroll}>
            {dateStrip.map((dateObj, index) => {
              const dKey = toDateKey(dateObj);
              const isSelected = dKey === selectedKey;
              const isToday = dKey === todayKey;
              const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNumber = dateObj.getDate();

              return (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.bubble, isSelected ? styles.bubbleSelected : styles.bubbleInactive]}
                  onPress={() => setSelectedDate(dateObj)}
                >
                  <Text style={[styles.bubbleDay, isSelected ? styles.bubbleTextSelected : styles.bubbleTextInactive]}>
                    {dayOfWeek}
                  </Text>
                  <Text style={[styles.bubbleNum, isSelected ? styles.bubbleTextSelected : styles.bubbleTextInactive]}>
                    {dayNumber}
                  </Text>
                  {isToday ? <View style={[styles.todayDot, isSelected ? {backgroundColor: '#000'} : {backgroundColor: Colors.primary}]} /> : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Selected Session Hero Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedKey === todayKey ? "Today's Target" : selectedDate.toDateString()}
          </Text>
        </View>
        
        {selectedWorkout ? (
          <View style={styles.heroCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.badge(selectedWorkout.category)}>
                <Text style={styles.badgeText(selectedWorkout.category)}>
                  {String(selectedWorkout.category).toUpperCase()}
                </Text>
              </View>
            </View>
            
            <Text style={styles.heroSessionText}>
              {selectedWorkout.sessionText}
            </Text>

            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('SessionDetail', { dayData: selectedWorkout })}
            >
              <Text style={styles.primaryButtonText}>Open Session</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <MaterialIcons name="nights-stay" size={40} color={Colors.textSecondary} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyCardTitle}>Rest & Recover</Text>
            <Text style={styles.emptyCardText}>No clinical data assigned for this date.</Text>
          </View>
        )}

        {/* Up Next Mini-Tile */}
        {tomorrowWorkout ? (
          <View style={styles.upNextContainer}>
            <Text style={styles.sectionTitle}>Up Next</Text>
            <TouchableOpacity 
              style={styles.miniTile}
              onPress={() => {
                setSelectedDate(tomorrowDate);
              }}
            >
              <View style={styles.miniTileLeft}>
                <Text style={styles.miniTileLabel}>Tomorrow</Text>
                <Text style={styles.miniTileText} numberOfLines={1}>
                  {tomorrowWorkout.sessionText}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        ) : null}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 60 },

  progressContainer: { paddingHorizontal: 20, marginBottom: 24 },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  progressValue: { color: Colors.primary, fontSize: 14, fontWeight: 'bold' },
  progressBarBackground: { height: 8, backgroundColor: Colors.surface, borderRadius: 4, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  
  // Header Styles
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 24, marginBottom: 16 },
  greeting: { fontSize: 16, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  athleteName: { fontSize: 32, fontWeight: '800', color: Colors.textPrimary },
  avatarButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  
  // Pill Style
  contextPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A2A3A', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginLeft: 20, marginBottom: 32, borderWidth: 1, borderColor: '#2A3A4A' },
  contextPillText: { color: Colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },

  // Bubble Carousel
  carouselContainer: { marginBottom: 32 },
  carouselScroll: { paddingHorizontal: 16 },
  bubble: { width: 64, height: 90, justifyContent: 'center', alignItems: 'center', borderRadius: 32, marginHorizontal: 6, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 }, android: { elevation: 6 } }) },
  bubbleInactive: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  bubbleSelected: { backgroundColor: Colors.primary },
  bubbleDay: { fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  bubbleNum: { fontSize: 22, fontWeight: '800' },
  bubbleTextInactive: { color: Colors.textSecondary },
  bubbleTextSelected: { color: '#000' },
  todayDot: { width: 6, height: 6, borderRadius: 3, position: 'absolute', bottom: 12 },

  // Hero Card
  sectionHeader: { paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, letterSpacing: 0.5 },
  heroCard: { backgroundColor: '#121212', borderRadius: 24, padding: 24, marginHorizontal: 20, borderWidth: 1, borderColor: '#2A2A2A', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12 }, android: { elevation: 8 } }) },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  badge: (category) => ({ backgroundColor: category === 'Rest' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(0, 224, 255, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: category === 'Rest' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(0, 224, 255, 0.3)' }),
  badgeText: (category) => ({ color: category === 'Rest' ? '#4CAF50' : Colors.primary, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 }),
  heroSessionText: { fontSize: 28, fontWeight: '600', color: Colors.textPrimary, lineHeight: 38, marginBottom: 32 },
  primaryButton: { backgroundColor: Colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderRadius: 16 },
  primaryButtonText: { color: '#000', fontWeight: '800', fontSize: 16, marginRight: 8, textTransform: 'uppercase', letterSpacing: 1 },

  // Empty State
  emptyCard: { backgroundColor: 'transparent', borderRadius: 24, padding: 32, marginHorizontal: 20, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  emptyCardTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 8 },
  emptyCardText: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center' },

  // Up Next Tile
  upNextContainer: { marginTop: 32, paddingHorizontal: 20 },
  miniTile: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, marginTop: 12 },
  miniTileLeft: { flex: 1, marginRight: 16 },
  miniTileLabel: { fontSize: 12, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, fontWeight: '600' },
  miniTileText: { fontSize: 16, color: Colors.textPrimary, fontWeight: '500' }

  
});