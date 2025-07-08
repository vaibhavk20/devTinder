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
        required: true
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