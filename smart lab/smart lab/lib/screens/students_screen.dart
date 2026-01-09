import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../widgets/student_card.dart';
import '../widgets/search_filter_bar.dart';
import '../widgets/animated_card.dart';
import '../models/student.dart';
import '../services/notification_service.dart';
import 'student_form_screen.dart';
import 'student_profile_screen.dart';
import 'live_attendance_screen.dart';

class StudentsScreen extends StatefulWidget {
  const StudentsScreen({super.key});

  @override
  State<StudentsScreen> createState() => _StudentsScreenState();
}

class _StudentsScreenState extends State<StudentsScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Students'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.checklist),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const LiveAttendanceScreen(),
                ),
              );
            },
            tooltip: 'Live Attendance',
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              _showFilterDialog();
            },
          ),
          IconButton(
            icon: const Icon(Icons.sort),
            onPressed: () {
              _showSortDialog();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          const SearchFilterBar(),
          Expanded(
            child: Consumer<AppProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading) {
                  return const Center(
                    child: CircularProgressIndicator(),
                  );
                }

                if (provider.filteredStudents.isEmpty) {
                  return _buildEmptyState();
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: provider.filteredStudents.length,
                  itemBuilder: (context, index) {
                    final student = provider.filteredStudents[index];
                    return AnimatedListCard(
                      index: index,
                      child: StudentCard(
                        student: student,
                        onTap: () => _navigateToStudentProfile(student),
                        onEdit: () => _navigateToEditStudent(student),
                        onDelete: () => _confirmDeleteStudent(student),
                        onToggleAttendance: () {
                          provider.toggleAttendance(student.id);
                          NotificationService.showSuccessSnackBar(
                            context,
                            '${student.name} attendance updated',
                          );
                        },
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.people_outline,
            size: 80,
            color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.3),
          ),
          const SizedBox(height: 16),
          Text(
            'No students found',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.5),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Try adjusting your search or filters',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.5),
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => _navigateToAddStudent(),
            icon: const Icon(Icons.person_add),
            label: const Text('Add First Student'),
          ),
        ],
      ),
    );
  }

  void _navigateToAddStudent() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const StudentFormScreen(),
      ),
    );
  }

  void _navigateToEditStudent(Student student) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => StudentFormScreen(studentToEdit: student),
      ),
    );
  }

  void _navigateToStudentProfile(Student student) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => StudentProfileScreen(student: student),
      ),
    );
  }

  void _confirmDeleteStudent(Student student) {
    NotificationService.showConfirmationDialog(
      context,
      'Delete Student',
      'Are you sure you want to delete ${student.name}? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    ).then((confirmed) {
      if (confirmed) {
        context.read<AppProvider>().deleteStudent(student.id);
        NotificationService.showSuccessSnackBar(
          context,
          '${student.name} deleted successfully',
        );
      }
    });
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Filter Students'),
        content: Consumer<AppProvider>(
          builder: (context, provider, child) {
            return Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                DropdownButtonFormField<String>(
                  value: provider.filterDepartment,
                  decoration: const InputDecoration(
                    labelText: 'Department',
                  ),
                  items: ['All', ...provider.departments]
                      .map((dept) => DropdownMenuItem(value: dept, child: Text(dept)))
                      .toList(),
                  onChanged: (value) {
                    if (value != null) {
                      provider.setFilterDepartment(value);
                    }
                  },
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          provider.setFilterDepartment('All');
                          Navigator.of(context).pop();
                        },
                        child: const Text('Clear Filters'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () => Navigator.of(context).pop(),
                        child: const Text('Apply'),
                      ),
                    ),
                  ],
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  void _showSortDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Sort Students'),
        content: Consumer<AppProvider>(
          builder: (context, provider, child) {
            return Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                RadioListTile<String>(
                  title: const Text('Name'),
                  value: 'name',
                  groupValue: provider.sortBy,
                  onChanged: (value) {
                    if (value != null) {
                      provider.setSortBy(value);
                    }
                  },
                ),
                RadioListTile<String>(
                  title: const Text('Marks'),
                  value: 'marks',
                  groupValue: provider.sortBy,
                  onChanged: (value) {
                    if (value != null) {
                      provider.setSortBy(value);
                    }
                  },
                ),
                RadioListTile<String>(
                  title: const Text('Attendance'),
                  value: 'attendance',
                  groupValue: provider.sortBy,
                  onChanged: (value) {
                    if (value != null) {
                      provider.setSortBy(value);
                    }
                  },
                ),
                RadioListTile<String>(
                  title: const Text('Roll Number'),
                  value: 'rollNumber',
                  groupValue: provider.sortBy,
                  onChanged: (value) {
                    if (value != null) {
                      provider.setSortBy(value);
                    }
                  },
                ),
                const Divider(),
                SwitchListTile(
                  title: const Text('Ascending Order'),
                  value: provider.sortAscending,
                  onChanged: (value) {
                    provider.toggleSortOrder();
                  },
                ),
              ],
            );
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}
