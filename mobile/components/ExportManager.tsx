import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Download, FileText, Table, Share2, Calendar, Users } from 'lucide-react-native';
import * as FileSystemBase from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useApp } from '@/providers/AppProvider';

const FileSystem = FileSystemBase as typeof FileSystemBase & {
  documentDirectory: string | null;
};

interface ExportManagerProps {
  visible: boolean;
  onClose: () => void;
}

export const ExportManager: React.FC<ExportManagerProps> = ({ visible, onClose }) => {
  const { students, sessions, attendance, exportAllToJson } = useApp();
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!visible) return null;

  const generateCSV = (data: any[], headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header] || '';
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ].join('\n');
    return csvContent;
  };

  const generateHTML = (title: string, data: any[], headers: string[]) => {
    const tableRows = data.map(row => 
      `<tr>${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}</tr>`
    ).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `;
  };

  const exportStudents = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    try {
      const headers = ['name', 'rollNumber', 'email', 'phone', 'department', 'year', 'isActive'];
      const filename = `students_${new Date().toISOString().split('T')[0]}`;
      
      let content: string;
      let fileExtension: string;

      if (format === 'csv') {
        content = generateCSV(students, headers);
        fileExtension = 'csv';
      } else {
        content = generateHTML('Students Report', students, headers);
        fileExtension = 'html';
      }

      if (!FileSystem.documentDirectory) {
        throw new Error('Document directory not available');
      }
      const fileUri = `${FileSystem.documentDirectory}${filename}.${fileExtension}`;
      await FileSystem.writeAsStringAsync(fileUri, content);

      if (Platform.OS !== 'web' && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Success', `File saved to: ${fileUri}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export students data');
    } finally {
      setIsExporting(false);
    }
  };

  const exportSessions = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    try {
      const headers = ['title', 'courseCode', 'instructor', 'dateTime', 'durationMinutes', 'room', 'notes'];
      const filename = `sessions_${new Date().toISOString().split('T')[0]}`;
      
      let content: string;
      let fileExtension: string;

      if (format === 'csv') {
        content = generateCSV(sessions, headers);
        fileExtension = 'csv';
      } else {
        content = generateHTML('Sessions Report', sessions, headers);
        fileExtension = 'html';
      }

      if (!FileSystem.documentDirectory) {
        throw new Error('Document directory not available');
      }
      const fileUri = `${FileSystem.documentDirectory}${filename}.${fileExtension}`;
      await FileSystem.writeAsStringAsync(fileUri, content);

      if (Platform.OS !== 'web' && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Success', `File saved to: ${fileUri}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export sessions data');
    } finally {
      setIsExporting(false);
    }
  };

  const exportAttendance = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    try {
      const attendanceData = Object.values(attendance).flat().map(record => {
        const student = students.find(s => s.id === record.studentId);
        const session = sessions.find(s => s.id === record.sessionId);
        return {
          studentName: student?.name || 'Unknown',
          rollNumber: student?.rollNumber || 'Unknown',
          sessionTitle: session?.title || 'Unknown',
          sessionDate: session?.dateTime ? new Date(session.dateTime).toLocaleDateString() : 'Unknown',
          status: record.status,
          timestamp: new Date(record.timestamp).toLocaleString(),
          markedBy: record.markedBy,
          remarks: record.remarks || ''
        };
      });

      const headers = ['studentName', 'rollNumber', 'sessionTitle', 'sessionDate', 'status', 'timestamp', 'markedBy', 'remarks'];
      const filename = `attendance_${new Date().toISOString().split('T')[0]}`;
      
      let content: string;
      let fileExtension: string;

      if (format === 'csv') {
        content = generateCSV(attendanceData, headers);
        fileExtension = 'csv';
      } else {
        content = generateHTML('Attendance Report', attendanceData, headers);
        fileExtension = 'html';
      }

      if (!FileSystem.documentDirectory) {
        throw new Error('Document directory not available');
      }
      const fileUri = `${FileSystem.documentDirectory}${filename}.${fileExtension}`;
      await FileSystem.writeAsStringAsync(fileUri, content);

      if (Platform.OS !== 'web' && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Success', `File saved to: ${fileUri}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export attendance data');
    } finally {
      setIsExporting(false);
    }
  };

  const exportAllData = async () => {
    setIsExporting(true);
    try {
      const allData = exportAllToJson();
      const filename = `lab_data_backup_${new Date().toISOString().split('T')[0]}`;
      if (!FileSystem.documentDirectory) {
        throw new Error('Document directory not available');
      }
      const fileUri = `${FileSystem.documentDirectory}${filename}.json`;
      
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(allData, null, 2));

      if (Platform.OS !== 'web' && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Success', `Backup saved to: ${fileUri}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export all data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Export Data</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>Students Data</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.exportButton, styles.csvButton]} 
                onPress={() => exportStudents('csv')}
                disabled={isExporting}
              >
                <Table size={16} color="#FFFFFF" />
                <Text style={styles.buttonText}>CSV</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.exportButton, styles.pdfButton]} 
                onPress={() => exportStudents('pdf')}
                disabled={isExporting}
              >
                <FileText size={16} color="#FFFFFF" />
                <Text style={styles.buttonText}>HTML</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Sessions Data</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.exportButton, styles.csvButton]} 
                onPress={() => exportSessions('csv')}
                disabled={isExporting}
              >
                <Table size={16} color="#FFFFFF" />
                <Text style={styles.buttonText}>CSV</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.exportButton, styles.pdfButton]} 
                onPress={() => exportSessions('pdf')}
                disabled={isExporting}
              >
                <FileText size={16} color="#FFFFFF" />
                <Text style={styles.buttonText}>HTML</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Download size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Attendance Data</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.exportButton, styles.csvButton]} 
                onPress={() => exportAttendance('csv')}
                disabled={isExporting}
              >
                <Table size={16} color="#FFFFFF" />
                <Text style={styles.buttonText}>CSV</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.exportButton, styles.pdfButton]} 
                onPress={() => exportAttendance('pdf')}
                disabled={isExporting}
              >
                <FileText size={16} color="#FFFFFF" />
                <Text style={styles.buttonText}>HTML</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <TouchableOpacity 
              style={[styles.exportButton, styles.fullExportButton]} 
              onPress={exportAllData}
              disabled={isExporting}
            >
              <Share2 size={20} color="#FFFFFF" />
              <Text style={[styles.buttonText, styles.fullExportText]}>Export All Data (JSON)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isExporting && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Exporting...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  csvButton: {
    backgroundColor: '#10B981',
  },
  pdfButton: {
    backgroundColor: '#EF4444',
  },
  fullExportButton: {
    backgroundColor: '#3B82F6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  fullExportText: {
    fontSize: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
});