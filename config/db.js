const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/authDB");

        console.log("✅ Database Connected");
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = connectDB;