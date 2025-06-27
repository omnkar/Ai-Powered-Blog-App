import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { axios, setToken } = useAppContext();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/signup", {
        name,
        email,
        password,
      });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        toast.success("Signup successful!");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Signup failed. Please try again.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post("/api/user/google", {
        id_token: credentialResponse.credential,
      });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        toast.success("Google signup successful!");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch  {
      toast.error("Google signup failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed.");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full py-6 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">User</span> Signup
            </h1>
            <p className="font-light">
              Create your account to start blogging
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-6 w-full sm:max-w-md text-gray-600"
          >
            <div className="flex flex-col">
              <label htmlFor="name">Name</label>
              <input
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                type="text"
                id="name"
                required
                placeholder="Your Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                type="email"
                id="email"
                required
                placeholder="Your Email id"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <input
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                type="password"
                id="password"
                required
                placeholder="Your Password "
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all"
            >
              Sign Up
            </button>
          </form>
          <div className="my-4 text-gray-500">OR</div>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
          />
          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/admin")}
              className="text-primary cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;