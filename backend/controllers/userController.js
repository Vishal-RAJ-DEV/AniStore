import User from "../models/userModal.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
    //get the data from request body
    const { username, email, password } = req.body;
    //throw the error if any field is missing
    if (!username || !email || !password) {
        throw new Error("Please fill all the fields");
    }
    //check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) throw new Error("User already exists");

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    //save the user to database
    try {
        await newUser.save();
        createToken(res, newUser._id);
        res.status(201).send({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("Please fill all the fields");
        }
        //check if user exists
        const existstingUser = await User.findOne({ email });
        if (!existstingUser) throw new Error("User does not exists, please sign up");

        //check is the password is correct
        const ispasswordCorrect = await bcrypt.compare(password, existstingUser.password);
        if (!ispasswordCorrect) throw new Error("Invalid email or password");

        if (ispasswordCorrect) {
            createToken(res, existstingUser._id); //here we are creating the token and storing it in cookie as for security purpose we are storing it in httpOnly cookie
            res.status(200).json({
                _id: existstingUser._id,
                username: existstingUser.username,
                email: existstingUser.email,
                isAdmin: existstingUser.isAdmin
            });
            return;
        }
    } catch (error) {
        res.status(500).json({ message: error.message }); //this the catch the throw new Error from above and send it to the frontend
    }
})

const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)

    })
    res.status(200).json({ message: "Logged out successfully" });
})

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password"); // Exclude password field
    res.status(200).json(users);
})

const getcurrentUserProfile = asyncHandler(async (req, res) => {
    //get the user from database by id which we have set in auth middleware
    const user = await User.findById(req.user._id).select("-password"); // Exclude password field
    if (user) {
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
})

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();
        res.status(200).json(
            {
                message: "Profile updated successfully",
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
            }
        )
    } else {
        res.status(404);
        throw new Error("User not found");
    }
})

const deleteuserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error("Admin user cannot be deleted");
        }
        await User.deleteOne({ _id: user._id });
        res.status(200).json({ message: "User deleted successfully" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
})

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
})

const updatedUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin;

        //update the user detail in the database and return the updated user detail excepts password field
        const updatedUser = await user.save();
        res.status(200).json({
            message: "User updated successfully",
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
})

export {
    createUser,
    loginUser,
    logoutCurrentUser,
    getAllUsers,
    getcurrentUserProfile,
    updateUserProfile,
    deleteuserById,
    getUserById,
    updatedUserById
};