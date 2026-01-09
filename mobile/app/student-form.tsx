import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Save, X } from 'lucide-react-native';
import { useApp } from '@/providers/AppProvider';
import { Student } from '@/types';

export default function StudentFormScreen() {
  const { studentId } = useLocalSearchParams<{ studentId?: string }>();
  const { students, addStudent, updateStudent } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    department: '',
    year: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = !!studentId;

  useEffect(() => {
    if (isEditing && studentId) {
      const student = students.find(s => s.id === studentId);
      if (student) {
        setFormData({
          name: student.name,
          rollNumber: student.rollNumber,
          email: student.email,
          phone: student.phone,
          department: student.department,
          year: student.year,
        });
      }
    }
  }, [isEditing, studentId, students]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    } else {
      const existingStudent = students.find(s => 
        s.rollNumber === formData.rollNumber && s.id !== studentId
      );
      if (existingStudent) {
        newErrors.rollNumber = 'Roll number already exists';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (formData.year < 1 || formData.year > 5) {
      newErrors.year = 'Year must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && studentId) {
        await updateStudent(studentId, formData);
        Alert.alert('Success', 'Student updated successfully!');
      } else {
        await addStudent({
          ...formData,
          isActive: true,
        });
        Alert.alert('Success', 'Student added successfully!');
      }
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save student. Please try again.');
    }
  };

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil',
    'Chemical',
    'Electrical',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditing ? 'Edit Student' : 'Add Student'}
        </Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter student's full name"
              placeholderTextColor="#9CA3AF"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Roll Number *</Text>
            <TextInput
              style={[styles.input, errors.rollNumber && styles.inputError]}
              value={formData.rollNumber}
              onChangeText={(text) => setFormData({ ...formData, rollNumber: text })}
              placeholder="Enter roll number"
              placeholderTextColor="#9CA3AF"
            />
            {errors.rollNumber && <Text style={styles.errorText}>{errors.rollNumber}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter email address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Department *</Text>
            <View style={styles.departmentGrid}>
              {departments.map((dept) => (
                <TouchableOpacity
                  key={dept}
                  style={[
                    styles.departmentOption,
                    formData.department === dept && styles.departmentOptionActive
                  ]}
                  onPress={() => setFormData({ ...formData, department: dept })}
                >
                  <Text style={[
                    styles.departmentOptionText,
                    formData.department === dept && styles.departmentOptionTextActive
                  ]}>
                    {dept}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.department && <Text style={styles.errorText}>{errors.department}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year *</Text>
            <View style={styles.yearGrid}>
              {[1, 2, 3, 4, 5].map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearOption,
                    formData.year === year && styles.yearOptionActive
                  ]}
                  onPress={() => setFormData({ ...formData, year })}
                >
                  <Text style={[
                    styles.yearOptionText,
                    formData.year === year && styles.yearOptionTextActive
                  ]}>
                    Year {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
          </View>
        </View>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  departmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  departmentOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  departmentOptionActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  departmentOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  departmentOptionTextActive: {
    color: '#FFFFFF',
  },
  yearGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  yearOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  yearOptionActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  yearOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  yearOptionTextActive: {
    color: '#FFFFFF',
  },
});