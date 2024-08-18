import { comparePassword, hashPassword } from "../helpers/userHelper.js";
import userModal from "../modals/userModal.js";

// register
export const registerController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    //Validtion
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }

    const existingUser = await userModal.findOne({ email });
    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);
    const user = await userModal({
      name,
      email,
      password: hashedPassword,
      role,
    }).save();

    res.status(200).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

//login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    const user = await userModal.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

// get all students
export const getAllstudentsController = async (req, res) => {
  try {
    // Fetch all users with role 0 (students)
    const students = await userModal.find({ role: "student" });

    // If no students found, send a message
    if (students.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No students found",
      });
    }

    // Return the list of students
    res.status(200).send({
      success: true,
      message: "List of students",
      students,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching students",
      error,
    });
  }
};

// get all teachers
export const getAllteachersController = async (req, res) => {
  try {
    // Fetch all users with role 0 (students)
    const teachers = await userModal.find({ role: "teacher" });

    // If no teachers found, send a message
    if (teachers.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No teacher found",
      });
    }

    // Return the list of teachers
    res.status(200).send({
      success: true,
      message: "List of teachers",
      teachers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching students",
      error,
    });
  }
};

// update profile
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const user = await userModal.findById(id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModal.findByIdAndUpdate(
      id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        email: email || user.email,
        role: role || user.role,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Update profile",
      error,
    });
  }
};

// delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModal.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Deleting User",
      error,
    });
  }
};
