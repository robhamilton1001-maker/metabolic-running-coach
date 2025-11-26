import { Button, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phase 2: Dashboard</Text>
      <Text style={styles.text}>Today's Metabolic Status: Optimised</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="View Calendar & Sessions" 
          onPress={() => navigation.navigate('Calendar')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  text: { fontSize: 16, marginBottom: 40 },
  buttonContainer: { width: '80%' }
});