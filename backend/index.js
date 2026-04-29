//package imports
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import cors from "cors";



//utils
import connectDB from "./config/db.js";

dotenv.config();
const port = process.env.PORT || 5000;

//database connection
connectDB();

//initializing express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Enable CORS for all routes (you can configure this further for specific origins)
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
}));

//routes 
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/uploads" , uploadRoutes);
app.use("/api/orders", ordersRoutes);

//this will send the paypal client id to the frontend so that it can be used to make payments
app.use( "/api/config/paypal" , ( req , res) => {
    res.send({ clientId : process.env.PAYPAL_CLIENT_ID});
})

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
//making the uploads folder static so that we can access the images directly

// app.use((err, req, res, next) => {   // custom error handling middleware
//     console.error(err.message); // you see "User already exists"

//     res.status(err.statusCode || 400).json({
//         success: false,
//         message: err.message || "Internal Server Error"
//     });
// });



app.get('/', (req, res) => {
    res.send("API is running...");
});

//http://localhost:5000
app.listen((port), () => {
    console.log(`Server running on port http://localhost:${port}`);
});


