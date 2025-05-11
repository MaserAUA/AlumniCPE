import React, { FC } from 'react';
import { Request, UserDataFlat } from '../../../models/user';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useApproveRequest, useRejectRequest } from '../../../hooks/useAdmin';
import Swal from "sweetalert2";

interface TableRow {
  generation: string;
  studentID: string;
  first_name: string;
  last_name: string;
  department: string;
  faculty: string;
  field: string;
  student_type: string;
  email: string;
  phone: string;
  company: string;
  position: string;
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

interface Requests {
  user: UserDataFlat;
  request: Request;
}

interface UserTableProps {
  request: Requests[];
}

const status = [
  { id: 'approve', name: 'Approve', color: 'bg-green-100 text-green-800 border-green-200' },
  { id: 'pending', name: 'Pending', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'reject', name: 'Reject', color: 'bg-red-100 text-red-800 border-red-200' },
];

const RequestTable: FC<UserTableProps> = ({ request }) => {
  const approveRequest = useApproveRequest()
  const rejectRequest = useRejectRequest()
  const handleApprove = (request_id: string) => {
    approveRequest.mutate(request_id, {
      onSuccess(data, variables, context) {
        Swal.fire({
          icon: "success",
          title: "Approve Role",
          text: "Approving role for alumnus",
          timer: 1000,
          showConfirmButton: false,
        });
      },
      onError(error, variables, context) {
        Swal.fire({
          icon: "error",
          title: "Error approve role",
          text: error.message || "",
          showConfirmButton: false,
        });
      },
    })
  };

  const handleReject = (request_id: string) => {
    rejectRequest.mutate(request_id, {
      onSuccess(data, variables, context) {
        Swal.fire({
          icon: "success",
          title: "Reject Role",
          text: "Reject role for alumnus",
          timer: 1000,
          showConfirmButton: false,
        });
      },
      onError(error, variables, context) {
        Swal.fire({
          icon: "error",
          title: "Error Reject role",
          text: error.message || "",
          showConfirmButton: false,
        });
      },
    })
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (statusId: string) => {
    const status_ = status.find(r => r.id === statusId);
    return status_ ? status_.color : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get role name for display
  const getStatusName = (statusId: string) => {
    const status_ = status.find(r => r.id === statusId);
    return status_ ? status_.name : statusId;
  };

  return (
  <div className="overflow-x-auto w-full">
    <table className="min-w-full divide-y divide-gray-200 table-auto">
      <thead>
        <tr>
          <th className="sticky bg-white left-0 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
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
                <td className="sticky bg-white left-0 z-10 px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-2">
                  { row["request"]["status"] == "pending" &&
                  <>
                    <button
                      onClick={() => handleApprove(row["request"]["request_id"])}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <FaCheck className="inline mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(row["request"]["request_id"])}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <FaTimes className="inline mr-1" />
                      Reject
                    </button>
                  </>
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusBadge(row["request"]["status"] || "pending")}`}>
                    {getStatusName(row["request"]["status"] || "pending")}
                  </span>
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {formatDate(row.request.updated_timestamp ?
                    row.request.updated_timestamp.toString() :
                    row.request.created_timestamp.toString() )
                  }
                </td>
                {tableHeaders.map((header) => (
                  <td
                    key={header}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {row["user"][fieldMap[header]]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={tableHeaders.length + 1}
                className="text-center text-gray-500 py-4"
              >
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;
