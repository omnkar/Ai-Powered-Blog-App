import User from "../models/User.models.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';

export const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });

    } catch (error) {
        console.error("Error in signupUser:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const googleAuth = async (req, res) => {
    try {
        const { id_token } = req.body;
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture: profilePicture } = payload;

        let user = await User.findOne({ email });

        if (user) {
            // If user exists, update their googleId if it's missing
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // If user does not exist, create a new one
            user = await User.create({
                name,
                email,
                googleId,
                profilePicture,
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.status(200).json({
            success: true,
            message: "Google authentication successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
            },
        });

    } catch (error) {
        console.error("Error in googleAuth:", error.message);
        res.status(500).json({ success: false, message: "Google authentication failed" });
    }
};