import * as DocumentPicker from 'expo-document-picker';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/UI/Card';
import { IconSymbol } from '../components/UI/IconSymbol';
import Colors from '../constants/colors';
import { useUser } from '../context/UserContext'; // Import Global Data

export default function PdfViewerScreen({ navigation }) {
  const { user, updateUser } = useUser(); // Access global user data

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', 
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        // Save to GLOBAL Context so it persists
        updateUser({ 
            report_pdf_uri: result.assets[0].uri,
            report_pdf_name: result.assets[0].name
        });
        Alert.alert("Success", "Report saved to your profile.");
      }
    } catch (err) {
      Alert.alert("Error", "Could not select document.");
    }
  };

  const viewDocument = async () => {
    if (user.report_pdf_uri) {
      try {
        // This opens the native PDF viewer on iOS/Android
        await Linking.openURL(user.report_pdf_uri);
      } catch (e) {
        Alert.alert("Error", "Unable to open this file.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={28} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LAB REPORTS</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Metabolic Testing</Text>
        
        {/* Document Card */}
        <Card style={styles.docCard}>
          {user.report_pdf_uri ? (
            <View style={styles.uploadedState}>
              <IconSymbol name="checkmark.circle.fill" size={48} color={Colors.success} />
              
              <Text style={styles.fileName}>
                {user.report_pdf_name || "Report.pdf"}
              </Text>
              <Text style={styles.fileInfo}>Ready for Review</Text>
              
              {/* NEW: View Button */}
              <TouchableOpacity style={styles.viewButton} onPress={viewDocument}>
                <Text style={styles.viewButtonText}>Open Report</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.replaceButton} onPress={pickDocument}>
                <Text style={styles.replaceText}>Replace File</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="doc.text.fill" size={48} color={Colors.textDim} />
              <Text style={styles.emptyTitle}>No Report Uploaded</Text>
              <Text style={styles.emptyText}>
                Upload your metabolic testing results (PDF) to track your physiological progress.
              </Text>
              <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                <Text style={styles.uploadButtonText}>Select PDF</Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60, // Keeps it safe from the notch
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  docCard: {
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed', 
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 250,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  uploadButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  // Uploaded State
  uploadedState: {
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  fileName: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  fileInfo: {
    color: Colors.textDim,
    fontSize: 14,
    marginBottom: 16,
  },
  viewButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    width: '80%',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  viewButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  replaceButton: {
    padding: 10,
  },
  replaceText: {
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});