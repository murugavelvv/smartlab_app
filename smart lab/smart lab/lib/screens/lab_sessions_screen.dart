import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../models/lab_session.dart';
import '../models/student.dart';
import '../utils/theme.dart';
import '../widgets/animated_card.dart';

import 'add_lab_session_screen.dart';

class LabSessionsScreen extends StatefulWidget {
  const LabSessionsScreen({super.key});

  @override
  State<LabSessionsScreen> createState() => _LabSessionsScreenState();
}

class _LabSessionsScreenState extends State<LabSessionsScreen> {
  String _selectedStudentId = 'All';
  String _selectedStatus = 'All';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lab Sessions'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _showAddSessionDialog,
          ),
        ],
      ),
      body: Column(
        children: [
          _buildFilterChips(),
          Expanded(
            child: Consumer<AppProvider>(
              builder: (context, provider, child) {
                final sessions = _getFilteredSessions(provider);
                
                if (sessions.isEmpty) {
                  return _buildEmptyState();
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: sessions.length,
                  itemBuilder: (context, index) {
                    final session = sessions[index];
                    final student = provider.getStudent(session.studentId ?? '');
                    
                    return AnimatedListCard(
                      index: index,
                      child: _buildSessionCard(session, student),
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

  Widget _buildFilterChips() {
    return Consumer<AppProvider>(
      builder: (context, provider, child) {
        return Container(
          padding: const EdgeInsets.all(16),
          child: Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              if (_selectedStudentId != 'All')
                Chip(
                  label: Text('Student: ${provider.getStudent(_selectedStudentId)?.name ?? "Unknown"}'),
                  onDeleted: () => setState(() => _selectedStudentId = 'All'),
                  deleteIcon: const Icon(Icons.close, size: 18),
                ),
              if (_selectedStatus != 'All')
                Chip(
                  label: Text('Status: $_selectedStatus'),
                  onDeleted: () => setState(() => _selectedStatus = 'All'),
                  deleteIcon: const Icon(Icons.close, size: 18),
                ),
              if (_selectedStudentId != 'All' || _selectedStatus != 'All')
                TextButton.icon(
                  onPressed: () {
                    setState(() {
                      _selectedStudentId = 'All';
                      _selectedStatus = 'All';
                    });
                  },
                  icon: const Icon(Icons.clear_all),
                  label: const Text('Clear All'),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSessionCard(LabSession session, Student? student) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () => _showSessionDetails(session, student),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          session.sessionName,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        if (student != null)
                          Text(
                            student.name,
                            style: TextStyle(
                              color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.7),
                              fontSize: 14,
                            ),
                          ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getStatusColor(session.status).withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      session.status,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: _getStatusColor(session.status),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                session.topic,
                style: TextStyle(
                  fontSize: 14,
                  color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.8),
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(
                    Icons.calendar_today,
                    size: 16,
                    color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.6),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    session.formattedDate,
                    style: TextStyle(
                      fontSize: 12,
                      color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.6),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Icon(
                    Icons.person,
                    size: 16,
                    color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.6),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    session.instructor,
                    style: TextStyle(
                      fontSize: 12,
                      color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.6),
                    ),
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.successColor.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '${session.marks}%',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.successColor,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.science_outlined,
            size: 80,
            color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.3),
          ),
          const SizedBox(height: 16),
          Text(
            'No lab sessions found',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.5),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Try adjusting your filters or add a new session',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.5),
            ),
          ),
        ],
      ),
    );
  }

  List<LabSession> _getFilteredSessions(AppProvider provider) {
    List<LabSession> allSessions = [];
    
    for (final student in provider.students) {
      for (final session in student.labSessions) {
        // Add student ID to session for filtering
        final sessionWithStudentId = session.copyWith(studentId: student.id);
        allSessions.add(sessionWithStudentId);
      }
    }

    return allSessions.where((session) {
      final matchesStudent = _selectedStudentId == 'All' || session.studentId == _selectedStudentId;
      final matchesStatus = _selectedStatus == 'All' || session.status == _selectedStatus;
      return matchesStudent && matchesStatus;
    }).toList()
      ..sort((a, b) => b.date.compareTo(a.date));
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'completed':
        return AppTheme.successColor;
      case 'pending':
        return AppTheme.warningColor;
      case 'cancelled':
        return AppTheme.errorColor;
      default:
        return AppTheme.infoColor;
    }
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Filter Sessions'),
        content: Consumer<AppProvider>(
          builder: (context, provider, child) {
            return Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                DropdownButtonFormField<String>(
                  value: _selectedStudentId,
                  decoration: const InputDecoration(
                    labelText: 'Student',
                  ),
                  items: [
                    const DropdownMenuItem(value: 'All', child: Text('All Students')),
                    ...provider.students.map((student) => DropdownMenuItem(
                      value: student.id,
                      child: Text(student.name),
                    )),
                  ],
                  onChanged: (value) {
                    if (value != null) {
                      setState(() => _selectedStudentId = value);
                    }
                  },
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedStatus,
                  decoration: const InputDecoration(
                    labelText: 'Status',
                  ),
                  items: [
                    const DropdownMenuItem(value: 'All', child: Text('All Status')),
                    const DropdownMenuItem(value: 'completed', child: Text('Completed')),
                    const DropdownMenuItem(value: 'pending', child: Text('Pending')),
                    const DropdownMenuItem(value: 'cancelled', child: Text('Cancelled')),
                  ],
                  onChanged: (value) {
                    if (value != null) {
                      setState(() => _selectedStatus = value);
                    }
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

  void _showAddSessionDialog() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const AddLabSessionScreen()),
    );
  }

  void _showSessionDetails(LabSession session, Student? student) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(session.sessionName),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              if (student != null) ...[
                Text('Student: ${student.name}'),
                const SizedBox(height: 8),
              ],
              Text('Topic: ${session.topic}'),
              const SizedBox(height: 8),
              Text('Instructor: ${session.instructor}'),
              const SizedBox(height: 8),
              Text('Date: ${session.formattedDate}'),
              const SizedBox(height: 8),
              Text('Marks: ${session.marks}%'),
              const SizedBox(height: 8),
              Text('Status: ${session.status}'),
              if (session.notes.isNotEmpty) ...[
                const SizedBox(height: 8),
                Text('Notes: ${session.notes}'),
              ],
              if (session.completedTasks.isNotEmpty) ...[
                const SizedBox(height: 8),
                Text('Completed Tasks:'),
                ...session.completedTasks.map((task) => Text('• $task')),
              ],
            ],
          ),
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
