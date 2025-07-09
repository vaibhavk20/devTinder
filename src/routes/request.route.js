const express = require('express');
const requestRouter = express.Router();
const { userAuth, adminAuth } = require('../middlewares/auth');
const User = require('../models/user');
const { validateSignUpData, validateLoginData } = require('../utils/validaton');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

requestRouter.get("/user", userAuth, async (req, res) => {
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

module.exports = requestRouter;