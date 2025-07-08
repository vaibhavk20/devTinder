const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = (req, res, next) => {
    let token = "abc";
    if (token !== "abc") {
        res.send("you don't have the admin access!");
    } else {
        next();
    }
}

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send("Token not found.");
        }

        const decodedObj = jwt.verify(token, "vaibhav@kale"); // no need to await
        const { _id } = decodedObj;

        const user = await User.findById(_id);

        if (!user) {
            return res.status(401).send("User not found.");
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).send("Token error: " + error.message);
    }
};

module.exports = { adminAuth, userAuth }