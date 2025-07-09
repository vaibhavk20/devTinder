const express = require('express');
const authRouter = express.Router();
const { userAuth, adminAuth } = require('../middlewares/auth');
const User = require('../models/user');
const { validateSignUpData, validateLoginData } = require('../utils/validaton');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

module.exports = authRouter;