import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Users, Clock, CheckCircle, XCircle, AlertCircle, User } from 'lucide-react-native';
import { useApp, useFilteredStudents, useSessionAttendance } from '@/providers/AppProvider';
import { AttendanceStatus } from '@/types';

export default function LiveAttendanceScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { sessions, markAttendance } = useApp();
  const students = useFilteredStudents();
  const attendance = useSessionAttendance(sessionId);
  
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<AttendanceStatus>('Present');

  const session = sessions.find(s => s.id === sessionId);

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Session not found</Text>
      </SafeAreaView>
    );
  }

  const getStudentStatus = (studentId: string): AttendanceStatus | undefined => {
    const record = attendance.find(a => a.studentId === studentId);
    return record?.status;
  };

  const handleStatusChange = async (studentId: string, status: AttendanceStatus) => {
    try {
      await markAttendance(sessionId, studentId, status);
    } catch (error) {
      Alert.alert('Error', 'Failed to mark attendance');
    }
  };

  const handleBulkAttendance = async () => {
    if (selectedStudents.size === 0) {
      Alert.alert('No Selection', 'Please select students first');
      return;
    }

    try {
      const promises = Array.from(selectedStudents).map(studentId =>
        markAttendance(sessionId, studentId, bulkStatus)
      );
      await Promise.all(promises);
      setSelectedStudents(new Set());
      Alert.alert('Success', `Marked ${selectedStudents.size} students as ${bulkStatus}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to mark bulk attendance');
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    const newSelection = new Set(selectedStudents);
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId);
    } else {
      newSelection.add(studentId);
    }
    setSelectedStudents(newSelection);
  };

  const selectAll = () => {
    setSelectedStudents(new Set(students.map(s => s.id)));
  };

  const clearSelection = () => {
    setSelectedStudents(new Set());
  };

  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;
  const lateCount = attendance.filter(a => a.status === 'Late').length;
  const totalMarked = attendance.length;
  const attendanceRate = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present': return '#10B981';
      case 'Absent': return '#EF4444';
      case 'Late': return '#F59E0B';
    }
  };

  const getStatusIcon = (status: AttendanceStatus): typeof CheckCircle => {
    switch (status) {
      case 'Present': return CheckCircle;
      case 'Absent': return XCircle;
      case 'Late': return AlertCircle;
      default: return CheckCircle;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#6B7280" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <Text style={styles.sessionDetails}>{session.courseCode} • {session.room}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{presentCount}</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{absentCount}</Text>
          <Text style={styles.statLabel}>Absent</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{lateCount}</Text>
          <Text style={styles.statLabel}>Late</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{attendanceRate}%</Text>
          <Text style={styles.statLabel}>Rate</Text>
        </View>
      </View>

      {selectedStudents.size > 0 && (
        <View style={styles.bulkActions}>
          <View style={styles.bulkInfo}>
            <Text style={styles.bulkText}>{selectedStudents.size} selected</Text>
            <TouchableOpacity onPress={clearSelection}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bulkButtons}>
            {(['Present', 'Absent', 'Late'] as AttendanceStatus[]).map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.bulkButton,
                  bulkStatus === status && styles.bulkButtonActive,
                  { backgroundColor: bulkStatus === status ? getStatusColor(status) : '#F3F4F6' }
                ]}
                onPress={() => setBulkStatus(status)}
              >
                <Text style={[
                  styles.bulkButtonText,
                  { color: bulkStatus === status ? '#FFFFFF' : '#6B7280' }
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.applyButton} onPress={handleBulkAttendance}>
            <Text style={styles.applyButtonText}>Apply to Selected</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Students ({students.length})</Text>
        <View style={styles.listActions}>
          <TouchableOpacity onPress={selectAll}>
            <Text style={styles.actionText}>Select All</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.studentsList} showsVerticalScrollIndicator={false}>
        {students.map(student => {
          const status = getStudentStatus(student.id);
          const isSelected = selectedStudents.has(student.id);
          
          return (
            <View key={student.id} style={styles.studentItem}>
              <TouchableOpacity
                style={styles.studentInfo}
                onPress={() => toggleStudentSelection(student.id)}
              >
                <View style={[
                  styles.selectionIndicator,
                  isSelected && styles.selectionIndicatorActive
                ]}>
                  {isSelected && <CheckCircle size={16} color="#3B82F6" />}
                </View>
                <View style={styles.avatar}>
                  <User size={20} color="#6B7280" />
                </View>
                <View style={styles.studentDetails}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentMeta}>
                    {student.rollNumber} • {student.department}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.statusButtons}>
                {(['Present', 'Absent', 'Late'] as AttendanceStatus[]).map(statusOption => {
                  const StatusIcon = getStatusIcon(statusOption);
                  const isActive = status === statusOption;
                  
                  return (
                    <TouchableOpacity
                      key={statusOption}
                      style={[
                        styles.statusButton,
                        isActive && { backgroundColor: getStatusColor(statusOption) + '20' }
                      ]}
                      onPress={() => handleStatusChange(student.id, statusOption)}
                    >
                      <StatusIcon
                        size={20}
                        color={isActive ? getStatusColor(statusOption) : '#9CA3AF'}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sessionDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
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
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  bulkActions: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bulkInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bulkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  clearText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  bulkButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  bulkButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  bulkButtonActive: {
    // backgroundColor set dynamically
  },
  bulkButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  listActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  studentsList: {
    flex: 1,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  studentInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionIndicatorActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#DBEAFE',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  studentMeta: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});