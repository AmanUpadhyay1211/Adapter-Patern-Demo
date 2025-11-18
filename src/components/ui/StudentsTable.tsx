import type { Student } from '../../types';
import { Footer } from '../Footer';

interface StudentsTableProps {
  students: Student[];
  filteredStudents: Student[];
  searchTerm: string;
  sortField: keyof Student | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Student) => void;
}

export function StudentsTable({
  students,
  filteredStudents,
  searchTerm,
  sortField,
  sortDirection,
  onSort,
}: StudentsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const SortIndicator = ({ field }: { field: keyof Student }) => {
    if (sortField !== field) return null;
    return <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => onSort('rollNumber')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Roll Number <SortIndicator field="rollNumber" />
              </th>
              <th
                onClick={() => onSort('name')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Name <SortIndicator field="name" />
              </th>
              <th
                onClick={() => onSort('bloodGroup')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Blood Group <SortIndicator field="bloodGroup" />
              </th>
              <th
                onClick={() => onSort('class')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Class <SortIndicator field="class" />
              </th>
              <th
                onClick={() => onSort('section')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Section <SortIndicator field="section" />
              </th>
              <th
                onClick={() => onSort('phone')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Phone <SortIndicator field="phone" />
              </th>
              <th
                onClick={() => onSort('email')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Email <SortIndicator field="email" />
              </th>
              <th
                onClick={() => onSort('attendance')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Attendance <SortIndicator field="attendance" />
              </th>
              <th
                onClick={() => onSort('lastUpdated')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Last Updated <SortIndicator field="lastUpdated" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                  {searchTerm ? 'No students found matching your search.' : 'No students available.'}
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.rollNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.bloodGroup}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.attendance}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(student.lastUpdated)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filteredStudents.length > 0 && (
        <Footer showing={filteredStudents.length} total={students.length} />
      )}
    </div>
  );
}

