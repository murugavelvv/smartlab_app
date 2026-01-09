import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/student.dart';
import '../providers/app_provider.dart';
import '../utils/theme.dart';

class StudentFormScreen extends StatefulWidget {
  final Student? studentToEdit;

  const StudentFormScreen({super.key, this.studentToEdit});

  @override
  State<StudentFormScreen> createState() => _StudentFormScreenState();
}

class _StudentFormScreenState extends State<StudentFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _rollNumberController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;
  late TextEditingController _remarksController;
  late TextEditingController _addressController;
  late TextEditingController _emergencyContactController;
  late TextEditingController _parentNameController;
  late TextEditingController _parentPhoneController;
  late TextEditingController _currentSemesterController;

  String _selectedDepartment = 'Computer Science';
  int _marks = 0;
  int _problemsSolved = 0;
  int _outputsCount = 0;
  int _attendancePercentage = 0;
  double _cgpa = 0.0;
  DateTime _selectedDate = DateTime(2000, 1, 1);
  List<String> _skills = [];
  List<String> _achievements = [];

  final List<String> _departments = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
  ];

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
    _rollNumberController = TextEditingController();
    _emailController = TextEditingController();
    _phoneController = TextEditingController();
    _remarksController = TextEditingController();
    _addressController = TextEditingController();
    _emergencyContactController = TextEditingController();
    _parentNameController = TextEditingController();
    _parentPhoneController = TextEditingController();
    _currentSemesterController = TextEditingController();

    if (widget.studentToEdit != null) {
      _loadStudentData();
    }
  }

  void _loadStudentData() {
    final student = widget.studentToEdit!;
    _nameController.text = student.name;
    _rollNumberController.text = student.rollNumber;
    _emailController.text = student.email;
    _phoneController.text = student.phone;
    _remarksController.text = student.remarks;
    _addressController.text = student.address;
    _emergencyContactController.text = student.emergencyContact;
    _parentNameController.text = student.parentName;
    _parentPhoneController.text = student.parentPhone;
    _currentSemesterController.text = student.currentSemester;
    _selectedDepartment = student.department;
    _marks = student.marks;
    _problemsSolved = student.problemsSolved;
    _outputsCount = student.outputsCount;
    _attendancePercentage = student.attendancePercentage;
    _cgpa = student.cgpa;
    _selectedDate = student.dateOfBirth;
    _skills = List.from(student.skills);
    _achievements = List.from(student.achievements);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _rollNumberController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _remarksController.dispose();
    _addressController.dispose();
    _emergencyContactController.dispose();
    _parentNameController.dispose();
    _parentPhoneController.dispose();
    _currentSemesterController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.studentToEdit != null ? 'Edit Student' : 'Add Student'),
        centerTitle: true,
        actions: [
          if (widget.studentToEdit != null)
            IconButton(
              icon: const Icon(Icons.delete),
              onPressed: _showDeleteConfirmation,
            ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildBasicInfoSection(),
              const SizedBox(height: 24),
              _buildAcademicInfoSection(),
              const SizedBox(height: 24),
              _buildContactInfoSection(),
              const SizedBox(height: 24),
              _buildSkillsSection(),
              const SizedBox(height: 24),
              _buildAchievementsSection(),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _saveStudent,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: Text(
                    widget.studentToEdit != null ? 'Update Student' : 'Add Student',
                    style: const TextStyle(fontSize: 16),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBasicInfoSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Basic Information',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Full Name',
                prefixIcon: Icon(Icons.person),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter student name';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _rollNumberController,
              decoration: const InputDecoration(
                labelText: 'Roll Number',
                prefixIcon: Icon(Icons.badge),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter roll number';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _selectedDepartment,
              decoration: const InputDecoration(
                labelText: 'Department',
                prefixIcon: Icon(Icons.school),
              ),
              items: _departments.map((dept) {
                return DropdownMenuItem(value: dept, child: Text(dept));
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedDepartment = value!;
                });
              },
            ),
            const SizedBox(height: 16),
            ListTile(
              title: const Text('Date of Birth'),
              subtitle: Text('${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}'),
              trailing: const Icon(Icons.calendar_today),
              onTap: _selectDate,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAcademicInfoSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Academic Information',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    initialValue: _marks.toString(),
                    decoration: const InputDecoration(
                      labelText: 'Marks (%)',
                      prefixIcon: Icon(Icons.grade),
                    ),
                    keyboardType: TextInputType.number,
                    onChanged: (value) {
                      _marks = int.tryParse(value) ?? 0;
                    },
                    validator: (value) {
                      final marks = int.tryParse(value ?? '');
                      if (marks == null || marks < 0 || marks > 100) {
                        return 'Please enter valid marks (0-100)';
                      }
                      return null;
                    },
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: TextFormField(
                    initialValue: _cgpa.toString(),
                    decoration: const InputDecoration(
                      labelText: 'CGPA',
                      prefixIcon: Icon(Icons.star),
                    ),
                    keyboardType: TextInputType.number,
                    onChanged: (value) {
                      _cgpa = double.tryParse(value) ?? 0.0;
                    },
                    validator: (value) {
                      final cgpa = double.tryParse(value ?? '');
                      if (cgpa == null || cgpa < 0 || cgpa > 10) {
                        return 'Please enter valid CGPA (0-10)';
                      }
                      return null;
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    initialValue: _problemsSolved.toString(),
                    decoration: const InputDecoration(
                      labelText: 'Problems Solved',
                      prefixIcon: Icon(Icons.code),
                    ),
                    keyboardType: TextInputType.number,
                    onChanged: (value) {
                      _problemsSolved = int.tryParse(value) ?? 0;
                    },
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: TextFormField(
                    initialValue: _outputsCount.toString(),
                    decoration: const InputDecoration(
                      labelText: 'Outputs Count',
                      prefixIcon: Icon(Icons.output),
                    ),
                    keyboardType: TextInputType.number,
                    onChanged: (value) {
                      _outputsCount = int.tryParse(value) ?? 0;
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            TextFormField(
              initialValue: _attendancePercentage.toString(),
              decoration: const InputDecoration(
                labelText: 'Attendance Percentage',
                prefixIcon: Icon(Icons.calendar_today),
              ),
              keyboardType: TextInputType.number,
              onChanged: (value) {
                _attendancePercentage = int.tryParse(value) ?? 0;
              },
              validator: (value) {
                final attendance = int.tryParse(value ?? '');
                if (attendance == null || attendance < 0 || attendance > 100) {
                  return 'Please enter valid attendance (0-100)';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _currentSemesterController,
              decoration: const InputDecoration(
                labelText: 'Current Semester',
                prefixIcon: Icon(Icons.school),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContactInfoSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Contact Information',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _emailController,
              decoration: const InputDecoration(
                labelText: 'Email',
                prefixIcon: Icon(Icons.email),
              ),
              keyboardType: TextInputType.emailAddress,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter email';
                }
                if (!value.contains('@')) {
                  return 'Please enter valid email';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _phoneController,
              decoration: const InputDecoration(
                labelText: 'Phone Number',
                prefixIcon: Icon(Icons.phone),
              ),
              keyboardType: TextInputType.phone,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _addressController,
              decoration: const InputDecoration(
                labelText: 'Address',
                prefixIcon: Icon(Icons.location_on),
              ),
              maxLines: 2,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _emergencyContactController,
              decoration: const InputDecoration(
                labelText: 'Emergency Contact',
                prefixIcon: Icon(Icons.emergency),
              ),
              keyboardType: TextInputType.phone,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _parentNameController,
              decoration: const InputDecoration(
                labelText: 'Parent Name',
                prefixIcon: Icon(Icons.family_restroom),
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _parentPhoneController,
              decoration: const InputDecoration(
                labelText: 'Parent Phone',
                prefixIcon: Icon(Icons.phone),
              ),
              keyboardType: TextInputType.phone,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSkillsSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Skills',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              children: [
                ..._skills.map((skill) => Chip(
                  label: Text(skill),
                  onDeleted: () {
                    setState(() {
                      _skills.remove(skill);
                    });
                  },
                )),
                ActionChip(
                  label: const Text('Add Skill'),
                  onPressed: _addSkill,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAchievementsSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Achievements',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              children: [
                ..._achievements.map((achievement) => Chip(
                  label: Text(achievement),
                  onDeleted: () {
                    setState(() {
                      _achievements.remove(achievement);
                    });
                  },
                )),
                ActionChip(
                  label: const Text('Add Achievement'),
                  onPressed: _addAchievement,
                ),
              ],
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _remarksController,
              decoration: const InputDecoration(
                labelText: 'Remarks',
                prefixIcon: Icon(Icons.note),
              ),
              maxLines: 3,
            ),
          ],
        ),
      ),
    );
  }

  void _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(1990),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  void _addSkill() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Skill'),
        content: TextField(
          decoration: const InputDecoration(
            labelText: 'Skill Name',
            hintText: 'e.g., Java, Python, Data Structures',
          ),
          onSubmitted: (value) {
            if (value.isNotEmpty) {
              setState(() {
                _skills.add(value);
              });
              Navigator.of(context).pop();
            }
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              final controller = TextEditingController();
              Navigator.of(context).pop();
              if (controller.text.isNotEmpty) {
                setState(() {
                  _skills.add(controller.text);
                });
              }
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  void _addAchievement() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Achievement'),
        content: TextField(
          decoration: const InputDecoration(
            labelText: 'Achievement',
            hintText: 'e.g., Top Performer, Perfect Attendance',
          ),
          onSubmitted: (value) {
            if (value.isNotEmpty) {
              setState(() {
                _achievements.add(value);
              });
              Navigator.of(context).pop();
            }
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              final controller = TextEditingController();
              Navigator.of(context).pop();
              if (controller.text.isNotEmpty) {
                setState(() {
                  _achievements.add(controller.text);
                });
              }
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  void _saveStudent() {
    if (_formKey.currentState!.validate()) {
      final student = Student(
        id: widget.studentToEdit?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
        name: _nameController.text,
        rollNumber: _rollNumberController.text,
        department: _selectedDepartment,
        email: _emailController.text,
        phone: _phoneController.text,
        year: '2024',
        marks: _marks,
        problemsSolved: _problemsSolved,
        outputsCount: _outputsCount,
        attendancePercentage: _attendancePercentage,
        remarks: _remarksController.text,
        lastUpdated: DateTime.now(),
        dateOfBirth: _selectedDate,
        address: _addressController.text,
        emergencyContact: _emergencyContactController.text,
        parentName: _parentNameController.text,
        parentPhone: _parentPhoneController.text,
        skills: _skills,
        currentSemester: _currentSemesterController.text,
        cgpa: _cgpa,
        achievements: _achievements,
      );

      final provider = context.read<AppProvider>();
      if (widget.studentToEdit != null) {
        provider.updateStudent(student);
      } else {
        provider.addStudent(student);
      }

      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            widget.studentToEdit != null 
                ? 'Student updated successfully!' 
                : 'Student added successfully!',
          ),
          backgroundColor: AppTheme.successColor,
        ),
      );
    }
  }

  void _showDeleteConfirmation() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Student'),
        content: Text('Are you sure you want to delete ${widget.studentToEdit!.name}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              context.read<AppProvider>().deleteStudent(widget.studentToEdit!.id);
              Navigator.of(context).pop();
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('${widget.studentToEdit!.name} deleted successfully!'),
                  backgroundColor: AppTheme.errorColor,
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.errorColor,
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}
