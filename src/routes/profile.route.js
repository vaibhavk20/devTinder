const express = require('express');
const profileRouter = express.Router();
const { userAuth, adminAuth } = require('../middlewares/auth');
const User = require('../models/user');
const { validateSignUpData, validateLoginData, validateEditProfileData, validateNewPassword } = require('../utils/validaton');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');


profileRouter.get("/profile", userAuth, async (req, res) => {
    // user get from the userAuth middleware
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        validateEditProfileData(req);

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((field) => {
            loggedInUser[field] = req.body[field];
        })

        await loggedInUser.save();

        res.send({ message: "updated successfully!", user: loggedInUser });

    } catch (error) {
        res.status(400).send("Error in fetch all users:" + error.message);
    }
})


profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    console.log(newPassword)
    const loggedInUser = req.user;
    console.log(loggedInUser)
    const isOldPasswordCorrect = await loggedInUser.validatePassword(oldPassword)

    if (!isOldPasswordCorrect) {
        throw new Error("please enter correct password")
    }
    validateNewPassword(req);

    const newPasswordHashed = await bcrypt.hash(newPassword, 10);


    loggedInUser.password = newPasswordHashed;

    await loggedInUser.save();

    res.send({
        message: "Password updated successfully.",
        user: loggedInUser
    })

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