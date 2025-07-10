const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please enter a valid email address.");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Please enter strong password.")
            }
        }
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    about: {
        type: String,
        default: "This is a default about of the user."
    },
    skills: {
        type: [String],
        validate: {
            validator: function (val) {
                return val.length <= 4;
            },
            message: props => `${props.path} exceeds the limit of 4 skills`
        }
    },
    photoUrl: {
        type: String,
        default: "data:image/png;base64,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"
    }
},
    {
        timestamps: true
    }
)

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, 'vaibhav@kale', { expiresIn: '1d' });


    return token;

}

userSchema.methods.validatePassword = async function (userInputPasword) {
    const user = this;
    const passwordHash = user.password
    const isValidPassword = await bcrypt.compare(userInputPasword, passwordHash);

    return isValidPassword;
}

module.exports = mongoose.model("User", userSchema)