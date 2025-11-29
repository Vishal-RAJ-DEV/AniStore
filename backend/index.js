//package imports
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";


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

//routes 
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/uploads" , uploadRoutes);

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


