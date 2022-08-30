const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');
const cloudinary = require('cloudinary');


//Register a user
exports.registerUser = catchAsyncError(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });

    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    });

    const token = user.getJWTToken();

    sendToken(user, 201, res);          //201 => Created
});



//Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {

    //Taking email and password from the body
    const { email, password } = req.body;

    //Checking whether the user has given E-mail and password both or not
    if (!email || !password) {
        return next(new ErrorHandler("Please enter E-mail & Password", 400));
    }

    // If both E-mail and password received then find the user in the database
    const user = await User.findOne({ email }).select("+password");     //("+password") is written because while fetching the user we select all the values except the password but here for login we need password to login


    //If no user found
    if (!user) {
        new next(new ErrorHandler("Invalid Email or password", 401)); //401=> Unauthorised user
    }

    const isPasswordMatched = user.comparePassword(password);

    //If user found but password not matched
    if (!isPasswordMatched) {
        new next(new ErrorHandler("Invalid Email or password", 401));
    }

    //If password matched
    const token = user.getJWTToken();

    sendToken(user, 200, res);          //200=> OK
});




//Logout user
exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
});



//Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    //Get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    //To send the link to the user to reset the password
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;   //protocol for http or https 
    //host for the hostname currently localhost

    const message = `Your password reset link is : \n\n\n ${resetPasswordUrl}  \n\n If you've not requested this url then ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: `HLShopping password recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            subject: `Email for reseting the password has sent to ${user.email} successfullly `,
            message,
        })
    } catch (error) {

        //If any error occures then set undefined in userSchema for these properties and then save them and raise an error
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500))
    }
});



//Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Reset password link/toekn is invalid or has been expired", 404));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password doesn't match", 404));
    }

    //Assigning the password coming from the body
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);

});



//Get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    })
});


//Update user password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    //If your original password is wrong
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect", 401));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password doesn't match", 401));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});


//Update user profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    if (req.body.avatar !== "") {
        const user = User.findById(req.user.id);

        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: true,
    });

    res.status(200).json({
        success: true,
    })
});


//Get all users (admin access only)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });
});


//Get single users (admin access only)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User doesn't exist with ID ${req.body.params}`));
    }

    res.status(200).json({
        success: true,
        user
    });
});


//Update user role -- Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    //We'll add cloudinary later
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: true,
    });

    res.status(200).json({
        success: true,
    })
});


//Delete User -- Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    
    if (!user) {
        return next(new ErrorHandler(`User doesn't exist with id ${req.params.id}`));
    }
    
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
    
    await user.remove();

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
});
