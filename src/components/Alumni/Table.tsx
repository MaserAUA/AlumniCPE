import React, { useState, useEffect, useCallback, useMemo } from "react";
import Card from "./Card";
import { Search, Filter, Database, ChevronDown, Eye, X } from "lucide-react";
import { useGetAllUser } from "../../hooks/useUser"

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

interface UserProfile {
  studentID: string;
  privacySettings?: Record<string, boolean>;
}

// const sidebarItems = ["All", "Regular", "INTER", "HDS", "RC"] as const;

const sidebarItems = [
  "All",
  "ปริญญาเอก นานาชาติ",
  "ปริญญาเอก ป.ตรีต่อป.เอก",
  "ปริญญาโท 2 ปี นานาชาติ",
  "ปริญญาตรี 4 ปี",
  "ปริญญาตรี 4 ปี (โครงการจากพื้นที่การศึกษาราชบุรี)",
  "ปริญญาตรี 4 ปี (หลักสูตรนานาชาติ)"
] as const;

export const courseLabelMap: Record<(typeof sidebarItems)[number], string> = {
  "All": "All",
  "ปริญญาเอก นานาชาติ": "Inter",
  "ปริญญาเอก ป.ตรีต่อป.เอก": "Regular",
  "ปริญญาโท 2 ปี นานาชาติ": "Inter",
  "ปริญญาตรี 4 ปี": "Regular",
  "ปริญญาตรี 4 ปี (โครงการจากพื้นที่การศึกษาราชบุรี)": "Regular",
  "ปริญญาตรี 4 ปี (หลักสูตรนานาชาติ)": "Inter",
};

type CourseLabel = "All" | "Inter" | "Regular";

const conciseSidebarItems: CourseLabel[] = ["All", "Inter", "Regular"];

const tableHeaders = [
  "CPE",
  "Student ID",
  "First Name",
  "Last Name",
  "Department",
  "Faculty",
  "Field",
  "Student Type",
  "Email",
  "Phone Number",
  "Working Company",
  "Job Position",
];

const fieldMap: Record<string, keyof TableRow> = {
  "CPE": "generation",
  "Student ID": "student_id",
  "First Name": "first_name",
  "Last Name": "last_name",
  "Department": "department",
  "Faculty": "faculty",
  "Field": "field",
  "Student Type": "student_type",
  "Email": "email",
  "Phone Number": "phone",
  "Working Company": "company",
  "Job Position": "position",
};

const Table: React.FC = () => {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [selectedCPE, setSelectedCPE] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState<CourseLabel>("All");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<TableRow | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: userData, isLoading: isLoadingData } = useGetAllUser();


  useEffect(() => {
    setIsLoading(true);
    if (!isLoadingData) {
      setTableData(userData);
    }
    setIsLoading(false);
  }, [userData]);

  const handleCPEChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCPE(event.target.value);
      setCurrentPage(1)
    },
    [],
  );

  const handleCourseChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCourse(event.target.value as CourseLabel);
      setCurrentPage(1)
    },
    [],
  );

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value.toLowerCase());
    },
    [],
  );

  const displayValue = useCallback(
    (row: TableRow, fieldName: keyof TableRow): string => {
      if (!row[fieldName]) return "";

      if (userProfile && row.studentID === userProfile.studentID) {
        if (userProfile.privacySettings?.[fieldName]) return "";
      }
      return row[fieldName];
    },
    [userProfile],
  );

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      const conciseLabel = courseLabelMap[row.student_type as keyof typeof courseLabelMap];
      const matchCPE = selectedCPE === "All" || row.generation === selectedCPE;
      const matchCourse = selectedCourse === "All" || conciseLabel === selectedCourse;
      const matchSearch = Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchQuery)
      );
      return matchCPE && matchCourse && matchSearch;
    });
  }, [tableData, selectedCPE, selectedCourse, searchQuery]);


  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const courseCounts = useMemo(() => {
    return conciseSidebarItems.map((label) => {
      const count = tableData.filter((row) => {
        const conciseLabel = courseLabelMap[row.student_type as keyof typeof courseLabelMap];
        return row.generation === selectedCPE && (label === "All" || conciseLabel === label);
      }).length;

      return { course: label, count };
    });
  }, [tableData, selectedCPE]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 p-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white" />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 bg-white bg-opacity-95 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <div className="flex items-center gap-2">
                <Database size={20} />
                <h2 className="text-xl font-bold">Course Summary</h2>
              </div>
              <p className="text-blue-100 text-sm mt-1">
                {selectedCPE} • {filteredData.length} students
              </p>
            </div>
            <div className="p-4">
              { courseCounts.map(({ course, count }) => (
                <div
                  key={course}
                  onClick={() => setSelectedCourse(course)}
                  className={`flex justify-between items-center p-3 rounded-xl mb-2 cursor-pointer transition-all duration-200 ${
                    selectedCourse === course
                      ? "bg-blue-100 text-blue-800 font-semibold shadow-md"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      course === "All"
                        ? "bg-blue-500"
                        : course === "Regular"
                          ? "bg-green-500"
                          : course === "Inter"
                            ? "bg-yellow-500"
                            : course === "HDS"
                              ? "bg-red-500"
                              : "bg-purple-500"
                    }`}
                  />
                  {course}
                  </span>
                    {
                  <span className="bg-white px-2 py-1 rounded-lg text-sm">{count}</span>
                    }
                </div>
              ))}
            </div>
          </aside>

          {/* Table */}
          <section className="w-full lg:w-3/4 bg-white shadow-lg p-4 rounded-lg">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                {selectedCPE} ({selectedCourse})
              </h2>
              <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                <select
                  value={selectedCPE}
                  onChange={handleCPEChange}
                  className="select select-bordered bg-blue-100 p-2 rounded-lg font-semibold text-blue-700"
                >
                  <option key={0} value={"All"}>
                    All
                  </option>
                  {Array.from({ length: 38 }, (_, i) => (
                    <option key={i+1} value={`CPE${i + 2}`}>
                      CPE{i + 1}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  className="select select-bordered bg-gray-100 p-2 rounded-lg font-semibold text-gray-700"
                >
                  {conciseSidebarItems.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <input
              type="text"
              placeholder="Search by any field"
              className="input input-bordered w-full mb-4 p-2 rounded-lg"
              onChange={handleSearch}
            />

            <div className="overflow-x-auto">
              <table className="table min-w-full border-collapse border border-gray-300">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    {tableHeaders.map((header) => (
                      <th
                        key={header}
                        className="px-4 py-2 text-left text-sm font-medium"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, index) => (
                      <tr key={index} className="hover:bg-blue-50">
                        {tableHeaders.map((header) => (
                          <td
                            onClick={() => {
                              setSelectedPerson(row);
                              setShowPopup(true);
                            }}
                            key={header}
                            className="px-4 py-2 border border-gray-300 text-sm text-gray-700 cursor-pointer"
                          >
                            {displayValue(row, fieldMap[header])}
                          </td>
                        ))}
                      </tr>
                    ))
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
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {showPopup && selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl relative w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-all shadow-md"
            >
              &times;
            </button>
            <Card data={selectedPerson} onClose={() => setShowPopup(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
