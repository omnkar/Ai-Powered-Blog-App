import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const AppContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [blogs, setBlog] = useState([]);
  const [input, setInput] = useState("");

  const fetchBlogs = async () => {
    try{
      const {data}=await axios.get("/api/blog/all");
      // console.log(data);
      data.success?setBlog(data.blogs):toast.error(data.message);
    }
    catch (error) {
      toast.error(error.message)

    }
  }
  useEffect(()=>{
    fetchBlogs();
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
      // navigate("/admin");
    // } else {
    //   setToken(null);
    //   // navigate("/admin/login");
    // }
  },[]);

  const value = {
    axios,
    navigate,
    token,
    setToken,
    blogs,
    setBlog,
    input,
    setInput,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
