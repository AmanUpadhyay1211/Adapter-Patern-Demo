import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./App.css";
import { StudentRepository } from "./services/studentRepo";
import {
  selectStudentList,
  selectIsLoading,
  selectIsRefreshing,
  selectError,
  setError,
} from "./store/studentSlice";
import type { EditableStudentField, Student } from "./types";
import { MainContainer } from "./components/MainContainer";
import { Header } from "./components/Header";
import { StudentsTable } from "./components/ui/StudentsTable";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

function App() {
  const repositoryRef = useRef(new StudentRepository());
  const dispatch = useDispatch();
  const students = useSelector(selectStudentList);
  const isLoading = useSelector(selectIsLoading);
  const isRefreshing = useSelector(selectIsRefreshing);
  const error = useSelector(selectError);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Student | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [cellStatuses, setCellStatuses] = useState<
    Record<string, "saving" | "error" | undefined>
  >({});

  // Load students on mount
  useEffect(() => {
    repositoryRef.current.loadStudents();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    repositoryRef.current.refreshInBackground();
  };

  // Filter and sort students
  const filteredAndSortedStudents = [...students]
    .filter((student) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        student.name.toLowerCase().includes(term) ||
        student.rollNumber.toLowerCase().includes(term) ||
        student.bloodGroup.toLowerCase().includes(term) ||
        student.class.toLowerCase().includes(term) ||
        student.section.toLowerCase().includes(term) ||
        student.phone.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Handle column sort
  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const cellKey = (studentId: string, field: keyof Student) =>
    `${studentId}:${field}`;

  const updateStatus = (
    key: string,
    status: "saving" | "error" | undefined
  ) => {
    setCellStatuses((prev) => {
      if (!status) {
        const { [key]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: status };
    });
  };

  const buildPatch = (
    field: EditableStudentField,
    value: string
  ): Partial<Student> => {
    if (field === "attendance") {
      const attendance = Number(value);
      if (Number.isNaN(attendance) || attendance < 0 || attendance > 100) {
        throw new Error("Attendance must be a number between 0 and 100");
      }
      return { attendance };
    }

    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error("Value cannot be empty");
    }

    return { [field]: trimmed } as Partial<Student>;
  };

  const handleFieldSave = async (
    studentId: string,
    field: EditableStudentField,
    value: string
  ) => {
    const key = cellKey(studentId, field);
    let patch: Partial<Student>;

    try {
      patch = buildPatch(field, value);
    } catch (validationError) {
      const message =
        validationError instanceof Error
          ? validationError.message
          : "Invalid value";
      console.error(message);
      dispatch(setError(message));
      updateStatus(key, "error");
      return;
    }

    updateStatus(key, "saving");
    try {
      await repositoryRef.current.updateStudent(studentId, patch);
      updateStatus(key, undefined);
    } catch (error) {
      console.error(error);
      updateStatus(key, "error");
    }
  };

  return (
    <MainContainer>
      <Header
        onRefresh={handleRefresh}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        error={error}
        studentsCount={students.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {isLoading && students.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <StudentsTable
          students={students}
          filteredStudents={filteredAndSortedStudents}
          searchTerm={searchTerm}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onFieldSave={handleFieldSave}
          cellStatuses={cellStatuses}
        />
      )}
    </MainContainer>
  );
}

export default App;
