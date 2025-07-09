const express = require('express');
const profileRouter = express.Router();
const { userAuth, adminAuth } = require('../middlewares/auth');
const User = require('../models/user');
const { validateSignUpData, validateLoginData } = require('../utils/validaton');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');


profileRouter.get("/profile", userAuth, async (req, res) => {
    const { user } = req;
    res.send({ "user": user });
})

profileRouter.get("/user", userAuth, async (req, res) => {
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

profileRouter.delete("/user", userAuth, async (req, res) => {
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

profileRouter.patch("/user/:userId", userAuth, async (req, res) => {
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

profileRouter.get("/users", userAuth, async (req, res) => {
    try {
        // exclude 'password'
        const users = await User.find({}).select("-password");
        res.send(users);
    } catch (error) {
        res.status(400).send("Error in fetch all users:" + error.message);
    }
})

module.exports = profileRouter;