import Order from "../models/ordermodal.js";
import Product from "../models/product.modal.js";


const calcPrice = (orderItems) =>{
    const itemPrice = orderItems.reduce ((acc, item ) => acc + ( item.price * item.qty) ,0);
    const shippingPrice = itemPrice > 100 ? 0 : 10;
    
    const taxRate = 0.15;
    const taxPrice = Number((itemPrice * taxRate).toFixed(2));
    
    const totalPrice  = (
        itemPrice + shippingPrice + parseFloat( taxPrice)
    ).toFixed(2);
    return {
        itemPrice : itemPrice.toFixed(2),
        shippingPrice : shippingPrice.toFixed(2),
        taxPrice,
        totalPrice
    }
}

const createOrder = async (req, res) => {
    try {
        const { orderItems , shippingAddress , paymentMethod } = req.body;

        if( orderItems && orderItems.length === 0 ){
            res.status(400);
            throw new Error("No order items");
        }


        //here we are finding the product form the database which is sends by form the client so that we can get the actual price from the database
        //this is for security purpose so that user cannot manipulate the price from the client side
        const itemsFromDB = await Product.find({
            _id : {
                $in : orderItems.map((item) => item._id)
            }
        });

        //now we will rebuild the order items with the actual price from the databas
        const DBorderItems = orderItems.map((itemsFromClient)=>{
            const finalMatchingItems = itemsFromDB.find((itemFromDB) => itemFromDB._id.toString() === itemsFromClient._id.toString());

            if( !finalMatchingItems ){
                res.status(404);
                throw new Error(`Product not found: ${itemsFromClient._id}`);
            }

            return {
                ...itemsFromClient, //this will contain qty and any other client-side display fields
                name : finalMatchingItems.name,
                product : finalMatchingItems._id,
                price : finalMatchingItems.price,
                _id : undefined //we don't need _id in the order items
            };
        });

        const itemsPrice = DBorderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const { shippingPrice, taxPrice, totalPrice } = calcPrice(DBorderItems);

        const order = new Order({
            user : req.user._id,
            orderItems : DBorderItems,
            shippingAddress,
            paymentMethod,
            itemPrice : itemsPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice

        })

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status( 500).json({
            message : error.message
        })
    }
}

const getallorders= async ( req , res) => {
    try {
        const orders = await Order.find({}).populate("user" , "id username email");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

const getuserOrder = async ( req , res) => {
    try {
        const order = await Order.find({
            user : req.user._id 
        })
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

const TotalOrders = async ( req , res) =>{
    try {
        const totalOrders = await Order.countDocuments();
        res.status(200).json({ totalOrders });
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

const TotalSales = async ( req , res) =>{
    try{
        const order   = await Order.find();
        const totalSales = order.reduce((acc , order) => acc + order.totalPrice , 0);
        res.status(200).json({ totalSales });
    } catch (error) {
        res.status(500).json({
            message : error.message
        })

    }
}

const calcualteTotalSalesByDate = async ( req , res) => {
    try{
        const sales = await Order.aggregate([
            {
                $match :{
                    isPaid : true
                }
            },
            {
                $group : {
                    //this is for grouping the orders by date and calculating the total sales for each date
                    //here we convert the paidAt date to string format and group by that string format so that we can get the total sales for each date
                    _id : {
                        $dateToString : {
                            format : "%Y-%m-%d",
                            date : "$paidAt"
                        }
                    },
                    totalSales : { $sum : "$totalPrice" }
                }
            }
        ])
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

const getOrderById = async ( req , res) => {
    const { id } = req.params;
    try{
        //by populating the user field in the order we can get the user details along with the order details so that we can display the user details in the order details page
        const order = await Order.findById(id).populate("user" , "id username email");
        if(!order){
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}


const makeorderASPaid = async ( req , res) => {
    const { id } = req.params;
    const { status , update_time , email_address } = req.body;
    try{
        const order = await Order.findById      (id);
        if(!order){
            return res.status(404).json({ message: "Order not found" });
        }
        order.isPaid  = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id : id,
            status,
            update_time,
            email_address
        }
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

const makeorderASDelivered = async ( req , res) => {
    const { id } = req.params;
    try{
        const order = await Order.findById(id);
        if(!order){
            return res.status(404).json({ message: "Order not found" });
        }

        order.isDelivered  = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

//this is only for admin to cancel the order if the order is not paid yet
const cancelOrder = async ( req , res) => {
    const { id } = req.params;
    try{
        const order = await Order.findById(id);
        if(!order){
            return res.status(404).json({ message: "Order not found" });
        }
        if(order.isPaid){
            return res.status(400).json({ message: "Cannot cancel a paid order" });
        }
        await Order.deleteOne({ _id: order._id });
        res.status(200).json({ message: "Order cancelled successfully" });
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}
export {
    createOrder, getallorders, getuserOrder , TotalOrders , TotalSales , calcualteTotalSalesByDate , getOrderById , makeorderASPaid , makeorderASDelivered , cancelOrder
}
