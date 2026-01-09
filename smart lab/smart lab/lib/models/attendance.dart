enum AttendanceStatus {
  present,
  absent,
  onDuty,
}

// Simple Attendance class for Firebase
class Attendance {
  final String id;
  final String studentId;
  final String labSessionId;
  final String status;
  final DateTime timestamp;

  Attendance({
    required this.id,
    required this.studentId,
    required this.labSessionId,
    required this.status,
    required this.timestamp,
  });

  factory Attendance.fromJson(Map<String, dynamic> json) {
    return Attendance(
      id: json['id'],
      studentId: json['studentId'],
      labSessionId: json['labSessionId'],
      status: json['status'],
      timestamp: (json['timestamp'] as dynamic).toDate(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'studentId': studentId,
      'labSessionId': labSessionId,
      'status': status,
      'timestamp': timestamp,
    };
  }
}

class AttendanceRecord {
  final String id;
  final String studentId;
  final DateTime date;
  final AttendanceStatus status;
  final DateTime recordedAt;
  final String? remarks;
  final double? observationMarks;
  final double? recordMarks;

  AttendanceRecord({
    required this.id,
    required this.studentId,
    required this.date,
    required this.status,
    required this.recordedAt,
    this.remarks,
    this.observationMarks,
    this.recordMarks,
  });

  factory AttendanceRecord.fromJson(Map<String, dynamic> json) {
    return AttendanceRecord(
      id: json['id'],
      studentId: json['studentId'],
      date: DateTime.parse(json['date']),
      status: AttendanceStatus.values.firstWhere(
        (e) => e.toString() == 'AttendanceStatus.${json['status']}',
      ),
      recordedAt: DateTime.parse(json['recordedAt']),
      remarks: json['remarks'],
      observationMarks: json['observationMarks']?.toDouble(),
      recordMarks: json['recordMarks']?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'studentId': studentId,
      'date': date.toIso8601String(),
      'status': status.toString().split('.').last,
      'recordedAt': recordedAt.toIso8601String(),
      'remarks': remarks,
      'observationMarks': observationMarks,
      'recordMarks': recordMarks,
    };
  }

  AttendanceRecord copyWith({
    String? id,
    String? studentId,
    DateTime? date,
    AttendanceStatus? status,
    DateTime? recordedAt,
    String? remarks,
    double? observationMarks,
    double? recordMarks,
  }) {
    return AttendanceRecord(
      id: id ?? this.id,
      studentId: studentId ?? this.studentId,
      date: date ?? this.date,
      status: status ?? this.status,
      recordedAt: recordedAt ?? this.recordedAt,
      remarks: remarks ?? this.remarks,
      observationMarks: observationMarks ?? this.observationMarks,
      recordMarks: recordMarks ?? this.recordMarks,
    );
  }
}

class DailyAttendance {
  final DateTime date;
  final List<AttendanceRecord> records;

  DailyAttendance({
    required this.date,
    required this.records,
  });

  int get presentCount => records.where((r) => r.status == AttendanceStatus.present).length;
  int get absentCount => records.where((r) => r.status == AttendanceStatus.absent).length;
  int get onDutyCount => records.where((r) => r.status == AttendanceStatus.onDuty).length;
  int get totalCount => records.length;

  double get attendancePercentage {
    if (totalCount == 0) return 0.0;
    return ((presentCount + onDutyCount) / totalCount) * 100;
  }
}
