import express from "express";
import {
  addBlog,
  addCommentToBlog,
  deleteBlogById,
  generateContent,
  getAllBlogs,
  getAnswers,
  getBlogById,
  getCommentsByBlogId,
  toggleBlogPublishStatus,
} from "../controllers/blog.controllers.js";
import upload from "../middlewares/multer.js";
import auth from "../middlewares/auth.js";

const blogRouter = express.Router();

blogRouter.post("/add", upload.single("image"), auth, addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/delete", auth, deleteBlogById);
blogRouter.post("/toggle-publish", auth, toggleBlogPublishStatus);
blogRouter.post("/addComment",addCommentToBlog);
blogRouter.get("/getComments/:blogId",getCommentsByBlogId)
blogRouter.post("/generate",auth,generateContent);
blogRouter.post("/chat/ask",getAnswers);
export default blogRouter;
