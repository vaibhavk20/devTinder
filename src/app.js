const express = require('express');
require("dotenv").config();
const connectDB = require('./config/db')
const { userAuth, adminAuth } = require('./middlewares/auth');
const User = require('./models/user');
const { validateSignUpData, validateLoginData } = require('./utils/validaton');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(cookieParser());


app.post("/signup", async (req, res) => {

    //  validation

    // encrypt the password
    try {
        const { firstName, lastName, emailId, password, skills } = req.body;
        validateSignUpData(req);


        // ecrypte the password

        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash)

        const user = new User({
            firstName, lastName, emailId, password: passwordHash, skills
        })
        await user.save();
        // Run this once at app start or in script        
        await User.syncIndexes();
        res.send("Signup successfully!")
    } catch (error) {
        res.status(400).send("Error saving the user:" + error.message);
    }
})

app.post("/login", async (req, res) => {
    try {
        validateLoginData(req);
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        console.log(user)
        if (!user) {
            throw new Error("Invalid credential.");
        }

        const isPasswordValid = await user.validatePassword(password);
        console.log("pass is : ", isPasswordValid)
        if (isPasswordValid) {
            const token = await user.getJWT()

            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000)
            });
            res.send("Login successfull.");
        } else {
            throw new Error("Invalid Credential.");
        }
    } catch (error) {
        res.status(400).send("ERROR :" + error.message);
    }
})

app.get("/profile", userAuth, async (req, res) => {
    const { user } = req;
    res.send({ "user": user });
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

app.delete("/user", userAuth, async (req, res) => {
    try {
        const email = req.body.emailId;
        const user = await User.findOneAndDelete({ emailId: email });
        if (user) {
            // await User.deleteOne({ emailId: email });
            res.send({ message: "deleted successfully!", user });
        } else {
            res.send("user not found!")
        }
    } catch (error) {
        res.status(400).send("Error in fetch all users:" + error.message);
    }
})

app.patch("/user/:userId", userAuth, async (req, res) => {
    try {
        const userId = req.params?.userId;
        const email = req.body.emailId;
        const data = req.body;

        const allowed_updates = ["age", "skills", "gender"];

        const isUpdatedAllowed = Object.keys(data).every(k => allowed_updates.includes(k));
        if (!isUpdatedAllowed) {
            throw new Error("Invalid update fields.")
        }
        // option new updated data return
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { new: true, runValidators: true });
        if (user) {
            // await User.deleteOne({ emailId: email });
            res.send({ message: "updated successfully!", user });
        } else {
            res.send("user not exist!")
        }
    } catch (error) {
        res.status(400).send("Error in fetch all users:" + error.message);
    }
})

app.get("/users", userAuth, async (req, res) => {
    try {
        // exclude 'password'
        const users = await User.find({}).select("-password");
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

