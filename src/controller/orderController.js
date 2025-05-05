const order = require('../models/order');
const product = require('../models/product');
const userModel = require('../models/user');
const { isEmpty } = require('lodash');

const createOrder = async (req, res) => {
    let response = {
        status: "error",
        code: "200",
        message: "",
        data: [],
        error: null
    }

    order.create(req.body).then(result => {
        console.log(result, 'result');
        response.status = 'success';
        response.data = result;
        return res.json(response);

    }).catch(err => {
        response.message = "Order is added";
        response.error = err['errors'];
        return res.json(response);
    });

}


//get order
const getOrder = async (req, res) => {
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
        //     });


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

module.exports = { createOrder, getOrder };