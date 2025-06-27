import React from "react";
import Blog from "../../pages/Blog";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const TableData = ({ blog, fetchBlogs, index }) => {
  const { title, createdAt } = blog;
  const BlogDate = new Date(createdAt);

  const { axios } = useAppContext();

  const deleteBlog = async () => {
    const confirm = window.confirm("Are you sure you want to delete this blog?");
    if (!confirm) return;
    try {
      const { data } = await axios.post("/api/blog/delete", { id: blog._id });
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      }
      else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to delete blog. Please try again later.");
    }
  }
  const togglePublish = async () => {
    try {
      const { data } = await axios.post("/api/blog/toggle-publish", { id: blog._id });
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to toggle publish status. Please try again later.");
    }

  }
  return (
    <tr className="border-y border-gray-300">
      <th className="px-2 py-4">{index}</th>
      <td className="px-2 py-4">{title}</td>
      <td className="px-2 py-4 max-sm:hidden">{BlogDate.toDateString()}</td>
      <td className="px-2 py-4 max-sm:hidden">
        <p className={`${blog.isPublished ? 'text-green-600' : 'text-orange-700'}`}>
          {blog.isPublished ? 'Published' : 'Unpublished'}
        </p>
      </td>
      <td className="px-2 py-4 flex textxs gap3">
        <button onClick={ togglePublish} className="border px-2 py-0.5 mt-1 rounded cursor-pointer"> {blog.isPublished ? 'Unpublish' : 'Publish'}</button>
        <img src={assets.cross_icon} alt="" onClick={deleteBlog} className="w-8 hover:scale-110 transition-all cursor-pointer ml-5" />
      </td>
    </tr>
  );
};

export default TableData;
