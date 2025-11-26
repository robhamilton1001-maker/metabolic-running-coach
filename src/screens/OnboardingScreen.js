import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/colors';

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phase 1: Setup</Text>
      <Text style={styles.text}>
        Welcome to the Metabolic Coach.{"\n"}
        Let's establish your baseline.
      </Text>
      
      {/* Custom Button for Metabolic Theme */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.replace('Dashboard')}
      >
        <Text style={styles.buttonText}>Complete Setup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 24,
    letterSpacing: 1,
  },
  text: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});