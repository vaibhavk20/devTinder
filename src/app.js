const express = require('express');
require("dotenv").config();
const connectDB = require('./config/db')
const { userAuth, adminAuth } = require('./middlewares/auth');
const User = require('./models/user');



const app = express();

app.use(express.json());



app.post("/signup", async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save();
        res.send("Signup successfully!")
    } catch (error) {
        res.status(400).send("Error saving the user:" + error.message);
    }
})

app.get("/user", userAuth, async (req, res) => {
    try {
        const email = req.body.emailId;
        const user = await User.findOne({ emailId: email });
        if (user) {

            res.send(user);
        } else {
            res.send("user not found!")
        }
    } catch (error) {
        res.status(400).send("Error in fetch all users:" + error.message);
    }
})

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(400).send("Error in fetch all users:" + error.message);
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

