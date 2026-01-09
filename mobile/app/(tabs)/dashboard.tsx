import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Users, Calendar, TrendingUp, Clock, Plus, BookOpen, ClipboardCheck, Briefcase, UserCheck, FileText, Download } from 'lucide-react-native';
import { useApp, useFilteredStudents, useUpcomingSessions } from '@/providers/AppProvider';
import StatCard from '@/components/StatCard';
import RecentActivityCard from '@/components/RecentActivityCard';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { sessions, attendance, isLoading, errorMessage } = useApp();
  const students = useFilteredStudents();
  const upcomingSessions = useUpcomingSessions();

  const totalSessions = sessions.length;
  
  const todaysSessions = sessions.filter(session => {
    const sessionDate = new Date(session.dateTime);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  });

  const todaysAttendanceRate = todaysSessions.length > 0 
    ? Math.round((todaysSessions.reduce((acc: number, session: { id: string; dateTime: string }) => {
        const sessionAttendance = attendance[session.id] || [];
        const presentCount = sessionAttendance.filter((a: { status: string }) => a.status === 'Present').length;
        return acc + (presentCount / Math.max(students.length, 1));
      }, 0) / todaysSessions.length) * 100)
    : 0;

  const quickActions = [
    {
      title: 'Add Student',
      icon: Users,
      color: '#3B82F6',
      onPress: () => router.push('/student-form'),
    },
    {
      title: 'New Session',
      icon: Calendar,
      color: '#10B981',
      onPress: () => router.push('/session-form'),
    },
    {
      title: 'Take Attendance',
      icon: ClipboardCheck,
      color: '#F59E0B',
      onPress: () => router.push('/(tabs)/attendance'),
    },
    {
      title: 'Assign Work',
      icon: Briefcase,
      color: '#8B5CF6',
      onPress: () => router.push('/(tabs)/work'),
    },
    {
      title: 'Session Records',
      icon: FileText,
      color: '#06B6D4',
      onPress: () => router.push('/session-records'),
    },
    {
      title: 'Manage Staff',
      icon: UserCheck,
      color: '#10B981',
      onPress: () => router.push('/(tabs)/staff'),
    },
    {
      title: 'Export Data',
      icon: Download,
      color: '#EF4444',
      onPress: () => router.push('/(tabs)/settings'),
    },
    {
      title: 'View Analytics',
      icon: TrendingUp,
      color: '#8B5CF6',
      onPress: () => router.push('/(tabs)/analytics'),
    },
  ];

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Error: {errorMessage}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Smart Lab Analyzer</Text>
          <Text style={styles.subtitle}>Dashboard Overview</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Total Students"
            value={students.length.toString()}
            icon={Users}
            color="#3B82F6"
            trend="+12%"
          />
          <StatCard
            title="Lab Sessions"
            value={totalSessions.toString()}
            icon={BookOpen}
            color="#10B981"
            trend="+8%"
          />
          <StatCard
            title="Upcoming"
            value={upcomingSessions.length.toString()}
            icon={Clock}
            color="#F59E0B"
          />
          <StatCard
            title="Today's Rate"
            value={`${todaysAttendanceRate}%`}
            icon={TrendingUp}
            color="#8B5CF6"
            trend={todaysAttendanceRate > 80 ? '+5%' : '-2%'}
          />
        </View>

        {/* Enhanced Quick Actions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Quick Actions</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.title}
                style={styles.quickActionItem}
                onPress={action.onPress}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <action.icon size={24} color="white" />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Student Add */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Quick Student Add</Text>
            <TouchableOpacity 
              style={styles.quickAddButton}
              onPress={() => router.push('/student-form')}
            >
              <Plus size={16} color="white" />
              <Text style={styles.quickAddButtonText}>Add Student</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.quickAddDescription}>
            Quickly add new students to the system with just a few taps. All required information can be filled in a simple form.
          </Text>
        </View>

        <RecentActivityCard 
          sessions={sessions.slice(0, 3)}
          attendance={attendance}
        />

        {upcomingSessions.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Upcoming Sessions</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/sessions')}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            {upcomingSessions.slice(0, 3).map(session => (
              <TouchableOpacity
                key={session.id}
                style={styles.sessionItem}
                onPress={() => {
                  router.push({
                    pathname: '/live-attendance',
                    params: { sessionId: session.id }
                  });
                }}
              >
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionTitle}>{session.title}</Text>
                  <Text style={styles.sessionDetails}>
                    {session.courseCode} • {session.room}
                  </Text>
                  <Text style={styles.sessionTime}>
                    {new Date(session.dateTime).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.sessionAction}>
                  <Plus size={20} color="#6B7280" />
                </View>
              </TouchableOpacity>
            ))}
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  viewAll: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  sessionItem: {
    flexDirection: 'row',
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
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sessionDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  sessionTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  sessionAction: {
    padding: 8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickActionItem: {
    alignItems: 'center',
    width: '22%',
    minWidth: 80,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  quickAddButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  quickAddDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});