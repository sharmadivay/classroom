import axios from "axios";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const CreatingClassRoomModal = ({ handleIsCreatingClassroom }) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thusday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [schedule, setSchedule] = useState({
    days: [],
    startTime: "",
    endTime: "",
  });

  const [newClassroom, setNewClassroom] = useState({
    name: "",
    teacher: "",
    students: [],
  });

  const handleCancel = () => {
    handleIsCreatingClassroom();
  };

  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    setSchedule((prevSchedule) => {
      if (checked) {
        return { ...prevSchedule, days: [...prevSchedule.days, value] };
      } else {
        return {
          ...prevSchedule,
          days: prevSchedule.days.filter((day) => day !== value),
        };
      }
    });
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [name]: value,
    }));
  };

  const handleCreateClassroom = async () => {
    try {
      const response = await axios.post(
        `${window.location.origin}/api/classroom/create`,
        {
          name: newClassroom.name,
          teacher: selectedTeacher,
          students: selectedStudents,
          schedule: schedule,
        }
      );
      setClassrooms([...classrooms, response.data.classroom]);
      handleCancel();
      setNewClassroom({
        name: "",
        teacher: "",
        students: [],
      });
      setSelectedTeacher("");
      setSelectedStudents([]);
    } catch (error) {
      console.log("Error creating classroom:", error);
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

    fetchStudents();
    fetchTeachers();
  });

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Create New Classroom
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateClassroom();
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Classroom Name</label>
              <input
                type="text"
                name="name"
                value={newClassroom.name}
                onChange={(e) =>
                  setNewClassroom({ ...newClassroom, name: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Assign Teacher</label>
              <select
                name="teacher"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
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
                value={selectedStudents}
                onChange={(e) => {
                  const options = e.target.options;
                  const value = [];
                  for (let i = 0; i < options.length; i++) {
                    if (options[i].selected) {
                      value.push(options[i].value);
                    }
                  }
                  setSelectedStudents(value);
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
            <div>
              <label>Select Days:</label>
              {days.map((day) => (
                <div key={day}>
                  <input
                    type="checkbox"
                    value={day}
                    onChange={handleDayChange}
                    checked={schedule.days.includes(day)}
                  />
                  <label>{day}</label>
                </div>
              ))}
            </div>

            <div>
              <label>Start Time:</label>
              <input
                type="time"
                name="startTime"
                value={schedule.startTime}
                onChange={handleTimeChange}
                className="border p-2 rounded"
              />
            </div>

            <div>
              <label>End Time:</label>
              <input
                type="time"
                name="endTime"
                value={schedule.endTime}
                onChange={handleTimeChange}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => handleCancel()}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Create Classroom
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

CreatingClassRoomModal.propTypes = {
  handleIsCreatingClassroom: PropTypes.func.isRequired,
};

export default CreatingClassRoomModal;
