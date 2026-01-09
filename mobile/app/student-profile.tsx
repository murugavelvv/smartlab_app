import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Edit, Trash2, Mail, Phone, GraduationCap, Calendar, User, TrendingUp } from 'lucide-react-native';
import { useApp } from '@/providers/AppProvider';

export default function StudentProfileScreen() {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const { students, sessions, attendance, deleteStudent } = useApp();
  
  const student = students.find(s => s.id === studentId);

  if (!student) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Student not found</Text>
      </SafeAreaView>
    );
  }

  const studentAttendance = Object.entries(attendance).reduce((acc, [sessionId, records]) => {
    const studentRecord = records.find(r => r.studentId === studentId);
    if (studentRecord) {
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        acc.push({
          session,
          record: studentRecord,
        });
      }
    }
    return acc;
  }, [] as Array<{ session: any; record: any }>);

  const totalSessions = studentAttendance.length;
  const presentCount = studentAttendance.filter(a => a.record.status === 'Present').length;
  const lateCount = studentAttendance.filter(a => a.record.status === 'Late').length;
  const absentCount = studentAttendance.filter(a => a.record.status === 'Absent').length;
  const attendanceRate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

  const handleEdit = () => {
    router.push({
      pathname: '/student-form',
      params: { studentId: student.id }
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Student',
      `Are you sure you want to delete ${student.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStudent(student.id);
              Alert.alert('Success', 'Student deleted successfully');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete student');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Profile</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Edit size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <User size={48} color="#6B7280" />
          </View>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.rollNumber}>{student.rollNumber}</Text>
          <View style={styles.yearBadge}>
            <Text style={styles.yearText}>Year {student.year}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <View style={styles.infoItem}>
            <Mail size={20} color="#6B7280" />
            <Text style={styles.infoText}>{student.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Phone size={20} color="#6B7280" />
            <Text style={styles.infoText}>{student.phone}</Text>
          </View>
          <View style={styles.infoItem}>
            <GraduationCap size={20} color="#6B7280" />
            <Text style={styles.infoText}>{student.department}</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Attendance Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{attendanceRate}%</Text>
              <Text style={styles.statLabel}>Overall Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{presentCount}</Text>
              <Text style={styles.statLabel}>Present</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{lateCount}</Text>
              <Text style={styles.statLabel}>Late</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{absentCount}</Text>
              <Text style={styles.statLabel}>Absent</Text>
            </View>
          </View>
        </View>

        {studentAttendance.length > 0 && (
          <View style={styles.historyCard}>
            <Text style={styles.cardTitle}>Recent Attendance</Text>
            {studentAttendance.slice(0, 5).map(({ session, record }) => (
              <View key={session.id} style={styles.historyItem}>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>{session.title}</Text>
                  <Text style={styles.historyDetails}>
                    {session.courseCode} • {new Date(session.dateTime).toLocaleDateString()}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(record.status) + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(record.status) }
                  ]}>
                    {record.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.metaCard}>
          <Text style={styles.cardTitle}>Account Details</Text>
          <View style={styles.metaItem}>
            <Calendar size={16} color="#6B7280" />
            <Text style={styles.metaText}>
              Created: {new Date(student.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <TrendingUp size={16} color="#6B7280" />
            <Text style={styles.metaText}>
              Last Updated: {new Date(student.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Present': return '#10B981';
    case 'Absent': return '#EF4444';
    case 'Late': return '#F59E0B';
    default: return '#6B7280';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
    fontWeight: '500',
    marginBottom: 12,
  },
  yearBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  yearText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
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
  infoText: {
    fontSize: 16,
    color: '#374151',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  historyDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
});