import { useEffect, useState } from 'react';
import './App.css'
import { StudentRepository } from './services/studentRepo';
import type { Student } from './types';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  useEffect(() => {
    const loadStudents = async () => {
      const students = await new StudentRepository().loadStudents();
      console.log("students", students);
      setStudents(students);
    }
    loadStudents();
  }, []);

  return (
    <>
      <div className='flex flex-row gap-4 bg-blue-500'>
        {students.map((student) => (
          <div key={student.id}>
            <h3>{student.name}</h3>
            <p>{student.rollNumber}</p>
            <p>{student.bloodGroup}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
