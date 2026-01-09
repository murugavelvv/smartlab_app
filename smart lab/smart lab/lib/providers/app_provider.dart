import 'package:flutter/material.dart';
import '../models/student.dart';
import '../models/lab_session.dart';
import '../models/attendance.dart';

class AppProvider extends ChangeNotifier {
  
  List<Student> _students = [];
  bool _isLoading = false;
  String _searchQuery = '';
  String _filterDepartment = 'All';
  String _sortBy = 'name';
  bool _sortAscending = true;
  bool _isDarkMode = false;

  // Getters
  List<Student> get students => _students;
  bool get isLoading => _isLoading;
  String get searchQuery => _searchQuery;
  String get filterDepartment => _filterDepartment;
  String get sortBy => _sortBy;
  bool get sortAscending => _sortAscending;
  bool get isDarkMode => _isDarkMode;

  // Filtered and sorted students
  List<Student> get filteredStudents {
    return _students.where((student) {
      final matchesSearch = student.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          student.rollNumber.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          student.email.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesDepartment = _filterDepartment == 'All' || student.department == _filterDepartment;
      return matchesSearch && matchesDepartment;
    }).toList()
      ..sort((a, b) {
        int comparison;
        switch (_sortBy) {
          case 'name':
            comparison = a.name.compareTo(b.name);
            break;
          case 'marks':
            comparison = a.marks.compareTo(b.marks);
            break;
          case 'attendance':
            comparison = a.attendancePercentage.compareTo(a.attendancePercentage);
            break;
          case 'rollNumber':
            comparison = a.rollNumber.compareTo(b.rollNumber);
            break;
          case 'department':
            comparison = a.department.compareTo(b.department);
            break;
          default:
            comparison = a.name.compareTo(b.name);
        }
        return _sortAscending ? comparison : -comparison;
      });
  }

  // Statistics
  double get averageMarks {
    if (_students.isEmpty) return 0.0;
    return _students.map((s) => s.marks).reduce((a, b) => a + b) / _students.length;
  }

  double get averageAttendance {
    if (_students.isEmpty) return 0.0;
    return _students.map((s) => s.attendancePercentage).reduce((a, b) => a + b) / _students.length;
  }

  Student? get topPerformer {
    if (_students.isEmpty) return null;
    _students.sort((a, b) => b.marks.compareTo(a.marks));
    return _students.first;
  }

  int get totalStudentsPresent {
    return _students.where((student) => student.isPresent).length;
  }

  List<String> get departments {
    return _students.map((s) => s.department).toSet().toList()..sort();
  }

  // Initialize with mock data
  AppProvider() {
    _loadMockData();
  }

