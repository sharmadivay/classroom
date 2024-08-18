import express from "express";
import {
  createController,
  deleteClassroomController,
  getAllClassroomController,
  removeStudentController,
  removeTeacherController,
  updateClassroomController,
} from "../controllers/classrommController.js";

const router = express.Router();

// Create a new classroom
router.post("/create", createController);
router.get("/classrooms", getAllClassroomController);
router.put("/update/:id", updateClassroomController);
router.delete("/delete/:id", deleteClassroomController);
router.patch("/removeTeacher/:id/:teacherId", removeTeacherController);
router.patch("/removeStudent/:id/:studentId", removeStudentController);

export default router;
