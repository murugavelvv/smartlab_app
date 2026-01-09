import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Stack } from 'expo-router';
import { useApp } from '@/providers/AppProvider';
import { SessionRecord, Student, LabSession } from '@/types';
import { SimpleSearchBar } from '@/components/SimpleSearchBar';
import { 
  Users, 
  Calendar, 
  Code, 
  FileText, 
  CheckSquare,
  Edit3,
  Plus,
  Award
} from 'lucide-react-native';

export default function SessionRecordsPage() {
  const { students, sessions } = useApp();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSession, setSelectedSession] = useState<LabSession | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sessionRecords, setSessionRecords] = useState<SessionRecord[]>([]);
  const [showRecordModal, setShowRecordModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<SessionRecord | null>(null);
  
  // Form states
  const [recordForm, setRecordForm] = useState({
    programsCompleted: '',
    outputsGenerated: '',
    recordsSubmitted: false,
    observationSigned: false,
    notes: '',
  });

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  const studentSessions = useMemo(() => {
    if (!selectedStudent) return [];
    return sessions.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [selectedStudent, sessions]);

  const getSessionRecord = (sessionId: string, studentId: string) => {
    return sessionRecords.find(record => 
      record.sessionId === sessionId && record.studentId === studentId
    );
  };

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const saveRecord = () => {
    if (!selectedStudent || !selectedSession) return;
    
    const recordData = {
      id: editingRecord?.id || generateId(),
      sessionId: selectedSession.id,
      studentId: selectedStudent.id,
      programsCompleted: parseInt(recordForm.programsCompleted) || 0,
      outputsGenerated: parseInt(recordForm.outputsGenerated) || 0,
      recordsSubmitted: recordForm.recordsSubmitted,
      observationSigned: recordForm.observationSigned,
      notes: recordForm.notes.trim(),
      createdAt: editingRecord?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingRecord) {
      setSessionRecords(prev => prev.map(record => 
        record.id === editingRecord.id ? recordData : record
      ));
    } else {
      setSessionRecords(prev => [...prev, recordData]);
    }

    setShowRecordModal(false);
    setEditingRecord(null);
    setRecordForm({
      programsCompleted: '',
      outputsGenerated: '',
      recordsSubmitted: false,
      observationSigned: false,
      notes: '',
    });
  };

  const openRecordModal = (record?: SessionRecord) => {
    if (record) {
      setEditingRecord(record);
      setRecordForm({
        programsCompleted: record.programsCompleted.toString(),
        outputsGenerated: record.outputsGenerated.toString(),
        recordsSubmitted: record.recordsSubmitted,
        observationSigned: record.observationSigned,
        notes: record.notes || '',
      });
    } else {
      setEditingRecord(null);
      setRecordForm({
        programsCompleted: '',
        outputsGenerated: '',
        recordsSubmitted: false,
        observationSigned: false,
        notes: '',
      });
    }
    setShowRecordModal(true);
  };

  const StudentCard = ({ student }: { student: Student }) => (
    <TouchableOpacity
      style={[
        styles.studentCard,
        selectedStudent?.id === student.id && styles.selectedStudentCard
      ]}
      onPress={() => setSelectedStudent(student)}
    >
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{student.name}</Text>
        <Text style={styles.studentDetails}>
          {student.rollNumber} • {student.department} • Year {student.year}
        </Text>
      </View>
      {selectedStudent?.id === student.id && (
        <View style={styles.selectedIndicator} />
      )}
    </TouchableOpacity>
  );

  const SessionCard = ({ session }: { session: LabSession }) => {
    const record = selectedStudent ? getSessionRecord(session.id, selectedStudent.id) : null;
    
    return (
      <View style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionTitle}>{session.title}</Text>
            <Text style={styles.sessionDetails}>
              {new Date(session.dateTime).toLocaleDateString()} • {session.room}
            </Text>
            <Text style={styles.sessionCourse}>{session.courseCode}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setSelectedSession(session);
              openRecordModal(record || undefined);
            }}
          >
            {record ? <Edit3 size={16} color="#3B82F6" /> : <Plus size={16} color="#3B82F6" />}
          </TouchableOpacity>
        </View>
        
        {record && (
          <View style={styles.recordSummary}>
            <View style={styles.recordStats}>
              <View style={styles.recordStat}>
                <Code size={16} color="#10B981" />
                <Text style={styles.recordStatText}>{record.programsCompleted} Programs</Text>
              </View>
              <View style={styles.recordStat}>
                <FileText size={16} color="#3B82F6" />
                <Text style={styles.recordStatText}>{record.outputsGenerated} Outputs</Text>
              </View>
            </View>
            
            <View style={styles.recordChecks}>
              <View style={[styles.checkItem, record.recordsSubmitted && styles.checkItemCompleted]}>
                <CheckSquare size={14} color={record.recordsSubmitted ? '#10B981' : '#6B7280'} />
                <Text style={[
                  styles.checkText,
                  record.recordsSubmitted && styles.checkTextCompleted
                ]}>
                  Records Submitted
                </Text>
              </View>
              <View style={[styles.checkItem, record.observationSigned && styles.checkItemCompleted]}>
                <Award size={14} color={record.observationSigned ? '#10B981' : '#6B7280'} />
                <Text style={[
                  styles.checkText,
                  record.observationSigned && styles.checkTextCompleted
                ]}>
                  Observation Signed
                </Text>
              </View>
            </View>
            
            {record.notes && (
              <Text style={styles.recordNotes}>{record.notes}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Session Records' }} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Session-wise Student Records</Text>
        <Text style={styles.subtitle}>
          Select a student to view and manage their session records
        </Text>
      </View>

      <SimpleSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search students..."
      />

      <View style={styles.content}>
        {/* Students List */}
        <View style={styles.studentsSection}>
          <Text style={styles.sectionTitle}>Students</Text>
          <ScrollView style={styles.studentsList} showsVerticalScrollIndicator={false}>
            {filteredStudents.map(student => (
              <StudentCard key={student.id} student={student} />
            ))}
            
            {filteredStudents.length === 0 && (
              <View style={styles.emptyState}>
                <Users size={32} color="#9CA3AF" />
                <Text style={styles.emptyStateText}>No students found</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Sessions List */}
        <View style={styles.sessionsSection}>
          {selectedStudent ? (
            <>
              <Text style={styles.sectionTitle}>
                Sessions for {selectedStudent.name}
              </Text>
              <ScrollView style={styles.sessionsList} showsVerticalScrollIndicator={false}>
                {studentSessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
                
                {studentSessions.length === 0 && (
                  <View style={styles.emptyState}>
                    <Calendar size={32} color="#9CA3AF" />
                    <Text style={styles.emptyStateText}>No sessions found</Text>
                  </View>
                )}
              </ScrollView>
            </>
          ) : (
            <View style={styles.selectStudentPrompt}>
              <Users size={48} color="#9CA3AF" />
              <Text style={styles.promptText}>Select a student to view sessions</Text>
            </View>
          )}
        </View>
      </View>

      {/* Record Modal */}
      <Modal
        visible={showRecordModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingRecord ? 'Edit Record' : 'Add Record'}
            </Text>
            <TouchableOpacity onPress={() => setShowRecordModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {selectedStudent && selectedSession && (
              <View style={styles.recordContext}>
                <Text style={styles.contextTitle}>
                  {selectedStudent.name} - {selectedSession.title}
                </Text>
                <Text style={styles.contextDetails}>
                  {new Date(selectedSession.dateTime).toLocaleDateString()} • {selectedSession.room}
                </Text>
              </View>
            )}
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Programs Completed</Text>
              <TextInput
                style={styles.formInput}
                value={recordForm.programsCompleted}
                onChangeText={(text) => setRecordForm(prev => ({ ...prev, programsCompleted: text }))}
                placeholder="Enter number of programs completed"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Outputs Generated</Text>
              <TextInput
                style={styles.formInput}
                value={recordForm.outputsGenerated}
                onChangeText={(text) => setRecordForm(prev => ({ ...prev, outputsGenerated: text }))}
                placeholder="Enter number of outputs generated"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.checkboxGroup}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setRecordForm(prev => ({ ...prev, recordsSubmitted: !prev.recordsSubmitted }))}
              >
                <View style={[
                  styles.checkboxBox,
                  recordForm.recordsSubmitted && styles.checkboxBoxChecked
                ]}>
                  {recordForm.recordsSubmitted && <CheckSquare size={16} color="white" />}
                </View>
                <Text style={styles.checkboxLabel}>Records Submitted</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setRecordForm(prev => ({ ...prev, observationSigned: !prev.observationSigned }))}
              >
                <View style={[
                  styles.checkboxBox,
                  recordForm.observationSigned && styles.checkboxBoxChecked
                ]}>
                  {recordForm.observationSigned && <Award size={16} color="white" />}
                </View>
                <Text style={styles.checkboxLabel}>Observation Signed</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Notes</Text>
              <TextInput
                style={[styles.formInput, styles.multilineInput]}
                value={recordForm.notes}
                onChangeText={(text) => setRecordForm(prev => ({ ...prev, notes: text }))}
                placeholder="Enter additional notes"
                multiline
                numberOfLines={4}
              />
            </View>
            
            <TouchableOpacity style={styles.saveButton} onPress={saveRecord}>
              <Text style={styles.saveButtonText}>
                {editingRecord ? 'Update Record' : 'Save Record'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  studentsSection: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  sessionsSection: {
    flex: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  studentsList: {
    flex: 1,
  },
  sessionsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  studentCard: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedStudentCard: {
    backgroundColor: '#EBF8FF',
    borderRightWidth: 3,
    borderRightColor: '#3B82F6',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  studentDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  sessionCard: {
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
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  sessionCourse: {
    fontSize: 14,
    color: '#3B82F6',
    marginTop: 2,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  recordSummary: {
    gap: 12,
  },
  recordStats: {
    flexDirection: 'row',
    gap: 16,
  },
  recordStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordStatText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  recordChecks: {
    flexDirection: 'row',
    gap: 16,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkItemCompleted: {
    opacity: 1,
  },
  checkText: {
    fontSize: 14,
    color: '#6B7280',
  },
  checkTextCompleted: {
    color: '#10B981',
    fontWeight: '500',
  },
  recordNotes: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
  },
  selectStudentPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  promptText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  recordContext: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  contextTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  contextDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'white',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  checkboxGroup: {
    gap: 16,
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  checkboxBoxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});