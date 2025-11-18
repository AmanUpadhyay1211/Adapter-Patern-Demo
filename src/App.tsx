import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import { StudentRepository } from './services/studentRepo';
import { selectStudentList, selectIsLoading, selectIsRefreshing, selectError } from './store/studentSlice';
import type { Student } from './types';
import { MainContainer } from './components/MainContainer';
import { Header } from './components/Header';
import { StudentsTable } from './components/ui/StudentsTable';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

function App() {
  const repositoryRef = useRef(new StudentRepository());
  const students = useSelector(selectStudentList);
  const isLoading = useSelector(selectIsLoading);
  const isRefreshing = useSelector(selectIsRefreshing);
  const error = useSelector(selectError);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Student | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
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
        />
      )}
    </MainContainer>
  );
}

export default App;
