const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            count: Number,
            color: String,
        }
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: ["Not processed", "Cash on delievery", "Processing", "Dispatched", "Cancelled", "Delievered"],
    },
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }

},
{timestamps: true});

module.exports = mongoose.model("Order", OrderSchema);