  // Load mock data as fallback
  void _loadMockData() {
    _students = [
      Student(
        id: '1',
        name: 'Aravind Kumar',
        rollNumber: 'CS001',
        department: 'Computer Science',
        email: 'aravind.kumar@example.com',
        phone: '+91 98765 43210',
        year: '2024',  // Added year
        marks: 95,
        problemsSolved: 15,
        outputsCount: 12,
        attendancePercentage: 92,
        remarks: 'Excellent performance in programming labs',
        lastUpdated: DateTime.now().subtract(const Duration(hours: 2)),
        dateOfBirth: DateTime(2000, 5, 15),
        labSessions: [
          LabSession(
            id: '1',
            title: 'Data Structures Lab',  // Added title
            description: 'Implementation of linked lists',  // Added description
            date: DateTime.now().subtract(const Duration(days: 1)),
            startTime: DateTime.now().subtract(const Duration(days: 1, hours: 2)),  // Added startTime
            endTime: DateTime.now().subtract(const Duration(days: 1, hours: 1)),  // Added endTime
            maxStudents: 30,  // Added maxStudents
            sessionName: 'Data Structures Lab',
            marks: 95,
            topic: 'Linked Lists Implementation',
            instructor: 'Dr. Smith',
            notes: 'Excellent understanding of concepts',
            completedTasks: ['Singly Linked List', 'Doubly Linked List', 'Circular Linked List'],
            labRoom: 'Lab 101',
            equipment: 'Computer, IDE',
            duration: 120,
          ),
        ],
        achievements: ['Top Performer', 'Perfect Attendance', 'Problem Solver'],
        skills: ['Java', 'Python', 'Data Structures', 'Algorithms'],
        currentSemester: '6th Semester',
        cgpa: 8.9,
      ),
      Student(
        id: '2',
        name: 'Deepa Sharma',
        rollNumber: 'CS002',
        department: 'Computer Science',
        email: 'deepa.sharma@example.com',
        phone: '+91 98765 43211',
        year: '2024',  // Added year
        marks: 88,
        problemsSolved: 12,
        outputsCount: 10,
        attendancePercentage: 88,
        remarks: 'Good analytical skills',
        lastUpdated: DateTime.now().subtract(const Duration(hours: 4)),
        dateOfBirth: DateTime(2001, 3, 22),
        achievements: ['Consistent Performer', 'Team Player'],
        skills: ['C++', 'Python', 'Web Development'],
        currentSemester: '6th Semester',
        cgpa: 8.2,
      ),
      Student(
        id: '3',
        name: 'Karthik Reddy',
        rollNumber: 'CS003',
        department: 'Computer Science',
        email: 'karthik.reddy@example.com',
        phone: '+91 98765 43212',
        year: '2024',  // Added year
        marks: 76,
        problemsSolved: 9,
        outputsCount: 8,
        attendancePercentage: 75,
        remarks: 'Needs improvement in problem-solving',
        lastUpdated: DateTime.now().subtract(const Duration(days: 1)),
        dateOfBirth: DateTime(2000, 8, 10),
        achievements: ['Most Improved'],
        skills: ['Java', 'Basic Programming'],
        currentSemester: '6th Semester',
        cgpa: 7.1,
      ),
      Student(
        id: '4',
        name: 'Priya Patel',
        rollNumber: 'CS004',
        department: 'Computer Science',
        email: 'priya.patel@example.com',
        phone: '+91 98765 43213',
        year: '2024',  // Added year
        marks: 98,
        problemsSolved: 18,
        outputsCount: 15,
        attendancePercentage: 96,
        remarks: 'Outstanding performance in all labs',
        lastUpdated: DateTime.now().subtract(const Duration(hours: 1)),
        dateOfBirth: DateTime(2000, 12, 5),
        achievements: ['Top Performer', 'Perfect Attendance', 'Innovation Award'],
        skills: ['Python', 'Machine Learning', 'Data Science', 'Web Development'],
        currentSemester: '6th Semester',
        cgpa: 9.2,
      ),
      Student(
        id: '5',
        name: 'Rahul Singh',
        rollNumber: 'CS005',
        department: 'Computer Science',
        email: 'rahul.singh@example.com',
        phone: '+91 98765 43214',
        year: '2024',  // Added year
        marks: 65,
        problemsSolved: 8,
        outputsCount: 7,
        attendancePercentage: 70,
        remarks: 'Needs more practice and dedication',
        lastUpdated: DateTime.now().subtract(const Duration(days: 2)),
        dateOfBirth: DateTime(2001, 1, 18),
        achievements: ['Most Improved'],
        skills: ['Basic Programming', 'C'],
        currentSemester: '6th Semester',
        cgpa: 6.8,
      ),
    ];
  }

  // Student CRUD operations with local storage
  Future<void> addStudent(Student student) async {
    _students.add(student);
    notifyListeners();
  }

  Future<void> updateStudent(Student student) async {
    final index = _students.indexWhere((s) => s.id == student.id);
    if (index != -1) {
      _students[index] = student;
      notifyListeners();
    }
  }

  Future<void> deleteStudent(String id) async {
    _students.removeWhere((s) => s.id == id);
    notifyListeners();
  }

  Student? getStudent(String id) {
    try {
      return _students.firstWhere((s) => s.id == id);
    } catch (e) {
      return null;
    }
  }

  // Search and filter operations
  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void setFilterDepartment(String department) {
    _filterDepartment = department;
    notifyListeners();
  }

  void setSortBy(String sortBy) {
    _sortBy = sortBy;
    notifyListeners();
  }

  void toggleSortOrder() {
    _sortAscending = !_sortAscending;
    notifyListeners();
  }

  // Theme operations
  void toggleTheme() {
    _isDarkMode = !_isDarkMode;
    notifyListeners();
  }

  // Attendance operations
  Future<void> toggleAttendance(String studentId) async {
    final student = getStudent(studentId);
    if (student != null) {
      student.isPresent = !student.isPresent;
      student.lastUpdated = DateTime.now();
      notifyListeners();
    }
  }

