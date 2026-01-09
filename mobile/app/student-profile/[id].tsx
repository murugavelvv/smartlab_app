import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useApp } from '@/providers/AppProvider';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react-native';

export default function StudentProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { students, sessions, attendance } = useApp();
  
  const student = students.find(s => s.id === id);
  
  const studentStats = useMemo(() => {
    if (!student) return { totalSessions: 0, attended: 0, absent: 0, onDuty: 0, attendanceRate: 0 };
    
    const allAttendance = Object.values(attendance).flat();
    const studentAttendance = allAttendance.filter(a => a.studentId === student.id);
    
    const attended = studentAttendance.filter(a => a.status === 'Present').length;
    const absent = studentAttendance.filter(a => a.status === 'Absent').length;
    const onDuty = studentAttendance.filter(a => a.status === 'On Duty').length;
    const totalSessions = studentAttendance.length;
    const attendanceRate = totalSessions > 0 ? (attended / totalSessions) * 100 : 0;
    
    return { totalSessions, attended, absent, onDuty, attendanceRate };
  }, [student, attendance]);

  const recentSessions = useMemo(() => {
    if (!student) return [];
    
    const studentAttendanceRecords = Object.entries(attendance)
      .flatMap(([sessionId, records]) => 
        records
          .filter(record => record.studentId === student.id)
          .map(record => ({
            ...record,
            session: sessions.find(s => s.id === sessionId)
          }))
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
    
    return studentAttendanceRecords;
  }, [student, attendance, sessions]);

  if (!student) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Student Not Found' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Student not found</Text>
        </View>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return '#10B981';
      case 'Absent': return '#EF4444';
      case 'On Duty': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present': return <CheckCircle size={16} color="#10B981" />;
      case 'Absent': return <XCircle size={16} color="#EF4444" />;
      case 'On Duty': return <Clock size={16} color="#F59E0B" />;
      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: student.name }} />
      
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {student.photoPath ? (
              <Image source={{ uri: student.photoPath }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={48} color="#6B7280" />
              </View>
            )}
          </View>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.rollNumber}>{student.rollNumber}</Text>
          <View style={[styles.statusBadge, { backgroundColor: student.isActive ? '#10B981' : '#6B7280' }]}>
            <Text style={styles.statusText}>{student.isActive ? 'Active' : 'Inactive'}</Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoItem}>
            <Mail size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{student.email}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Phone size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{student.phone}</Text>
            </View>
          </View>
        </View>

        {/* Academic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Information</Text>
          <View style={styles.infoItem}>
            <Building size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{student.department}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Calendar size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Year</Text>
              <Text style={styles.infoValue}>Year {student.year}</Text>
            </View>
          </View>
        </View>

        {/* Attendance Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <TrendingUp size={24} color="#3B82F6" />
              <Text style={styles.statValue}>{studentStats.attendanceRate.toFixed(1)}%</Text>
              <Text style={styles.statLabel}>Attendance Rate</Text>
            </View>
            <View style={styles.statCard}>
              <CheckCircle size={24} color="#10B981" />
              <Text style={styles.statValue}>{studentStats.attended}</Text>
              <Text style={styles.statLabel}>Present</Text>
            </View>
            <View style={styles.statCard}>
              <XCircle size={24} color="#EF4444" />
              <Text style={styles.statValue}>{studentStats.absent}</Text>
              <Text style={styles.statLabel}>Absent</Text>
            </View>
            <View style={styles.statCard}>
              <Clock size={24} color="#F59E0B" />
              <Text style={styles.statValue}>{studentStats.onDuty}</Text>
              <Text style={styles.statLabel}>On Duty</Text>
            </View>
          </View>
        </View>

        {/* Recent Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          {recentSessions.length > 0 ? (
            recentSessions.map((record, index) => (
              <View key={index} style={styles.sessionItem}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionTitle}>{record.session?.title || 'Unknown Session'}</Text>
                  <Text style={styles.sessionDate}>
                    {new Date(record.timestamp).toLocaleDateString()} • {record.session?.room}
                  </Text>
                  {record.remarks && (
                    <Text style={styles.sessionRemarks}>{record.remarks}</Text>
                  )}
                </View>
                <View style={styles.sessionStatus}>
                  {getStatusIcon(record.status)}
                  <Text style={[styles.sessionStatusText, { color: getStatusColor(record.status) }]}>
                    {record.status}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateText}>No session records found</Text>
            </View>
          )}
        </View>

        {/* Account Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          <View style={styles.infoItem}>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Created</Text>
              <Text style={styles.infoValue}>
                {new Date(student.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>
                {new Date(student.updatedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  rollNumber: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  sessionDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  sessionRemarks: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 2,
  },
  sessionStatus: {
    alignItems: 'center',
    gap: 4,
  },
  sessionStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
  },
});