import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { studentService } from '../services/studentService';
import { storageService } from '../services/storageService';
import { STORAGE_KEYS } from '../constants/storageKeys';
import toast from 'react-hot-toast';

const StudentContext = createContext();

const initialState = {
  students: [],
  isLoading: true,
  error: null,
};

function studentReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, students: action.payload, isLoading: false, error: null };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_STUDENT':
      return { ...state, students: [action.payload, ...state.students.filter(s => s.id !== action.payload.id)] };
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map((s) => (s.id === action.payload.id ? action.payload : s)),
      };
    case 'DELETE_STUDENT':
      return {
        ...state,
        students: state.students.filter((s) => s.id !== action.payload),
      };
    default:
      return state;
  }
}

/**
 * StudentProvider
 * Centralized reactive store for students roster.
 * Subscribes to storageService events so changes propagate everywhere instantly.
 */
export function StudentProvider({ children }) {
  const [state, dispatch] = useReducer(studentReducer, initialState);

  const fetchStudents = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await studentService.getAllStudents();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      toast.error('Failed to load student roster');
    }
  }, []);

  useEffect(() => {
    fetchStudents();

    // Centralized store listener: if any student data changes anywhere, sync immediately
    const unsubscribe = storageService.subscribe((key, value) => {
      if (key === STORAGE_KEYS.STUDENTS || key === '*') {
        if (value && Array.isArray(value)) {
          dispatch({ type: 'FETCH_SUCCESS', payload: value });
        } else {
          fetchStudents();
        }
      }
    });

    return unsubscribe;
  }, [fetchStudents]);

  const addStudent = async (studentData) => {
    const result = await studentService.addStudent(studentData);
    dispatch({ type: 'ADD_STUDENT', payload: result.student });
    toast.success(`Enrolled student ${result.student.name}`);
    return result;
  };

  const updateStudent = async (id, updateData) => {
    const updated = await studentService.updateStudent(id, updateData);
    dispatch({ type: 'UPDATE_STUDENT', payload: updated });
    toast.success('Student record updated');
    return updated;
  };

  const toggleDisableStudent = async (id) => {
    const updated = await studentService.toggleDisableStudent(id);
    dispatch({ type: 'UPDATE_STUDENT', payload: updated });
    toast.success(`Status changed to ${updated.status.toUpperCase()}`);
    return updated;
  };

  const deleteStudent = async (id) => {
    await studentService.deleteStudent(id);
    dispatch({ type: 'DELETE_STUDENT', payload: id });
    toast.success('Student record deleted');
  };

  const value = useMemo(
    () => ({
      students: state.students,
      isLoading: state.isLoading,
      error: state.error,
      refreshStudents: fetchStudents,
      addStudent,
      updateStudent,
      toggleDisableStudent,
      deleteStudent,
    }),
    [state.students, state.isLoading, state.error, fetchStudents]
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudents() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider (Teacher context only)');
  }
  return context;
}
