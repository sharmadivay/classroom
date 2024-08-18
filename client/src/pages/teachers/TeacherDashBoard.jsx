import axios from "axios";
import { useEffect, useState } from "react";

const TeacherDashBoard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user.user.email;

  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [classroom, setClassrooms] = useState([]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${window.location.origin}/api/user/update/${editingUser._id}`,
        formData
      );

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === editingUser._id
            ? { ...student, ...formData }
            : student
        )
      );
      setEditingUser(null);
      setIsAddMode(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Password should be handled carefully
    });
    setIsAddMode(false); // Not in add mode
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${window.location.origin}/api/user/delete/${userId}`);

      setStudents(students.filter((student) => student._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get(
          `${window.location.origin}/api/classroom/classrooms`
        );

        const filteredClassrooms = response.data.classrooms.filter(
          (classRoom) => classRoom.teacher.email === userEmail
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
  }, [userEmail, classroom]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login"; // Adjust this as needed
  };
  return (
    <>
      <div className="p-6 my-5 max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="flex  items-center">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Teacher Dashboard
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
                <th className="py-3 px-6 text-left text-gray-600 font-medium">
                  Actions
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
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleEditClick(student)}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit/Add Modal */}
        {(editingUser || isAddMode) && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-2xl font-semibold mb-4 text-gray-700">
                {isAddMode
                  ? `Add New ${
                      formData.role === "teacher" ? "Teacher" : "Student"
                    }`
                  : `Edit ${editingUser.role}`}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUser(null);
                      setIsAddMode(false);
                    }}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    {isAddMode ? "Add User" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TeacherDashBoard;
