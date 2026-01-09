export interface Student {
    id: string;
    name: string;
    rollNumber: string;
    email: string;
    phone: string;
    department: string;
    year: number;
    photoPath?: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
  }
  
  export interface LabSession {
    id: string;
    title: string;
    courseCode: string;
    instructor: string;
    dateTime: string;
    durationMinutes: number;
    room: string;
    notes?: string;
    createdAt: string;
    maxStudents?: number;
    requirements?: string[];
  }
  
  export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'On Duty';
  
  export interface Attendance {
    id: string;
    sessionId: string;
    studentId: string;
    status: AttendanceStatus;
    timestamp: string;
    markedBy: string;
    remarks?: string;
  }
  
  export interface Staff {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    designation: string;
    photoPath?: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
  }
  
  export interface Work {
    id: string;
    title: string;
    description: string;
    sessionId: string;
    assignedBy: string;
    maxMarks: number;
    dueDate: string;
    createdAt: string;
  }
  
  export interface StudentWork {
    id: string;
    workId: string;
    studentId: string;
    sessionId: string;
    marksObtained?: number;
    status: 'Assigned' | 'In Progress' | 'Completed' | 'Submitted';
    submissionDate?: string;
    feedback?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SessionRecord {
    id: string;
    sessionId: string;
    studentId: string;
    programsCompleted: number;
    outputsGenerated: number;
    recordsSubmitted: boolean;
    observationSigned: boolean;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AppFilters {
    department?: string;
    year?: number;
    dateRange?: {
      start: string;
      end: string;
    };
    status?: AttendanceStatus;
  }