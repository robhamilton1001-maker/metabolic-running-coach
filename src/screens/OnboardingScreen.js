import { Button, StyleSheet, Text, View } from 'react-native';

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phase 1: Setup</Text>
      <Text style={styles.text}>Welcome to the Metabolic Coach.</Text>
      <Button 
        title="Complete Setup" 
        onPress={() => navigation.replace('Dashboard')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  text: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
});