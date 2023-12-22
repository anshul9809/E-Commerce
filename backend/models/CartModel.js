const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            count: Number,
            color: String,
            price: Number,
        }
    ],
    cartTotal: {
        type: Number
    },
    totalAfterDiscount: {
        type: Number,
    },
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model("Cart", CartSchema);