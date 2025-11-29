import express from "express";
const router = express.Router();
import {
    createCategory,
    updateCategory,
    removeCategory,
    listAllCategories,
    readCategory
} from "../controllers/categoryController.js";
import { authenticate, authenticateAdmin } from "../middlewares/authMiddleware.js";

router.route("/").post(authenticate, authenticateAdmin, createCategory) //only admin can create category after authentication
router.route("/:CategoryId").put(authenticate, authenticateAdmin, updateCategory) //only admin can update category after authentication

router.route("/:CategoryId").delete(authenticate, authenticateAdmin, removeCategory) //only admin can delete category after authentication
router.route("/categories").get(listAllCategories); //anyone can see the categories without authentication
router.route("/:CategoryId").get(readCategory); //anyone can see a single category without authentication
export default router;