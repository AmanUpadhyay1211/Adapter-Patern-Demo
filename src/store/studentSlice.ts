import type { Student } from "../types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface StudentState {
  studentArray: Student[];
  globalVersion: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

const initialState: StudentState = {
  studentArray: [],
  globalVersion: 1,
  isLoading: true,
  isRefreshing: false,
  error: null,
};

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<{ students: Student[]; globalVersion: number }>) => {
      state.studentArray = action.payload.students;
      state.globalVersion = action.payload.globalVersion;
      state.isLoading = false;
      state.error = null;
    },
    updateStudents: (state, action: PayloadAction<{ students: Student[]; globalVersion: number }>) => {
      state.studentArray = action.payload.students;
      state.globalVersion = action.payload.globalVersion;
      state.isRefreshing = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
    upsertStudent: (state, action: PayloadAction<Student>) => {
      const idx = state.studentArray.findIndex(
        (student) => student.id === action.payload.id
      );
      if (idx >= 0) {
        state.studentArray[idx] = action.payload;
      } else {
        state.studentArray.push(action.payload);
      }
    },
    setGlobalVersion: (state, action: PayloadAction<number>) => {
      state.globalVersion = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isRefreshing = false;
    },
  },
});

export const {
  setStudents,
  updateStudents,
  upsertStudent,
  setLoading,
  setRefreshing,
  setGlobalVersion,
  setError,
} = studentSlice.actions;

// Selectors
export const selectStudentList = (state: { student: StudentState }) => state.student.studentArray;
export const selectGlobalVersion = (state: { student: StudentState }) => state.student.globalVersion;
export const selectIsLoading = (state: { student: StudentState }) => state.student.isLoading;
export const selectIsRefreshing = (state: { student: StudentState }) => state.student.isRefreshing;
export const selectError = (state: { student: StudentState }) => state.student.error;

export default studentSlice.reducer;
