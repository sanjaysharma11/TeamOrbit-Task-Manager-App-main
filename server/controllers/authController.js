const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    try {
        const {
            name, email, password, profileImageUrl, adminInvitetoken,
        } = req.body;

        //check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User Already exists" });
        }

        //Determine user role:Admin if correct token is provided, otherwise Member 
        let role = "member";
        if (
            adminInvitetoken &&
            adminInvitetoken == process.env.ADMIN_INVITE_TOKEN
        ) {
            role = "admin";
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        });

        //Return user data with JWT 
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });

    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
};

// @desc Login a user
// @route POST /api/auth/login
// access Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "invalid email or password" });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Return user data with jwt 
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        })

    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
};

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private
async function getUserProfile(req, res) {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
}

// @desc Update user profile
// @route PUT /api/auth/profile
// @access Private (Requires JWT)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });

    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
};

// @desc Forgot Password - Send reset link (with DB token)
// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        // Always respond with success to prevent email enumeration
        if (!user) {
            return res.json({ message: "If this email exists, a reset link has been sent." });
        }

        // Generate token and set expiry
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Create reset link
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        // Send email
        await transporter.sendMail({
            from: `"TeamOrbit" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>You requested a password reset.</p>
                   <a href="${resetLink}">Click here to reset your password</a>`,
        });

        res.json({ message: "If this email exists, a reset link has been sent." });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Reset Password (with DB token)
// @route POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Find user with valid token and not expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Session expired" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear reset token fields so link can't be reused
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password has been reset successfully." });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile,
    forgotPassword,
    resetPassword
}