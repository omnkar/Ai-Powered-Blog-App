import React, { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import { useAppContext } from "../../context/AppContext";
import { parse } from "marked";
import toast from "react-hot-toast";

const AddBlog = () => {
  const { axios } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [isPublished, setIsPublished] = useState(true);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true);
      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished,
      };
      const formData = new FormData();

      formData.append("blog", JSON.stringify(blog));
      formData.append("image", image);
      const { data } = await axios.post("/api/blog/add", formData);
      if (data.success) {
        setIsAdding(false);
        setImage(false);
        setTitle("");
        setSubTitle("");
        quillRef.current.root.innerHTML = "";
        setCategory("Startup");
        setIsPublished(false);
        toast.success("Blog added successfully");
      } else {
        setIsAdding(false);
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "Failed to add blog. Please try again later."
      );
    } finally {
      setIsAdding(false);
    }
  };

  const generateContent = async () => {
    if (!title) return toast.error("Please enter a title for the blog");
    try {
      setLoading(true);
      const { data } = await axios.post("/api/blog/generate", {
        prompt: title,
      });
      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "Failed to generate content. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //initiate quill only once

    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p>Upload Thumbnail</p>
        <label htmlFor="image">
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt=""
            className="mt-2 h-16 rounded cursor-pointer"
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </label>

        <p className="mt-4">Blog title</p>
        <input
          type="text"
          name=""
          id=""
          placeholder="Type here"
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded-2xl"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <p className="mt-4">Sub title</p>
        <input
          type="text"
          name=""
          id=""
          placeholder="Type here"
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded-2xl"
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
        />

        <p className="mt-4">Blog Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
          {loading && (
            <div className="absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2">
              <div className="w-8 h-8 rounded-full border-2 border-t-white animate-spin"></div>
            </div>
          )}
          <button
            disabled={loading}
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer"
            type="button"
            onClick={generateContent}
          >
            Generate with AI
          </button>
        </div>

        <p className="mt-4">Blog Category</p>
        <select
          name="category"
          id=""
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        >
          <option value="">Select category</option>
          {blogCategories.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        <div className="flex gap-2 mt-4">
          <p>Publish Now</p>
          <input
            type="checkbox"
            name=""
            id=""
            checked={isPublished}
            className="scale-125 cursor-pointer"
            onChange={(e) => setImage(e.target.value)}
            value={isPublished}
          />
        </div>

        <button
          disabled={isAdding}
          type="submit"
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm"
        >
          {isAdding ? "Addind..." : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
