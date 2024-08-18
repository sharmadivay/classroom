import { useState, useEffect } from "react";
import axios from "axios";
import CreatingClassRoomModal from "../../components/CreatingClassRoomModal";

const PrincipalDashBoard = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [isAddMode, setIsAddMode] = useState(false); // Track if we're adding a new user
  const [isCreatingClassroom, setIsCreatingClassroom] = useState(false);

  const handleIsCreatingClassroom = () => {
    setIsCreatingClassroom(false);
  };

  const [editingClassroom, setEditingClassroom] = useState(null);
  const [editClassroomData, setEditClassroomData] = useState({
    name: "",
    teacher: "",
    students: [],
  });

  const handleEditClassroom = (classroom) => {
    setEditingClassroom(classroom);
    setEditClassroomData({
      name: classroom.name,
      teacher: classroom.teacher._id,
      students: classroom.students.map((student) => student._id),
      schedule: {
        days: classroom.schedule.days,
        startTime: classroom.schedule.startTime,
        endTime: classroom.schedule.endTime,
      },
    });
  };

  const handleRemoveTeacher = async (classroomId, teacherId) => {
    try {
      await axios.patch(
        `${window.location.origin}/api/classroom/removeTeacher/${classroomId}/${teacherId}`
      );
      setClassrooms((prevClassrooms) =>
        prevClassrooms.map((classroom) =>
          classroom._id === classroomId
            ? { ...classroom, teacher: null }
            : classroom
        )
      );
    } catch (error) {
      console.error("Error removing teacher:", error);
    }
  };

  const handleRemoveStudent = async (classroomId, studentId) => {
    try {
      await axios.patch(
        `${window.location.origin}/api/classroom/removeStudent/${classroomId}/${studentId}`,
        { studentId }
      );
      setClassrooms((prevClassrooms) =>
        prevClassrooms.map((classroom) =>
          classroom._id === classroomId
            ? {
                ...classroom,
                students: classroom.students.filter(
                  (student) => student._id !== studentId
                ),
              }
            : classroom
        )
      );
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

  const handleUpdateClassroom = async () => {
    try {
      console.log(editClassroomData);
      await axios.put(
        `${window.location.origin}/api/classroom/update/${editingClassroom._id}`,
        editClassroomData
      );
      setClassrooms((prevClassrooms) =>
        prevClassrooms.map((classroom) =>
          classroom._id === editingClassroom._id
            ? { ...classroom, ...editClassroomData }
            : classroom
        )
      );
      setEditingClassroom(null);
      setEditClassroomData({
        name: "",
        teacher: "",
        students: [],
      });
    } catch (error) {
      console.error("Error updating classroom:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${window.location.origin}/api/user/delete/${userId}`);
      setTeachers(teachers.filter((teacher) => teacher._id !== userId));
      setStudents(students.filter((student) => student._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAddClick = (role) => {
    setEditingUser(null); // Ensure we're not in editing mode
    setFormData({
      name: "",
      email: "",
      password: "",
      role: role, // Set the role based on the button clicked
    });

    setIsAddMode(true);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Password should be handled carefully
      role: user.role || "",
    });
    setIsAddMode(false); // Not in add mode
  };

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
      if (isAddMode) {
        // Create new user
        const response = await axios.post(
          `${window.location.origin}/api/user/register`,
          formData
        );

        const newUser = response.data.user;

        if (newUser.role === "teacher") {
          setTeachers([...teachers, newUser]);
        } else if (newUser.role === "student") {
          setStudents([...students, newUser]);
        }
      } else {
        // Update existing user
        await axios.put(
          `${window.location.origin}/api/user/update/${editingUser._id}`,
          formData
        );
        setTeachers((prevTeachers) =>
          prevTeachers.map((teacher) =>
            teacher._id === editingUser._id
              ? { ...teacher, ...formData }
              : teacher
          )
        );
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === editingUser._id
              ? { ...student, ...formData }
              : student
          )
        );
      }
      setEditingUser(null);
      setIsAddMode(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
      });
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${window.location.origin}/api/user/students`
        );
        setStudents(response.data.students);
      } catch (error) {
        console.log("Error fetching students:", error);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          `${window.location.origin}/api/user/teachers`
        );
        setTeachers(response.data.teachers);
      } catch (error) {
        console.log("Error fetching teachers:", error);
      }
    };

    const fetchClassrooms = async () => {
      try {
        const response = await axios.get(
          `${window.location.origin}/api/classroom/classrooms`
        );

        setClassrooms(response.data.classrooms);
      } catch (error) {
        console.log("Error fetching classrooms:", error);
      }
    };

    fetchStudents();
    fetchTeachers();
    fetchClassrooms();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login"; // Adjust this as needed
  };

  return (
    <div className="p-6 my-5 max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex  items-center">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Principal Dashboard
        </h2>
        <button
          onClick={handleLogout}
          className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Teachers</h3>
        <button
          onClick={() => handleAddClick("teacher")}
          className="mb-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700"
        >
          Add Teacher
        </button>
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
            {teachers.map((teacher) => (
              <tr
                key={teacher._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-4 px-6 text-gray-800">{teacher.name}</td>
                <td className="py-4 px-6 text-gray-800">{teacher.email}</td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => handleEditClick(teacher)}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(teacher._id)}
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

      <div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Students</h3>
        <button
          onClick={() => handleAddClick("student")}
          className="mb-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700"
        >
          Add Student
        </button>
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

      <button
        onClick={() => setIsCreatingClassroom(true)}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700"
      >
        Create Classroom
      </button>

      {/* Classrooms Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">
          Classrooms
        </h3>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="py-3 px-6 text-left text-gray-600 font-medium">
                Name
              </th>
              <th className="py-3 px-6 text-left text-gray-600 font-medium">
                Teacher
              </th>
              <th className="py-3 px-6 text-left text-gray-600 font-medium">
                Students
              </th>
              <th className="py-3 px-6 text-left text-gray-600 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map((classroom) => (
              <tr
                key={classroom._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-4 px-6 text-gray-800">{classroom.name}</td>
                <td className="py-4 px-6 text-gray-800">
                  {classroom.teacher?.name || "N/A"}
                </td>
                <td className="py-4 px-6 text-gray-800">
                  {classroom.students.map((student) => (
                    <div key={student._id} className="flex items-center">
                      {student.name || "Unknown"}
                      <button
                        onClick={() =>
                          handleRemoveStudent(classroom._id, student._id)
                        }
                        className="text-red-600 hover:underline ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => handleEditClassroom(classroom)}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleRemoveTeacher(classroom._id, classroom.teacher._id)
                    }
                    className="text-red-600 hover:underline"
                  >
                    Remove Teacher
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Classroom Modal */}
      {editingClassroom && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">
              Edit Classroom
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateClassroom();
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Classroom Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editClassroomData.name}
                  onChange={(e) =>
                    setEditClassroomData({
                      ...editClassroomData,
                      name: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Assign Teacher
                </label>
                <select
                  name="teacher"
                  value={editClassroomData.teacher}
                  onChange={(e) =>
                    setEditClassroomData({
                      ...editClassroomData,
                      teacher: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="">Select a Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Assign Students
                </label>
                <select
                  multiple
                  name="students"
                  value={editClassroomData.students}
                  onChange={(e) => {
                    const options = e.target.options;
                    const value = [];
                    for (let i = 0; i < options.length; i++) {
                      if (options[i].selected) {
                        value.push(options[i].value);
                      }
                    }
                    setEditClassroomData({
                      ...editClassroomData,
                      students: value,
                    });
                  }}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Schedule Section */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Schedule Days
                </label>
                <select
                  multiple
                  name="days"
                  value={editClassroomData.schedule.days}
                  onChange={(e) => {
                    const options = e.target.options;
                    const value = [];
                    for (let i = 0; i < options.length; i++) {
                      if (options[i].selected) {
                        value.push(options[i].value);
                      }
                    }
                    setEditClassroomData({
                      ...editClassroomData,
                      schedule: {
                        ...editClassroomData.schedule,
                        days: value,
                      },
                    });
                  }}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={editClassroomData.schedule.startTime}
                  onChange={(e) =>
                    setEditClassroomData({
                      ...editClassroomData,
                      schedule: {
                        ...editClassroomData.schedule,
                        startTime: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-2">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={editClassroomData.schedule.endTime}
                  onChange={(e) =>
                    setEditClassroomData({
                      ...editClassroomData,
                      schedule: {
                        ...editClassroomData.schedule,
                        endTime: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setEditingClassroom(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* Create Classroom Modal */}
      {isCreatingClassroom && (
        <CreatingClassRoomModal
          handleIsCreatingClassroom={handleIsCreatingClassroom}
        />
      )}
    </div>
  );
};

export default PrincipalDashBoard;
