import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,

} from 'react-native';
import { useApp, useFilteredStudents } from '@/providers/AppProvider';
import { AttendanceStatus, Student } from '@/types';
import { SimpleSearchBar } from '@/components/SimpleSearchBar';
import { Check, X, Clock, Users, Calendar } from 'lucide-react-native';

interface AttendanceItemProps {
  student: Student;
  currentStatus?: AttendanceStatus;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
}

const AttendanceItem: React.FC<AttendanceItemProps> = ({
  student,
  currentStatus,
  onStatusChange,
}) => {
  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present':
        return '#10B981';
      case 'Absent':
        return '#EF4444';
      case 'On Duty':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present':
        return <Check size={16} color="white" />;
      case 'Absent':
        return <X size={16} color="white" />;
      case 'On Duty':
        return <Clock size={16} color="white" />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.attendanceItem}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{student.name}</Text>
        <Text style={styles.studentDetails}>
          {student.rollNumber} • {student.department} • Year {student.year}
        </Text>
      </View>
      
      <View style={styles.statusButtons}>
        {(['Present', 'Absent', 'On Duty'] as AttendanceStatus[]).map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusButton,
              {
                backgroundColor:
                  currentStatus === status ? getStatusColor(status) : '#F3F4F6',
              },
            ]}
            onPress={() => onStatusChange(student.id, status)}
          >
            {currentStatus === status && getStatusIcon(status)}
            <Text
              style={[
                styles.statusButtonText,
                {
                  color: currentStatus === status ? 'white' : '#374151',
                },
              ]}
            >
              {status === 'On Duty' ? 'On Duty' : status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function AttendancePage() {
  const { sessions, attendance, markAttendance, selectedSessionId, setSelectedSession } = useApp();
  const filteredStudents = useFilteredStudents();
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const currentSession = sessions.find(s => s.id === selectedSessionId);
  const sessionAttendance = attendance[selectedSessionId || ''] || [];
  
  const filteredStudentsWithSearch = useMemo(() => {
    return filteredStudents.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredStudents, searchQuery]);

  const handleStatusChange = async (studentId: string, status: AttendanceStatus) => {
    if (!selectedSessionId) {
      Alert.alert('Error', 'Please select a session first');
      return;
    }
    
    await markAttendance(selectedSessionId, studentId, status);
  };

  const getAttendanceStats = () => {
    const total = filteredStudentsWithSearch.length;
    const present = sessionAttendance.filter(a => a.status === 'Present').length;
    const absent = sessionAttendance.filter(a => a.status === 'Absent').length;
    const onDuty = sessionAttendance.filter(a => a.status === 'On Duty').length;
    
    return { total, present, absent, onDuty };
  };

  const stats = getAttendanceStats();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendance Management</Text>
        
        {/* Session Selection */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sessionSelector}>
          {sessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              style={[
                styles.sessionChip,
                selectedSessionId === session.id && styles.selectedSessionChip,
              ]}
              onPress={() => setSelectedSession(session.id)}
            >
              <Calendar size={16} color={selectedSessionId === session.id ? 'white' : '#6B7280'} />
              <Text
                style={[
                  styles.sessionChipText,
                  selectedSessionId === session.id && styles.selectedSessionChipText,
                ]}
              >
                {session.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {currentSession && (
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>{currentSession.title}</Text>
          <Text style={styles.sessionDetails}>
            {new Date(currentSession.dateTime).toLocaleDateString()} • {currentSession.room}
          </Text>
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Users size={20} color="#3B82F6" />
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Check size={20} color="#10B981" />
          <Text style={styles.statValue}>{stats.present}</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={styles.statItem}>
          <X size={20} color="#EF4444" />
          <Text style={styles.statValue}>{stats.absent}</Text>
          <Text style={styles.statLabel}>Absent</Text>
        </View>
        <View style={styles.statItem}>
          <Clock size={20} color="#F59E0B" />
          <Text style={styles.statValue}>{stats.onDuty}</Text>
          <Text style={styles.statLabel}>On Duty</Text>
        </View>
      </View>

      {/* Search */}
      <SimpleSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search students..."
      />

      {/* Attendance List */}
      <ScrollView style={styles.attendanceList}>
        {filteredStudentsWithSearch.map((student) => {
          const studentAttendance = sessionAttendance.find(a => a.studentId === student.id);
          return (
            <AttendanceItem
              key={student.id}
              student={student}
              currentStatus={studentAttendance?.status}
              onStatusChange={handleStatusChange}
            />
          );
        })}
        
        {filteredStudentsWithSearch.length === 0 && (
          <View style={styles.emptyState}>
            <Users size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No students found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search' : 'Add students to get started'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  sessionSelector: {
    maxHeight: 50,
  },
  sessionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  selectedSessionChip: {
    backgroundColor: '#3B82F6',
  },
  sessionChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedSessionChipText: {
    color: 'white',
  },
  sessionInfo: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sessionDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  attendanceList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  attendanceItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  studentInfo: {
    marginBottom: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  studentDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
});