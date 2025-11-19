import { useState, useEffect } from "react";
import type { EditableStudentField, Student } from "../../types";
import { Footer } from "../Footer";

type CellStatus = "saving" | "error";

interface StudentsTableProps {
  students: Student[];
  filteredStudents: Student[];
  searchTerm: string;
  sortField: keyof Student | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Student) => void;
  onFieldSave: (
    studentId: string,
    field: EditableStudentField,
    value: string
  ) => void;
  cellStatuses: Record<string, CellStatus | undefined>;
}

const columns: Array<{
  key: keyof Student;
  label: string;
  editable?: boolean;
  inputType?: "text" | "email" | "number";
}> = [
  { key: "rollNumber", label: "Roll Number", editable: true },
  { key: "name", label: "Name", editable: true },
  { key: "bloodGroup", label: "Blood Group", editable: true },
  { key: "class", label: "Class", editable: true },
  { key: "section", label: "Section", editable: true },
  { key: "phone", label: "Phone", editable: true },
  { key: "email", label: "Email", editable: true, inputType: "email" },
  { key: "attendance", label: "Attendance", editable: true, inputType: "number" },
  { key: "lastUpdated", label: "Last Updated" },
];

const SortIndicator = ({
  active,
  direction,
}: {
  active: boolean;
  direction: "asc" | "desc";
}) => {
  if (!active) return null;
  return (
    <span className="inline-flex items-center ml-1 text-indigo-600">
      {direction === "asc" ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </span>
  );
};

interface EditableCellProps {
  studentId: string;
  field: EditableStudentField;
  value: string | number;
  inputType?: "text" | "email" | "number";
  onFieldSave: (
    studentId: string,
    field: EditableStudentField,
    value: string
  ) => void;
  status: CellStatus | undefined;
}

function EditableCell({
  studentId,
  field,
  value,
  inputType = "text",
  onFieldSave,
  status,
}: EditableCellProps) {
  const [localValue, setLocalValue] = useState(value.toString());
  const [dirty, setDirty] = useState(false);
  const displayValue = dirty ? localValue : value.toString();

  // Reset local state when value prop changes externally and input is not dirty
  // This handles real-time updates from socket events
  useEffect(() => {
    if (!dirty) {
      setLocalValue(value.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleBlur = () => {
    if (!dirty || localValue === value.toString()) {
      setDirty(false);
      return;
    }

    onFieldSave(studentId, field, localValue);
    setDirty(false);
  };

  return (
    <div className="flex items-center gap-2 group">
      <input
        type={inputType}
        value={displayValue}
        onChange={(event) => {
          setLocalValue(event.target.value);
          setDirty(true);
        }}
        onBlur={handleBlur}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        className={`w-full bg-transparent border-b-2 transition-all duration-200 focus:outline-none focus:ring-0 px-1 py-0.5 ${
          status === "error"
            ? "border-red-500 focus:border-red-600"
            : status === "saving"
              ? "border-amber-400 focus:border-amber-500"
              : "border-transparent focus:border-indigo-500 hover:border-gray-300"
        }`}
      />
      {field === "attendance" && <span className="text-xs text-gray-400 font-medium">%</span>}
      {status === "saving" && (
        <span className="inline-flex items-center gap-1 text-xs text-amber-600">
          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving…
        </span>
      )}
      {status === "error" && (
        <span className="text-xs text-red-600 font-medium">Retry</span>
      )}
    </div>
  );
}

export function StudentsTable({
  students,
  filteredStudents,
  searchTerm,
  sortField,
  sortDirection,
  onSort,
  onFieldSave,
  cellStatuses,
}: StudentsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const cellKey = (studentId: string, field: keyof Student) =>
    `${studentId}:${field}`;

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/50">
          <thead className="bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-blue-50/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => onSort(column.key)}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-indigo-100/50 transition-colors duration-200 group"
                >
                  <div className="flex items-center">
                    <span>{column.label}</span>
                    <SortIndicator
                      active={sortField === column.key}
                      direction={sortDirection}
                    />
                    {!sortField && (
                      <svg className="w-4 h-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200/30">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">
                      {searchTerm
                        ? "No students found matching your search."
                        : "No students available."}
                    </p>
                    {searchTerm && (
                      <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms</p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => (
                <tr 
                  key={student.id} 
                  className="student-row hover:bg-gradient-to-r hover:from-indigo-50/30 hover:via-purple-50/20 hover:to-blue-50/30 transition-all duration-200 border-l-4 border-transparent hover:border-indigo-400"
                  style={{ animationDelay: `${index * 0.02}s` }}
                >
                  {columns.map((column) => (
                    <td
                      key={`${student.id}-${column.key}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    >
                      {column.editable ? (
                        <EditableCell
                          studentId={student.id}
                          field={column.key as EditableStudentField}
                          value={student[column.key]}
                          inputType={column.inputType}
                          onFieldSave={onFieldSave}
                          status={cellStatuses[cellKey(student.id, column.key)]}
                        />
                      ) : (
                        <span className="text-gray-600 font-medium">
                          {column.key === "lastUpdated"
                            ? formatDate(student.lastUpdated)
                            : student[column.key]}
                        </span>
                      )}
                    </td>
                  ))}
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

