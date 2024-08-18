import express from "express";
import {
  deleteUser,
  getAllstudentsController,
  getAllteachersController,
  loginController,
  registerController,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/students", getAllstudentsController);
router.get("/teachers", getAllteachersController);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
