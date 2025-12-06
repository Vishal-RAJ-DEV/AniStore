import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
        },
        rating :{
            type : Number,
            required : true,
        },
        comments : {
            type : String,
            required : true,
        },
        title :{
            type : String,
            required : true,
        },
        email :{
            type : String,
            required : true,
        },
        user : {
            type : mongoose.Schema.Types.ObjectId,// this will store the user id who wrote the review
            ref : "User", // reference to the User model
            required : true,
        }
    },
    { timestamps: true }
)

const productSchema = new mongoose.Schema({
    name  :{
        type : String,
        required : true,
        trim : true,
    },
    image : {
        type : String,
        required : true,
    },
    brand : {
        type : String,
        required : true,
    },
    quantity : {
        type : Number,
        required : true,
        min : 0

    },
    category : {
        type : ObjectId,
        ref : "Category",
        required : true,
    },
    description : {
        type : String,  
        required : true,

    },
    reviews : [reviewSchema],
    rating :{
        type : Number,
        required : true,
        default : 0,
    },
    numReview : {
        type : Number,
        required : true,
        default : 0,
    },
    price : {
        type : Number,
        required : true,
        default : 0,
    },
    countInStock : {
        type : Number,
        required : true,
        default : 0,
    }
} , { timestamps: true })

const Product = mongoose.model("Product", productSchema);

export default Product;