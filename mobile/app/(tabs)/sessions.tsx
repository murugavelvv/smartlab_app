import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, Calendar, Clock, MapPin, User, MoreVertical, Edit3, Trash2 } from 'lucide-react-native';
import { useApp, useUpcomingSessions } from '@/providers/AppProvider';
import { Alert } from 'react-native';

export default function SessionsScreen() {
  const { sessions, setSelectedSession, deleteSession } = useApp();
  const upcomingSessions = useUpcomingSessions();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const pastSessions = sessions
    .filter(session => new Date(session.dateTime) <= new Date())
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const getFilteredSessions = () => {
    switch (filter) {
      case 'upcoming':
        return upcomingSessions;
      case 'past':
        return pastSessions;
      default:
        return [...upcomingSessions, ...pastSessions];
    }
  };

  const filteredSessions = getFilteredSessions();

  const handleSessionPress = (session: any) => {
    setSelectedSession(session.id);
    router.push({
      pathname: '/live-attendance',
      params: { sessionId: session.id }
    });
  };

  const handleEditSession = (session: any) => {
    router.push({
      pathname: '/session-form',
      params: { sessionId: session.id }
    });
  };

  const handleDeleteSession = (session: any) => {
    Alert.alert(
      'Delete Session',
      `Are you sure you want to delete "${session.title}"? This will also remove all attendance records for this session.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSession(session.id)
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lab Sessions</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/session-form')}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {(['all', 'upcoming', 'past'] as const).map((filterOption) => (
          <TouchableOpacity
            key={filterOption}
            style={[
              styles.filterButton,
              filter === filterOption && styles.filterButtonActive
            ]}
            onPress={() => setFilter(filterOption)}
          >
            <Text style={[
              styles.filterButtonText,
              filter === filterOption && styles.filterButtonTextActive
            ]}>
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredSessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Sessions Found</Text>
            <Text style={styles.emptySubtitle}>
              {sessions.length === 0 
                ? "Create your first lab session to get started"
                : `No ${filter} sessions available`
              }
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/session-form')}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.emptyButtonText}>Create Session</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.sessionsList}>
            {filteredSessions.map(session => {
              const isUpcoming = new Date(session.dateTime) > new Date();
              return (
                <TouchableOpacity
                  key={session.id}
                  style={[
                    styles.sessionCard,
                    !isUpcoming && styles.pastSessionCard
                  ]}
                  onPress={() => handleSessionPress(session)}
                >
                  <View style={styles.sessionHeader}>
                    <View style={styles.sessionTitleContainer}>
                      <Text style={[
                        styles.sessionTitle,
                        !isUpcoming && styles.pastSessionTitle
                      ]}>
                        {session.title}
                      </Text>
                      <Text style={styles.sessionCourse}>{session.courseCode}</Text>
                    </View>
                    <View style={styles.sessionHeaderRight}>
                      <View style={[
                        styles.statusBadge,
                        isUpcoming ? styles.upcomingBadge : styles.pastBadge
                      ]}>
                        <Text style={[
                          styles.statusText,
                          isUpcoming ? styles.upcomingText : styles.pastText
                        ]}>
                          {isUpcoming ? 'Upcoming' : 'Completed'}
                        </Text>
                      </View>
                      <View style={styles.sessionActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleEditSession(session)}
                        >
                          <Edit3 size={16} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDeleteSession(session)}
                        >
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <View style={styles.sessionDetails}>
                    <View style={styles.detailRow}>
                      <User size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{session.instructor}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.detailText}>
                        {new Date(session.dateTime).toLocaleString()} • {session.durationMinutes}min
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MapPin size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{session.room}</Text>
                    </View>
                  </View>

                  {session.notes && (
                    <Text style={styles.sessionNotes}>{session.notes}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#10B981',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  sessionsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pastSessionCard: {
    opacity: 0.8,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionTitleContainer: {
    flex: 1,
  },
  sessionHeaderRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  pastSessionTitle: {
    color: '#6B7280',
  },
  sessionCourse: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingBadge: {
    backgroundColor: '#DBEAFE',
  },
  pastBadge: {
    backgroundColor: '#F3F4F6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  upcomingText: {
    color: '#1D4ED8',
  },
  pastText: {
    color: '#6B7280',
  },
  sessionDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  sessionNotes: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
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
    marginBottom: 32,
    lineHeight: 24,
  },
  emptyButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});