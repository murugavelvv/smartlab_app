class LabSession {
  String id;
  String sessionName;
  String title;  // Added title field
  String description;  // Added description field
  DateTime date;
  DateTime startTime;  // Added startTime field
  DateTime endTime;  // Added endTime field
  int maxStudents;  // Added maxStudents field
  int marks;
  String topic;
  String instructor;
  String notes;
  List<String> completedTasks;
  String labRoom;
  String equipment;
  int duration;
  String status;
  List<String> attachments;
  String feedback;
  String? studentId;

  LabSession({
    required this.id,
    required this.sessionName,
    required this.title,  // Added title parameter
    required this.description,  // Added description parameter
    required this.date,
    required this.startTime,  // Added startTime parameter
    required this.endTime,  // Added endTime parameter
    required this.maxStudents,  // Added maxStudents parameter
    required this.marks,
    required this.topic,
    required this.instructor,
    this.notes = '',
    List<String>? completedTasks,
    this.labRoom = '',
    this.equipment = '',
    this.duration = 0,
    this.status = 'completed',
    List<String>? attachments,
    this.feedback = '',
    this.studentId,
  }) : 
    completedTasks = completedTasks ?? [],
    attachments = attachments ?? [];

  factory LabSession.fromJson(Map<String, dynamic> json) {
    return LabSession(
      id: json['id'],
      sessionName: json['sessionName'],
      title: json['title'] ?? '',  // Added title parsing
      description: json['description'] ?? '',  // Added description parsing
      date: DateTime.parse(json['date']),
      startTime: DateTime.parse(json['startTime'] ?? json['date']),  // Added startTime parsing
      endTime: DateTime.parse(json['endTime'] ?? json['date']),  // Added endTime parsing
      maxStudents: json['maxStudents'] ?? 0,  // Added maxStudents parsing
      marks: json['marks'],
      topic: json['topic'],
      instructor: json['instructor'],
      notes: json['notes'] ?? '',
      completedTasks: List<String>.from(json['completedTasks'] ?? []),
      labRoom: json['labRoom'] ?? '',
      equipment: json['equipment'] ?? '',
      duration: json['duration'] ?? 0,
      status: json['status'] ?? 'completed',
      attachments: List<String>.from(json['attachments'] ?? []),
      feedback: json['feedback'] ?? '',
      studentId: json['studentId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'sessionName': sessionName,
      'title': title,  // Added title to JSON
      'description': description,  // Added description to JSON
      'date': date.toIso8601String(),
      'startTime': startTime.toIso8601String(),  // Added startTime to JSON
      'endTime': endTime.toIso8601String(),  // Added endTime to JSON
      'maxStudents': maxStudents,  // Added maxStudents to JSON
      'marks': marks,
      'topic': topic,
      'instructor': instructor,
      'notes': notes,
      'completedTasks': completedTasks,
      'labRoom': labRoom,
      'equipment': equipment,
      'duration': duration,
      'status': status,
      'attachments': attachments,
      'feedback': feedback,
      'studentId': studentId,
    };
  }

  LabSession copyWith({
    String? id,
    String? sessionName,
    String? title,  // Added title to copyWith
    String? description,  // Added description to copyWith
    DateTime? date,
    DateTime? startTime,  // Added startTime to copyWith
    DateTime? endTime,  // Added endTime to copyWith
    int? maxStudents,  // Added maxStudents to copyWith
    int? marks,
    String? topic,
    String? instructor,
    String? notes,
    List<String>? completedTasks,
    String? labRoom,
    String? equipment,
    int? duration,
    String? status,
    List<String>? attachments,
    String? feedback,
    String? studentId,
  }) {
    return LabSession(
      id: id ?? this.id,
      sessionName: sessionName ?? this.sessionName,
      title: title ?? this.title,  // Added title to copyWith
      description: description ?? this.description,  // Added description to copyWith
      date: date ?? this.date,
      startTime: startTime ?? this.startTime,  // Added startTime to copyWith
      endTime: endTime ?? this.endTime,  // Added endTime to copyWith
      maxStudents: maxStudents ?? this.maxStudents,  // Added maxStudents to copyWith
      marks: marks ?? this.marks,
      topic: topic ?? this.topic,
      instructor: instructor ?? this.instructor,
      notes: notes ?? this.notes,
      completedTasks: completedTasks ?? this.completedTasks,
      labRoom: labRoom ?? this.labRoom,
      equipment: equipment ?? this.equipment,
      duration: duration ?? this.duration,
      status: status ?? this.status,
      attachments: attachments ?? this.attachments,
      feedback: feedback ?? this.feedback,
      studentId: studentId ?? this.studentId,
    );
  }

  bool get isCompleted => status == 'completed';
  bool get isPending => status == 'pending';
  bool get isCancelled => status == 'cancelled';
  String get formattedDate => '${date.day}/${date.month}/${date.year}';
  String get formattedTime => '${date.hour}:${date.minute.toString().padLeft(2, '0')}';
}
