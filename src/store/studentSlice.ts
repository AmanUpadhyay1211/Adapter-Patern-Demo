import type { Student } from "../types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface StudentState {
  studentArray: Student[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

const initialState: StudentState = {
  studentArray: [],
  isLoading: true,
  isRefreshing: false,
  error: null,
};

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.studentArray = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    updateStudents: (state, action: PayloadAction<Student[]>) => {
      state.studentArray = action.payload;
      state.isRefreshing = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isRefreshing = false;
    },
  },
});

export const {
  setStudents,
  updateStudents,
  setLoading,
  setRefreshing,
  setError,
} = studentSlice.actions;

export default studentSlice.reducer;
