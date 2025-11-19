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
  return <span>{direction === "asc" ? "↑" : "↓"}</span>;
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
    <div className="flex items-center gap-2">
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
        className={`w-full bg-transparent border-b focus:outline-none ${
          status === "error"
            ? "border-red-500"
            : status === "saving"
              ? "border-amber-500"
              : "border-transparent focus:border-indigo-500"
        }`}
      />
      {field === "attendance" && <span className="text-xs text-gray-500">%</span>}
      {status === "saving" && (
        <span className="text-xs text-gray-400">Saving…</span>
      )}
      {status === "error" && (
        <span className="text-xs text-red-500">Retry</span>
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => onSort(column.key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  {column.label}{" "}
                  <SortIndicator
                    active={sortField === column.key}
                    direction={sortDirection}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  {searchTerm
                    ? "No students found matching your search."
                    : "No students available."}
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={`${student.id}-${column.key}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
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
                        <span className="text-gray-500">
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

