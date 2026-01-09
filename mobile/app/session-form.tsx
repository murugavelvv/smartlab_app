import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Save, X, Calendar, Clock, ChevronDown } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '@/providers/AppProvider';

export default function SessionFormScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const { sessions, addSession, updateSession } = useApp();
  
  const [formData, setFormData] = useState({
    title: '',
    courseCode: '',
    instructor: '',
    date: new Date(),
    time: new Date(),
    durationMinutes: 120,
    room: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'date' | 'time'>('date');
  const slideAnim = new Animated.Value(0);
  const isEditing = !!sessionId;

  useEffect(() => {
    if (isEditing && sessionId) {
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        const sessionDate = new Date(session.dateTime);
        setFormData({
          title: session.title,
          courseCode: session.courseCode,
          instructor: session.instructor,
          date: sessionDate,
          time: sessionDate,
          durationMinutes: session.durationMinutes,
          room: session.room,
          notes: session.notes || '',
        });
      }
    }
  }, [isEditing, sessionId, sessions]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: activeTab === 'date' ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [activeTab, slideAnim]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Session title is required';
    }

    if (!formData.courseCode.trim()) {
      newErrors.courseCode = 'Course code is required';
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Instructor name is required';
    }

    const combinedDateTime = new Date(
      formData.date.getFullYear(),
      formData.date.getMonth(),
      formData.date.getDate(),
      formData.time.getHours(),
      formData.time.getMinutes()
    );

    if (combinedDateTime < new Date()) {
      newErrors.dateTime = 'Session cannot be scheduled in the past';
    }

    if (formData.durationMinutes < 30 || formData.durationMinutes > 480) {
      newErrors.durationMinutes = 'Duration must be between 30 and 480 minutes';
    }

    if (!formData.room.trim()) {
      newErrors.room = 'Room/Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const combinedDateTime = new Date(
        formData.date.getFullYear(),
        formData.date.getMonth(),
        formData.date.getDate(),
        formData.time.getHours(),
        formData.time.getMinutes()
      );

      const sessionData = {
        title: formData.title,
        courseCode: formData.courseCode,
        instructor: formData.instructor,
        dateTime: combinedDateTime.toISOString(),
        durationMinutes: formData.durationMinutes,
        room: formData.room,
        notes: formData.notes,
      };

      if (isEditing && sessionId) {
        await updateSession(sessionId, sessionData);
        Alert.alert('Success', 'Session updated successfully!');
      } else {
        await addSession(sessionData);
        Alert.alert('Success', 'Session created successfully!');
      }
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save session. Please try again.');
    }
  };

  const durations = [
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '1.5 hours', value: 90 },
    { label: '2 hours', value: 120 },
    { label: '3 hours', value: 180 },
    { label: '4 hours', value: 240 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditing ? 'Edit Session' : 'New Session'}
        </Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Session Title *</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="e.g., Data Structures Lab"
              placeholderTextColor="#9CA3AF"
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course Code *</Text>
            <TextInput
              style={[styles.input, errors.courseCode && styles.inputError]}
              value={formData.courseCode}
              onChangeText={(text) => setFormData({ ...formData, courseCode: text })}
              placeholder="e.g., CS301"
              placeholderTextColor="#9CA3AF"
            />
            {errors.courseCode && <Text style={styles.errorText}>{errors.courseCode}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Instructor *</Text>
            <TextInput
              style={[styles.input, errors.instructor && styles.inputError]}
              value={formData.instructor}
              onChangeText={(text) => setFormData({ ...formData, instructor: text })}
              placeholder="Enter instructor name"
              placeholderTextColor="#9CA3AF"
            />
            {errors.instructor && <Text style={styles.errorText}>{errors.instructor}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date & Time *</Text>
            
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'date' && styles.activeTab]}
                onPress={() => setActiveTab('date')}
              >
                <Calendar size={16} color={activeTab === 'date' ? '#FFFFFF' : '#6B7280'} />
                <Text style={[styles.tabText, activeTab === 'date' && styles.activeTabText]}>Date</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'time' && styles.activeTab]}
                onPress={() => setActiveTab('time')}
              >
                <Clock size={16} color={activeTab === 'time' ? '#FFFFFF' : '#6B7280'} />
                <Text style={[styles.tabText, activeTab === 'time' && styles.activeTabText]}>Time</Text>
              </TouchableOpacity>
            </View>

            <Animated.View style={[
              styles.dateTimePickerContainer,
              {
                transform: [{
                  translateX: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -50],
                  })
                }],
                opacity: slideAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0.5, 1],
                })
              }
            ]}>
              {activeTab === 'date' ? (
                <TouchableOpacity
                  style={[styles.dateTimeButton, errors.dateTime && styles.inputError]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Calendar size={20} color="#10B981" />
                  <Text style={styles.dateTimeButtonText}>
                    {formData.date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Text>
                  <ChevronDown size={20} color="#6B7280" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.dateTimeButton, errors.dateTime && styles.inputError]}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Clock size={20} color="#10B981" />
                  <Text style={styles.dateTimeButtonText}>
                    {formData.time.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </Text>
                  <ChevronDown size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
            </Animated.View>
            
            {errors.dateTime && <Text style={styles.errorText}>{errors.dateTime}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration *</Text>
            <View style={styles.durationGrid}>
              {durations.map((duration) => (
                <TouchableOpacity
                  key={duration.value}
                  style={[
                    styles.durationOption,
                    formData.durationMinutes === duration.value && styles.durationOptionActive
                  ]}
                  onPress={() => setFormData({ ...formData, durationMinutes: duration.value })}
                >
                  <Clock size={16} color={formData.durationMinutes === duration.value ? "#FFFFFF" : "#6B7280"} />
                  <Text style={[
                    styles.durationOptionText,
                    formData.durationMinutes === duration.value && styles.durationOptionTextActive
                  ]}>
                    {duration.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.durationMinutes && <Text style={styles.errorText}>{errors.durationMinutes}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Room/Location *</Text>
            <TextInput
              style={[styles.input, errors.room && styles.inputError]}
              value={formData.room}
              onChangeText={(text) => setFormData({ ...formData, room: text })}
              placeholder="e.g., Lab 101, Building A"
              placeholderTextColor="#9CA3AF"
            />
            {errors.room && <Text style={styles.errorText}>{errors.room}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.textArea]}
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Additional notes or instructions..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={formData.date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selectedDate) {
              setFormData({ ...formData, date: selectedDate });
            }
          }}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={formData.time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowTimePicker(Platform.OS === 'ios');
            if (selectedTime) {
              setFormData({ ...formData, time: selectedTime });
            }
          }}
        />
      )}
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
    backgroundColor: '#10B981',
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  dateTimePickerContainer: {
    marginBottom: 8,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  dateTimeButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  durationOptionActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  durationOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  durationOptionTextActive: {
    color: '#FFFFFF',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    height: 100,
  },
});