import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id } = comment;
  const blogDate = new Date(createdAt);

  const { axios } = useAppContext();

  const approveComment = async () => {
    try {
      const { data } = await axios.post("/api/admin/approve-comment", { commentId: _id });
      if (data.success) {
        toast.success(data.message);
        await fetchComments();
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to approve comment. Please try again later.");
    }
  }
  const deleteComment = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this comment?");
      if (!confirm) return;
      const { data } = await axios.post("/api/admin/delete-comment", { commentId: _id });
      if (data.success) {
        toast.success(data.message);
        await fetchComments();
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete comment. Please try again later.");
    }
  }


  return (
    <tr className="border-y border-gray-300">
      <td className="px-6 py-4">
        <b className="font-medium text-gray-600">Blog</b> :{blog.title}
        <br />
        <br />
        <b className="font-medium text-gray-600">Name</b>:{comment.name}
        <br />
        <br />
        <b className="font-medium text-gray-600">Comment</b>:{comment.content}
      </td>

      <td className="px-6 py-4 max-sm:hidden">
        {blogDate.toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {!comment.isApproved ? (
            <img
            onClick={approveComment}
              src={assets.tick_icon}
              className="2-5 hover:scale-110 transition-all curosr-pointer"
            />
          ) : (
            <p className="text-xs border border-green-600 bg-green-100 txt-green-600 rounded-full px-3 py-1">
              Approved
            </p>
          )}
          <img
          onClick={deleteComment}
            className="w-5 hover:scale-110 transition-all cursor-pointer"
            src={assets.bin_icon}
            alt=""
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
