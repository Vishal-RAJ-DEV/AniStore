import { isValidObjectId } from "mongoose";

export const checkId = (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    next();
}
//this middleware checks if the provided ID in the request parameters is a valid MongoDB ObjectId. If not, it responds with a 400 status and an error message. If valid, it calls next() to proceed to the next middleware or route handler.