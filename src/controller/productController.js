const order = require('../models/order');
const Product = require('../models/product');
const userModel = require('../models/user');
const { isEmpty } = require('lodash');
const {  ResponseHandler, ResponseObject } = require('../helper/responeHandler');

const addProduct = async (req, res) => {
    const response = { ...ResponseObject }; // clone responseObject

    try {
        const product = new Product(req.body);
        const saved = await product.save();
        response.code = 201;
        response.message = "Product created successfully";
        response.data = saved;
        return ResponseHandler(null, response, res);
    } catch (err) {
        response.code = 400;
        response.message = err.message;
        return ResponseHandler(err, response, res);
    }

}
const updateProduct = async (req, res) => {
    const response = { ...ResponseObject }; // clone responseObject

    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) {
            response.code = 404;
            response.message = "Product not found";
            return ResponseHandler("Product not found", response, res);
        }
        response.code = 200;
        response.message = "Product updated";
        response.data = updated;
        return ResponseHandler(null, response, res);
    } catch (err) {
        response.code = 400;
        response.message = err.message;
        return ResponseHandler(err, response, res);
    }
}

const getProducts = async (req, res) => {
    const response = { ...ResponseObject }; // clone responseObject

    // let response = {
    //     status: "error",
    //     code: "200",
    //     message: "",
    //     data: [],
    //     error: null
    // }
    // try {

    //     //populate user and product details
    //     // order.find().populate('userId',{email:1}).populate('productId').then(result => {
    //     //         response.status = 'success';
    //     //         response.data = result;
    //     //         return res.json(response);
    //     //     }).catch(err => {
    //     //         response.message = "Order is not found";
    //     //         response.error = err;
    //     //         return res.json(response);
    //     //     });


    //     let result = await order.aggregate([
    //         {
    //             $addFields: {
    //                 userIdObject: { $toObjectId: "$userId" },
    //                 productObject: { $toObjectId: "$productId" }
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: "users",
    //                 localField: "userIdObject",
    //                 foreignField: "_id",
    //                 as: "user"
    //             }
    //         }, {
    //             $lookup: {
    //                 from: "products",
    //                 localField: "productObject",
    //                 foreignField: "_id",
    //                 as: "product"
    //             }
    //         },
    //         {
    //             $unwind: "$product", // Unwind product array if it contains only one item
    //         },
    //         {
    //             $unwind: "$user" // Unwind product array if it contains only one item

    //         },
    //         {
    //             $group: {
    //                 _id: "$productId",
    //                 totalQuantity: { $sum: "$price" }, // Assuming `quantity` is the field representing product count
    //                 orders: { $push: "$$ROOT" } // Keep all order details
    //             }
    //         }
    //     ]);
    //     console.log(result, "__");
    //     // let result1 = await product.aggregate([
    //     //     {
    //     //         $addFields: {
    //     //             productObject: { $toObjectId: "$_id" }
    //     //         }
    //     //     },
    //     //     {
    //     //         $lookup: {
    //     //             from: "orders",
    //     //             localField: "_id",
    //     //             foreignField: "productObject",
    //     //             as: "orders",
    //     //         }
    //     //     }])
    //     if (result) {
    //         response.status = 'success';
    //         response.data = result;
    //         return res.json(response);
    //     }
    // } catch (error) {
    //     console.log(error, "____________+");

    // }
    try {
        const products = await Product.find();
        response.code = 200;
        response.message = "Product list fetched";
        response.data = products;
        return ResponseHandler(null, response, res);
    } catch (err) {
        response.code = 500;
        response.message = err.message;
        return ResponseHandler(err, response, res);
    }
}

const deleteProduct = async (req, res) => {
    const response = { ...ResponseObject }; // clone responseObject

    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) {
            response.code = 404;
            response.message = "Product not found";
            return ResponseHandler("Product not found", response, res);
        }
        response.code = 200;
        response.message = "Product deleted";
        response.data = deleted;
        return ResponseHandler(null, response, res);
    } catch (err) {
        response.code = 400;
        response.message = err.message;
        return ResponseHandler(err, response, res);
    }
}


module.exports = { addProduct, updateProduct, getProducts, deleteProduct };