import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Assuming User model is used for teachers
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // Assuming User model is used for students
      },
    ],
    schedule: {
      days: [String],
      startTime: String,
      endTime: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Classroom", classroomSchema);
