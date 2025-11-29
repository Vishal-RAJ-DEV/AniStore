import express from "express";
import ExpressFormidable from "express-formidable";
const router = express.Router();
import {
    addProduct,
    updateProductDetails,
    removeProduct,
    fetchProducts,
    fetchAllProducts,
    fetchProductById,
    addproductReview,
    fetchTopProducts,
    fetchNewProducts,
    filterProducts

} from "../controllers/productController.js";
import { authenticate, authenticateAdmin } from "../middlewares/authMiddleware.js";
import { checkId } from "../middlewares/checkId.js";

router.route("/").get(fetchProducts)
    .post(authenticate,
        authenticateAdmin,
        ExpressFormidable(),
        addProduct
    );

router.route('/allproducts').get(fetchAllProducts);      
router.route('/:id/review').post(
    authenticate,
    checkId,              //so that we can validate the product id
    addproductReview
)

router.route("/top-products").get(fetchTopProducts);
router.route("/new-products").get(fetchNewProducts);
router.route("/filter-products").post(filterProducts); 
        
router.route("/:id")
    .put(
        authenticate,
        authenticateAdmin,
        ExpressFormidable(),
        updateProductDetails
    )
    .delete(
        authenticate,
        authenticateAdmin,
        removeProduct
    )
    .get(fetchProductById);

export default router;