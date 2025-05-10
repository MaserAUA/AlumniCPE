import React, { FC } from 'react';
import { FaUserEdit, FaTrash, FaUserShield, FaUser, FaUserCog } from 'react-icons/fa';
import { UpdateUserFormData } from '../../../models/user';

interface TableRow {
  generation: string,
  studentID: string,
  first_name: string,
  last_name: string,
  department: string,
  faculty: string,
  field: string,
  student_type: string,
  email: string,
  phone: string,
  company: string,
  position: string,
  [key: string]: string;
}

const tableHeaders = [
  "User Name",
  "CPE",
  "Student ID",
  "First Name",
  "Last Name",
  "Department",
  "Faculty",
  "Field",
  "Student Type",
  "Email",
];

const fieldMap: Record<string, keyof TableRow> = {
  "User Name": "username",
  "CPE": "generation",
  "Student ID": "student_id",
  "First Name": "first_name",
  "Last Name": "last_name",
  "Department": "department",
  "Faculty": "faculty",
  "Field": "field",
  "Student Type": "student_type",
  "Email": "email",
};


interface UserTableProps {
  request: UpdateUserFormData[];
}

const RequestTable: FC<UserTableProps> = ({ request }) => {

  // {displayValue(row, fieldMap[header])}
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {tableHeaders.map((header) => (
            <th
              key={header}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {request.length > 0 ? (
          request.map((row, index) => (
            <tr key={index} className="hover:bg-blue-50">
              {tableHeaders.map((header) =>  (
                <td
                  key={header}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                >
                  {row["user"][fieldMap[header]]}
                </td>
              ))}
            </tr>
            )
          )
        ) : (
          <tr>
            <td
              colSpan={tableHeaders.length}
              className="text-center text-gray-500 py-4"
            >
              No data found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default RequestTable;
