import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import { Student, LabSession, Attendance, AppFilters, AttendanceStatus } from '@/types';
import { useStorage } from './StorageProvider';

interface AppState {
  students: Student[];
  sessions: LabSession[];
  attendance: Record<string, Attendance[]>;
  filters: AppFilters;
  selectedSessionId?: string;
  isLoading: boolean;
  errorMessage?: string;
  enablePersistence: boolean;
}

export const [AppProvider, useApp] = createContextHook(() => {
  const storage = useStorage();
  const [state, setState] = useState<AppState>({
    students: [],
    sessions: [],
    attendance: {},
    filters: {},
    isLoading: false,
    enablePersistence: true,
  });

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const saveToStorage = useCallback(async (key: string, data: any) => {
    if (!state.enablePersistence || !key?.trim() || key.length > 100) return;
    try {
      const sanitizedData = typeof data === 'string' ? data : JSON.stringify(data);
      await storage.setItem(key.trim(), sanitizedData);
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  }, [state.enablePersistence, storage]);

  const loadFromStorage = useCallback(async (key: string) => {
    if (!state.enablePersistence || !key?.trim() || key.length > 100) return null;
    try {
      const data = await storage.getItem(key.trim());
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return null;
    }
  }, [state.enablePersistence, storage]);

  const initializeSampleData = useCallback(async () => {
    const sampleStudents = [
      {
        id: generateId(),
        name: 'John Doe',
        rollNumber: 'CS001',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        department: 'Computer Science',
        year: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      },
      {
        id: generateId(),
        name: 'Jane Smith',
        rollNumber: 'CS002',
        email: 'jane.smith@example.com',
        phone: '+1234567891',
        department: 'Computer Science',
        year: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      },
      {
        id: generateId(),
        name: 'Mike Johnson',
        rollNumber: 'EE001',
        email: 'mike.johnson@example.com',
        phone: '+1234567892',
        department: 'Electrical Engineering',
        year: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      },
    ];

    const sampleSessions = [
      {
        id: generateId(),
        title: 'Data Structures Lab',
        courseCode: 'CS301',
        instructor: 'Dr. Smith',
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        durationMinutes: 120,
        room: 'Lab 101',
        notes: 'Bring your laptops',
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Database Systems Lab',
        courseCode: 'CS401',
        instructor: 'Prof. Johnson',
        dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
        durationMinutes: 180,
        room: 'Lab 102',
        notes: 'SQL queries practice',
        createdAt: new Date().toISOString(),
      },
    ];

    await Promise.all([
      saveToStorage('students', sampleStudents),
      saveToStorage('sessions', sampleSessions),
      saveToStorage('attendance', {}),
    ]);

    return { students: sampleStudents, sessions: sampleSessions, attendance: {} };
  }, [saveToStorage]);

  const refreshAll = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, errorMessage: undefined }));
    try {
      const [studentsData, sessionsData, attendanceData] = await Promise.all([
        loadFromStorage('students'),
        loadFromStorage('sessions'),
        loadFromStorage('attendance'),
      ]);

      console.log('Loaded data:', { studentsData, sessionsData, attendanceData });

      // If no data exists, initialize with sample data
      if (!studentsData && !sessionsData) {
        console.log('No existing data found, initializing with sample data');
        const sampleData = await initializeSampleData();
        setState(prev => ({
          ...prev,
          students: sampleData.students,
          sessions: sampleData.sessions,
          attendance: sampleData.attendance,
          isLoading: false,
          errorMessage: undefined,
        }));
      } else {
        setState(prev => ({
          ...prev,
          students: studentsData || [],
          sessions: sessionsData || [],
          attendance: attendanceData || {},
          isLoading: false,
          errorMessage: undefined,
        }));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setState(prev => ({
        ...prev,
        errorMessage: 'Failed to load data',
        isLoading: false,
      }));
    }
  }, [loadFromStorage, initializeSampleData]);

  const addStudent = useCallback(async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStudent: Student = {
      ...studentData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setState(prev => {
      const updated = [...prev.students, newStudent];
      saveToStorage('students', updated);
      return { ...prev, students: updated };
    });
  }, [saveToStorage]);

  const updateStudent = useCallback(async (id: string, updates: Partial<Student>) => {
    setState(prev => {
      const updated = prev.students.map(student =>
        student.id === id
          ? { ...student, ...updates, updatedAt: new Date().toISOString() }
          : student
      );
      saveToStorage('students', updated);
      return { ...prev, students: updated };
    });
  }, [saveToStorage]);

  const deleteStudent = useCallback(async (id: string) => {
    setState(prev => {
      const updated = prev.students.filter(student => student.id !== id);
      saveToStorage('students', updated);
      return { ...prev, students: updated };
    });
  }, [saveToStorage]);

  const addSession = useCallback(async (sessionData: Omit<LabSession, 'id' | 'createdAt'>) => {
    const newSession: LabSession = {
      ...sessionData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    setState(prev => {
      const updated = [...prev.sessions, newSession];
      saveToStorage('sessions', updated);
      return { ...prev, sessions: updated };
    });
  }, [saveToStorage]);

  const updateSession = useCallback(async (id: string, updates: Partial<LabSession>) => {
    setState(prev => {
      const updated = prev.sessions.map(session =>
        session.id === id ? { ...session, ...updates } : session
      );
      saveToStorage('sessions', updated);
      return { ...prev, sessions: updated };
    });
  }, [saveToStorage]);

  const deleteSession = useCallback(async (id: string) => {
    setState(prev => {
      const updatedSessions = prev.sessions.filter(session => session.id !== id);
      const updatedAttendance = { ...prev.attendance };
      delete updatedAttendance[id];
      
      saveToStorage('sessions', updatedSessions);
      saveToStorage('attendance', updatedAttendance);
      
      return { 
        ...prev, 
        sessions: updatedSessions,
        attendance: updatedAttendance 
      };
    });
  }, [saveToStorage]);

  const markAttendance = useCallback(async (sessionId: string, studentId: string, status: AttendanceStatus, remarks?: string) => {
    const attendanceRecord: Attendance = {
      id: generateId(),
      sessionId,
      studentId,
      status,
      timestamp: new Date().toISOString(),
      markedBy: 'System',
      remarks,
    };

    setState(prev => {
      const sessionAttendance = prev.attendance[sessionId] || [];
      const existingIndex = sessionAttendance.findIndex(a => a.studentId === studentId);
      
      let updatedSessionAttendance;
      if (existingIndex >= 0) {
        updatedSessionAttendance = [...sessionAttendance];
        updatedSessionAttendance[existingIndex] = attendanceRecord;
      } else {
        updatedSessionAttendance = [...sessionAttendance, attendanceRecord];
      }

      const updatedAttendance = {
        ...prev.attendance,
        [sessionId]: updatedSessionAttendance,
      };

      saveToStorage('attendance', updatedAttendance);
      return { ...prev, attendance: updatedAttendance };
    });
  }, [saveToStorage]);

  const setFilters = useCallback((filters: AppFilters) => {
    setState(prev => ({ ...prev, filters }));
  }, []);

  const setSelectedSession = useCallback((sessionId?: string) => {
    setState(prev => ({ ...prev, selectedSessionId: sessionId }));
  }, []);

  const togglePersistence = useCallback(async () => {
    setState(prev => ({ ...prev, enablePersistence: !prev.enablePersistence }));
  }, []);

  const clearAllData = useCallback(async () => {
    try {
      await storage.multiRemove(['students', 'sessions', 'attendance']);
      setState(prev => ({
        ...prev,
        students: [],
        sessions: [],
        attendance: {},
      }));
    } catch {
      setState(prev => ({ ...prev, errorMessage: 'Failed to clear data' }));
    }
  }, [storage]);

  const exportAllToJson = useCallback(() => {
    return {
      students: state.students,
      sessions: state.sessions,
      attendance: state.attendance,
      exportedAt: new Date().toISOString(),
    };
  }, [state.students, state.sessions, state.attendance]);

  const importAllFromJson = useCallback(async (data: any) => {
    try {
      setState(prev => ({
        ...prev,
        students: data.students || [],
        sessions: data.sessions || [],
        attendance: data.attendance || {},
      }));

      if (state.enablePersistence) {
        await Promise.all([
          saveToStorage('students', data.students || []),
          saveToStorage('sessions', data.sessions || []),
          saveToStorage('attendance', data.attendance || {}),
        ]);
      }
    } catch {
      setState(prev => ({ ...prev, errorMessage: 'Failed to import data' }));
    }
  }, [state.enablePersistence, saveToStorage]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return {
    ...state,
    refreshAll,
    addStudent,
    updateStudent,
    deleteStudent,
    addSession,
    updateSession,
    deleteSession,
    markAttendance,
    setFilters,
    setSelectedSession,
    togglePersistence,
    clearAllData,
    exportAllToJson,
    importAllFromJson,
  };
});

export const useFilteredStudents = () => {
  const { students, filters } = useApp();
  
  return students.filter((student: Student) => {
    if (filters.department && student.department !== filters.department) return false;
    if (filters.year && student.year !== filters.year) return false;
    return student.isActive;
  }).sort((a: Student, b: Student) => a.name.localeCompare(b.name));
};

export const useUpcomingSessions = () => {
  const { sessions } = useApp();
  const now = new Date();
  
  return sessions
    .filter((session: LabSession) => new Date(session.dateTime) > now)
    .sort((a: LabSession, b: LabSession) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
};

export const useSessionAttendance = (sessionId: string) => {
  const { attendance } = useApp();
  return attendance[sessionId] || [];
};