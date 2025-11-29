import express from "express";
const router = express.Router();
import {
    createUser,
    loginUser,
    logoutCurrentUser,
    getAllUsers,
    getcurrentUserProfile,
    updateUserProfile,
    deleteuserById,
    getUserById,
    updatedUserById
} from "../controllers/userController.js";
import { authenticate, authenticateAdmin } from "../middlewares/authMiddleware.js";


//importing controllers
router.route("/")
    .post(createUser)
    .get(authenticate, authenticateAdmin, getAllUsers);//first check the user is authenticated then check if the user is admin or not if both are true then only get all users

router.route("/auth").post(loginUser);
router.route("/logout").post(logoutCurrentUser);
router.route("/profile").get(authenticate, getcurrentUserProfile).put(
    authenticate, updateUserProfile); //if the user is authenticated then only we can access the profile

//ADMIN ROUTES
//only admin can delete any user by id after authentication and admin can also get any user by id
router.route("/:id")
    .delete(authenticate, authenticateAdmin, deleteuserById)
    .get(authenticate, authenticateAdmin, getUserById)
    .put(authenticate, authenticateAdmin, updatedUserById);

export default router;

