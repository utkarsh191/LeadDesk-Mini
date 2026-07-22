const User = require("../models/User");
const BlacklistToken = require("../models/BlacklistToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User Already Exists"
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

 

const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Check User
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        // Compare Password
const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
    return res.status(401).json({
        message: "Invalid Password"
    });
}

// Generate JWT Token
const token = jwt.sign(
    {
        id: user._id,
        email: user.email,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);

return res.status(200).json({
    message: "Login Successful",
    token: token
});

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};


const profile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select("-password");

        return res.status(200).json(user);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
};

const logout = async (req, res) => {
    try {

        const authHeader = req.headers.authorization;

        const token = authHeader.split(" ")[1];

        await BlacklistToken.create({
            token
        });

        return res.status(200).json({
            message: "Logout Successful"
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
};

const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

// Generate Random Token
const resetToken = crypto.randomBytes(32).toString("hex");

// Save Token
user.resetPasswordToken = resetToken;

// Token Expiry (10 minutes)
user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

// Save User
await user.save();

console.log(resetToken);

return res.status(200).json({
    success: true,
    message: "Reset Token Generated",
    resetToken
});

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
};

const resetPassword = async (req, res) => {

    try {

        const { token, password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or Expired Token"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully"
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }

};


module.exports = {
    signup,
    login,
    profile,
    logout,
    forgotPassword,
    resetPassword
};