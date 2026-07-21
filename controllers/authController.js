const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

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
            password: hashedPassword
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
        email: user.email
    },
    "mysecretkey",
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


const profile = (req, res) => {

    return res.status(200).json({
        message: "Welcome to Profile",
        user: req.user
    });

};

module.exports = {
    signup,
    login,
    profile
};