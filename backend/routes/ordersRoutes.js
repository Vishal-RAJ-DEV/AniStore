import express from "express";
const router = express.Router();

import {
    createOrder , 
    getallorders ,
    getuserOrder ,
    TotalOrders ,
    TotalSales ,
    calcualteTotalSalesByDate ,
    getOrderById ,
    makeorderASDelivered ,
    makeorderASPaid ,
    cancelOrder
} from "../controllers/orderControlller.js";
import { authenticate , authenticateAdmin } from "../middlewares/authMiddleware.js";

//controllers

router.route("/").post(authenticate, createOrder);
router.route("/").get(authenticate , authenticateAdmin ,  getallorders);

router.route("/mine").get(authenticate , getuserOrder);
router.route("/totalorders").get( TotalOrders);
router.route("/totalsales").get( TotalSales);
router.route("/totalsalesbydate").get( calcualteTotalSalesByDate);
router.route("/:id").get(authenticate , getOrderById);
router.route("/:id/pay").put(authenticate , makeorderASPaid);
router.route("/:id/deliver").put(authenticate , authenticateAdmin , makeorderASDelivered);
router.route("/:id/cancel").delete(authenticate , authenticateAdmin , cancelOrder);




export default router;

