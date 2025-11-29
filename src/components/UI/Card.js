import { StyleSheet, View } from 'react-native';
import Colors from '../../constants/colors';

export function Card({ children, style }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    // The "Premium" Shadow (Depth)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    
    elevation: 8, // Required for Android shadow
    
    // We keep a very subtle border for extra definition on dark screens
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
});