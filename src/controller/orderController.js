const Order = require('../models/order');
const Product = require('../models/product');
const userModel = require('../models/user');
const { isEmpty } = require('lodash');

// Create Order
const createOrder = async (req, res) => {
    const response = { ...ResponseObject };
    try {
        const order = new Order(req.body);
        const saved = await order.save();
        response.code = 201;
        response.message = "Order placed successfully";
        response.data = saved;
        return ResponseHandler(null, response, res);
    } catch (err) {
        response.code = 400;
        response.message = err.message;
        return ResponseHandler(err, response, res);
    }
}

// Get All Orders
const getAllOrder = async (req, res) => {
    const response = { ...ResponseObject };
    try {
        const orders = await Order.find().populate('products.productId').populate('userId');
        response.code = 200;
        response.message = "Order list fetched successfully";
        response.data = orders;
        return ResponseHandler(null, response, res);
    } catch (err) {
        response.code = 500;
        response.message = err.message;
        return ResponseHandler(err, response, res);
    }
}

// Get Single Order by ID
const getOrder = async (req, res) => {
    const response = { ...ResponseObject };
    try {
        const order = await Order.findById(req.params.id).populate('products.productId').populate('userId');
        if (!order) {
            response.code = 404;
            response.message = "Order not found";
            return ResponseHandler("Order not found", response, res);
        }
        response.code = 200;
        response.message = "Order fetched successfully";
        response.data = order;
        return ResponseHandler(null, response, res);
    } catch (err) {
        response.code = 400;
        response.message = err.message;
        return ResponseHandler(err, response, res);
    }
}

// Update Order
const updateOrder = async (req, res) => {
    const response = { ...ResponseObject };
    try {
        const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!updated) {
            response.code = 404;
            response.message = "Order not found";
            return ResponseHandler("Order not found", response, res);
        }
        response.code = 200;
        response.message = "Order updated successfully";
        response.data = updated;
        return ResponseHandler(null, response, res);
    } catch (err) {
        response.code = 400;
        response.message = err.message;
        return ResponseHandler(err, response, res);
    }
}

// Delete Order
const deleteOrder = async (req, res) => {
    const response = { ...ResponseObject };
    try {
        const deleted = await Order.findByIdAndDelete(req.params.id);
        if (!deleted) {
            response.code = 404;
            response.message = "Order not found";
            return ResponseHandler("Order not found", response, res);
        }
        response.code = 200;
        response.message = "Order deleted successfully";
        response.data = deleted;
        return ResponseHandler(null, response, res);
    } catch (err) {
        response.code = 400;
        response.message = err.message;
        return ResponseHandler(err, response, res);
    }
}


//get order
const getOrder1 = async (req, res) => {
    let response = {
        status: "error",
        code: "200",
        message: "",
        data: [],
        error: null
    }
    try {

        //populate user and product details
        // order.find().populate('userId',{email:1}).populate('productId').then(result => {
        //         response.status = 'success';
        //         response.data = result;
        //         return res.json(response);
        //     }).catch(err => {
        //         response.message = "Order is not found";
        //         response.error = err;
        //         return res.json(response);
        //     }


        let result = await order.aggregate([
            {
                $addFields: {
                    userIdObject: { $toObjectId: "$userId" },
                    productObject: { $toObjectId: "$productId" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userIdObject",
                    foreignField: "_id",
                    as: "user"
                }
            }, {
                $lookup: {
                    from: "products",
                    localField: "productObject",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product", // Unwind product array if it contains only one item
            },
            {
                $unwind: "$user" // Unwind product array if it contains only one item

            },
            {
                $group: {
                    _id: "$productId",
                    totalQuantity: { $sum: "$price" }, // Assuming `quantity` is the field representing product count
                    orders: { $push: "$$ROOT" } // Keep all order details
                }
            }
        ]);
        console.log(result, "__");
        // let result1 = await product.aggregate([
        //     {
        //         $addFields: {
        //             productObject: { $toObjectId: "$_id" }
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "orders",
        //             localField: "_id",
        //             foreignField: "productObject",
        //             as: "orders",
        //         }
        //     }])
        if (result) {
            response.status = 'success';
            response.data = result;
            return res.json(response);
        }
    } catch (error) {
        console.log(error, "____________+");

    }
}

module.exports = { createOrder, getAllOrder, getOrder, updateOrder, deleteOrder };