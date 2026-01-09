import 'lab_session.dart';

class Student {
  String id;
  String name;
  String rollNumber;
  String department;
  String email;
  String phone;
  String year;  // Added year field
  int marks;
  int problemsSolved;
  int outputsCount;
  int attendancePercentage;
  String remarks;
  bool isPresent;
  DateTime lastUpdated;
  List<LabSession> labSessions;
  List<String> achievements;
  String profileImage;
  DateTime dateOfBirth;
  String address;
  String emergencyContact;
  String parentName;
  String parentPhone;
  List<String> skills;
  String currentSemester;
  double cgpa;

  Student({
    required this.id,
    required this.name,
    required this.rollNumber,
    required this.department,
    required this.email,
    required this.phone,
    required this.year,  // Added year parameter
    required this.marks,
    required this.problemsSolved,
    required this.outputsCount,
    this.attendancePercentage = 0,
    this.remarks = '',
    this.isPresent = true,
    required this.lastUpdated,
    List<LabSession>? labSessions,
    List<String>? achievements,
    this.profileImage = '',
    required this.dateOfBirth,
    this.address = '',
    this.emergencyContact = '',
    this.parentName = '',
    this.parentPhone = '',
    List<String>? skills,
    this.currentSemester = '',
    this.cgpa = 0.0,
  }) : 
    labSessions = labSessions ?? [],
    achievements = achievements ?? [],
    skills = skills ?? [];

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      id: json['id'],
      name: json['name'],
      rollNumber: json['rollNumber'],
      department: json['department'],
      email: json['email'],
      phone: json['phone'],
      year: json['year'] ?? '',  // Added year parsing
      marks: json['marks'],
      problemsSolved: json['problemsSolved'],
      outputsCount: json['outputsCount'],
      attendancePercentage: json['attendancePercentage'] ?? 0,
      remarks: json['remarks'] ?? '',
      isPresent: json['isPresent'] ?? true,
      lastUpdated: DateTime.parse(json['lastUpdated']),
      labSessions: (json['labSessions'] as List?)
          ?.map((session) => LabSession.fromJson(session))
          .toList() ?? [],
      achievements: List<String>.from(json['achievements'] ?? []),
      profileImage: json['profileImage'] ?? '',
      dateOfBirth: DateTime.parse(json['dateOfBirth']),
      address: json['address'] ?? '',
      emergencyContact: json['emergencyContact'] ?? '',
      parentName: json['parentName'] ?? '',
      parentPhone: json['parentPhone'] ?? '',
      skills: List<String>.from(json['skills'] ?? []),
      currentSemester: json['currentSemester'] ?? '',
      cgpa: (json['cgpa'] ?? 0.0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'rollNumber': rollNumber,
      'department': department,
      'email': email,
      'phone': phone,
      'year': year,  // Added year to JSON
      'marks': marks,
      'problemsSolved': problemsSolved,
      'outputsCount': outputsCount,
      'attendancePercentage': attendancePercentage,
      'remarks': remarks,
      'isPresent': isPresent,
      'lastUpdated': lastUpdated.toIso8601String(),
      'labSessions': labSessions.map((session) => session.toJson()).toList(),
      'achievements': achievements,
      'profileImage': profileImage,
      'dateOfBirth': dateOfBirth.toIso8601String(),
      'address': address,
      'emergencyContact': emergencyContact,
      'parentName': parentName,
      'parentPhone': parentPhone,
      'skills': skills,
      'currentSemester': currentSemester,
      'cgpa': cgpa,
    };
  }

  Student copyWith({
    String? id,
    String? name,
    String? rollNumber,
    String? department,
    String? email,
    String? phone,
    String? year,  // Added year to copyWith
    int? marks,
    int? problemsSolved,
    int? outputsCount,
    int? attendancePercentage,
    String? remarks,
    bool? isPresent,
    DateTime? lastUpdated,
    List<LabSession>? labSessions,
    List<String>? achievements,
    String? profileImage,
    DateTime? dateOfBirth,
    String? address,
    String? emergencyContact,
    String? parentName,
    String? parentPhone,
    List<String>? skills,
    String? currentSemester,
    double? cgpa,
  }) {
    return Student(
      id: id ?? this.id,
      name: name ?? this.name,
      rollNumber: rollNumber ?? this.rollNumber,
      department: department ?? this.department,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      year: year ?? this.year,  // Added year to copyWith
      marks: marks ?? this.marks,
      problemsSolved: problemsSolved ?? this.problemsSolved,
      outputsCount: outputsCount ?? this.outputsCount,
      attendancePercentage: attendancePercentage ?? this.attendancePercentage,
      remarks: remarks ?? this.remarks,
      isPresent: isPresent ?? this.isPresent,
      lastUpdated: lastUpdated ?? this.lastUpdated,
      labSessions: labSessions ?? this.labSessions,
      achievements: achievements ?? this.achievements,
      profileImage: profileImage ?? this.profileImage,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      address: address ?? this.address,
      emergencyContact: emergencyContact ?? this.emergencyContact,
      parentName: parentName ?? this.parentName,
      parentPhone: parentPhone ?? this.parentPhone,
      skills: skills ?? this.skills,
      currentSemester: currentSemester ?? this.currentSemester,
      cgpa: cgpa ?? this.cgpa,
    );
  }

  double get totalScore => (marks + problemsSolved + outputsCount).toDouble();
  double get averageScore => totalScore / 3;
  bool get isHighPerformer => marks >= 90;
  bool get needsImprovement => marks < 70;
  double get age {
    final now = DateTime.now();
    final age = now.year - dateOfBirth.year;
    if (now.month < dateOfBirth.month || 
        (now.month == dateOfBirth.month && now.day < dateOfBirth.day)) {
      return (age - 1).toDouble();
    }
    return age.toDouble();
  }
}
