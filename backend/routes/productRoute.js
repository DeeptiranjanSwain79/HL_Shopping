const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview, getAdminProducts } = require('../controllers/productControllers');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

//To get all products 
router.route('/product').get(getAllProducts);

router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

//Creating a new producet -- Admin 
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

//Updating an existing product, Deleting an existing product -- Admin and viewing a product details 
router.route("/admin/product/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
    
router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router.route("/reviews")
.get(getProductReviews)
.delete(isAuthenticatedUser, deleteReview);

module.exports = router;