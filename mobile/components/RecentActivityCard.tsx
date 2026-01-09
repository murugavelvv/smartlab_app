import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Clock } from 'lucide-react-native';
import { LabSession, Attendance } from '@/types';

interface RecentActivityCardProps {
  sessions: LabSession[];
  attendance: Record<string, Attendance[]>;
}

export default function RecentActivityCard({ sessions, attendance }: RecentActivityCardProps) {
  const recentActivities = sessions
    .map(session => {
      const sessionAttendance = attendance[session.id] || [];
      const lastActivity = sessionAttendance.length > 0 
        ? Math.max(...sessionAttendance.map(a => new Date(a.timestamp).getTime()))
        : new Date(session.createdAt).getTime();
      
      return {
        session,
        lastActivity,
        attendanceCount: sessionAttendance.length,
      };
    })
    .sort((a, b) => b.lastActivity - a.lastActivity)
    .slice(0, 3);

  if (recentActivities.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      {recentActivities.map(({ session, attendanceCount }) => (
        <View key={session.id} style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Clock size={16} color="#6B7280" />
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>{session.title}</Text>
            <Text style={styles.activityDetails}>
              {attendanceCount} attendance records • {session.courseCode}
            </Text>
            <Text style={styles.activityTime}>
              {new Date(session.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  activityDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});