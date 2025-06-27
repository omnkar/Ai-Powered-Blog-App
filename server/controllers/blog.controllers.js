import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.models.js";
import Comment from "../models/comment.models.js";
import main from "../configs/gemini.js";
import { escape } from "querystring";

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );

    const imageFile = req.file;
    console.log(
      "Received blog data:",
      title,
      subTitle,
      description,
      category,
      isPublished
    );
    // check if all required fields are present
    if (!title || !description || !category) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // upload image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer, // required
      fileName: imageFile.originalname, // required,
      folder: "SmartScribe/blogs", // optional
    });
    // optimization through imageKit URL transformation
    const optimisedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        {
          quality: "auto", // Adjust quality as needed
        },
        { format: "webp" },
        { width: "1280" },
      ],
    });

    const image = optimisedImageUrl;

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
    });
    res.status(201).json({
      success: true,
      message: "Blog added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding blog",
      error: error.message,
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    // console.log("Received blogId:", blogId);
    // console.log("Fetching blog with ID:", blogId);
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching individual blog",
      error: error.message,
    });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    await Blog.findByIdAndDelete(id);

    // Delete associated comments
    await Comment.deleteMany({ blog: id });
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};

export const toggleBlogPublishStatus = async (req, res) => {
  try {
    // console.log(req.body)
    const { id } = req.body;
    // console.log("Received blogId:", id);
    // console.log("Toggling publish status for blog with ID:", blogId);
    const blog = await Blog.findById(id);
    // console.log("Blog found:", blog);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    blog.isPublished = !blog.isPublished;
    // console.log("Blog found:", blog);
    await blog.save();
    res.status(200).json({
      success: true,
      message: `Blog ${
        blog.isPublished ? "published" : "unpublished"
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling blog publish status",
      error: error.message,
    });
  }
};

export const addCommentToBlog = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    if (!blog || !name || !content) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newComment = await Comment.create({ blog, name, content });

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding comment",
      error: error.message,
    });
  }
};

export const getCommentsByBlogId = async (req, res) => {
  // console.log("Fetching comments for blog");
  try {
    // console.log(req.params);
    const { blogId } = req.params;
    // console.log("Received blogId:", blogId);
    // console.log("Fetching comments for blog with ID:", blogId);
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });
    // console.log("Comments found:", comments);
    if (!comments) {
      return res
        .status(404)
        .json({ success: false, message: "No comments found for this blog" });
    }

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching comments",
      error: error.message,
    });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(
      prompt + "generate a blog content for this topic in simple text format"
    );
    res.json({
      success: true,
      message: "Content generated successfully",
      content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating content",
      error: error.message,
    });
  }
};

export const getAnswers = async (req, res) => {
  try {
    // console.log(req.body);
    const {blogId,userQuestion}=req.body;
    const blog=await Blog.findById(blogId);
    const blogContent=blog.description.replace(/<[^>]*>/g,'');
    // console.log(blog);
    const content = await main(
      "refer the " +
        blogContent +
        " answer to " +
        userQuestion +
        " this user question"
    );
    res.json({
      success: true,
      message: "Content generated successfully",
      content
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error in generating response",
        error: error.message,
      });
  }
};
