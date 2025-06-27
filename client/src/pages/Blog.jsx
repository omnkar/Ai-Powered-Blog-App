import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, blog_data, comments_data } from "../assets/assets";
import Navbar from "../components/Navbar";
import Moment from "moment";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import ChatBox from "../components/ChatBox";
import { FaRobot, FaTimes } from "react-icons/fa";

const Blog = () => {
  const { id } = useParams();
  const { axios } = useAppContext();
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [showChat, setShowChat] = useState(false);

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      if (data.success) {
        setData(data.blog);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch blog data. Please try again later.");
    }
  };

  const fetchComments = async () => {
    try {
      console.log("Fetching comments for blog ID:", id);
      const { data } = await axios.get(`/api/blog/getComments/${id}`);
      console.log("Comments data:", data.comments);
      if (data.success) {
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "Failed to fetch comments. Please try again later."
      );
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/blog/addComment", {
        blog: id,
        name,
        content,
      });
      if (data.success) {
        toast.success("Comment added successfully!");
        setName("");
        setContent("");
        fetchComments(); // Refresh comments after adding a new one
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "Failed to add comment. Please try again later."
      );
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, []);

  return data ? (
    <div className="relative">
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute -top-50 -z-1 opacity-50"
      />
      <Navbar />
      <div className="text-center mt-20 text-gray-600">
        <p className="text-primary py-4 font-medium">
          Published on {Moment(data.createdAt).format("MMMM Do YYYY")}
        </p>
        <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
          {data.title}
        </h1>
        <h2 className="my-5 max-w-lg truncate mx-auto">{data.subTtile}</h2>
        <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
          Onkar Muthe
        </p>
      </div>
      
      <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
        <img src={data.image} alt="" className="rounded-3xl mb-5" />
        <div
          dangerouslySetInnerHTML={{ __html: data.description }}
          className="rich-text max-w-xl mx-auto"
        ></div>
        
        {/* Comments Section */}
        <div className="mt-14 mb-10 max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Comments ({comments.length})</p>
          <div className="flex flex-col gap-5">
            {comments.map((item, index) => (
              <div
                key={index}
                className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img src={assets.user_icon} alt="" className="w-6" />
                  <p className="font-medium">{item.name}</p>
                </div>
                <p className="text-sm max-w-md ml-8">{item.content}</p>
                <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs">
                  {Moment(item.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Comment Section */}
        <div className="max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Add your Comment</p>
          <form
            onSubmit={addComment}
            className="flex flex-col items-start gap-4 max-w-lg"
          >
            <input
              type="text"
              placeholder="Name"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full p-3 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Comment"
              className="w-full p-3 border border-gray-300 rounded outline-none h-32 resize-none focus:ring-2 focus:ring-primary"
              onChange={(e) => setContent(e.target.value)}
              value={content}
              required
            ></textarea>
            <button
              type="submit"
              className="bg-primary text-white rounded p-3 px-8 hover:scale-105 transition-all cursor-pointer font-medium"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Social Media Actions */}
        <div className="my-24 max-w-3xl mx-auto">
          <p className="font-semibold my-4">
            Share this article on social media
          </p>
          <div className="flex gap-2">
            <img src={assets.facebook_icon} alt="Facebook" width={50} className="cursor-pointer hover:scale-110 transition-transform" />
            <img src={assets.twitter_icon} alt="Twitter" width={50} className="cursor-pointer hover:scale-110 transition-transform" />
            <img src={assets.googleplus_icon} alt="Google Plus" width={50} className="cursor-pointer hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {/* AI Chat Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        {!showChat ? (
          <button
            onClick={() => setShowChat(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-all duration-200 group"
            title="Ask AI about this blog"
          >
            <FaRobot size={24} />
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Ask AI Assistant
            </div>
          </button>
        ) : (
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FaRobot size={20} />
                <h4 className="font-semibold">AI Assistant</h4>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="hover:bg-blue-700 p-1 rounded transition-colors duration-200"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Chat Container */}
            <div className="w-80 h-96">
              <ChatBox  id={id} />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  ) : (
    <Loader />
  );
};

export default Blog;