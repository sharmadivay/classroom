import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      console.log("No user found in localStorage");
      navigate("/login");
    } else {
      const userRole = user.user.role;

      if (userRole === "student") {
        navigate("/dashboard/student");
      } else if (userRole === "principal") {
        navigate("/dashboard/principal");
      } else if (userRole === "teacher") {
        navigate("/dashboard/teacher");
      } else {
        console.error("Invalid user role");
      }
    }
  }, [navigate]);

  return null;
};

export default HomePage;
