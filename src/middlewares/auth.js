const adminAuth = (req, res, next) => {
    let token = "abc";
    if (token !== "abc") {
        res.send("you don't have the admin access!");
    } else {
        next();
    }
}

const userAuth = (req, res, next) => {
    let token = "abc";
    if (token !== "abc") {
        res.send("you don't have the admin access!");
    } else {
        next();
    }
}

module.exports = { adminAuth, userAuth }