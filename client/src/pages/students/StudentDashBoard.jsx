import axios from "axios";
import { useEffect, useState } from "react";

const StudentDashBoard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user.user.email;
  const [students, setStudents] = useState([]);
  const [classroom, setClassrooms] = useState([]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get(
          `${window.location.origin}/api/classroom/classrooms`
        );

        const filteredClassrooms = response.data.classrooms.filter(
          (classRoom) =>
            classRoom.students.some(
              (student) => student.email === userEmail // Assuming userEmail is the student's email
            )
        );

        setClassrooms(filteredClassrooms);
        // setStudents(filteredClassrooms.students);
        // console.log(filteredClassrooms.students)
        setStudents(classroom[0].students);
      } catch (error) {
        console.log("Error fetching classrooms:", error);
      }
    };

    fetchClassrooms();
  }, [classroom, userEmail]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login"; // Adjust this as needed
  };
  return (
    <>
      <div className="p-6 my-5 max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="flex  items-center">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Student Dashboard
          </h2>
          <button
            onClick={handleLogout}
            className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Students
          </h3>

          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="py-3 px-6 text-left text-gray-600 font-medium">
                  Name
                </th>
                <th className="py-3 px-6 text-left text-gray-600 font-medium">
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-4 px-6 text-gray-800">{student.name}</td>
                  <td className="py-4 px-6 text-gray-800">{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StudentDashBoard;
