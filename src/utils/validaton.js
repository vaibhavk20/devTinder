const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName || !emailId || !password) {
        throw new Error("please enter the requried fields.");
    }
}

const validateLoginData = (req) => {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
        throw new Error("please enter the requried fields.");
    }
}
const validateEditProfileData = (req) => {

    const allowedEditFileds = ["firstName", "lastName", "age", "skills", "gender", "photoUrl", "about"];

    const isEditAllowed = Object.keys(req.body).every(k => allowedEditFileds.includes(k));
    if (!isEditAllowed) {
        throw new Error("Invalid edit fields.")
    }
}

const validateNewPassword = (req) => {
    console.log(req)
    // const { newPassword } = req.body;

    // if (!newPassword) {
    //     throw new Error("Empty password not allowed.")
    // }
    // const allowedEditFileds = ["newPassword"];

    // const isEditAllowed = Object.keys(req.body).every(k => allowedEditFileds.includes(k));
    // if (!isEditAllowed) {
    //     throw new Error("Invalid edit fields.")
    // }
    // if (!isStrongPassword(req.body.newPassword)) {
    //     throw new Error("Please enter the strong password.")
    // }
}

module.exports = { validateSignUpData, validateLoginData, validateEditProfileData, validateNewPassword }