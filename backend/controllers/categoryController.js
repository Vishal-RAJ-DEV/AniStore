import Category from "../models/categoryModal.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.json({ message: "Category name is required" });
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.json({ message: "Category already exists" });
        }

        const category = await new Category({ name }).save();
        res.status(201).json(category);


    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error" });
    }
});


const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { CategoryId } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.json({ message: "Category name is required" });
        }
        const category = await Category.findByIdAndUpdate(CategoryId, { name }, { new: true }); //this will find the id and update the name and return the new updated category
        if (!category) {
            return res.json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error" });
    }
})

const removeCategory = asyncHandler(async (req, res) => {
    try {
        const { CategoryId } = req.params;
        const removedCategory = await Category.findByIdAndDelete(CategoryId);

        if (!removedCategory) {
            return res.json({ message: "Category not found" });
        }
        res.status(200).json(
            removedCategory,
            { message: "Category deleted successfully" }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const listAllCategories = asyncHandler(async (req, res) => {
    try {
        const allCategories = await Category.find({}); 
        res.status(200).json(allCategories);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const readCategory = asyncHandler(async (req, res) => {
    try {
        const { CategoryId } = req.params;
        const category = await Category.findById(CategoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export { createCategory, updateCategory, removeCategory, listAllCategories, readCategory };