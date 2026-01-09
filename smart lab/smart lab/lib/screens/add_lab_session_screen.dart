import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../models/lab_session.dart';

import '../services/notification_service.dart';

class AddLabSessionScreen extends StatefulWidget {
  const AddLabSessionScreen({super.key});

  @override
  State<AddLabSessionScreen> createState() => _AddLabSessionScreenState();
}

class _AddLabSessionScreenState extends State<AddLabSessionScreen> {
  final _formKey = GlobalKey<FormState>();
  final _topicController = TextEditingController();
  final _instructorController = TextEditingController();
  final _notesController = TextEditingController();
  final _labRoomController = TextEditingController();
  final _equipmentController = TextEditingController();
  
  DateTime _selectedDate = DateTime.now();
  String _selectedBatch = '2024';
  String _selectedStatus = 'completed';
  int _duration = 120;
  double _observationMarks = 0.0;
  double _recordMarks = 0.0;
  
  bool _isLoading = false;
  
  final List<String> _batchOptions = ['2024', '2023', '2022', '2021', '2020'];
  final List<String> _statusOptions = ['completed', 'pending', 'cancelled'];

  @override
  void initState() {
    super.initState();
    _instructorController.text = 'Dr. Smith'; // Default instructor
  }

  @override
  void dispose() {
    _topicController.dispose();
    _instructorController.dispose();
    _notesController.dispose();
    _labRoomController.dispose();
    _equipmentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Lab Session'),
        centerTitle: true,
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Theme.of(context).primaryColor.withValues(alpha: 0.1),
              Theme.of(context).scaffoldBackgroundColor,
            ],
          ),
        ),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeaderCard(),
                const SizedBox(height: 24),
                _buildSessionDetailsSection(),
                const SizedBox(height: 24),
                _buildMarksSection(),
                const SizedBox(height: 24),
                _buildAdditionalDetailsSection(),
                const SizedBox(height: 32),
                _buildSaveButton(),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeaderCard() {
    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            colors: [
              Theme.of(context).primaryColor,
              Theme.of(context).primaryColor.withValues(alpha: 0.8),
            ],
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Icon(
                Icons.science,
                color: Colors.white,
                size: 32,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'New Lab Session',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Create a new laboratory session with detailed information',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.white.withValues(alpha: 0.9),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSessionDetailsSection() {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionHeader('Session Details', Icons.info_outline),
            const SizedBox(height: 20),
            
            // Session Topic
            _buildTextField(
              controller: _topicController,
              label: 'Session Topic / Experiment Name',
              hint: 'e.g., Data Structures Implementation',
              icon: Icons.topic,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter session topic';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            
            // Date and Batch Row
            Row(
              children: [
                Expanded(
                  child: _buildDatePicker(),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildDropdown(
                    label: 'Batch',
                    value: _selectedBatch,
                    items: _batchOptions,
                    onChanged: (value) {
                      setState(() {
                        _selectedBatch = value!;
                      });
                    },
                    icon: Icons.school,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            // Instructor
            _buildTextField(
              controller: _instructorController,
              label: 'Instructor',
              hint: 'e.g., Dr. Smith',
              icon: Icons.person,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter instructor name';
                }
                return null;
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMarksSection() {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionHeader('Marks Entry', Icons.grade),
            const SizedBox(height: 20),
            
            Row(
              children: [
                Expanded(
                  child: _buildMarksField(
                    label: 'Observation Marks',
                    value: _observationMarks,
                    onChanged: (value) {
                      setState(() {
                        _observationMarks = value;
                      });
                    },
                    icon: Icons.visibility,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildMarksField(
                    label: 'Record Marks',
                    value: _recordMarks,
                    onChanged: (value) {
                      setState(() {
                        _recordMarks = value;
                      });
                    },
                    icon: Icons.edit_note,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            // Total Marks Display
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Theme.of(context).primaryColor.withValues(alpha: 0.3),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Total Marks:',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  Text(
                    '${((_observationMarks + _recordMarks) / 2).round()}%',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAdditionalDetailsSection() {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionHeader('Additional Details', Icons.settings),
            const SizedBox(height: 20),
            
            // Status and Duration Row
            Row(
              children: [
                Expanded(
                  child: _buildDropdown(
                    label: 'Status',
                    value: _selectedStatus,
                    items: _statusOptions,
                    onChanged: (value) {
                      setState(() {
                        _selectedStatus = value!;
                      });
                    },
                    icon: Icons.flag,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildDurationField(),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            // Lab Room and Equipment
            Row(
              children: [
                Expanded(
                  child: _buildTextField(
                    controller: _labRoomController,
                    label: 'Lab Room',
                    hint: 'e.g., Lab 101',
                    icon: Icons.room,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildTextField(
                    controller: _equipmentController,
                    label: 'Equipment',
                    hint: 'e.g., Computer, IDE',
                    icon: Icons.computer,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            // Notes
            _buildTextField(
              controller: _notesController,
              label: 'Additional Notes',
              hint: 'Any additional information about the session...',
              icon: Icons.note,
              maxLines: 3,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Theme.of(context).primaryColor.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            color: Theme.of(context).primaryColor,
            size: 20,
          ),
        ),
        const SizedBox(width: 12),
        Text(
          title,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
            color: Theme.of(context).primaryColor,
          ),
        ),
      ],
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    String? Function(String?)? validator,
    int maxLines = 1,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 16, color: Theme.of(context).primaryColor),
            const SizedBox(width: 4),
            Text(
              label,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                fontWeight: FontWeight.w600,
                color: Theme.of(context).primaryColor,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          validator: validator,
          maxLines: maxLines,
          decoration: InputDecoration(
            hintText: hint,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: Theme.of(context).primaryColor.withValues(alpha: 0.3),
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: Theme.of(context).primaryColor,
                width: 2,
              ),
            ),
            filled: true,
            fillColor: Theme.of(context).cardColor,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
        ),
      ],
    );
  }

  Widget _buildDatePicker() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.calendar_today, size: 16, color: Theme.of(context).primaryColor),
            const SizedBox(width: 4),
            Text(
              'Date of Session',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                fontWeight: FontWeight.w600,
                color: Theme.of(context).primaryColor,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        InkWell(
          onTap: _selectDate,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              border: Border.all(
                color: Theme.of(context).primaryColor.withValues(alpha: 0.3),
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.calendar_today,
                  color: Theme.of(context).primaryColor,
                  size: 20,
                ),
                const SizedBox(width: 12),
                Text(
                  _formatDate(_selectedDate),
                  style: const TextStyle(fontSize: 14),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDropdown({
    required String label,
    required String value,
    required List<String> items,
    required Function(String?) onChanged,
    required IconData icon,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 16, color: Theme.of(context).primaryColor),
            const SizedBox(width: 4),
            Text(
              label,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                fontWeight: FontWeight.w600,
                color: Theme.of(context).primaryColor,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          value: value,
          decoration: InputDecoration(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: Theme.of(context).primaryColor.withValues(alpha: 0.3),
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: Theme.of(context).primaryColor,
                width: 2,
              ),
            ),
            filled: true,
            fillColor: Theme.of(context).cardColor,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
          items: items.map((String item) {
            return DropdownMenuItem<String>(
              value: item,
              child: Text(item),
            );
          }).toList(),
          onChanged: onChanged,
        ),
      ],
    );
  }

  Widget _buildMarksField({
    required String label,
    required double value,
    required Function(double) onChanged,
    required IconData icon,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 16, color: Theme.of(context).primaryColor),
            const SizedBox(width: 4),
            Text(
              label,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                fontWeight: FontWeight.w600,
                color: Theme.of(context).primaryColor,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        TextFormField(
          initialValue: value.toString(),
          keyboardType: TextInputType.numberWithOptions(decimal: true),
          onChanged: (text) {
            final newValue = double.tryParse(text) ?? 0.0;
            if (newValue >= 0 && newValue <= 100) {
              onChanged(newValue);
            }
          },
          decoration: InputDecoration(
            hintText: '0-100',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: Theme.of(context).primaryColor.withValues(alpha: 0.3),
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: Theme.of(context).primaryColor,
                width: 2,
              ),
            ),
            filled: true,
            fillColor: Theme.of(context).cardColor,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            suffixText: '%',
          ),
        ),
      ],
    );
  }

  Widget _buildDurationField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.timer, size: 16, color: Theme.of(context).primaryColor),
            const SizedBox(width: 4),
            Text(
              'Duration (minutes)',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                fontWeight: FontWeight.w600,
                color: Theme.of(context).primaryColor,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        TextFormField(
          initialValue: _duration.toString(),
          keyboardType: TextInputType.number,
          onChanged: (text) {
            final newValue = int.tryParse(text) ?? 120;
            if (newValue > 0) {
              setState(() {
                _duration = newValue;
              });
            }
          },
          decoration: InputDecoration(
            hintText: '120',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: Theme.of(context).primaryColor.withValues(alpha: 0.3),
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: Theme.of(context).primaryColor,
                width: 2,
              ),
            ),
            filled: true,
            fillColor: Theme.of(context).cardColor,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            suffixText: 'min',
          ),
        ),
      ],
    );
  }

  Widget _buildSaveButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _saveLabSession,
        style: ElevatedButton.styleFrom(
          backgroundColor: Theme.of(context).primaryColor,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 20),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 8,
        ),
        child: _isLoading
            ? const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  ),
                  SizedBox(width: 16),
                  Text(
                    'Saving...',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                  ),
                ],
              )
            : const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.save, size: 24),
                  SizedBox(width: 12),
                  Text(
                    'Save Lab Session',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
      ),
    );
  }

  Future<void> _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: Theme.of(context).colorScheme.copyWith(
              primary: Theme.of(context).primaryColor,
            ),
          ),
          child: child!,
        );
      },
    );
    
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  Future<void> _saveLabSession() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));
      
      // Create new lab session
      final session = LabSession(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        sessionName: '${_topicController.text} - ${_selectedBatch}',
        title: _topicController.text,
        description: _notesController.text,
        date: _selectedDate,
        startTime: _selectedDate,
        endTime: _selectedDate.add(Duration(minutes: _duration)),
        maxStudents: 30,
        marks: ((_observationMarks + _recordMarks) / 2).round(),
        topic: _topicController.text,
        instructor: _instructorController.text,
        notes: _notesController.text,
        labRoom: _labRoomController.text,
        equipment: _equipmentController.text,
        duration: _duration,
        status: _selectedStatus,
      );

      // Get provider and add session to first available student (for demo purposes)
      final provider = context.read<AppProvider>();
      if (provider.students.isNotEmpty) {
        // Add session to the first student as a demo
        provider.addLabSession(provider.students.first.id, session);
      }
      
      NotificationService.showSuccessSnackBar(
        context,
        'Lab session created successfully!',
      );

      Navigator.pop(context);
    } catch (e) {
      NotificationService.showErrorSnackBar(
        context,
        'Failed to create lab session. Please try again.',
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}
