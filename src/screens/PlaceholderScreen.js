import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../components/UI/IconSymbol';
import Colors from '../constants/colors';

export default function PlaceholderScreen({ navigation, route }) {
  const { title = "Feature" } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Using 'gear' as a generic system icon for now */}
        <IconSymbol name="gear" size={64} color={Colors.textDim} />
        <Text style={styles.title}>Under Construction</Text>
        <Text style={styles.text}>
          The {title} module is currently being built. Check back in the next update.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: -100,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});