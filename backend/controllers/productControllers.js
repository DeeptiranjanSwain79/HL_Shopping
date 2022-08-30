const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures');
const cloudinary = require("cloudinary");

//Creating a product -- admin
exports.createProduct = catchAsyncError(async (req, res, next) => {

    let images = [];

    if (typeof (req.body.images) === "string") {   //If only one image then we just push it to array
        images.push(req.body.images);
    } else { //Else it itself the total array
        images = req.body.images;
    }

    const imageLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products"
        });

        imageLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imageLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
});

//Get all products 
exports.getAllProducts = catchAsyncError(async (req, res) => {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);       //Calling both search(), pagination() & filter() in one statement
    // const product = await Product.find();
    const product = await apiFeature.query;

    res.status(200).json({
        success: true,
        product,
        productsCount,
        resultPerPage
    });
})

//Get product details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    // req.body.user = req.user.id;
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        success: true,
        product,
    })
})

//Updating a product -- Admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    //Images start here
    let images = [];

    if (typeof (req.body.images) === "string") {   //If only one image then we just push it to array
        images.push(req.body.images);
    } else { //Else it itself the total array
        images = req.body.images;
    }

    if (images !== undefined) {
        // Deleting from Cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imageLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products"
            });

            imageLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.images = imageLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
})

//Delete product 
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // Deleting from Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    //If product found then remove it
    await product.remove();

    //Send 200(ok) after the job is done
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
});

//Create new Revieew or update the review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId);

    //If the user who is now logged in is reviewed before or not
    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                (rev.rating = rating),
                    (rev.comment = comment);
            }
        })
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    //(4+5+5+2 = 16/4 = 4)

    let total = 0;
    product.ratings = product.reviews.forEach((rev) => {
        total += rev.rating;  //This forEach loop will calculate the total ratings of all users (4+5+5+2 = 16)
    });

    product.ratings = total / (product.reviews.length);  //Here the average will be calculated by deviding the total ratings to the number of reviews that product has

    await product.save({ validateBeforeSave: false, });

    res.status(200).json({
        success: true,
    })
});



//Get all reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})


//Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    // console.log(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    //Here all the reviews which we'll not delete i.e. All other reviews other than the review to be deleted
    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());

    //TO update the ratings
    let total = 0;
    reviews.forEach((rev) => {
        total += rev.rating;
    });
    // console.log(reviews);

    let ratings = 0;
    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = total / (reviews.length);
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews, ratings, numOfReviews,
    }, {
        new: true, runValidators: true, useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    })
})



//Get all products  (Admin)
exports.getAdminProducts = catchAsyncError(async (req, res) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products,
    });
})
