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

module.exports = { validateSignUpData, validateLoginData }