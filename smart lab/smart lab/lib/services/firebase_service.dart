import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import '../models/student.dart';
import '../models/lab_session.dart';
import '../models/attendance.dart';

class FirebaseService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Initialize Firebase
  static Future<void> initialize() async {
    try {
      await Firebase.initializeApp();
      print('Firebase initialized successfully');
    } catch (e) {
      print('Firebase initialization error: $e');
      // Re-throw to allow main() to handle it
      rethrow;
    }
  }

  // Authentication methods
  Future<UserCredential?> signInWithEmailAndPassword(String email, String password) async {
    try {
      return await _auth.signInWithEmailAndPassword(email: email, password: password);
    } catch (e) {
      print('Sign in error: $e');
      return null;
    }
  }

  Future<UserCredential?> createUserWithEmailAndPassword(String email, String password) async {
    try {
      return await _auth.createUserWithEmailAndPassword(email: email, password: password);
    } catch (e) {
      print('Sign up error: $e');
      return null;
    }
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }

  User? get currentUser => _auth.currentUser;

  // Student CRUD operations
  Future<void> addStudent(Student student) async {
    try {
      await _firestore.collection('students').add({
        'name': student.name,
        'rollNumber': student.rollNumber,
        'email': student.email,
        'phone': student.phone,
        'department': student.department,
        'year': student.year,
        'marks': student.marks,
        'problemsSolved': student.problemsSolved,
        'outputsCount': student.outputsCount,
        'attendancePercentage': student.attendancePercentage,
        'remarks': student.remarks,
        'isPresent': student.isPresent,
        'lastUpdated': FieldValue.serverTimestamp(),
        'dateOfBirth': student.dateOfBirth.toIso8601String(),
        'createdAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      print('Error adding student: $e');
      throw e;
    }
  }

  Future<List<Student>> getStudents() async {
    try {
      QuerySnapshot snapshot = await _firestore.collection('students').get();
      return snapshot.docs.map((doc) {
        Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
        return Student(
          id: doc.id,
          name: data['name'] ?? '',
          rollNumber: data['rollNumber'] ?? '',
          email: data['email'] ?? '',
          phone: data['phone'] ?? '',
          department: data['department'] ?? '',
          year: data['year'] ?? '',
          marks: data['marks'] ?? 0,
          problemsSolved: data['problemsSolved'] ?? 0,
          outputsCount: data['outputsCount'] ?? 0,
          attendancePercentage: data['attendancePercentage'] ?? 0,
          remarks: data['remarks'] ?? '',
          isPresent: data['isPresent'] ?? true,
          lastUpdated: (data['lastUpdated'] as Timestamp).toDate(),
          dateOfBirth: DateTime.parse(data['dateOfBirth'] ?? DateTime.now().toIso8601String()),
        );
      }).toList();
    } catch (e) {
      print('Error getting students: $e');
      return [];
    }
  }

  Future<void> updateStudent(String id, Student student) async {
    try {
      await _firestore.collection('students').doc(id).update({
        'name': student.name,
        'rollNumber': student.rollNumber,
        'email': student.email,
        'phone': student.phone,
        'department': student.department,
        'year': student.year,
        'marks': student.marks,
        'problemsSolved': student.problemsSolved,
        'outputsCount': student.outputsCount,
        'attendancePercentage': student.attendancePercentage,
        'remarks': student.remarks,
        'isPresent': student.isPresent,
        'lastUpdated': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      print('Error updating student: $e');
      throw e;
    }
  }

  Future<void> deleteStudent(String id) async {
    try {
      await _firestore.collection('students').doc(id).delete();
    } catch (e) {
      print('Error deleting student: $e');
      throw e;
    }
  }

  // Lab Session CRUD operations
  Future<void> addLabSession(LabSession labSession) async {
    try {
      await _firestore.collection('lab_sessions').add({
        'title': labSession.title,
        'description': labSession.description,
        'date': labSession.date.toIso8601String(),
        'startTime': labSession.startTime.toIso8601String(),
        'endTime': labSession.endTime.toIso8601String(),
        'maxStudents': labSession.maxStudents,
        'sessionName': labSession.sessionName,
        'marks': labSession.marks,
        'topic': labSession.topic,
        'instructor': labSession.instructor,
        'createdAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      print('Error adding lab session: $e');
      throw e;
    }
  }

  Future<List<LabSession>> getLabSessions() async {
    try {
      QuerySnapshot snapshot = await _firestore.collection('lab_sessions').get();
      return snapshot.docs.map((doc) {
        Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
        return LabSession(
          id: doc.id,
          title: data['title'] ?? '',
          description: data['description'] ?? '',
          date: DateTime.parse(data['date']),
          startTime: DateTime.parse(data['startTime']),
          endTime: DateTime.parse(data['endTime']),
          maxStudents: data['maxStudents'] ?? 0,
          sessionName: data['sessionName'] ?? '',
          marks: data['marks'] ?? 0,
          topic: data['topic'] ?? '',
          instructor: data['instructor'] ?? '',
        );
      }).toList();
    } catch (e) {
      print('Error getting lab sessions: $e');
      return [];
    }
  }

  // Attendance operations
  Future<void> markAttendance(Attendance attendance) async {
    try {
      await _firestore.collection('attendance').add({
        'studentId': attendance.studentId,
        'labSessionId': attendance.labSessionId,
        'status': attendance.status,
        'timestamp': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      print('Error marking attendance: $e');
      throw e;
    }
  }

  Future<List<Attendance>> getAttendanceBySession(String labSessionId) async {
    try {
      QuerySnapshot snapshot = await _firestore
          .collection('attendance')
          .where('labSessionId', isEqualTo: labSessionId)
          .get();
      
      return snapshot.docs.map((doc) {
        Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
        return Attendance(
          id: doc.id,
          studentId: data['studentId'] ?? '',
          labSessionId: data['labSessionId'] ?? '',
          status: data['status'] ?? '',
          timestamp: (data['timestamp'] as dynamic).toDate(),
        );
      }).toList();
    } catch (e) {
      print('Error getting attendance: $e');
      return [];
    }
  }

  // Real-time listeners
  Stream<List<Student>> getStudentsStream() {
    return _firestore
        .collection('students')
        .snapshots()
        .map((snapshot) => snapshot.docs.map((doc) {
              Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
              return Student(
                id: doc.id,
                name: data['name'] ?? '',
                rollNumber: data['rollNumber'] ?? '',
                email: data['email'] ?? '',
                phone: data['phone'] ?? '',
                department: data['department'] ?? '',
                year: data['year'] ?? '',
                marks: data['marks'] ?? 0,
                problemsSolved: data['problemsSolved'] ?? 0,
                outputsCount: data['outputsCount'] ?? 0,
                attendancePercentage: data['attendancePercentage'] ?? 0,
                remarks: data['remarks'] ?? '',
                isPresent: data['isPresent'] ?? true,
                lastUpdated: (data['lastUpdated'] as dynamic).toDate(),
                dateOfBirth: DateTime.parse(data['dateOfBirth'] ?? DateTime.now().toIso8601String()),
              );
            }).toList());
  }

  Stream<List<LabSession>> getLabSessionsStream() {
    return _firestore
        .collection('lab_sessions')
        .snapshots()
        .map((snapshot) => snapshot.docs.map((doc) {
              Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
              return LabSession(
                id: doc.id,
                title: data['title'] ?? '',
                description: data['description'] ?? '',
                date: DateTime.parse(data['date']),
                startTime: DateTime.parse(data['startTime']),
                endTime: DateTime.parse(data['endTime']),
                maxStudents: data['maxStudents'] ?? 0,
                sessionName: data['sessionName'] ?? '',
                marks: data['marks'] ?? 0,
                topic: data['topic'] ?? '',
                instructor: data['instructor'] ?? '',
              );
            }).toList());
  }
}