  void updateStudentAttendance(String studentId, AttendanceStatus status) {
    final student = getStudent(studentId);
    if (student != null) {
      student.isPresent = status == AttendanceStatus.present;
      student.lastUpdated = DateTime.now();
      notifyListeners();
    }
  }

  void updateAttendanceForDate(DateTime date, Map<String, AttendanceStatus> attendanceMap) {
    for (final entry in attendanceMap.entries) {
      final student = getStudent(entry.key);
      if (student != null) {
        student.isPresent = entry.value == AttendanceStatus.present;
        student.lastUpdated = DateTime.now();
      }
    }
    notifyListeners();
  }

  void updateAttendanceWithMarks(
    DateTime date, 
    Map<String, Map<String, dynamic>> attendanceData
  ) {
    for (final entry in attendanceData.entries) {
      final student = getStudent(entry.key);
      if (student != null) {
        final data = entry.value;
        final status = data['status'] as AttendanceStatus;
        final observationMarks = data['observationMarks'] as double?;
        final recordMarks = data['recordMarks'] as double?;
        
        student.isPresent = status == AttendanceStatus.present;
        student.lastUpdated = DateTime.now();
        
        // Update marks if provided
        if (observationMarks != null || recordMarks != null) {
          // You might want to store these in a separate data structure
          // For now, we'll update the student's overall marks
          if (observationMarks != null && recordMarks != null) {
            student.marks = ((observationMarks + recordMarks) / 2).round();
          }
        }
      }
    }
    notifyListeners();
  }

  // Lab session operations
  Future<void> addLabSession(String studentId, LabSession session) async {
    final student = getStudent(studentId);
    if (student != null) {
      student.labSessions.add(session);
      student.lastUpdated = DateTime.now();
      notifyListeners();
    }
  }

  void updateLabSession(String studentId, LabSession session) {
    final student = getStudent(studentId);
    if (student != null) {
      final index = student.labSessions.indexWhere((s) => s.id == session.id);
      if (index != -1) {
        student.labSessions[index] = session;
        student.lastUpdated = DateTime.now();
        notifyListeners();
      }
    }
  }

  // Analytics methods
  Map<String, dynamic> getDashboardStats() {
    return {
      'totalStudents': _students.length,
      'averageMarks': averageMarks,
      'averageAttendance': averageAttendance,
      'topPerformer': topPerformer?.name ?? 'N/A',
      'totalPresent': totalStudentsPresent,
      'departments': departments.length,
    };
  }

  List<Map<String, dynamic>> getPerformanceData() {
    final now = DateTime.now();
    final data = <Map<String, dynamic>>[];
    
    for (int i = 6; i >= 0; i--) {
      final date = now.subtract(Duration(days: i));
      final dayStudents = _students.where((s) =>
        s.lastUpdated.year == date.year &&
        s.lastUpdated.month == date.month &&
        s.lastUpdated.day == date.day
      ).toList();
      
      final averageMarks = dayStudents.isNotEmpty 
        ? dayStudents.map((s) => s.marks).reduce((a, b) => a + b) / dayStudents.length
        : 0.0;

      data.add({
        'date': '${date.month}/${date.day}',
        'students': dayStudents.length,
        'averageMarks': averageMarks.round(),
      });
    }
    
    return data;
  }

  List<Map<String, dynamic>> getDepartmentStats() {
    final departmentStats = <Map<String, dynamic>>[];
    final departments = _students.map((s) => s.department).toSet();
    
    for (final dept in departments) {
      final deptStudents = _students.where((s) => s.department == dept).toList();
      if (deptStudents.isNotEmpty) {
        final avgMarks = deptStudents.map((s) => s.marks).reduce((a, b) => a + b) / deptStudents.length;
        final avgAttendance = deptStudents.map((s) => s.attendancePercentage).reduce((a, b) => a + b) / deptStudents.length;
        
        departmentStats.add({
          'department': dept,
          'students': deptStudents.length,
          'averageMarks': avgMarks.round(),
          'averageAttendance': avgAttendance.round(),
        });
      }
    }
    
    return departmentStats;
  }

  // Refresh data
  Future<void> refreshData() async {
    _isLoading = true;
    notifyListeners();
    // Simulate loading delay
    await Future.delayed(const Duration(milliseconds: 500));
    _loadMockData();
    _isLoading = false;
    notifyListeners();
  }
}
