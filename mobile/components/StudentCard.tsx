import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Mail, Phone, GraduationCap, User } from 'lucide-react-native';
import { Student } from '@/types';

interface StudentCardProps {
  student: Student;
  onPress: () => void;
}

export default function StudentCard({ student, onPress }: StudentCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User size={24} color="#6B7280" />
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.rollNumber}>{student.rollNumber}</Text>
        </View>
        <View style={styles.yearBadge}>
          <Text style={styles.yearText}>Y{student.year}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <GraduationCap size={16} color="#6B7280" />
          <Text style={styles.detailText}>{student.department}</Text>
        </View>
        <View style={styles.detailRow}>
          <Mail size={16} color="#6B7280" />
          <Text style={styles.detailText}>{student.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Phone size={16} color="#6B7280" />
          <Text style={styles.detailText}>{student.phone}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  rollNumber: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  yearBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  yearText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  details: {
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
});