const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your Name"],
        maxlength: [50, "Name cannot exceed 50 characters"],
        minlength: [3, "Name should have more than 3 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your E-mail ID"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid E-mail ID"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [8, "Password should be minimum 8 characters"],
        select: false   //If anyone fetches the data it should not display the password of the user (even if the ADMIN)
    },
    avatar: {        //User can give only one profile image
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },

    resetPasswordToken: String,         //Here we're not specifying any object
    resetPasswordExpire: Date,
});

//To encrypt the password
userSchema.pre("save", async function (next) {
    //We can't use "this" keyword with in arrow function
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcryptjs.hash(this.password, 10)
});

//JWT token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

//Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);      //compare() method compares entered password with the encrypted password 
}

//Generating password to reset token
userSchema.methods.getResetPasswordToken = function () {
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + (15*60*1000);       //Token will expire after 15 min

    return resetToken;
}

module.exports = mongoose.model('user', userSchema);