const express = require('express');
require("dotenv").config();
const connectDB = require('./config/db')
const { userAuth, adminAuth } = require('./middlewares/auth');
const User = require('./models/user');


const app = express();

app.get("/user", userAuth, (req, res) => {
    res.send("this is user route.")
})

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "vaibhav",
        lastName: "Kale",
        emailId: "vaibhav@gmail.com",
        password: "vaibhav123"
    })
    try {
        await user.save();
        res.send("Signup successfully!")
    } catch (error) {
        res.status(400).send("Error saving the user:" + error.message);
    }
})

app.get("/", (req, res) => {
    res.send("welcome to devtinder!!!")
})

// if db connetion sucessful then start server
connectDB().then(() => {
    console.log("Databasee connection established...");
    app.listen(3001, () => {
        console.log("server is successfully listening on port 3001... ")
    })
}).catch((err) => {
    console.error("Database connot be connected!!!")
})

