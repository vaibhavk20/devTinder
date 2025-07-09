const express = require('express');
// require("dotenv").config();
const connectDB = require('./config/db')
const { userAuth, adminAuth } = require('./middlewares/auth');
const { validateSignUpData, validateLoginData } = require('./utils/validaton');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.route');
const profileRouter = require('./routes/profile.route');
const requestRouter = require('./routes/request.route');

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter)


// if db connetion sucessful then start server
connectDB().then(() => {
    console.log("Databasee connection established...");
    app.listen(3001, () => {
        console.log("server is successfully listening on port 3001... ")
    })
}).catch((err) => {
    console.error("Database connot be connected!!!")
})

