import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Database, Download, Upload, Trash2, Info, Shield } from 'lucide-react-native';
import { useApp } from '@/providers/AppProvider';
import { ExportManager } from '@/components/ExportManager';

export default function SettingsScreen() {
  const { 
    enablePersistence, 
    togglePersistence, 
    clearAllData, 
    exportAllToJson, 
    importAllFromJson,
    students,
    sessions,
    attendance
  } = useApp();
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  const handleExportData = () => {
    const data = exportAllToJson();
    const jsonString = JSON.stringify(data, null, 2);
    
    Alert.alert(
      'Export Data',
      `Data exported successfully!\n\nStudents: ${data.students.length}\nSessions: ${data.sessions.length}\nAttendance Records: ${Object.values(data.attendance).flat().length}`,
      [
        { text: 'OK' }
      ]
    );
    
    console.log('Exported data:', jsonString);
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'This feature would allow you to import data from a JSON file. In a real app, this would open a file picker.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Demo Import', onPress: () => {
          const demoData = {
            students: [
              {
                id: 'demo1',
                name: 'John Doe',
                rollNumber: 'CS001',
                email: 'john@example.com',
                phone: '+1234567890',
                department: 'Computer Science',
                year: 3,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isActive: true,
              }
            ],
            sessions: [],
            attendance: {}
          };
          importAllFromJson(demoData);
          Alert.alert('Success', 'Demo data imported successfully!');
        }}
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all students, sessions, and attendance records. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            clearAllData();
            Alert.alert('Success', 'All data has been cleared.');
          }
        }
      ]
    );
  };

  const totalRecords = Object.values(attendance).flat().length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>App Configuration</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Storage</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Database size={24} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Local Persistence</Text>
                <Text style={styles.settingDescription}>
                  Save data locally to survive app restarts
                </Text>
              </View>
            </View>
            <Switch
              value={enablePersistence}
              onValueChange={togglePersistence}
              trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
              thumbColor={enablePersistence ? '#3B82F6' : '#9CA3AF'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={() => setShowExportModal(true)}>
            <Download size={24} color="#10B981" />
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Export Data</Text>
              <Text style={styles.actionDescription}>
                Export data as CSV, HTML or JSON files
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleImportData}>
            <Upload size={24} color="#8B5CF6" />
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Import Data</Text>
              <Text style={styles.actionDescription}>
                Import data from JSON file
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleClearData}>
            <Trash2 size={24} color="#EF4444" />
            <View style={styles.actionText}>
              <Text style={[styles.actionTitle, { color: '#EF4444' }]}>Clear All Data</Text>
              <Text style={styles.actionDescription}>
                Permanently delete all records
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Overview</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{students.length}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{sessions.length}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalRecords}</Text>
              <Text style={styles.statLabel}>Records</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.infoItem}>
            <Info size={24} color="#6B7280" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Smart Lab Analyzer</Text>
              <Text style={styles.infoDescription}>
                Offline lab attendance management system
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Shield size={24} color="#6B7280" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Privacy</Text>
              <Text style={styles.infoDescription}>
                All data is stored locally on your device
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <ExportManager 
        visible={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    marginLeft: 12,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  infoDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});