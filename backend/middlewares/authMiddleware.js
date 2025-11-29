import jwt, { decode } from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModal.js";

const authenticate = asyncHandler(async (req , res , next)=>{
    let token;

    token = req.cookies.jwt; //here we are getting the token from cookie as we have stored it in httpOnly cookie
    if(token){
        try {
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            console.log("Decoded from auth middleware" , decoded);
            // here decoded will have the payload gets form the userid contain all user details except password
            req.user = await User.findById(decoded.userId).select("-password"); //here we are selecting all the fields except password field
            next(); //if everything is fine then we are calling the next middleware or controller function
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized , token failed");
        }
    }else{
        res.status(401);
        throw new Error("Not authorized , no token");
    }
})


//admin authentication middleware
const authenticateAdmin = asyncHandler(async (req , res , next)=>{
    console.log("Inside admin auth middleware", req.user);
    if(req.user && req.user.isAdmin){ //the req.user is coming from the authenticate middleware which also contain the isAdmin field(is it true or false)
        next(); // if we have the user and the user is admin then we are calling the next middleware or controller function
    }else{
        res.status(401);
        throw new Error("Not authorized as an admin");
    }
})

export { authenticate , authenticateAdmin };