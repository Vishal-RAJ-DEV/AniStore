import Product from "../models/product.modal.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const addProduct = asyncHandler(async (req, res) => {
    try {
        const { name, description, price, category, quantity, brand } = req.fields;
        switch (true) {
            case !name:
                return res.json({ message: "Product name is required" });
            case !description:
                return res.json({ message: "Product description is required" });
            case !price:
                return res.json({ message: "Product price is required" });
            case !category:
                return res.json({ message: "Product category is required" });
            case !quantity:
                return res.json({ message: "Product quantity is required" });
            case !brand:
                return res.json({ message: "Product brand is required" });
        }
        const product = await new Product({ ...req.fields }).save();
        res.status(201).json(product);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Internal server error" });
    }
})

const updateProductDetails = asyncHandler(async (req, res) => {
    try {
        const { name, description, price, category, quantity, brand } = req.fields;
        switch (true) {
            case !name:
                return res.json({ message: "Product name is required" });
            case !description:
                return res.json({ message: "Product description is required" });
            case !price:
                return res.json({ message: "Product price is required" });
            case !category:
                return res.json({ message: "Product category is required" });
            case !quantity:
                return res.json({ message: "Product quantity is required" });
            case !brand:
                return res.json({ message: "Product brand is required" });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.fields },
            { new: true } //this will return the updated product
        )
        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

const removeProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product removed successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

const fetchProducts = asyncHandler(async (req, res) => {
    try {
        const pageSize = 6 //number of products per page
        const page = Number(req.query.page) || 1; //current page number
        const keyword = req.query.keyword ? { //here we are searching the product by keyword like iphone, samsung etc
            name: {
                $regex: req.query.keyword,
                $options: "i"
            }, //case insensitive
        } : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword }).
            limit(pageSize).
            skip(pageSize * (page - 1)); //skip the products of previous pages
        res.status(200).json({
            products,
            page,
            pages: Math.ceil(count / pageSize), //total number of pages
            totalProducts: count,
            hashMore: page < Math.ceil(count / pageSize) //if there are more pages
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

const fetchProductById = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("category", "name"); // Populate category name

        if (!product) {
            res.status(404);
            throw new Error("Product not found");
        }

        // Sort reviews by newest first
        if (product.reviews && product.reviews.length > 0) {
            product.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        res.status(200).json(product);

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({})
            .populate("category")
            .limit(12)
            .sort({ createdAt: -1 }); // -1 means the newest first 
        //this is to get all products with category details, limit to 12 products and sort by newest first

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

const addproductReview = asyncHandler(async (req, res) => {
    try {
        const { rating, comment, title, name, email } = req.body;
        if (!rating || !comment || !title || !name || !email) {
            return res.status(400).json({ message: "Rating, comment, title, name, and email are required" });
        }
        //validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        console.log(rating);
        // Validate rating
        const numberRating = Number(rating);
        if (!Number.isFinite(numberRating) || numberRating < 1 || numberRating > 5) {  //here checking if the number is finite and between 1 to 5
            return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
        }
        //find the product by id
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const alreadyReviewed = product.reviews.some( //here we are checking if the user has already reviewed the product or not by matching user id with review user id
            (r) => r.user.toString() === req.user._id.toString()
        )
        if (alreadyReviewed) {
            return res.status(400).json({ message: "Product already reviewed" });
        }

        const review = {
            name: name.trim(),
            rating: numberRating,
            comments: comment.trim(),
            title: title.trim(),
            email: email.trim(),
            user: req.user ? req.user._id : null,
        }
        //now push the review to product reviews array
        product.reviews.push(review);
        product.numReview = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length; //here we are calculating the average rating
        await product.save();

        res.status(201).json({
            message: "Review added successfully",
            review: {
                name: review.name,
                rating: review.rating,
                comment: review.comment,
                title: review.title,
                email: review.email,
                createdAt: new Date()
            },
            numReviews: product.numReview,
            rating: product.rating
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }

})

const fetchTopProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({})
            .sort({ rating: -1 })  // -1 means highest rating first and in the descending order
            .limit(5);
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

const fetchNewProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({})
            .sort({ createdAt: -1 })  // -1 means newest first and in the descending order
            .limit(5);
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

const filterProducts = asyncHandler(async (req, res) => {
    try {
        const { checked, radio } = req.body;

        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = {
            $gte: radio[0], //greater than equal to radio[0]
            $lte: radio[1],  //less than equal to radio[1]
            //greater than equal to radio[0] and less than equal to radio[1]
        }
        
        //so what will happen is if user select category and price range then both will be added to args object
        //then the product will be filtered based on both category and price range
        //and we search the products based on args object in the database of the product model
        const products = await Product.find(args);
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

export { addProduct, updateProductDetails, removeProduct, fetchProducts, fetchProductById, fetchAllProducts, addproductReview, fetchTopProducts, fetchNewProducts, filterProducts };