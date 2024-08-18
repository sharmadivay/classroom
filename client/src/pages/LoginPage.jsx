import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5002/api/user/login`, {
        email,
        password,
      });
      if (res.data.success) {
        toast.success(res.data.message);

        localStorage.setItem("user", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went Wrong");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-[100vh] h-full flex-col bg-gradient-to-t from-[#ffdee9] to-[#b5fffc]">
        <form onSubmit={handleSubmit} className="shadow-lg p-5 bg-white">
          <h4 className="text-center mb-4 font-bold font-playfair text-lg">
            LOGIN FORM
          </h4>

          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-0 border-b border-black rounded-none w-full focus:ring-0 focus:border-black"
              id="exampleInputEmail1"
              placeholder="Enter Your Email"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-0 border-b border-black rounded-none w-full focus:ring-0 focus:border-black"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              required
            />
          </div>

          <button
            type="submit"
            className="border border-black rounded-none bg-black text-white w-64 hover:bg-gradient-to-r from-[#434343] to-[#000000]"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
