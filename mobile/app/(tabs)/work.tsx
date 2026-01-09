import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useApp, useFilteredStudents } from '@/providers/AppProvider';
import { Work, StudentWork, LabSession } from '@/types';
import { SimpleSearchBar } from '@/components/SimpleSearchBar';
import { 
  Plus, 
  Briefcase, 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Edit3,
  Trash2,
  Award
} from 'lucide-react-native';

export default function WorkPage() {
  const { sessions, students } = useApp();
  const [selectedTab, setSelectedTab] = useState<'works' | 'assignments'>('works');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCreateWork, setShowCreateWork] = useState<boolean>(false);
  const [works, setWorks] = useState<Work[]>([]);
  const [studentWorks, setStudentWorks] = useState<StudentWork[]>([]);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  
  // Form states
  const [workForm, setWorkForm] = useState({
    title: '',
    description: '',
    sessionId: '',
    maxMarks: '',
    dueDate: '',
  });

  const filteredWorks = useMemo(() => {
    return works.filter(work =>
      work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [works, searchQuery]);

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const createWork = () => {
    if (!workForm.title.trim() || !workForm.sessionId || !workForm.maxMarks) return;
    
    if (editingWork) {
      // Update existing work
      const updatedWork: Work = {
        ...editingWork,
        title: workForm.title.trim(),
        description: workForm.description.trim(),
        sessionId: workForm.sessionId,
        maxMarks: parseInt(workForm.maxMarks),
        dueDate: workForm.dueDate || editingWork.dueDate,
      };
      
      setWorks(prev => prev.map(w => w.id === editingWork.id ? updatedWork : w));
      setEditingWork(null);
    } else {
      // Create new work
      const newWork: Work = {
        id: generateId(),
        title: workForm.title.trim(),
        description: workForm.description.trim(),
        sessionId: workForm.sessionId,
        assignedBy: 'Current Staff',
        maxMarks: parseInt(workForm.maxMarks),
        dueDate: workForm.dueDate || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      setWorks(prev => [...prev, newWork]);
      
      // Auto-assign to all students
      const newStudentWorks = students.map(student => ({
        id: generateId(),
        workId: newWork.id,
        studentId: student.id,
        sessionId: newWork.sessionId,
        status: 'Assigned' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      
      setStudentWorks(prev => [...prev, ...newStudentWorks]);
    }
    
    setShowCreateWork(false);
    setWorkForm({ title: '', description: '', sessionId: '', maxMarks: '', dueDate: '' });
  };

  const updateStudentWorkMarks = (studentWorkId: string, marks: number, feedback?: string) => {
    setStudentWorks(prev => prev.map(sw => 
      sw.id === studentWorkId 
        ? { 
            ...sw, 
            marksObtained: marks, 
            feedback,
            status: 'Completed' as const,
            updatedAt: new Date().toISOString() 
          }
        : sw
    ));
  };

  const getWorkStats = (workId: string) => {
    const workAssignments = studentWorks.filter(sw => sw.workId === workId);
    const completed = workAssignments.filter(sw => sw.status === 'Completed').length;
    const inProgress = workAssignments.filter(sw => sw.status === 'In Progress').length;
    const assigned = workAssignments.filter(sw => sw.status === 'Assigned').length;
    
    return { total: workAssignments.length, completed, inProgress, assigned };
  };

  const handleEditWork = (work: Work) => {
    setEditingWork(work);
    setWorkForm({
      title: work.title,
      description: work.description,
      sessionId: work.sessionId,
      maxMarks: work.maxMarks.toString(),
      dueDate: work.dueDate,
    });
    setShowCreateWork(true);
  };

  const handleDeleteWork = (work: Work) => {
    Alert.alert(
      'Delete Work',
      `Are you sure you want to delete "${work.title}"? This will also remove all student assignments for this work.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setWorks(prev => prev.filter(w => w.id !== work.id));
            setStudentWorks(prev => prev.filter(sw => sw.workId !== work.id));
          }
        }
      ]
    );
  };

  const WorkCard = ({ work }: { work: Work }) => {
    const session = sessions.find(s => s.id === work.sessionId);
    const stats = getWorkStats(work.id);
    
    return (
      <View style={styles.workCard}>
        <View style={styles.workHeader}>
          <View style={styles.workInfo}>
            <Text style={styles.workTitle}>{work.title}</Text>
            <Text style={styles.workSession}>{session?.title || 'Unknown Session'}</Text>
            <Text style={styles.workDescription}>{work.description}</Text>
          </View>
          <View style={styles.workActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleEditWork(work)}
            >
              <Edit3 size={16} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDeleteWork(work)}
            >
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.workStats}>
          <View style={styles.statChip}>
            <Award size={14} color="#F59E0B" />
            <Text style={styles.statText}>{work.maxMarks} marks</Text>
          </View>
          <View style={styles.statChip}>
            <CheckCircle size={14} color="#10B981" />
            <Text style={styles.statText}>{stats.completed} completed</Text>
          </View>
          <View style={styles.statChip}>
            <Clock size={14} color="#3B82F6" />
            <Text style={styles.statText}>{stats.inProgress} in progress</Text>
          </View>
          <View style={styles.statChip}>
            <AlertCircle size={14} color="#6B7280" />
            <Text style={styles.statText}>{stats.assigned} assigned</Text>
          </View>
        </View>
        
        <Text style={styles.workDueDate}>
          Due: {new Date(work.dueDate).toLocaleDateString()}
        </Text>
      </View>
    );
  };

  const StudentWorkCard = ({ studentWork }: { studentWork: StudentWork }) => {
    const student = students.find(s => s.id === studentWork.studentId);
    const work = works.find(w => w.id === studentWork.workId);
    const [marks, setMarks] = useState<string>(studentWork.marksObtained?.toString() || '');
    const [feedback, setFeedback] = useState<string>(studentWork.feedback || '');
    
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Completed': return '#10B981';
        case 'In Progress': return '#3B82F6';
        case 'Submitted': return '#8B5CF6';
        default: return '#6B7280';
      }
    };

    return (
      <View style={styles.studentWorkCard}>
        <View style={styles.studentWorkHeader}>
          <View>
            <Text style={styles.studentName}>{student?.name || 'Unknown Student'}</Text>
            <Text style={styles.workTitle}>{work?.title || 'Unknown Work'}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(studentWork.status) }]}>
            <Text style={styles.statusText}>{studentWork.status}</Text>
          </View>
        </View>
        
        <View style={styles.markingSection}>
          <View style={styles.marksInput}>
            <Text style={styles.inputLabel}>Marks (out of {work?.maxMarks || 0})</Text>
            <TextInput
              style={styles.textInput}
              value={marks}
              onChangeText={setMarks}
              placeholder="Enter marks"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.feedbackInput}>
            <Text style={styles.inputLabel}>Feedback</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Enter feedback"
              multiline
              numberOfLines={3}
            />
          </View>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => updateStudentWorkMarks(
              studentWork.id, 
              parseInt(marks) || 0, 
              feedback
            )}
          >
            <Text style={styles.saveButtonText}>Save Marks</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Work & Evaluation</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'works' && styles.activeTab]}
            onPress={() => setSelectedTab('works')}
          >
            <Briefcase size={16} color={selectedTab === 'works' ? 'white' : '#6B7280'} />
            <Text style={[styles.tabText, selectedTab === 'works' && styles.activeTabText]}>
              Works
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'assignments' && styles.activeTab]}
            onPress={() => setSelectedTab('assignments')}
          >
            <Users size={16} color={selectedTab === 'assignments' ? 'white' : '#6B7280'} />
            <Text style={[styles.tabText, selectedTab === 'assignments' && styles.activeTabText]}>
              Assignments
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <SimpleSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder={selectedTab === 'works' ? 'Search works...' : 'Search assignments...'}
      />

      {selectedTab === 'works' && (
        <View style={styles.worksHeader}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateWork(true)}
          >
            <Plus size={20} color="white" />
            <Text style={styles.createButtonText}>Create Work</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content}>
        {selectedTab === 'works' ? (
          filteredWorks.map(work => (
            <WorkCard key={work.id} work={work} />
          ))
        ) : (
          studentWorks.map(studentWork => (
            <StudentWorkCard key={studentWork.id} studentWork={studentWork} />
          ))
        )}
        
        {((selectedTab === 'works' && filteredWorks.length === 0) || 
          (selectedTab === 'assignments' && studentWorks.length === 0)) && (
          <View style={styles.emptyState}>
            <Briefcase size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>
              {selectedTab === 'works' ? 'No works found' : 'No assignments found'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {selectedTab === 'works' 
                ? 'Create your first work assignment' 
                : 'Works will appear here once created'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Create Work Modal */}
      <Modal
        visible={showCreateWork}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editingWork ? 'Edit Work' : 'Create New Work'}</Text>
            <TouchableOpacity onPress={() => {
              setShowCreateWork(false);
              setEditingWork(null);
              setWorkForm({ title: '', description: '', sessionId: '', maxMarks: '', dueDate: '' });
            }}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Title *</Text>
              <TextInput
                style={styles.formInput}
                value={workForm.title}
                onChangeText={(text) => setWorkForm(prev => ({ ...prev, title: text }))}
                placeholder="Enter work title"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.formInput, styles.multilineInput]}
                value={workForm.description}
                onChangeText={(text) => setWorkForm(prev => ({ ...prev, description: text }))}
                placeholder="Enter work description"
                multiline
                numberOfLines={4}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Session *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {sessions.map(session => (
                  <TouchableOpacity
                    key={session.id}
                    style={[
                      styles.sessionOption,
                      workForm.sessionId === session.id && styles.selectedSessionOption
                    ]}
                    onPress={() => setWorkForm(prev => ({ ...prev, sessionId: session.id }))}
                  >
                    <Calendar size={14} color={workForm.sessionId === session.id ? 'white' : '#6B7280'} />
                    <Text style={[
                      styles.sessionOptionText,
                      workForm.sessionId === session.id && styles.selectedSessionOptionText
                    ]}>
                      {session.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Maximum Marks *</Text>
              <TextInput
                style={styles.formInput}
                value={workForm.maxMarks}
                onChangeText={(text) => setWorkForm(prev => ({ ...prev, maxMarks: text }))}
                placeholder="Enter maximum marks"
                keyboardType="numeric"
              />
            </View>
            
            <TouchableOpacity style={styles.createWorkButton} onPress={createWork}>
              <Text style={styles.createWorkButtonText}>{editingWork ? 'Update Work' : 'Create Work'}</Text>
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
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: 'white',
  },
  worksHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  workCard: {
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
  workHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  workInfo: {
    flex: 1,
  },
  workTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  workSession: {
    fontSize: 14,
    color: '#3B82F6',
    marginTop: 2,
  },
  workDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  workActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  workStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  workDueDate: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  studentWorkCard: {
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
  studentWorkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  markingSection: {
    gap: 12,
  },
  marksInput: {
    flex: 1,
  },
  feedbackInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
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
  sessionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  selectedSessionOption: {
    backgroundColor: '#3B82F6',
  },
  sessionOptionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedSessionOptionText: {
    color: 'white',
  },
  createWorkButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  createWorkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});