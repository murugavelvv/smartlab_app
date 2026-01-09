import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { Staff } from '@/types';
import { SimpleSearchBar } from '@/components/SimpleSearchBar';
import { 
  Plus, 
  UserCheck, 
  Mail, 
  Phone, 
  Building, 
  Award,
  Edit3,
  Trash2,
  User
} from 'lucide-react-native';

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCreateStaff, setShowCreateStaff] = useState<boolean>(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  
  // Form states
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
  });

  const filteredStaff = useMemo(() => {
    return staff.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [staff, searchQuery]);

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const createStaff = () => {
    if (!staffForm.name.trim() || !staffForm.email.trim() || !staffForm.department.trim()) return;
    
    const newStaff: Staff = {
      id: generateId(),
      name: staffForm.name.trim(),
      email: staffForm.email.trim(),
      phone: staffForm.phone.trim(),
      department: staffForm.department.trim(),
      designation: staffForm.designation.trim() || 'Staff',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    setStaff(prev => [...prev, newStaff]);
    setShowCreateStaff(false);
    setStaffForm({ name: '', email: '', phone: '', department: '', designation: '' });
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(member => member.id !== id));
  };

  const StaffCard = ({ member }: { member: Staff }) => {
    return (
      <TouchableOpacity 
        style={styles.staffCard}
        onPress={() => setSelectedStaff(member)}
      >
        <View style={styles.staffHeader}>
          <View style={styles.avatarContainer}>
            {member.photoPath ? (
              <Image source={{ uri: member.photoPath }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={24} color="#6B7280" />
              </View>
            )}
          </View>
          
          <View style={styles.staffInfo}>
            <Text style={styles.staffName}>{member.name}</Text>
            <Text style={styles.staffDesignation}>{member.designation}</Text>
            <Text style={styles.staffDepartment}>{member.department}</Text>
          </View>
          
          <View style={styles.staffActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Edit3 size={16} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => deleteStaff(member.id)}
            >
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.staffContact}>
          <View style={styles.contactItem}>
            <Mail size={14} color="#6B7280" />
            <Text style={styles.contactText}>{member.email}</Text>
          </View>
          {member.phone && (
            <View style={styles.contactItem}>
              <Phone size={14} color="#6B7280" />
              <Text style={styles.contactText}>{member.phone}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.staffStatus}>
          <View style={[styles.statusBadge, { backgroundColor: member.isActive ? '#10B981' : '#6B7280' }]}>
            <Text style={styles.statusText}>{member.isActive ? 'Active' : 'Inactive'}</Text>
          </View>
          <Text style={styles.joinDate}>
            Joined {new Date(member.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const StaffProfileModal = () => {
    if (!selectedStaff) return null;

    return (
      <Modal
        visible={!!selectedStaff}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Staff Profile</Text>
            <TouchableOpacity onPress={() => setSelectedStaff(null)}>
              <Text style={styles.cancelButton}>Close</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.profileContent}>
            <View style={styles.profileHeader}>
              <View style={styles.profileAvatarContainer}>
                {selectedStaff.photoPath ? (
                  <Image source={{ uri: selectedStaff.photoPath }} style={styles.profileAvatar} />
                ) : (
                  <View style={styles.profileAvatarPlaceholder}>
                    <User size={48} color="#6B7280" />
                  </View>
                )}
              </View>
              <Text style={styles.profileName}>{selectedStaff.name}</Text>
              <Text style={styles.profileDesignation}>{selectedStaff.designation}</Text>
            </View>
            
            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.profileItem}>
                <Mail size={20} color="#6B7280" />
                <View style={styles.profileItemContent}>
                  <Text style={styles.profileItemLabel}>Email</Text>
                  <Text style={styles.profileItemValue}>{selectedStaff.email}</Text>
                </View>
              </View>
              {selectedStaff.phone && (
                <View style={styles.profileItem}>
                  <Phone size={20} color="#6B7280" />
                  <View style={styles.profileItemContent}>
                    <Text style={styles.profileItemLabel}>Phone</Text>
                    <Text style={styles.profileItemValue}>{selectedStaff.phone}</Text>
                  </View>
                </View>
              )}
            </View>
            
            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>Department Information</Text>
              <View style={styles.profileItem}>
                <Building size={20} color="#6B7280" />
                <View style={styles.profileItemContent}>
                  <Text style={styles.profileItemLabel}>Department</Text>
                  <Text style={styles.profileItemValue}>{selectedStaff.department}</Text>
                </View>
              </View>
              <View style={styles.profileItem}>
                <Award size={20} color="#6B7280" />
                <View style={styles.profileItemContent}>
                  <Text style={styles.profileItemLabel}>Designation</Text>
                  <Text style={styles.profileItemValue}>{selectedStaff.designation}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>Account Details</Text>
              <View style={styles.profileItem}>
                <UserCheck size={20} color="#6B7280" />
                <View style={styles.profileItemContent}>
                  <Text style={styles.profileItemLabel}>Status</Text>
                  <Text style={[
                    styles.profileItemValue,
                    { color: selectedStaff.isActive ? '#10B981' : '#6B7280' }
                  ]}>
                    {selectedStaff.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
              <View style={styles.profileItem}>
                <View style={styles.profileItemContent}>
                  <Text style={styles.profileItemLabel}>Joined</Text>
                  <Text style={styles.profileItemValue}>
                    {new Date(selectedStaff.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.profileItem}>
                <View style={styles.profileItemContent}>
                  <Text style={styles.profileItemLabel}>Last Updated</Text>
                  <Text style={styles.profileItemValue}>
                    {new Date(selectedStaff.updatedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Staff Management</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateStaff(true)}
        >
          <Plus size={20} color="white" />
          <Text style={styles.createButtonText}>Add Staff</Text>
        </TouchableOpacity>
      </View>

      <SimpleSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search staff..."
      />

      <ScrollView style={styles.content}>
        {filteredStaff.map(member => (
          <StaffCard key={member.id} member={member} />
        ))}
        
        {filteredStaff.length === 0 && (
          <View style={styles.emptyState}>
            <UserCheck size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No staff members found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search' : 'Add your first staff member'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Create Staff Modal */}
      <Modal
        visible={showCreateStaff}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Staff</Text>
            <TouchableOpacity onPress={() => setShowCreateStaff(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Name *</Text>
              <TextInput
                style={styles.formInput}
                value={staffForm.name}
                onChangeText={(text) => setStaffForm(prev => ({ ...prev, name: text }))}
                placeholder="Enter full name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email *</Text>
              <TextInput
                style={styles.formInput}
                value={staffForm.email}
                onChangeText={(text) => setStaffForm(prev => ({ ...prev, email: text }))}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Phone</Text>
              <TextInput
                style={styles.formInput}
                value={staffForm.phone}
                onChangeText={(text) => setStaffForm(prev => ({ ...prev, phone: text }))}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Department *</Text>
              <TextInput
                style={styles.formInput}
                value={staffForm.department}
                onChangeText={(text) => setStaffForm(prev => ({ ...prev, department: text }))}
                placeholder="Enter department"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Designation</Text>
              <TextInput
                style={styles.formInput}
                value={staffForm.designation}
                onChangeText={(text) => setStaffForm(prev => ({ ...prev, designation: text }))}
                placeholder="Enter designation"
              />
            </View>
            
            <TouchableOpacity style={styles.createStaffButton} onPress={createStaff}>
              <Text style={styles.createStaffButtonText}>Add Staff Member</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      <StaffProfileModal />
    </View>
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
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
  staffCard: {
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
  staffHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  staffDesignation: {
    fontSize: 14,
    color: '#3B82F6',
    marginTop: 2,
  },
  staffDepartment: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  staffActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  staffContact: {
    marginBottom: 12,
    gap: 6,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
  },
  staffStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  joinDate: {
    fontSize: 12,
    color: '#6B7280',
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
  createStaffButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  createStaffButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  profileContent: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  profileAvatarContainer: {
    marginBottom: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileAvatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileDesignation: {
    fontSize: 16,
    color: '#3B82F6',
  },
  profileSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  profileItemContent: {
    flex: 1,
  },
  profileItemLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  profileItemValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
});