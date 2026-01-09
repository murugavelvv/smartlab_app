import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TrendingUp, Users, Calendar, BarChart3, CheckCircle, XCircle, Clock, PieChart, Activity } from 'lucide-react-native';
import { useApp, useFilteredStudents } from '@/providers/AppProvider';
import { PerformanceChart } from '@/components/PerformanceChart';
import { EnhancedStatCard } from '@/components/EnhancedStatCard';

export default function AnalyticsScreen() {
  const { sessions, attendance } = useApp();
  const students = useFilteredStudents();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('month');

  const getTimeRangeData = () => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'semester':
        startDate.setMonth(now.getMonth() - 6);
        break;
    }

    return sessions.filter(session => 
      new Date(session.dateTime) >= startDate && new Date(session.dateTime) <= now
    );
  };

  const timeRangeSessions = getTimeRangeData();
  const totalAttendanceRecords = timeRangeSessions.reduce((acc, session) => {
    return acc + (attendance[session.id]?.length || 0);
  }, 0);

  const presentRecords = timeRangeSessions.reduce((acc, session) => {
    const sessionAttendance = attendance[session.id] || [];
    return acc + sessionAttendance.filter(a => a.status === 'Present').length;
  }, 0);

  const averageAttendanceRate = totalAttendanceRecords > 0 
    ? Math.round((presentRecords / totalAttendanceRecords) * 100)
    : 0;

  const departmentStats = students.reduce((acc, student) => {
    if (!acc[student.department]) {
      acc[student.department] = { total: 0, present: 0 };
    }
    acc[student.department].total++;
    
    const studentAttendance = timeRangeSessions.reduce((studentAcc, session) => {
      const sessionAttendance = attendance[session.id] || [];
      const studentRecord = sessionAttendance.find(a => a.studentId === student.id);
      return studentAcc + (studentRecord?.status === 'Present' ? 1 : 0);
    }, 0);
    
    acc[student.department].present += studentAttendance;
    return acc;
  }, {} as Record<string, { total: number; present: number }>);

  const chartData = Object.entries(departmentStats).map(([dept, stats]) => ({
    label: dept,
    value: stats.total > 0 ? Math.round((stats.present / (stats.total * timeRangeSessions.length)) * 100) : 0,
  }));

  const topPerformers = students
    .map(student => {
      const studentAttendance = timeRangeSessions.reduce((acc, session) => {
        const sessionAttendance = attendance[session.id] || [];
        const studentRecord = sessionAttendance.find(a => a.studentId === student.id);
        return acc + (studentRecord?.status === 'Present' ? 1 : 0);
      }, 0);
      
      const attendanceRate = timeRangeSessions.length > 0 
        ? Math.round((studentAttendance / timeRangeSessions.length) * 100)
        : 0;
      
      return { ...student, attendanceRate };
    })
    .sort((a, b) => b.attendanceRate - a.attendanceRate)
    .slice(0, 5);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Performance Insights</Text>
        </View>

        <View style={styles.timeRangeContainer}>
          {(['week', 'month', 'semester'] as const).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                timeRange === range && styles.timeRangeButtonActive
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text style={[
                styles.timeRangeText,
                timeRange === range && styles.timeRangeTextActive
              ]}>
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsGrid}>
          <EnhancedStatCard
            title="Avg Attendance"
            value={`${averageAttendanceRate}%`}
            icon={TrendingUp}
            color="#10B981"
            trend={averageAttendanceRate > 80 ? '+5%' : '-2%'}
            subtitle="Overall performance"
          />
          <EnhancedStatCard
            title="Active Students"
            value={students.length.toString()}
            icon={Users}
            color="#3B82F6"
            subtitle="Enrolled students"
          />
          <EnhancedStatCard
            title="Sessions Held"
            value={timeRangeSessions.length.toString()}
            icon={Calendar}
            color="#8B5CF6"
            subtitle={`In ${timeRange}`}
          />
          <EnhancedStatCard
            title="Total Records"
            value={totalAttendanceRecords.toString()}
            icon={BarChart3}
            color="#F59E0B"
            subtitle="Attendance entries"
          />
        </View>

        {/* Attendance Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Attendance Breakdown</Text>
          <View style={styles.breakdownContainer}>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownIcon, { backgroundColor: '#10B981' }]}>
                <CheckCircle size={20} color="white" />
              </View>
              <Text style={styles.breakdownLabel}>Present</Text>
              <Text style={styles.breakdownValue}>{presentRecords}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownIcon, { backgroundColor: '#EF4444' }]}>
                <XCircle size={20} color="white" />
              </View>
              <Text style={styles.breakdownLabel}>Absent</Text>
              <Text style={styles.breakdownValue}>{totalAttendanceRecords - presentRecords}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownIcon, { backgroundColor: '#F59E0B' }]}>
                <Clock size={20} color="white" />
              </View>
              <Text style={styles.breakdownLabel}>Total</Text>
              <Text style={styles.breakdownValue}>{totalAttendanceRecords}</Text>
            </View>
          </View>
        </View>

        {/* Department Performance */}
        {chartData.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Department Performance</Text>
            <PerformanceChart data={chartData} />
            <View style={styles.departmentList}>
              {Object.entries(departmentStats).map(([dept, stats]) => {
                const rate = stats.total > 0 ? Math.round((stats.present / (stats.total * timeRangeSessions.length)) * 100) : 0;
                return (
                  <View key={dept} style={styles.departmentItem}>
                    <Text style={styles.departmentName}>{dept}</Text>
                    <View style={styles.departmentStats}>
                      <Text style={styles.departmentStudents}>{stats.total} students</Text>
                      <Text style={[styles.departmentRate, { color: rate >= 80 ? '#10B981' : rate >= 60 ? '#F59E0B' : '#EF4444' }]}>
                        {rate}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Session Performance */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Session Performance</Text>
          {timeRangeSessions.slice(0, 5).map(session => {
            const sessionAttendance = attendance[session.id] || [];
            const presentCount = sessionAttendance.filter(a => a.status === 'Present').length;
            const totalCount = sessionAttendance.length;
            const rate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
            
            return (
              <View key={session.id} style={styles.sessionItem}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionTitle}>{session.title}</Text>
                  <Text style={styles.sessionDetails}>
                    {session.courseCode} • {new Date(session.dateTime).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.sessionStats}>
                  <Text style={styles.sessionAttendance}>{presentCount}/{totalCount}</Text>
                  <Text style={[styles.sessionRate, { color: rate >= 80 ? '#10B981' : rate >= 60 ? '#F59E0B' : '#EF4444' }]}>
                    {rate}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {topPerformers.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Top Performers</Text>
            {topPerformers.map((student, index) => (
              <View key={student.id} style={styles.performerItem}>
                <View style={styles.performerRank}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <View style={styles.performerInfo}>
                  <Text style={styles.performerName}>{student.name}</Text>
                  <Text style={styles.performerDetails}>
                    {student.rollNumber} • {student.department}
                  </Text>
                </View>
                <View style={styles.performerRate}>
                  <Text style={styles.rateText}>{student.attendanceRate}%</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {timeRangeSessions.length === 0 && (
          <View style={styles.emptyState}>
            <BarChart3 size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Data Available</Text>
            <Text style={styles.emptySubtitle}>
              No sessions found for the selected time range. Create some lab sessions to see analytics.
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
  timeRangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeRangeButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  timeRangeTextActive: {
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  card: {
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
  performerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  performerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  performerDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  performerRate: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  breakdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  breakdownItem: {
    alignItems: 'center',
    gap: 8,
  },
  breakdownIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  breakdownValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  departmentList: {
    marginTop: 16,
    gap: 8,
  },
  departmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  departmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  departmentStats: {
    alignItems: 'flex-end',
  },
  departmentStudents: {
    fontSize: 12,
    color: '#6B7280',
  },
  departmentRate: {
    fontSize: 16,
    fontWeight: 'bold',
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
    fontWeight: '600',
    color: '#111827',
  },
  sessionDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  sessionStats: {
    alignItems: 'flex-end',
  },
  sessionAttendance: {
    fontSize: 14,
    color: '#6B7280',
  },
  sessionRate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
});