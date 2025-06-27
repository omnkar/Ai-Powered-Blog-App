import jwt from "jsonwebtoken";
import Blog from "../models/Blog.models.js";
import Comment from "../models/comment.models.js";

export const adminLogin=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD){
            return res.status(401).json({ success:false,message: "Invalid email or password" });
        }
        // Assuming you have a User model and an admin role

        const token=jwt.sign({email},process.env.JWT_SECRET);
        res.json({success:true, message: "Login successful", token });

    }catch(err){
        console.error("Error in adminLogin:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const adminLogout = (req, res) => {
    try {
        // Invalidate the token by not sending it back to the client
        res.json({ success: true, message: "Logout successful" });
    } catch (err) {
        console.error("Error in adminLogout:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllBlogsAdmin= async (req, res) => {
    try{
        const blogs=await Blog.find({}).sort({createdAt:-1});
        res.status(200).json({ success: true, message: "Blogs fetched successfully", blogs });
    }catch(err){
        console.error("Error in getAllBlogsAdmin:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
export const getAllComments=async(req,res)=>{
    try{
        const comments = await Comment.find({}).populate('blog').sort({ createdAt: -1 });
        res.status(200).json({ success: true, message: "Comments fetched successfully", comments });
    }
    catch(err){
      
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getDashboardData = async (req, res) => {
    try{
        const recentBlogs=await Blog.find({}).sort({ createdAt: -1 }).limit(5);
        const blogs=await Blog.countDocuments({});
        const comments=await Comment.countDocuments({});
        const drafts=await Blog.countDocuments({ isPublished: false });
        const dashboardData={blogs,comments,drafts,recentBlogs};
        res.status(200).json({ 
            success: true, 
            message: "Dashboard data fetched successfully", 
            dashboardData
        });
    }catch(err){
        
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteCommentById = async (req, res) => {
    try {
        const { commentId } = req.body;
        const comment = await Comment.findById(commentId);
        if (!comment) {     
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    }
    catch (error) {
        // console.error("Error in deleteCommentById:", error.message);
        res.status(500).json({
            success: false,
            message: "Error deleting comment",
            error: error.message,
        });
    }
}

export const approveCommentById = async (req, res) => {
    try {
        const { commentId } = req.body;
        const comment = await Comment.findById(commentId);
        if (!comment) {    
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }
        comment.isApproved = true;
        await comment.save();
        res.status(200).json({
            success: true,
            message: "Comment approved successfully",
        });
    }
    catch (error) {
        // console.error("Error in approveCommentById:", error.message);
        res.status(500).json({
            success: false,
            message: "Error approving comment",
            error: error.message,
        });
    }
}