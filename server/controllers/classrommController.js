import classroomModal from "../modals/classroomModal.js"; // Correct path to the model

// create
export const createController = async (req, res) => {
  const { name, teacher, students, schedule } = req.body;

  try {
    const newClassroom = await classroomModal({
      name,
      teacher,
      students,
      schedule,
    }).save();
    res.status(201).json({ classroom: newClassroom });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// all
export const getAllClassroomController = async (req, res) => {
  try {
    const classrooms = await classroomModal
      .find()
      .populate("teacher")
      .populate("students");
    res.status(200).json({ classrooms });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update
export const updateClassroomController = async (req, res) => {
  const { id } = req.params;
  const { name, teacher, students, schedule } = req.body;

  try {
    const classroom = await classroomModal.findById(id);

    const updatedClassroom = await classroomModal.findByIdAndUpdate(
      id,
      {
        name: name || classroom.name,
        teacher: teacher || classroom.teacher,
        students: students || classroom.students,
        schedule: schedule || classroom.schedule,
      },
      { new: true }
    );

    res.json({ classroom: updatedClassroom });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// delete
export const deleteClassroomController = async (req, res) => {
  try {
    const { id } = req.params;
    await classroomModal.findByIdAndDelete(id);
    res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting classroom", error });
  }
};

// remove teacher
export const removeTeacherController = async (req, res) => {
  try {
    const { id, teacherId } = req.params;
    const updatedClassroom = await classroomModal
      .findByIdAndUpdate(id, { $unset: { teacher: "" } }, { new: true })
      .populate("teacher")
      .populate("students");

    res.status(200).json({ classroom: updatedClassroom });
  } catch (error) {
    res.status(500).json({ message: "Error removing teacher", error });
  }
};

// Remove student from classroom
export const removeStudentController = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const updatedClassroom = await classroomModal
      .findByIdAndUpdate(id, { $pull: { students: studentId } }, { new: true })
      .populate("teacher")
      .populate("students");

    res.status(200).json({ classroom: updatedClassroom });
  } catch (error) {
    res.status(500).json({ message: "Error removing student", error });
  }
};
